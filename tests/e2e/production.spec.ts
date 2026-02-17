import { expect, test } from '@playwright/test';

test('landing page renders core CTA content', async ({ page }) => {
  await page.goto('/');

  // Use a regex to match the heading text which might be split across elements
  await expect(
    page.getByRole('heading', { name: /Close More Deals/i }),
  ).toBeVisible();

  // Verify the primary CTA button
  await expect(page.getByRole('link', { name: /Start Free Trial/i })).toBeVisible();
});
