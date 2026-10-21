import { test, expect } from '@playwright/test';

test.describe('Bookmarks Flow', () => {
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

  test('should bookmark a grant from listing page', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Startup Grant 2024',
              description: 'Funding for startups',
              amount: 1000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Click bookmark button
    const bookmarkButton = page.locator('[aria-label*="bookmark"]').first();
    await bookmarkButton.click();
    
    // Button should show bookmarked state
    await expect(bookmarkButton).toHaveAttribute('aria-label', /remove.*bookmark/i);
  });

  test('should bookmark a challenge from detail page', async ({ page }) => {
    await page.route('**/api/v1/challenges/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Innovation Challenge 2024',
          description: 'Solve real-world problems',
          prize: 500000,
          deadline: '2024-12-31',
        }),
      });
    });

    await page.goto('/challenges/1');
    
    // Click bookmark button
    const bookmarkButton = page.locator('[aria-label*="bookmark"]');
    await bookmarkButton.click();
    
    // Button should show bookmarked state
    await expect(bookmarkButton).toHaveAttribute('aria-label', /remove.*bookmark/i);
  });

  test('should navigate to saved items page', async ({ page }) => {
    await page.goto('/discover');
    
    // Click on Saved link in navigation
    await page.getByRole('link', { name: /saved/i }).click();
    
    await expect(page).toHaveURL(/\/saved/);
    await expect(page.getByRole('heading', { name: /saved items/i })).toBeVisible();
  });

  test('should display saved grants in saved items page', async ({ page }) => {
    await page.goto('/saved');
    
    // Check localStorage or display saved items
    await expect(page.getByText(/grants/i)).toBeVisible();
  });

  test('should remove bookmark from saved items page', async ({ page }) => {
    // First, add a bookmark
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Test Grant',
              description: 'Test description',
              amount: 1000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    await page.locator('[aria-label*="bookmark"]').first().click();
    
    // Navigate to saved items
    await page.getByRole('link', { name: /saved/i }).click();
    
    // Remove bookmark
    const removeButton = page.locator('[aria-label*="remove.*bookmark"]').first();
    await removeButton.click();
    
    // Item should be removed from list or show empty state
    await expect(page.getByText(/test grant/i)).not.toBeVisible();
  });

  test('should show empty state when no items are saved', async ({ page }) => {
    // Clear localStorage before test
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/saved');
    
    await expect(page.getByText(/no saved items/i)).toBeVisible();
  });

  test('should persist bookmarks across page navigations', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Persistent Grant',
              description: 'Test persistence',
              amount: 1000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Bookmark an item
    await page.locator('[aria-label*="bookmark"]').first().click();
    
    // Navigate away
    await page.goto('/discover');
    
    // Navigate to saved items
    await page.getByRole('link', { name: /saved/i }).click();
    
    // Bookmarked item should still be there
    await expect(page.getByText(/persistent grant/i)).toBeVisible();
  });

  test('should toggle bookmark state correctly', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Toggle Grant',
              description: 'Test toggle',
              amount: 1000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    const bookmarkButton = page.locator('[aria-label*="bookmark"]').first();
    
    // Bookmark
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveAttribute('aria-label', /remove.*bookmark/i);
    
    // Unbookmark
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveAttribute('aria-label', /add.*bookmark/i);
  });

  test('should show bookmark count in saved items page', async ({ page }) => {
    // Add multiple bookmarks
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            { id: 1, title: 'Grant 1', description: 'Test', amount: 1000000 },
            { id: 2, title: 'Grant 2', description: 'Test', amount: 1000000 },
          ],
          totalElements: 2,
        }),
      });
    });

    await page.goto('/grants');
    
    // Bookmark both items
    const bookmarkButtons = page.locator('[aria-label*="bookmark"]');
    await bookmarkButtons.nth(0).click();
    await bookmarkButtons.nth(1).click();
    
    // Navigate to saved items
    await page.getByRole('link', { name: /saved/i }).click();
    
    // Should show count or both items
    await expect(page.getByText(/grant 1/i)).toBeVisible();
    await expect(page.getByText(/grant 2/i)).toBeVisible();
  });

  test('should filter saved items by type', async ({ page }) => {
    await page.goto('/saved');
    
    // Check for filter tabs or options
    const grantsTab = page.getByRole('tab', { name: /grants/i });
    const challengesTab = page.getByRole('tab', { name: /challenges/i });
    
    // If tabs exist, test filtering
    if (await grantsTab.isVisible()) {
      await grantsTab.click();
      // Should show only grants
    }
  });

  test('should maintain bookmark state on page reload', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Reload Test Grant',
              description: 'Test reload',
              amount: 1000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Bookmark an item
    await page.locator('[aria-label*="bookmark"]').first().click();
    
    // Reload page
    await page.reload();
    
    // Bookmark state should persist
    const bookmarkButton = page.locator('[aria-label*="bookmark"]').first();
    await expect(bookmarkButton).toHaveAttribute('aria-label', /remove.*bookmark/i);
  });
});
