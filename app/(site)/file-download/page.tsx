'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Check, Download, Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import jsPDF from 'jspdf';

const downloadCards = [
  {
    id: 'pdf',
    filename: 'playwright-demo.pdf',
    tile: 'bg-terminal text-terminal-accent',
    title: 'PDF Download',
    description: 'Generiert und laedt eine PDF-Datei mit jsPDF herunter.',
    testId: 'download-pdf-button',
  },
  {
    id: 'json',
    filename: 'test-data.json',
    tile: 'bg-success-soft text-success-soft-foreground',
    title: 'JSON Download',
    description: 'Laedt eine JSON-Datei mit Testdaten herunter.',
    testId: 'download-json-button',
  },
  {
    id: 'csv',
    filename: 'benutzer-daten.csv',
    tile: 'bg-warning-soft text-warning-soft-foreground',
    title: 'CSV Download',
    description: 'Laedt eine CSV-Datei mit Benutzerdaten herunter.',
    testId: 'download-csv-button',
  },
  {
    id: 'text',
    filename: 'demo-text.txt',
    tile: 'bg-default text-foreground',
    title: 'Text Download',
    description: 'Laedt eine einfache Textdatei herunter.',
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

  const isDone = downloadStatus.includes('erfolgreich');

  return (
    <div className="flex flex-col gap-8 pt-14 pb-24">
      <PageHeader
        id="download-title"
        label="04 · waitForEvent('download')"
        title="File Download Demo"
        subtitle="Verschiedene Datei-Download-Szenarien für Playwright-Tests"
      >
        {/* Download Status */}
        {downloadStatus && (
          <div
            className={`inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 text-sm font-medium ${
              isDone
                ? 'bg-success-soft text-success-soft-foreground'
                : 'bg-default text-foreground'
            }`}
            role="status"
            aria-live="polite"
          >
            {isDone ? (
              <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {downloadStatus}
          </div>
        )}
      </PageHeader>

      {/* Download Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {downloadCards.map((card) => (
          <article
            key={card.id}
            className="flex gap-5 rounded-2xl border border-border bg-surface p-5"
          >
            <div
              aria-hidden="true"
              className={`flex h-[108px] w-[88px] shrink-0 items-end rounded-[10px] p-3 font-mono text-lg font-semibold [clip-path:polygon(0_0,72%_0,100%_22%,100%_100%,0_100%)] ${card.tile}`}
            >
              {card.id.toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="font-display text-[22px] font-bold">
                {card.title}
              </h3>
              <p className="text-[15px] text-muted">{card.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 pt-2.5">
                <code className="font-mono text-[13px] text-muted">
                  {card.filename}
                </code>
                <Button
                  variant="outline"
                  onPress={handlers[card.id]}
                  className="min-h-11 rounded-full border-foreground font-semibold transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent-soft-foreground"
                  data-testid={card.testId}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download {card.id.toUpperCase()}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Testing Information */}
      <section
        aria-labelledby="download-hints-title"
        className="flex flex-col gap-5 rounded-[20px] bg-terminal p-8 text-terminal-foreground"
      >
        <div className="flex flex-wrap justify-between gap-2">
          <h2
            className="font-display text-[28px] font-bold tracking-[-0.01em]"
            id="download-hints-title"
          >
            Playwright Testing Hinweise
          </h2>
          <p className="text-terminal-muted">
            Nutze diese Methoden um File Downloads in Playwright zu testen:
          </p>
        </div>
        <dl className="m-0 grid gap-px overflow-hidden rounded-xl border border-terminal-border bg-terminal-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Download-Promise',
              code: "page.waitForEvent('download')",
            },
            { label: 'Dateiname', code: 'download.suggestedFilename()' },
            { label: 'Speichern', code: 'download.saveAs()' },
            { label: 'Validierung', code: 'download.createReadStream()' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1.5 bg-terminal px-[18px] py-4"
            >
              <dt className="text-[13px] text-terminal-muted">{item.label}</dt>
              <dd className="font-mono text-sm text-terminal-accent">
                {item.code}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
