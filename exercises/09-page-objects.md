# Übung 9 – Page Object Model (POM)

**Ziel:** Du kapselst Locators und Aktionen der Seiten News, Startseite und Login in Page Objects und schreibst Tests, die nur noch diese Klassen benutzen.
**Zeit:** 35 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/09-page-objects` · **Datei:** `e2e/09-page-objects.spec.ts`

> Roter Faden: Baut auf Übung 5 (Suchtest auf `/news/public`) und Übung 7 (Login-Seite) · Du gibst weiter: `NewsPage`, `HomePage`, `LoginPage` in `e2e/pages/` für die Übungen 10, 16 und 17 · Zurückgefallen? `git switch ex/09-page-objects`. Der Startbranch enthält die Lösungen aller früheren Übungen, aber nicht die Lösung dieser Übung. Musterlösung: `git diff ex/09-page-objects ex/10-erweiterte-page-objects`.

Ein **Page Object** ist eine Klasse, die eine Seite beschreibt: Locators und Aktionen stehen an einer Stelle, der Test liest sich wie eine Beschreibung des Nutzerverhaltens. Ändert sich die UI, passt du eine Klasse an statt vieler Tests.

## Vorbereitung

- App läuft mit `RSS_OFFLINE_MODE=true` (steht in `.env.example`, Übung 1 legt `.env` an). Die Übung läuft gegen den Offline-Feed mit 20 Artikeln, der Test bleibt dadurch stabil.
- Alle Locators kennst du schon aus den Übungen 5 und 7. Übernimm sie von dort.

## Aufgaben

### Aufgabe 1 – `NewsPage`
Lege `e2e/pages/NewsPage.ts` an. Skelett:

```typescript
export class NewsPage {
  constructor(private page: Page) {}
  // TODO: Locators (Getter oder readonly): searchInput, newsFeed, newsItems, newsTitles
  // TODO: goto() · waitForNewsItems() · searchNews(term) · clearSearch()
  // TODO: getNewsCount() · getFirstNewsTitle()
}
```

`goto()` öffnet `/news/public` und ruft `waitForNewsItems()` auf. `waitForNewsItems()` prüft per Web-First-Assertion, dass der erste Artikel sichtbar ist.

**Fertig, wenn:** die Klasse ohne TypeScript-Fehler kompiliert und `newsPage.goto()` danach mindestens einen Artikel zeigt.

<details><summary>Tipp</summary>

`getByRole('textbox', { name: 'Search news articles' })`, `getByRole('feed', { name: 'News articles' })`, darin `getByRole('article')` und `getByRole('heading', { level: 2 })`. Für `expect` importierst du es aus `@playwright/test`. Kein `waitForLoadState('networkidle')`, die Suche filtert clientseitig.
</details>

### Aufgabe 2 – `HomePage`
Lege `e2e/pages/HomePage.ts` an. Sie braucht Locators für die Hauptnavigation (`navigation`, Name „Main navigation“), den Link „View Public News“, den Link „Sign in to your account“ und das Logo („Go to homepage“). Methoden: `goto()` (öffnet `/`), `navigateToNews()`, `navigateToSignIn()`, `navigateTo(label)` und `navigateToHome()`.

`navigateToNews()` und `navigateToSignIn()` klicken den Link, warten auf die neue URL und geben das nächste Page Object (`NewsPage` bzw. `LoginPage`) zurück.

**Fertig, wenn:** `(await new HomePage(page).goto()).navigateToNews()` ein `NewsPage`-Objekt liefert und die URL `/news/public` ist.

<details><summary>Tipp</summary>

Die Links der Hauptnavigation haben den Namen `Navigate to <Label>`, z. B. `Navigate to Clock`. Rückgabetyp: `Promise<NewsPage>`. `await this.page.waitForURL('/news/public')` wartet auf den Seitenwechsel.
</details>

### Aufgabe 3 – `LoginPage`
Lege `e2e/pages/LoginPage.ts` an. Locators: E-Mail-Feld („Email address for sign in“), Passwort-Feld („Password for sign in“), Button „Submit sign in form“ und die Fehlermeldung (Text „Invalid email or password“). Methoden: `goto()` (öffnet `/auth/signin`), `login(email, password)` und `submitEmptyForm()`.

**Fertig, wenn:** `login('wrong@example.com', 'wrongpassword')` die Fehlermeldung sichtbar macht und die URL auf `/auth/signin` bleibt.

<details><summary>Tipp</summary>

`login()` füllt beide Felder und klickt den Button. Es prüft das Ergebnis nicht, das macht der Test mit `expect`. Weil `goto()` `this` zurückgeben kann (`Promise<this>`), geht `await new LoginPage(page).goto()`.
</details>

### Aufgabe 4 – Tests schreiben
Lege `e2e/09-page-objects.spec.ts` an. Der Test benutzt keine direkten Selektoren, nur Page Objects. Drei Tests:

1. **News-Suche:** über `HomePage` zu News navigieren, Anzahl merken, Titel des ersten Artikels suchen, danach zeigt der erste Titel genau diesen Text. Suche leeren: Anzahl wie vorher (20).
2. **Login mit falschen Daten:** Fehlermeldung sichtbar, URL enthält `auth/signin`.
3. **Navigation:** `navigateTo('Clock')` führt zu `/clock`, `navigateToHome()` zurück zu `/`.

**Fertig, wenn:** `npx playwright test e2e/09-page-objects.spec.ts` drei grüne Tests meldet (das Auth-Setup aus Übung 7 läuft vorher mit und wird zusätzlich gezählt) und in der Spec-Datei kein `page.getByRole(...)` mehr vorkommt.

<details><summary>Tipp</summary>

Locators nutzt du direkt in Assertions: `expect(newsPage.newsItems).toHaveCount(20)` wartet automatisch. `getNewsCount()` brauchst du nur, um einen Wert zu merken. Suchbegriff aus den Daten holen (`getFirstNewsTitle()`) statt hartzucodieren.
</details>

## Bonus (optional)

### Bonus A – Kompletter Nutzerfluss
Ein vierter Test: Startseite, zu News, Suche ohne Treffer (`zzz-kein-treffer`) zeigt 0 Artikel und den Text „0 articles found“, dann über die Navigation zur Login-Seite und falscher Login. Ergänze dafür in `NewsPage` einen Locator `resultsCount` (Text `/\d+ articles found/`).

**Fertig, wenn:** der Test grün ist.

### Bonus B – `NewsPage` als Fixture
Stelle `newsPage` wie in Übung 8 per `test.extend` bereit: Der Test bekommt das Page Object fertig geöffnet (`goto()` und `waitForNewsItems()` in der Fixture). Schreibe darauf einen Suchtest.

**Fertig, wenn:** der Test `newsPage` als Parameter bekommt und grün ist.

## Wenn du nicht weiterkommst

Musterlösung ansehen: `git diff ex/09-page-objects ex/10-erweiterte-page-objects` oder `git switch ex/10-erweiterte-page-objects`.
Alles fertig, wenn `npx playwright test e2e/09-page-objects.spec.ts` grün ist.
