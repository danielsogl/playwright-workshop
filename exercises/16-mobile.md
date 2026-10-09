# Übung 16 – Mobile Testing

**Ziel:** Du emulierst mobile Geräte und prüfst, dass sich Navigation und News-Grid der Feed App je nach Bildschirmbreite richtig verhalten.
**Zeit:** 40 Min. (Pflicht) · Bonus: +15 Min. · **Startbranch:** `git switch ex/16-mobile` · **Datei:** `e2e/16-mobile.spec.ts`

> Roter Faden: Baut auf Übung 11 auf (Feed mocken) und optional auf Übung 9 (`NewsPage`) · Du gibst weiter: Mobile-Projekte in der Config · Zurückgefallen? `git switch ex/16-mobile` (Startbranch enthält die Lösungen aller früheren Übungen, nicht die von Übung 16). Musterlösung: `git diff ex/16-mobile ex/16b-ci-lokal`.

## Vorbereitung

**Breakpoints der App (Tailwind):** Hamburger-Menü unter 640 px, Desktop-Navigation ab 1024 px. News-Grid: 1 Spalte unter 768 px, 2 Spalten ab 768 px, 3 Spalten ab 1024 px.

**Projekt:** In `playwright.config.ts` bündelt ein Projekt eine Geräte-Einstellung (Browser, Viewport, Touch). Dieselben Tests laufen dann je Projekt einmal.

**Wichtig:** Setze in jedem Test den Viewport **selbst** (`page.setViewportSize`). Dann verhält sich der Test in jedem Projekt gleich: Ein Test, der sich auf den Standard-Viewport verlässt, bekommt in `Mobile Chrome` eine Handy-Größe und schlägt fehl.

## Aufgaben

### Aufgabe 1 – Mobile-Projekte aktivieren
Öffne `playwright.config.ts`. Die Projekte `Mobile Chrome` (Pixel 5) und `Mobile Safari` (iPhone 12) sind auskommentiert: Kommentiere sie ein. Beschränke beide mit `testMatch` auf `16-mobile.spec.ts`. Ohne diese Beschränkung laufen auch die Specs aller früheren Übungen in den Mobile-Projekten, und die sind dafür nicht gebaut (z. B. ohne Login-Setup).
**Fertig, wenn:** `npx playwright test --list --project="Mobile Chrome"` (nach Aufgabe 2) ausschließlich Tests aus `16-mobile.spec.ts` auflistet.
<details><summary>Tipp</summary>

`testMatch: /16-mobile\.spec\.ts/` als Eigenschaft im Projekt, neben `name` und `use`. Pro Gerät ein eigenes Projekt: Mehrere `devices[…]` in ein `use` zu spreaden überschreibt sich gegenseitig.
</details>

### Aufgabe 2 – Responsive Navigation
Lege `e2e/16-mobile.spec.ts` an und schreibe zwei Tests:
- **Desktop** (Viewport 1280 × 720): Die `navigation` „Main navigation" (`exact: true`) ist sichtbar, der Button „Open menu" ist nicht sichtbar.
- **Mobile** (Viewport 375 × 667): Die Desktop-Navigation ist unsichtbar, „Open menu" ist sichtbar. Nach dem Klick erscheint die `navigation` „Mobile navigation" mit dem Link „Navigate to Public News" und der Button „Close menu".

**Fertig, wenn:** beide Tests mit `npx playwright test e2e/16-mobile.spec.ts` in allen fünf Projekten (chromium, firefox, webkit, Mobile Chrome, Mobile Safari) grün sind.
<details><summary>Tipp</summary>

`getByRole('navigation', { name: 'Main navigation', exact: true })` unterscheidet sie von „Main navigation bar". Unsichtbare Elemente prüfst du mit `toBeHidden()`.
</details>

### Aufgabe 3 – News-Grid auf drei Viewports
Prüfe die Spaltenzahl des Grids (`feed`, Name „News articles") auf `/news/public`: 3 Spalten bei 1280 px, 2 bei 768 px, 1 bei 375 px. Mocke den Feed wie in Übung 11 (`route.fulfill({ path: 'app/api/feed.json' })`) und warte auf den ersten `article`.
**Fertig, wenn:** drei Tests grün sind, in allen fünf Projekten.
<details><summary>Tipp</summary>

`toHaveCSS('grid-template-columns', …)` vergleicht den **berechneten** Wert. Der besteht aus Pixel-Werten, z. B. `"394.656px 394.672px 394.656px"`, nicht aus `repeat(3, …)`. Prüfe mit einem regulären Ausdruck, wie viele Werte es sind, z. B. `/^[\d.]+px [\d.]+px$/` für 2 Spalten.
</details>

### Aufgabe 4 – Ausführen
Starte nacheinander `npx playwright test e2e/16-mobile.spec.ts --project=chromium`, dann `--project="Mobile Chrome"`, dann ohne `--project`.
**Fertig, wenn:** alle drei Läufe ohne `failed` enden. Der Lauf ohne `--project` nutzt alle Projekte, auch die Mobile-Projekte, und das ist nur wegen `testMatch` (Aufgabe 1) und der festen Viewports (Aufgaben 2 und 3) grün.

## Bonus (optional)

### Bonus A – Touch-Gesten
Ergänze in derselben Datei einen `describe`-Block mit `test.use({ …devices['iPhone 13'] })`. Tippe in einem Test mit `tap()` auf „Open menu", dann auf den Link „Navigate to Public News". Erwartet: URL `/news/public`, erster `article` sichtbar.
**Fertig, wenn:** der Test grün ist. `tap()` braucht `hasTouch: true`, das setzt die Geräte-Emulation.
<details><summary>Tipp</summary>

`defaultBrowserType` darf in `test.use` nicht in einem `describe` stehen. Lege die Gerätebeschreibung ohne es an:
```typescript
const { defaultBrowserType: _ignored, ...iPhone13 } = devices['iPhone 13'];
```
</details>

### Bonus B – `window.screen`
Seit Playwright 1.64 liefert `window.screen` in der Emulation die Größe aus der Gerätebeschreibung. Lies `screen.width` und `screen.height` mit `page.evaluate` unter `iPhone 13` aus und vergleiche mit der Gerätebeschreibung.
**Fertig, wenn:** der Test grün ist.

### Bonus C – `isMobile`
Die Test-Variable `isMobile` ist in Mobile-Projekten wahr. Schreibe einen Test, der mit `test.skip(!isMobile, …)` nur dort läuft und das Handy von Hoch- auf Querformat (667 × 375) dreht: Die Artikelzahl bleibt gleich. (`isMobile` wird in Firefox nicht unterstützt.)
**Fertig, wenn:** der Test in `Mobile Chrome` grün ist und in den Desktop-Projekten als „skipped" erscheint.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/16-mobile ex/16b-ci-lokal` · oder `git switch ex/16b-ci-lokal`.
