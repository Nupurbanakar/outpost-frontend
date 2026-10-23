# Backend Issue: Challenge Status Filters Not Working

## Problem Statement

Frontend is correctly sending the `status` filter parameter to `/api/v1/admin/challenges` endpoint, but backend returns all challenges regardless of the status filter applied (ALL/OPEN/CLOSED).

## Evidence

### Frontend Implementation Status

✅ **Frontend correctly:**
- Passes `status` parameter to API (`OPEN` or `CLOSED`, or `undefined` for ALL)
- Sends parameters via URLSearchParams
- Triggers re-fetch when status filter changes
- Shows filter tabs with proper UI state

### Debug Logging Added

Enhanced debug logging has been added to trace the complete request flow:

**Location 1: AdminChallengesPage.tsx**
```javascript
console.log('📋 [AdminChallengesPage] Fetching challenges with filters:', {
  statusFilter,
  statusToSend: statusFilter === 'ALL' ? undefined : statusFilter,
  page: currentPage - 1,
  size: pageSize,
});
```

**Location 2: api/endpoints/admin/challenges.ts**
```javascript
console.log('🔍 [Challenges Filter Debug] Filters received:', filters);
console.log('🔍 [Challenges Filter Debug] URLSearchParams:', params.toString());
console.log('🔍 [Challenges Filter Debug] Full URL:', `/admin/challenges?${params.toString()}`);
```

**Location 3: api/client.ts (Request Interceptor)**
```javascript
console.log('🌐 [API Client] Outgoing request:', {
  url: config.url,
  method: config.method,
  params: config.params,
  paramsAsString: config.params.toString(),
  fullURL: `${config.baseURL}${config.url}?${params.toString()}`
});
```

### Test Cases

#### Test Case 1: Filter by OPEN
**Filters sent by frontend:**
```
GET /api/v1/admin/challenges?status=OPEN&page=0&size=20
```

**Expected:** Only return challenges with `status: "OPEN"`
**Actual:** Returns ALL challenges (both OPEN and CLOSED)

#### Test Case 2: Filter by CLOSED
**Filters sent by frontend:**
```
GET /api/v1/admin/challenges?status=CLOSED&page=0&size=20
```

**Expected:** Only return challenges with `status: "CLOSED"`
**Actual:** Returns ALL challenges (both OPEN and CLOSED)

#### Test Case 3: Show ALL (no filter)
**Filters sent by frontend:**
```
GET /api/v1/admin/challenges?page=0&size=20
```
(Note: status parameter is omitted when "ALL" is selected)

**Expected:** Return all challenges regardless of status
**Actual:** ✅ Works correctly (returns all)

## Missing Backend Implementation

The backend endpoint `/api/v1/admin/challenges` needs to implement status filtering.

### Required Implementation

**Endpoint:** `GET /api/v1/admin/challenges`

**Query Parameter:**
```
status: 'OPEN' | 'CLOSED' (optional)
```

**Expected Logic:**
- If `status` parameter is provided → Return only challenges matching that status
- If `status` parameter is omitted/null → Return all challenges

**Example Spring Boot Implementation:**
```java
@GetMapping("/admin/challenges")
public ResponseEntity<Page<ChallengeDTO>> listChallenges(
    @RequestParam(required = false) ChallengeStatus status,
    @RequestParam(required = false) String sectorId,
    @RequestParam(required = false) String theme,
    Pageable pageable
) {
    Page<Challenge> challenges;
    
    if (status != null) {
        challenges = challengeRepository.findByStatus(status, pageable);
    } else {
        challenges = challengeRepository.findAll(pageable);
    }
    
    return ResponseEntity.ok(challenges.map(this::toDTO));
}
```

**Example JPA Repository Method:**
```java
@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {
    Page<Challenge> findByStatus(ChallengeStatus status, Pageable pageable);
}
```

## API Contract

### Request
```
GET /api/v1/admin/challenges
Query Parameters:
  - status: 'OPEN' | 'CLOSED' (optional, if omitted returns all)
  - sectorId: string (UUID, optional)
  - theme: string (optional)
  - page: number (0-indexed)
  - size: number
```

### Response (Current - Structure is Correct)
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "string",
      "corporateName": "string",
      "corporateLogo": "string",
      "sector": {
        "id": "uuid",
        "name": "string"
      },
      "theme": "string",
      "deadline": "YYYY-MM-DD",
      "problemStatement": "string",
      "whatTheyAreLookingFor": "string",
      "eligibilityCriteria": "string",
      "timeline": "string",
      "offerType": "PILOT" | "POC" | "PARTNERSHIP",
      "applyUrl": "string",
      "status": "OPEN" | "CLOSED",
      "createdAt": "ISO timestamp",
      "updatedAt": "ISO timestamp"
    }
  ],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 10,
    "totalPages": 1
  },
  "totalElements": 10
}
```

## Test URLs to Implement

1. **No status filter (baseline):**
   ```
   GET /api/v1/admin/challenges?page=0&size=20
   → Should return ALL challenges (OPEN + CLOSED)
   ```

2. **Filter by OPEN:**
   ```
   GET /api/v1/admin/challenges?status=OPEN&page=0&size=20
   → Should return ONLY challenges with status=OPEN
   ```

3. **Filter by CLOSED:**
   ```
   GET /api/v1/admin/challenges?status=CLOSED&page=0&size=20
   → Should return ONLY challenges with status=CLOSED
   ```

4. **Combined filters:**
   ```
   GET /api/v1/admin/challenges?status=OPEN&sectorId=uuid&page=0&size=20
   → Should return OPEN challenges in specified sector
   ```

## How to Test

### Using Browser Console (with debug logging):
1. Navigate to `/admin/challenges`
2. Open browser DevTools console
3. Click on "OPEN" tab
4. Check console output:
   ```
   📋 [AdminChallengesPage] Fetching challenges with filters
   🔍 [Challenges Filter Debug] URLSearchParams: status=OPEN&page=0&size=20
   🌐 [API Client] Outgoing request
   ✅ [Challenges Filter Debug] Response received
   ```
5. Verify if returned challenges all have `status: "OPEN"`

### Using Backend Logs:
1. Enable SQL logging in Spring Boot (`spring.jpa.show-sql=true`)
2. Check if WHERE clause includes status filter
3. Expected SQL: `WHERE status = 'OPEN'`
4. Actual SQL (likely): No WHERE clause or status condition ignored

### Using Network Tab:
1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Click "OPEN" tab
4. Find request to `/admin/challenges`
5. Check "Query String Parameters" in request details
6. Should see: `status: OPEN`

## Related Endpoints

The same status filtering issue may affect other admin endpoints:
- ❓ `/api/v1/admin/grants` - Should check if status filter works
- ❓ `/api/v1/admin/mentors` - Known to have filter issues (see BACKEND-ISSUE-MENTORS-FILTERS.md)

## Priority

**MEDIUM-HIGH** - Admin users cannot efficiently manage challenges by status. This affects content management workflow.

## Current Status

- ✅ **Frontend:** Fully implemented with debug logging
- ❌ **Backend:** Status filter parameter is ignored

## Notes

- The `/admin/challenges/{id}/open` and `/admin/challenges/{id}/close` endpoints work correctly (they change status)
- The issue is specifically with the LIST/GET endpoint not filtering by status
- Other filter parameters (sectorId, theme) may have the same issue and should be tested
- Pagination works correctly (page/size parameters are respected)

## Related Files

**Frontend:**
- `src/pages/admin/AdminChallengesPage.tsx` - UI and filter logic
- `src/api/endpoints/admin/challenges.ts` - API client
- `src/api/client.ts` - HTTP interceptor with debug logging

**Backend (needs implementation):**
- Controller: `/admin/challenges` GET endpoint
- Repository: Add `findByStatus()` method if using JPA
- Service: Add status filtering logic
