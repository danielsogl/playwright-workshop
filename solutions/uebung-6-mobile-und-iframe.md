# Lösung: Übung 6 – Mobile und iframe Testing

## Hinweise zur Codebasis
- Responsive- und iframe-Tests liegen in `e2e/navigation/` und `e2e/iframe/`.
- Nutze Playwrights Device-Emulation und `frameLocator` für mobile und iframe-Tests.
- Verwende ausschließlich semantische Selektoren und die `baseURL` aus der Konfiguration.

## Beispiel für Responsive Navbar Test (`e2e/navigation/responsive-navbar.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Navbar Responsiveness', () => {
  test('Desktop: zeigt Desktop-Navigation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Nur für Desktop');
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: /desktop/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /menu/i })).not.toBeVisible();
  });

  test('Mobile: zeigt Mobile-Menü-Toggle', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Nur für Mobile');
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: /desktop/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('navigation', { name: /mobile/i })).toBeVisible();
  });
});
```

## Beispiel für iframe Test (`e2e/iframe/iframe.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test('Interaktion mit iframe', async ({ page }) => {
  const hostPath = 'file://' + path.resolve(__dirname, '../../test-html/iframe-host.html');
  await page.goto(hostPath);
  const frame = page.frameLocator('#my-iframe');
  await frame.getByRole('textbox', { name: /name/i }).fill('Playwright');
  await frame.getByRole('button', { name: /absenden/i }).click();
  await expect(frame.getByText(/erfolg/i)).toBeVisible();
});
```

---
**Best Practices:**
- Testdateien nach Domain/Feature in `e2e/<domain>/` ablegen.
- Nutze Playwrights `devices` für mobile Emulation.
- Verwende `frameLocator` für iframe-Interaktion.
- Nutze semantische Selektoren und prüfe responsives Verhalten.