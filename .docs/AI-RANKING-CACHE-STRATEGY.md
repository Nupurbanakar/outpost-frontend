# AI Ranking Cache Strategy Analysis

**Date:** October 26, 2026  
**Status:** 🔴 Cache Invalidation Not Implemented  
**Priority:** High - Affects AI ranking accuracy

## Current Situation

### ✅ What's Working

**1. AI Ranking Feature Exists**
- Founders can toggle AI ranking on Grants, Challenges, and Mentors pages
- Toggle state stored in localStorage: `outpost_ai_ranking_enabled`
- Frontend sends `ai=true` parameter to backend
- Backend returns results with `aiReason` field explaining relevance

**2. Profile Data Used for AI Ranking**
- Backend uses founder's profile (stage, sector, city) to rank results
- AI reasons show personalized explanations
- Only works for onboarded users (have stage + sector + startup name)

**Example AI Reasoning:**
```json
{
  "id": "grant-123",
  "title": "Seed Fund for Tech Startups",
  "aiReason": "Perfect match for early-stage tech startups in your sector. Located in your city with deadline approaching."
}
```

### ❌ What's NOT Working

**1. No Cache Invalidation on Profile Update**

When founder updates profile:
```typescript
// ProfilePage.tsx - Line ~120
await foundersApi.updateProfile(updateData);
await refreshUser(); // Updates user context
// ❌ AI-ranked lists are NOT refreshed
// ❌ Backend cache is NOT invalidated
```

**Result:**
- Founder changes stage from "Idea" to "Seed"
- AI rankings still show results for "Idea" stage
- Must manually refresh page or wait for cache TTL

**2. Backend Cache Persists After Updates**

Similar to the admin-founder sync issue (`.docs/ADMIN-FOUNDER-SYNC-ISSUE.md`), the backend likely caches:
- AI-ranked grant lists
- AI-ranked challenge lists
- AI-ranked mentor lists

These caches are NOT invalidated when:
- Founder updates profile (stage, sector, city, bio)
- Admin edits grant/challenge/mentor
- Eligibility criteria change

**3. No React Query Implementation**

```json
// package.json shows dependency installed:
"@tanstack/react-query": "^5.12.0"

// But grep shows: NO USAGE in codebase
// useQuery: 0 matches
// useMutation: 0 matches
// QueryClient: 0 matches
```

**Current approach:**
- Manual `useEffect` + `useState` in every component
- No automatic cache invalidation
- No background refetching
- No optimistic updates
- No request deduplication

## Technical Analysis

### Backend Caching (Suspected)

The backend likely implements something like:

```java
@Service
public class GrantService {
    
    @Cacheable(value = "grants-ai-ranked", key = "#founderId + '-' + #filters")
    public Page<Grant> getAIRankedGrants(String founderId, GrantFilters filters) {
        Founder founder = founderRepository.findById(founderId);
        List<Grant> grants = grantRepository.findAll(filters);
        
        // AI ranking logic (expensive)
        return aiService.rankGrantsForFounder(founder, grants);
    }
}
```

**Cache Key Includes:**
- ✅ Founder ID
- ✅ Filter parameters
- ❌ NOT profile version/timestamp
- ❌ NOT last-updated timestamp

**Result:** Stale rankings until cache expires (TTL)

### Frontend Data Flow

**Current Flow:**
```
1. User toggles AI ranking ON
   ↓
2. GrantsPage.fetchGrants()
   ↓
3. grantsApi.getGrants({ ai: true })
   ↓
4. Backend checks cache → HITS cached results
   ↓
5. Returns stale AI rankings (based on old profile)
```

**Problem:** Steps 2-5 have NO connection to profile updates

## Proposed Solutions

### Solution 1: Backend Cache Invalidation (Recommended) ✅

**Backend changes needed:**

```java
@Service
public class FounderService {
    
    @Autowired
    private CacheManager cacheManager;
    
    @CacheEvict(value = {
        "grants-ai-ranked",
        "challenges-ai-ranked", 
        "mentors-ai-ranked"
    }, key = "#founderId + '*'", allEntries = false)
    public Founder updateProfile(String founderId, ProfileUpdateRequest request) {
        Founder founder = founderRepository.findById(founderId);
        // Update logic...
        
        // Invalidate AI ranking caches for this founder
        evictFounderAICaches(founderId);
        
        return founderRepository.save(founder);
    }
    
    private void evictFounderAICaches(String founderId) {
        // Clear all AI-ranked caches for this founder
        Stream.of("grants-ai-ranked", "challenges-ai-ranked", "mentors-ai-ranked")
            .forEach(cacheName -> {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    cache.evict(founderId);
                }
            });
    }
}
```

**Benefits:**
- ✅ Automatic - no frontend changes needed
- ✅ Reliable - happens server-side
- ✅ Efficient - only evicts affected caches
- ✅ Covers all scenarios (profile update, admin edits, etc.)

**Frontend verification:**
```typescript
// After profile update, refetch AI-ranked data
await foundersApi.updateProfile(updateData);
await refreshUser();

// If AI ranking is enabled, refetch lists
if (aiEnabled) {
  await fetchGrants(); // Will get fresh AI rankings
}
```

### Solution 2: Frontend React Query (Better UX) ✅✅

**Implement React Query for automatic cache management:**

**Step 1: Setup QueryClient**

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
```

**Step 2: Wrap App**

```typescript
// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* existing app */}
    </QueryClientProvider>
  );
}
```

**Step 3: Create Query Hooks**

```typescript
// src/hooks/useGrants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { grantsApi, GrantsFilters } from '@/api/endpoints/grants';

export function useGrants(filters: GrantsFilters) {
  return useQuery({
    queryKey: ['grants', filters],
    queryFn: () => grantsApi.getGrants(filters),
    enabled: true,
  });
}

export function useInvalidateAIRankings() {
  const queryClient = useQueryClient();
  
  return () => {
    // Invalidate all AI-ranked queries
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        const filters = query.queryKey[1] as any;
        return filters?.ai === true;
      }
    });
  };
}
```

**Step 4: Use in Components**

```typescript
// src/pages/GrantsPage.tsx
export default function GrantsPage() {
  const filters = buildGrantsFilters(searchParams, currentPage);
  
  const { data, isLoading, error } = useGrants(filters);
  
  // No more manual useEffect + useState!
  
  return (
    <div>
      {isLoading && <GrantsLoadingSkeleton />}
      {error && <ErrorDisplay error={error} />}
      {data && <GrantsList grants={data.content} />}
    </div>
  );
}
```

**Step 5: Invalidate on Profile Update**

```typescript
// src/pages/ProfilePage.tsx
import { useInvalidateAIRankings } from '@/hooks/useGrants';

export default function ProfilePage() {
  const invalidateAIRankings = useInvalidateAIRankings();
  
  const handleSave = async () => {
    await foundersApi.updateProfile(updateData);
    await refreshUser();
    
    // Automatically refetch all AI-ranked lists
    invalidateAIRankings();
    
    toast.success('Profile updated! AI rankings refreshed.');
  };
}
```

**Benefits:**
- ✅ Automatic cache invalidation
- ✅ Background refetching
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ Better loading states
- ✅ Works even if backend doesn't invalidate

### Solution 3: Hybrid Approach (Best) ✅✅✅

**Combine both:**

1. **Backend invalidates caches** (reliability)
2. **Frontend uses React Query** (UX)
3. **Explicit invalidation on profile update** (immediate feedback)

```typescript
// src/pages/ProfilePage.tsx
const handleSave = async () => {
  // Update profile
  await foundersApi.updateProfile(updateData);
  await refreshUser();
  
  // Invalidate React Query caches
  invalidateAIRankings();
  
  // Show immediate feedback
  toast.success('Profile updated! Refreshing personalized recommendations...');
};
```

**Result:**
- ✅ Backend cache invalidated (reliable)
- ✅ Frontend queries refetch (immediate)
- ✅ Users see updated rankings within seconds
- ✅ No stale data issues

## Implementation Priority

### Phase 1: Quick Win (Frontend Only) 🎯

**Effort:** 2-3 hours  
**Impact:** Medium

1. Add explicit refetch after profile update:

```typescript
// src/pages/ProfilePage.tsx
const handleSave = async () => {
  await foundersApi.updateProfile(updateData);
  await refreshUser();
  
  // Clear AI preference to force refetch
  const hadAIEnabled = getAIPreference();
  if (hadAIEnabled) {
    // User will see fresh data next time they visit
    toast.success('Profile updated! Your personalized rankings will refresh on next page visit.');
  }
};
```

### Phase 2: React Query Migration 🚀

**Effort:** 1-2 days  
**Impact:** High

1. Setup QueryClient
2. Create query hooks for grants, challenges, mentors
3. Migrate pages to use hooks
4. Add invalidation on profile update
5. Remove manual useEffect/useState patterns

### Phase 3: Backend Cache Eviction 💎

**Effort:** Backend team (2-3 hours)  
**Impact:** High

1. Add `@CacheEvict` annotation to profile update
2. Evict AI-ranked caches on admin edits
3. Add cache version/timestamp to keys

## Testing Checklist

### Manual Test Flow

1. **Setup:**
   - Login as founder
   - Complete onboarding (Idea stage, EdTech sector, Bangalore)
   - Enable AI ranking on Grants page
   - Note top 3 grants shown

2. **Update Profile:**
   - Change stage to "Seed"
   - Change sector to "FinTech"
   - Save profile

3. **Verify Refresh:**
   - ✅ Navigate to Grants page
   - ✅ AI rankings should update immediately (or show loading)
   - ✅ aiReason should reflect new stage/sector
   - ✅ Different grants should appear at top

4. **Cross-Page Verification:**
   - ✅ Challenges page AI rankings updated
   - ✅ Mentors page AI rankings updated
   - ✅ Spotlight section on Discover page updated

### Automated Tests

```typescript
// tests/ai-ranking-cache.spec.ts
describe('AI Ranking Cache Invalidation', () => {
  test('should refresh AI rankings after profile update', async () => {
    // Setup
    await login('founder@test.com');
    await completeOnboarding({ stage: 'IDEA', sector: 'EDTECH' });
    
    // Get initial rankings
    const initialGrants = await getGrants({ ai: true });
    const initialTopGrant = initialGrants[0].id;
    
    // Update profile
    await updateProfile({ stageId: 'SEED', sectorId: 'FINTECH' });
    
    // Get new rankings
    const newGrants = await getGrants({ ai: true });
    const newTopGrant = newGrants[0].id;
    
    // Verify rankings changed
    expect(newTopGrant).not.toBe(initialTopGrant);
    expect(newGrants[0].aiReason).toContain('Seed');
    expect(newGrants[0].aiReason).toContain('FinTech');
  });
});
```

## Related Issues

- `.docs/ADMIN-FOUNDER-SYNC-ISSUE.md` - Similar cache problem for admin edits
- `.docs/BACKEND-ISSUE-CHALLENGES-FILTERS.md` - Backend filtering issues
- `.docs/BACKEND-ISSUE-MENTORS-FILTERS.md` - Mentor filtering problems

All these share the same root cause: **Backend cache invalidation not implemented**

## Recommendation

**Immediate:** Implement Phase 1 (quick frontend fix)  
**Next Sprint:** Implement Phase 2 (React Query migration)  
**Backend Team:** Implement Phase 3 (cache eviction)

**Combined effort:** Will solve this issue AND the admin-founder sync issue comprehensively.

## Questions for Backend Team

1. Is AI ranking result caching enabled? What's the TTL?
2. What cache keys are used for AI-ranked queries?
3. Can you add cache eviction on profile updates?
4. Can you add cache eviction on admin edits (grants/challenges/mentors)?
5. Should we add a `profileVersion` field to cache keys?

---

**Status:** Awaiting backend cache eviction implementation  
**Workaround:** Manual page refresh shows updated rankings  
**Long-term:** React Query + backend eviction = seamless UX
