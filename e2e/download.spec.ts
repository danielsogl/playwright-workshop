import { test, expect } from "@playwright/test";

test.describe("Download Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/file-download");
  });

  test('PDF Download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');

    await page.getByRole('button', { name: 'Download PDF' }).click();

    const download = await downloadPromise;

    await download.saveAs('./downloads/' + download.suggestedFilename());

    // prüfe die meta daten des pdfs
    const pdfBuffer = await download.createReadStream();
    const pdfData = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      pdfBuffer.on('data', (chunk) => chunks.push(chunk));
      pdfBuffer.on('end', () => resolve(Buffer.concat(chunks)));
      pdfBuffer.on('error', (err) => reject(err));
    });

    // Überprüfen, dass die PDF-Datei nicht leer ist
    expect(pdfData.length).toBeGreaterThan(0);
  });

});
