# Lösung: Übung 3 – Login automatisieren mit Storage State

## Hinweise zur Codebasis
- Die Auth-Setup-Datei sollte in `e2e/utils/` liegen, z.B. `e2e/utils/auth.setup.ts`.
- Authentifizierte Tests liegen in `e2e/news/private-news.spec.ts`.
- Verwende keine harten URLs, sondern die `baseURL` aus der Konfiguration.

## Beispiel für Auth-Setup (API-Login oder UI-Login)
```typescript
// e2e/utils/auth.setup.ts
import { test, expect } from '@playwright/test';

test('Login und Storage State speichern', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await expect(page.getByRole('heading', { name: /news feed/i })).toBeVisible();
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

## Beispiel für authentifizierten Test
```typescript
// e2e/news/private-news.spec.ts
import { test, expect } from '@playwright/test';

test('Zugriff auf private News', async ({ page }) => {
  await page.goto('/news/private');
  await expect(page.getByRole('heading', { name: /private news/i })).toBeVisible();
});
```

## Hinweise zur Konfiguration
- Das Auth-Setup-Projekt und die Nutzung von `storageState` werden in `playwright.config.ts` konfiguriert.
- Die `.gitignore` sollte `playwright/.auth` enthalten.

---
**Best Practices:**
- Auth-Setup und Hilfsfunktionen in `e2e/utils/` ablegen.
- Testdateien nach Domain in `e2e/<domain>/` ablegen.
- Keine sensiblen Daten im Code, sondern Umgebungsvariablen nutzen.
