# Übung 17 – Capstone: Der komplette User-Flow (BONUS)

**Ziel:**
Du führst alles zusammen, was du über die drei Tage gebaut hast, zu **einem** realistischen End-to-End-Flow durch die Feeds-App: Login → Public-News → Private-Feeds → Settings → Logout.

> **🧵 Roter Faden**
> **Baut auf:** allem – **kein neuer Stoff**. Du kombinierst die Trägerartefakte: die **`authenticatedPage`-Fixture** (Übung 8, nutzt den API-Login aus Übung 7), die **`NewsPage`-POM** (Übung 9/10) und deine Assertions (Übung 4–6).
> **Zurückgefallen?** Die komplette Musterlösung liegt in `solutions/e2e/17-capstone.spec.ts`.

**Hinweis:** Diese Übung ist als **optionaler Abschluss** gedacht (~30–40 Min). Wenn die Zeit knapp ist, kann sie übersprungen oder gemeinsam als Live-Demo durchgegangen werden.

**Aufgaben:**

1. **Test-Setup mit Auth-Fixture:**
   - Importiere `test`/`expect` aus deiner Auth-Fixture (Übung 8) und die `NewsPage`-POM (Übung 9).

   ```typescript
   import { test, expect } from './fixtures/auth.fixture';
   import { NewsPage } from '../pages/NewsPage';

   test('kompletter User-Flow', async ({ authenticatedPage: page }) => {
     // page ist bereits eingeloggt (API-Login aus Übung 7)
   });
   ```

2. **Public-News: Suche + Kategorie-Filter (NewsPage-POM):**
   - Navigiere mit `newsPage.goto()` zu `/news/public`.
   - Prüfe den Ergebniszähler `"{n} articles found"` **und** die Anzahl der Artikel im `role="feed"`.
   - Führe eine Suche ohne Treffer aus (`0` Artikel), setze zurück, filtere dann nach Kategorie **Business** (→ 5 Artikel).

3. **Private-Feeds (`/news/private`): anlegen → auswählen → löschen:**
   - Lege über das `AddFeedForm` einen Feed mit **eindeutigem Namen** an (`Name`, gültige `URL`).
   - Nutze `pressSequentially()` statt `fill()` – die react-aria-Felder setzen ihren State in WebKit sonst nicht zuverlässig (wie in Übung 8).
   - Prüfe, dass der Feed erscheint (Count-Chip / `Select feed:`-Button), wähle ihn aus und lösche ihn wieder. Prüfe, dass die Anzahl wieder sinkt.

4. **Settings (`/settings`): Name ändern (cross-component Session-Update):**
   - Ändere im Profil-Formular den Namen und sende ab.
   - Prüfe das **Success-Banner** („Profile updated successfully!").
   - Prüfe, dass sich die **Initialen in der Navbar** aktualisiert haben – das beweist das `update()` der Session über Komponentengrenzen hinweg.

5. **Logout über das Navbar-Dropdown:**
   - Öffne das User-Menü (`User profile actions menu`), klicke **Log Out**.
   - Prüfe, dass der Login-Zustand weg ist (der „Sign in"-Link ist wieder sichtbar).

**Ausführen:**

```bash
npm run e2e:solutions -- 17-capstone.spec.ts --project=chromium
```

**Was du zusammenführst:**

- Auth/Fixtures (Übung 7/8) · Page Objects (Übung 9/10) · Assertions (Übung 4–6)
- Ein durchgehender, realistischer Flow statt isolierter Einzeltests

**Zeit:** 30–40 Minuten (optional)

---

> **Tipp:** Genau so sieht ein wartbarer Smoke-Test in echten Projekten aus: wenige, aussagekräftige Schritte, die die kritische User-Journey abdecken – aufgebaut aus wiederverwendbaren POMs und Fixtures.
