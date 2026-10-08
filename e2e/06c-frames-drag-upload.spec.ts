import { test, expect } from '@playwright/test';

// Die Demo-App hat keine Seiten für Frames, Drag & Drop und Uploads:
// die Testseiten entstehen mit page.setContent() direkt im Test.
test.describe('Übung 6c - Frames, Drag & Drop und Uploads', () => {
  test.describe('Frames', () => {
    test('klickt einen Button im iframe', async ({ page }) => {
      await page.setContent(`
        <iframe srcdoc="
          <button id='pay'>Pay Now</button>
          <p id='out' role='status'></p>
          <script>
            document.getElementById('pay').onclick = () => {
              document.getElementById('out').textContent = 'paid';
            };
          </script>"></iframe>`);

      // frameLocator() wartet auf den Frame, getByRole sucht darin
      const frame = page.frameLocator('iframe');
      await frame.getByRole('button', { name: 'Pay Now' }).click();
      await expect(frame.getByRole('status')).toHaveText('paid');
    });

    test('bonus: verschachtelte iframes', async ({ page }) => {
      await page.setContent(
        `<iframe srcdoc="<iframe srcdoc='<button>Deep Button</button>'></iframe>"></iframe>`,
      );

      const inner = page.frameLocator('iframe').frameLocator('iframe');
      await expect(
        inner.getByRole('button', { name: 'Deep Button' }),
      ).toBeVisible();
    });
  });

  test.describe('Drag & Drop', () => {
    test('zieht ein Element in die Dropzone', async ({ page }) => {
      await page.setContent(`
        <div draggable="true">Drag me</div>
        <div id="zone" style="width: 200px; height: 100px; border: 1px solid">Drop here</div>
        <script>
          const zone = document.getElementById('zone');
          // ohne preventDefault() lehnt die Zone den Drop ab
          zone.addEventListener('dragover', (event) => event.preventDefault());
          zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.textContent = 'dropped';
          });
        </script>`);

      await page.getByText('Drag me').dragTo(page.getByText('Drop here'));
      await expect(page.getByText('dropped')).toBeVisible();
    });
  });

  test.describe('Uploads', () => {
    test('setInputFiles mit Buffer', async ({ page }) => {
      await page.setContent(`
        <label>Datei <input type="file"></label>
        <p role="status"></p>
        <script>
          document.querySelector('input').addEventListener('change', (event) => {
            document.querySelector('p').textContent = event.target.files[0].name;
          });
        </script>`);

      await page.getByLabel('Datei').setInputFiles({
        name: 'hallo.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Hallo Playwright'),
      });

      await expect(page.getByRole('status')).toHaveText('hallo.txt');
    });

    test('locator.drop mit Dateien (seit v1.60)', async ({ page }) => {
      await page.setContent(`
        <div id="zone" style="width: 200px; height: 100px; border: 1px solid">Drop files</div>
        <p role="status"></p>
        <script>
          const zone = document.getElementById('zone');
          zone.addEventListener('dragover', (event) => event.preventDefault());
          zone.addEventListener('drop', (event) => {
            event.preventDefault();
            document.querySelector('p').textContent = [...event.dataTransfer.files]
              .map((file) => file.name)
              .join(', ');
          });
        </script>`);

      await page.getByText('Drop files').drop({
        files: {
          name: 'bericht.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Inhalt'),
        },
      });

      await expect(page.getByRole('status')).toHaveText('bericht.txt');
    });
  });
});
