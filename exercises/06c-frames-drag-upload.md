# Übung 6c – Frames, Drag & Drop und Uploads (BONUS)

**Ziel:**
Du testest Interaktionen, für die die Demo-App keine Seite hat: Inhalte in iframes, Drag & Drop und Datei-Uploads. Die Testseiten baust du mit `page.setContent()` selbst.

> **🧵 Roter Faden**
> **Anderer Winkel derselben Technik:** Wie in Übung 6b arbeitest du mit Browser-Features, die nicht über normale Klicks laufen. Eigenständige Bonus-Übung, kein harter Reuse.
> **Zurückgefallen?** `git switch ex/06c-frames-drag-upload` = Startpunkt dieser Übung, mit den Musterlösungen aller vorherigen Übungen. Die Musterlösung dieser Übung zeigt `git diff ex/06c-frames-drag-upload ex/07-authentifizierung`. Die Musterlösung liegt in `e2e/06c-frames-drag-upload.spec.ts`.

**Vorbereitung:** Lege `e2e/frames-drag-upload.spec.ts` an. Alle Tests bauen ihre Seite selbst:

```typescript
import { test, expect } from '@playwright/test';

test('Beispiel: Seite mit setContent bauen', async ({ page }) => {
  await page.setContent('<button>Hallo</button>');
  await expect(page.getByRole('button', { name: 'Hallo' })).toBeVisible();
});
```

## Teil A: Frames

1. **Button im iframe klicken:** Baue mit `setContent()` einen `iframe` mit `srcdoc`. Darin ein Button „Pay Now“ und ein `<p role="status">`, das nach dem Klick „paid“ zeigt.

   ```typescript
   await page.setContent(`
     <iframe srcdoc="
       <button id='pay'>Pay Now</button>
       <p id='out' role='status'></p>
       <script>
         document.getElementById('pay').onclick = () => {
           document.getElementById('out').textContent = 'paid';
         };
       </script>"></iframe>`);
   ```

2. **Mit `frameLocator()` arbeiten:** `page.frameLocator('iframe')` wartet auf den Frame, `getByRole` sucht darin.

   ```typescript
   const frame = page.frameLocator('iframe');
   await frame.getByRole('button', { name: 'Pay Now' }).click();
   await expect(frame.getByRole('status')).toHaveText('paid');
   ```

3. **Bonus: verschachtelte iframes:** Ein `iframe`, der einen weiteren `iframe` enthält. Verkette `frameLocator().frameLocator()`.

   > **Hinweis:** Seit v1.64 gelten Elemente in **versteckten** iframes als hidden: Aktionen und Assertions behandeln sie wie versteckte Elemente.

## Teil B: Drag & Drop

4. **Dropzone bauen:** Ein `div` mit `draggable="true"` und eine Zone mit `dragover`-Handler (`preventDefault()`, sonst lehnt die Zone den Drop ab) und `drop`-Handler, der „dropped“ in die Zone schreibt.

   ```typescript
   await page.setContent(`
     <div draggable="true">Drag me</div>
     <div id="zone" style="width: 200px; height: 100px; border: 1px solid">Drop here</div>
     <script>
       const zone = document.getElementById('zone');
       zone.addEventListener('dragover', (event) => event.preventDefault());
       zone.addEventListener('drop', (event) => {
         event.preventDefault();
         zone.textContent = 'dropped';
       });
     </script>`);
   ```

5. **Mit `dragTo()` ziehen** und den Text prüfen:

   ```typescript
   await page.getByText('Drag me').dragTo(page.getByText('Drop here'));
   await expect(page.getByText('dropped')).toBeVisible();
   ```

## Teil C: Uploads

6. **`setInputFiles` mit Buffer:** `<input type="file">` mit Label und ein `<p role="status">`, das den Dateinamen zeigt. Die Datei kommt aus dem Speicher, es ist keine Datei auf der Platte nötig:

   ```typescript
   await page.getByLabel('Datei').setInputFiles({
     name: 'hallo.txt',
     mimeType: 'text/plain',
     buffer: Buffer.from('Hallo Playwright'),
   });
   await expect(page.getByRole('status')).toHaveText('hallo.txt');
   ```

7. **Datei auf eine Dropzone legen:** Eine Zone mit `drop`-Handler, der `event.dataTransfer.files` ausliest. Lege die Datei mit `locator.drop()` (seit v1.60) ab:

   ```typescript
   await page.getByText('Drop files').drop({
     files: { name: 'bericht.txt', mimeType: 'text/plain', buffer: Buffer.from('Inhalt') },
   });
   await expect(page.getByRole('status')).toHaveText('bericht.txt');
   ```

**Was du lernst:**

- `frameLocator()` für Inhalte in iframes, auch verschachtelt
- `dragTo()` und die Rolle von `dragover` + `preventDefault()`
- `setInputFiles` mit Buffer, `locator.drop({ files })` für Dropzones
- Eigene Testseiten mit `page.setContent()`, wenn die App keine passende Seite hat

**Zeit:** 20 Minuten (optional)
