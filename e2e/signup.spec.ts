import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/^password$/i)).toBeVisible();
    await expect(page.getByPlaceholder(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('invalid-email');
    await page.getByPlaceholder(/^password$/i).fill('password1234');
    await page.getByPlaceholder(/confirm password/i).fill('password1234');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should show error for short password', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/^password$/i).fill('short');
    await page.getByPlaceholder(/confirm password/i).fill('short');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/^password$/i).fill('password1234');
    await page.getByPlaceholder(/confirm password/i).fill('different1234');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
  });

  test('should navigate to login page from signup', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle successful signup (mocked API)', async ({ page, context }) => {
    // Mock API responses
    await page.route('**/api/v1/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }),
      });
    });

    await page.route('**/api/v1/founders/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'test@example.com',
          firstName: null,
          lastName: null,
          role: 'founder',
          isVerified: false,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/^password$/i).fill('password1234');
    await page.getByPlaceholder(/confirm password/i).fill('password1234');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should redirect to onboarding after successful signup
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
  });

  test('should show error for existing email', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/v1/auth/signup', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
          detail: 'This email is already registered',
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('existing@example.com');
    await page.getByPlaceholder(/^password$/i).fill('password1234');
    await page.getByPlaceholder(/confirm password/i).fill('password1234');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/email is already registered/i)).toBeVisible();
  });

  test('should disable submit button while submitting', async ({ page }) => {
    await page.route('**/api/v1/auth/signup', async (route) => {
      // Delay response to test loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/^password$/i).fill('password1234');
    await page.getByPlaceholder(/confirm password/i).fill('password1234');
    
    const submitButton = page.getByRole('button', { name: /sign up/i });
    await submitButton.click();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('should show password visibility toggle', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/^password$/i);
    
    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    await page.getByLabel(/show password/i).first().click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await page.getByLabel(/hide password/i).first().click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
