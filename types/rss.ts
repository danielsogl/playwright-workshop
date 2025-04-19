export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface RSSItem {
  title: string;
  link?: string;
  description?: string;
  pubDate?: string;
  category?: string;
  source?: string;
  snippet?: string;
  isoDate?: string;
  contentSnippet?: string;
}

export interface RSSFeed {
  id: string;
  url: string;
  name: string;
  category: string;
}

export interface RSSFeedState {
  items: RSSItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
}
