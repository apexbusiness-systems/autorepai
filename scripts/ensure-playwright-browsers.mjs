import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cacheDir = process.env.PLAYWRIGHT_BROWSERS_PATH
  ? process.env.PLAYWRIGHT_BROWSERS_PATH
  : join(process.cwd(), 'node_modules', '.cache', 'ms-playwright');

const hasChromium = () => {
  if (!existsSync(cacheDir)) return false;
  return readdirSync(cacheDir).some((entry) => entry.startsWith('chromium-'));
};

if (hasChromium()) {
  console.log('Playwright Chromium already installed; skipping download.');
  process.exit(0);
}

console.log('Installing Playwright Chromium browser (required for e2e and accessibility tests)...');
const result = spawnSync('npx', ['playwright', 'install', 'chromium'], {
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('Failed to install Playwright Chromium; please check your network connection and retry.');
  process.exit(result.status ?? 1);
}
