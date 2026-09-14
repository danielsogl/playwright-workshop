# Übung 6 – Accessibility Testing mit Axe

**Ziel:**
Du lernst automatisierte Accessibility-Tests mit Axe-Core in Playwright zu implementieren. Der Fokus liegt auf dem Finden und Beheben von Barrierefreiheits-Problemen in der Feed App.

> **🧵 Roter Faden**
> **Baut auf:** Übung 4 – dieselben Seiten (`/`, `/news/public`), neue Prüf-Dimension.
> **Du gibst weiter:** a11y-Scans als zusätzliche Qualitätsstufe deiner Suite.
> **Zurückgefallen?** Die Seiten sind ohne Vorarbeit erreichbar.

**Warum Accessibility Testing?**

- Gesetzliche Anforderungen (WCAG 2.1, EU-Richtlinie 2016/2102)
- Bessere Nutzererfahrung für ALLE Nutzer
- SEO-Vorteile durch semantisches HTML
- Früherkennung von Accessibility-Problemen
- Dokumentation der Barrierefreiheit

**Vorbereitung:** `@axe-core/playwright` ist im Workshop-Repo bereits installiert. In eigenen Projekten: `npm install --save-dev @axe-core/playwright`.

**Aufgaben:**

1. **Basis Accessibility Test:**

   ```typescript
   // e2e/accessibility.spec.ts
   import { test, expect } from '@playwright/test';
   import AxeBuilder from '@axe-core/playwright';

   test.describe('Accessibility Tests', () => {
     test('Homepage Accessibility', async ({ page }) => {
       await page.goto('/');

       // Führe Axe-Analyse aus
       const accessibilityScanResults = await new AxeBuilder({
         page,
       }).analyze();

       // Test schlägt fehl bei Violations
       expect(accessibilityScanResults.violations).toEqual([]);
     });
   });
   ```

2. **Detaillierte Violation-Reports:**

   ```typescript
   test('News Feed Accessibility mit Details', async ({ page }) => {
     await page.goto('/news/public');
     await expect(page.getByRole('article').first()).toBeVisible();

     const results = await new AxeBuilder({ page }).analyze();

     // Bessere Fehlerausgabe
     if (results.violations.length > 0) {
       console.log('Accessibility Violations:');
       results.violations.forEach((violation) => {
         console.log(`\n${violation.impact}: ${violation.description}`);
         console.log(`  Help: ${violation.helpUrl}`);
         violation.nodes.forEach((node) => {
           console.log(`  - ${node.target}`);
         });
       });
     }

     expect(results.violations).toHaveLength(0);
   });
   ```

3. **Spezifische WCAG-Level testen:**

   ```typescript
   test('WCAG 2.1 Level AA Compliance', async ({ page }) => {
     await page.goto('/');

     // Nur WCAG 2.1 Level AA Regeln prüfen
     const results = await new AxeBuilder({ page })
       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
       .analyze();

     expect(results.violations).toEqual([]);
   });
   ```

4. **Komponenten-spezifische Tests:**

   ```typescript
   test('Navigation Accessibility', async ({ page }) => {
     await page.goto('/');

     // Teste nur die Navigation
     const results = await new AxeBuilder({ page }).include('nav').analyze();

     expect(results.violations).toEqual([]);
   });

   test('Form Accessibility - Login', async ({ page }) => {
     await page.goto('/auth/signin');

     // Teste nur das Login-Formular
     const results = await new AxeBuilder({ page }).include('form').analyze();

     // Prüfe spezifische Regeln für Formulare
     const formViolations = results.violations.filter(
       (v) =>
         v.tags.includes('forms') ||
         v.id.includes('label') ||
         v.id.includes('form-field'),
     );

     expect(formViolations).toEqual([]);
   });
   ```

5. **Dark Mode Accessibility:**

   ```typescript
   test.describe('Dark Mode', () => {
     // Dark Mode per Emulation statt Theme-Toggle
     // (analog: test.use({ forcedColors: 'active' }) oder { contrast: 'more' })
     // Achtung: colorScheme setzt nur prefers-color-scheme. Die Feed App startet
     // per next-themes immer dunkel (defaultTheme: 'dark'). Light Mode vor dem Laden setzen:
     // await page.addInitScript(() => localStorage.setItem('theme', 'light'));
     // (Nach einem Klick auf den Theme-Switch laufen noch Farbübergänge – axe misst dann Zwischenwerte.)
     test.use({ colorScheme: 'dark' });

     test('Dark Mode Contrast Ratios', async ({ page }) => {
       await page.goto('/');

       // Prüfe Kontrastverhältnisse im Dark Mode
       const results = await new AxeBuilder({ page })
         .withTags(['wcag2aa']) // Fokus auf Kontrast
         .analyze();

       const contrastViolations = results.violations.filter((v) =>
         v.id.includes('color-contrast'),
       );

       expect(contrastViolations).toHaveLength(0);
     });
   });
   ```

6. **Mobile Accessibility:**

   ```typescript
   test('Mobile Touch Target Sizes', async ({ page }) => {
     // Mobile Viewport
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto('/');

     const results = await new AxeBuilder({ page }).analyze();

     // Prüfe ob Touch-Targets groß genug sind
     const touchTargetViolations = results.violations.filter(
       (v) => v.id === 'target-size',
     );

     expect(touchTargetViolations).toEqual([]);
   });
   ```

7. **Keyboard Navigation Test:**

   ```typescript
   test('Keyboard Navigation', async ({ page }) => {
     await page.goto('/');

     // Tab durch die Seite
     await page.keyboard.press('Tab');

     // Prüfe, dass ein Element den Fokus hat
     await expect(page.locator(':focus')).toHaveCount(1);

     // Accessibility Check mit Fokus
     const results = await new AxeBuilder({ page })
       .withTags(['keyboard'])
       .analyze();

     expect(results.violations).toEqual([]);
   });
   ```

**Ausschlüsse definieren (falls nötig):**

```typescript
test('Mit bekannten Ausschlüssen', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .exclude('.third-party-widget') // Externe Widgets ausschließen
    .disableRules(['color-contrast']) // Temporär Regel deaktivieren
    .analyze();

  expect(results.violations).toEqual([]);
});
```

**Best Practices:**

- ✅ Teste verschiedene Seitenzustände (logged in/out, light/dark mode)
- ✅ Integriere A11y-Tests in CI/CD Pipeline
- ✅ Dokumentiere bewusste Ausnahmen
- ✅ Teste mit Screen Reader (manuell) zusätzlich
- ✅ Prüfe Keyboard-Navigation
- ❌ Ignoriere keine Violations ohne Grund

**Zeit:** 30 Minuten

---

> **Tipp:** Nutze Browser-Extensions wie "axe DevTools" oder "WAVE" während der Entwicklung für sofortiges Feedback. Die automatisierten Tests fangen dann Regressionen!
