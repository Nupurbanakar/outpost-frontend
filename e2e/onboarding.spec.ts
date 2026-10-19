import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authenticated state
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Mock authenticated user (verified but not onboarded)
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: null,
            lastName: null,
            role: 'founder',
            isVerified: true,
            isOnboarded: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }
    });

    // Mock stages and sectors
    await page.route('**/api/v1/stages', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Idea Stage' },
          { id: 2, name: 'Prototype' },
          { id: 3, name: 'MVP' },
          { id: 4, name: 'Growth' },
        ]),
      });
    });

    await page.route('**/api/v1/sectors', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'FinTech' },
          { id: 2, name: 'HealthTech' },
          { id: 3, name: 'EdTech' },
          { id: 4, name: 'AgriTech' },
        ]),
      });
    });

    await page.goto('/onboarding');
  });

  test('should display onboarding form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /complete your profile/i })).toBeVisible();
    await expect(page.getByPlaceholder(/first name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/last name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/startup name/i)).toBeVisible();
    await expect(page.getByLabel(/stage/i)).toBeVisible();
    await expect(page.getByLabel(/sector/i)).toBeVisible();
    await expect(page.getByPlaceholder(/city/i)).toBeVisible();
    await expect(page.getByPlaceholder(/website/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /complete profile/i })).toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    await page.getByRole('button', { name: /complete profile/i }).click();
    
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByText(/last name is required/i)).toBeVisible();
    await expect(page.getByText(/startup name is required/i)).toBeVisible();
    await expect(page.getByText(/stage is required/i)).toBeVisible();
    await expect(page.getByText(/sector is required/i)).toBeVisible();
  });

  test('should show error for invalid website URL', async ({ page }) => {
    await page.getByPlaceholder(/first name/i).fill('John');
    await page.getByPlaceholder(/last name/i).fill('Doe');
    await page.getByPlaceholder(/startup name/i).fill('My Startup');
    await page.getByLabel(/stage/i).selectOption('1');
    await page.getByLabel(/sector/i).selectOption('1');
    await page.getByPlaceholder(/website/i).fill('invalid-url');
    await page.getByRole('button', { name: /complete profile/i }).click();
    
    await expect(page.getByText(/invalid URL/i)).toBeVisible();
  });

  test('should accept valid website URLs', async ({ page }) => {
    const validUrls = [
      'https://example.com',
      'http://example.com',
      'https://www.example.com',
      'https://example.com/path',
    ];

    for (const url of validUrls) {
      await page.getByPlaceholder(/website/i).fill(url);
      await page.getByPlaceholder(/website/i).blur();
      
      // Should not show URL validation error
      await expect(page.getByText(/invalid URL/i)).not.toBeVisible();
      
      await page.getByPlaceholder(/website/i).clear();
    }
  });

  test('should successfully complete onboarding', async ({ page }) => {
    // Mock onboarding API
    await page.route('**/api/v1/founders/me/onboarding', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'founder',
          isVerified: true,
          isOnboarded: true,
          founderProfile: {
            id: 1,
            startupName: 'TechStartup',
            stageId: 3,
            sectorId: 1,
            city: 'Mumbai',
            website: 'https://techstartup.com',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    // Mock updated user profile
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'founder',
            isVerified: true,
            isOnboarded: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }
    });

    // Fill out the form
    await page.getByPlaceholder(/first name/i).fill('John');
    await page.getByPlaceholder(/last name/i).fill('Doe');
    await page.getByPlaceholder(/startup name/i).fill('TechStartup');
    await page.getByLabel(/stage/i).selectOption('3');
    await page.getByLabel(/sector/i).selectOption('1');
    await page.getByPlaceholder(/city/i).fill('Mumbai');
    await page.getByPlaceholder(/website/i).fill('https://techstartup.com');
    
    await page.getByRole('button', { name: /complete profile/i }).click();
    
    // Should redirect to discover after successful onboarding
    await expect(page).toHaveURL(/\/discover/, { timeout: 5000 });
  });

  test('should disable submit button while submitting', async ({ page }) => {
    await page.route('**/api/v1/founders/me/onboarding', async (route) => {
      // Delay response to test loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'test@example.com',
          isOnboarded: true,
        }),
      });
    });

    // Fill out required fields
    await page.getByPlaceholder(/first name/i).fill('John');
    await page.getByPlaceholder(/last name/i).fill('Doe');
    await page.getByPlaceholder(/startup name/i).fill('TechStartup');
    await page.getByLabel(/stage/i).selectOption('3');
    await page.getByLabel(/sector/i).selectOption('1');
    
    const submitButton = page.getByRole('button', { name: /complete profile/i });
    await submitButton.click();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('should handle API errors', async ({ page }) => {
    await page.route('**/api/v1/founders/me/onboarding', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          detail: 'Invalid data provided',
        }),
      });
    });

    // Fill out form
    await page.getByPlaceholder(/first name/i).fill('John');
    await page.getByPlaceholder(/last name/i).fill('Doe');
    await page.getByPlaceholder(/startup name/i).fill('TechStartup');
    await page.getByLabel(/stage/i).selectOption('3');
    await page.getByLabel(/sector/i).selectOption('1');
    await page.getByRole('button', { name: /complete profile/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid data provided/i)).toBeVisible();
  });

  test('should allow skipping optional fields', async ({ page }) => {
    await page.route('**/api/v1/founders/me/onboarding', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'test@example.com',
          isOnboarded: true,
        }),
      });
    });

    // Fill only required fields (city and website are optional)
    await page.getByPlaceholder(/first name/i).fill('John');
    await page.getByPlaceholder(/last name/i).fill('Doe');
    await page.getByPlaceholder(/startup name/i).fill('TechStartup');
    await page.getByLabel(/stage/i).selectOption('3');
    await page.getByLabel(/sector/i).selectOption('1');
    
    await page.getByRole('button', { name: /complete profile/i }).click();
    
    // Should not show validation errors for optional fields
    await expect(page.getByText(/city is required/i)).not.toBeVisible();
    await expect(page.getByText(/website is required/i)).not.toBeVisible();
  });

  test('should load stages and sectors on mount', async ({ page }) => {
    const stageSelect = page.getByLabel(/stage/i);
    const sectorSelect = page.getByLabel(/sector/i);
    
    // Check that options are loaded
    await expect(stageSelect.locator('option')).toHaveCount(5); // 4 stages + placeholder
    await expect(sectorSelect.locator('option')).toHaveCount(5); // 4 sectors + placeholder
    
    // Check specific options
    await expect(stageSelect.locator('option', { hasText: 'Idea Stage' })).toBeVisible();
    await expect(stageSelect.locator('option', { hasText: 'MVP' })).toBeVisible();
    await expect(sectorSelect.locator('option', { hasText: 'FinTech' })).toBeVisible();
    await expect(sectorSelect.locator('option', { hasText: 'EdTech' })).toBeVisible();
  });
});
