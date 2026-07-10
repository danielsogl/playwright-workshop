'use client';

import type { RSSItem } from '@/types/rss';

import { Card, TextField, Input, Chip, Spinner } from '@heroui/react';
import { useState } from 'react';
import useSWR from 'swr';
import { Rss, Search } from 'lucide-react';

import { filterFeedItems } from '@/lib/rss';
import { RSS_CATEGORIES } from '@/config/rss-sources';
import { fetcher } from '@/lib/utils/fetchers';
import { title, subtitle } from '@/components/primitives';

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
        className="flex flex-col justify-center items-center gap-2 min-h-[calc(100vh-10rem)]"
        role="status"
        aria-label="Loading news feed"
      >
        <Spinner size="lg" />
        <span className="text-muted">Loading news feed…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="text-danger" role="alert">
          Failed to load RSS feeds
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-8 md:py-10">
      {/* Header */}
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center">
          <h1 className={title()} id="news-feed-title">
            News Feed
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            Browse the latest news from public RSS feeds
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <Card className="border border-border">
        <Card.Content className="p-4">
          <div
            className="flex flex-col sm:flex-row gap-4"
            role="search"
            aria-label="News filter options"
          >
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                aria-hidden="true"
              />
              <TextField
                aria-label="Search news articles"
                name="search-news"
                type="text"
                value={searchQuery}
                onChange={setSearchQuery}
              >
                <Input
                  className="pl-9"
                  placeholder="Search news…"
                  id="search-news"
                />
              </TextField>
            </div>
            <select
              aria-label="Filter news by category"
              className="w-full sm:w-48 rounded-xl border-2 border-border bg-default-soft text-foreground px-3 py-2.5 hover:border-border transition-colors focus:border-accent focus:outline-none"
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
        </Card.Content>
      </Card>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Rss className="w-4 h-4 text-muted" aria-hidden="true" />
        <span className="text-sm text-muted">
          {filteredItems.length} articles found
        </span>
      </div>

      {/* News Grid */}
      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="News articles"
      >
        {filteredItems.map((item, index) => (
          <Card
            key={index}
            className="border border-border hover:border-border transition-colors overflow-hidden"
            role="listitem"
            aria-labelledby={`news-title-${index}`}
          >
            <Card.Content className="p-5 gap-3">
              <div className="flex justify-between items-start gap-2">
                <Chip variant="soft" size="sm" color="accent">
                  {item.source}
                </Chip>
                {item.category && (
                  <Chip variant="soft" size="sm" color="default">
                    {item.category}
                  </Chip>
                )}
              </div>

              <h2
                className="text-lg font-semibold leading-snug"
                id={`news-title-${index}`}
              >
                <a
                  className="hover:text-accent transition-colors"
                  href={item.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              </h2>

              <p className="text-muted text-sm line-clamp-3">
                {item.description?.replace(/<[^>]*>/g, '') ??
                  'No description available'}
              </p>

              <div className="text-xs text-muted mt-auto pt-2">
                {item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Date unavailable'}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
