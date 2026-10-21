import { test, expect } from '@playwright/test';

test.describe('Discover Page Journey', () => {
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

    // Mock spotlight data
    await page.route('**/api/v1/spotlight', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          type: 'FOUNDER',
          founder: {
            id: 1,
            name: 'Jane Doe',
            startupName: 'TechCo',
            bio: 'Building the future of fintech',
          },
        }),
      });
    });

    // Mock curated opportunities
    await page.route('**/api/v1/discover/curated', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            type: 'grant',
            title: 'Startup Grant 2024',
            description: 'Funding for early-stage startups',
            amount: 50000,
          },
          {
            id: 2,
            type: 'challenge',
            title: 'Innovation Challenge',
            description: 'Solve real-world problems',
          },
        ]),
      });
    });

    // Mock mentors preview
    await page.route('**/api/v1/mentors?page=1&limit=3', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'John Mentor',
              title: 'VP of Engineering',
              company: 'TechCorp',
              expertise: ['Fundraising', 'Product'],
            },
          ],
          totalElements: 10,
        }),
      });
    });

    // Login and navigate to discover
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');
  });

  test('should display discover page with all sections', async ({ page }) => {
    // Check hero section
    await expect(page.getByRole('heading', { name: /discover/i })).toBeVisible();

    // Check spotlight section
    await expect(page.getByText(/spotlight/i)).toBeVisible();
    await expect(page.getByText(/jane doe/i)).toBeVisible();
    await expect(page.getByText(/techco/i)).toBeVisible();
  });

  test('should display curated opportunities', async ({ page }) => {
    await expect(page.getByText(/curated for you/i)).toBeVisible();
    await expect(page.getByText(/startup grant 2024/i)).toBeVisible();
    await expect(page.getByText(/innovation challenge/i)).toBeVisible();
  });

  test('should display mentors preview section', async ({ page }) => {
    await expect(page.getByText(/meet our mentors/i)).toBeVisible();
    await expect(page.getByText(/john mentor/i)).toBeVisible();
  });

  test('should navigate to grants page', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [],
          totalElements: 0,
        }),
      });
    });

    await page.getByRole('link', { name: /view all grants/i }).first().click();
    await expect(page).toHaveURL(/\/grants/);
  });

  test('should navigate to mentor profile from preview', async ({ page }) => {
    await page.route('**/api/v1/mentors/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'John Mentor',
          title: 'VP of Engineering',
          company: 'TechCorp',
          bio: 'Experienced tech leader',
          expertise: ['Fundraising', 'Product'],
        }),
      });
    });

    await page.getByText(/john mentor/i).click();
    await expect(page).toHaveURL(/\/mentors\/1/);
  });

  test('should navigate to challenges page', async ({ page }) => {
    await page.route('**/api/v1/challenges**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [],
          totalElements: 0,
        }),
      });
    });

    await page.getByRole('link', { name: /explore challenges/i }).click();
    await expect(page).toHaveURL(/\/challenges/);
  });
});
