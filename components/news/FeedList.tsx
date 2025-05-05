'use client';

import type { RSSFeed } from '@/types/rss';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';

import { TrashIcon } from '@/components/icons';

interface FeedListProps {
  feeds: RSSFeed[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
  selectedFeed: RSSFeed | null;
  deletingFeedId: string | null;
  refreshingFeed: string | null;
  onSelectFeed: (feed: RSSFeed) => void;
  onDeleteFeed: (feedId: string) => Promise<void>;
  onRefreshFeed: (feed: RSSFeed) => Promise<void>;
}

export const FeedList: React.FC<FeedListProps> = ({
  feeds,
  isLoading,
  error,
  selectedFeed,
  deletingFeedId,
  refreshingFeed,
  onSelectFeed,
  onDeleteFeed,
  onRefreshFeed,
}) => {
  return (
    <Card
      className="lg:col-span-4 bg-content1"
      role="list"
      aria-label="Your RSS feeds"
    >
      <CardBody className="p-4">
        <h2 className="text-xl font-bold mb-4" id="feed-list-heading">
          Your Feeds
        </h2>
        {isLoading ? (
          <div className="flex justify-center p-4" aria-label="Loading feeds">
            <Spinner label="Loading your feeds..." size="sm" />
          </div>
        ) : error ? (
          <p className="text-danger text-center p-4" role="alert">
            Error loading feeds. Please try again.
          </p>
        ) : !feeds?.length ? (
          <p
            className="text-center text-default-500 p-4"
            aria-label="No feeds available"
          >
            No feeds added yet. Add your first feed above!
          </p>
        ) : (
          <div
            className="flex flex-col gap-2"
            role="list"
            aria-labelledby="feed-list-heading"
          >
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`rounded-lg border-2 ${
                  selectedFeed?.id === feed.id
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
                role="listitem"
              >
                <Card>
                  <CardBody className="p-3">
                    <div className="flex justify-between items-center">
                      <button
                        aria-label={`Select feed: ${feed.name}`}
                        className="flex-1 text-left"
                        onClick={() => onSelectFeed(feed)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectFeed(feed);
                          }
                        }}
                        role="button"
                        id={`select-feed-${feed.id}`}
                      >
                        <p className="font-semibold">{feed.name}</p>
                        {feed.category && (
                          <p
                            className="text-small text-default-500"
                            aria-label={`Category: ${feed.category}`}
                          >
                            {feed.category}
                          </p>
                        )}
                      </button>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          aria-label={`Refresh feed: ${feed.name}`}
                          isLoading={refreshingFeed === feed.id}
                          size="sm"
                          variant="light"
                          onPress={() => onRefreshFeed(feed)}
                          id={`refresh-feed-${feed.id}`}
                        >
                          🔄
                        </Button>
                        <Button
                          isIconOnly
                          aria-label={`Delete feed: ${feed.name}`}
                          color="danger"
                          isLoading={deletingFeedId === feed.id}
                          size="sm"
                          variant="light"
                          onPress={() => onDeleteFeed(feed.id)}
                          id={`delete-feed-${feed.id}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
