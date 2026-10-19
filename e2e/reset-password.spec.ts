import { test, expect } from '@playwright/test';

test.describe('Reset Password Flow', () => {
  const validToken = 'valid-reset-token-12345';
  const expiredToken = 'expired-token-67890';

  test('should show invalid token screen when no token provided', async ({ page }) => {
    await page.goto('/reset-password');
    
    await expect(page.getByRole('heading', { name: /invalid or expired link/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /request new reset link/i })).toBeVisible();
  });

  test('should show invalid token screen for malformed token', async ({ page }) => {
    await page.goto('/reset-password?token=');
    
    await expect(page.getByRole('heading', { name: /invalid or expired link/i })).toBeVisible();
  });

  test('should display reset password form with valid token', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
    await expect(page.getByPlaceholder(/new password/i)).toBeVisible();
    await expect(page.getByPlaceholder(/confirm/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /reset password/i })).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });

  test('should show validation error for empty password', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByRole('button', { name: /reset password/i }).click();
    
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('short123');
    await page.getByPlaceholder(/confirm/i).fill('short123');
    await page.getByRole('button', { name: /reset password/i }).click();
    
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('password1234');
    await page.getByPlaceholder(/confirm/i).fill('different1234');
    await page.getByRole('button', { name: /reset password/i }).click();
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should successfully reset password with valid token', async ({ page }) => {
    await page.route('**/api/v1/auth/reset-password', async (route) => {
      const postData = route.request().postDataJSON();
      
      if (postData.token === validToken) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'TOKEN_INVALID',
            message: 'Invalid or expired token',
          }),
        });
      }
    });

    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('newpassword123');
    await page.getByPlaceholder(/confirm/i).fill('newpassword123');
    await page.getByRole('button', { name: /reset password/i }).click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('should show error for expired token', async ({ page }) => {
    await page.route('**/api/v1/auth/reset-password', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'TOKEN_INVALID',
          message: 'Token is invalid or expired',
          detail: 'This reset link has expired. Please request a new one.',
        }),
      });
    });

    await page.goto(`/reset-password?token=${expiredToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('newpassword123');
    await page.getByPlaceholder(/confirm/i).fill('newpassword123');
    await page.getByRole('button', { name: /reset password/i }).click();
    
    // Should show error
    await expect(page.getByText(/expired/i)).toBeVisible();
  });

  test('should disable submit button while processing', async ({ page }) => {
    await page.route('**/api/v1/auth/reset-password', async (route) => {
      // Delay to test loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('newpassword123');
    await page.getByPlaceholder(/confirm/i).fill('newpassword123');
    
    const submitButton = page.getByRole('button', { name: /reset password/i });
    await submitButton.click();
    
    // Button should be disabled and show loading text
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveText(/resetting/i);
  });

  test('should have link back to login', async ({ page }) => {
    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByRole('link', { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have request new link button on invalid token screen', async ({ page }) => {
    await page.goto('/reset-password');
    
    await page.getByRole('button', { name: /request new reset link/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should show success toast on successful reset', async ({ page }) => {
    await page.route('**/api/v1/auth/reset-password', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto(`/reset-password?token=${validToken}`);
    
    await page.getByPlaceholder(/new password/i).fill('newpassword123');
    await page.getByPlaceholder(/confirm/i).fill('newpassword123');
    await page.getByRole('button', { name: /reset password/i }).click();
    
    // Should show success toast (Sonner notification)
    await expect(page.getByText(/password reset successfully/i)).toBeVisible({ timeout: 2000 });
  });
});
