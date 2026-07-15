import { Given, Then, When, expect } from '../fixtures';

Given('Nina is browsing the public news feed', async ({ publicNewsPage }) => {
  await publicNewsPage.navigateTo();
  await expect(publicNewsPage.loading).toBeHidden();
  await expect(publicNewsPage.items().first()).toBeVisible();
});

When("she searches for the word from the first article's title", async ({ publicNewsPage, world }) => {
  const word = (await publicNewsPage.item(0).title()).split(' ')[0];

  world.searchTerm = word;
  await publicNewsPage.search(word);
});

Then('she sees at least one article', async ({ publicNewsPage }) => {
  expect(await publicNewsPage.items().count()).toBeGreaterThan(0);
});

Then('the first article shows a title and a source', async ({ publicNewsPage }) => {
  const first = publicNewsPage.item(0);

  expect((await first.title()).length).toBeGreaterThan(0);
  expect((await first.source()).length).toBeGreaterThan(0);
});

Then('the stated number of articles matches the articles shown', async ({ publicNewsPage }) => {
  const count = await publicNewsPage.items().count();

  expect(await publicNewsPage.resultsText()).toBe(`${count} articles found`);
});

Then('every article shown mentions that word', async ({ publicNewsPage, world }) => {
  const pattern = new RegExp(world.searchTerm, 'i');

  for (const article of await publicNewsPage.items().all()) {
    await expect(article).toContainText(pattern);
  }
});
