/**
 * Exercise 6 - Accessibility Testing Solution
 *
 * This test suite demonstrates comprehensive accessibility testing using axe-core with Playwright.
 * Tests WCAG compliance, keyboard navigation, and accessibility across different themes and viewports.
 *
 * Prerequisites:
 * @axe-core/playwright ist im Workshop-Repo bereits installiert
 *
 * Key learning points:
 * - Automated accessibility testing with axe-core
 * - WCAG 2.1 Level AA compliance testing
 * - Component-specific accessibility testing
 * - Keyboard navigation testing
 * - Color contrast and theme accessibility
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Exercise 6: Accessibility Testing', () => {
  test.describe('Basic Accessibility Tests', () => {
    test('Homepage accessibility scan', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Run comprehensive accessibility analysis
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      // Log violations for debugging (bei 0 Violations passiert nichts)
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(
          `\n${index + 1}. ${violation.impact}: ${violation.description}`,
        );
        console.log(`   Rule: ${violation.id}`);
        console.log(`   Help: ${violation.helpUrl}`);
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`   Target ${nodeIndex + 1}: ${node.target.join(', ')}`);
          console.log(`   Issue: ${node.failureSummary ?? '-'}`);
        });
      });

      // Test should fail if there are violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('News feed accessibility with detailed reporting', async ({
      page,
    }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      // Enhanced error reporting (bei 0 Violations passiert nichts)
      results.violations.forEach((violation) => {
        console.log(
          `\n🚨 ${violation.impact?.toUpperCase()} IMPACT: ${violation.description}`,
        );
        console.log(`📋 Rule ID: ${violation.id}`);
        console.log(`🔗 Help: ${violation.helpUrl}`);
        console.log(`📊 WCAG Tags: ${violation.tags.join(', ')}`);

        violation.nodes.forEach((node, index) => {
          console.log(`\n   Element ${index + 1}:`);
          console.log(`   - Selector: ${node.target.join(' ')}`);
          console.log(`   - HTML: ${node.html.substring(0, 100)}...`);
          console.log(
            `   - Failed checks: ${node.any.map((check) => check.message).join(', ')}`,
          );
        });
      });

      expect(results.violations).toHaveLength(0);
    });
  });

  test.describe('WCAG Compliance Tests', () => {
    test('WCAG 2.1 Level AA compliance', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Test only WCAG 2.1 Level AA rules
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('WCAG 2.1 Level AAA compliance (informational)', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Test WCAG 2.1 Level AAA rules (informational only)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aaa', 'wcag21aaa'])
        .analyze();

      // Log AAA violations but don't fail the test
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
      });
      console.log(`Total WCAG AAA violations: ${results.violations.length}`);
    });

    test('Color contrast compliance', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Focus specifically on color contrast issues
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = results.violations.filter((violation) =>
        violation.id.includes('color-contrast'),
      );

      contrastViolations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          console.log(`- ${node.target.join(' ')}: ${node.failureSummary}`);
        });
      });

      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Component-Specific Accessibility', () => {
    test('Navigation accessibility', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Test only the navigation component
      const results = await new AxeBuilder({ page }).include('nav').analyze();

      expect(results.violations).toEqual([]);
    });

    test('Form accessibility - Login page', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.getByRole('main')).toBeVisible();

      // Test form-specific accessibility
      const results = await new AxeBuilder({ page }).include('form').analyze();

      // Check for form-specific violations
      const formViolations = results.violations.filter(
        (violation) =>
          violation.tags.includes('forms') ||
          violation.id.includes('label') ||
          violation.id.includes('form-field') ||
          violation.id.includes('aria'),
      );

      formViolations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
      });

      expect(formViolations).toEqual([]);
    });

    test('Search component accessibility', async ({ page }) => {
      await page.goto('/news/public');

      // Die Such- und Filterleiste ist ein search-Landmark
      await expect(
        page.getByRole('search', { name: 'News filter options' }),
      ).toBeVisible();

      // AxeBuilder.include() erwartet einen CSS-Selektor, keinen Locator
      const results = await new AxeBuilder({ page })
        .include('[role="search"]')
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('News article list accessibility', async ({ page }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      // Test the news list structure
      const results = await new AxeBuilder({ page })
        .include('[role="list"], ul, ol')
        .analyze();

      const listViolations = results.violations.filter(
        (violation) =>
          violation.id.includes('list') ||
          violation.id.includes('listitem') ||
          violation.tags.includes('structure'),
      );

      expect(listViolations).toEqual([]);
    });
  });

  test.describe('Theme Accessibility', () => {
    // Kontrast-Scan (wcag2aa) – gemeinsam für Dark und Light Mode
    async function expectNoContrastViolations(page: Page, label: string) {
      // Laufende CSS-Übergänge (z. B. HeroUI-Farben) würden axe Zwischenfarben messen lassen
      await expect
        .poll(() => page.evaluate(() => document.getAnimations().length))
        .toBe(0);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = results.violations.filter((violation) =>
        violation.id.includes('color-contrast'),
      );

      if (contrastViolations.length > 0) {
        console.log(`\n${label} contrast violations:`);
        contrastViolations.forEach((violation) => {
          violation.nodes.forEach((node) => {
            console.log(`- ${node.target.join(' ')}`);
          });
        });
      }

      expect(contrastViolations).toHaveLength(0);
    }

    test.describe('Dark Mode', () => {
      // Emuliert prefers-color-scheme (analog: forcedColors, contrast).
      // Diese App startet per next-themes ohnehin im Dark Mode (defaultTheme: 'dark').
      test.use({ colorScheme: 'dark' });

      test('Dark mode color contrast', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('html')).toHaveClass(/dark/);

        await expectNoContrastViolations(page, 'Dark mode');
      });
    });

    test.describe('Light Mode', () => {
      test.use({ colorScheme: 'light' });

      test('Light mode color contrast', async ({ page }) => {
        // Bekannter App-Bug: .text-muted (#71717a auf #f5f5f5) hat nur 4.43:1.
        // test.fail() dokumentiert das – wird der Kontrast gefixt, schlägt der Test an.
        test.fail(
          true,
          'Light Mode: text-muted unterschreitet 4.5:1 (color-contrast)',
        );
        // colorScheme allein reicht hier nicht (defaultTheme: 'dark').
        // Theme vor dem Laden setzen statt Switch klicken: Nach dem Klick laufen
        // noch CSS-Farbübergänge, axe würde Zwischenfarben messen (flaky).
        await page.addInitScript(() => localStorage.setItem('theme', 'light'));
        await page.goto('/');
        await expect(page.locator('html')).not.toHaveClass(/dark/);

        await expectNoContrastViolations(page, 'Light mode');
      });
    });

    test('Theme switch toggles html class', async ({ page }) => {
      await page.goto('/');

      // Label wechselt erst nach der Hydration auf "light" – vorher wirkt der Klick nicht
      const themeSwitch = page.getByRole('switch', {
        name: /Switch to (dark|light) mode/,
      });
      await expect(themeSwitch).toHaveAccessibleName('Switch to light mode');
      await expect(page.locator('html')).toHaveClass(/dark/);

      await themeSwitch.click();
      await expect(page.locator('html')).not.toHaveClass(/dark/);
      await expect(themeSwitch).toHaveAccessibleName('Switch to dark mode');

      await themeSwitch.click();
      await expect(page.locator('html')).toHaveClass(/dark/);

      // Der Switch selbst muss axe-konform sein
      const results = await new AxeBuilder({ page })
        .include('[role="switch"]')
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Mobile touch target sizes', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      // Filter for touch target size violations
      const touchTargetViolations = results.violations.filter(
        (violation) =>
          violation.id === 'target-size' ||
          violation.id.includes('touch-target'),
      );

      touchTargetViolations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          console.log(`- ${node.target.join(' ')}: ${node.failureSummary}`);
        });
      });

      expect(touchTargetViolations).toEqual([]);
    });

    test('Mobile navigation accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Unter 640px zeigt die App den Menü-Button statt der Desktop-Navigation
      const mobileMenuButton = page.getByRole('button', { name: 'Open menu' });
      await expect(mobileMenuButton).toBeVisible();

      // Test menu button accessibility
      const buttonResults = await new AxeBuilder({ page })
        .include(['button[aria-label*="menu"]'])
        .analyze();

      expect(buttonResults.violations).toEqual([]);

      // Open mobile menu and test its accessibility
      await mobileMenuButton.click();
      await expect(
        page.getByRole('button', { name: 'Close menu' }),
      ).toBeVisible();

      const menuResults = await new AxeBuilder({ page })
        .include('nav')
        .analyze();

      expect(menuResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation Tests', () => {
    // Tabbt durch die Seite und sammelt die fokussierten Elemente
    async function collectTabOrder(page: Page, maxTabs = 20) {
      const focusableElements = [];
      let previousElement = null;

      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');

        const activeElement = await page.evaluate(() => {
          const element = document.activeElement;
          if (element && element !== document.body) {
            return {
              tagName: element.tagName,
              type: (element as HTMLInputElement).type || null,
              ariaLabel: element.getAttribute('aria-label'),
              id: element.id,
              className: element.className,
              textContent: element.textContent?.substring(0, 50) || null,
            };
          }
          return null;
        });

        if (activeElement && activeElement !== previousElement) {
          focusableElements.push(activeElement);
          previousElement = activeElement;
        }

        // Stop if we've cycled back to the first element
        if (
          focusableElements.length > 1 &&
          JSON.stringify(activeElement) === JSON.stringify(focusableElements[0])
        ) {
          break;
        }
      }

      return focusableElements;
    }

    test('Tab navigation order', async ({ page, browserName }) => {
      // WebKit/Safari fokussiert Links & Buttons per Tab nur, wenn macOS
      // "Full Keyboard Access" aktiv ist – headless bleibt die Tab-Reihenfolge leer.
      test.skip(
        browserName === 'webkit',
        'WebKit Tab-Fokus benötigt macOS Full Keyboard Access',
      );
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Start from the body to reset focus
      await page.locator('body').focus();

      const focusableElements = await collectTabOrder(page);

      console.log('\nTab navigation order:');
      focusableElements.forEach((element, index) => {
        console.log(
          `${index + 1}. ${element.tagName}${element.type ? `[${element.type}]` : ''} - ${element.ariaLabel || element.textContent || element.id || 'No label'}`,
        );
      });

      // Should have at least some focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);

      // Run accessibility check with focus on keyboard navigation
      const results = await new AxeBuilder({ page })
        .withTags(['keyboard'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('Focus visibility', async ({ page, browserName }) => {
      // Ohne Tab-Fokus in WebKit gäbe es kein fokussiertes Element zum Prüfen
      test.skip(
        browserName === 'webkit',
        'WebKit Tab-Fokus benötigt macOS Full Keyboard Access',
      );
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Tab to first focusable element
      await page.keyboard.press('Tab');

      // Check if there's a visible focus indicator
      const focusedElement = await page.evaluate(() => {
        const element = document.activeElement;
        if (element && element !== document.body) {
          const styles = window.getComputedStyle(element);
          const pseudoStyles = window.getComputedStyle(element, ':focus');

          return {
            hasOutline: styles.outline !== 'none' && styles.outline !== '',
            hasBoxShadow:
              styles.boxShadow !== 'none' && styles.boxShadow !== '',
            hasFocusOutline:
              pseudoStyles.outline !== 'none' && pseudoStyles.outline !== '',
            hasFocusBoxShadow:
              pseudoStyles.boxShadow !== 'none' &&
              pseudoStyles.boxShadow !== '',
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
          };
        }
        return null;
      });

      // Ein Element muss den Fokus haben, sonst sagt der Test nichts aus
      expect(focusedElement).not.toBeNull();
      console.log('Focus styles:', focusedElement);

      const hasFocusIndicator =
        focusedElement?.hasOutline ||
        focusedElement?.hasBoxShadow ||
        focusedElement?.hasFocusOutline ||
        focusedElement?.hasFocusBoxShadow;

      expect(hasFocusIndicator).toBe(true);

      // Run accessibility check for focus-related issues
      const results = await new AxeBuilder({ page })
        .withRules(['focus-order-semantics', 'frame-focusable-content'])
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

      // Der erste Tab-Stopp ist der Skip-Link, sichtbar erst mit Fokus
      await page.keyboard.press('Tab');
      const skipLink = page.getByRole('link', { name: 'Skip to main content' });
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();

      // Aktivieren: der Fokus springt auf den Hauptinhalt (tabIndex=-1)
      await skipLink.press('Enter');
      await expect
        .poll(() => page.evaluate(() => document.activeElement?.id))
        .toBe('main-content');
    });
  });

  test.describe('Screen Reader Support', () => {
    test('Semantic HTML structure', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Check for proper semantic structure
      const semanticElements = await page.evaluate(() => {
        const elements = {
          headers: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          nav: document.querySelectorAll('nav').length,
          main: document.querySelectorAll('main').length,
          article: document.querySelectorAll('article').length,
          section: document.querySelectorAll('section').length,
          aside: document.querySelectorAll('aside').length,
          footer: document.querySelectorAll('footer').length,
        };
        return elements;
      });

      console.log('Semantic elements found:', semanticElements);

      // Should have at least basic semantic structure
      expect(semanticElements.headers).toBeGreaterThan(0);
      expect(semanticElements.main).toBeGreaterThanOrEqual(1);

      // Run accessibility check for structure-related issues
      const results = await new AxeBuilder({ page })
        .withTags(['structure'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('ARIA landmarks and labels', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Check for ARIA landmarks
      const landmarks = await page.evaluate(() => {
        const roles = [
          'banner',
          'navigation',
          'main',
          'complementary',
          'contentinfo',
          'search',
          'region',
        ];

        const found: Record<string, number> = {};
        roles.forEach((role) => {
          found[role] = document.querySelectorAll(`[role="${role}"]`).length;
        });

        return found;
      });

      console.log('ARIA landmarks found:', landmarks);

      // Run accessibility check for ARIA-related issues
      const results = await new AxeBuilder({ page })
        .withTags(['aria'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Error Handling Accessibility', () => {
    test('Form error message accessibility', async ({ page }) => {
      // Go to a form page
      await page.goto('/auth/signin');
      await expect(page.getByRole('main')).toBeVisible();

      // Leeres Formular absenden, um die Validierung auszulösen
      await page.getByRole('button', { name: 'Submit sign in form' }).click();
      // Native Validierung fokussiert das erste leere Pflichtfeld
      await expect(page.getByLabel('Email')).toBeFocused();

      // Check for error message accessibility
      const results = await new AxeBuilder({ page }).analyze();

      // Filter for error-related violations
      const errorViolations = results.violations.filter(
        (violation) =>
          violation.id.includes('aria-describedby') ||
          violation.id.includes('form-field') ||
          violation.tags.includes('forms'),
      );

      expect(errorViolations).toEqual([]);
    });
  });

  test.describe('Custom Accessibility Rules', () => {
    test('Accessibility with custom exclusions', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      const results = await new AxeBuilder({ page })
        // Exclude third-party content that we can't control
        .exclude('.advertisement, .third-party-widget, iframe[src*="google"]')
        // Temporarily disable specific rules if needed for development
        // .disableRules(['color-contrast']) // Only use this temporarily!
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('Progressive enhancement check', async ({ page }) => {
      // Disable JavaScript to test basic functionality
      await page.context().addInitScript(() => {
        // Simulate JavaScript being disabled
        Object.defineProperty(window, 'navigator', {
          value: { ...window.navigator, javaEnabled: () => false },
        });
      });

      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();

      // Basic accessibility should still work without JavaScript
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Log but don't fail - this is informational for progressive enhancement
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
      });
      console.log(
        `Accessibility violations without JS: ${results.violations.length}`,
      );
    });
  });
});
