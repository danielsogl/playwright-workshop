# Lösung: Übung 3B – API-basierte Authentifizierung

## Hinweise zur Codebasis
- Die Auth-Setup-Datei für API-Login sollte in `e2e/utils/auth.setup.ts` liegen.
- Authentifizierte Tests liegen in `e2e/news/private-news.spec.ts`.
- Verwende keine harten URLs, sondern die `baseURL` aus der Konfiguration.

## Beispiel für API-Authentication Setup
```typescript
// e2e/utils/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate via API', async ({ request }) => {
  const csrfResponse = await request.get('/api/auth/csrf');
  const { csrfToken } = await csrfResponse.json();

  const loginResponse = await request.post('/api/auth/callback/credentials', {
    form: {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
      csrfToken: csrfToken
    },
    maxRedirects: 3
  });

  expect(loginResponse.ok()).toBeTruthy();
  await request.storageState({ path: authFile });
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
