# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> homepage visual regression
- Location: tests/e2e/visual.spec.ts:3:1

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1280px by 959px, received 1280px by 720px. 1092424 pixels (ratio 0.89 of all image pixels) are different.

  Snapshot: homepage.png

Call log:
  - Expect "toHaveScreenshot(homepage.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 959px, received 1280px by 720px. 1092424 pixels (ratio 0.89 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1280px by 959px, received 1280px by 720px. 1092424 pixels (ratio 0.89 of all image pixels) are different.

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 |
  3 | test('homepage visual regression', async ({ page }) => {
  4 |   await page.goto('/');
> 5 |   await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
    |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  6 | });
  7 |
```