'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import React from 'react';
import { Spinner, Button, Link } from '@heroui/react';
import { Rss, RefreshCw } from 'lucide-react';

import { cleanHtml, formatDate, truncateText } from '@/lib/utils/format';

interface RssApiResponse {
  items: RSSItem[];
}

interface FeedContentProps {
  selectedFeed: RSSFeed | null;
  feedItemsData: RssApiResponse | undefined;
  isLoading: boolean;
  error: Error | undefined;
  refreshingFeedId: string | null;
  onRefreshFeed: (feed: RSSFeed) => Promise<void>;
}

export const FeedContent: React.FC<FeedContentProps> = ({
  selectedFeed,
  feedItemsData,
  isLoading,
  error,
  refreshingFeedId,
  onRefreshFeed,
}) => {
  return (
    <section
      className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface"
      role="region"
      aria-label="Feed content"
    >
      <div>
        {!selectedFeed ? (
          <div className="m-5 rounded-xl border border-dashed border-field-border px-5 py-16 text-center">
            <Rss
              className="mx-auto mb-3 size-6 text-muted"
              aria-hidden="true"
            />
            <p className="text-muted">Select a feed to view its content</p>
          </div>
        ) : isLoading ? (
          <div
            className="flex flex-col items-center gap-2 justify-center py-12"
            aria-label="Loading feed content"
          >
            <Spinner size="lg" />
            <span className="text-muted">{`Loading content for ${selectedFeed.name}…`}</span>
          </div>
        ) : error ? (
          <div className="m-5 rounded-2xl bg-danger-soft p-6 text-danger-soft-foreground">
            <p className="mb-4 font-semibold" role="alert">
              Error loading feed content. The feed might be unavailable or
              invalid.
            </p>
            <Button
              aria-label={`Retry loading feed: ${selectedFeed.name}`}
              className="rounded-full"
              variant="outline"
              isPending={refreshingFeedId === selectedFeed.id}
              onPress={() => onRefreshFeed(selectedFeed)}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col"
            aria-label={`Content for ${selectedFeed.name}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-7 py-5">
              <div className="flex min-w-0 flex-col">
                <h2 className="font-display text-[26px] font-bold tracking-[-0.01em]">
                  {selectedFeed.name}
                </h2>
                <span className="truncate font-mono text-[13px] text-muted">
                  {selectedFeed.url}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {feedItemsData?.items && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[13px] font-medium text-success-soft-foreground">
                    <span
                      className="size-1.5 rounded-full bg-success"
                      aria-hidden="true"
                    />
                    {feedItemsData.items.length} articles
                  </span>
                )}
                <Button
                  aria-label={`Refresh feed content for ${selectedFeed.name}`}
                  className="rounded-full"
                  variant="outline"
                  isPending={refreshingFeedId === selectedFeed.id}
                  onPress={() => onRefreshFeed(selectedFeed)}
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Refresh
                </Button>
              </div>
            </div>
            <div
              className="flex flex-col"
              role="feed"
              aria-label={`Articles from ${selectedFeed.name}`}
            >
              {feedItemsData?.items.map((item, index) => (
                <article
                  key={item.link || index}
                  className="flex gap-5 border-b border-separator px-7 py-5 last:border-b-0"
                  aria-labelledby={`feed-item-title-${selectedFeed.id}-${index}`}
                >
                  <span
                    className="pt-0.5 font-mono text-[13px] text-muted"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3
                      className="text-[17px] leading-snug font-semibold"
                      id={`feed-item-title-${selectedFeed.id}-${index}`}
                    >
                      <Link
                        className="text-foreground hover:underline hover:underline-offset-[3px]"
                        href={item.link || '#'}
                        target="_blank"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.pubDate && (
                      <p className="font-mono text-xs text-muted">
                        {formatDate(item.pubDate)}
                      </p>
                    )}
                    {item.snippet && (
                      <p className="text-sm text-muted">
                        {truncateText(cleanHtml(item.snippet), 200)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
              {feedItemsData?.items.length === 0 && (
                <div className="m-5 rounded-xl border border-dashed border-field-border px-5 py-8 text-center">
                  <Rss
                    className="mx-auto mb-3 size-6 text-muted"
                    aria-hidden="true"
                  />
                  <p className="text-muted text-sm">
                    No items found in this feed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
