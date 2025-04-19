# Lösung: Übung 3C – Eigene Fixtures erstellen

## Hinweise zur Codebasis
- Lege eigene Fixtures und Typdefinitionen in `e2e/utils/` ab, z.B. `e2e/utils/feed-fixtures.ts` und `e2e/utils/types.ts`.
- Tests, die diese Fixtures nutzen, liegen in `e2e/news/feed-fixtures.spec.ts`.

## Beispiel für Typdefinitionen (`e2e/utils/types.ts`)
```typescript
export interface Feed {
  id: string;
  title: string;
  category: string;
  url: string;
}

export interface FeedFixtures {
  publicFeeds: Feed[];
  privateFeeds: Feed[];
  feedApi: { getFeeds: () => Promise<Feed[]> };
}
```

## Beispiel für Fixtures (`e2e/utils/feed-fixtures.ts`)
```typescript
import { test as base } from '@playwright/test';
import type { FeedFixtures, Feed } from './types';

export const test = base.extend<FeedFixtures>({
  publicFeeds: async ({}, use) => {
    const feeds = await fetchFeeds('public');
    await use(feeds);
  },
  privateFeeds: async ({}, use) => {
    const feeds = await fetchFeeds('private');
    await use(feeds);
  },
  feedApi: [async ({}, use) => {
    await use({
      getFeeds: async () => fetchFeeds('all'),
    });
  }, { scope: 'worker' }],
});

async function fetchFeeds(type: 'public' | 'private' | 'all'): Promise<Feed[]> {
  // Hier ggf. API-Call oder Mock
  return [
    { id: '1', title: 'Tech News', category: 'Technology', url: 'https://...' },
    // ...
  ];
}
```

## Beispiel für Tests mit Fixtures (`e2e/news/feed-fixtures.spec.ts`)
```typescript
import { test, expect } from '../../utils/feed-fixtures';

test('zeigt öffentliche Feeds an', async ({ publicFeeds }) => {
  expect(publicFeeds.length).toBeGreaterThan(0);
  expect(publicFeeds[0].category).toBe('Technology');
});

test('API liefert alle Feeds', async ({ feedApi }) => {
  const feeds = await feedApi.getFeeds();
  expect(feeds.length).toBeGreaterThan(0);
});
```

---
**Best Practices:**
- Lege eigene Fixtures und Hilfsfunktionen in `e2e/utils/` ab.
- Testdateien nach Domain in `e2e/<domain>/` ablegen.
- Typisiere Fixtures für bessere Wartbarkeit.
