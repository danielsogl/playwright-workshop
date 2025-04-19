# Übung 5 – API Mocking

**Ziel:**
Du lernst, wie du Netzwerkanfragen in Playwright abfangen und mocken kannst, um Tests für die Next.js Feed App unabhängiger vom Backend zu machen und spezifische Szenarien (Fehlerfälle, leere Daten, Ladezustände) zu simulieren. Fokus: Public News Seite (`/news/public`).

**Aufgaben:**

1. **Test für Erfolgsfall (ohne Mocking – optional):**
   - Schreibe einen Test, der `/news/public` öffnet und prüft, ob News-Artikel von der echten API (`/api/news/public`) geladen und angezeigt werden.

2. **Mocking für Erfolgsfall:**
   - Erstelle einen neuen Testfall.
   - Verwende `page.route('**/api/news/public', ...)` um Anfragen abzufangen.
   - Simuliere mit `route.fulfill()` eine erfolgreiche JSON-Antwort mit einer vordefinierten Liste von News-Artikeln (Struktur: `{ items: RSSItem[] }`).
   - Navigiere zur `/news/public`-Seite.
   - Prüfe, ob die gemockten Daten angezeigt werden (z.B. Titel sichtbar, Anzahl Listeneinträge korrekt).

3. **Mocking für Fehlerfall:**
   - Schreibe einen Test, der einen API-Fehler (z.B. Status 500) für `/api/news/public` simuliert.
   - Prüfe, ob die Anwendung eine Fehlermeldung anzeigt.

4. **Mocking für leere Daten:**
   - Schreibe einen Test, der eine erfolgreiche Antwort mit leerem `items`-Array simuliert.
   - Prüfe, ob die Anwendung den "Keine Daten gefunden"-Zustand korrekt anzeigt.

5. **Mocking mit Verzögerung (optional):**
   - Schreibe einen Test, der eine langsame Netzwerkantwort simuliert.
   - Prüfe, ob während der Verzögerung ein Ladeindikator sichtbar ist und nach der Verzögerung die Daten korrekt angezeigt werden.

**Zeit:** 30 Minuten

---

> **Tipp:** Nutze `page.route()` und `route.fulfill()` um API-Antworten gezielt zu steuern. Achte darauf, dass deine Mock-Daten der erwarteten API-Struktur entsprechen. Verwende ausschließlich semantische, benutzerorientierte Selektoren (`getByRole`, `getByLabel`, `getByText`, etc.).
