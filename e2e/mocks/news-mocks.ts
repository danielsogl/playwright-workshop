/**
 * Mock data for API testing (Exercise 11)
 * Used to test success, error, and empty states.
 * Shared across exercises – Exercise 12 imports `mockSearchFeed` from here.
 */

export const mockNewsData = {
  success: {
    items: [
      {
        title: 'Test Technology News',
        link: 'https://example.com/tech-news',
        description: 'Dies ist ein Test-Artikel über Technologie',
        pubDate: 'Mon, 01 Jan 2024 10:00:00 GMT',
        category: 'Technology',
        source: 'Test Source',
        snippet: 'Ein kurzer Auszug des Artikels',
        isoDate: '2024-01-01T10:00:00.000Z',
      },
      {
        title: 'Test Business News',
        link: 'https://example.com/business-news',
        description: 'Ein wichtiger Business-Artikel für Tests',
        pubDate: 'Tue, 02 Jan 2024 14:30:00 GMT',
        category: 'Business',
        source: 'Test Source',
        snippet: 'Business News Zusammenfassung',
        isoDate: '2024-01-02T14:30:00.000Z',
      },
    ],
  },
  empty: {
    items: [],
  },
};

// Single-item feed reused by Exercise 12 (waitForResponse) so the mock data
// lives in one place instead of being redefined inline per test.
export const mockSearchFeed = {
  items: [
    {
      title: 'Gemockte News',
      description: 'Beschreibung der gemockten News',
      link: 'https://example.com/mock-1',
      category: 'Technology',
      source: 'Mock Source',
      pubDate: '2026-01-01T10:00:00.000Z',
      isoDate: '2026-01-01T10:00:00.000Z',
    },
  ],
};
