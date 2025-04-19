# Übung 6B – Komplexe iframe-Szenarien (Generische Beispiele)

**Ziel:**
Du meisterst komplexere iframe-Szenarien, einschließlich verschachtelter iframes und der Kommunikation zwischen Hauptseite und Cross-Origin-iframes mittels `postMessage`, anhand von generischen Beispielen.

**Vorbereitung:**

- Lege im Ordner `e2e/test-html/` folgende HTML-Dateien an:
  - `nested-host.html`: Lädt `nested-outer.html` in einem iframe (`#outer-iframe`).
  - `nested-outer.html`: Enthält Text und lädt `nested-inner.html` in einem iframe (`#inner-iframe`).
  - `nested-inner.html`: Enthält ein einfaches Formular (`<input id="inner-input">`).
  - `cross-origin-host.html` und `cross-origin-iframe.html` für Cross-Origin-Kommunikation via `postMessage` (jeweils mit passendem JS für Senden/Empfangen). 
- Starte zwei lokale Webserver (z.B. mit `npx http-server e2e/test-html -p 8000` und `npx http-server e2e/test-html -p 9000`).
- `cross-origin-host.html` (Port 8000) lädt das iframe von Port 9000.

**Aufgaben:**

1. **Test für verschachtelte iframes:**
   - Lege die Datei `e2e/nested-iframe.spec.ts` an.
   - Öffne `nested-host.html` (lokal oder via Webserver).
   - Greife mit `frameLocator` auf das äußere und dann das innere iframe zu.
   - Interagiere mit dem Input im innersten iframe und prüfe den Wert.
   - Optional: Interagiere wieder mit Elementen im äußeren oder Host-Frame.

2. **Test für Cross-Origin iframe Kommunikation (postMessage):**
   - Lege die Datei `e2e/cross-origin-iframe.spec.ts` an.
   - Öffne die Host-Seite auf Port 8000.
   - Greife mit `frameLocator` auf das Cross-Origin-iframe (Port 9000) zu.
   - Sende mit `page.evaluate()` eine `postMessage` an das iframe.
   - Implementiere und prüfe die Anzeige der empfangenen Nachricht im iframe.
   - (Optional) Sende eine Nachricht vom iframe an die Host-Seite und prüfe die Anzeige.

3. **(Optional) Test für iframe-basiertes Widget:**
   - Lege eine Testseite mit eingebettetem Widget (z.B. YouTube-Video) an.
   - Schreibe einen Test, der mit dem Widget-iframe interagiert (z.B. Play-Button).

**Zeit:** 35 Minuten

---

> **Tipp:** Nutze `frameLocator` immer relativ zum übergeordneten Frame. Achte bei `postMessage` auf die korrekten `targetOrigin`-Werte und Event Listener. Für Drittanbieter-Widgets können sich Selektoren ändern – setze auf semantische, benutzerorientierte Selektoren.
