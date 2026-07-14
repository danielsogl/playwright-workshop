import { test as base } from '@playwright/test';

export const workerFixture = base.extend<{}, { sharedDB: string }>({
  sharedDB: [
    async ({ }, use) => {
      // await new Promise<void>((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 10_000);
      // });

      await use('DB is ready');

      console.log('Shared database is cleaned up');
    },
    { scope: 'worker' }
  ],
});
