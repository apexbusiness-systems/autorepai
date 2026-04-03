const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/app');
  await page.waitForTimeout(2000); // Wait for rendering
  await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to dashboard-screenshot.png');
})();
