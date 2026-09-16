# Übung 18 – KI-gestütztes Testen: Agents, Skills & MCP (BONUS)

**Ziel:**
Du richtest das offizielle KI-Setup von Playwright im Workshop-Repo ein und lässt dir einen Test **planen**, **generieren** und **heilen** – und lernst dabei, wo die KI hilft und wo dein Testing-Know-how gebraucht wird.

> **🧵 Roter Faden**
> **Baut auf:** der App, die du drei Tage lang von Hand getestet hast. Genau deshalb erkennst du jetzt, ob ein generierter Test gut ist.
> **Du gibst weiter:** ein Repo, in dem jeder Coding Agent Playwright bedienen kann – Agents, Skills und MCP sind eingerichtet und committet.
> **Zurückgefallen?** Alles in dieser Übung funktioniert unabhängig von den Übungen 1–17. Du brauchst nur die laufende App.

**Voraussetzungen:**

- Playwright ≥ 1.56 (im Repo: 1.63) – `npx playwright --version`
- Ein KI-Client: Claude Code, VS Code + Copilot (ab 1.105), Codex oder OpenCode
- Die App muss erreichbar sein: `npm run dev` (bzw. Playwright startet sie über `webServer`)

**Aufgaben:**

1. **Setup prüfen – was ist schon da?**

   Das Repo ist bereits initialisiert. Schau dir an, was dabei entstanden ist:

   ```bash
   ls .claude/agents/      # playwright-test-planner / -generator / -healer
   ls .claude/skills/      # Symlinks auf .agents/skills/ (Skills für jeden Agent)
   cat .mcp.json           # playwright-test (Agents) + playwright (interaktiv)
   cat e2e/seed.spec.ts    # der Startpunkt für alle generierten Tests
   ```

   - [ ] Öffne `.claude/agents/playwright-test-planner.md`. Welche Tools darf der Planner benutzen – und welche bewusst **nicht**? (Tipp: Er darf nicht schreiben, außer über `planner_save_plan`.)
   - [ ] So würdest du das in **deinem** Projekt erzeugen:

     ```bash
     npx playwright init-agents --loop=claude     # claude | codex | copilot | opencode | vscode
     npx playwright init-skills --loop=claude     # claude | agents
     ```

   - [ ] `init-agents` **überschreibt** eine bestehende `.mcp.json`. Prüfe nach dem Ausführen immer den Diff, bevor du committest.
   - [ ] Nach jedem Playwright-Update erneut ausführen: Die Agent-Definitionen sind an die Playwright-Version gebunden.

2. **Der Seed-Test – das wichtigste Stück Setup:**

   `e2e/seed.spec.ts` legt fest, wie ein generierter Test *startet*. Der Planner führt ihn aus, bevor er die App erkundet.

   ```typescript
   test('seed', async ({ page }) => {
     await page.goto('/');
     await expect(page).toHaveTitle(/Playwright Demo/);
   });
   ```

   - [ ] Playwright findet den Seed über den **Dateinamen** (`*seed*`) innerhalb des `testMatch` deiner Config. Deshalb liegt er in `e2e/`, nicht im Repo-Root.
   - [ ] **Für authentifizierte Flows:** Tausche den Import gegen deine Auth-Fixture aus Übung 8 und den Parameter gegen `authenticatedPage`. Jeder generierte Test startet dann eingeloggt.
   - [ ] Warum ist ein schlechter Seed teuer? (Tipp: Jeder generierte Test erbt ihn.)

3. **Planner: Testplan statt Test:**

   Prompt in deinem KI-Client:

   > Nutze den **playwright-test-planner**, um Tests für die News-Suche auf `/news/public` zu planen.

   - [ ] Der Plan landet als Markdown in `specs/`. Öffne ihn.
   - [ ] **Review wie einen PR:** Sind die Szenarien unabhängig? Fehlt der Negativfall (Suche ohne Treffer)? Testet er Implementierung statt Verhalten?
   - [ ] Korrigiere den Plan direkt im Markdown. Das ist der Schritt, den nur du machen kannst.

4. **Generator: vom Plan zum Test:**

   > Nutze den **playwright-test-generator** für Szenario 1.1 aus `specs/<dein-plan>.md`.

   - [ ] Referenziere Szenarien per **Nummer**, nicht per Name – bei langen Plänen trifft der Agent sonst das falsche.
   - [ ] Der Generator verifiziert Locators **live gegen die App**, statt sie zu raten. Schau ihm dabei zu.
   - [ ] **Review den Test:** Nutzt er `getByRole`/`getByLabel` – oder ist er auf `getByTestId` bzw. CSS ausgewichen? Sind die Assertions aussagekräftig oder nur `toBeVisible()`?
   - [ ] Vergleiche mit deinem handgeschriebenen Test aus Übung 5. Was ist besser, was schlechter?

5. **Healer: kaputte Tests reparieren:**

   - [ ] Mach einen Locator in deinem generierten Test absichtlich kaputt (z.B. `getByRole('textbox', { name: 'Search news' })` → `'Suche'`).
   - [ ] Prompt: *Nutze den **playwright-test-healer**, um die fehlschlagenden Tests in `e2e/` zu reparieren.*
   - [ ] Der Healer führt den Test aus, findet den kaputten Locator und repariert ihn.
   - [ ] **Jetzt der wichtige Teil:** Baue einen Bug in die **App** statt in den Test (z.B. in `app/news/public/page.tsx` das `aria-label` des Suchfelds ändern). Was macht der Healer? Er sollte den Test **skippen**, nicht "reparieren". Ein Healer, der einen echten App-Bug wegpatcht, hat den Test wertlos gemacht.

6. **CLI + Skills: die token-sparsame Ebene:**

   Für Agents mit Terminal-Zugriff. Der State liegt auf der Disk statt im Kontext:

   ```bash
   npx playwright cli open http://localhost:3000/news/public
   npx playwright cli snapshot          # Accessibility-Baum als YAML auf Disk
   npx playwright cli find "Search news" # nur die passenden Knoten, nicht der ganze Baum
   npx playwright cli fill e12 "Tech" --submit
   npx playwright cli snapshot
   npx playwright cli close
   ```

   - [ ] Elemente werden per kurzer Ref (`e1`, `e12`, …) angesprochen – kein kompletter Accessibility-Tree im Kontext.
   - [ ] Die Skills dazu liegen in `.agents/skills/playwright-cli/` (plus `playwright-trace` und `playwright-component-testing`). Öffne `SKILL.md`: Das ist die Anleitung, die dein Agent liest.
   - [ ] **Faustregel:** Agent hat Bash-Zugriff → **CLI + Skills**. Kein Terminal → **MCP**.

7. **MCP interaktiv & Trace-Analyse:**

   - [ ] Der Server `playwright` aus `.mcp.json` (`npx playwright mcp`) gibt deinem Client Browser-Tools für eigene Prompts – ohne Agent-Definition.
   - [ ] Nimm einen Trace aus einer früheren Übung (z.B. `trace-news-search.zip` oder aus `test-results/`) und lass ihn analysieren:

     ```bash
     npx playwright trace open test-results/<ordner>/trace.zip
     npx playwright trace errors
     npx playwright trace actions
     ```

   - [ ] Das nutzt der Agent über den `playwright-trace`-Skill, um rote Tests zu diagnostizieren, ohne den Trace Viewer zu öffnen.

**Bonus:** Lass den Planner den kompletten Capstone-Flow aus Übung 17 planen (Login → Public News → Private Feeds → Settings → Logout) und vergleiche den Plan mit der Musterlösung in `solutions/e2e/17-capstone.spec.ts`. Was hat die KI übersehen?

**Was du lernst:**

- Das offizielle Setup: `init-agents`, `init-skills`, Seed-Test, `.mcp.json`
- Der Loop **Explore → Plan → Generate → Heal → Expand** und wo du eingreifst
- Warum der Plan-Review der wichtigste Schritt ist – ein falscher Plan erzeugt zuverlässig falsche Tests
- Wann CLI + Skills (Tokens) und wann MCP (kein Terminal) die richtige Ebene ist
- Die Grenze: Die KI macht die mechanische Arbeit, **was** getestet wird, entscheidest du

**Zeit:** 45–60 Minuten (optional)

---

> **Achtung:** Generierte Tests sind ganz normale `*.spec.ts` und laufen in jeder CI. Die **Agents** selbst gehören nicht in die Pipeline – sie sind interaktive Dev-Tools. Und den Healer nie automatisch auf `main` pushen lassen: Fixes gehen als PR zu einem Menschen.
