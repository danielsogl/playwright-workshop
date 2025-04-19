# Lösung: Übung 6A – Responsive Design Testing

## Hinweise zur Codebasis
- Responsive- und Visual-Tests liegen in `e2e/navigation/`, `e2e/news/` und `e2e/visual/`.
- Page Objects wie `Navigation` liegen in `e2e/utils/`.
- Nutze Playwrights Device-Emulation und `toHaveScreenshot()` für visuelle Regression.
- Verwende ausschließlich semantische Selektoren und die `baseURL` aus der Konfiguration.

## Beispiel für Navigation Page Object (`e2e/utils/Navigation.po.ts`)
```typescript
import { Page } from '@playwright/test';

export class Navigation {
  constructor(private readonly page: Page) {}

  get desktopNav() {
    return this.page.getByRole('navigation', { name: /desktop/i });
  }
  get mobileMenuToggle() {
    return this.page.getByRole('button', { name: /menu/i });
  }
  get mobileMenu() {
    return this.page.getByRole('navigation', { name: /mobile/i });
  }

  async openMenu() {
    await this.mobileMenuToggle.click();
  }
  async isDesktopNavVisible() {
    return await this.desktopNav.isVisible();
  }
  async isMobileMenuVisible() {
    return await this.mobileMenu.isVisible();
  }
}
```

## Beispiel für Responsive Layout Tests (`e2e/navigation/responsive.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { Navigation } from '../../utils/Navigation.po';

test.describe('Navigation Responsive', () => {
  test('Desktop: Desktop-Navigation sichtbar', async ({ page }) => {
    const nav = new Navigation(page);
    await page.goto('/');
    expect(await nav.isDesktopNavVisible()).toBe(true);
    expect(await nav.mobileMenuToggle.isVisible()).toBe(false);
  });

  test('Mobile: Mobile-Menü-Toggle sichtbar', async ({ page }) => {
    const nav = new Navigation(page);
    await page.goto('/');
    expect(await nav.isDesktopNavVisible()).toBe(false);
    expect(await nav.mobileMenuToggle.isVisible()).toBe(true);
    await nav.openMenu();
    expect(await nav.isMobileMenuVisible()).toBe(true);
  });
});
```

## Beispiel für News Grid Visual Test (`e2e/news/news-grid-visual.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('News Grid visuell', async ({ page }) => {
  await page.goto('/news/public');
  await expect(page.getByRole('list', { name: /news/i })).toHaveScreenshot();
});
```

## Beispiel für Touch-Interaktionen (`e2e/navigation/mobile-interactions.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { Navigation } from '../../utils/Navigation.po';

test('Mobile: Menü öffnen per Touch', async ({ page }) => {
  const nav = new Navigation(page);
  await page.goto('/');
  await nav.mobileMenuToggle.tap();
  expect(await nav.isMobileMenuVisible()).toBe(true);
});
```

## Beispiel für Visual Regression für Komponenten (`e2e/visual/visual.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('Seite und Komponenten visuell', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
  await expect(page.getByRole('navigation')).toHaveScreenshot('navigation.png');
  await expect(page.getByRole('contentinfo')).toHaveScreenshot('footer.png');
});
```

---
**Best Practices:**
- Gruppiere Tests nach Feature/Komponente in `e2e/<domain>/`.
- Nutze Page Objects und semantische Selektoren.
- Verwende `toHaveScreenshot()` für visuelle Regression.
