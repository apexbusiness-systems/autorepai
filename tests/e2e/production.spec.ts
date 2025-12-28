import { expect, test } from '@playwright/test';

test('landing page renders core CTA content', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Compliance-first dealership AI' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
});
