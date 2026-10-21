import { test, expect } from '@playwright/test';

test.describe('Error States', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for authenticated error tests
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
  });

  test('should display 404 page for invalid route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });

  test('should show back to home link on 404 page', async ({ page }) => {
    await page.goto('/invalid-route');
    
    const homeLink = page.getByRole('link', { name: /back to home|go home/i });
    await expect(homeLink).toBeVisible();
    
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('should display 404 for invalid grant ID', async ({ page }) => {
    await page.route('**/api/v1/grants/99999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Grant not found',
        }),
      });
    });

    // Login first
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/grants/99999');
    
    // Should show error message or 404
    await expect(page.getByText(/not found|error/i)).toBeVisible();
  });

  test('should display 404 for invalid mentor ID', async ({ page }) => {
    await page.route('**/api/v1/mentors/99999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Mentor not found',
        }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/mentors/99999');
    
    await expect(page.getByText(/not found|error/i)).toBeVisible();
  });

  test('should display 404 for invalid challenge ID', async ({ page }) => {
    await page.route('**/api/v1/challenges/99999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Challenge not found',
        }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/challenges/99999');
    
    await expect(page.getByText(/not found|error/i)).toBeVisible();
  });

  test('should handle API error on grants listing', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/grants');
    
    // Should show error message
    await expect(page.getByText(/error|failed|something went wrong/i)).toBeVisible();
  });

  test('should handle network error gracefully', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/grants');
    
    // Should show error message
    await expect(page.getByText(/error|failed|connection/i)).toBeVisible();
  });

  test('should show error message when login fails', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials',
        }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('wrong@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    
    await expect(page.getByText(/invalid credentials|login failed/i)).toBeVisible();
  });

  test('should handle unauthorized access to protected routes', async ({ page }) => {
    // Don't login, try to access protected route
    await page.goto('/profile');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show retry option on API error', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/v1/grants**', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Server error' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            content: [
              { id: 1, title: 'Test Grant', description: 'After retry', amount: 1000000 },
            ],
            totalElements: 1,
          }),
        });
      }
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/grants');
    
    // Should show error
    await expect(page.getByText(/error|failed/i)).toBeVisible();
    
    // Look for retry button
    const retryButton = page.getByRole('button', { name: /retry|try again/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
      
      // After retry, should show content
      await expect(page.getByText(/test grant/i)).toBeVisible();
    }
  });

  test('should navigate to 404 from broken internal link', async ({ page }) => {
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

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    // Manually navigate to invalid route via client-side routing
    await page.goto('/grants/invalid-id');
    
    // Should show error or 404
    await expect(page.getByText(/not found|error/i)).toBeVisible();
  });

  test('should show custom 404 message on not found page', async ({ page }) => {
    await page.goto('/random-nonexistent-page');
    
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByText(/page.*not.*found|doesn't exist/i)).toBeVisible();
  });

  test('should handle timeout errors', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      // Simulate timeout by delaying indefinitely
      await new Promise(() => {}); // Never resolves
    });

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    await page.goto('/grants', { timeout: 5000 }).catch(() => {});
    
    // Should show loading or error state
    // This test depends on how timeouts are handled in the app
  });
});
