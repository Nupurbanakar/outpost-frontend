# API Integration Issues Found During Manual Testing

## Issues Discovered

### 1. Profile Update Endpoint Mismatch ❌
**Frontend Expected:** `PATCH /api/v1/me`  
**Backend Actual:** `PATCH /api/v1/me/profile`  
**Status:** Fixed

### 2. Profile Update Method Mismatch ❌
**Frontend Expected:** `PUT` then `PATCH /me`  
**Backend Actual:** `PATCH /api/v1/me/profile`  
**Status:** Fixed

### 3. Profile Update Request Body Mismatch ❌
**Frontend Sends:**
```json
{
  "founderName": "...",
  "startupName": "...",
  "city": "...",
  "stageId": "...",
  "sectorId": "...",
  "bio": "...",
  "linkedInUrl": "...",
  "twitterUrl": "..."
}
```

**Backend Expects:**
```json
{
  "bio": "string",
  "links": [
    { "type": "LINKEDIN", "url": "..." },
    { "type": "TWITTER", "url": "..." },
    { "type": "WEBSITE", "url": "..." }
  ]
}
```

**Status:** Fixed structure, but still getting 400 error

**Current Payload Sent:**
```json
{
  "bio": "",
  "links": [
    { "type": "LINKEDIN", "url": "https://linkedin.com/nupur" },
    { "type": "WEBSITE", "url": "https://example.com" }
  ]
}
```

**Error:** `MALFORMED_REQUEST` - Need to check exact backend validation rules

### 4. Pitch Deck Endpoint Not Implemented ⚠️
**Endpoint:** `GET /api/v1/me/pitch-deck`  
**Status:** Returns 404, endpoint may not be implemented  
**Resolution:** Silenced 404 errors in frontend

## Root Cause

The frontend was built based on **assumed API contracts** without:
1. OpenAPI/Swagger specification from backend
2. API contract testing
3. Integration testing against real backend

## Lessons Learned

### E2E Tests Limitations
Our E2E tests use **mocked APIs**, which means:
- ✅ They test frontend UI logic
- ✅ They test user flows
- ✅ They test error handling patterns
- ❌ They don't catch API contract mismatches
- ❌ They don't catch backend validation issues

### What We Need

#### 1. API Contract Testing
- Use backend's OpenAPI spec as source of truth
- Generate TypeScript types from OpenAPI
- Validate requests/responses match spec

**Tools:**
- `openapi-typescript` - Generate TS types from OpenAPI
- `openapi-typescript-codegen` - Generate API client from spec
- Swagger Codegen

#### 2. Integration Tests
Run tests against real backend (or backend test instance):

```typescript
// integration-tests/profile.spec.ts
test('should update profile bio and links', async () => {
  // Use REAL API, not mocks
  const response = await fetch('http://localhost:8080/api/v1/me/profile', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${realToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bio: 'Test bio',
      links: [{ type: 'LINKEDIN', url: 'https://linkedin.com/test' }]
    })
  });
  
  expect(response.status).toBe(200);
});
```

#### 3. Contract-First Development
1. Backend publishes OpenAPI spec
2. Frontend generates types and client from spec
3. Both sides validate against spec
4. Contract tests ensure compliance

## Action Items

### Immediate (To Fix Current Issue)
- [ ] Check Swagger UI for exact request body format
- [ ] Verify URL format requirements (full URL vs path)
- [ ] Check if bio can be empty string or must have content
- [ ] Test with Swagger UI "Try it out" feature first

### Short-term
- [ ] Get OpenAPI spec from backend team
- [ ] Generate TypeScript types from spec
- [ ] Update all API endpoints to match spec
- [ ] Add integration test suite

### Long-term
- [ ] Set up contract testing (Pact or similar)
- [ ] CI/CD integration test stage
- [ ] Automated API drift detection

## Current Status

**Working:**
- ✅ Login/Signup flow
- ✅ Email verification redirect
- ✅ Error handling
- ✅ Navigation
- ✅ UI components

**Blocked:**
- ❌ Profile update (API format mismatch)
- ❌ Pitch deck upload (endpoint may not exist)

**Next Step:**
Check Swagger UI for exact expected format and validation rules.
