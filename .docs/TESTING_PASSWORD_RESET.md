# Manual Testing Guide - Password Reset Flow

## Prerequisites
- Backend running at `http://localhost:8080`
- Frontend running at `http://localhost:3000`
- A registered user account

---

## Test 1: Forgot Password Flow

### Steps:

1. **Navigate to forgot password page**
   ```
   http://localhost:3000/forgot-password
   ```

2. **Enter your email**
   - Use the email you registered with (e.g., `nupur.banakar@technogise.com`)

3. **Click "Send Reset Instructions"**

4. **Expected Results:**
   - ✅ Page changes to "Check Your Email" screen
   - ✅ Your email address is displayed
   - ✅ Success toast notification appears
   - ✅ Backend logs show email sent with reset token

5. **Check backend logs**
   - Look for: `Email sent to [your-email] with subject: Reset your Outpost password`
   - Copy the token from the URL in logs: `http://localhost:3000/reset-password?token=YOUR_TOKEN`

---

## Test 2: Reset Password Flow (Valid Token)

### Steps:

1. **Open reset link from backend logs**
   ```
   http://localhost:3000/reset-password?token=YOUR_TOKEN_FROM_LOGS
   ```

2. **Verify form displays**
   - ✅ "Reset Password" heading
   - ✅ "New Password" input
   - ✅ "Confirm Password" input
   - ✅ Password requirements shown (min 10 characters)

3. **Enter new password**
   - Password: `mynewpassword123` (min 10 chars)
   - Confirm: `mynewpassword123` (must match)

4. **Click "Reset Password"**

5. **Expected Results:**
   - ✅ Success toast: "Password reset successfully!"
   - ✅ Redirected to `/login` page after 1 second

6. **Test login with new password**
   - Go to `/login`
   - Email: your email
   - Password: `mynewpassword123`
   - ✅ Should log in successfully

---

## Test 3: Reset Password Flow (Invalid Token)

### Steps:

1. **Navigate with invalid token**
   ```
   http://localhost:3000/reset-password?token=invalid-fake-token
   ```

2. **Expected Results:**
   - ✅ "Invalid or Expired Link" heading
   - ✅ Error message about invalid/expired token
   - ✅ "Request New Reset Link" button
   - ✅ "Back to Login" button

3. **Click "Request New Reset Link"**
   - ✅ Should redirect to `/forgot-password`

---

## Test 4: Reset Password Validation

### Steps:

1. **Open reset page with valid token**

2. **Test empty fields**
   - Click "Reset Password" without filling anything
   - ✅ Should show "Password is required"

3. **Test short password**
   - Password: `short123` (< 10 chars)
   - ✅ Should show "Password must be at least 10 characters"

4. **Test password mismatch**
   - Password: `password1234`
   - Confirm: `different1234`
   - ✅ Should show "Passwords do not match"

---

## Test 5: Security - Email Existence

### Steps:

1. **Go to forgot password page**

2. **Enter non-existent email**
   ```
   nonexistent@example.com
   ```

3. **Expected Result:**
   - ✅ Still shows success message
   - ✅ Does NOT reveal that email doesn't exist
   - ✅ "Check Your Email" screen appears
   - This is a security best practice - don't leak email existence

---

## Automated Tests

Run E2E tests with:

```bash
# Run all password reset tests
npm run test:e2e e2e/forgot-password.spec.ts e2e/reset-password.spec.ts

# Run with UI
npm run test:e2e:ui
```

**Test Coverage:**
- ✅ 8 test scenarios for forgot password
- ✅ 13 test scenarios for reset password
- ✅ 21 total automated tests

---

## Troubleshooting

### Issue: Email not being sent
**Check:**
- Backend SMTP configuration
- Backend logs for email service errors

### Issue: Token expired immediately
**Check:**
- Backend token expiry settings (should be 1 hour)
- System time is correct

### Issue: Redirect not working
**Check:**
- Browser console for errors
- Network tab for API response
- React Router is configured correctly

---

## Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/forgot-password` | POST | Request password reset email |
| `/auth/reset-password` | POST | Reset password with token |

---

## Success Criteria

All tests pass when:
- ✅ Forgot password sends email (check logs)
- ✅ Success screen shows for any email
- ✅ Reset form loads with valid token
- ✅ Password validation works correctly
- ✅ Password reset succeeds with valid token
- ✅ Can login with new password
- ✅ Invalid token shows error screen
- ✅ All automated tests pass
