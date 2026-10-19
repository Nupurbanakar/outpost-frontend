# Backend Issue: UUID Parsing Error on Onboarding

## Issue Summary

**Error:** `java.lang.IllegalArgumentException: Invalid UUID string: nupurbanakar@gmail.com`

**Location:** Onboarding API endpoint (`POST /api/v1/me/onboarding`)

**Symptom:** When a user tries to complete onboarding after resetting their password and logging in, the backend throws an error trying to parse the user's email as a UUID.

---

## Root Cause Analysis

The backend is attempting to parse the **user's email address** as a UUID, when it should be extracting the **user ID** from the JWT token.

### Frontend (Correct)

The frontend is sending the correct data:

```json
{
  "founderName": "Nupur Banakar",
  "startupName": "Acme Inc",
  "stageId": "483eb357-557b-469d-96a4-933d710f3611",  ← Valid UUID
  "sectorId": "771e391f-8309-40d2-b790-eef4eee368d3", ← Valid UUID
  "city": "Pune",
  "website": "https://www.example.com"
}
```

**Authentication:**
- Access token is correctly sent via `Authorization: Bearer <token>` header
- Token contains user information

### Backend (Incorrect)

The backend controller is likely doing something like this:

```java
// ❌ WRONG - Trying to parse email as UUID
UUID userId = UUID.fromString(userEmail); // This fails!

// ✅ CORRECT - Should extract UUID from JWT
UUID userId = jwtService.getUserIdFromToken(token);
```

---

## Hypothesis

The backend's JWT token extraction logic might be:

1. **Returning the wrong claim** - Extracting `email` instead of `sub` (subject/user ID)
2. **Not extracting at all** - Passing the email directly instead of parsing the JWT
3. **Using email as identifier** - Database might have email as a string, but code expects UUID

---

## How to Fix (Backend)

### Option 1: Fix JWT Extraction

In your Spring Boot backend, ensure the JWT extraction gets the user ID, not email:

```java
@PostMapping("/me/onboarding")
public ResponseEntity<FounderResponse> completeOnboarding(
    @RequestBody OnboardingRequest request,
    @AuthenticationPrincipal JwtAuthenticationToken authentication
) {
    // ✅ CORRECT: Extract UUID from JWT subject claim
    String userIdStr = authentication.getToken().getSubject();
    UUID userId = UUID.fromString(userIdStr);
    
    // OR if using custom claim
    UUID userId = UUID.fromString(authentication.getToken().getClaimAsString("userId"));
    
    // Rest of the logic...
}
```

### Option 2: Check Token Generation

When generating the JWT during login/signup, ensure the `sub` claim contains the **user ID (UUID)**, not the email:

```java
// ❌ WRONG
String token = Jwts.builder()
    .setSubject(user.getEmail()) // Email is not a UUID!
    .compact();

// ✅ CORRECT
String token = Jwts.builder()
    .setSubject(user.getId().toString()) // User ID as string
    .claim("email", user.getEmail())      // Email as separate claim
    .compact();
```

---

## Verification Steps

1. **Check JWT token structure:**
   - Decode the access token at [jwt.io](https://jwt.io)
   - Verify the `sub` claim contains a UUID, not an email

2. **Check backend logs:**
   - Add logging before UUID parsing to see what value is being parsed
   - `log.info("Parsing userId from: {}", userIdString);`

3. **Check database schema:**
   - Verify `founders` table has `id` column as UUID type
   - Check if there's any email-based lookup being used incorrectly

---

## Frontend Workaround (Temporary)

While the backend is being fixed, we can add better error handling:

```typescript
catch (error) {
  console.error('Onboarding failed:', error);
  
  // Check for UUID parsing error
  const errorMessage = (error as any)?.response?.data?.message || '';
  if (errorMessage.includes('Invalid UUID string')) {
    toast.error(
      'Server configuration error. Please contact support.',
      { description: 'Error code: JWT_PARSING_ERROR' }
    );
    return;
  }
  
  setApiError(error);
}
```

---

## Testing After Fix

1. **Reset password flow:**
   - Reset password
   - Login with new password
   - Complete onboarding
   - ✅ Should succeed without UUID error

2. **Normal login flow:**
   - Login with existing credentials
   - Complete onboarding
   - ✅ Should work as before

3. **Token refresh:**
   - Let token expire
   - Attempt onboarding
   - ✅ Should refresh token and succeed

---

## Additional Notes

- This issue likely affects **all authenticated endpoints** that use user ID extraction
- Check other endpoints like:
  - `GET /me` - Get user profile
  - `PATCH /me` - Update profile
  - `PUT /me/password` - Change password
  - Any endpoint using `@AuthenticationPrincipal`

- The issue appeared after password reset, which suggests:
  - New JWT tokens (from fresh login) might have different structure
  - Old tokens (cached) might have worked before
  - Password reset flow might generate tokens differently

---

## Related Files

**Frontend:**
- `src/api/client.ts` - JWT token handling
- `src/pages/OnboardingPageMultiStep.tsx` - Onboarding submission
- `src/api/endpoints/founders.ts` - API endpoints

**Backend (Spring Boot):**
- JWT generation during login/signup
- JWT extraction in security configuration
- OnboardingController endpoint handler
- SecurityContext configuration
