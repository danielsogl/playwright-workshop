'use client';

import type { RSSItem } from '@/types/rss';
import type { ChangeEvent } from 'react';

import { Card, CardBody, Input } from '@heroui/react';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
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
        className="flex justify-center items-center min-h-[calc(100vh-10rem)]"
        role="status"
        aria-label="Loading news feed"
      >
        <Spinner label="Loading news feed…" size="lg" />
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
      <Card className="border border-default-200">
        <CardBody className="p-4">
          <div
            className="flex flex-col sm:flex-row gap-4"
            role="search"
            aria-label="News filter options"
          >
            <Input
              aria-label="Search news articles"
              className="flex-1"
              placeholder="Search news…"
              type="text"
              value={searchQuery}
              id="search-news"
              name="search-news"
              variant="bordered"
              startContent={
                <Search className="w-4 h-4 text-default-400" aria-hidden="true" />
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            <select
              aria-label="Filter news by category"
              className="w-full sm:w-48 rounded-xl border-2 border-default-200 bg-default-100 text-foreground px-3 py-2.5 hover:border-default-400 transition-colors focus:border-primary focus:outline-none"
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
        </CardBody>
      </Card>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Rss className="w-4 h-4 text-default-400" aria-hidden="true" />
        <span className="text-sm text-default-500">
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
            className="border border-default-200 hover:border-default-300 transition-colors overflow-hidden"
            role="listitem"
            aria-labelledby={`news-title-${index}`}
          >
            <CardBody className="p-5 gap-3">
              <div className="flex justify-between items-start gap-2">
                <Chip variant="flat" size="sm" color="primary">
                  {item.source}
                </Chip>
                {item.category && (
                  <Chip variant="flat" size="sm" color="secondary">
                    {item.category}
                  </Chip>
                )}
              </div>

              <h2
                className="text-lg font-semibold leading-snug"
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

              <p className="text-default-500 text-sm line-clamp-3">
                {item.description?.replace(/<[^>]*>/g, '') ??
                  'No description available'}
              </p>

              <div className="text-xs text-default-400 mt-auto pt-2">
                {item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Date unavailable'}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
