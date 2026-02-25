import type { RSSItem } from "@/types/rss";
import { fakerDE as faker } from '@faker-js/faker';

export function generateMockNewsItems(count: number): RSSItem[] {
  return Array.from({ length: count }, () => ({
    title: faker.lorem.sentence(),
    link: faker.internet.url(),
    description: faker.lorem.paragraph(),
    pubDate: faker.date.recent().toISOString(),
    category: faker.lorem.word(),
    source: faker.company.name(),
    snippet: faker.lorem.sentence(),
    isoDate: faker.date.recent().toISOString(),
    contentSnippet: faker.lorem.paragraph()
  }));
}