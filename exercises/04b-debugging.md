# Übung 4b – Debugging: einen kaputten Test reparieren

**Ziel:** Du findest drei Fehler in einem Test, jeden mit einem anderen Werkzeug: Fehlermeldung und UI Mode, Inspector, Trace Viewer.
**Zeit:** 20 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/04b-debugging` · **Datei:** `e2e/04b-debugging.spec.ts`

> Roter Faden: Baut auf: Übung 4, du kennst die Assertions, jetzt liest du ihre Fehler. · Du gibst weiter: einen Ablauf, mit dem du jeden roten Test untersuchst. · Zurückgefallen? → `git switch ex/04b-debugging` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/04b-debugging ex/05-suche`.

Lege `e2e/04b-debugging.spec.ts` mit diesem Test an. Er soll prüfen, dass die Kategorie „Business“ die News filtert, und er enthält genau drei Fehler. Repariere sie nacheinander, ändere aber nur die fehlerhaften Stellen.

```typescript
import { test, expect } from '@playwright/test';

test('Kategorie Business filtert die News', async ({ page }) => {
  await page.goto('/news/public');
  expect(await page.getByRole('article').count()).toBe(20);

  await page
    .getByRole('combobox', { name: 'Kategorie' })
    .selectOption('Business');

  await expect(page.getByRole('article').getByRole('heading'))
    .toContainText('Market');
});
```

## Aufgaben

### Aufgabe 1 – Fehlermeldung lesen, im UI Mode nachsehen
Starte `npx playwright test e2e/04b-debugging.spec.ts --project=chromium`. Lies die Fehlermeldung: Welche Zahl hat der Test erwartet, welche bekommen? Öffne dann `npx playwright test e2e/04b-debugging.spec.ts --ui`, starte den Test und klicke im Zeitstrahl auf den Schritt direkt nach `goto`. Was zeigt der DOM-Snapshot an dieser Stelle?

**Fertig, wenn:** du erklären kannst, warum 0 statt 20 herauskam, und die Zeile durch eine Assertion ersetzt hast, die wartet.

<details><summary>Tipp</summary>
Die Artikel lädt die Seite erst nach dem Laden per API nach. `count()` zählt sofort und wartet nicht. `toHaveCount()` wiederholt die Prüfung, bis die Zahl stimmt.
</details>

### Aufgabe 2 – Mit dem Inspector den Locator finden
Starte `npx playwright test e2e/04b-debugging.spec.ts --project=chromium --debug`. Gehe mit „Step over“ bis zu `selectOption` und lies das Log: Worauf wartet Playwright? Nutze „Pick locator“ und klicke im Browser auf das Kategorie-Auswahlfeld.

**Fertig, wenn:** der Test nicht mehr in den Timeout läuft, weil der Locator den richtigen Namen nutzt.

<details><summary>Tipp</summary>
Der Name kommt aus dem `aria-label` des Feldes, nicht aus dem sichtbaren Text. Der Picker schlägt dir `getByRole('combobox', { name: … })` mit dem echten Namen vor.
</details>

### Aufgabe 3 – Im Trace Viewer die Treffer zählen
Starte `npx playwright test e2e/04b-debugging.spec.ts --project=chromium --trace on` und öffne den Report mit `npx playwright show-report`. Öffne dort den Trace und klicke auf die fehlgeschlagene Assertion. Lies die Meldung „strict mode violation“: Wie viele Elemente hat der Locator gefunden?

**Fertig, wenn:** der Locator genau eine Überschrift trifft (die des ersten Artikels) und der Test in allen Browsern grün ist: `npx playwright test e2e/04b-debugging.spec.ts`.

<details><summary>Tipp</summary>
Eine Assertion auf einen Locator verlangt genau einen Treffer. Mit `.first()` grenzt du auf den ersten Artikel ein. Prüfe außerdem mit `toHaveCount()`, dass nach dem Filtern 5 Artikel übrig sind.
</details>

## Bonus (optional)
### Bonus – Ist der Test jetzt stabil?
Starte den reparierten Test mit `--repeat-each=10`. **Fertig, wenn:** alle 30 Läufe (10 je Browser) grün sind. Baue testweise den Fehler aus Aufgabe 1 wieder ein: Schlägt er jedes Mal fehl oder nur manchmal?

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/04b-debugging ex/05-suche` · oder `git switch ex/05-suche`.
