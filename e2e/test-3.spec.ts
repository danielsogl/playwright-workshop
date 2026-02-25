import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/sigin');
  await page.getByRole('textbox', { name: 'Email address for sign in' }).fill('test@example.com');

  await page.getByRole('checkbox').check();




  // await page.getByRole('textbox', { name: 'Password for sign in Password*' })
  //   .fill('password');



  // await page.getByRole('textbox', { name: 'Password for sign in Password*' }).press('Enter');
  // await page.getByRole('button', { name: 'Submit sign in form' }).click();
});