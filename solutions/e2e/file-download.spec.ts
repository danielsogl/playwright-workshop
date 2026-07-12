import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('File Download Demo Tests', () => {
  // Downloads-Verzeichnis für Tests erstellen
  const downloadsDir = path.join(import.meta.dirname, '../downloads');

  test.beforeAll(async () => {
    // Downloads-Verzeichnis erstellen falls es nicht existiert
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Zur File Download Seite navigieren
    await page.goto('/file-download');

    // Warten bis die Seite vollständig geladen ist
    await page.waitForLoadState('networkidle');
  });

  test('PDF Download Test', async ({ page }) => {
    // Download-Promise vor dem Klick starten
    const downloadPromise = page.waitForEvent('download');

    // Download-Button für PDF finden und klicken
    await page.getByTestId('download-pdf-button').click();

    // Auf Download warten
    const download = await downloadPromise;

    // Download-Informationen validieren
    const filename = download.suggestedFilename();
    expect(filename).toBe('playwright-demo.pdf');

    console.log('Dateiname:', filename);
    console.log('Download URL:', download.url());

    // Download im Test-Verzeichnis speichern
    const filePath = path.join(downloadsDir, filename);
    await download.saveAs(filePath);

    // Überprüfen ob die Datei existiert
    expect(fs.existsSync(filePath)).toBeTruthy();

    // Dateigröße überprüfen (PDF sollte nicht leer sein)
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);

    console.log(`PDF erfolgreich heruntergeladen: ${filePath}`);
  });

  test('JSON Download Test', async ({ page }) => {
    // Download-Promise vor dem Klick starten
    const downloadPromise = page.waitForEvent('download');

    // Download-Button für JSON finden und klicken
    await page.getByTestId('download-json-button').click();

    // Auf Download warten
    const download = await downloadPromise;

    // Download-Informationen validieren
    const filename = download.suggestedFilename();
    expect(filename).toBe('test-data.json');

    console.log('Dateiname:', filename);

    // Download als Buffer lesen für Validierung
    const buffer = await download.createReadStream();
    const chunks: Buffer[] = [];

    return new Promise<void>((resolve, reject) => {
      buffer.on('data', (chunk) => chunks.push(chunk));
      buffer.on('end', () => {
        const content = Buffer.concat(chunks).toString('utf-8');

        // JSON-Inhalt validieren
        const jsonData = JSON.parse(content);
        expect(jsonData).toHaveProperty('timestamp');
        expect(jsonData).toHaveProperty('user');
        expect(jsonData).toHaveProperty('data');
        expect(Array.isArray(jsonData.data)).toBeTruthy();
        expect(jsonData.data.length).toBe(100);

        console.log('JSON-Inhalt validiert:', {
          timestamp: jsonData.timestamp,
          user: jsonData.user,
          dataCount: jsonData.data.length,
        });

        resolve();
      });
      buffer.on('error', reject);
    });
  });

  test('CSV Download Test', async ({ page }) => {
    // Download-Promise vor dem Klick starten
    const downloadPromise = page.waitForEvent('download');

    // Download-Button für CSV finden und klicken
    await page.getByTestId('download-csv-button').click();

    // Auf Download warten
    const download = await downloadPromise;

    // Download-Informationen validieren
    const filename = download.suggestedFilename();
    expect(filename).toBe('benutzer-daten.csv');

    console.log('Dateiname:', filename);

    // Download im Test-Verzeichnis speichern
    const filePath = path.join(downloadsDir, filename);
    await download.saveAs(filePath);

    // CSV-Inhalt lesen und validieren
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n');

    // Header-Zeile überprüfen
    expect(lines[0]).toBe('Name,Alter,Stadt');

    // Datenzeilen überprüfen
    expect(lines[1]).toBe('Max Mustermann,25,Berlin');
    expect(lines[2]).toBe('Anna Schmidt,30,München');
    expect(lines[3]).toBe('Peter Weber,35,Hamburg');

    console.log('CSV-Inhalt validiert:', lines);
  });

  test('Text Download Test', async ({ page }) => {
    // Download-Promise vor dem Klick starten
    const downloadPromise = page.waitForEvent('download');

    // Download-Button für Text finden und klicken
    await page.getByTestId('download-text-button').click();

    // Auf Download warten
    const download = await downloadPromise;

    // Download-Informationen validieren
    const filename = download.suggestedFilename();
    expect(filename).toBe('demo-text.txt');

    console.log('Dateiname:', filename);

    // Download als Buffer lesen für Validierung
    const buffer = await download.createReadStream();
    const chunks: Buffer[] = [];

    return new Promise<void>((resolve, reject) => {
      buffer.on('data', (chunk) => chunks.push(chunk));
      buffer.on('end', () => {
        const content = Buffer.concat(chunks).toString('utf-8');

        // Text-Inhalt validieren
        expect(content).toContain('Playwright Download Demo');
        expect(content).toContain('PDF Download');
        expect(content).toContain('JSON Download');
        expect(content).toContain('CSV Download');
        expect(content).toContain('Text Download');

        console.log(
          'Text-Inhalt validiert:',
          content.substring(0, 100) + '...',
        );

        resolve();
      });
      buffer.on('error', reject);
    });
  });

  test('Sequenzielle Downloads testen', async ({ page }) => {
    // Ersten Download (PDF) starten
    const pdfDownloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-pdf-button').click();
    const pdfDownload = await pdfDownloadPromise;

    const pdfFilename = pdfDownload.suggestedFilename();
    expect(pdfFilename).toBe('playwright-demo.pdf');

    // Kurz warten bevor nächster Download
    await page.waitForTimeout(500);

    // Zweiten Download (JSON) starten
    const jsonDownloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-json-button').click();
    const jsonDownload = await jsonDownloadPromise;

    const jsonFilename = jsonDownload.suggestedFilename();
    expect(jsonFilename).toBe('test-data.json');

    console.log('Sequenzielle Downloads erfolgreich:', {
      pdfFilename,
      jsonFilename,
    });
  });

  test('Download mit benutzerdefiniertem Pfad', async ({ page }) => {
    // Download-Promise vor dem Klick starten
    const downloadPromise = page.waitForEvent('download');

    // Download triggern
    await page.getByTestId('download-pdf-button').click();

    // Auf Download warten
    const download = await downloadPromise;

    // Download mit benutzerdefiniertem Pfad speichern
    const customPath = path.join(downloadsDir, 'custom-pdf-download.pdf');
    await download.saveAs(customPath);

    // Überprüfen ob die Datei am benutzerdefinierten Pfad existiert
    expect(fs.existsSync(customPath)).toBeTruthy();

    console.log(
      `Download mit benutzerdefiniertem Pfad gespeichert: ${customPath}`,
    );
  });

  test('Download-Status-Anzeige überprüfen', async ({ page }) => {
    // Status-Nachricht sollte zunächst nicht sichtbar sein
    await expect(
      page.locator('text=PDF wird vorbereitet'),
    ).not.toBeVisible();

    // Download-Button klicken
    await page.getByTestId('download-pdf-button').click();

    // Status-Nachricht sollte nach dem Klick erscheinen
    await expect(page.locator('text=PDF wird vorbereitet')).toBeVisible();

    // Nach erfolgreichem Download sollte Erfolgsmeldung erscheinen
    await expect(
      page.locator('text=PDF erfolgreich heruntergeladen!'),
    ).toBeVisible({ timeout: 5000 });
  });

  test.afterAll(async () => {
    // Downloads-Verzeichnis nach Tests aufräumen
    try {
      if (fs.existsSync(downloadsDir)) {
        const files = fs.readdirSync(downloadsDir);
        files.forEach((file) => {
          const filePath = path.join(downloadsDir, file);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            // Ignore errors when deleting individual files
            console.log(
              `Could not delete file ${filePath}:`,
              error instanceof Error ? error.message : String(error),
            );
          }
        });
        try {
          fs.rmdirSync(downloadsDir);
          console.log('Downloads-Verzeichnis aufgeräumt');
        } catch (error) {
          // Ignore errors when deleting directory
          console.log(
            'Could not delete downloads directory:',
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    } catch (error) {
      // Ignore cleanup errors
      console.log(
        'Cleanup error:',
        error instanceof Error ? error.message : String(error),
      );
    }
  });
});
