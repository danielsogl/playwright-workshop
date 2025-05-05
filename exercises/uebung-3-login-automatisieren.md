# Übung 3 – Login automatisieren mit Storage State

**Ziel:**
Du implementierst einen effizienten Login-Prozess für die Feed App, indem du den Authentifizierungsstatus (Cookies, Local Storage) nach einem erfolgreichen UI-Login speicherst und für nachfolgende Tests wiederverwendest.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Lege einen Ordner `playwright/.auth` im Projekt-Root an.
   - Füge `playwright/.auth` zu deiner `.gitignore` hinzu, um keine sensiblen Daten zu committen.
   - Erstelle eine Datei `e2e/auth.setup.ts` für den Login-Prozess.

2. **Authentication Setup implementieren:**
   - Schreibe in `auth.setup.ts` einen Playwright-Test, der den Login durchführt und den Auth-Status speichert.
   - Grobe Struktur der Setup-Datei:
   ```typescript
   import { test as setup, expect } from '@playwright/test';
   import path from 'path';
   
   const authFile = path.join(__dirname, '../playwright/.auth/user.json');
   
   setup('authenticate via UI', async ({ page }) => {
     // 1. Navigiere zur Login-Seite
     await page.goto('/auth/signin');
   
     // 2. Fülle das Login-Formular aus
     // Email und Passwort ausfüllen (finde selbst die geeigneten Selektoren)
     // Nutze Environment-Variablen mit Fallback-Werten
   
     // 3. Klicke auf den Login-Button
     // Finde und klicke den Submit-Button (finde selbst den geeigneten Selektor)
   
     // 4. Warte auf erfolgreiche Navigation nach dem Login
     await page.waitForURL('/');
   
     // 5. Optional: Prüfe ob Login erfolgreich war
     // Überprüfe, ob ein Element sichtbar ist, das nur nach erfolgreichem Login erscheint
   
     // 6. Speichere den authentifizierten State
     await page.context().storageState({ path: authFile });
   });
   ```

3. **Playwright Konfiguration anpassen (`playwright.config.ts`):**
   - Definiere ein Setup-Projekt für die Authentifizierung.
   - Definiere weitere Projekte (z.B. für verschiedene Browser), die den gespeicherten Auth-Status verwenden.
   - Setze sinnvolle Optionen wie `baseURL` und `trace`.

4. **Authentifizierten Test schreiben:**
   - Schreibe einen Test in `e2e/private-news.spec.ts`, der:
     - Direkt eine geschützte Seite aufruft (z.B. `/news/private`).
     - Prüft, ob ein spezifischer Heading sichtbar ist (finde selbst den geeigneten Selektor).

5. **Tests ausführen:**
   - Starte die App im Dev-Modus.
   - Führe die Playwright-Tests aus.
   - Beobachte, dass der Login nur einmal durchgeführt wird und alle weiteren Tests bereits authentifiziert starten.

---

**Hinweis:**
Verwende keine echten Passwörter im Code – nutze stattdessen Umgebungsvariablen!

---

> **Tipp:** In der `auth.setup.ts` importiere die `test`-Funktion als `setup` um klar zu machen, dass es sich um einen Setup-Test handelt. Verwende `path.join` um den Pfad zur Auth-Datei plattformunabhängig zu definieren.
