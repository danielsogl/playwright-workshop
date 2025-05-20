import test from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const todoInput = page.getByRole('textbox', {
    name: 'What needs to be done?',
  });

  await todoInput.fill('Todo');
  await todoInput.press('Enter');

  await page.getByTestId('todo-title').dblclick();

  const editInput = page.getByRole('textbox', { name: 'Edit' });

  await editInput.fill('Todo!!!');
  await editInput.press('Enter');

  await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();
});
