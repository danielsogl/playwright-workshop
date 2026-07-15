# Test-Plan: Öffentliche News-Seite (/news/public)

## Application Overview

## Zielsystem

- URL: `http://localhost:3000/news/public`
- Quelldateien: `app/news/public/page.tsx` (Client-Komponente, `useSWR('/api/news/public', fetcher)`), `app/api/news/public/route.ts` (Route Handler, liefert live geparste RSS-Feeds aus `config/data.json` → `RSS_SOURCES`, oder bei `RSS_OFFLINE_MODE=true` die Fixture-Datei `app/api/feed.json`), Filterlogik in `lib/rss.ts` (`filterFeedItems`).
- Bestehende Page Objects: `e2e/pom/public-news.pom.ts` (`PublicNewsPage`) und `e2e/pom/news-item.pom.ts` (`NewsItemComponent`) sollten wiederverwendet werden statt Selektoren zu duplizieren.
- Bestehende Mock-Fixtures für API-Mocking-Übungen: `solutions/e2e/mocks/news-mocks.ts` (`mockNewsData.success/empty/filtered`, `mockErrorResponse`, `mockRateLimitResponse`, `mockSearchFeed`).

## Wichtige Beobachtungen aus Code-Review & manueller Exploration

- Die Seite ist **öffentlich**, es gibt keinen Session-/Auth-Check (im Gegensatz zu `/news/private`, das bei fehlender Session eine "Access Denied"-Karte mit Sign-in-Link zeigt).
- `useSWR` liefert drei Zustände: `isLoading` → Spinner (`role=status`, aria-label "Loading news feed"), `error` → `role=alert`, aria-label "Failed to load RSS feeds", Text "Failed to load RSS feeds"; sonst die gefilterte Artikelliste.
- Suche (`TextField`, aria-label "Search news articles") und Kategorie-Dropdown (`select`, aria-label "Filter news by category", Optionen: "All Categories", "Technology", "Business", "World News" aus `RSS_CATEGORIES`) filtern **client-seitig live bei jedem Tastenanschlag** (kontrollierte Komponente, kein Enter/Submit nötig, kein Server-Request pro Suche).
- `filterFeedItems` matcht `searchQuery` case-insensitive gegen `title` ODER `description` (Substring, kein Trim, keine Regex-Sonderbehandlung) UND `selectedCategory` exakt gegen `item.category` (UND-Verknüpfung beider Filter).
- Bei 0 Treffern gibt es **keinen eigenen "Keine Ergebnisse"-Hinweistext** – es wird lediglich "0 articles found" angezeigt und das `role=feed`-Element bleibt leer. Das ist das erwartete Ist-Verhalten und sollte so verifiziert werden (kein Blindflug auf einen nicht existierenden Empty-State-Text).
- Ergebniszähler-Text: "{n} articles found" (`role` nicht gesetzt, per `getByText(/articles found/)` ansprechbar).
- Artikelkarten: `role=article`, `aria-labelledby` auf Titel-Überschrift; enthalten Quelle als Chip, optional Kategorie-Chip (nur falls `item.category` gesetzt), Titel als externer Link (`target=_blank`, `rel=noopener noreferrer`), Beschreibung mit entfernten HTML-Tags (Regex `<[^>]*>`) oder Fallback "No description available", Datum lokalisiert `de-DE` (`"15. Juli 2026"`-Format) oder Fallback "Date unavailable".
- Standardmäßig laufen die RSS-Quellen **live** gegen echte externe Feeds (TechCrunch, Hacker News, Reuters, BBC World) – das liefert bei manueller Exploration z. B. 83 Artikel und ist von Natur aus volatil/potenziell flaky (Netzwerk, Rate-Limits, wechselnde Artikelanzahl/-inhalte). Für deterministische Assertions (exakte Anzahl, exakte Titel, Edge Cases wie fehlendes `pubDate`/`description`/`category`) MUSS mit `page.route('**/api/news/public', ...)` gemockt werden oder die App mit `RSS_OFFLINE_MODE=true` (liefert `app/api/feed.json`, 20 statische Items) gestartet werden. Tests, die reale Artikelanzahl/-inhalte behaupten, sind zu vermeiden.
- Keine Pagination vorhanden – alle gefilterten Artikel werden in einem responsiven Grid (`md:grid-cols-2 lg:grid-cols-3`) gerendert.
- Beim manuellen Test wurden keine Konsolen-Fehler/-Warnungen festgestellt.

## Testumgebung & Annahmen

- Frischer Browser-Kontext ohne gespeicherten State (keine Cookies/LocalStorage), sofern nicht anders angegeben.
- Dev-Server läuft bereits auf Port 3000 (`npm run dev`), `baseURL` ist in `playwright.config.ts` auf `http://localhost:3000` gesetzt.
- Für deterministische Suiten (States, Edge-Case-Felder) wird API-Mocking via `page.route` empfohlen; für reine Happy-Path-/Live-Smoke-Tests darf gegen die echten Feeds getestet werden, jedoch nur mit toleranten Assertions (`toBeGreaterThan(0)` statt exakter Zahlen).

## Test Scenarios

### 1. Happy Path & Artikel-Darstellung

**Seed:** `seed.spec.ts`

#### 1.1. Seite lädt und zeigt News-Artikel an

**File:** `e2e/news/public-news-happy-path.spec.ts`

**Steps:**
  1. Navigiere zu /news/public (frischer Kontext, kein Login)
    - expect: Überschrift 'News Feed' (h1, id=news-feed-title) ist sichtbar
    - expect: Untertitel 'Browse the latest news from public RSS feeds' ist sichtbar
    - expect: Der Lade-Spinner (role=status, 'Loading news feed') verschwindet nach dem Laden
  2. Warte bis das Artikel-Grid (role=feed, 'News articles') geladen ist
    - expect: Mindestens 1 Artikel (role=article) ist sichtbar
    - expect: Der Ergebniszähler-Text ('N articles found') stimmt mit der tatsächlichen Anzahl der role=article-Elemente überein
  3. Prüfe den Aufbau der ersten Artikelkarte
    - expect: Ein Quelle-Chip (z.B. Name der RSS-Quelle) ist sichtbar
    - expect: Ein Titel-Link (role=heading level=2 mit verschachteltem Link) ist sichtbar und nicht leer
    - expect: Ein Beschreibungstext (max. 3 Zeilen, line-clamp) ist sichtbar
    - expect: Ein Datum im deutschen Format (z.B. 'DD. Monatsname YYYY') oder 'Date unavailable' ist sichtbar

#### 1.2. Artikel-Link öffnet Originalquelle in neuem Tab

**File:** `e2e/news/public-news-happy-path.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und warte auf den ersten Artikel
    - expect: Erster Artikel ist sichtbar
  2. Lies href, target und rel des Titel-Links der ersten Karte aus
    - expect: href beginnt mit http(s):// und zeigt auf eine externe Domain
    - expect: target='_blank'
    - expect: rel enthält 'noopener' und 'noreferrer'
  3. Klicke auf den Titel-Link und fange das neue Tab-Event ab (page.waitForEvent('popup'))
    - expect: Ein neuer Tab/Popup öffnet sich mit der erwarteten externen URL
    - expect: Die ursprüngliche News-Seite bleibt unverändert im ersten Tab bestehen

#### 1.3. Kategorie-Chip wird nur angezeigt, wenn eine Kategorie vorhanden ist

**File:** `e2e/news/public-news-happy-path.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit zwei Items: eines mit category='Technology', eines ohne category-Feld (via page.route)
    - expect: Route-Mock ist gesetzt, bevor navigiert wird
  2. Navigiere zu /news/public
    - expect: Beide Artikel sind sichtbar (role=article, count=2)
  3. Prüfe die Chips beider Karten
    - expect: Die Karte mit category zeigt zwei Chips (Quelle + Kategorie)
    - expect: Die Karte ohne category zeigt nur einen Chip (Quelle), keinen leeren zweiten Chip

#### 1.4. Fallback-Texte für fehlende Beschreibung und fehlendes Datum

**File:** `e2e/news/public-news-happy-path.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit einem Item ohne description-Feld und ohne pubDate-Feld
    - expect: Route-Mock ist gesetzt
  2. Navigiere zu /news/public
    - expect: Der Artikel ist sichtbar
  3. Prüfe Beschreibung und Datum der Karte
    - expect: Beschreibungstext lautet 'No description available'
    - expect: Datumstext lautet 'Date unavailable'

#### 1.5. HTML-Tags in der Beschreibung werden entfernt

**File:** `e2e/news/public-news-happy-path.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit einem Item, dessen description HTML enthält (z.B. '<p>Hallo <b>Welt</b></p>')
    - expect: Route-Mock ist gesetzt
  2. Navigiere zu /news/public
    - expect: Der angezeigte Beschreibungstext ist 'Hallo Welt' ohne HTML-Tags oder spitze Klammern

### 2. Suche

**Seed:** `seed.spec.ts`

#### 2.1. Suche filtert Artikel live nach Titel ohne Enter/Submit

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit deterministischen Testdaten (z.B. mockNewsData.success aus solutions/e2e/mocks/news-mocks.ts oder eigenes Fixture mit bekannten Titeln)
    - expect: Mock ist gesetzt
  2. Navigiere zu /news/public und notiere die initiale Artikelanzahl
    - expect: Initiale Anzahl > 0 und entspricht der Mock-Datenmenge
  3. Tippe einen Suchbegriff, der im Titel genau eines Artikels vorkommt, in das Suchfeld ('Search news articles'), OHNE Enter zu drücken
    - expect: Ohne weitere Aktion filtert sich die Liste sofort (Debounce/Live-Filter)
    - expect: Genau der erwartete Artikel bleibt sichtbar
    - expect: Der Ergebniszähler zeigt '1 articles found'

#### 2.2. Suche findet Treffer auch nur in der Beschreibung

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Mocke die API mit einem Artikel, dessen Suchbegriff nur in description, nicht im title vorkommt
    - expect: Mock gesetzt
  2. Navigiere zu /news/public und gib den Suchbegriff ein
    - expect: Der Artikel bleibt trotz fehlendem Treffer im Titel sichtbar (Match über description)

#### 2.3. Suche ist case-insensitive

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Mocke die API mit einem Artikel mit Titel 'Global Market Analysis'
    - expect: Mock gesetzt
  2. Navigiere zu /news/public und suche nach 'GLOBAL market'
    - expect: Der Artikel bleibt trotz abweichender Groß-/Kleinschreibung sichtbar

#### 2.4. Suche ohne Treffer zeigt 0 Artikel und '0 articles found', ohne Absturz

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Navigiere zu /news/public (live oder gemockt) und warte auf initiale Artikel
    - expect: Mindestens 1 Artikel initial sichtbar
  2. Gib einen garantiert nicht vorkommenden Suchbegriff ein (z.B. 'xyzNichtExistierend12345')
    - expect: Es sind 0 Artikel (role=article) sichtbar
    - expect: Der Ergebniszähler zeigt '0 articles found'
    - expect: Kein JavaScript-Fehler in der Konsole
    - expect: Das Grid (role=feed) bleibt vorhanden, aber leer (aktuell existiert kein spezieller Empty-State-Hinweistext – dies ist bewusst zu dokumentieren, nicht als Bug zu werten)

#### 2.5. Suche mit Sonderzeichen führt nicht zu Fehlern

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Navigiere zu /news/public
    - expect: Seite geladen
  2. Gib nacheinander Sonderzeichen-Suchbegriffe ein: 'C++', 'AI/ML', '(test)', '*.?', nur Leerzeichen '   '
    - expect: Für jede Eingabe wird die Liste ohne Exception gefiltert (0 oder mehr Treffer)
    - expect: Kein JS-Fehler in der Konsole
    - expect: Die App bleibt bedienbar

#### 2.6. Suche zurücksetzen zeigt wieder alle Artikel

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und merke initiale Artikelanzahl
    - expect: Initiale Anzahl > 0
  2. Gib einen Suchbegriff ein, der die Liste einschränkt
    - expect: Anzahl reduziert sich (<= initiale Anzahl)
  3. Leere das Suchfeld vollständig (clear())
    - expect: Die Artikelanzahl entspricht wieder der initialen Anzahl
    - expect: Der Ergebniszähler stimmt wieder mit der initialen Anzahl überein

#### 2.7. Suchfeld ist mit der Tastatur bedienbar

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und fokussiere das Suchfeld per Tab-Navigation (nicht per Klick)
    - expect: Das Suchfeld erhält sichtbar den Fokus
  2. Tippe Zeichenweise (pressSequentially) einen Suchbegriff und drücke danach Escape/Tab
    - expect: Eingegebener Text erscheint korrekt im Feld
    - expect: Die Artikelliste filtert sich entsprechend
    - expect: Fokus kann per Tab zum Kategorie-Dropdown weiterwandern

#### 2.8. Sucheingabe bleibt nach erneutem Laden der Seite nicht erhalten

**File:** `e2e/news/public-news-search.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und gib einen Suchbegriff ein
    - expect: Suchfeld enthält den Begriff, Liste ist gefiltert
  2. Lade die Seite neu (page.reload()) bzw. navigiere erneut zu /news/public
    - expect: Das Suchfeld ist wieder leer
    - expect: Alle Artikel werden wieder angezeigt (kein Query-Param/State wird persistiert)

### 3. Kategorie-Filter & kombinierte Filter

**Seed:** `seed.spec.ts`

#### 3.1. Kategorie-Dropdown zeigt alle erwarteten Optionen

**File:** `e2e/news/public-news-category-filter.spec.ts`

**Steps:**
  1. Navigiere zu /news/public
    - expect: Seite geladen
  2. Öffne/prüfe das Dropdown 'Filter news by category'
    - expect: Optionen in Reihenfolge: 'All Categories' (default, ausgewählt), 'Technology', 'Business', 'World News'
    - expect: Keine weiteren/unerwarteten Optionen vorhanden

#### 3.2. Auswahl einer Kategorie filtert die Artikel korrekt

**File:** `e2e/news/public-news-category-filter.spec.ts`

**Steps:**
  1. Mocke die API mit Artikeln aus allen drei Kategorien (mind. je 1)
    - expect: Mock gesetzt
  2. Navigiere zu /news/public und wähle im Dropdown 'Technology'
    - expect: Nur Artikel mit Kategorie-Chip 'Technology' sind sichtbar
    - expect: Ergebniszähler stimmt mit der Anzahl der Technology-Artikel im Mock überein
  3. Iteriere über alle sichtbaren Artikelkarten
    - expect: Jede sichtbare Karte zeigt den Kategorie-Chip 'Technology', keine andere Kategorie ist sichtbar

#### 3.3. Zurück zu 'All Categories' zeigt wieder alle Artikel

**File:** `e2e/news/public-news-category-filter.spec.ts`

**Steps:**
  1. Navigiere zu /news/public, notiere initiale Anzahl, wähle Kategorie 'World News'
    - expect: Anzahl reduziert sich
  2. Wähle im Dropdown wieder 'All Categories'
    - expect: Die Artikelanzahl entspricht wieder der initialen Gesamtanzahl

#### 3.4. Suche und Kategorie-Filter werden UND-verknüpft kombiniert

**File:** `e2e/news/public-news-category-filter.spec.ts`

**Steps:**
  1. Mocke die API mit mehreren Artikeln, darunter genau ein Artikel mit Titel enthält 'Cloud' UND Kategorie 'Technology', sowie weitere Artikel die nur eine der beiden Bedingungen erfüllen
    - expect: Mock gesetzt
  2. Navigiere zu /news/public, suche nach 'Cloud' und wähle zusätzlich Kategorie 'Technology'
    - expect: Nur der eine Artikel, der beide Kriterien erfüllt, ist sichtbar
    - expect: Ergebniszähler zeigt '1 articles found'

#### 3.5. Kombination aus Suche und Kategorie ohne Treffer

**File:** `e2e/news/public-news-category-filter.spec.ts`

**Steps:**
  1. Navigiere zu /news/public, wähle Kategorie 'Business' und suche zusätzlich nach einem Begriff, der garantiert in keinem Business-Artikel vorkommt
    - expect: 0 Artikel sichtbar
    - expect: Ergebniszähler zeigt '0 articles found'
    - expect: Dropdown-Auswahl 'Business' und Sucheingabe bleiben unverändert erhalten (kein Reset)

### 4. Lade-, Fehler- und Leerzustand (API-Mocking)

**Seed:** `seed.spec.ts`

#### 4.1. Ladezustand wird während des Requests angezeigt

**File:** `e2e/news/public-news-states.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit künstlicher Verzögerung (z.B. 1-2s) und erfolgreicher Antwort
    - expect: Mock mit Delay gesetzt
  2. Navigiere zu /news/public, OHNE auf networkidle zu warten
    - expect: Der Spinner (role=status, aria-label 'Loading news feed') mit Text 'Loading news feed…' ist sofort sichtbar
    - expect: Das Artikel-Grid ist währenddessen NICHT sichtbar
  3. Warte, bis der Request abgeschlossen ist
    - expect: Der Spinner verschwindet
    - expect: Das Artikel-Grid mit den gemockten Artikeln wird angezeigt

#### 4.2. Fehlerzustand bei API-Fehler (HTTP 500)

**File:** `e2e/news/public-news-states.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit Status 500 und einer Fehler-JSON-Antwort (z.B. mockErrorResponse aus solutions/e2e/mocks/news-mocks.ts)
    - expect: Mock gesetzt
  2. Navigiere zu /news/public
    - expect: Die Fehlermeldung (role=alert, aria-label 'Failed to load RSS feeds') mit Text 'Failed to load RSS feeds' ist sichtbar
    - expect: Der Ladespinner ist nicht mehr sichtbar
    - expect: Keine Artikelkarten (role=article) sind sichtbar
    - expect: Weder Suchfeld noch Kategorie-Filter werden angezeigt (Early-Return im Error-Fall laut Quellcode)

#### 4.3. Fehlerzustand bei Netzwerkabbruch

**File:** `e2e/news/public-news-states.spec.ts`

**Steps:**
  1. Mocke /api/news/public so, dass die Route mit route.abort() abgebrochen wird
    - expect: Mock gesetzt
  2. Navigiere zu /news/public
    - expect: Die Fehlermeldung 'Failed to load RSS feeds' wird angezeigt (SWR-Fehlerpfad greift auch bei Netzwerkfehlern)

#### 4.4. Leerer Feed zeigt korrekt '0 articles found' ohne Fehler

**File:** `e2e/news/public-news-states.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit Status 200 und { items: [] } (mockNewsData.empty)
    - expect: Mock gesetzt
  2. Navigiere zu /news/public
    - expect: Keine Fehlermeldung wird angezeigt
    - expect: Suchfeld und Kategorie-Filter sind sichtbar und bedienbar
    - expect: Ergebniszähler zeigt '0 articles found'
    - expect: Das Grid (role=feed) enthält keine role=article-Elemente
  3. Gib trotz leerem Feed einen Suchbegriff ein
    - expect: Keine Exception, Zähler bleibt bei '0 articles found'

#### 4.5. Malformed JSON in der API-Antwort führt zu Fehlerzustand statt Absturz

**File:** `e2e/news/public-news-states.spec.ts`

**Steps:**
  1. Mocke /api/news/public mit Status 200 aber ungültigem JSON-Body (z.B. '{invalid')
    - expect: Mock gesetzt
  2. Navigiere zu /news/public
    - expect: Die Anwendung zeigt entweder den Fehlerzustand oder bleibt zumindest ohne unbehandelte JS-Exception in der Konsole (Konsole auf uncaught exceptions prüfen)

### 5. Zugriff ohne Login / Öffentliche Verfügbarkeit

**Seed:** `seed.spec.ts`

#### 5.1. Seite ist ohne Authentifizierung vollständig nutzbar

**File:** `e2e/news/public-news-access.spec.ts`

**Steps:**
  1. Öffne einen komplett neuen, nicht authentifizierten Browser-Kontext (kein storageState) und navigiere direkt zu /news/public
    - expect: Kein Redirect zu /auth/signin
    - expect: Kein 'Access Denied'-Hinweis
    - expect: Der Titel 'News Feed', Suchfeld, Kategorie-Filter und Artikel werden normal angezeigt
  2. Prüfe, dass Suche und Kategorie-Filter ohne Login voll funktionsfähig sind
    - expect: Filterfunktionen arbeiten identisch zum eingeloggten Zustand

#### 5.2. Abgrenzung zu /news/private (Negativ-Kontrolltest)

**File:** `e2e/news/public-news-access.spec.ts`

**Steps:**
  1. Navigiere im selben nicht authentifizierten Kontext zu /news/private
    - expect: Eine 'Access Denied'-Karte mit Titel 'Access Denied' und Button/Link 'Sign In' wird angezeigt (Kontrast zur frei zugänglichen /news/public-Seite)
  2. Navigiere zurück zu /news/public
    - expect: Die öffentliche Seite ist weiterhin ohne Einschränkung zugänglich

#### 5.3. Direkter Deep-Link mit Reload bleibt zugänglich

**File:** `e2e/news/public-news-access.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und lade die Seite mehrfach neu (page.reload())
    - expect: Die Seite bleibt bei jedem Reload ohne Login erreichbar und zeigt konsistent Titel, Filter und Artikel

### 6. Barrierefreiheit

**Seed:** `seed.spec.ts`

#### 6.1. Wesentliche ARIA-Landmarks und Labels sind korrekt gesetzt

**File:** `e2e/news/public-news-a11y.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und warte auf geladene Artikel
    - expect: Seite geladen
  2. Prüfe die Rollen und aria-labels der Kernelemente
    - expect: role=search mit aria-label 'News filter options' vorhanden
    - expect: Textfeld mit aria-label 'Search news articles' vorhanden
    - expect: Combobox mit aria-label 'Filter news by category' vorhanden
    - expect: role=feed mit aria-label 'News articles' vorhanden
    - expect: Jede Artikelkarte hat role=article und aria-labelledby, das auf eine sichtbare Überschrift zeigt

#### 6.2. Skip-Link funktioniert

**File:** `e2e/news/public-news-a11y.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und drücke direkt nach dem Laden Tab, um den 'Skip to main content'-Link zu fokussieren
    - expect: Der Skip-Link ist sichtbar/fokussiert
  2. Aktiviere den Skip-Link (Enter)
    - expect: Der Fokus springt zum Hauptinhaltsbereich (#main-content)

#### 6.3. Automatisierter Accessibility-Scan ohne kritische Verstöße

**File:** `e2e/news/public-news-a11y.spec.ts`

**Steps:**
  1. Navigiere zu /news/public und warte auf geladene Artikel (nach dem Vorbild von e2e/a11y.spec.ts mit @axe-core/playwright)
    - expect: Seite geladen
  2. Führe einen AxeBuilder-Scan der Seite aus
    - expect: Keine 'critical' oder 'serious' Verstöße im Ergebnis (violations)

#### 6.4. Ladezustand ist für Screenreader korrekt annonciert

**File:** `e2e/news/public-news-a11y.spec.ts`

**Steps:**
  1. Mocke die API mit Verzögerung, navigiere zu /news/public
    - expect: role=status mit aria-label 'Loading news feed' ist während des Ladens im Accessibility Tree vorhanden

### 7. Responsive / Mobile

**Seed:** `seed.spec.ts`

#### 7.1. Suchfeld und Kategorie-Filter sind auf mobilem Viewport nutzbar

**File:** `e2e/news/public-news-mobile.spec.ts`

**Steps:**
  1. Führe den Test im Mobile-Projekt aus (z.B. 'Mobile iPhone' aus playwright.config.ts) und navigiere zu /news/public
    - expect: Suchfeld und Kategorie-Dropdown sind übereinander (vertikal gestapelt) sichtbar, nicht abgeschnitten
  2. Tippe (tap) in das Suchfeld und gib einen Suchbegriff ein
    - expect: Die Artikelliste filtert sich wie auf Desktop
  3. Wähle im Kategorie-Dropdown per Touch eine Kategorie aus
    - expect: Die Filterung funktioniert identisch zum Desktop-Verhalten

#### 7.2. Artikel-Grid passt sich der Viewport-Breite an

**File:** `e2e/news/public-news-mobile.spec.ts`

**Steps:**
  1. Navigiere zu /news/public auf einem mobilen Viewport (< 768px Breite)
    - expect: Artikelkarten werden einspaltig untereinander dargestellt
  2. Navigiere zu /news/public auf Desktop-Breite (>= 1024px)
    - expect: Artikelkarten werden mehrspaltig (3 Spalten) dargestellt

#### 7.3. Seite funktioniert auf Android-Mobile-Projekt

**File:** `e2e/news/public-news-mobile.spec.ts`

**Steps:**
  1. Führe den Happy-Path-Test (Laden, Suche, Kategorie-Filter, Artikel-Link öffnen) im Projekt 'Mobile Android' aus
    - expect: Alle Kernfunktionen verhalten sich äquivalent zum Desktop-Chromium-Projekt, keine layoutbedingten Fehlklicks (z.B. verdeckte Elemente)
