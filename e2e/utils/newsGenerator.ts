import { v4 as uuidv4 } from 'uuid';

export interface MockNewsItem {
  id?: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
  source: string;
}

export interface MockNewsResponse {
  items: MockNewsItem[];
}

/**
 * Available categories for news items
 */
export const CATEGORIES = [
  'Technology',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
  'Science',
  'World News',
];

/**
 * Verfügbare Quellen für News Items
 */
export const SOURCES = ['Hacker News', 'TechCrunch', 'BBC World', 'The Verge'];

/**
 * Formate für das Datum in den News-Items
 */
export const DATE_FORMATS = {
  STANDARD_ISO: () => new Date().toISOString(),
  RFC822: () => {
    const date = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${days[date.getUTCDay()]}, ${date.getUTCDate().toString().padStart(2, '0')} ${
      months[date.getUTCMonth()]
    } ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date
      .getUTCMinutes()
      .toString()
      .padStart(
        2,
        '0',
      )}:${date.getUTCSeconds().toString().padStart(2, '0')} +0000`;
  },
  RFC822_GMT: () => {
    const date = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${days[date.getUTCDay()]}, ${date.getUTCDate().toString().padStart(2, '0')} ${
      months[date.getUTCMonth()]
    } ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date
      .getUTCMinutes()
      .toString()
      .padStart(
        2,
        '0',
      )}:${date.getUTCSeconds().toString().padStart(2, '0')} GMT`;
  },
};

/**
 * Optionen für die Generierung von News-Items
 */
export interface NewsGenerationOptions {
  useRandomCategories?: boolean;
  useRandomSources?: boolean;
  dateFormat?: () => string;
  includeId?: boolean;
  generateDescription?: (item: Partial<MockNewsItem>) => string;
}

/**
 * Standard-Optionen für die Generierung von News-Items
 */
export const DEFAULT_GENERATION_OPTIONS: NewsGenerationOptions = {
  useRandomCategories: true,
  useRandomSources: true,
  dateFormat: DATE_FORMATS.RFC822,
  includeId: false,
  generateDescription: (item) =>
    item.source === 'Hacker News'
      ? `Article URL: ${item.link}\nComments URL: https://news.ycombinator.com/item?id=${Math.floor(Math.random() * 100000)}\nPoints: ${Math.floor(Math.random() * 1000)}\n# Comments: ${Math.floor(Math.random() * 500)}`
      : `This is a mock news description for ${item.title || 'unknown article'}.`,
};

/**
 * Generate a single mock news item with customizable properties
 */
export function createMockNewsItem(
  overrides: Partial<MockNewsItem> = {},
  options: NewsGenerationOptions = DEFAULT_GENERATION_OPTIONS,
): MockNewsItem {
  const mergedOptions = { ...DEFAULT_GENERATION_OPTIONS, ...options };

  const category =
    overrides.category ||
    (mergedOptions.useRandomCategories
      ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      : 'Technology');

  const source =
    overrides.source ||
    (mergedOptions.useRandomSources
      ? SOURCES[Math.floor(Math.random() * SOURCES.length)]
      : 'TechCrunch');

  const id = overrides.id || (mergedOptions.includeId ? uuidv4() : undefined);
  const dateStr = overrides.pubDate || mergedOptions.dateFormat?.();

  const baseItem: Partial<MockNewsItem> = {
    id,
    title:
      overrides.title ||
      `${category} News: ${id?.slice(0, 8) || Math.floor(Math.random() * 1000)}`,
    link:
      overrides.link ||
      `https://example.com/news/${category.toLowerCase()}/${id || Math.floor(Math.random() * 100000)}`,
    category,
    source,
    pubDate: dateStr,
  };

  const description =
    overrides.description || mergedOptions.generateDescription?.(baseItem);

  return {
    ...baseItem,
    description,
  } as MockNewsItem;
}

/**
 * Generate a collection of mock news items
 */
export function createMockNewsCollection(
  count = 3,
  overrides: Partial<MockNewsItem> = {},
  options: NewsGenerationOptions = DEFAULT_GENERATION_OPTIONS,
): MockNewsResponse {
  return {
    items: Array.from({ length: count }, (_, index) =>
      createMockNewsItem(
        {
          ...overrides,
          // Allow individual item overrides, but ensure unique IDs for each item if not explicitly provided
          id: overrides.id ? `${overrides.id}-${index}` : undefined,
          // Allow setting a custom title pattern
          title: overrides.title
            ? `${overrides.title} ${index + 1}`
            : undefined,
        },
        options,
      ),
    ),
  };
}

/**
 * Create a collection with specific categories
 */
export function createMockNewsWithCategories(
  categoryCounts: Record<string, number>,
  options: NewsGenerationOptions = DEFAULT_GENERATION_OPTIONS,
): MockNewsResponse {
  const items: MockNewsItem[] = [];

  for (const [category, count] of Object.entries(categoryCounts)) {
    for (let i = 0; i < count; i++) {
      items.push(
        createMockNewsItem(
          {
            category,
            title: `${category} News ${i + 1}`,
          },
          options,
        ),
      );
    }
  }

  return { items };
}

/**
 * Erstellt eine Sammlung von News-Artikeln basierend auf echten Daten
 */
export function createRealisticNewsCollection(
  options: NewsGenerationOptions = DEFAULT_GENERATION_OPTIONS,
): MockNewsResponse {
  return createMockNewsWithCategories(
    {
      Technology: 15,
      'World News': 20,
      Business: 5,
      Sports: 3,
      Entertainment: 4,
      Health: 2,
      Science: 6,
    },
    options,
  );
}

/**
 * Erzeugt Testdaten, die sehr nah an den echten Daten sind
 */
export function createSampleNewsFromRealData(): MockNewsResponse {
  return {
    items: [
      {
        title:
          'Internet usage pattern during power outage in Spain and Portugal',
        link: 'https://blog.akamai-mpulse.com/blog/2025-05-03-iberian-power-outage/',
        description:
          'Article URL: https://blog.akamai-mpulse.com/blog/2025-05-03-iberian-power-outage/\nComments URL: https://news.ycombinator.com/item?id=43894363\nPoints: 6\n# Comments: 0',
        pubDate: 'Mon, 05 May 2025 12:29:21 +0000',
        category: 'Technology',
        source: 'Hacker News',
      },
      {
        title: 'Trump says non-US movies to be hit with 100% tariffs',
        link: 'https://www.bbc.com/news/articles/cjr7e2z1rxyo',
        description:
          'The president blamed foreign-made movies for the American film industry\'s "very fast death".',
        pubDate: 'Mon, 05 May 2025 11:47:40 GMT',
        category: 'World News',
        source: 'BBC World',
      },
      {
        title: 'AWS Built a Security Tool. It Introduced a Security Risk',
        link: 'https://www.token.security/blog/aws-built-a-security-tool-it-introduced-a-security-risk',
        description:
          'Article URL: https://www.token.security/blog/aws-built-a-security-tool-it-introduced-a-security-risk\nComments URL: https://news.ycombinator.com/item?id=43893906\nPoints: 28\n# Comments: 7',
        pubDate: 'Mon, 05 May 2025 11:37:04 +0000',
        category: 'Technology',
        source: 'Hacker News',
      },
    ],
  };
}

/**
 * Erzeugt eine Kombination aus Echtdaten und generierten Daten
 */
export function createMixedNewsCollection(
  realDataCount: number = 3,
  generatedDataCount: number = 10,
): MockNewsResponse {
  const realData = createSampleNewsFromRealData();
  const generatedData = createMockNewsCollection(generatedDataCount);

  return {
    items: [...realData.items.slice(0, realDataCount), ...generatedData.items],
  };
}

/**
 * Einfaches leeres Daten-Objekt für "No Data" Tests
 */
export function createEmptyNewsCollection(): MockNewsResponse {
  return {
    items: [],
  };
}
