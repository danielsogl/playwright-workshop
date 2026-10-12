'use client';

import type { RSSItem } from '@/types/rss';

import { useState } from 'react';
import useSWR from 'swr';
import { AlertCircle, ChevronDown, Search, X } from 'lucide-react';

import { filterFeedItems } from '@/lib/rss';
import { RSS_CATEGORIES } from '@/config/rss-sources';
import { fetcher } from '@/lib/utils/fetchers';
import { PageHeader } from '@/components/page-header';
import { CategoryChip } from '@/components/news/CategoryChip';

interface NewsApiResponse {
  items: RSSItem[];
}

const header = (
  <PageHeader
    id="news-feed-title"
    label="02 · API Integration · public route"
    title="News Feed"
    subtitle="Browse the latest news from public RSS feeds"
  />
);

const fieldClass =
  'w-full min-h-12 rounded-xl border-0 bg-background text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent';

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
  const isFiltered = searchQuery !== '' || selectedCategory !== '';
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pt-14 pb-24">
        {header}
        <div
          className="flex items-center gap-3"
          role="status"
          aria-label="Loading news feed"
        >
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-[3px] border-border border-t-accent"
          />
          <span className="text-muted">Loading news feed…</span>
        </div>
        <div
          aria-hidden="true"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-[22px] motion-safe:animate-pulse"
            >
              <div className="h-3 w-2/5 rounded-md bg-default" />
              <div className="h-4 w-11/12 rounded-md bg-default" />
              <div className="h-4 w-3/4 rounded-md bg-default" />
              <div className="mt-2 h-2.5 w-full rounded-md bg-default/60" />
              <div className="h-2.5 w-4/5 rounded-md bg-default/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 pt-14 pb-24">
        {header}
        <div
          className="flex max-w-xl items-center gap-2.5 rounded-2xl bg-danger-soft p-6 font-semibold text-danger-soft-foreground"
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          Failed to load RSS feeds
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 pt-14 pb-24">
      {header}

      {/* Search & Filter */}
      <div
        className="z-10 flex flex-wrap gap-2 rounded-[18px] border border-border bg-surface p-2 shadow-[0_10px_24px_-20px_rgba(18,22,19,.5)] md:sticky md:top-20 dark:shadow-none"
        role="search"
        aria-label="News filter options"
      >
        <div className="relative flex min-w-0 flex-[1_1_320px] items-center">
          <Search
            className="pointer-events-none absolute left-4 size-[18px] text-muted"
            aria-hidden="true"
          />
          <input
            aria-label="Search news articles"
            className={`${fieldClass} pr-4 pl-[46px] placeholder:text-muted`}
            id="search-news"
            name="search-news"
            placeholder="Search news…"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative flex min-w-[200px] flex-[0_1_240px] items-center">
          <select
            aria-label="Filter news by category"
            className={`${fieldClass} cursor-pointer appearance-none pr-10 pl-4 font-medium`}
            id="filter-category"
            name="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {RSS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 size-4"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-sm text-muted" aria-live="polite">
          {filteredItems.length} articles found
        </p>
        {isFiltered && (
          <button
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium hover:bg-default"
            type="button"
            onClick={resetFilters}
          >
            <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-field-border px-6 py-16 text-center">
          <span className="font-display text-2xl font-bold">
            {isFiltered
              ? 'No articles match your search.'
              : 'No articles available.'}
          </span>
          {isFiltered && (
            <button
              className="min-h-11 rounded-full bg-foreground px-[18px] font-semibold text-background"
              type="button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* News Grid */}
      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        role="feed"
        aria-label="News articles"
      >
        {filteredItems.map((item, index) => (
          <article
            key={index}
            className="group flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-[22px] transition-colors hover:border-foreground"
            aria-labelledby={`news-title-${index}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold">{item.source}</span>
              {item.category && <CategoryChip category={item.category} />}
            </div>
            <h2
              className="text-lg leading-snug font-semibold"
              id={`news-title-${index}`}
            >
              <a
                className="text-foreground group-hover:underline group-hover:underline-offset-[3px]"
                href={item.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.title}
              </a>
            </h2>
            <p className="line-clamp-3 text-sm text-muted">
              {item.description?.replace(/<[^>]*>/g, '') ??
                'No description available'}
            </p>
            <div className="mt-auto border-t border-separator pt-3 font-mono text-xs text-muted">
              {item.pubDate
                ? new Date(item.pubDate).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Date unavailable'}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
