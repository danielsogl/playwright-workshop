import { test } from '@playwright/test';

test('Zeige Code Gen Feature', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await page.locator('html').click();
  await page.getByRole('textbox', { name: 'kaskdakdklasd' }).press('ControlOrMeta++');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('ControlOrMeta++');
  await page.locator('html').dblclick();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Todo');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();
  await page.getByRole('button', { name: 'Clear completed' }).click();
});
