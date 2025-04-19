'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

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
    <Card className="lg:col-span-8 bg-content1" data-testid="card-feed-content">
      <CardBody className="p-4">
        {!selectedFeed ? (
          <div
            className="text-center p-8 text-default-500"
            data-testid="empty-feed-content"
          >
            <p>Select a feed to view its content</p>
          </div>
        ) : isLoading ? (
          <div
            className="flex justify-center p-8"
            data-testid="loading-feed-content"
          >
            <Spinner
              label={`Loading content for ${selectedFeed.name}...`}
              size="lg"
            />
          </div>
        ) : error ? (
          <div className="text-center p-8" data-testid="error-feed-content">
            <p className="text-danger mb-2" role="alert">
              Error loading feed content. The feed might be unavailable or
              invalid.
            </p>
            <Button
              aria-label={`Retry loading feed: ${selectedFeed.name}`}
              color="primary"
              data-testid="btn-retry-load-feed"
              isLoading={refreshingFeedId === selectedFeed.id}
              variant="flat"
              onPress={() => onRefreshFeed(selectedFeed)}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-4"
            data-testid={`feed-content-${selectedFeed.id}`}
          >
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-bold"
                data-testid={`feed-content-title-${selectedFeed.id}`}
              >
                {selectedFeed.name}
              </h2>
              <Button
                aria-label={`Refresh feed content for ${selectedFeed.name}`}
                color="primary"
                data-testid={`btn-refresh-feed-content-${selectedFeed.id}`}
                isLoading={refreshingFeedId === selectedFeed.id}
                variant="flat"
                onPress={() => onRefreshFeed(selectedFeed)}
              >
                Refresh
              </Button>
            </div>
            <div
              className="flex flex-col gap-4"
              data-testid={`feed-content-items-${selectedFeed.id}`}
            >
              {feedItemsData?.items.map((item, index) => (
                <Card
                  key={item.link || index}
                  className="bg-content2"
                  data-testid={`feed-content-item-${selectedFeed.id}-${index}`}
                >
                  <CardBody className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      <Link
                        aria-label={`Read article: ${item.title}`}
                        className="hover:text-primary"
                        data-testid={`feed-content-item-link-${selectedFeed.id}-${index}`}
                        href={item.link || '#'}
                        target="_blank"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.pubDate && (
                      <p className="text-small text-default-500 mb-2">
                        {formatDate(item.pubDate)}
                      </p>
                    )}
                    {item.snippet && (
                      <p className="text-default-700">
                        {truncateText(cleanHtml(item.snippet), 200)}
                      </p>
                    )}
                  </CardBody>
                </Card>
              ))}
              {feedItemsData?.items.length === 0 && (
                <p
                  className="text-center text-default-500"
                  data-testid={`empty-feed-items-${selectedFeed.id}`}
                >
                  No items found in this feed.
                </p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
