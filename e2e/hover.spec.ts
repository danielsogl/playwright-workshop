import { test, expect } from "@playwright/test";

test("Löschen eines Todo-Items mit Hover-Aktion", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc/");
  await page.getByPlaceholder("What needs to be done?").fill("Hover-Test");
  await page.keyboard.press("Enter");

  // Prüfen, dass Item existiert
  await expect(page.getByText("Hover-Test")).toBeVisible();

  // Hover über dem Element, um den Lösch-Button sichtbar zu machen
  await page.getByText("Hover-Test").hover();

  // Klick auf den Lösch-Button (der erst nach Hover sichtbar ist)
  // In TodoMVC ist der Lösch-Button ein Element mit der Klasse "destroy"
  await page.locator('.todo-list li').filter({ hasText: 'Hover-Test' })
    .getByRole('button', { name: 'Delete' })
    .click();

  // Prüfen, dass Item gelöscht wurde
  await expect(page.getByText("Hover-Test")).not.toBeVisible();
});
