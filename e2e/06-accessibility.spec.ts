import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Exercise 6: Accessibility Testing', () => {
  test.describe('Aufgaben', () => {
    test('Homepage accessibility scan', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });

    test('News feed accessibility with detailed reporting', async ({
      page,
    }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      // Lesbarer Report vor der Assertion (bei 0 Violations passiert nichts)
      results.violations.forEach((violation) => {
        console.log(
          `\n${violation.impact}: ${violation.description} (${violation.helpUrl})`,
        );
        violation.nodes.forEach((node) => {
          console.log(`   - ${node.target.join(' ')}`);
        });
      });

      expect(results.violations).toEqual([]);
    });

    test('WCAG 2.1 and 2.2 Level AA compliance', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('Navigation accessibility', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page }).include('nav').analyze();

      expect(results.violations).toEqual([]);
    });

    test('Form accessibility - Login page', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page }).include('form').analyze();

      expect(results.violations).toEqual([]);
    });

    test('Navigation structure', async ({ page }) => {
      await page.goto('/');

      // Teil-Template: nur prüfen, was zählt (Rolle, Name, Ziel des Links)
      await expect(
        page.getByRole('navigation', { name: 'Main navigation', exact: true }),
      ).toMatchAriaSnapshot(`
        - navigation "Main navigation":
          - list:
            - listitem:
              - link "Navigate to Public News":
                - /url: /news/public
      `);
    });

    test('Login form structure, role and accessible name', async ({ page }) => {
      await page.goto('/auth/signin');

      await expect(page.getByRole('form', { name: 'Sign in form' }))
        .toMatchAriaSnapshot(`
        - form "Sign in form":
          - textbox "Email address for sign in Email*"
          - textbox "Password for sign in Password*"
          - button "Submit sign in form"
      `);

      const submit = page.getByRole('button', { name: /sign in/i });
      await expect(submit).toHaveRole('button');
      await expect(submit).toHaveAccessibleName('Submit sign in form');
    });
  });

  test.describe('Bonus A: Light und Dark Mode', () => {
    // Die App folgt dem System-Theme; colorScheme emuliert prefers-color-scheme.
    for (const colorScheme of ['light', 'dark'] as const) {
      test.describe(`${colorScheme} mode`, () => {
        test.use({ colorScheme });

        test('color contrast', async ({ page }) => {
          await page.goto('/');
          await expect(page.locator('html')).toHaveClass(
            new RegExp(colorScheme),
          );
          // Laufende CSS-Übergänge würden axe Zwischenfarben messen lassen
          await expect
            .poll(() => page.evaluate(() => document.getAnimations().length))
            .toBe(0);

          // color-contrast ist die Kontrast-Regel aus wcag2aa
          const results = await new AxeBuilder({ page })
            .withRules(['color-contrast'])
            .analyze();

          expect(results.violations).toEqual([]);
        });
      });
    }

    test('Theme switch toggles html class', async ({ page }) => {
      await page.goto('/');

      // Playwright emuliert standardmäßig Light Mode. Das Label wechselt erst
      // nach der Hydration auf "dark" – vorher wirkt der Klick nicht.
      const themeSwitch = page.getByRole('switch', {
        name: /Switch to (dark|light) mode/,
      });
      await expect(themeSwitch).toHaveAccessibleName('Switch to dark mode');
      await expect(page.locator('html')).toHaveClass(/light/);

      await themeSwitch.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      await expect(themeSwitch).toHaveAccessibleName('Switch to light mode');

      await themeSwitch.click();
      await expect(page.locator('html')).toHaveClass(/light/);
    });
  });

  test.describe('Bonus B: Mobile und Tastatur', () => {
    test('Mobile touch target sizes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withRules(['target-size'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('Skip links functionality', async ({ page, browserName }) => {
      // Der Skip-Link ist sr-only bis er per Tab fokussiert wird – WebKit
      // fokussiert Links per Tab nur mit macOS Full Keyboard Access.
      test.skip(
        browserName === 'webkit',
        'WebKit Tab-Fokus benötigt macOS Full Keyboard Access',
      );
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      await page.keyboard.press('Tab');
      await expect(
        page.getByRole('link', { name: 'Skip to main content' }),
      ).toBeFocused();
    });
  });

  test.describe('Bonus C: Ausnahmen dokumentieren', () => {
    test('Accessibility with documented exclusion', async ({ page }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        // Die Artikel stammen aus fremden RSS-Feeds, deren Inhalt wir nicht
        // steuern. Ihr Markup prüft der News-Feed-Scan oben separat.
        .exclude('[role="feed"]')
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
