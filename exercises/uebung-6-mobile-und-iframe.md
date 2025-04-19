# Übung 6 – Mobile und iframe Testing

**Ziel:**
Du lernst, wie du mit Playwright mobile Geräte für die Next.js Feed App emulierst und mit Inhalten innerhalb von iframes interagierst.

**Teil 1: Mobile Emulation (Feed App)**

**Aufgaben:**

1. Mobile Projekte in Konfiguration definieren:
   - Öffne `playwright.config.ts`.
   - Definiere unter `projects` mindestens zwei mobile Geräte mit Playwrights `devices`-Konfiguration (z.B. Pixel 5, iPhone 13).

2. Responsiven Test für die Navbar schreiben:
   - Lege eine neue Testdatei an, z.B. `e2e/responsive-navbar.spec.ts`.
   - Schreibe einen Test für die Desktop-Ansicht: Prüfe, ob die Desktop-Navigation sichtbar ist und der Mobile-Menü-Toggle nicht sichtbar.
   - Schreibe einen Test für die Mobile-Ansicht: Prüfe, ob die Desktop-Navigation nicht sichtbar ist und der Mobile-Menü-Toggle sichtbar ist. Klicke optional den Toggle und prüfe, ob das Menü erscheint.

3. Tests auf mobilen Geräten ausführen:
   - Führe die Tests gezielt für die mobilen Projekte und ein Desktop-Projekt aus (z.B. mit `npx playwright test --project="Mobile Chrome"`).

**Teil 2: iframe Testing (Generisches Beispiel)**

**Vorbereitung:**
- Lege zwei einfache HTML-Dateien an (z.B. in `test-html/`):
  - `iframe-host.html` mit einem iframe, das `iframe-content.html` lädt.
  - `iframe-content.html` mit einem Formular und einer Erfolgsmeldung.

**Aufgaben:**

4. Test für iframe erstellen:
   - Lege eine neue Testdatei an, z.B. `e2e/iframe.spec.ts`.
   - Schreibe einen Test, der die lokale `iframe-host.html`-Datei öffnet (z.B. mit `file://`-Pfad).

5. Auf iframe zugreifen:
   - Verwende `page.frameLocator()` um den iframe anhand seiner ID zu finden.

6. Mit iframe-Inhalt interagieren:
   - Fülle das Eingabefeld im iframe aus und klicke den Button.

7. Assertions im iframe:
   - Prüfe, ob nach dem Klick die Erfolgsmeldung im iframe sichtbar wird und den erwarteten Text enthält.

8. Test ausführen:
   - Führe den iframe-Test aus (z.B. mit `npx playwright test iframe.spec.ts`).

**Zeit:** 30 Minuten

---

> **Tipp:** Nutze die `isMobile` Property im Test-Callback für mobile Tests. `frameLocator` ist der empfohlene Weg, um mit iframes zu interagieren. Achte beim Öffnen lokaler HTML-Dateien auf den korrekten Pfad. Verwende ausschließlich semantische, benutzerorientierte Selektoren.
