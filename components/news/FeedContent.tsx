'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import React from 'react';
import { Card, Spinner, Button, Link, Chip } from '@heroui/react';
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
    <Card
      className="lg:col-span-8 border border-border"
      role="region"
      aria-label="Feed content"
    >
      <Card.Content className="p-5">
        {!selectedFeed ? (
          <div className="text-center py-12">
            <Rss className="w-12 h-12 mx-auto mb-3 text-muted" aria-hidden="true" />
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
          <div className="text-center py-12">
            <p className="text-danger mb-4" role="alert">
              Error loading feed content. The feed might be unavailable or
              invalid.
            </p>
            <Button
              aria-label={`Retry loading feed: ${selectedFeed.name}`}
              variant="primary"
              isPending={refreshingFeedId === selectedFeed.id}
              onPress={() => onRefreshFeed(selectedFeed)}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-4"
            aria-label={`Content for ${selectedFeed.name}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{selectedFeed.name}</h2>
                {feedItemsData?.items && (
                  <Chip variant="soft" size="sm">
                    {feedItemsData.items.length} articles
                  </Chip>
                )}
              </div>
              <Button
                aria-label={`Refresh feed content for ${selectedFeed.name}`}
                variant="primary"
                isPending={refreshingFeedId === selectedFeed.id}
                onPress={() => onRefreshFeed(selectedFeed)}
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Refresh
              </Button>
            </div>
            <div
              className="flex flex-col gap-4"
              role="list"
              aria-label={`Articles from ${selectedFeed.name}`}
            >
              {feedItemsData?.items.map((item, index) => (
                <Card
                  key={item.link || index}
                  className="border border-border hover:border-border transition-colors"
                  role="listitem"
                  aria-labelledby={`feed-item-title-${selectedFeed.id}-${index}`}
                >
                  <Card.Content className="p-4">
                    <h3
                      className="text-lg font-semibold mb-2"
                      id={`feed-item-title-${selectedFeed.id}-${index}`}
                    >
                      <Link
                        className="hover:text-accent"
                        href={item.link || '#'}
                        target="_blank"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.pubDate && (
                      <p className="text-small text-muted mb-2">
                        {formatDate(item.pubDate)}
                      </p>
                    )}
                    {item.snippet && (
                      <p className="text-foreground text-sm">
                        {truncateText(cleanHtml(item.snippet), 200)}
                      </p>
                    )}
                  </Card.Content>
                </Card>
              ))}
              {feedItemsData?.items.length === 0 && (
                <div className="text-center py-8">
                  <Rss className="w-10 h-10 mx-auto mb-3 text-muted" aria-hidden="true" />
                  <p className="text-muted text-sm">
                    No items found in this feed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
