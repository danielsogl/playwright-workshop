# Übung 6b – Dialoge & Datei-Downloads (BONUS)

**Ziel:**
Du lernst zwei fortgeschrittene Interaktionen: Browser-Dialoge (alert/confirm/prompt) behandeln und Datei-Downloads testen.

> **🧵 Roter Faden**
> **Anderer Winkel derselben App:** `/dialog-demo` und `/file-download` – eigenständige Bonus-Techniken, kein harter Reuse.
> **Zurückgefallen?** `git switch ex/06b-dialoge-downloads` = Startpunkt dieser Übung, mit den Musterlösungen aller vorherigen Übungen. Die Musterlösung dieser Übung zeigt `git diff ex/06b-dialoge-downloads ex/06c-frames-drag-upload`. Vollständig eigenständig; keine Voraussetzung aus früheren Übungen. Die Musterlösung liegt in `e2e/06b-dialoge.spec.ts` und `e2e/06b-file-download.spec.ts` (der Dateiname weicht von dem in der Aufgabe ab).

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
     await expect(page.getByRole('status')).toContainText('Alert dialog was shown');
   });
   ```

2. **Confirm ablehnen / Prompt beantworten:**
   - `confirm`: mit `dialog.dismiss()` ablehnen und prüfen, dass die App das „Abbrechen" registriert.
   - `prompt`: mit `dialog.accept('mein Text')` bestätigen und den zurückgegebenen Text verifizieren.
   - Jeder Dialog braucht **genau ein** `accept()` oder `dismiss()`, sonst hängt die auslösende Aktion. Ein Handler für mehrere Typen: `switch (dialog.type())` mit `default: await dialog.accept()`.

3. **Bonus `beforeunload`:** „Add BeforeUnload" klicken, dann `await page.close({ runBeforeUnload: true })`. Ohne die Option führt Playwright keine Unload-Handler aus.

4. **Bonus `dialogclosed`:** Das Event `page.on('dialogclosed', …)` (seit v1.63) feuert, nachdem der Dialog beantwortet wurde. Logge damit den Dialog-Typ und prüfe ihn mit `expect.poll`.

   ```typescript
   test('dialogclosed mitloggen', async ({ page }) => {
     await page.goto('/dialog-demo');

     const closed: string[] = [];
     page.on('dialogclosed', (dialog) => closed.push(dialog.type()));
     page.on('dialog', (dialog) => dialog.accept());

     await page.getByRole('button', { name: 'Show alert dialog' }).click();
     await expect.poll(() => closed).toEqual(['alert']);
   });
   ```

## Teil B: Datei-Downloads (`/file-download`)

5. **PDF-Download abfangen und prüfen** – das `download`-Event **vor** dem Klick abwarten:

   ```typescript
   test('PDF herunterladen', async ({ page }) => {
     await page.goto('/file-download');

     const downloadPromise = page.waitForEvent('download');
     await page.getByTestId('download-pdf-button').click();
     const download = await downloadPromise;

     expect(download.suggestedFilename()).toMatch(/\.pdf$/);

     // Erst Fehler prüfen: path() wirft bei fehlgeschlagenem Download
     expect(await download.failure()).toBeNull();
     const filePath = await download.path();
     expect(filePath).toBeTruthy();
   });
   ```

**Was du lernst:**

- `page.on('dialog', …)` + `accept()` / `dismiss()` / `accept(text)`
- `page.close({ runBeforeUnload: true })` für `beforeunload`-Dialoge, `dialogclosed` zum Mitloggen
- `page.waitForEvent('download')`, `download.suggestedFilename()` (synchron), `download.failure()` und `download.path()`

**Zeit:** 15 Minuten
