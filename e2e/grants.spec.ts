import { test, expect } from '@playwright/test';

test.describe('Grants Flow', () => {
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
          city: 'Hyderabad',
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

  test('should display grants listing page', async ({ page }) => {
    await page.route('**/api/v1/grants**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Startup India Seed Fund',
              description: 'Government seed funding for startups',
              amount: 2000000,
              deadline: '2024-12-31',
              provider: 'Government of India',
              eligibleStages: ['SEED', 'PRE_SEED'],
              eligibleSectors: ['FINTECH', 'HEALTHTECH'],
            },
            {
              id: 2,
              title: 'T-Hub Innovation Grant',
              description: 'Grant for innovative tech startups',
              amount: 500000,
              deadline: '2024-10-31',
              provider: 'T-Hub',
              eligibleStages: ['SEED'],
              eligibleSectors: ['FINTECH'],
            },
          ],
          totalElements: 2,
          totalPages: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    await expect(page.getByRole('heading', { name: /grants/i })).toBeVisible();
    await expect(page.getByText(/startup india seed fund/i)).toBeVisible();
    await expect(page.getByText(/t-hub innovation grant/i)).toBeVisible();
  });

  test('should filter grants by amount', async ({ page }) => {
    await page.route('**/api/v1/grants?page=1&minAmount=500000**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Startup India Seed Fund',
              description: 'Government seed funding',
              amount: 2000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Apply minimum amount filter
    await page.getByLabel(/minimum amount/i).fill('500000');
    
    await expect(page.getByText(/startup india seed fund/i)).toBeVisible();
  });

  test('should toggle AI recommendations', async ({ page }) => {
    let aiRequested = false;

    await page.route('**/api/v1/grants**', async (route) => {
      const url = route.request().url();
      aiRequested = url.includes('ai=true');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Recommended Grant',
              description: 'Perfect match for your startup',
              amount: 1000000,
              aiReason: aiRequested ? 'Matches your stage and sector' : undefined,
              aiScore: aiRequested ? 0.95 : undefined,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Toggle AI on
    await page.getByLabel(/ai recommendations/i).click();
    
    // Check for AI reason badge
    await expect(page.getByText(/matches your stage/i)).toBeVisible();
  });

  test('should navigate to grant detail page', async ({ page }) => {
    await page.route('**/api/v1/grants?page=1**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 1,
              title: 'Startup India Seed Fund',
              description: 'Government seed funding',
              amount: 2000000,
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.route('**/api/v1/grants/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Startup India Seed Fund',
          description: 'Government seed funding for startups',
          amount: 2000000,
          deadline: '2024-12-31',
          provider: 'Government of India',
          eligibleStages: ['SEED', 'PRE_SEED'],
          eligibleSectors: ['FINTECH', 'HEALTHTECH'],
          whatsFunded: 'Product development, team expansion',
          howToApply: 'Apply through the official portal',
          applicationUrl: 'https://example.com/apply',
        }),
      });
    });

    await page.goto('/grants');
    await page.getByText(/startup india seed fund/i).click();
    
    await expect(page).toHaveURL(/\/grants\/1/);
    await expect(page.getByRole('heading', { name: /startup india seed fund/i })).toBeVisible();
  });

  test('should display grant detail information', async ({ page }) => {
    await page.route('**/api/v1/grants/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: 'Startup India Seed Fund',
          description: 'Government seed funding for startups',
          amount: 2000000,
          deadline: '2024-12-31',
          provider: 'Government of India',
          eligibleStages: ['SEED', 'PRE_SEED'],
          eligibleSectors: ['FINTECH', 'HEALTHTECH'],
          whatsFunded: 'Product development, team expansion',
          howToApply: 'Apply through the official portal',
          applicationUrl: 'https://example.com/apply',
        }),
      });
    });

    await page.goto('/grants/1');
    
    await expect(page.getByText(/₹20,00,000/i)).toBeVisible();
    await expect(page.getByText(/government of india/i)).toBeVisible();
    await expect(page.getByText(/product development/i)).toBeVisible();
    await expect(page.getByText(/how to apply/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /apply now/i })).toBeVisible();
  });

  test('should filter by stage', async ({ page }) => {
    await page.route('**/api/v1/grants?page=1&stage=SEED**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 2,
              title: 'Seed Stage Grant',
              description: 'For seed stage startups only',
              amount: 1000000,
              eligibleStages: ['SEED'],
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Select stage filter
    await page.getByLabel(/stage/i).selectOption('SEED');
    
    await expect(page.getByText(/seed stage grant/i)).toBeVisible();
  });

  test('should filter by sector', async ({ page }) => {
    await page.route('**/api/v1/grants?page=1&sector=FINTECH**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: 3,
              title: 'FinTech Innovation Grant',
              description: 'For fintech startups',
              amount: 1500000,
              eligibleSectors: ['FINTECH'],
            },
          ],
          totalElements: 1,
        }),
      });
    });

    await page.goto('/grants');
    
    // Select sector filter
    await page.getByLabel(/sector/i).selectOption('FINTECH');
    
    await expect(page.getByText(/fintech innovation grant/i)).toBeVisible();
  });
});
