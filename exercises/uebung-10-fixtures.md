# Übung 10 – Playwright Fixtures

**Ziel:**
Du lernst die Grundlagen von Playwright Fixtures kennen – ein System für wiederverwendbare Test-Setups. Fixtures machen Tests sauberer und wartbarer.

## Was sind Fixtures?

Fixtures sind **wiederverwendbare Bausteine** für Tests, die:

- Test-Daten vorbereiten
- Setup und Cleanup automatisieren
- Zwischen Tests geteilt werden können

## Aufgaben

### 1. **Vorbereitung**

1. **Starte die Anwendung und erkunde die Demo-Seite:**
   ```bash
   npm run dev
   ```

   - Öffne `http://localhost:3000/fixtures-demo`
   - Die Seite startet mit 2 Standard-Benutzern
   - Teste das Hinzufügen von Benutzern

### 2. **Einfache Test-Data Fixture**

1. **Erstelle `e2e/fixtures-basic.spec.ts`:**

   ```typescript
   import { test as base, expect } from '@playwright/test';

   // Definiere eine einfache Fixture für Test-Daten
   const test = base.extend<{
     testUser: { name: string; email: string; role: string };
   }>({
     testUser: async ({}, use) => {
       // Setup: Erstelle eindeutige Test-Daten
       const userData = {
         name: `Test User ${Date.now()}`,
         email: `test-${Date.now()}@example.com`,
         role: 'user',
       };

       console.log('✅ Test user data prepared:', userData.name);

       // Fixture bereitstellen
       await use(userData);

       // Teardown (hier optional)
       console.log('🧹 Test user data cleanup completed');
     },
   });

   test('fügt einen Benutzer mit Fixture-Daten hinzu', async ({
     page,
     testUser,
   }) => {
     await page.goto('/fixtures-demo');

     // Verwende die Fixture-Daten mit semantischen Locators
     await page.getByLabel('Name').fill(testUser.name);
     await page.getByLabel('Email').fill(testUser.email);
     await page.getByLabel('Role').selectOption(testUser.role);

     await page.getByRole('button', { name: /add user/i }).click();

     // Prüfe, dass der Benutzer hinzugefügt wurde
     await expect(page.getByText(testUser.name)).toBeVisible();
     await expect(page.getByText(/3 users/)).toBeVisible();
   });
   ```

### 3. **Page Helper Fixture**

1. **Erweitere den Test mit einer Page-Helper Fixture:**

   ```typescript
   // Erweitere das Interface
   interface FixturesDemo {
     testUser: { name: string; email: string; role: string };
     userPage: {
       addUser: (user: {
         name: string;
         email: string;
         role: string;
       }) => Promise<void>;
       getUserCount: () => Promise<number>;
     };
   }

   const test = base.extend<FixturesDemo>({
     testUser: async ({}, use) => {
       const userData = {
         name: `Test User ${Date.now()}`,
         email: `test-${Date.now()}@example.com`,
         role: 'moderator',
       };
       await use(userData);
     },

     userPage: async ({ page }, use) => {
       // Navigate to the fixtures demo page
       await page.goto('/fixtures-demo');

       const userPage = {
         addUser: async (user) => {
           await page.getByLabel('Name').fill(user.name);
           await page.getByLabel('Email').fill(user.email);
           await page.getByLabel('Role').selectOption(user.role);
           await page.getByRole('button', { name: /add user/i }).click();

           // Warte bis der User hinzugefügt wurde
           await expect(page.getByText(user.name)).toBeVisible();
         },

         getUserCount: async () => {
           const countText = await page.getByText(/\d+ users/).textContent();
           return parseInt(countText?.match(/(\d+)/)?.[1] || '0');
         },
       };

       await use(userPage);
     },
   });

   test('verwendet Page Helper Fixture', async ({ testUser, userPage }) => {
     const initialCount = await userPage.getUserCount();

     await userPage.addUser(testUser);

     const finalCount = await userPage.getUserCount();
     expect(finalCount).toBe(initialCount + 1);
   });

   test('fügt mehrere Benutzer hinzu', async ({ userPage }) => {
     const user1 = {
       name: 'Alice Test',
       email: 'alice@test.com',
       role: 'admin',
     };
     const user2 = { name: 'Bob Test', email: 'bob@test.com', role: 'user' };

     const initialCount = await userPage.getUserCount();

     await userPage.addUser(user1);
     await userPage.addUser(user2);

     const finalCount = await userPage.getUserCount();
     expect(finalCount).toBe(initialCount + 2);
   });
   ```

### 4. **Tests ausführen**

1. **Führe die Tests aus:**

   ```bash
   npx playwright test fixtures-basic.spec.ts --reporter=line
   ```

2. **Beobachte die Console-Ausgaben:**
   - Setup und Teardown Nachrichten
   - Eindeutige Test-Daten für jeden Test

## Key Takeaways

### ✅ Fixtures sind gut für:

- **Test-Daten**: Eindeutige Daten für jeden Test
- **Page Helpers**: Wiederverwendbare Seitenoperationen
- **Setup/Cleanup**: Automatische Vor- und Nachbereitung

### 💡 Einfache Regeln:

1. **Eine Fixture, eine Verantwortung**
2. **Klare Namen**: `testUser` statt `data1`
3. **TypeScript nutzen** für bessere Entwicklererfahrung
4. **Semantische Locators**: `getByLabel()`, `getByRole()` statt `getByTestId()`

### 🎯 Locator Best Practices:

- **✅ User-facing**: `page.getByLabel('Name')`, `page.getByRole('button')`
- **❌ Implementation**: `page.getByTestId('user-name-input')`
- **Warum?** Tests werden aus Benutzersicht geschrieben und sind robuster

### 🔄 Fixture Lebensdauer:

- **test-scoped**: Neue Instanz für jeden Test (Standard)
- **worker-scoped**: Eine Instanz pro Worker (für teure Setups)

**Zeit:** 20-25 Minuten

---

> **💡 Tipp:** Beginne mit einfachen Test-Daten Fixtures. Erweitere sie schrittweise zu Helper-Funktionen, wenn du Wiederholung in deinen Tests siehst!
