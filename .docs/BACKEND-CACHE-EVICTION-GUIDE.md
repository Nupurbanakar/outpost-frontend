# Backend Cache Eviction Implementation Guide

**Date:** October 26, 2026  
**Priority:** High  
**For:** Backend Team  
**Related:** `.docs/AI-RANKING-CACHE-STRATEGY.md`, `.docs/ADMIN-FOUNDER-SYNC-ISSUE.md`

## Overview

The backend needs to implement cache eviction for AI-ranked queries when founder profiles are updated. This ensures personalized rankings stay fresh and accurate.

## Current Frontend Implementation

**Status:** ✅ Frontend Ready

The frontend now uses React Query and automatically invalidates AI-ranked caches on profile updates:

```typescript
// After profile update:
await foundersApi.updateProfile(data);
invalidateAIRankings(); // Triggers refetch from backend

// User sees: "Profile updated! Your personalized rankings are being refreshed..."
```

**Frontend will refetch fresh data immediately** - but backend must invalidate its cache first!

## Backend Requirements

### 1. Add Cache Eviction on Profile Update

When a founder updates their profile, evict AI-ranked caches for that founder.

#### Spring Boot Implementation

**File:** `FounderService.java`

```java
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

@Service
public class FounderService {
    
    @Autowired
    private CacheManager cacheManager;
    
    /**
     * Update founder profile and evict AI-ranked caches
     */
    @Caching(evict = {
        @CacheEvict(value = "grants-ai-ranked", key = "#founderId"),
        @CacheEvict(value = "challenges-ai-ranked", key = "#founderId"),
        @CacheEvict(value = "mentors-ai-ranked", key = "#founderId")
    })
    public Founder updateProfile(String founderId, ProfileUpdateRequest request) {
        Founder founder = founderRepository.findById(founderId)
            .orElseThrow(() -> new NotFoundException("Founder not found"));
        
        // Update bio
        if (request.getBio() != null) {
            founder.setBio(request.getBio());
        }
        
        // Update links
        if (request.getLinks() != null) {
            founder.setLinks(request.getLinks());
        }
        
        Founder updated = founderRepository.save(founder);
        
        // Log cache eviction for monitoring
        log.info("Evicted AI-ranked caches for founder: {}", founderId);
        
        return updated;
    }
}
```

#### Alternative: Manual Cache Eviction

If annotations don't cover all cache keys:

```java
@Service
public class FounderService {
    
    @Autowired
    private CacheManager cacheManager;
    
    public Founder updateProfile(String founderId, ProfileUpdateRequest request) {
        // Update logic...
        Founder updated = founderRepository.save(founder);
        
        // Manually evict all AI-ranked caches for this founder
        evictFounderAICaches(founderId);
        
        return updated;
    }
    
    private void evictFounderAICaches(String founderId) {
        List<String> cacheNames = Arrays.asList(
            "grants-ai-ranked",
            "challenges-ai-ranked",
            "mentors-ai-ranked"
        );
        
        for (String cacheName : cacheNames) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                // Evict all entries for this founder
                // Cache key format: founderId + filters
                cache.evict(founderId);
                
                // If using composite keys, iterate and evict matching entries
                // cache.getNativeCache().entrySet().removeIf(entry -> 
                //     entry.getKey().toString().startsWith(founderId)
                // );
            }
        }
        
        log.info("Evicted {} AI-ranked caches for founder: {}", cacheNames.size(), founderId);
    }
}
```

### 2. Cache Key Structure

**Current assumption:** Cache keys include founder ID

```
Cache Key: {founderId}-{filterHash}
Example: "founder-123-page0-size20-aiTrue"
```

**If cache keys DON'T include founder ID:**

You need to:
1. Add founder ID to cache keys, OR
2. Clear ALL AI-ranked caches (less efficient)

```java
@CacheEvict(value = "grants-ai-ranked", allEntries = true)
public Founder updateProfile(String founderId, ProfileUpdateRequest request) {
    // This clears ALL founder caches, not just one founder
    // Less efficient but simpler
}
```

### 3. Add Cache Eviction on Admin Edits

**Also evict caches when admins edit grants/challenges/mentors:**

```java
@Service
public class AdminGrantService {
    
    @CacheEvict(value = "grants-ai-ranked", allEntries = true)
    public Grant updateGrant(String grantId, GrantUpdateRequest request) {
        // Update grant...
        
        // All founders' AI-ranked grant caches are now invalid
        log.info("Evicted all AI-ranked grant caches after admin edit");
        
        return updated;
    }
}
```

**Why:** When admin changes grant eligibility (stages, sectors, amounts), AI rankings for ALL founders may change.

### 4. Monitoring & Logging

Add logging to track cache evictions:

```java
import org.springframework.boot.actuate.metrics.MeterRegistry;

@Service
public class FounderService {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    private void evictFounderAICaches(String founderId) {
        // Eviction logic...
        
        // Track metrics
        meterRegistry.counter("cache.eviction.ai_rankings", 
            "founder_id", founderId,
            "reason", "profile_update"
        ).increment();
        
        log.info("Evicted AI-ranked caches for founder: {} (reason: profile_update)", founderId);
    }
}
```

**Monitor these metrics:**
- Cache eviction frequency
- Cache hit/miss rates after eviction
- Time between profile update and next AI query

## Testing

### Unit Test

```java
@SpringBootTest
class FounderServiceTest {
    
    @Autowired
    private FounderService founderService;
    
    @Autowired
    private CacheManager cacheManager;
    
    @Test
    void testProfileUpdate_EvictsAICaches() {
        // Given: Cached AI-ranked grants for founder
        String founderId = "founder-123";
        Cache grantsCache = cacheManager.getCache("grants-ai-ranked");
        grantsCache.put(founderId, /* mock data */);
        
        assertThat(grantsCache.get(founderId)).isNotNull();
        
        // When: Profile updated
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setBio("New bio");
        founderService.updateProfile(founderId, request);
        
        // Then: Cache evicted
        assertThat(grantsCache.get(founderId)).isNull();
    }
}
```

### Integration Test Flow

```bash
# 1. Founder completes onboarding
curl -X POST http://localhost:8080/api/v1/me/onboarding \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "founderName": "Test Founder",
    "startupName": "TestCo",
    "stageId": "stage-idea",
    "sectorId": "sector-edtech",
    "city": "Bangalore"
  }'

# 2. Get AI-ranked grants (cached)
curl http://localhost:8080/api/v1/grants?ai=true \
  -H "Authorization: Bearer $TOKEN"
# Response: Grants for Idea stage + EdTech sector

# 3. Update profile to Seed stage + FinTech
curl -X PATCH http://localhost:8080/api/v1/me/profile \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bio": "Now in FinTech space"
  }'

# Backend should: Evict AI-ranked caches for this founder

# 4. Get AI-ranked grants again (fresh, not cached)
curl http://localhost:8080/api/v1/grants?ai=true \
  -H "Authorization: Bearer $TOKEN"
# Response: DIFFERENT grants (Seed stage + FinTech sector)

# 5. Verify aiReason reflects new profile
# aiReason should mention "Seed stage" and "FinTech"
```

## Configuration

### Cache Configuration

```yaml
# application.yml
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=1000,expireAfterWrite=10m
    cache-names:
      - grants-ai-ranked
      - challenges-ai-ranked
      - mentors-ai-ranked

logging:
  level:
    org.springframework.cache: DEBUG  # Log cache operations
```

## Performance Considerations

### Before Cache Eviction

```
Profile Update → Backend saves → Cache stays stale
Next AI Query → Returns cached (old) results → ❌ Wrong rankings
```

**Time to Fresh Data:** TTL duration (5-30 minutes)

### After Cache Eviction

```
Profile Update → Backend saves → Evict caches
Next AI Query → Cache miss → Compute fresh rankings → ✅ Correct rankings
```

**Time to Fresh Data:** ~1-2 seconds (one query latency)

### Impact on AI Service

**Concern:** More cache misses = more AI service calls = higher cost?

**Solution:** Use short TTL for AI-ranked caches (2-5 minutes)

```java
@Cacheable(value = "grants-ai-ranked", unless = "#result == null")
@CacheExpire(duration = 2, unit = TimeUnit.MINUTES) // Custom annotation
public Page<Grant> getAIRankedGrants(String founderId, GrantFilters filters) {
    // AI ranking logic
}
```

**Result:**
- Cache eviction only affects one founder
- Fresh rankings computed once per founder per session
- AI service load increase: Minimal (~5-10% for active users)

## Rollout Plan

### Phase 1: Add Cache Eviction (Immediate) ✅

1. Add `@CacheEvict` annotations to profile update
2. Deploy to staging
3. Test with frontend team
4. Deploy to production

**Estimated Effort:** 2-3 hours

### Phase 2: Add Monitoring (Week 1) 📊

1. Add cache metrics (hit rate, eviction count)
2. Add logging for cache operations
3. Set up alerts for high eviction rates
4. Monitor AI service load

**Estimated Effort:** 4-6 hours

### Phase 3: Optimize Cache Keys (Week 2) ⚡

1. Review cache key structure
2. Consider adding version to cache keys
3. Implement cache warming for common queries
4. Add cache preloading on profile update

**Estimated Effort:** 1 day

## Checklist for Backend Team

- [ ] Add `@CacheEvict` to `FounderService.updateProfile()`
- [ ] Add cache eviction to admin grant/challenge/mentor updates
- [ ] Verify cache key structure includes founder ID
- [ ] Add logging for cache evictions
- [ ] Write unit tests for cache eviction
- [ ] Test integration with frontend (profile update → fresh rankings)
- [ ] Deploy to staging and verify with QA
- [ ] Monitor cache hit rates after deployment
- [ ] Document cache TTL and eviction strategy in wiki

## Questions & Answers

**Q: What if cache keys use complex filters (page, size, sort)?**

A: Use wildcard eviction or evict all entries for that founder:

```java
cache.getNativeCache().keySet().stream()
    .filter(key -> key.toString().startsWith(founderId))
    .forEach(cache::evict);
```

**Q: Should we evict on every profile field change?**

A: Only if field affects AI ranking:
- ✅ Stage change → Evict
- ✅ Sector change → Evict  
- ✅ City change → Evict
- ❌ Bio change → No eviction needed (doesn't affect ranking logic)
- ❌ Links change → No eviction needed

**Q: What about onboarding?**

A: Onboarding is first-time profile creation, no existing cache to evict. Cache will be populated on first AI query.

## Success Metrics

### Before Implementation

- ❌ Profile update → Rankings stale for 5-30 minutes
- ❌ User confusion: "Why isn't AI using my new profile?"
- ❌ Support tickets about stale recommendations

### After Implementation

- ✅ Profile update → Rankings fresh in <2 seconds
- ✅ User sees: "Refreshing personalized rankings..."
- ✅ AI reasons immediately reflect new profile
- ✅ Zero support tickets about staleness

## Related Documentation

- `.docs/AI-RANKING-CACHE-STRATEGY.md` - Full strategy analysis
- `.docs/ADMIN-FOUNDER-SYNC-ISSUE.md` - Similar cache issue with admin edits

---

**Status:** Ready for Implementation  
**Frontend Status:** ✅ Implemented (commit 8af8f6c)  
**Waiting On:** Backend cache eviction implementation
