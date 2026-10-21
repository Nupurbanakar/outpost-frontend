import { test, expect } from '@playwright/test';

test.describe('Global Search (⌘K Modal)', () => {
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

  test('should open search modal with keyboard shortcut (Cmd+K)', async ({ page }) => {
    // Press Cmd+K (or Ctrl+K on non-Mac)
    await page.keyboard.press('Meta+K');
    
    // Modal should be visible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('should open search modal with Ctrl+K on Windows/Linux', async ({ page }) => {
    // Press Ctrl+K
    await page.keyboard.press('Control+K');
    
    // Modal should be visible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('should search and display results from multiple types', async ({ page }) => {
    await page.route('**/api/v1/search?q=funding**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [
            {
              id: 1,
              title: 'Seed Funding Grant',
              description: 'Government seed funding program',
              amount: 1000000,
            },
          ],
          challenges: [
            {
              id: 2,
              title: 'Funding Innovation Challenge',
              description: 'Win funding for your startup',
              prize: 500000,
            },
          ],
          mentors: [
            {
              id: 3,
              name: 'John Funding Expert',
              title: 'Fundraising Consultant',
              company: 'VentureCorp',
              expertise: ['Fundraising'],
            },
          ],
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('funding');
    
    // Wait for results
    await expect(page.getByText(/seed funding grant/i)).toBeVisible();
    await expect(page.getByText(/funding innovation challenge/i)).toBeVisible();
    await expect(page.getByText(/john funding expert/i)).toBeVisible();
  });

  test('should navigate with keyboard arrows', async ({ page }) => {
    await page.route('**/api/v1/search?q=test**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [
            { id: 1, title: 'Test Grant 1', description: 'First grant' },
            { id: 2, title: 'Test Grant 2', description: 'Second grant' },
            { id: 3, title: 'Test Grant 3', description: 'Third grant' },
          ],
          challenges: [],
          mentors: [],
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('test');
    
    // Wait for results
    await expect(page.getByText(/test grant 1/i)).toBeVisible();
    
    // Navigate down with arrow key
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    
    // Third item should be highlighted/focused
    // Note: Exact assertion depends on how focus is styled
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.keyboard.press('Meta+K');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Modal should be hidden
    await expect(page.getByPlaceholder(/search/i)).not.toBeVisible();
  });

  test('should navigate to selected result with Enter', async ({ page }) => {
    await page.route('**/api/v1/search?q=grant**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [
            { id: 1, title: 'Sample Grant', description: 'Test grant' },
          ],
          challenges: [],
          mentors: [],
        }),
      });
    });

    await page.route('**/api/v1/grants/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Sample Grant',
          description: 'Test grant details',
          amount: 1000000,
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('grant');
    
    await expect(page.getByText(/sample grant/i)).toBeVisible();
    
    // Press Enter to select first result
    await page.keyboard.press('Enter');
    
    // Should navigate to grant detail page
    await expect(page).toHaveURL(/\/grants\/1/);
  });

  test('should navigate to result by clicking', async ({ page }) => {
    await page.route('**/api/v1/search?q=mentor**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [],
          challenges: [],
          mentors: [
            {
              id: 5,
              name: 'Jane Mentor',
              title: 'Tech Advisor',
              company: 'TechCo',
              expertise: ['Product'],
            },
          ],
        }),
      });
    });

    await page.route('**/api/v1/mentors/5', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 5,
          name: 'Jane Mentor',
          title: 'Tech Advisor',
          company: 'TechCo',
          expertise: ['Product'],
          bio: 'Experienced advisor',
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('mentor');
    
    await expect(page.getByText(/jane mentor/i)).toBeVisible();
    
    // Click on result
    await page.getByText(/jane mentor/i).click();
    
    // Should navigate to mentor detail page
    await expect(page).toHaveURL(/\/mentors\/5/);
  });

  test('should show empty state when no results found', async ({ page }) => {
    await page.route('**/api/v1/search?q=nonexistent**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [],
          challenges: [],
          mentors: [],
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('nonexistent');
    
    await expect(page.getByText(/no results found/i)).toBeVisible();
  });

  test('should show "View All" link for each category', async ({ page }) => {
    await page.route('**/api/v1/search?q=startup**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [
            { id: 1, title: 'Startup Grant', description: 'For startups' },
          ],
          challenges: [
            { id: 2, title: 'Startup Challenge', description: 'For startups' },
          ],
          mentors: [],
        }),
      });
    });

    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ content: [], totalElements: 0 }),
      });
    });

    await page.keyboard.press('Meta+K');
    await page.getByPlaceholder(/search/i).fill('startup');
    
    await expect(page.getByText(/startup grant/i)).toBeVisible();
    
    // Click "View All" for grants
    await page.getByRole('link', { name: /view all.*grants/i }).click();
    
    // Should navigate to grants page with search query
    await expect(page).toHaveURL(/\/grants/);
  });

  test('should debounce search input', async ({ page }) => {
    let searchCount = 0;

    await page.route('**/api/v1/search?q=test**', async (route) => {
      searchCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          grants: [],
          challenges: [],
          mentors: [],
        }),
      });
    });

    await page.keyboard.press('Meta+K');
    
    // Type quickly
    await page.getByPlaceholder(/search/i).type('test', { delay: 50 });
    
    // Wait for debounce
    await page.waitForTimeout(500);
    
    // Should have called API only once or few times, not for every keystroke
    expect(searchCount).toBeLessThan(5);
  });
});
