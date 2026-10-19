# UUID Parsing Error - Quick Reference

## What Happened

After resetting password and logging in, onboarding fails with:
```
java.lang.IllegalArgumentException: Invalid UUID string: nupurbanakar@gmail.com
```

## Root Cause

**Backend bug:** The backend is trying to parse your email as a UUID when extracting the user ID from the JWT token.

## Frontend Fix (Applied)

✅ **Better error handling** - Shows user-friendly message:
> "There is a temporary authentication issue. Please log out and log back in to continue."

✅ **Logout button** - ApiErrorDisplay now shows a "Log Out and Try Again" button for auth errors

✅ **Debug logging** - Added detailed console logs to help troubleshoot

## What You'll See Now

Instead of "An unexpected error occurred", you'll see:

**Error Message:**
```
Session Authentication Error

There is a temporary authentication issue. 
Please log out and log back in to continue.

[Log Out and Try Again] button
```

**Console Logs:**
```
=== ONBOARDING SUBMISSION ===
Payload: {
  "founderName": "Nupur Banakar",
  "startupName": "Acme Inc",
  "stageId": "483eb357-557b-469d-96a4-933d710f3611",  ✅ Valid UUID
  "sectorId": "771e391f-8309-40d2-b790-eef4eee368d3", ✅ Valid UUID
  "city": "Pune",
  "website": "https://www.example.com"
}
```

## Backend Fix Needed

The backend needs to fix JWT token parsing. See `.docs/BACKEND_UUID_ISSUE.md` for:
- Detailed root cause analysis
- Code examples of the fix
- Verification steps

### Quick Backend Fix

In Spring Boot backend, change JWT extraction:

```java
// ❌ WRONG - Don't use email as user ID
String userId = jwtToken.getClaim("email"); 

// ✅ CORRECT - Use subject claim (should contain UUID)
String userId = jwtToken.getSubject();
UUID founderId = UUID.fromString(userId);
```

## Temporary Workaround

Until backend is fixed:
1. Try logging out completely
2. Clear browser localStorage (DevTools → Application → Local Storage → Clear All)
3. Log back in
4. Try onboarding again

If issue persists, the backend **must** be fixed.

## Files Changed

- `src/pages/OnboardingPageMultiStep.tsx` - Enhanced error handling
- `src/utils/errorHandling.ts` - Detect UUID parsing errors
- `src/components/ApiErrorDisplay.tsx` - Show logout button for auth errors
- `.docs/BACKEND_UUID_ISSUE.md` - Full technical documentation

## Testing

1. **Frontend changes work:** ✅ Committed and pushed
2. **User sees helpful error:** ✅ Instead of generic message
3. **Backend fix needed:** ⏳ Requires backend code change

---

**Status:** Frontend workaround applied. Backend fix required to fully resolve.
