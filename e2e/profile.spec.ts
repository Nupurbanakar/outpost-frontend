import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
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
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          isVerified: true,
          isOnboarded: true,
          startupName: 'My Startup',
          city: 'Hyderabad',
          stage: 'SEED',
          sector: 'FINTECH',
          bio: 'Building innovative fintech solutions',
          linkedinUrl: 'https://linkedin.com/in/testuser',
          twitterUrl: 'https://twitter.com/testuser',
        }),
      });
    });

    // Login
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');
  });

  test('should display profile page with user information', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
    await expect(page.getByText(/test user/i)).toBeVisible();
    await expect(page.getByText(/my startup/i)).toBeVisible();
    await expect(page.getByText(/hyderabad/i)).toBeVisible();
    await expect(page.getByText(/building innovative fintech/i)).toBeVisible();
  });

  test('should toggle edit mode', async ({ page }) => {
    await page.goto('/profile');
    
    // Click edit button
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Edit mode should be active
    await expect(page.getByRole('button', { name: /save changes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('should edit profile fields', async ({ page }) => {
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Updated',
            lastName: 'Name',
            startupName: 'New Startup Name',
            bio: 'Updated bio text',
            linkedinUrl: 'https://linkedin.com/in/updated',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            startupName: 'My Startup',
            bio: 'Building innovative fintech solutions',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      }
    });

    await page.goto('/profile');
    
    // Enter edit mode
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Update fields
    await page.getByLabel(/first name/i).fill('Updated');
    await page.getByLabel(/last name/i).fill('Name');
    await page.getByLabel(/startup name/i).fill('New Startup Name');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show success message
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test('should update bio field', async ({ page }) => {
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            bio: 'This is my new bio with more details about my startup journey.',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            bio: 'Old bio',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      }
    });

    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Update bio
    const bioField = page.getByLabel(/bio/i);
    await bioField.fill('This is my new bio with more details about my startup journey.');
    
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test('should update social links', async ({ page }) => {
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            linkedinUrl: 'https://linkedin.com/in/newprofile',
            twitterUrl: 'https://twitter.com/newhandle',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            linkedinUrl: '',
            twitterUrl: '',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      }
    });

    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Update social links
    await page.getByLabel(/linkedin/i).fill('https://linkedin.com/in/newprofile');
    await page.getByLabel(/twitter/i).fill('https://twitter.com/newhandle');
    
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test('should cancel edit mode without saving', async ({ page }) => {
    await page.goto('/profile');
    
    const originalName = await page.getByText(/test user/i).textContent();
    
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Make changes
    await page.getByLabel(/first name/i).fill('Changed');
    
    // Cancel
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Original name should still be visible
    await expect(page.getByText(/test user/i)).toBeVisible();
  });

  test('should upload pitch deck', async ({ page }) => {
    await page.route('**/api/v1/founders/me/pitch-deck', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          fileUrl: 'https://example.com/pitch-deck.pdf',
          fileName: 'pitch-deck.pdf',
        }),
      });
    });

    await page.goto('/profile');
    
    // Check for pitch deck section
    await expect(page.getByText(/pitch deck/i)).toBeVisible();
    
    // File input for upload
    const fileInput = page.locator('input[type="file"]');
    
    // Create a test file
    await fileInput.setInputFiles({
      name: 'pitch-deck.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content'),
    });
    
    // Should show success message
    await expect(page.getByText(/uploaded successfully/i)).toBeVisible();
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Clear required fields
    await page.getByLabel(/first name/i).clear();
    await page.getByLabel(/last name/i).clear();
    
    // Try to save
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/first name.*required/i)).toBeVisible();
    await expect(page.getByText(/last name.*required/i)).toBeVisible();
  });

  test('should validate social link URLs', async ({ page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    // Enter invalid URL
    await page.getByLabel(/linkedin/i).fill('not-a-valid-url');
    
    // Try to save
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show URL validation error
    await expect(page.getByText(/valid.*url/i)).toBeVisible();
  });

  test('should display loading state while saving', async ({ page }) => {
    await page.route('**/api/v1/founders/me', async (route) => {
      if (route.request().method() === 'PUT') {
        // Delay the response
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Updated',
            lastName: 'User',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            city: 'Hyderabad',
            stage: 'SEED',
            sector: 'FINTECH',
            isVerified: true,
            isOnboarded: true,
          }),
        });
      }
    });

    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    
    await page.getByLabel(/first name/i).fill('Updated');
    
    const saveButton = page.getByRole('button', { name: /save changes/i });
    await saveButton.click();
    
    // Button should show loading state
    await expect(saveButton).toBeDisabled();
  });
});
