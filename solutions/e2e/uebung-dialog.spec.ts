import { test, expect } from '@playwright/test';

test.describe('Dialog Handling API Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialog-demo');
  });

  test('should handle alert dialog', async ({ page }) => {
    // Dialog-Handler vor dem Auslösen des Dialogs einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('This is a simple alert dialog!');
      await dialog.accept();
    });

    // Alert-Button klicken
    await page.getByRole('button', { name: 'Show alert dialog' }).click();

    // Ergebnis überprüfen
    await expect(page.getByRole('status')).toContainText(
      'Alert dialog was shown',
    );
  });

  test('should handle confirm dialog - accept', async ({ page }) => {
    // Dialog-Handler zum Akzeptieren des Dialogs einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you want to proceed with this action?');
      await dialog.accept();
    });

    // Bestätigen-Button klicken
    await page.getByRole('button', { name: 'Show confirm dialog' }).click();

    // Ergebnis überprüfen shows OK
    await expect(page.getByRole('status')).toContainText(
      'Confirm dialog result: OK',
    );
  });

  test('should handle confirm dialog - dismiss', async ({ page }) => {
    // Dialog-Handler zum Ablehnen des Dialogs einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you want to proceed with this action?');
      await dialog.dismiss();
    });

    // Bestätigen-Button klicken
    await page.getByRole('button', { name: 'Show confirm dialog' }).click();

    // Ergebnis überprüfen shows Cancel
    await expect(page.getByRole('status')).toContainText(
      'Confirm dialog result: Cancel',
    );
  });

  test('should handle prompt dialog with input', async ({ page }) => {
    const testInput = 'John Doe';

    // Dialog-Handler zum Akzeptieren mit Eingabe einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name:');
      expect(dialog.defaultValue()).toBe('Default Name');
      await dialog.accept(testInput);
    });

    // Prompt-Button klicken
    await page.getByRole('button', { name: 'Show prompt dialog' }).click();

    // Ergebnis überprüfen shows the input
    await expect(page.getByRole('status')).toContainText(
      `Prompt dialog result: ${testInput}`,
    );
  });

  test('should handle prompt dialog - dismiss', async ({ page }) => {
    // Dialog-Handler zum Ablehnen des Dialogs einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name:');
      await dialog.dismiss();
    });

    // Prompt-Button klicken
    await page.getByRole('button', { name: 'Show prompt dialog' }).click();

    // Ergebnis überprüfen shows user cancelled
    await expect(page.getByRole('status')).toContainText(
      'Prompt dialog result: User cancelled',
    );
  });

  test('should handle beforeunload dialog', async ({ page }) => {
    // Dialog-Handler für beforeunload einrichten
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('beforeunload');
      await dialog.accept();
    });

    // Beforeunload-Button klicken
    await page
      .getByRole('button', { name: 'Add BeforeUnload' })
      .click();

    // Überprüfen, dass der Handler hinzugefügt wurde
    await expect(page.getByRole('status')).toContainText(
      'Beforeunload event listener added',
    );

    // Versuchen, wegzunavigieren, um beforeunload auszulösen
    await page.goto('/');

    // Zurückgehen, um zu überprüfen, dass der Dialog behandelt wurde
    await page.goto('/dialog-demo');
  });

  test('should handle custom modal dialog - OK button', async ({ page }) => {
    // Custom-Dialog-Button klicken
    await page
      .getByRole('button', { name: 'Show custom modal dialog' })
      .click();

    // Warten, bis das Custom-Modal erscheint
    await expect(
      page.getByRole('heading', { name: 'Custom Dialog' }),
    ).toBeVisible();

    // OK-Button klicken
    await page.getByRole('button', { name: 'OK' }).click();

    // Ergebnis überprüfen
    await expect(page.getByRole('status')).toContainText(
      'Custom dialog result: OK',
    );
  });

  test('should handle custom modal dialog - Cancel button', async ({
    page,
  }) => {
    // Custom-Dialog-Button klicken
    await page
      .getByRole('button', { name: 'Show custom modal dialog' })
      .click();

    // Warten, bis das Custom-Modal erscheint
    await expect(
      page.getByRole('heading', { name: 'Custom Dialog' }),
    ).toBeVisible();

    // Cancel-Button klicken
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Ergebnis überprüfen
    await expect(page.getByRole('status')).toContainText(
      'Custom dialog result: Cancelled',
    );
  });

  test('should handle custom modal dialog - click outside', async ({
    page,
  }) => {
    // Custom-Dialog-Button klicken
    await page
      .getByRole('button', { name: 'Show custom modal dialog' })
      .click();

    // Warten, bis das Custom-Modal erscheint
    await expect(
      page.getByRole('heading', { name: 'Custom Dialog' }),
    ).toBeVisible();

    // Außerhalb des Dialogs klicken (auf den Hintergrund) - Koordinaten-Klick versuchen
    await page.click('body', { position: { x: 10, y: 10 } });

    // Ergebnis überprüfen
    await expect(page.getByRole('status')).toContainText(
      'Custom dialog result: Cancelled (clicked outside)',
    );
  });

  test('should handle multiple dialogs in sequence', async ({ page }) => {
    let dialogCount = 0;

    // Dialog-Handler für mehrere Dialoge einrichten
    page.on('dialog', async (dialog) => {
      dialogCount++;

      if (dialog.type() === 'alert') {
        expect(dialog.message()).toBe('This is a simple alert dialog!');
        await dialog.accept();
      } else if (dialog.type() === 'confirm') {
        expect(dialog.message()).toBe(
          'Do you want to proceed with this action?',
        );
        await dialog.accept();
      }
    });

    // Alert-Button klicken
    await page.getByRole('button', { name: 'Show alert dialog' }).click();
    await expect(page.getByRole('status')).toContainText(
      'Alert dialog was shown',
    );

    // Bestätigen-Button klicken
    await page.getByRole('button', { name: 'Show confirm dialog' }).click();
    await expect(page.getByRole('status')).toContainText(
      'Confirm dialog result: OK',
    );

    // Überprüfen, dass wir 2 Dialoge behandelt haben
    expect(dialogCount).toBe(2);
  });

  test('should demonstrate dialog handler timing', async ({ page }) => {
    const dialogMessages: string[] = [];

    // Dialog-Handler einrichten, der Nachrichten sammelt
    page.on('dialog', async (dialog) => {
      dialogMessages.push(dialog.message());
      await dialog.accept();
    });

    // Ersten Dialog auslösen und auf Ergebnis warten
    await page.getByRole('button', { name: 'Show alert dialog' }).click();
    await expect(page.getByRole('status')).toContainText(
      'Alert dialog was shown',
    );

    // Zweiten Dialog auslösen und auf Ergebnis warten
    await page.getByRole('button', { name: 'Show confirm dialog' }).click();
    await expect(page.getByRole('status')).toContainText(
      'Confirm dialog result: OK',
    );

    // Überprüfen, dass wir beide Dialog-Nachrichten erfasst haben
    expect(dialogMessages).toHaveLength(2);
    expect(dialogMessages[0]).toBe('This is a simple alert dialog!');
    expect(dialogMessages[1]).toBe('Do you want to proceed with this action?');
  });
});
