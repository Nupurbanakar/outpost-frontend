# Mentors Filters Debug Guide

## How to Test Filters

### 1. Open Mentors Page
Navigate to `/mentors`

### 2. Open Browser Console
Press F12 or Right-click → Inspect → Console tab

### 3. Test Each Filter

#### Test Search
1. Type something in the search box
2. Check console logs:
   - `🔍 Mentors filters being sent:` should show `q: "your search term"`
   - Check the network tab: `GET /api/v1/mentors?status=APPROVED&q=yourterm...`

#### Test Expertise Filter
1. Check one or more expertise boxes (Product, Engineering, etc.)
2. Check console logs:
   - `expertise: ["Product", "Engineering"]`
3. Check network tab:
   - URL should have: `expertise=Product&expertise=Engineering`

#### Test Stage Filter
1. Select a stage from dropdown
2. Check console logs:
   - `stageId: "some-uuid"`
3. Check network tab:
   - URL should have: `stageId=some-uuid`

#### Test Sector Filter
1. Select a sector from dropdown
2. Check console logs:
   - `sectorId: "some-uuid"`
3. Check network tab:
   - URL should have: `sectorId=some-uuid`

#### Test AI Toggle
1. Check the "AI-Ranked Results" checkbox
2. Check console logs:
   - `ai: true`
3. Check network tab:
   - URL should have: `ai=true`

## What to Check in Network Tab

Open Network tab → Filter by "Fetch/XHR" → Look for request to `/mentors`

**Example working request:**
```
GET /api/v1/mentors?status=APPROVED&expertise=Product&expertise=Sales&stageId=abc-123&sectorId=def-456&q=founder&ai=true&page=0&size=12
```

## Common Issues

### Issue 1: Filters don't change results
**Check:**
- Does the network request URL include your filter parameters?
- Does the backend API support these filter parameters?
- Check backend logs for errors

**Frontend is working correctly if:**
- Console shows correct filter values
- Network tab shows correct URL parameters
- Problem is likely in backend if above are true

### Issue 2: Expertise filter doesn't work
**Backend must support:**
- Multiple `expertise` query parameters: `expertise=Product&expertise=Sales`
- OR comma-separated: `expertise=Product,Sales`

**Check backend API documentation for expected format**

### Issue 3: Results count doesn't change
- Backend might not be filtering correctly
- Check if backend returns different results for different filters
- Test directly with curl/Postman to isolate issue

## Frontend Code Locations

- **MentorsPage**: `src/pages/MentorsPage.tsx`
  - Handles filter state and API calls
  - Lines 32-61: Filter parsing and API call

- **MentorsFiltersPanel**: `src/components/mentors/MentorsFilters.tsx`
  - UI for filter controls
  - Lines 44-49: Expertise multi-select logic

- **Mentors API**: `src/api/endpoints/mentors.ts`
  - API client that sends requests
  - Lines 42-59: Parameter building logic

## Next Steps

1. **Test filters and check console logs**
2. **Verify network requests have correct parameters**
3. **If frontend sends correct params → Backend issue**
4. **If frontend doesn't send correct params → Let me know what's wrong**
