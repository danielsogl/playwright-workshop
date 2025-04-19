# Lösung: Übung 1 – Erster Test

## 1. Testdatei anlegen
Lege im Verzeichnis `e2e/news/` die Datei `navigation.spec.ts` an.

## 2. Beispieltest für Navigation und Sichtbarkeit
```typescript
import { test, expect } from '@playwright/test';

test('Navigation zur Public News Seite', async ({ page }) => {
  await page.goto('/'); // baseURL wird genutzt
  await expect(page.getByRole('heading', { name: /playwright demo app/i })).toBeVisible();

  // Link/Button zur Public News Seite finden und klicken
  await page.getByRole('link', { name: /view public news/i }).click();

  // Prüfen, ob die URL stimmt
  await expect(page).toHaveURL('/news/public');

  // Überschrift auf der Public News Seite prüfen
  await expect(page.getByRole('heading', { name: /news feed/i })).toBeVisible();
});
```

## 3. Test ausführen
```bash
npx playwright test
```

---
**Hinweise & Best Practices:**
- Nutze semantische Selektoren (`getByRole`, `getByText`) für robuste Tests.
- Vermeide Test-IDs, wenn die UI klar strukturiert ist.
- Die `baseURL` sollte in der `playwright.config.ts` gesetzt sein.
- Tests sind unabhängig und prüfen nur sichtbares Nutzerverhalten.
- Testdateien immer in `e2e/<domain>/` ablegen.
