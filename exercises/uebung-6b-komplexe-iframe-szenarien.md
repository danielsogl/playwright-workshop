# Übung 6B – Komplexe iframe-Szenarien (Generische Beispiele)

**Ziel:**
Du meisterst komplexere iframe-Szenarien, einschließlich verschachtelter iframes und der Kommunikation zwischen Hauptseite und Cross-Origin-iframes mittels `postMessage`, anhand von generischen Beispielen.

**Hinweis:** Die Next.js Feed App selbst verwendet diese komplexen iframe-Strukturen derzeit nicht. Diese Übung dient dem Verständnis der Playwright-Funktionen für solche Fälle.

**Vorbereitung:**

*   **Verschachtelte iframes:** Erstelle eine HTML-Struktur mit mindestens zwei Ebenen von iframes in einem Test-Ordner (z.B. `e2e/test-html/`):
    *   `nested-host.html`: Lädt `nested-outer.html` in einem iframe (`#outer-iframe`).
    *   `nested-outer.html`: Enthält Text und lädt `nested-inner.html` in einem iframe (`#inner-iframe`).
    *   `nested-inner.html`: Enthält ein einfaches Formular (`<input id="inner-input">`).
*   **Cross-Origin iframe:**
    *   Erstelle zwei einfache HTML-Seiten (`cross-origin-host.html`, `cross-origin-iframe.html`) im Ordner `e2e/test-html/`.
    *   Implementiere in beiden Seiten JavaScript, um `postMessage` zu senden und zu empfangen.
    *   Du benötigst zwei einfache lokale Webserver, um die Seiten auf unterschiedlichen Ports (z.B. 8000 und 9000) bereitzustellen. Tools wie `http-server` (via npm/npx) können hierfür verwendet werden. Starte z.B. `npx http-server e2e/test-html -p 8000` und `npx http-server e2e/test-html -p 9000` in separaten Terminals.
    *   `cross-origin-host.html` (läuft auf Port 8000) sollte `http://localhost:9000/cross-origin-iframe.html` in einem iframe (`#cross-origin-iframe`) laden.

**Aufgaben:**

1.  **Test für verschachtelte iframes:**
    -   Erstelle eine neue Testdatei (z.B. `e2e/nested-iframe.spec.ts`).
    -   Schreibe einen Test, der die lokale `nested-host.html` öffnet (verwende `file:///...` oder einen lokalen Webserver).
    -   Greife auf das äußere iframe zu: `const outerFrame = page.frameLocator('#outer-iframe');`
    -   Greife *vom äußeren iframe aus* auf das innere iframe zu: `const innerFrame = outerFrame.frameLocator('#inner-iframe');`
    -   Interagiere mit dem Input-Feld im innersten iframe: `await innerFrame.getByRole('textbox').fill('Text im inneren Frame');`
    -   Prüfe den Wert des Inputs: `await expect(innerFrame.getByRole('textbox')).toHaveValue('Text im inneren Frame');`
    -   Interagiere optional wieder mit Elementen im äußeren oder Host-Frame.
2.  **Test für Cross-Origin iframe Kommunikation (postMessage):**
    -   Erstelle eine neue Testdatei (z.B. `e2e/cross-origin-iframe.spec.ts`).
    -   Stelle sicher, dass deine beiden lokalen Webserver laufen (Port 8000 und 9000).
    -   Schreibe einen Test, der die Host-Seite auf Port 8000 öffnet (`await page.goto('http://localhost:8000/cross-origin-host.html');`).
    -   Greife auf das Cross-Origin-iframe (von Port 9000) zu: `const iframe = page.frameLocator('#cross-origin-iframe');`
    -   **Von der Host-Seite zum iframe senden:**
        -   Verwende `page.evaluate()` um eine `postMessage` an das iframe-Fenster zu senden. Gib den korrekten `targetOrigin` (`http://localhost:9000`) an.
            ```javascript
            await page.evaluate(() => {
              const iframeWindow = document.querySelector('#cross-origin-iframe')?.contentWindow;
              iframeWindow?.postMessage({ type: 'GREETING', text: 'Hello from Host!' }, 'http://localhost:9000');
            });
            ```
        -   Implementiere im `cross-origin-iframe.html` einen Event Listener, der auf die Nachricht reagiert (z.B. Text in ein `<p id="message-display">` schreibt).
        -   Prüfe im iframe (mit `frameLocator`), ob die Nachricht empfangen und angezeigt wurde: `await expect(iframe.getByRole('status')).toContainText('Hello from Host!');` (passe ggf. das Element an, z.B. `getByText` oder `getByRole('status')`).
    -   **(Optional) Vom iframe zur Host-Seite senden:**
        -   Implementiere im iframe eine Aktion (z.B. Button-Klick), die eine `postMessage` an `window.parent` mit `targetOrigin` `http://localhost:8000` sendet.
        -   Implementiere im Host einen Event Listener.
        -   Löse die Aktion im iframe aus (`await iframe.locator('#send-to-host-button').click();`).
        -   Prüfe auf der Host-Seite (`page`), ob die Nachricht empfangen wurde (z.B. `await expect(page.getByRole('status')).toContainText('Message from iframe');`).
3.  **(Optional) Test für iframe-basiertes Widget:**
    -   Bette ein echtes Widget (z.B. ein einfaches YouTube-Video via `<iframe>`) in eine Testseite (`e2e/test-html/widget-test.html`) ein.
    -   Schreibe einen Test, der diese Seite öffnet.
    -   Verwende `frameLocator`, um auf den iframe des Widgets zuzugreifen (finde den richtigen Selektor, z.B. `iframe[src*="youtube.com"]`).
    -   Interagiere mit Steuerelementen innerhalb des Widget-iframes (z.B. Play-Button, z.B. mit `getByRole('button', { name: /play/i })`).

**Zeit:** 35 Minuten

---

> **Tipp:** Bei verschachtelten iframes musst du `frameLocator` relativ zum übergeordneten Frame aufrufen. Für `postMessage` ist es entscheidend, die `targetOrigin` korrekt anzugeben und Event Listener (`window.addEventListener('message', ...)` ) in beiden Seiten zu implementieren. Das Testen von Drittanbieter-Widgets in iframes kann herausfordernd sein, da deren interne Struktur sich ändern kann. Verwende ausschließlich semantische, benutzerorientierte Selektoren (`getByRole`, `getByLabel`, `getByText`, etc.).
