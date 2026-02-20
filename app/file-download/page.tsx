'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Chip, Divider } from '@heroui/react';
import { FileText, FileJson, FileSpreadsheet, FileDown, Info } from 'lucide-react';
import { title, subtitle } from '@/components/primitives';
import jsPDF from 'jspdf';

const downloadCards = [
  {
    id: 'pdf',
    icon: FileText,
    title: 'PDF Download',
    description: 'Generiert und laedt eine PDF-Datei mit jsPDF herunter.',
    color: 'primary' as const,
    testId: 'download-pdf-button',
  },
  {
    id: 'json',
    icon: FileJson,
    title: 'JSON Download',
    description: 'Laedt eine JSON-Datei mit Testdaten herunter.',
    color: 'secondary' as const,
    testId: 'download-json-button',
  },
  {
    id: 'csv',
    icon: FileSpreadsheet,
    title: 'CSV Download',
    description: 'Laedt eine CSV-Datei mit Benutzerdaten herunter.',
    color: 'success' as const,
    testId: 'download-csv-button',
  },
  {
    id: 'text',
    icon: FileDown,
    title: 'Text Download',
    description: 'Laedt eine einfache Textdatei herunter.',
    color: 'warning' as const,
    testId: 'download-text-button',
  },
];

export default function FileDownloadPage() {
  const [downloadStatus, setDownloadStatus] = useState<string>('');

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

  const handlePdfDownload = () => {
    setDownloadStatus('PDF wird vorbereitet…');
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Playwright Download Demo', 20, 30);
      doc.setFontSize(14);
      doc.text('Eine Demonstration der Playwright File Download API', 20, 50);
      doc.line(20, 60, 190, 60);
      doc.setFontSize(12);
      const content = [
        'Diese PDF-Datei wurde mit jsPDF generiert und demonstriert',
        'verschiedene Aspekte der Playwright Download-API:',
        '',
        '\u2022 PDF-Downloads testen',
        '\u2022 Dateinamen validieren',
        '\u2022 Dateigr\u00f6\u00dfe \u00fcberpr\u00fcfen',
        '\u2022 Dateiinhalt validieren',
        '',
        'Generiert am: ' + new Date().toLocaleString('de-DE'),
        'Test-ID: ' + Math.random().toString(36).substr(2, 9),
      ];
      content.forEach((line, index) => {
        doc.text(line, 20, 80 + index * 8);
      });
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

  const handleJsonDownload = () => {
    setDownloadStatus('JSON wird vorbereitet…');
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

  const handleCsvDownload = () => {
    setDownloadStatus('CSV wird vorbereitet…');
    setTimeout(() => {
      const csvContent =
        'Name,Alter,Stadt\nMax Mustermann,25,Berlin\nAnna Schmidt,30,M\u00fcnchen\nPeter Weber,35,Hamburg';
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

  const handleTextDownload = () => {
    setDownloadStatus('Text wird vorbereitet…');
    setTimeout(() => {
      const textContent = `Playwright Download Demo
========================

Dies ist eine Demo-Seite f\u00fcr das Testen von Datei-Downloads mit Playwright.

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

  const handlers: Record<string, () => void> = {
    pdf: handlePdfDownload,
    json: handleJsonDownload,
    csv: handleCsvDownload,
    text: handleTextDownload,
  };

  return (
    <main className="flex flex-col gap-10 py-8 md:py-10">
      {/* Header */}
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center">
          <h1 className={title()} id="download-title">
            File Download Demo
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            Verschiedene Datei-Download-Szenarien f&uuml;r Playwright-Tests
          </p>
        </div>
      </section>

      {/* Download Status */}
      {downloadStatus && (
        <div
          className="flex justify-center"
          role="status"
          aria-live="polite"
        >
          <Chip
            color={downloadStatus.includes('erfolgreich') ? 'success' : 'primary'}
            variant="flat"
            size="lg"
          >
            {downloadStatus}
          </Chip>
        </div>
      )}

      {/* Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloadCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="border border-default-200 hover:border-default-300 transition-colors"
            >
              <CardBody className="p-6 gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${card.color}/10 flex items-center justify-center shrink-0`}
                  >
                    <Icon
                      className={`w-6 h-6 text-${card.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-default-500 mb-4">
                      {card.description}
                    </p>
                    <Button
                      color={card.color}
                      variant="flat"
                      onPress={handlers[card.id]}
                      className="w-full"
                      data-testid={card.testId}
                    >
                      Download {card.id.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Divider />

      {/* Testing Information */}
      <section className="flex flex-col gap-4">
        <h2 className={title({ size: 'sm', class: 'text-center' })}>
          Playwright Testing Hinweise
        </h2>
        <Card className="border border-default-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-default-500">
                Nutze diese Methoden um File Downloads in Playwright zu testen:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'Download-Promise', code: "page.waitForEvent('download')" },
                { label: 'Dateiname', code: 'download.suggestedFilename()' },
                { label: 'Speichern', code: 'download.saveAs()' },
                { label: 'Validierung', code: 'download.createReadStream()' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-default-100 rounded-lg"
                >
                  <p className="text-xs text-default-400 mb-1">{item.label}</p>
                  <code className="text-sm text-primary font-mono">
                    {item.code}
                  </code>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
