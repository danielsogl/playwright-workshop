import { RSSItem, RSSSource } from '../types/rss';

export async function fetchRSSFeed(source: RSSSource): Promise<RSSItem[]> {
  try {
    const response = await fetch(
      `/api/rss-proxy?url=${encodeURIComponent(source.url)}`,
    );
    const text = await response.text();

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    return Array.from(items).map((item) => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      category: source.category,
      source: source.name,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(sources: RSSSource[]): Promise<RSSItem[]> {
  const allItems = await Promise.all(
    sources.map((source) => fetchRSSFeed(source)),
  );

  return allItems.flat().sort((a, b) => {
    // Handle potentially undefined pubDate for sorting
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;

    return dateB - dateA;
  });
}

export function filterFeedItems(
  items: RSSItem[],
  searchQuery: string,
  selectedCategory: string,
): RSSItem[] {
  return items.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && // Check if description exists
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}
