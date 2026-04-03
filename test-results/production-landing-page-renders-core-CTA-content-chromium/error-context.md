# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.ts >> landing page renders core CTA content
- Location: tests/e2e/production.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Close More Deals/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Close More Deals/i })

```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  |
  3  | test('landing page renders core CTA content', async ({ page }) => {
  4  |   await page.goto('/');
  5  |
  6  |   // Use a regex to match the heading text which might be split across elements
  7  |   await expect(
  8  |     page.getByRole('heading', { name: /Close More Deals/i }),
> 9  |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  10 |
  11 |   // Verify the primary CTA button
  12 |   await expect(page.getByRole('link', { name: /Start Free Trial/i })).toBeVisible();
  13 | });
  14 |
```