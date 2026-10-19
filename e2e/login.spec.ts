import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /log in/i }).click();
    
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('invalid-email');
    await page.getByPlaceholder(/password/i).fill('password1234');
    await page.getByRole('button', { name: /log in/i }).click();
    
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should handle successful login for verified user', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/v1/auth/login', async (route) => {
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
          email: 'verified@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'founder',
          isVerified: true,
          isOnboarded: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('verified@example.com');
    await page.getByPlaceholder(/password/i).fill('password1234');
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Should redirect to discover for verified, onboarded user
    await expect(page).toHaveURL(/\/discover/, { timeout: 5000 });
  });

  test('should redirect unverified user to verify-email page', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
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
          email: 'unverified@example.com',
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

    await page.getByPlaceholder(/email/i).fill('unverified@example.com');
    await page.getByPlaceholder(/password/i).fill('password1234');
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Should redirect to verify-email for unverified user
    await expect(page).toHaveURL(/\/verify-email/, { timeout: 5000 });
  });

  test('should redirect non-onboarded user to onboarding', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
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
          email: 'verified-no-profile@example.com',
          firstName: null,
          lastName: null,
          role: 'founder',
          isVerified: true,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('verified-no-profile@example.com');
    await page.getByPlaceholder(/password/i).fill('password1234');
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Should redirect to onboarding for verified but not onboarded user
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
          detail: 'Email or password is incorrect',
        }),
      });
    });

    await page.getByPlaceholder(/email/i).fill('wrong@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    
    await expect(page.getByText(/email or password is incorrect/i)).toBeVisible();
  });

  test('should disable submit button while submitting', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
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
    await page.getByPlaceholder(/password/i).fill('password1234');
    
    const submitButton = page.getByRole('button', { name: /log in/i });
    await submitButton.click();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('should show password visibility toggle', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/password/i);
    
    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    await page.getByLabel(/show password/i).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await page.getByLabel(/hide password/i).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should persist email in form on error', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        }),
      });
    });

    const email = 'test@example.com';
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Email should still be in the input after error
    await expect(page.getByPlaceholder(/email/i)).toHaveValue(email);
  });
});
