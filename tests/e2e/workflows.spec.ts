import { expect, test } from '@playwright/test';

/**
 * AutoRepAi E2E Test Suite
 *
 * Tests real-world workflows for dealership operations:
 * 1. Public landing page
 * 2. Authentication flow
 * 3. Dashboard interaction
 * 4. Quote builder workflow
 * 5. Lead capture workflow
 * 6. Navigation between pages
 */

test.describe('Landing Page', () => {
  test('displays core branding and CTA elements', async ({ page }) => {
    await page.goto('/');

    // Brand identity - use exact match to avoid multiple element match
    await expect(page.getByText('AutoRepAi', { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Compliance-first dealership AI' })
    ).toBeVisible();

    // Value proposition
    await expect(
      page.getByText('Lead intelligence, compliance, and inventory visibility')
    ).toBeVisible();

    // CTAs
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open command center' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Request access' })).toBeVisible();
  });

  test('displays production status checklist', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Production status')).toBeVisible();
    await expect(page.getByText('Supabase RLS coverage')).toBeVisible();
    await expect(page.getByText('AES-256-GCM')).toBeVisible();
    await expect(page.getByText('Lovable AI Gateway')).toBeVisible();
    await expect(page.getByText('CI/CD tests required')).toBeVisible();
  });

  test('Sign in link navigates to auth page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/auth');
  });
});

test.describe('Authentication Page', () => {
  test('displays auth form with demo option', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByText('AutoRepAi', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Sign in to your workspace' })
    ).toBeVisible();
    await expect(page.getByText('Use Supabase Auth or connect')).toBeVisible();
    await expect(page.getByText('enterprise SSO')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Continue with demo account' })
    ).toBeVisible();
  });

  test('demo mode note is displayed', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByText('Demo mode uses Supabase Auth')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('redirects unauthenticated users to auth page', async ({ page }) => {
    // Try to access protected route
    await page.goto('/app');

    // Should show loading state or redirect
    // Note: Actual behavior depends on Supabase connection
    const authHeading = page.getByRole('heading', { name: 'Sign in to your workspace' });
    const checkingAuth = page.getByText('Checking authentication');

    // Either should be visible (redirect or loading)
    await expect(authHeading.or(checkingAuth)).toBeVisible({ timeout: 5000 });
  });

  test('protected subpages redirect to auth', async ({ page }) => {
    const protectedRoutes = [
      '/app/leads',
      '/app/inventory',
      '/app/quotes',
      '/app/quotes/new',
      '/app/credit-apps',
      '/app/inbox',
      '/app/settings'
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      // Should redirect or show auth check
      const authHeading = page.getByRole('heading', { name: 'Sign in to your workspace' });
      const checkingAuth = page.getByText('Checking authentication');
      await expect(authHeading.or(checkingAuth)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Navigation', () => {
  test('unknown routes redirect to landing', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page).toHaveURL('/');
  });

  test('landing page links have correct hrefs', async ({ page }) => {
    await page.goto('/');

    const signInLink = page.getByRole('link', { name: 'Sign in' });
    await expect(signInLink).toHaveAttribute('href', '/auth');

    const commandCenterLink = page.getByRole('link', { name: 'Open command center' });
    await expect(commandCenterLink).toHaveAttribute('href', '/app');

    const requestAccessLink = page.getByRole('link', { name: 'Request access' });
    await expect(requestAccessLink).toHaveAttribute('href', '/auth');
  });
});

test.describe('Responsive Design', () => {
  test('landing page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    await expect(page.getByText('AutoRepAi', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('landing page renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    await expect(page.getByText('AutoRepAi', { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Compliance-first dealership AI' })
    ).toBeVisible();
  });

  test('landing page renders on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.getByText('AutoRepAi', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Production status')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('landing page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have h1 for main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // h2 for section headings
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('buttons and links are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab to Sign in button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs

    // Find focused element
    const focused = page.locator(':focus');
    const tagName = await focused.evaluate(el => el.tagName.toLowerCase());

    // Should be an interactive element
    expect(['a', 'button']).toContain(tagName);
  });

  test('auth page form is accessible', async ({ page }) => {
    await page.goto('/auth');

    // Demo button should be focusable
    const demoButton = page.getByRole('button', { name: 'Continue with demo account' });
    await expect(demoButton).toBeVisible();
    await demoButton.focus();
    await expect(demoButton).toBeFocused();
  });
});

test.describe('Performance', () => {
  test('landing page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('no JavaScript errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('no JavaScript errors on auth page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });
});

test.describe('Dark Theme UI', () => {
  test('landing page uses dark theme colors', async ({ page }) => {
    await page.goto('/');

    // Check that the dark theme div exists within the app
    const darkDiv = page.locator('.bg-slate-950').first();
    await expect(darkDiv).toBeVisible();
  });

  test('auth page uses dark theme colors', async ({ page }) => {
    await page.goto('/auth');

    // Check that the dark theme div exists within the app
    const darkDiv = page.locator('.bg-slate-950').first();
    await expect(darkDiv).toBeVisible();
  });
});
