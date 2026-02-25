import test, { expect } from '@playwright/test';

test('Smoke test', async ({ page }) => {
  await page.goto('/');

  const menuItem = page.getByRole('menuitem', { name: 'Navigate to Public News' });
  console.log('Menu item text content:', await menuItem.textContent());
  await page.getByRole('menuitem', { name: 'Navigate to Public News' }).click();
});


test("Login User", async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Submit sign in form' }).click();

  // await expect(page).toHaveURL('/');

  await page.waitForURL('/');

  const navItemCount = page.getByRole('menuitem')
  // expect(navItemCount).toEqual(6);

  await expect.soft(navItemCount).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'User profile actions menu' })).toBeVisible();
});


test('Should delete todo item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
  await todoInput.fill('Buy milk');
  await todoInput.press('Enter');

  const todoItem = page.getByTestId('todo-item');

  await todoItem.hover();

  const deleteButton = todoItem.getByRole('button', { name: 'Delete' });
  await deleteButton.click();
});