# Übung 3 – Login automatisieren mit Storage State (Pseudocode/Leitfaden)

**Ziel:**
Du implementierst einen effizienten Login-Prozess für die Feed App, indem du den Authentifizierungsstatus (Cookies, Local Storage) nach einem erfolgreichen UI-Login speicherst und für nachfolgende Tests wiederverwendest.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Lege einen Ordner `playwright/.auth` im Projekt-Root an.
   - Füge `playwright/.auth` zu deiner `.gitignore` hinzu, um keine sensiblen Daten zu committen.
   - Erstelle eine Datei `e2e/auth.setup.ts` für den Login-Prozess.

2. **Authentication Setup implementieren:**
   - Schreibe in `auth.setup.ts` einen Playwright-Test, der:
     - Die Login-Seite aufruft.
     - Die Login-Formularfelder (E-Mail & Passwort) ausfüllt.
     - Den Login abschickt.
     - Prüft, ob der Login erfolgreich war (z.B. durch Sichtbarkeit eines bestimmten Elements).
   - Nutze Testdaten, z.B. aus Umgebungsvariablen.
   - Speichere nach erfolgreichem Login den Authentifizierungsstatus (Storage State) in einer Datei im Auth-Ordner.

3. **Playwright Konfiguration anpassen (`playwright.config.ts`):**
   - Definiere ein Setup-Projekt für die Authentifizierung.
   - Definiere weitere Projekte (z.B. für verschiedene Browser), die den gespeicherten Auth-Status verwenden.
   - Setze sinnvolle Optionen wie `baseURL` und `trace`.

4. **Authentifizierten Test schreiben:**
   - Schreibe einen Test (z.B. in `e2e/private-news.spec.ts`), der:
     - Direkt eine geschützte Seite aufruft (ohne Login-Formular).
     - Prüft, ob der Zugriff funktioniert (z.B. durch Sichtbarkeit eines bestimmten Bereichs).

5. **Tests ausführen:**
   - Starte die App im Dev-Modus.
   - Führe die Playwright-Tests aus.
   - Beobachte, dass der Login nur einmal durchgeführt wird und alle weiteren Tests bereits authentifiziert starten.

---

**Hinweis:**
Verwende keine echten Passwörter im Code – nutze stattdessen Umgebungsvariablen!

---

> **Tipp:** Überlege, wie du den Auth-Status nach dem Login speichern und in anderen Tests wiederverwenden kannst. Welche Playwright-Optionen helfen dir dabei?
