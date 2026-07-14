import { test, expect } from '@playwright/test';

test('Todo Test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  const todoList = page.getByRole('list');
  const todoItem = todoList.getByTestId('todo-item').nth(0);
  const todoItemByText = todoList.getByTestId('todo-item').filter({ hasText: 'Buy milk' });
});
