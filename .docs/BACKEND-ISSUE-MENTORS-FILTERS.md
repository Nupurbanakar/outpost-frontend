# Backend Issue: Mentors Filters Not Working

## Problem Statement

Frontend is correctly sending filter parameters to `/api/v1/mentors` endpoint, but backend returns all mentors regardless of filters applied.

## Evidence

### Test Case: Filter by Expertise
**Filters sent by frontend:**
```json
{
  "expertise": ["Product", "Engineering"],
  "page": 0,
  "size": 12
}
```

**Backend response:**
Returns ALL 6 mentors, including those with empty expertise arrays.

```json
{
  "content": [
    {
      "name": "Anjali Reddy",
      "expertise": []  // ← Empty, should NOT match filter
    },
    {
      "name": "Karthik Iyer", 
      "expertise": []  // ← Empty, should NOT match filter
    },
    {
      "name": "Nupur Banakar",
      "expertise": ["Engineering"]  // ← Matches! Should be returned
    },
    // ... 3 more with empty expertise arrays
  ]
}
```

**Expected:** Only return "Nupur Banakar" (has Engineering expertise)
**Actual:** All 6 mentors returned

## Missing Backend Implementation

The backend endpoint `/api/v1/mentors` needs to implement these filters:

### 1. Expertise Filter (Multi-value)
```
GET /api/v1/mentors?expertise=Product&expertise=Engineering
```

**Logic:** Return mentors where their `expertise` array contains ANY of the requested values (OR condition).

**Example JPA/SQL:**
```java
// If using JPA with array column
@Query("SELECT m FROM Mentor m WHERE :expertise IS NULL OR :expertise MEMBER OF m.expertise")
List<Mentor> findByExpertise(@Param("expertise") List<String> expertise);

// Or if using native SQL with PostgreSQL arrays
WHERE expertise && ARRAY[:expertise]::text[]  // Array overlap operator
```

### 2. Stage Filter
```
GET /api/v1/mentors?stageId=uuid-here
```

**Logic:** Return mentors who have experience with this stage.

### 3. Sector Filter
```
GET /api/v1/mentors?sectorId=uuid-here
```

**Logic:** Return mentors who have experience in this sector.

### 4. Keyword Search
```
GET /api/v1/mentors?q=product
```

**Logic:** Search in `name`, `headline`, and `bio` fields.

### 5. AI Ranking
```
GET /api/v1/mentors?ai=true
```

**Logic:** If user is onboarded, rank mentors by relevance to user's profile.

## Current Status

✅ **Frontend implementation:** Complete and correct
❌ **Backend implementation:** Filters are ignored, all mentors returned

## API Contract

### Request
```
GET /api/v1/mentors
Query Parameters:
  - status: APPROVED (always sent by frontend)
  - expertise: string[] (multi-value, e.g., expertise=Product&expertise=Sales)
  - stageId: string (UUID)
  - sectorId: string (UUID)
  - q: string (keyword search)
  - ai: boolean
  - page: number (0-indexed)
  - size: number
```

### Response (Current - Correct)
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "string",
      "headline": "string",
      "expertise": ["string"],  // Array of expertise areas
      "photoUrl": "string",
      "aiReason": "string | null"
    }
  ],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 6,
    "totalPages": 1
  },
  "aiApplied": false
}
```

## Test URLs to Implement

1. **No filters (baseline):**
   ```
   GET /api/v1/mentors?status=APPROVED
   → Should return all 6 mentors
   ```

2. **Filter by single expertise:**
   ```
   GET /api/v1/mentors?status=APPROVED&expertise=Engineering
   → Should return only Nupur Banakar (has Engineering in expertise array)
   ```

3. **Filter by multiple expertise (OR):**
   ```
   GET /api/v1/mentors?status=APPROVED&expertise=Product&expertise=Engineering
   → Should return mentors with Product OR Engineering in expertise array
   ```

4. **Keyword search:**
   ```
   GET /api/v1/mentors?status=APPROVED&q=product
   → Should return mentors with "product" in name, headline, or bio
   ```

5. **Combined filters:**
   ```
   GET /api/v1/mentors?status=APPROVED&expertise=Product&stageId=uuid&q=ceo
   → Should return mentors matching ALL conditions (AND)
   ```

## Priority

**HIGH** - Users cannot effectively find relevant mentors without working filters.

## Notes

- Most mentors in the database have empty `expertise: []` arrays. These need to be populated with actual expertise data for filters to be useful.
- Same issue likely affects Grants and Challenges filters - should verify those endpoints too.
