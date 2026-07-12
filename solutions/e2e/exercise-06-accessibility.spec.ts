/**
 * Exercise 8 - Accessibility Testing Solution
 *
 * This test suite demonstrates comprehensive accessibility testing using axe-core with Playwright.
 * Tests WCAG compliance, keyboard navigation, and accessibility across different themes and viewports.
 *
 * Prerequisites:
 * npm install --save-dev @axe-core/playwright
 *
 * Key learning points:
 * - Automated accessibility testing with axe-core
 * - WCAG 2.1 Level AA compliance testing
 * - Component-specific accessibility testing
 * - Keyboard navigation testing
 * - Color contrast and theme accessibility
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Exercise 8: Accessibility Testing', () => {
  test.describe('Basic Accessibility Tests', () => {
    test('Homepage accessibility scan', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Run comprehensive accessibility analysis
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log('Accessibility Violations Found:');
        accessibilityScanResults.violations.forEach((violation, index) => {
          console.log(
            `\n${index + 1}. ${violation.impact}: ${violation.description}`,
          );
          console.log(`   Rule: ${violation.id}`);
          console.log(`   Help: ${violation.helpUrl}`);
          violation.nodes.forEach((node, nodeIndex) => {
            console.log(
              `   Target ${nodeIndex + 1}: ${node.target.join(', ')}`,
            );
            if (node.failureSummary) {
              console.log(`   Issue: ${node.failureSummary}`);
            }
          });
        });
      }

      // Test should fail if there are violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('News feed accessibility with detailed reporting', async ({
      page,
    }) => {
      await page.goto('/news/public');
      await expect(
        page.getByRole('article').or(page.getByRole('article')).first(),
      ).toBeVisible({ timeout: 10000 });

      const results = await new AxeBuilder({ page }).analyze();

      // Enhanced error reporting
      if (results.violations.length > 0) {
        console.log('\n=== ACCESSIBILITY VIOLATIONS DETECTED ===');

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

            if (node.any.length > 0) {
              console.log(
                `   - Failed checks: ${node.any.map((check) => check.message).join(', ')}`,
              );
            }
          });
        });

        console.log('\n===========================================\n');
      }

      expect(results.violations).toHaveLength(0);
    });
  });

  test.describe('WCAG Compliance Tests', () => {
    test('WCAG 2.1 Level AA compliance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test only WCAG 2.1 Level AA rules
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('WCAG 2.1 Level AAA compliance (informational)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test WCAG 2.1 Level AAA rules (informational only)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aaa', 'wcag21aaa'])
        .analyze();

      // Log AAA violations but don't fail the test
      if (results.violations.length > 0) {
        console.log('\nWCAG 2.1 Level AAA violations (informational):');
        results.violations.forEach((violation) => {
          console.log(`- ${violation.id}: ${violation.description}`);
        });
      }

      // Just log the count, don't fail on AAA violations
      console.log(`Total WCAG AAA violations: ${results.violations.length}`);
    });

    test('Color contrast compliance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Focus specifically on color contrast issues
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = results.violations.filter((violation) =>
        violation.id.includes('color-contrast'),
      );

      if (contrastViolations.length > 0) {
        console.log('\nColor contrast violations:');
        contrastViolations.forEach((violation) => {
          violation.nodes.forEach((node) => {
            console.log(`- ${node.target.join(' ')}: ${node.failureSummary}`);
          });
        });
      }

      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Component-Specific Accessibility', () => {
    test('Navigation accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test only the navigation component
      const results = await new AxeBuilder({ page }).include('nav').analyze();

      expect(results.violations).toEqual([]);
    });

    test('Form accessibility - Login page', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

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

      if (formViolations.length > 0) {
        console.log('\nForm accessibility violations:');
        formViolations.forEach((violation) => {
          console.log(`- ${violation.id}: ${violation.description}`);
        });
      }

      expect(formViolations).toEqual([]);
    });

    test('Search component accessibility', async ({ page }) => {
      await page.goto('/news/public');
      await page.waitForLoadState('networkidle');

      // Find search component
      const searchContainer = page
        .locator('.search, [role="search"], form:has(input[type="search"])')
        .or(page.locator('div:has(input[placeholder*="search" i])'))
        .first();

      if ((await searchContainer.count()) > 0) {
        const results = await new AxeBuilder({ page })
          .include(['[role="search"]'])
          .analyze();

        expect(results.violations).toEqual([]);
      } else {
        console.log(
          'Search component not found, skipping search accessibility test',
        );
      }
    });

    test('News article list accessibility', async ({ page }) => {
      await page.goto('/news/public');
      await expect(
        page.getByRole('article').or(page.getByRole('article')).first(),
      ).toBeVisible({ timeout: 10000 });

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
    test('Light mode color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Ensure we're in light mode
      const themeToggle = page
        .locator('[data-testid="theme-toggle"]')
        .or(page.locator('button[aria-label*="theme" i]'))
        .first();

      const isDarkMode =
        (await page
          .locator(
            'html[class*="dark"], body[class*="dark"], [data-theme="dark"]',
          )
          .count()) > 0;

      if (isDarkMode && (await themeToggle.count()) > 0) {
        await themeToggle.click();
        await page.waitForTimeout(500);
      }

      // Test color contrast in light mode
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = results.violations.filter((violation) =>
        violation.id.includes('color-contrast'),
      );

      if (contrastViolations.length > 0) {
        console.log('\nLight mode contrast violations:');
        contrastViolations.forEach((violation) => {
          violation.nodes.forEach((node) => {
            console.log(`- ${node.target.join(' ')}`);
          });
        });
      }

      expect(contrastViolations).toHaveLength(0);
    });

    test('Dark mode color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Toggle to dark mode
      const themeToggle = page
        .locator('[data-testid="theme-toggle"]')
        .or(page.locator('button[aria-label*="theme" i]'))
        .first();

      if ((await themeToggle.count()) > 0) {
        await themeToggle.click();
        await page.waitForTimeout(500);

        // Verify dark mode is active
        const isDarkMode =
          (await page
            .locator(
              'html[class*="dark"], body[class*="dark"], [data-theme="dark"]',
            )
            .count()) > 0;

        if (isDarkMode) {
          // Test color contrast in dark mode
          const results = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .analyze();

          const contrastViolations = results.violations.filter((violation) =>
            violation.id.includes('color-contrast'),
          );

          if (contrastViolations.length > 0) {
            console.log('\nDark mode contrast violations:');
            contrastViolations.forEach((violation) => {
              violation.nodes.forEach((node) => {
                console.log(`- ${node.target.join(' ')}`);
              });
            });
          }

          expect(contrastViolations).toHaveLength(0);
        } else {
          console.log(
            'Could not activate dark mode, skipping dark mode contrast test',
          );
        }
      } else {
        console.log('Theme toggle not found, skipping dark mode test');
      }
    });

    test('Theme toggle accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const themeToggle = page
        .locator('[data-testid="theme-toggle"]')
        .or(page.locator('button[aria-label*="theme" i]'))
        .first();

      if ((await themeToggle.count()) > 0) {
        // Test the theme toggle button itself
        const results = await new AxeBuilder({ page })
          .include(['[role="switch"]'])
          .analyze();

        expect(results.violations).toEqual([]);

        // Check for proper labeling
        const hasAriaLabel = await themeToggle.getAttribute('aria-label');
        const hasTitle = await themeToggle.getAttribute('title');
        const hasVisibleText = await themeToggle.textContent();

        const hasAccessibleName =
          hasAriaLabel ||
          hasTitle ||
          (hasVisibleText && hasVisibleText.trim().length > 0);
        expect(hasAccessibleName).toBe(true);
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Mobile touch target sizes', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page }).analyze();

      // Filter for touch target size violations
      const touchTargetViolations = results.violations.filter(
        (violation) =>
          violation.id === 'target-size' ||
          violation.id.includes('touch-target'),
      );

      if (touchTargetViolations.length > 0) {
        console.log('\nTouch target size violations:');
        touchTargetViolations.forEach((violation) => {
          violation.nodes.forEach((node) => {
            console.log(`- ${node.target.join(' ')}: ${node.failureSummary}`);
          });
        });
      }

      expect(touchTargetViolations).toEqual([]);
    });

    test('Mobile navigation accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test mobile navigation
      const mobileMenuButton = page
        .locator('button[aria-label*="menu" i]')
        .or(page.locator('[data-testid="mobile-menu-button"]'))
        .first();

      if ((await mobileMenuButton.count()) > 0) {
        // Test menu button accessibility
        const buttonResults = await new AxeBuilder({ page })
          .include(['button[aria-label*="menu"]'])
          .analyze();

        expect(buttonResults.violations).toEqual([]);

        // Open mobile menu and test its accessibility
        await mobileMenuButton.click();
        await page.waitForTimeout(500);

        const menuResults = await new AxeBuilder({ page })
          .include('nav')
          .analyze();

        expect(menuResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Keyboard Navigation Tests', () => {
    test('Tab navigation order', async ({ page, browserName }) => {
      // WebKit/Safari fokussiert Links & Buttons per Tab nur, wenn macOS
      // "Full Keyboard Access" aktiv ist – headless bleibt die Tab-Reihenfolge leer.
      test.skip(
        browserName === 'webkit',
        'WebKit Tab-Fokus benötigt macOS Full Keyboard Access',
      );
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Start from the body to reset focus
      await page.locator('body').focus();

      const focusableElements = [];
      let previousElement = null;

      // Tab through the page and collect focusable elements
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const activeElement = await page.evaluate(() => {
          const element = document.activeElement;
          if (element && element !== document.body) {
            return {
              tagName: element.tagName,
              type: element.type || null,
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

    test('Focus visibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab to first focusable element
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

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

      if (focusedElement) {
        console.log('Focus styles:', focusedElement);

        const hasFocusIndicator =
          focusedElement.hasOutline ||
          focusedElement.hasBoxShadow ||
          focusedElement.hasFocusOutline ||
          focusedElement.hasFocusBoxShadow;

        expect(hasFocusIndicator).toBe(true);
      }

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
      await page.waitForLoadState('networkidle');

      // Look for skip links (usually hidden until focused)
      await page.keyboard.press('Tab');

      const skipLink = page
        .locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")')
        .or(page.locator('[data-testid="skip-link"]'))
        .first();

      if (await skipLink.isVisible()) {
        console.log('Skip link found and visible');

        // Test skip link functionality
        await skipLink.click();

        // Check if focus moved to main content
        const activeElementId = await page.evaluate(
          () =>
            document.activeElement?.id ||
            document.activeElement?.getAttribute('data-testid'),
        );

        console.log('Active element after skip link:', activeElementId);

        // Should focus on main content area
        const mainContentFocused =
          activeElementId === 'main' ||
          activeElementId === 'content' ||
          activeElementId === 'main-content' ||
          (await page.locator('main:focus, [role="main"]:focus').count()) > 0;

        expect(mainContentFocused).toBe(true);
      } else {
        console.log(
          'Skip link not found - this might be acceptable depending on the design',
        );
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('Semantic HTML structure', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

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
      await page.waitForLoadState('networkidle');

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

        const found = {};
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
      await page.waitForLoadState('networkidle');

      // Try to submit empty form to trigger errors
      const submitButton = page.getByRole('button', {
        name: /sign in|login|submit/i,
      });

      if ((await submitButton.count()) > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);

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
      }
    });
  });

  test.describe('Custom Accessibility Rules', () => {
    test('Accessibility with custom exclusions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

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
      await page.waitForLoadState('networkidle');

      // Basic accessibility should still work without JavaScript
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Log but don't fail - this is informational for progressive enhancement
      if (results.violations.length > 0) {
        console.log('\nAccessibility issues without JavaScript:');
        results.violations.forEach((violation) => {
          console.log(`- ${violation.id}: ${violation.description}`);
        });
      }

      console.log(
        `Accessibility violations without JS: ${results.violations.length}`,
      );
    });
  });
});
