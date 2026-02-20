'use client';

import type { RSSFeed } from '@/types/rss';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { RefreshCw, Rss } from 'lucide-react';

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
      className="lg:col-span-4 border border-default-200"
      role="list"
      aria-label="Your RSS feeds"
    >
      <CardBody className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Rss className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold" id="feed-list-heading">
            Your Feeds
          </h2>
          {feeds && (
            <Chip variant="flat" size="sm">
              {feeds.length}
            </Chip>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center p-4" aria-label="Loading feeds">
            <Spinner label="Loading your feeds…" size="sm" />
          </div>
        ) : error ? (
          <p className="text-danger text-center p-4" role="alert">
            Error loading feeds. Please try again.
          </p>
        ) : !feeds?.length ? (
          <div className="text-center py-8">
            <Rss className="w-10 h-10 mx-auto mb-3 text-default-300" aria-hidden="true" />
            <p
              className="text-default-500 text-sm"
              aria-label="No feeds available"
            >
              No feeds added yet. Add your first feed above!
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-2"
            role="list"
            aria-labelledby="feed-list-heading"
          >
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`rounded-xl border-2 transition-colors ${
                  selectedFeed?.id === feed.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:border-default-200'
                }`}
                role="listitem"
              >
                <div className="p-3">
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
                        <Chip
                          className="mt-1"
                          variant="flat"
                          size="sm"
                          color="secondary"
                        >
                          {feed.category}
                        </Chip>
                      )}
                    </button>
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        aria-label={`Refresh feed: ${feed.name}`}
                        isLoading={refreshingFeed === feed.id}
                        size="sm"
                        variant="light"
                        onPress={() => onRefreshFeed(feed)}
                        id={`refresh-feed-${feed.id}`}
                      >
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
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
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
