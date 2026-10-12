'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import { Spinner } from '@heroui/react';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';

import { AccessDenied } from '@/components/access-denied';
import { PageHeader } from '@/components/page-header';
import { fetcher } from '@/lib/utils/fetchers';
import { AddFeedForm } from '@/components/news/AddFeedForm';
import { FeedList } from '@/components/news/FeedList';
import { FeedContent } from '@/components/news/FeedContent';

interface RssApiResponse {
  items: RSSItem[];
}

export default function PrivateNewsPage() {
  const { status } = useSession();
  const isLoadingSession = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const {
    data: userFeeds,
    error: feedsError,
    isLoading: feedsLoading,
  } = useSWR<RSSFeed[]>('/api/news/private', fetcher);

  const [selectedFeed, setSelectedFeed] = useState<RSSFeed | null>(null);

  const {
    data: feedItemsData,
    error: feedItemsError,
    isLoading: isLoadingFeedItems,
  } = useSWR<RssApiResponse>(
    selectedFeed
      ? `/api/rss?feedUrl=${encodeURIComponent(selectedFeed.url)}`
      : null,
    fetcher,
    { shouldRetryOnError: false },
  );

  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedCategory, setNewFeedCategory] = useState('');
  const [addingFeed, setAddingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [deletingFeedId, setDeletingFeedId] = useState<string | null>(null);

  const [refreshingFeed, setRefreshingFeed] = useState<string | null>(null);
  const refreshFeed = async (feed: RSSFeed) => {
    setRefreshingFeed(feed.id);
    try {
      await mutate(`/api/rss?feedUrl=${encodeURIComponent(feed.url)}`);
    } finally {
      setRefreshingFeed(null);
    }
  };

  const handleAddFeed = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newFeedName || !newFeedUrl) {
      setFeedError('Both name and URL are required.');

      return;
    }
    setAddingFeed(true);
    setFeedError(null);

    try {
      const res = await fetch('/api/news/private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFeedName,
          url: newFeedUrl,
          category: newFeedCategory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || 'Failed to add feed');
      }

      setNewFeedName('');
      setNewFeedUrl('');
      setNewFeedCategory('');
      mutate('/api/news/private');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFeedError(error.message || 'An unexpected error occurred.');
      } else {
        setFeedError('An unexpected error occurred.');
      }
    } finally {
      setAddingFeed(false);
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    if (deletingFeedId) return;
    setDeletingFeedId(feedId);

    try {
      const res = await fetch(`/api/news/private?feedId=${feedId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || 'Failed to delete feed');
      }

      if (selectedFeed?.id === feedId) {
        setSelectedFeed(null);
      }
      mutate('/api/news/private');
    } catch (error) {
      console.error('Failed to delete feed:', error);
    } finally {
      setDeletingFeedId(null);
    }
  };

  const handleSelectFeed = (feed: RSSFeed) => {
    setSelectedFeed(feed);
  };

  if (isLoadingSession) {
    return (
      <div
        className="flex flex-col justify-center items-center gap-2 min-h-[calc(100vh-10rem)]"
        role="status"
        aria-label="Loading session"
      >
        <Spinner color="accent" size="lg" />
        <span className="text-muted">Loading session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AccessDenied
        linkId="btn-signin-private"
        linkLabel="Sign in to view private feeds"
      />
    );
  }

  return (
    <div className="flex flex-col gap-9 pt-14 pb-24">
      <PageHeader
        id="private-news-title"
        label="02 · API Integration · protected route"
        title="Your Private News Feeds"
        subtitle="Manage and view your RSS feed subscriptions."
      />

      {/* Feed List & Add Form | Content */}
      <div className="flex flex-wrap items-start gap-6" id="feeds-container">
        <aside className="flex max-w-full flex-[1_1_320px] flex-col gap-4">
          <FeedList
            deletingFeedId={deletingFeedId}
            error={feedsError}
            feeds={userFeeds}
            isLoading={feedsLoading}
            refreshingFeed={refreshingFeed}
            selectedFeed={selectedFeed}
            onDeleteFeed={handleDeleteFeed}
            onRefreshFeed={refreshFeed}
            onSelectFeed={handleSelectFeed}
          />
          <AddFeedForm
            addingFeed={addingFeed}
            feedError={feedError}
            handleAddFeed={handleAddFeed}
            newFeedCategory={newFeedCategory}
            newFeedName={newFeedName}
            newFeedUrl={newFeedUrl}
            setNewFeedCategory={setNewFeedCategory}
            setNewFeedName={setNewFeedName}
            setNewFeedUrl={setNewFeedUrl}
          />
        </aside>

        <div className="min-w-0 flex-[999_1_560px]">
          <FeedContent
            error={feedItemsError}
            feedItemsData={feedItemsData}
            isLoading={isLoadingFeedItems}
            refreshingFeedId={refreshingFeed}
            selectedFeed={selectedFeed}
            onRefreshFeed={refreshFeed}
          />
        </div>
      </div>
    </div>
  );
}
