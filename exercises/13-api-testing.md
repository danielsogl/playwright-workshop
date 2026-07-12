# Übung 13 – API-Tests mit der Request API

**Ziel:**
Du testest die REST-API der App **direkt – ohne Browser** – mit Playwrights `request`-Fixture (`APIRequestContext`). Das ist schnell und ideal für Contract- und Integrationstests.

**Aufgaben:**

1. **Öffentlichen Feed testen (GET):**

   ```typescript
   import { test, expect } from '@playwright/test';

   test('öffentlicher News-Feed liefert Artikel', async ({ request }) => {
     const response = await request.get('/api/news/public');

     expect(response.status()).toBe(200);
     const body = await response.json();
     expect(Array.isArray(body.items)).toBe(true);
     expect(body.items.length).toBeGreaterThan(0);
   });
   ```

2. **Login über die API (Auth.js v5):**
   - Auth.js meldet sich über den Credentials-Callback an: zuerst CSRF-Token holen, dann Login posten.
   - Nutze `page.request` statt der `request`-Fixture, damit der Session-Cookie mit dem Page-Context geteilt wird (die `request`-Fixture hat einen eigenen Cookie-Jar).

   ```typescript
   test('Login via API und geschützte Route', async ({ page }) => {
     const api = page.request;

     const csrf = await api.get('/api/auth/csrf');
     const { csrfToken } = await csrf.json();

     const login = await api.post('/api/auth/callback/credentials', {
       form: {
         email: process.env.TEST_USER_EMAIL || 'test@example.com',
         password: process.env.TEST_USER_PASSWORD || 'password',
         csrfToken,
         callbackUrl: '/',
         json: 'true',
       },
     });
     expect([200, 302]).toContain(login.status());

     // Session prüfen
     const session = await api.get('/api/auth/session');
     const sessionData = await session.json();
     expect(sessionData.user?.email).toBe('test@example.com');

     // Geschützte Route mit der Session abrufen
     const user = await api.get('/api/user');
     expect(user.status()).toBe(200);
     expect((await user.json()).email).toBe('test@example.com');
   });
   ```

3. **Signup testen (POST mit JSON-Body):**

   ```typescript
   test('Signup legt einen neuen Benutzer an', async ({ request }) => {
     const uniqueEmail = `apitest-${Date.now()}@example.com`;

     const response = await request.post('/api/auth/signup', {
       data: {
         name: 'API Test User',
         email: uniqueEmail,
         password: 'testpassword123',
       },
     });

     expect(response.status()).toBe(201);
   });
   ```

**Was du lernst:**

- `request`-Fixture vs. `page.request` (getrennter vs. geteilter Cookie-Jar)
- GET/POST mit `form` (URL-encoded) und `data` (JSON)
- Statuscodes und JSON-Responses asserten
- API-Tests als schnelle Ergänzung zu UI-Tests

**Zeit:** 20 Minuten

---

> **Tipp:** API-Tests eignen sich hervorragend, um Setup-Schritte (z. B. Testdaten anlegen) schnell und ohne UI vorzubereiten.
