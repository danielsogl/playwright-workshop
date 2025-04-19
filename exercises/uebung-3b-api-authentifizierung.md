# Übung 3B – API-basierte Authentifizierung

**Ziel:**
Du optimierst den Login-Prozess für die Next.js Feed App, indem du den UI-Login durch eine effizientere API-basierte Authentifizierung ersetzt. Dies macht das Setup schneller und robuster.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Stelle sicher, dass der `playwright/.auth` Ordner existiert
   - Überprüfe, dass `playwright/.auth` in `.gitignore` ist
   - Erstelle eine Datei `e2e/auth.setup.ts` für den API-basierten Login

2. **Authentication Setup implementieren:**
   - Implementiere in `auth.setup.ts` einen Playwright-Test, der folgende Schritte ausführt:
     - CSRF Token per GET von `/api/auth/csrf` abrufen
     - Login-Request per POST an `/api/auth/callback/credentials` mit E-Mail, Passwort und CSRF-Token senden
     - Überprüfen, ob der Login erfolgreich war (Statuscode prüfen)
     - Den authentifizierten Storage State in einer Datei speichern (z.B. `playwright/.auth/user.json`)
   - Beispiel:
     ```typescript
     import { test as setup, expect } from '@playwright/test';
     import path from 'path';

     const authFile = path.join(__dirname, '../playwright/.auth/user.json');

     setup('authenticate via API', async ({ request }) => {
       // 1. CSRF Token abrufen
       const csrfResponse = await request.get('http://localhost:3000/api/auth/csrf');
       const { csrfToken } = await csrfResponse.json();

       // 2. Login Request durchführen
       const loginResponse = await request.post('http://localhost:3000/api/auth/callback/credentials', {
         form: {
           email: process.env.TEST_USER_EMAIL,
           password: process.env.TEST_USER_PASSWORD,
           csrfToken: csrfToken
         },
         maxRedirects: 3
       });

       // 3. Überprüfe erfolgreichen Login
       expect(loginResponse.ok()).toBeTruthy();

       // 4. Speichere den authentifizierten State
       await request.storageState({ path: authFile });
     });
     ```

3. **Environment Setup:**
   - Lege Test-Credentials als Umgebungsvariablen an (z.B. in `.env.test`)
   - Lade die Umgebungsvariablen in der Playwright-Konfiguration

4. **Playwright Konfiguration erweitern:**
   - Definiere ein Setup-Projekt für die Authentifizierung
   - Definiere weitere Projekte, die den gespeicherten Auth-Status verwenden
   - (Details siehe vorherige Übungen)

5. **Tests mit API Authentication schreiben:**
   - Schreibe Tests, die den authentifizierten State nutzen (z.B. API- oder UI-Tests)
   - (Details siehe vorherige Übungen)

6. **(Optional) Multi-Role Testing:**
   - Erweitere das Setup für weitere Benutzerrollen (z.B. Admin)
   - (Details siehe vorherige Übungen)

**Vorteile dieser Implementierung:**
- Schnellere Authentifizierung durch direkten API-Zugriff
- Robuster als UI-basierte Authentifizierung
- Sichere Credential-Verwaltung über Umgebungsvariablen
- Unterstützung für mehrere Benutzerrollen
- Volle Integration mit Playwright's Test Runner

**Zeit:** 30 Minuten

---

> **Tipp:** Verwende die Network-Tab der Browser DevTools um die genauen API-Endpunkte und Payload-Strukturen zu identifizieren. Achte besonders auf die `Set-Cookie` Header in den Responses, da diese für die Session-Verwaltung wichtig sind.
