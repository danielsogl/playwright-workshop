# Übung 6b – Dialoge & Datei-Downloads (BONUS)

**Ziel:**
Du lernst zwei fortgeschrittene Interaktionen: Browser-Dialoge (alert/confirm/prompt) behandeln und Datei-Downloads testen.

## Teil A: Dialoge (`/dialog-demo`)

1. **Alert automatisch bestätigen** – wichtig: den `dialog`-Handler **vor** dem Auslösen registrieren, sonst wird der Dialog automatisch geschlossen.

   ```typescript
   import { test, expect } from '@playwright/test';

   test('Alert-Dialog behandeln', async ({ page }) => {
     await page.goto('/dialog-demo');

     page.on('dialog', async (dialog) => {
       expect(dialog.type()).toBe('alert');
       await dialog.accept();
     });

     await page.getByRole('button', { name: 'Show alert dialog' }).click();
     await expect(page.getByRole('status')).toContainText('accepted');
   });
   ```

2. **Confirm ablehnen / Prompt beantworten:**
   - `confirm`: mit `dialog.dismiss()` ablehnen und prüfen, dass die App das „Abbrechen" registriert.
   - `prompt`: mit `dialog.accept('mein Text')` bestätigen und den zurückgegebenen Text verifizieren.

## Teil B: Datei-Downloads (`/file-download`)

3. **PDF-Download abfangen und prüfen** – das `download`-Event **vor** dem Klick abwarten:

   ```typescript
   test('PDF herunterladen', async ({ page }) => {
     await page.goto('/file-download');

     const downloadPromise = page.waitForEvent('download');
     await page.getByTestId('download-pdf-button').click();
     const download = await downloadPromise;

     expect(download.suggestedFilename()).toMatch(/\.pdf$/);
     const filePath = await download.path();
     expect(filePath).toBeTruthy();
   });
   ```

**Was du lernst:**

- `page.on('dialog', …)` + `accept()` / `dismiss()` / `accept(text)`
- `page.waitForEvent('download')`, `download.suggestedFilename()` und `download.path()`

**Zeit:** 15 Minuten
