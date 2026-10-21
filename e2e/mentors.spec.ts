import { test, expect } from '@playwright/test';

test.describe('Mentors Flow', () => {
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
          stage: 'SEED',
          sector: 'FINTECH',
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

  test('should display mentors listing page', async ({ page }) => {
    await page.route('**/api/v1/mentors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product Strategy', 'Fundraising'],
              bio: 'Experienced product leader',
            },
            {
              id: 2,
              name: 'Michael Chen',
              title: 'CTO',
              company: 'StartupXYZ',
              expertise: ['Engineering', 'Scaling'],
              bio: 'Tech veteran',
            },
          ],
          totalElements: 2,
          totalPages: 1,
        }),
      });
    });

    await page.goto('/mentors');
    
    await expect(page.getByRole('heading', { name: /mentors/i })).toBeVisible();
    await expect(page.getByText(/sarah johnson/i)).toBeVisible();
    await expect(page.getByText(/michael chen/i)).toBeVisible();
  });

  test('should filter mentors by expertise', async ({ page }) => {
    await page.route('**/api/v1/mentors?page=1&expertise=Fundraising**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product Strategy', 'Fundraising'],
              bio: 'Fundraising expert',
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/mentors');
    
    // Select expertise filter
    await page.getByLabel(/expertise/i).selectOption('Fundraising');
    
    await expect(page.getByText(/sarah johnson/i)).toBeVisible();
  });

  test('should toggle AI recommendations for mentors', async ({ page }) => {
    let aiRequested = false;

    await page.route('**/api/v1/mentors**', async (route) => {
      const url = route.request().url();
      aiRequested = url.includes('ai=true');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product Strategy', 'Fundraising'],
              aiReason: aiRequested ? 'Perfect match for your stage and sector' : undefined,
              aiScore: aiRequested ? 0.92 : undefined,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/mentors');
    
    // Toggle AI on
    await page.getByLabel(/ai recommendations/i).click();
    
    // Check for AI reason badge
    await expect(page.getByText(/perfect match/i)).toBeVisible();
  });

  test('should navigate to mentor detail page', async ({ page }) => {
    await page.route('**/api/v1/mentors?page=1**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product Strategy', 'Fundraising'],
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.route('**/api/v1/mentors/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Sarah Johnson',
          title: 'VP of Product',
          company: 'TechCorp',
          expertise: ['Product Strategy', 'Fundraising'],
          bio: 'Experienced product leader with 15+ years in tech',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          calendarUrl: 'https://cal.com/sarah-johnson',
        }),
      });
    });

    await page.goto('/mentors');
    await page.getByText(/sarah johnson/i).click();
    
    await expect(page).toHaveURL(/\/mentors\/1/);
    await expect(page.getByRole('heading', { name: /sarah johnson/i })).toBeVisible();
  });

  test('should display mentor detail information', async ({ page }) => {
    await page.route('**/api/v1/mentors/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Sarah Johnson',
          title: 'VP of Product',
          company: 'TechCorp',
          expertise: ['Product Strategy', 'Fundraising', 'Go-to-Market'],
          bio: 'Experienced product leader with 15+ years in tech. Helped 20+ startups scale from seed to Series B.',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          twitterUrl: 'https://twitter.com/sarahjohnson',
          calendarUrl: 'https://cal.com/sarah-johnson',
        }),
      });
    });

    await page.goto('/mentors/1');
    
    await expect(page.getByText(/vp of product/i)).toBeVisible();
    await expect(page.getByText(/techcorp/i)).toBeVisible();
    await expect(page.getByText(/product strategy/i)).toBeVisible();
    await expect(page.getByText(/fundraising/i)).toBeVisible();
    await expect(page.getByText(/helped 20\+ startups/i)).toBeVisible();
  });

  test('should display social links on mentor profile', async ({ page }) => {
    await page.route('**/api/v1/mentors/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Sarah Johnson',
          title: 'VP of Product',
          company: 'TechCorp',
          expertise: ['Product Strategy'],
          bio: 'Product leader',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          twitterUrl: 'https://twitter.com/sarahjohnson',
          calendarUrl: 'https://cal.com/sarah-johnson',
        }),
      });
    });

    await page.goto('/mentors/1');
    
    // Check for social link buttons
    const linkedinLink = page.getByRole('link', { name: /linkedin/i });
    const twitterLink = page.getByRole('link', { name: /twitter/i });
    
    await expect(linkedinLink).toBeVisible();
    await expect(twitterLink).toBeVisible();
    
    // Verify they have correct href
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/sarahjohnson');
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/sarahjohnson');
  });

  test('should display booking button and Cal.com integration', async ({ page }) => {
    await page.route('**/api/v1/mentors/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Sarah Johnson',
          title: 'VP of Product',
          company: 'TechCorp',
          expertise: ['Product Strategy'],
          bio: 'Product leader',
          calendarUrl: 'https://cal.com/sarah-johnson',
        }),
      });
    });

    await page.goto('/mentors/1');
    
    const bookButton = page.getByRole('button', { name: /book a session/i });
    await expect(bookButton).toBeVisible();
    await expect(bookButton).toBeEnabled();
    
    // Click should trigger Cal.com modal or redirect
    await bookButton.click();
    
    // Cal.com integration would open in modal or new window
    // Since we can't fully test Cal.com integration in E2E, we just verify the button exists
  });

  test('should show empty state when no mentors match filters', async ({ page }) => {
    await page.route('**/api/v1/mentors?page=1&expertise=RareSkill**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [],
          totalElements: 0,
          totalPages: 0,
        }),
      });
    });

    await page.goto('/mentors?expertise=RareSkill');
    
    await expect(page.getByText(/no mentors found/i)).toBeVisible();
  });

  test('should search mentors by name', async ({ page }) => {
    await page.route('**/api/v1/mentors?page=1&search=Sarah**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'VP of Product',
              company: 'TechCorp',
              expertise: ['Product Strategy'],
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/mentors');
    
    // Type in search box
    await page.getByPlaceholder(/search mentors/i).fill('Sarah');
    
    await expect(page.getByText(/sarah johnson/i)).toBeVisible();
  });
});
