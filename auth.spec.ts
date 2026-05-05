import { test } from '@playwright/test';


test('Save login session', async ({ page }) => {
  await page.goto('https://zilo.one/');
  await page.pause();
  await page.context().storageState({ path: '../auth.json' });
  console.log('✅ Session saved to auth.json');
});