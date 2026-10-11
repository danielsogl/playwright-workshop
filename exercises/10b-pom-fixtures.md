# Übung 10b – Page Objects als Fixtures

**Ziel:** Du stellst die Page Objects aus Übung 9 als Fixtures bereit. Die Tests nennen nur noch, welche Seite sie brauchen, und starten dort schon fertig vorbereitet.
**Zeit:** 20 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/10b-pom-fixtures` · **Dateien:** `e2e/fixtures/pages.fixture.ts`, `e2e/10b-pom-fixtures.spec.ts`

> Roter Faden: Baut auf: Übung 8 (Fixtures) und Übung 9 (Page Objects). Beide Lösungen liegen im Startbranch, du musst sie nicht selbst geschrieben haben. · Du gibst weiter: eine Fixture-Datei für Page Objects, die du mit `mergeTests` mit anderen Fixtures kombinierst. · Zurückgefallen? → `git switch ex/10b-pom-fixtures` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/10b-pom-fixtures ex/11-api-mocking`.

Im Startbranch liegen `NewsPage`, `HomePage` und `LoginPage` unter `e2e/pages/` und die Auth-Fixture unter `e2e/fixtures/auth.fixture.ts`. Schau dir `NewsPage` kurz an, bevor du loslegst.

## Aufgaben

### Aufgabe 1 – Fixture-Datei anlegen
Lege `e2e/fixtures/pages.fixture.ts` an. Erweitere `test` aus `@playwright/test` um die Fixtures `homePage`, `newsPage` und `loginPage`. Jede Fixture erzeugt das Page Object und öffnet die Seite, bevor sie es mit `use()` an den Test gibt. Exportiere `test` und `expect`.

**Fertig, wenn:** die Datei ohne TypeScript-Fehler kompiliert.

<details><summary>Tipp</summary>

```ts
export const test = base.extend<{ newsPage: NewsPage }>({
  newsPage: async ({ page }, use) => {
    const newsPage = new NewsPage(page);
    await newsPage.goto();
    await use(newsPage);
  },
});
```
`HomePage.goto()` und `LoginPage.goto()` geben das Page Object zurück, dort reicht `await use(await new LoginPage(page).goto())`.
</details>

### Aufgabe 2 – Tests mit Fixtures schreiben
Lege `e2e/10b-pom-fixtures.spec.ts` an und importiere `test` und `expect` aus deiner Fixture-Datei. Drei Tests:

1. **Suche:** Titel des ersten Artikels holen, danach suchen. Genau ein Artikel bleibt übrig, sein Titel ist der gesuchte.
2. **Kategorie:** nach „Technology" filtern. Kein sichtbarer Artikel enthält eine andere Kategorie.
3. **Login:** mit falschen Daten anmelden. Die Fehlermeldung erscheint, die URL bleibt bei `auth/signin`.

**Fertig, wenn:** `npx playwright test e2e/10b-pom-fixtures.spec.ts` grün ist und kein Test `page` oder `new …Page()` benutzt.

<details><summary>Tipp</summary>
`expect(newsPage.newsItems).toHaveCount(1)` wartet automatisch. Für den Kategorie-Test: `newsPage.newsItems.filter({ hasNotText: 'Technology' })` muss `toHaveCount(0)` haben. Prüfe vorher, dass überhaupt ein Artikel sichtbar ist, sonst ist die Assertion trivial wahr.
</details>

## Bonus (optional)
### Bonus A – Mit der Auth-Fixture kombinieren
Kombiniere deine Page-Fixtures mit `test` aus `e2e/fixtures/auth.fixture.ts` per `mergeTests`. Schreibe einen Test, der `authenticatedPage` und `homePage` nutzt und über die Navigation zu „Private News" geht. **Fertig, wenn:** die URL `/news/private` ist und nicht zur Anmeldung umleitet.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/10b-pom-fixtures ex/11-api-mocking` · oder `git switch ex/11-api-mocking`.
Alles fertig, wenn `npx playwright test e2e/10b-pom-fixtures.spec.ts` grün ist.
