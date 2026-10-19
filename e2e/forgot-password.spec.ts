import { test, expect } from '@playwright/test';

test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('should display forgot password form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset instructions/i })).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.getByRole('button', { name: /send reset instructions/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('notanemail');
    await page.getByRole('button', { name: /send reset instructions/i }).click();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should show success message regardless of email existence (security)', async ({ page }) => {
    // Mock the API to always succeed
    await page.route('**/api/v1/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.getByPlaceholder(/email/i).fill('nonexistent@example.com');
    await page.getByRole('button', { name: /send reset instructions/i }).click();

    // Should show success screen
    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible();
    await expect(page.getByText(/nonexistent@example.com/i)).toBeVisible();
  });

  test('should show success for existing email', async ({ page }) => {
    await page.route('**/api/v1/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /send reset instructions/i }).click();

    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible();
    await expect(page.getByText(/test@example.com/i)).toBeVisible();
  });

  test('should disable submit button while processing', async ({ page }) => {
    await page.route('**/api/v1/auth/forgot-password', async (route) => {
      // Delay to test loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.getByPlaceholder(/email/i).fill('test@example.com');
    const submitButton = page.getByRole('button', { name: /send reset instructions/i });
    await submitButton.click();

    // Button should be disabled and show loading text
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveText(/sending/i);
  });

  test('should have link back to login', async ({ page }) => {
    await page.getByRole('link', { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show back to login on success screen', async ({ page }) => {
    await page.route('**/api/v1/auth/forgot-password', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /send reset instructions/i }).click();

    // On success screen, should have link back to login
    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible();
    await page.getByRole('button', { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
