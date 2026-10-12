'use client';

import type { RSSFeed } from '@/types/rss';

import React from 'react';
import { Spinner, Button } from '@heroui/react';
import { RefreshCw, Rss, Trash2 } from 'lucide-react';

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
    <section
      className="rounded-2xl border border-border bg-surface p-2"
      aria-labelledby="feed-list-heading"
    >
      <div>
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <h2 className="text-[15px] font-semibold" id="feed-list-heading">
            Your Feeds
          </h2>
          {feeds && (
            <span className="font-mono text-[13px] text-muted">
              {feeds.length}
            </span>
          )}
        </div>
        {isLoading ? (
          <div
            className="flex flex-col items-center gap-2 justify-center p-4"
            aria-label="Loading feeds"
          >
            <Spinner size="sm" />
            <span className="text-muted text-sm">Loading your feeds…</span>
          </div>
        ) : error ? (
          <p className="p-4 text-center text-danger" role="alert">
            Error loading feeds. Please try again.
          </p>
        ) : !feeds?.length ? (
          <div className="m-1 rounded-xl border border-dashed border-field-border px-5 py-8 text-center">
            <Rss
              className="mx-auto mb-3 size-6 text-muted"
              aria-hidden="true"
            />
            <p className="text-muted text-sm" aria-label="No feeds available">
              No feeds added yet. Add your first feed above!
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-0.5"
            role="list"
            aria-label="Your RSS feeds"
          >
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`group rounded-[10px] transition-colors ${
                  selectedFeed?.id === feed.id
                    ? 'is-selected bg-foreground text-background'
                    : 'hover:bg-background'
                }`}
                role="listitem"
              >
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      aria-label={`Select feed: ${feed.name}`}
                      aria-pressed={selectedFeed?.id === feed.id}
                      className="min-h-11 min-w-0 flex-1 cursor-pointer text-left"
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
                      <span className="block truncate text-[15px] font-semibold">
                        {feed.name}
                      </span>
                      {feed.category && (
                        <span className="block text-xs opacity-75">
                          {feed.category}
                        </span>
                      )}
                    </button>
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        aria-label={`Refresh feed: ${feed.name}`}
                        isPending={refreshingFeed === feed.id}
                        className="rounded-full"
                        size="sm"
                        variant="ghost"
                        onPress={() => onRefreshFeed(feed)}
                        id={`refresh-feed-${feed.id}`}
                      >
                        <RefreshCw
                          className="size-4 group-[.is-selected]:text-background"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        isIconOnly
                        aria-label={`Delete feed: ${feed.name}`}
                        className="rounded-full"
                        variant="ghost"
                        isPending={deletingFeedId === feed.id}
                        size="sm"
                        onPress={() => onDeleteFeed(feed.id)}
                        id={`delete-feed-${feed.id}`}
                      >
                        <Trash2
                          className="size-4 text-danger group-[.is-selected]:text-[#ff9b6a] dark:group-[.is-selected]:text-[#9a3412]"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
