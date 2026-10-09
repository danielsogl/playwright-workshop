import { RSSItem } from '../types/rss';

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
