# Übung 2b – Locators aufräumen

**Ziel:** Du stellst einen grünen, aber brüchigen Test von CSS-Selektoren auf nutzernahe Locators um und lässt dir dabei von Codegen helfen.
**Zeit:** 20 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/02b-locators-aufraeumen` · **Datei:** `e2e/02b-locators-aufraeumen.spec.ts`

> Roter Faden: Baut auf: Übung 1b (Codegen) und Übung 2 (Locator-Strategien). · Du gibst weiter: Locators nach Rolle und Label, die Übung 4 mit Assertions weiterverwendet. · Zurückgefallen? → `git switch ex/02b-locators-aufraeumen` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/02b-locators-aufraeumen ex/03-interaktionen`.

Der folgende Test ist grün. Er hängt aber an CSS-Klassen, IDs und der DOM-Struktur: Ein neues Styling oder ein umgebautes Layout macht ihn rot, obwohl die App für Nutzer genauso funktioniert.

```ts
import { test, expect } from '@playwright/test';

test('News suchen', async ({ page }) => {
  await page.goto('/');
  await page.locator('a.bg-accent').click();
  await expect(page.locator('h1')).toHaveText('News Feed');
  await expect(page.locator('div[role=feed] > article').first()).toBeVisible();
  await page.locator('#search-news').fill('Playwright');
  await page.locator('#filter-category').selectOption('Technology');
  await expect(page.locator('p.font-mono.text-sm')).toContainText('found');
});
```

## Aufgaben

### Aufgabe 1 – Startcode anlegen
Lege `e2e/02b-locators-aufraeumen.spec.ts` mit dem Startcode an und führe ihn aus.

**Fertig, wenn:** der Test in allen drei Browsern grün ist.

### Aufgabe 2 – Bessere Locators picken
Öffne die App mit `npx playwright codegen http://localhost:3000` (App läuft per `npm run dev`) oder starte den Test mit `--ui`. Nutze „Pick locator“ für jedes Element, das der Startcode anspricht.

**Fertig, wenn:** du für alle sechs Elemente einen Vorschlag notiert hast.

<details><summary>Tipp</summary>
Im UI Mode sitzt „Pick locator“ im Tab „Locator“ unter dem Snapshot. Im Codegen-Inspector ist es das Fadenkreuz-Symbol.
</details>

### Aufgabe 3 – Umstellen
Ersetze jedes `page.locator('…')` durch `getByRole`, `getByLabel` oder `getByText`. Behalte die Assertions bei.

**Fertig, wenn:** im Test kein `page.locator(` mehr steht und er weiter in allen Browsern grün ist.

<details><summary>Tipp</summary>
Die Artikel haben die Rolle `article`, Suchfeld und Kategorie haben ein `aria-label`. Für den Trefferzähler passt ein RegExp: `getByText(/\d+ articles? found/)`.
</details>

### Aufgabe 4 – Vergleichen
Lege deinen aufgenommenen Test aus Übung 1b daneben.

**Fertig, wenn:** du sagen kannst, welche Locators Codegen gewählt hat und wo sie sich von deinen unterscheiden.

## Bonus (optional)
### Bonus A – Brüchigkeit beweisen
Ändere in `app/(site)/news/public/page.tsx` testweise die Klasse `text-sm` des Trefferzählers. Lass beide Versionen laufen und mach die Änderung danach rückgängig. **Fertig, wenn:** der Startcode rot und dein Test grün war.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/02b-locators-aufraeumen ex/03-interaktionen` · oder `git switch ex/03-interaktionen`.
