# Lösung: Übung 6B – Komplexe iframe-Szenarien

## Hinweise zur Codebasis
- Tests für verschachtelte und Cross-Origin-iframes liegen in `e2e/iframe/`.
- Nutze Playwrights `frameLocator` für verschachtelte und Cross-Origin-iframes.
- Verwende ausschließlich semantische Selektoren und die `baseURL` aus der Konfiguration.

## Beispiel für verschachtelte iframes (`e2e/iframe/nested-iframe.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test('Verschachtelte iframes: Zugriff auf inneres Input', async ({ page }) => {
  const hostPath = 'http://localhost:8000/nested-host.html';
  await page.goto(hostPath);
  const outer = page.frameLocator('#outer-iframe');
  const inner = outer.frameLocator('#inner-iframe');
  await inner.locator('#inner-input').fill('Playwright!');
  await expect(inner.locator('#inner-input')).toHaveValue('Playwright!');
});
```

## Beispiel für Cross-Origin iframe Kommunikation (`e2e/iframe/cross-origin-iframe.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('Cross-Origin postMessage Kommunikation', async ({ page }) => {
  await page.goto('http://localhost:8000/cross-origin-host.html');
  const crossFrame = page.frameLocator('#cross-origin-iframe');
  // Sende Nachricht an das iframe
  await page.evaluate(() => {
    const iframe = document.getElementById('cross-origin-iframe') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage('Hallo vom Host!', 'http://localhost:9000');
  });
  // Prüfe, ob Nachricht im iframe angezeigt wird
  await expect(crossFrame.getByText(/hallo vom host/i)).toBeVisible();

  // Optional: Nachricht vom iframe an Host
  await crossFrame.getByRole('button', { name: /antwort/i }).click();
  await expect(page.getByText(/antwort vom iframe/i)).toBeVisible();
});
```

## Beispiel für iframe-basiertes Widget (z.B. YouTube) (`e2e/iframe/youtube-widget.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('YouTube Widget Play-Button', async ({ page }) => {
  await page.goto('http://localhost:8000/youtube-widget-host.html');
  const ytFrame = page.frameLocator('iframe[src*="youtube.com"]');
  await ytFrame.getByRole('button', { name: /play/i }).click();
  await expect(ytFrame.getByRole('button', { name: /pause/i })).toBeVisible();
});
```

---
**Best Practices:**
- Testdateien nach Domain/Feature in `e2e/<domain>/` ablegen.
- Nutze `frameLocator` für verschachtelte und Cross-Origin-iframes.
- Verwende `postMessage` für Kommunikation zwischen Host und iframe.
- Nutze semantische Selektoren für Interaktion und Assertions.
