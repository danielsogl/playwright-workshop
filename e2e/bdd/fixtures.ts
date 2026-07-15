import { mergeTests } from '@playwright/test';
import { test as bddBase, createBdd } from 'playwright-bdd';

import { test as appTest, expect } from '@/e2e/fixtures/base.fixture';

/** `world` is the per-scenario scratchpad — never keep step state in module globals. */
export const test = mergeTests(bddBase, appTest).extend<{ world: Record<string, string> }>({
  world: async ({}, use) => {
    await use({});
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
export { expect };
