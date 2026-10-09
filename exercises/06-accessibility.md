# Übung 6 – Accessibility Testing mit Axe

**Ziel:** Du scannst Seiten der Feed App mit Axe auf Barrierefreiheits-Probleme und prüfst die Seitenstruktur per ARIA-Snapshot. Gefundene Probleme dokumentierst du als Befund, du behebst sie nicht.
**Zeit:** 35 Min. (Pflicht) · Bonus: +15 Min. · **Startbranch:** `git switch ex/06-accessibility` · **Datei:** `e2e/06-accessibility.spec.ts`

> Roter Faden: Baut auf: Übung 4, dieselben Seiten (`/`, `/news/public`), neue Prüf-Dimension. · Du gibst weiter: a11y-Scans als zusätzliche Qualitätsstufe deiner Suite. · Zurückgefallen? → `git switch ex/06-accessibility` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/06-accessibility ex/06b-dialoge-downloads`. Sie enthält mehr Tests als die Pflichtaufgaben.

**Axe** (`@axe-core/playwright`, im Workshop-Repo installiert) prüft eine geladene Seite gegen Barrierefreiheits-Regeln und liefert eine Liste von **Violations**. Jede Violation hat Regel-ID, Auswirkung (`impact`), Hilfe-Link (`helpUrl`) und die betroffenen Elemente (`nodes`). Automatische Scans finden nur einen Teil der Probleme, ein manueller Test mit Screenreader bleibt nötig.

> **Rote Violations: Befund oder Fehler?** Ein roter Axe-Test heißt: Die **App** hat ein Problem, nicht dein Test. Lies den Report (Regel, Selektor, `helpUrl`), halte den Befund fest und ändere weder die Erwartung noch schaltest du die Regel ab. Ist ein Problem bekannt und wird später behoben, markierst du den Test mit `test.fail()` (siehe Bonus A). Die Demo-App ist so gebaut, dass die Pflichtaufgaben grün werden.

## Aufgaben

### Aufgabe 1 – Startseite scannen
Lege `e2e/06-accessibility.spec.ts` an. Öffne `/`, warte, bis `main` sichtbar ist, führe einen `AxeBuilder`-Scan aus und erwarte keine Violations.
**Fertig, wenn:** der Test grün ist und `results.violations` ein leeres Array ist.
<details><summary>Tipp</summary>
`import AxeBuilder from '@axe-core/playwright'`, dann `await new AxeBuilder({ page }).analyze()`. Das Warten auf `page.getByRole('main')` stellt sicher, dass die Seite gerendert ist, bevor Axe scannt. Erwartung: `expect(results.violations).toEqual([])`.
</details>

### Aufgabe 2 – News-Feed mit lesbarem Report
Scanne `/news/public` (warte auf den ersten `article`). Gib vor der Assertion jede Violation mit `impact`, `description`, `helpUrl` und den `target`-Selektoren ihrer `nodes` aus. Erwarte danach 0 Violations.
**Fertig, wenn:** der Test grün ist und der Report-Code vor der Assertion steht. Bei 0 Violations erscheint keine Log-Ausgabe, bei einer Violation siehst du sofort Regel und Selektor.
<details><summary>Tipp</summary>
`results.violations.forEach(...)` und darin `violation.nodes.forEach(...)`. Das Log steht dabei ohne `if`, bei 0 Violations passiert einfach nichts.
</details>

### Aufgabe 3 – WCAG-Level AA
Scanne `/` nur gegen die Regeln für WCAG 2.1 und 2.2 Level AA.
**Fertig, wenn:** der Test grün ist und der Scan auf die fünf Tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` begrenzt ist.
<details><summary>Tipp</summary>
`new AxeBuilder({ page }).withTags([...])`. Ein **Tag** ordnet Regeln einem Standard und Level zu.
</details>

### Aufgabe 4 – Nur Teile der Seite prüfen
Schreibe zwei Tests: Auf `/` scannst du nur die Navigation, auf `/auth/signin` nur das Formular.
**Fertig, wenn:** beide Tests grün sind und jeder Scan mit `include(...)` auf sein Element begrenzt ist.
<details><summary>Tipp</summary>
`.include('nav')` bzw. `.include('form')` nimmt einen CSS-Selektor. Für das Formular reicht `expect(results.violations).toEqual([])`.
</details>

### Aufgabe 5 – Struktur mit ARIA-Snapshot
Ein **ARIA-Snapshot** beschreibt den Accessibility-Baum eines Elements als YAML-Text. Prüfe damit zwei Dinge:
- Auf `/`: Die Navigation (Rolle `navigation`, Name „Main navigation“) enthält einen Link „Navigate to Public News“ mit `/url: /news/public`.
- Auf `/auth/signin`: Das Formular „Sign in form“ hat zwei Textfelder und den Button „Submit sign in form“. Prüfe den Button zusätzlich mit `toHaveRole` und `toHaveAccessibleName`.

**Fertig, wenn:** beide Tests grün sind, mindestens ein `toMatchAriaSnapshot` und ein `toHaveAccessibleName` vorkommen.
<details><summary>Tipp</summary>
Du musst das YAML nicht von Hand schreiben: `await expect(locator).toMatchAriaSnapshot('')` zusammen mit `npx playwright test e2e/06-accessibility.spec.ts --update-snapshots` füllt das Template aus. Alternativ erzeugt der Codegen-Button „Assert snapshot“ es. Teil-Templates prüfen nur, was du aufführst. Das Navigations-Element findest du mit `getByRole('navigation', { name: 'Main navigation', exact: true })`.
</details>

**Alles fertig, wenn:** `npx playwright test e2e/06-accessibility.spec.ts --project=chromium` grün ist.

## Bonus (optional)

### Bonus A – Dark und Light Mode
Die Feed App startet per `next-themes` immer dunkel. `test.use({ colorScheme: 'dark' })` setzt nur `prefers-color-scheme` und schaltet das Theme **nicht** um. Prüfe die Kontraste (`color-contrast`, Tag `wcag2aa`) in beiden Modi.
**Fertig, wenn:** der Dark-Mode-Test grün ist. Der Light-Mode-Test hat einen bekannten Befund: `.text-muted` hat nur 4.43:1 statt 4.5:1. Markiere ihn mit `test.fail()`, dann gilt „Test scheitert“ als Erfolg, und er schlägt Alarm, sobald die App den Kontrast behebt.
<details><summary>Tipp</summary>
Light Mode erzwingst du vor dem Laden: `page.addInitScript(() => localStorage.setItem('theme', 'light'))`, dann `goto`. Prüfe vorher, dass `html` die Klasse `dark` nicht hat. Warte vor dem Scan, bis keine CSS-Übergänge mehr laufen (`document.getAnimations().length` ist 0), sonst misst Axe Zwischenfarben. `test.fail(true, 'Grund')` setzt du am Anfang des Tests.
</details>

### Bonus B – Mobile und Tastatur
- Viewport 375 × 667: Auf `/` darf die Regel `target-size` keine Violation liefern.
- Tastatur: Nach einem `Tab` auf `/` hat der Link „Skip to main content“ den Fokus.

**Fertig, wenn:** beide Tests grün sind. WebKit fokussiert Links per Tab nur mit macOS Full Keyboard Access: Überspringe den Tastatur-Test dort mit `test.skip(browserName === 'webkit')`.

### Bonus C – Ausnahmen dokumentieren
Mit `.exclude(selector)` und `.disableRules([...])` nimmst du bewusst Teile aus einem Scan. Schreibe einen Test, der das nutzt, und erkläre in einem Kommentar, warum die Ausnahme gilt. Ohne Begründung ist eine Ausnahme versteckter Befund.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/06-accessibility ex/06b-dialoge-downloads` · oder `git switch ex/06b-dialoge-downloads`.
