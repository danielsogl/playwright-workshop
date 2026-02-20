'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { title, subtitle } from '@/components/primitives';
import jsPDF from 'jspdf';

export default function FileDownloadPage() {
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  // Funktion zum Generieren von Testdaten
  const generateTestData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      user: 'Test User',
      data: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Test Item ${i + 1}`,
        value: Math.random() * 1000,
      })),
    };
    return JSON.stringify(data, null, 2);
  };

  // PDF Download Handler mit jsPDF
  const handlePdfDownload = () => {
    setDownloadStatus('PDF wird vorbereitet\u2026');

    // Simuliere PDF-Generierung
    setTimeout(() => {
      // Neues PDF-Dokument erstellen
      const doc = new jsPDF();

      // Titel hinzufügen
      doc.setFontSize(20);
      doc.text('Playwright Download Demo', 20, 30);

      // Untertitel hinzufügen
      doc.setFontSize(14);
      doc.text('Eine Demonstration der Playwright File Download API', 20, 50);

      // Linie hinzufügen
      doc.line(20, 60, 190, 60);

      // Inhalt hinzufügen
      doc.setFontSize(12);
      const content = [
        'Diese PDF-Datei wurde mit jsPDF generiert und demonstriert',
        'verschiedene Aspekte der Playwright Download-API:',
        '',
        '• PDF-Downloads testen',
        '• Dateinamen validieren',
        '• Dateigröße überprüfen',
        '• Dateiinhalt validieren',
        '',
        'Generiert am: ' + new Date().toLocaleString('de-DE'),
        'Test-ID: ' + Math.random().toString(36).substr(2, 9),
      ];

      content.forEach((line, index) => {
        doc.text(line, 20, 80 + index * 8);
      });

      // PDF als Blob erstellen und herunterladen
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'playwright-demo.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus('PDF erfolgreich heruntergeladen!');
    }, 1000);
  };

  // JSON Download Handler
  const handleJsonDownload = () => {
    setDownloadStatus('JSON wird vorbereitet\u2026');

    setTimeout(() => {
      const jsonData = generateTestData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus('JSON erfolgreich heruntergeladen!');
    }, 500);
  };

  // CSV Download Handler
  const handleCsvDownload = () => {
    setDownloadStatus('CSV wird vorbereitet\u2026');

    setTimeout(() => {
      const csvContent =
        'Name,Alter,Stadt\nMax Mustermann,25,Berlin\nAnna Schmidt,30,München\nPeter Weber,35,Hamburg';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'benutzer-daten.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus('CSV erfolgreich heruntergeladen!');
    }, 500);
  };

  // Text Download Handler
  const handleTextDownload = () => {
    setDownloadStatus('Text wird vorbereitet\u2026');

    setTimeout(() => {
      const textContent = `Playwright Download Demo
========================

Dies ist eine Demo-Seite für das Testen von Datei-Downloads mit Playwright.

Funktionen:
- PDF Download
- JSON Download  
- CSV Download
- Text Download

Erstellt am: ${new Date().toLocaleString('de-DE')}`;

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'demo-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus('Text erfolgreich heruntergeladen!');
    }, 300);
  };

  return (
    <main className="flex flex-col gap-8 py-8 md:py-10">
      {/* Header */}
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1 className={title()} id="download-title">
            File Download Demo
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            Diese Seite demonstriert verschiedene Datei-Download-Szenarien für
            Playwright-Tests. Testen Sie die verschiedenen Download-Buttons und
            beobachten Sie, wie Playwright diese Interaktionen erfassen kann.
          </p>
        </div>
      </section>

      {/* Download Status */}
      {downloadStatus && (
        <Card className="w-full max-w-md mx-auto" role="status" aria-live="polite">
          <CardBody className="text-center">
            <p className="text-sm text-default-600">{downloadStatus}</p>
          </CardBody>
        </Card>
      )}

      {/* Download Buttons */}
      <section className="flex flex-col gap-6">
        <h2 className={title({ size: 'sm', class: 'text-center' })}>
          Download-Optionen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Download */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">PDF Download</h3>
            </CardHeader>
            <CardBody className="gap-4">
              <p className="text-sm text-default-600">
                Generiert und lädt eine PDF-Datei mit jsPDF herunter. Ideal für
                das Testen von PDF-Downloads in Playwright-Tests.
              </p>
              <Button
                color="primary"
                variant="solid"
                onPress={handlePdfDownload}
                className="w-full"
                data-testid="download-pdf-button"
              >
                Download PDF
              </Button>
            </CardBody>
          </Card>

          {/* JSON Download */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">JSON Download</h3>
            </CardHeader>
            <CardBody className="gap-4">
              <p className="text-sm text-default-600">
                Lädt eine JSON-Datei mit Testdaten herunter. Nützlich für das
                Testen von API-Response-Downloads.
              </p>
              <Button
                color="secondary"
                variant="solid"
                onPress={handleJsonDownload}
                className="w-full"
                data-testid="download-json-button"
              >
                Download JSON
              </Button>
            </CardBody>
          </Card>

          {/* CSV Download */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">CSV Download</h3>
            </CardHeader>
            <CardBody className="gap-4">
              <p className="text-sm text-default-600">
                Lädt eine CSV-Datei mit Benutzerdaten herunter. Perfekt für das
                Testen von Datenexport-Funktionen.
              </p>
              <Button
                color="success"
                variant="solid"
                onPress={handleCsvDownload}
                className="w-full"
                data-testid="download-csv-button"
              >
                Download CSV
              </Button>
            </CardBody>
          </Card>

          {/* Text Download */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Text Download</h3>
            </CardHeader>
            <CardBody className="gap-4">
              <p className="text-sm text-default-600">
                Lädt eine einfache Textdatei herunter. Ideal für das Testen von
                einfachen Text-Downloads.
              </p>
              <Button
                color="warning"
                variant="solid"
                onPress={handleTextDownload}
                className="w-full"
                data-testid="download-text-button"
              >
                Download Text
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Testing Information */}
      <section className="flex flex-col gap-4">
        <h2 className={title({ size: 'sm', class: 'text-center' })}>
          Playwright Testing Hinweise
        </h2>
        <Card>
          <CardBody>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Download-Promise:</strong> Verwenden Sie{' '}
                <code>page.waitForEvent(&apos;download&apos;)</code>
                vor dem Klick auf einen Download-Button.
              </p>
              <p>
                <strong>Dateiname:</strong> Verwenden Sie{' '}
                <code>download.suggestedFilename()</code>
                um den vorgeschlagenen Dateinamen zu erhalten.
              </p>
              <p>
                <strong>Speichern:</strong> Verwenden Sie{' '}
                <code>download.saveAs()</code>
                um die Datei an einem bestimmten Pfad zu speichern.
              </p>
              <p>
                <strong>Validierung:</strong> Verwenden Sie{' '}
                <code>download.createReadStream()</code>
                um den Dateiinhalt als Buffer zu lesen und zu validieren.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
