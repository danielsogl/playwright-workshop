/**
 * Mock data for API testing (Exercise 11)
 * Used to test success, error, and empty states.
 * Shared across exercises – Exercise 12 imports `mockSearchFeed` from here.
 */

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

export const mockNewsData = {
  success: {
    items: [
      {
        title: 'Workshop Test Article - AI Development Trends',
        link: 'https://example.com/ai-trends-2024',
        description:
          'Comprehensive overview of artificial intelligence developments in 2024, including machine learning advances and their impact on various industries.',
        pubDate: 'Sat, 04 Oct 2025 20:00:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet:
          'Comprehensive overview of artificial intelligence developments in 2024',
        isoDate: '2025-10-04T20:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Global Market Analysis',
        link: 'https://example.com/market-analysis-q3',
        description:
          'Detailed analysis of global market trends in Q3 2025, showing positive indicators across technology and business sectors.',
        pubDate: 'Sat, 04 Oct 2025 19:30:00 +0000',
        category: 'Business',
        source: 'Reuters Financial News',
        snippet: 'Detailed analysis of global market trends in Q3 2025',
        isoDate: '2025-10-04T19:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Breaking News Update',
        link: 'https://example.com/breaking-news-update',
        description:
          'Latest developments in international affairs and their implications for global cooperation and policy making.',
        pubDate: 'Sat, 04 Oct 2025 19:00:00 +0000',
        category: 'World News',
        source: 'BBC World',
        snippet: 'Latest developments in international affairs',
        isoDate: '2025-10-04T19:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Innovation in Web Development',
        link: 'https://example.com/web-dev-innovation',
        description:
          'Exploring the latest trends in web development, including new frameworks, tools, and best practices for modern applications.',
        pubDate: 'Sat, 04 Oct 2025 18:30:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'Exploring the latest trends in web development',
        isoDate: '2025-10-04T18:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Cybersecurity Advances',
        link: 'https://example.com/cybersecurity-advances',
        description:
          'Recent breakthroughs in cybersecurity technology and their role in protecting digital infrastructure from emerging threats.',
        pubDate: 'Sat, 04 Oct 2025 18:00:00 +0000',
        category: 'Technology',
        source: 'Hacker News',
        snippet: 'Recent breakthroughs in cybersecurity technology',
        isoDate: '2025-10-04T18:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Economic Policy Changes',
        link: 'https://example.com/economic-policy-changes',
        description:
          'Analysis of recent economic policy changes and their expected impact on businesses and consumers worldwide.',
        pubDate: 'Sat, 04 Oct 2025 17:30:00 +0000',
        category: 'Business',
        source: 'Reuters Financial News',
        snippet: 'Analysis of recent economic policy changes',
        isoDate: '2025-10-04T17:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Climate Technology Solutions',
        link: 'https://example.com/climate-tech-solutions',
        description:
          'Innovative technological solutions being developed to address climate change challenges and promote sustainable development.',
        pubDate: 'Sat, 04 Oct 2025 17:00:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'Innovative technological solutions being developed',
        isoDate: '2025-10-04T17:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - International Trade Developments',
        link: 'https://example.com/international-trade',
        description:
          'Overview of recent international trade agreements and their implications for global commerce and economic growth.',
        pubDate: 'Sat, 04 Oct 2025 16:30:00 +0000',
        category: 'World News',
        source: 'BBC World',
        snippet: 'Overview of recent international trade agreements',
        isoDate: '2025-10-04T16:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Startup Funding Trends',
        link: 'https://example.com/startup-funding-trends',
        description:
          'Analysis of current startup funding patterns, venture capital trends, and emerging investment opportunities in tech sector.',
        pubDate: 'Sat, 04 Oct 2025 16:00:00 +0000',
        category: 'Business',
        source: 'TechCrunch',
        snippet: 'Analysis of current startup funding patterns',
        isoDate: '2025-10-04T16:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Open Source Development',
        link: 'https://example.com/open-source-development',
        description:
          'The growing impact of open source software development on the technology industry and collaborative innovation.',
        pubDate: 'Sat, 04 Oct 2025 15:30:00 +0000',
        category: 'Technology',
        source: 'Hacker News',
        snippet: 'The growing impact of open source software development',
        isoDate: '2025-10-04T15:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Digital Privacy Rights',
        link: 'https://example.com/digital-privacy-rights',
        description:
          'Examination of evolving digital privacy laws and their impact on technology companies and user data protection.',
        pubDate: 'Sat, 04 Oct 2025 15:00:00 +0000',
        category: 'World News',
        source: 'BBC World',
        snippet: 'Examination of evolving digital privacy laws',
        isoDate: '2025-10-04T15:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Mobile Technology Evolution',
        link: 'https://example.com/mobile-tech-evolution',
        description:
          'How mobile technology continues to evolve with new features, capabilities, and integration with emerging technologies.',
        pubDate: 'Sat, 04 Oct 2025 14:30:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'How mobile technology continues to evolve',
        isoDate: '2025-10-04T14:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Financial Markets Update',
        link: 'https://example.com/financial-markets-update',
        description:
          'Weekly overview of financial market performance, including stock indices, currency movements, and sector analysis.',
        pubDate: 'Sat, 04 Oct 2025 14:00:00 +0000',
        category: 'Business',
        source: 'Reuters Financial News',
        snippet: 'Weekly overview of financial market performance',
        isoDate: '2025-10-04T14:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Education Technology Growth',
        link: 'https://example.com/edtech-growth',
        description:
          'The rapid expansion of educational technology solutions and their transformative impact on learning and teaching methods.',
        pubDate: 'Sat, 04 Oct 2025 13:30:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'The rapid expansion of educational technology solutions',
        isoDate: '2025-10-04T13:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - International Cooperation',
        link: 'https://example.com/international-cooperation',
        description:
          'Recent developments in international cooperation initiatives and their role in addressing global challenges.',
        pubDate: 'Sat, 04 Oct 2025 13:00:00 +0000',
        category: 'World News',
        source: 'BBC World',
        snippet: 'Recent developments in international cooperation initiatives',
        isoDate: '2025-10-04T13:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Cloud Computing Trends',
        link: 'https://example.com/cloud-computing-trends',
        description:
          'Latest trends in cloud computing adoption, including hybrid cloud solutions and edge computing developments.',
        pubDate: 'Sat, 04 Oct 2025 12:30:00 +0000',
        category: 'Technology',
        source: 'Hacker News',
        snippet: 'Latest trends in cloud computing adoption',
        isoDate: '2025-10-04T12:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Supply Chain Innovation',
        link: 'https://example.com/supply-chain-innovation',
        description:
          'How modern supply chains are being transformed through technology and innovative management approaches.',
        pubDate: 'Sat, 04 Oct 2025 12:00:00 +0000',
        category: 'Business',
        source: 'Reuters Financial News',
        snippet: 'How modern supply chains are being transformed',
        isoDate: '2025-10-04T12:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Social Media Evolution',
        link: 'https://example.com/social-media-evolution',
        description:
          'The changing landscape of social media platforms and their impact on communication, business, and society.',
        pubDate: 'Sat, 04 Oct 2025 11:30:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'The changing landscape of social media platforms',
        isoDate: '2025-10-04T11:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Healthcare Technology Advances',
        link: 'https://example.com/healthcare-tech-advances',
        description:
          'Revolutionary advances in healthcare technology, including telemedicine, AI diagnostics, and personalized treatment.',
        pubDate: 'Sat, 04 Oct 2025 11:00:00 +0000',
        category: 'Technology',
        source: 'Hacker News',
        snippet: 'Revolutionary advances in healthcare technology',
        isoDate: '2025-10-04T11:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Global Environmental Initiatives',
        link: 'https://example.com/environmental-initiatives',
        description:
          'Worldwide environmental protection initiatives and their progress toward sustainable development goals.',
        pubDate: 'Sat, 04 Oct 2025 10:30:00 +0000',
        category: 'World News',
        source: 'BBC World',
        snippet: 'Worldwide environmental protection initiatives',
        isoDate: '2025-10-04T10:30:00.000Z',
      },
    ],
  },
  empty: {
    items: [],
  },
  filtered: {
    items: [
      {
        title: 'Workshop Test Article - AI Development Trends',
        link: 'https://example.com/ai-trends-2024',
        description:
          'Comprehensive overview of artificial intelligence developments in 2024, including machine learning advances and their impact on various industries.',
        pubDate: 'Sat, 04 Oct 2025 20:00:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet:
          'Comprehensive overview of artificial intelligence developments in 2024',
        isoDate: '2025-10-04T20:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Innovation in Web Development',
        link: 'https://example.com/web-dev-innovation',
        description:
          'Exploring the latest trends in web development, including new frameworks, tools, and best practices for modern applications.',
        pubDate: 'Sat, 04 Oct 2025 18:30:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'Exploring the latest trends in web development',
        isoDate: '2025-10-04T18:30:00.000Z',
      },
      {
        title: 'Workshop Test Article - Cybersecurity Advances',
        link: 'https://example.com/cybersecurity-advances',
        description:
          'Recent breakthroughs in cybersecurity technology and their role in protecting digital infrastructure from emerging threats.',
        pubDate: 'Sat, 04 Oct 2025 18:00:00 +0000',
        category: 'Technology',
        source: 'Hacker News',
        snippet: 'Recent breakthroughs in cybersecurity technology',
        isoDate: '2025-10-04T18:00:00.000Z',
      },
      {
        title: 'Workshop Test Article - Climate Technology Solutions',
        link: 'https://example.com/climate-tech-solutions',
        description:
          'Innovative technological solutions being developed to address climate change challenges and promote sustainable development.',
        pubDate: 'Sat, 04 Oct 2025 17:00:00 +0000',
        category: 'Technology',
        source: 'TechCrunch',
        snippet: 'Innovative technological solutions being developed',
        isoDate: '2025-10-04T17:00:00.000Z',
      },
    ],
  },
};

export const mockErrorResponse = {
  error: 'Internal Server Error',
  message: 'Failed to fetch news data',
  statusCode: 500,
};

export const mockRateLimitResponse = {
  error: 'Rate Limit Exceeded',
  message: 'Too many requests. Please try again later.',
  statusCode: 429,
  retryAfter: 60,
};
