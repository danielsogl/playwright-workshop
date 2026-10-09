# Übung 10 – Erweiterte Page Objects (optional)

**Ziel:** Du zerlegst wiederkehrende Elemente (einzelne Artikel) in ein Komponenten-Objekt und lässt Aktionen `this` zurückgeben.
**Zeit:** 35 Min. (optional für Fortgeschrittene) · **Startbranch:** `git switch ex/10-erweiterte-page-objects` · **Datei:** `e2e/10-erweiterte-page-objects.spec.ts`

> Roter Faden: Baut auf Übung 9 (harte Voraussetzung: `NewsPage`, `e2e/09-page-objects.spec.ts`) · Du gibst weiter: das Komponenten-Muster `NewsItemComponent` · Zurückgefallen? `git switch ex/10-erweiterte-page-objects`. Der Startbranch enthält die Lösungen der Übungen 1–9, aber nicht die dieser Übung. Musterlösung: `git diff ex/10-erweiterte-page-objects ex/11-api-mocking`.

Ein **Komponenten-Objekt** ist ein Page Object für einen Teil der Seite, der mehrfach vorkommt (hier: ein Artikel). Es bekommt als Wurzel einen Locator, alle Locators darin sind relativ zu ihm.

Die Übung läuft gegen den Offline-Feed (`RSS_OFFLINE_MODE=true`, 20 Artikel).

## Aufgaben

### Aufgabe 1 – `NewsItemComponent`
Lege `e2e/pages/components/NewsItemComponent.ts` an (Ordner `components` unter `pages`). Konstruktor-Skelett:

```typescript
constructor(readonly root: Locator) {
  this.title = root.getByRole('heading', { level: 2 });
  // TODO: link, category
}
```

Definiere `title`, `link` und `category` als `readonly` Locators. Ergänze `getTitle()` und `getCategory()`, die den getrimmten Text liefern.

**Fertig, wenn:** die Klasse kompiliert und `getTitle()` für den ersten Artikel nicht leer ist (prüfst du in Aufgabe 3).

<details><summary>Tipp</summary>

Der Link steckt in der Überschrift: `this.title.getByRole('link')`. Die Kategorie ist ein Chip mit Text wie „Technology“, `root.getByText(/^(Technology|Business|World News)$/)`.
</details>

### Aufgabe 2 – `NewsPageAdvanced`
Kopiere `e2e/pages/NewsPage.ts` nach `e2e/pages/NewsPageAdvanced.ts` und benenne die Klasse um. `NewsPage` bleibt unverändert, du erbst nicht, sondern arbeitest in der Kopie weiter. Ergänze:

- `getNewsItem(index)` und `getFirstNewsItem()` geben ein `NewsItemComponent` zurück (Wurzel: `newsItems.nth(index)`).
- `filterByCategory(category)` (Locator: `combobox` „Filter news by category“).
- `goto()`, `searchNews()`, `clearSearch()` und `filterByCategory()` geben `Promise<this>` zurück.

**Fertig, wenn:** `getNewsItem(0).title` ein Locator ist, den du mit `toHaveText` prüfen kannst.

<details><summary>Tipp</summary>

Eine async-Methode mit Rückgabewert `this` hat den Typ `Promise<this>`. Eine Kette wie `goto().searchNews()` geht deshalb nicht, jeder Schritt braucht ein `await`.
</details>

### Aufgabe 3 – Tests schreiben
Lege `e2e/10-erweiterte-page-objects.spec.ts` an. Schreibe:

1. Den Suchtest aus Übung 9 (Suche, Anzahl, leeren), aber mit `NewsPageAdvanced` statt `NewsPage`. Er läuft ohne weitere Änderung.
2. Suche nach dem Titel des zweiten Artikels (`getNewsItem(1).getTitle()`): genau ein Treffer, `getNewsItem(0).title` hat diesen Text.
3. Kategorie-Filter: Kategorie des ersten Artikels auswählen, danach hat jeder angezeigte Artikel diese Kategorie.

**Fertig, wenn:** `npx playwright test e2e/10-erweiterte-page-objects.spec.ts` grün ist. Der Suchtest aus Übung 9 läuft unverändert mit `NewsPageAdvanced` (nach dem Leeren der Suche wieder 20 Artikel).

<details><summary>Tipp</summary>

Prüfe über Locators: `await expect(item.title).toHaveText(title)`. Für Test 3 holst du alle Artikel mit `newsItems.all()` und prüfst jeden `category`-Locator.
</details>

## Bonus (optional)

### Bonus A – Weitere Komponenten-Felder
Ergänze `description` und `getData()` (alle Werte als Objekt) im Komponenten-Objekt und prüfe in einem Test, dass die ersten drei Artikel einen Link mit `target="_blank"` haben.

**Fertig, wenn:** der Test grün ist.

## Wenn du nicht weiterkommst

Musterlösung ansehen: `git diff ex/10-erweiterte-page-objects ex/11-api-mocking` oder `git switch ex/11-api-mocking`.
Alles fertig, wenn `npx playwright test e2e/10-erweiterte-page-objects.spec.ts` grün ist.
