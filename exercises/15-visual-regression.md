# Übung 15 – Visual Regression Testing

**Ziel:** Du erkennst unbeabsichtigte visuelle Änderungen der Feed App mit Screenshot-Vergleichen.
**Zeit:** 35 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/15-visual-regression` · **Datei:** `e2e/15-visual-regression.spec.ts`

> Roter Faden: Baut auf Übung 11 auf (Feed mit `route.fulfill` mocken) und optional auf Übung 9 (`NewsPage`) · Du gibst weiter: Baselines als Schutz gegen Layout-Fehler · Zurückgefallen? `git switch ex/15-visual-regression` (Startbranch enthält die Lösungen aller früheren Übungen, nicht die von Übung 15). Musterlösung: `git diff ex/15-visual-regression ex/16-mobile`.

## Vorbereitung

**Visual Regression:** Ein Test vergleicht einen Screenshot mit einem gespeicherten Referenzbild, der **Baseline**. Weicht das Bild ab, schlägt der Test fehl. Das findet CSS- und Layoutfehler, die funktionale Tests übersehen.

`expect(page).toHaveScreenshot('name.png')` und `expect(locator).toHaveScreenshot(…)` wartet selbst, bis das Bild stabil ist, und schaltet Animationen ab. Warte vorher nur auf den erwarteten Inhalt (web-first), nie mit `networkidle` oder `waitForTimeout`.

Die Zahlen und Daten gelten mit `RSS_OFFLINE_MODE=true` (siehe `.env`, Übung 1). Zusätzlich mockst du den Feed, damit sich die Bilder nicht ändern.

**Das erwartest du beim Ausführen:**
1. **Lauf 1** (`npx playwright test e2e/15-visual-regression.spec.ts --project=chromium`) schlägt fehl. Es gibt noch keine Baselines, Playwright schreibt sie und meldet Fehler, damit eine Pipeline nicht still grün wird.
2. **Lauf 2** mit `--update-snapshots` erzeugt bzw. aktualisiert die Baselines (Ordner `e2e/15-visual-regression.spec.ts-snapshots/`).
3. **Lauf 3** ohne Zusatz vergleicht und ist grün.

## Aufgaben

### Aufgabe 1 – Homepage und News-Grid
Lege `e2e/15-visual-regression.spec.ts` an. Mocke in einem `beforeEach` die Route `**/api/news/public` mit dem Offline-Feed `app/api/feed.json`. Schreibe zwei Tests: Screenshot der gesamten Homepage (`homepage.png`) und nur des News-Grids auf `/news/public` (`news-grid.png`).
**Fertig, wenn:** nach den drei Läufen (siehe oben) beide Tests grün sind und im Snapshot-Ordner `homepage-…png` und `news-grid-…png` liegen.
<details><summary>Tipp</summary>

Die Navbar zeigt „Loading…", bis die Session geladen ist. Warte vor dem Homepage-Screenshot, bis der Button „Loading authentication status" `toBeHidden()` ist, sonst ist die Baseline mal „Loading…", mal „Sign In". `route.fulfill({ path: 'app/api/feed.json' })` liefert die Datei als Antwort. Grid: `getByRole('feed', { name: 'News articles' })`, vorher auf `getByRole('article').first()` warten. Option `fullPage: true` für die ganze Seite.
</details>

### Aufgabe 2 – Dark Mode und Light Mode
Die App startet im Dark Mode. Mache einen Screenshot (`dark-mode.png`), schalte auf Light Mode um und mache einen zweiten (`light-mode.png`).
**Fertig, wenn:** der Test grün ist und zwei verschiedene Baselines (dark, light) existieren. Vor dem zweiten Screenshot hat `html` die Klasse `light`.
<details><summary>Tipp</summary>

Der Schalter heißt nach dem Laden „Switch to light mode" (`getByRole('switch', …)`). Warte mit `expect(page.locator('html')).toHaveClass(/light/)`, bevor du fotografierst.
</details>

### Aufgabe 3 – Dynamischen Inhalt maskieren
Mache einen Screenshot der ersten News-Card (`news-card.png`). Das Veröffentlichungsdatum (z. B. „13. September 2026") ändert sich, also maskiere es.
**Fertig, wenn:** der Test grün ist und die Baseline an der Stelle des Datums eine magentafarbene Fläche zeigt.
<details><summary>Tipp</summary>

Option `mask: [locator]`, Farbe mit `maskColor: '#FF00FF'`. Das Datum findest du mit `card.getByText(/^\d{1,2}\. \S+ \d{4}$/)`.
</details>

### Aufgabe 4 – Responsive Screenshots
Fotografiere die Homepage bei 1920, 768 und 375 px Breite (`homepage-desktop.png`, `homepage-tablet.png`, `homepage-mobile.png`), als Schleife oder drei Tests. Warte nach jedem `goto`, bis die Session geladen ist (wie in Aufgabe 1), sonst sind die Bilder instabil.
**Fertig, wenn:** alle drei Größen grün sind und drei verschieden große Baselines existieren.
<details><summary>Tipp</summary>

`page.setViewportSize({ width, height })` vor `goto`. Zeigt ein Bild ein „Compiling"-Badge von Next.js, blende es aus: `page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })`.
</details>

Gesamt-Check: `npx playwright test e2e/15-visual-regression.spec.ts --project=chromium` ist grün (zweiter Lauf nach der Baseline-Erzeugung).

## Hinweis: Konfiguration (keine Aufgabe)
In `playwright.config.ts` kannst du Vergleichs-Toleranzen für alle Screenshots festlegen und bei Fehlern Bilder mitschreiben lassen. Das musst du hier nicht ändern:
```typescript
expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } }, // 1 % Abweichung erlaubt
use: { screenshot: 'only-on-failure' },
```
Baselines gehören in echten Projekten ins Git. Dieses Demo-Repo ignoriert `**/*-snapshots/` per `.gitignore`, deshalb entstehen sie nur lokal.

## Bonus (optional)

### Bonus A – Cross-Browser
Führe die Tests ohne `--project` aus (`npx playwright test e2e/15-visual-regression.spec.ts`) und erzeuge die Baselines mit `--update-snapshots`. Playwright hängt Projektnamen und Betriebssystem automatisch an den Dateinamen an, jeder Browser hat also eigene Baselines.
**Fertig, wenn:** im Snapshot-Ordner Dateien für `chromium`, `firefox` und `webkit` liegen und ein Lauf ohne Zusatz grün ist. Beachte: Firefox und WebKit müssen installiert sein (`npx playwright install`).

### Bonus B – Leere Liste und Fehlerzustand
Mocke `/api/news/public` einmal mit `{ items: [] }` und einmal mit Status 500 und fotografiere jeweils die ganze Seite. Warte auf „0 articles found" bzw. den Alert „Failed to load RSS feeds".
**Fertig, wenn:** beide Zustände eine Baseline haben und der Lauf grün ist.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/15-visual-regression ex/16-mobile` · oder `git switch ex/16-mobile`. Beachte: Baselines liegen nicht im Git, du erzeugst sie selbst mit `--update-snapshots`.
