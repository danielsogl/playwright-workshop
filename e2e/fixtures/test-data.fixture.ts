import { test as base } from '@playwright/test';

export const test = base.extend<{
  createTestData: (itemCount: number) => Promise<void>;
}>({
  createTestData: async ({ request }, use) => {
    const generateData = async (itemCount: number) => {
      const response = await request.get(`https://jsonplaceholder.typicode.com/posts?_limit=${itemCount}`);
      const data = await response.json();
      return data;
    };

    const createTestData = async (itemCount: number) => {
      const testData = await generateData(itemCount);
      console.log(`Generated ${testData.length} items of test data.`);
    };

    await use(createTestData);
  }
});