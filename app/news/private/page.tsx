'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import { Card, CardBody } from '@heroui/react';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Spinner } from '@heroui/spinner';
import { useSession } from 'next-auth/react';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { subtitle, title } from '@/components/primitives';
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

  const handleAddFeed = async (e: React.FormEvent) => {
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
      // Consider logging the delete error
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
        className="flex justify-center items-center min-h-[calc(100vh-10rem)]"
        data-testid="loading-session-private"
      >
        <Spinner color="primary" label="Loading session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        className="flex flex-col items-center gap-4 py-8 md:py-10 text-center"
        data-testid="section-access-denied-private"
      >
        <h1
          className={title({ color: 'pink' })}
          data-testid="title-access-denied-private"
        >
          Access Denied
        </h1>
        <p className={subtitle()} data-testid="subtitle-access-denied-private">
          You must be signed in to view this page.
        </p>
        <Button
          aria-label="Sign in to view private feeds"
          as={Link}
          color="primary"
          data-testid="btn-signin-redirect-private"
          href="/auth/signin"
          variant="shadow"
        >
          Sign In
        </Button>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        className="flex flex-col items-center gap-4 py-8 md:py-10 text-center"
        data-testid="section-access-denied-private"
      >
        <h1
          className={title({ color: 'pink' })}
          data-testid="title-access-denied-private"
        >
          Access Denied
        </h1>
        <p className={subtitle()} data-testid="subtitle-access-denied-private">
          You must be signed in to view this page.
        </p>
        <Button
          aria-label="Sign in to view private feeds"
          as={Link}
          color="primary"
          data-testid="btn-signin-redirect-private"
          href="/auth/signin"
          variant="shadow"
        >
          Sign In
        </Button>
      </section>
    );
  }

  return (
    <Card className="bg-default-50" data-testid="page-private-news">
      <CardBody className="flex flex-col gap-4 p-6">
        <div className="text-center">
          <h1 className={title()} data-testid="title-private-news">
            Your Private News Feeds
          </h1>
          <p className={subtitle()} data-testid="subtitle-private-news">
            Manage and view your RSS feed subscriptions.
          </p>
        </div>

        {/* Use the extracted AddFeedForm component */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" role="list">
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

          <FeedContent
            error={feedItemsError}
            feedItemsData={feedItemsData}
            isLoading={isLoadingFeedItems}
            refreshingFeedId={refreshingFeed}
            selectedFeed={selectedFeed}
            onRefreshFeed={refreshFeed}
          />
        </div>
      </CardBody>
    </Card>
  );
}
