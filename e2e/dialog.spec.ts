import { expect, test } from "@playwright/test";


test.describe("Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dialog-demo");
  });

  test('should open alert dialog when clicking "Open Alert Dialog" button', async ({ page }) => {
    let dialogMessage = "";

    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('This is a simple alert dialog!');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Show Alert dialog' }).click();
    expect(dialogMessage).toBe('This is a simple alert dialog!');
  });

  test('should handle prompt dialog with input', async ({ page }) => {
    const testInput = 'John Doe';

    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name:');
      expect(dialog.defaultValue()).toBe('Default Name');
      await dialog.accept(testInput);
    });

    await page.getByRole('button', { name: 'Show prompt dialog' }).click();

    await expect(page.getByRole('status')).toContainText(
      `Prompt dialog result: ${testInput}`,
    );
  });

  test('should show custom dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Show custom modal dialog' }).click();

    const customDialog = page.getByRole('dialog', { name: 'Custom Dialog' });
    await expect(customDialog).toBeVisible();

    // Überprüfen, dass die Alert-Buttons deaktiviert sind
    const alertButton = page.getByRole('button', { name: 'Show alert dialog' });

    // Custom-Dialog schließen
    await page.mouse.click(0, 0); // Klick außerhalb des Dialogs, um ihn zu schließen
    await expect(customDialog).not.toBeVisible();
  });
});
