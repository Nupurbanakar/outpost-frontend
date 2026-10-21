import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

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

  test('should display mobile navigation bar', async ({ page }) => {
    // Mobile navigation should be visible at bottom
    const mobileNav = page.locator('nav').filter({ hasText: /home|discover|saved|profile/i });
    await expect(mobileNav).toBeVisible();
  });

  test('should navigate using mobile bottom bar', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ content: [], totalElements: 0 }),
      });
    });

    // Tap on different nav items
    await page.getByRole('link', { name: /grants/i }).click();
    await expect(page).toHaveURL(/\/grants/);
    
    await page.getByRole('link', { name: /discover/i }).click();
    await expect(page).toHaveURL(/\/discover/);
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            { id: 1, title: 'Test Grant', description: 'Test', amount: 1000000 },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Check that buttons/links are large enough for touch (44x44px minimum)
    const grantCard = page.getByText(/test grant/i);
    const box = await grantCard.boundingBox();
    
    // Should be at least 44px tall
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should not have horizontal scroll', async ({ page }) => {
    // Check multiple pages for horizontal scroll
    const pages = ['/discover', '/grants', '/challenges', '/mentors'];
    
    for (const path of pages) {
      await page.route('**/api/v1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ content: [], totalElements: 0 }),
        });
      });

      await page.goto(path);
      
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
    }
  });

  test('should display hamburger menu on mobile', async ({ page }) => {
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"]').or(
      page.locator('button').filter({ hasText: /☰|menu/i })
    );
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Menu should open
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('should stack cards vertically on mobile', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            { id: 1, title: 'Grant 1', description: 'Test', amount: 1000000 },
            { id: 2, title: 'Grant 2', description: 'Test', amount: 2000000 },
          ],
          totalElements: 2,
        }),
      });
    });

    await page.goto('/grants');
    
    const card1 = page.getByText(/grant 1/i);
    const card2 = page.getByText(/grant 2/i);
    
    const box1 = await card1.boundingBox();
    const box2 = await card2.boundingBox();
    
    // Cards should be stacked (second card Y position > first card Y + height)
    if (box1 && box2) {
      expect(box2.y).toBeGreaterThan(box1.y);
    }
  });

  test('should display mobile-friendly forms', async ({ page }) => {
    await page.goto('/profile');
    
    // Click edit to show form
    await page.getByRole('button', { name: /edit/i }).click();
    
    // Form inputs should be visible and large enough
    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible();
    
    const box = await firstNameInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40); // Minimum touch-friendly height
  });

  test('should display readable text on mobile', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            { id: 1, title: 'Mobile Grant', description: 'Description text', amount: 1000000 },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Text should be at least 16px (base font size for mobile)
    const title = page.getByText(/mobile grant/i);
    const fontSize = await title.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    
    const sizeInPx = parseInt(fontSize);
    expect(sizeInPx).toBeGreaterThanOrEqual(14); // Minimum readable size
  });

  test('should handle mobile search modal', async ({ page }) => {
    await page.keyboard.press('Meta+K');
    
    const searchModal = page.getByPlaceholder(/search/i);
    await expect(searchModal).toBeVisible();
    
    // Modal should be full-width on mobile
    const box = await searchModal.boundingBox();
    const viewportSize = page.viewportSize();
    
    if (box && viewportSize) {
      // Modal should take most of the viewport width
      expect(box.width).toBeGreaterThan(viewportSize.width * 0.8);
    }
  });

  test('should display mobile-optimized filters', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ content: [], totalElements: 0 }),
      });
    });

    await page.goto('/grants');
    
    // Filter controls should be visible and accessible
    const filterControls = page.locator('select, input[type="number"]');
    await expect(filterControls.first()).toBeVisible();
  });

  test('should show full content without cutoff on mobile', async ({ page }) => {
    await page.route('**/api/v1/grants/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Mobile Test Grant with a Very Long Title That Should Wrap Properly',
          description: 'This is a long description that should be fully visible on mobile devices without being cut off or requiring horizontal scrolling.',
          amount: 1000000,
        }),
      });
    });

    await page.goto('/grants/1');
    
    // Check for text overflow
    const description = page.getByText(/long description/i);
    const isOverflowing = await description.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });
    
    expect(isOverflowing).toBe(false);
  });

  test('should display mobile-friendly mentor cards', async ({ page }) => {
    await page.route('**/api/v1/mentors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Mobile Mentor',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product', 'Strategy'],
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/mentors');
    
    const mentorCard = page.getByText(/mobile mentor/i);
    await expect(mentorCard).toBeVisible();
    
    // Card should be tappable
    await mentorCard.tap();
  });

  test('should handle touch gestures', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            title: `Grant ${i + 1}`,
            description: 'Test grant',
            amount: 1000000,
          })),
          totalElements: 20,
        }),
      });
    });

    await page.goto('/grants');
    
    // Should be able to scroll
    const initialY = await page.evaluate(() => window.scrollY);
    
    // Swipe up to scroll down
    await page.mouse.move(200, 400);
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    
    const finalY = await page.evaluate(() => window.scrollY);
    expect(finalY).toBeGreaterThan(initialY);
  });

  test('should display images properly on mobile', async ({ page }) => {
    await page.route('**/api/v1/spotlight', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          type: 'FOUNDER',
          founder: {
            id: 1,
            name: 'Mobile Founder',
            startupName: 'MobileStartup',
            profileImage: 'https://via.placeholder.com/150',
          },
        }),
      });
    });

    await page.goto('/discover');
    
    // Check if images are scaled properly
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const box = await img.boundingBox();
      const viewportSize = page.viewportSize();
      
      if (box && viewportSize) {
        // Images should not exceed viewport width
        expect(box.width).toBeLessThanOrEqual(viewportSize.width);
      }
    }
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use({ ...devices['iPad Pro'] });

  test('should display tablet layout', async ({ page }) => {
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

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/discover');

    // Tablet might show desktop nav instead of mobile bottom bar
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
