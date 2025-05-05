# Übung 5 – API Mocking

**Ziel:**
Du lernst, wie du Netzwerkanfragen in Playwright abfangen und mocken kannst, um Tests für die Next.js Feed App unabhängiger vom Backend zu machen und spezifische Szenarien (Fehlerfälle, leere Daten, Ladezustände) zu simulieren. Fokus: Public News Seite (`/news/public`).

**Vorbereitetes Utility:**
Im Repository steht dir ein News-Generator unter `e2e/utils/newsGenerator.ts` zur Verfügung. Dieser bietet verschiedene Funktionen zum Erstellen von Mock-Daten für News-Artikel:

- `createMockNewsItem()`: Erstellt ein einzelnes News-Item mit benutzerdefinierten Eigenschaften
- `createMockNewsCollection()`: Erstellt eine Sammlung von mehreren News-Items
- `createMockNewsWithCategories()`: Erstellt News-Items in bestimmten Kategorien
- `createRealisticNewsCollection()`: Erstellt eine realistische Sammlung von News-Items
- `createSampleNewsFromRealData()`: Gibt Beispieldaten basierend auf echten News zurück

**Aufgaben:**

1. **Test für Erfolgsfall (ohne Mocking – optional):**
   - Schreibe einen Test, der `/news/public` öffnet und prüft, ob News-Artikel von der echten API (`/api/news/public`) geladen und angezeigt werden.

2. **Mocking für Erfolgsfall:**
   - Erstelle einen neuen Testfall.
   - Verwende `page.route('**/api/news/public', ...)` um Anfragen abzufangen.
   - Nutze den bereitgestellten News-Generator (z.B. `createMockNewsCollection()` oder `createSampleNewsFromRealData()`) für die Mock-Daten.
   - Simuliere mit `route.fulfill()` eine erfolgreiche JSON-Antwort mit den Mock-Daten.
   - Navigiere zur `/news/public`-Seite.
   - Prüfe, ob die gemockten Daten angezeigt werden (z.B. Titel sichtbar, Anzahl Listeneinträge korrekt).

3. **Mocking für Fehlerfall:**
   - Schreibe einen Test, der einen API-Fehler (z.B. Status 500) für `/api/news/public` simuliert.
   - Prüfe, ob die Anwendung eine Fehlermeldung anzeigt.

4. **Mocking für leere Daten:**
   - Schreibe einen Test, der eine erfolgreiche Antwort mit leerem `items`-Array simuliert.
   - Prüfe, ob die Anwendung den "Keine Daten gefunden"-Zustand korrekt anzeigt.

5. **Mocking mit Verzögerung (optional):**
   - Schreibe einen Test, der eine langsame Netzwerkantwort simuliert (mit `await new Promise(resolve => setTimeout(resolve, 2000))`).
   - Prüfe, ob während der Verzögerung ein Ladeindikator sichtbar ist und nach der Verzögerung die Daten korrekt angezeigt werden.

**Zeit:** 30 Minuten

---

> **Tipp:** Verwende `page.route()` und `route.fulfill()` um API-Antworten gezielt zu steuern. Achte darauf, dass deine Mock-Daten der erwarteten API-Struktur entsprechen. Verwende ausschließlich semantische, benutzerorientierte Selektoren (`getByRole`, `getByLabel`, `getByText`, etc.) zur Prüfung der UI-Elemente.
