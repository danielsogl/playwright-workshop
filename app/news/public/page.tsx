'use client';

import type { RSSItem } from '@/types/rss';
import type { ChangeEvent } from 'react';

import { Card, Input } from '@heroui/react';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';
import useSWR from 'swr';

import { filterFeedItems } from '@/lib/rss';
import { RSS_CATEGORIES } from '@/config/rss-sources';
import { fetcher } from '@/lib/utils/fetchers';

interface NewsApiResponse {
  items: RSSItem[];
}

export default function PublicNewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, error, isLoading } = useSWR<NewsApiResponse>(
    '/api/news/public',
    fetcher,
  );

  const filteredItems = filterFeedItems(
    data?.items || [],
    searchQuery,
    selectedCategory,
  );

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-label="Loading news feed"
      >
        <Spinner label="Loading news feed\u2026" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-danger" role="alert">
          Failed to load RSS feeds
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 id="news-feed-title" className="text-3xl font-bold mb-8">
        News Feed
      </h1>

      <div
        className="flex gap-4 mb-8"
        role="search"
        aria-label="News filter options"
      >
        <Input
          aria-label="Search news articles"
          className="flex-1"
          placeholder="Search news\u2026"
          type="text"
          value={searchQuery}
          id="search-news"
          name="search-news"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />

        <select
          aria-label="Filter news by category"
          className="w-48 rounded-lg border border-default-200 bg-default-50 text-foreground px-3 py-2"
          value={selectedCategory}
          id="filter-category"
          name="filter-category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {RSS_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="News articles"
      >
        {filteredItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden"
            role="listitem"
            aria-labelledby={`news-title-${index}`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-default-400">
                  {item.source}
                </span>
                <span className="text-sm text-default-400">
                  {item.category}
                </span>
              </div>

              <h2
                className="text-xl font-semibold mb-2"
                id={`news-title-${index}`}
              >
                <a
                  className="hover:text-primary transition-colors"
                  href={item.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              </h2>

              <p className="text-default-500 mb-4 line-clamp-3">
                {item.description?.replace(/<[^>]*>/g, '') ??
                  'No description available'}
              </p>

              <div className="text-sm text-default-400">
                {item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString()
                  : 'Date unavailable'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
