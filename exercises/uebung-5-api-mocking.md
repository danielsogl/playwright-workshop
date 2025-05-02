# Übung 5 – API Mocking

**Ziel:**
Du lernst, wie du Netzwerkanfragen in Playwright abfangen und mocken kannst, um Tests für die Next.js Feed App unabhängiger vom Backend zu machen und spezifische Szenarien (Fehlerfälle, leere Daten, Ladezustände) zu simulieren. Wir konzentrieren uns auf die Public News Seite (`/news/public`).

**Aufgaben:**

1.  **Test für den Erfolgsfall (ohne Mocking - optional):**
    -   Schreibe (oder verwende einen bestehenden) Test, der die `/news/public`-Seite öffnet und prüft, ob die News-Artikel korrekt von der echten API (`/api/news/public`) geladen und angezeigt werden.
2.  **Mocking für Erfolgsfall:**
    -   Erstelle einen neuen Testfall.
    -   Verwende `page.route()` um Anfragen an `**/api/news/public` abzufangen (der `**` Glob-Pattern fängt die Anfrage unabhängig von der Basis-URL ab).
    -   Innerhalb des Route-Handlers, verwende `route.fulfill()` um eine erfolgreiche JSON-Antwort mit einer vordefinierten Liste von News-Artikeln zu simulieren. Die Struktur sollte dem `NewsApiResponse`-Typ entsprechen (ein Objekt mit einem `items`-Array von `RSSItem`-Objekten):
        ```typescript
        await page.route('**/api/news/public', async route => {
          const mockData = {
            items: [
              { title: 'Mocked News 1', link: 'http://example.com/1', source: 'MockSource', category: 'Technology', description: 'Desc 1', pubDate: new Date().toISOString() },
              { title: 'Mocked News 2', link: 'http://example.com/2', source: 'MockSource', category: 'Business', description: 'Desc 2', pubDate: new Date().toISOString() },
            ]
          };
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockData) });
        });
        ```
    -   Navigiere zur `/news/public`-Seite.
    -   Prüfe, ob genau die gemockten Daten angezeigt werden (z.B. `expect(page.getByText('Mocked News 1')).toBeVisible();`, `expect(page.getByTestId('grid-news-items').locator('[data-testid^="news-item-"]')).toHaveCount(2);`).
3.  **Mocking für Fehlerfall:**
    -   Schreibe einen neuen Test.
    -   Verwende `page.route('**/api/news/public', ...)` um einen API-Fehler (z.B. Status 500) zu simulieren:
        ```typescript
        await page.route('**/api/news/public', async route => {
          await route.fulfill({ status: 500, body: 'Internal Server Error' }); // Einfacher Text oder JSON-Fehlerobjekt
        });
        ```
    -   Navigiere zur `/news/public`-Seite.
    -   Prüfe, ob die Anwendung korrekt eine Fehlermeldung anzeigt (z.B. `expect(page.getByTestId('error-news')).toBeVisible();` und `expect(page.getByTestId('error-news')).toContainText('Failed to load');`).
4.  **Mocking für leere Daten:**
    -   Schreibe einen weiteren Test.
    -   Verwende `page.route('**/api/news/public', ...)` um eine erfolgreiche Antwort, aber mit einem leeren `items`-Array, zu simulieren:
        ```typescript
        await page.route('**/api/news/public', async route => {
          const mockData = { items: [] };
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockData) });
        });
        ```
    -   Navigiere zur `/news/public`-Seite.
    -   Prüfe, ob die Anwendung korrekt einen "Keine Daten gefunden"-Zustand anzeigt (z.B. `expect(page.getByTestId('grid-news-items').locator('[data-testid^="news-item-"]')).toHaveCount(0);` oder prüfe auf eine spezifische Meldung, falls vorhanden).
5.  **(Optional) Mocking mit Verzögerung:**
    -   Schreibe einen neuen Test.
    -   Simuliere eine langsame Netzwerkantwort für `/api/news/public`, um den Ladezustand der Anwendung zu testen:
        ```typescript
        await page.route('**/api/news/public', async route => {
          const mockData = { /* ... deine Mock-Daten ... */ };
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 Sekunden warten
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockData) });
        });
        ```
    -   Navigiere zur `/news/public`-Seite.
    -   Prüfe, ob *während* der Verzögerung ein Ladeindikator angezeigt wird (`expect(page.getByTestId('loading-news')).toBeVisible();`).
    -   Prüfe, ob *nach* der Verzögerung die gemockten Daten angezeigt werden und der Ladeindikator verschwindet.

**Zeit:** 30 Minuten

---

> **Tipp:** `page.route()` fängt Anfragen ab, bevor sie gesendet werden. `route.fulfill()` beendet die Anfrage mit einer benutzerdefinierten Antwort. Stelle sicher, dass die Struktur deiner Mock-Daten (`mockData`) dem entspricht, was die Frontend-Komponente erwartet. Der `**` Glob-Pattern ist nützlich, um die Route unabhängig von der Basis-URL abzufangen.
