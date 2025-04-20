'use client';

import type { RSSItem, RSSFeed } from '@/types/rss';

import { Card, CardBody } from '@heroui/react';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Spinner } from '@heroui/spinner';
import { useSession } from 'next-auth/react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';

import { subtitle, title } from '@/components/primitives';
import { TrashIcon } from '@/components/icons';

// Define fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    let errorMessage = 'Failed to fetch feeds';

    try {
      // Try to get a more specific message from the API response
      const errorData = await res.json();

      errorMessage = errorData.message || errorMessage;
    } catch {
      /* Ignore json parsing error */
    }
    // Throw a standard error with a descriptive message including status
    throw new Error(`Fetch error (${res.status}): ${errorMessage}`);
  }

  return res.json();
};

// Function to safely clean HTML from text
const cleanHtml = (text?: string) => {
  if (!text) return '';

  return text.replace(/<[^>]*>/g, '');
};

// Function to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

// Function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

// Define types for RSS feed items (adjust based on API response)
interface RssApiResponse {
  items: RSSItem[];
}

export default function PrivateNewsPage() {
  const { status } = useSession(); // Removed unused 'session'
  const isLoadingSession = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Fetch user's saved feeds
  const {
    data: userFeeds,
    error: feedsError,
    isLoading: feedsLoading,
  } = useSWR<RSSFeed[]>('/api/news/private', fetcher);

  // State for the currently selected feed
  const [selectedFeed, setSelectedFeed] = useState<RSSFeed | null>(null);

  // Fetch items for the selected feed
  const {
    data: feedItemsData,
    error: feedItemsError,
    isLoading: isLoadingFeedItems,
  } = useSWR<RssApiResponse>(
    selectedFeed
      ? `/api/rss?feedUrl=${encodeURIComponent(selectedFeed.url)}`
      : null,
    fetcher,
    { shouldRetryOnError: false }, // Prevent retrying on bad feed URLs
  );

  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedCategory, setNewFeedCategory] = useState('');
  const [addingFeed, setAddingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [deletingFeedId, setDeletingFeedId] = useState<string | null>(null);

  // Add refresh functionality
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

      // Clear form and refresh data
      setNewFeedName('');
      setNewFeedUrl('');
      setNewFeedCategory('');
      mutate('/api/news/private'); // Revalidate SWR cache
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
    if (deletingFeedId) return; // Prevent multiple deletes
    setDeletingFeedId(feedId);

    try {
      const res = await fetch(`/api/news/private?feedId=${feedId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || 'Failed to delete feed');
      }

      // If deleting the selected feed, clear selection
      if (selectedFeed?.id === feedId) {
        setSelectedFeed(null);
      }
      mutate('/api/news/private'); // Revalidate SWR cache
    } catch {
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

  // Authenticated view - Using a two-column layout
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

        {/* Add New Feed Form */}
        <Card className="bg-content1 shadow-medium" data-testid="card-add-feed">
          <CardBody>
            <form
              aria-label="Add new RSS feed form"
              className="flex flex-col md:flex-row gap-4 items-end"
              data-testid="form-add-feed"
              onSubmit={handleAddFeed}
            >
              <Input
                aria-label="Name for the new feed"
                className="flex-grow"
                data-testid="input-feed-name"
                disabled={addingFeed}
                label="Feed Name"
                labelPlacement="outside"
                placeholder="e.g., TechCrunch"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">📰</span>
                  </div>
                }
                value={newFeedName}
                variant="bordered"
                onValueChange={setNewFeedName}
              />
              <Input
                aria-label="URL for the new feed"
                className="flex-grow"
                data-testid="input-feed-url"
                disabled={addingFeed}
                label="Feed URL"
                labelPlacement="outside"
                placeholder="https://example.com/feed.xml"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">🔗</span>
                  </div>
                }
                type="url"
                value={newFeedUrl}
                variant="bordered"
                onValueChange={setNewFeedUrl}
              />
              <Input
                aria-label="Optional category for the new feed"
                className="flex-grow"
                data-testid="input-feed-category"
                disabled={addingFeed}
                label="Category (optional)"
                labelPlacement="outside"
                placeholder="e.g., Tech"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">📁</span>
                  </div>
                }
                value={newFeedCategory}
                variant="bordered"
                onValueChange={setNewFeedCategory}
              />
              <Button
                aria-label={addingFeed ? 'Adding new feed' : 'Add new feed'}
                className="min-w-[120px]"
                color="primary"
                data-testid="btn-add-feed"
                isLoading={addingFeed}
                type="submit"
              >
                Add Feed
              </Button>
            </form>
            {feedError && (
              <p
                className="text-danger mt-2 text-small"
                data-testid="error-add-feed"
                role="alert"
              >
                {feedError}
              </p>
            )}
          </CardBody>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Feed List */}
          <Card
            className="lg:col-span-4 bg-content1"
            data-testid="card-feed-list"
          >
            <CardBody className="p-4">
              <h2 className="text-xl font-bold mb-4">Your Feeds</h2>
              {feedsLoading ? (
                <div
                  className="flex justify-center p-4"
                  data-testid="loading-feed-list"
                >
                  <Spinner label="Loading your feeds..." size="sm" />
                </div>
              ) : feedsError ? (
                <p
                  className="text-danger text-center p-4"
                  data-testid="error-feed-list"
                  role="alert"
                >
                  Error loading feeds. Please try again.
                </p>
              ) : !userFeeds?.length ? (
                <p
                  className="text-center text-default-500 p-4"
                  data-testid="empty-feed-list"
                >
                  No feeds added yet. Add your first feed above!
                </p>
              ) : (
                <div className="flex flex-col gap-2" data-testid="feed-list">
                  {userFeeds.map((feed) => (
                    <div
                      key={feed.id}
                      className={`rounded-lg border-2 ${
                        selectedFeed?.id === feed.id
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      data-testid={`feed-list-item-container-${feed.id}`}
                    >
                      <Card>
                        <CardBody className="p-3">
                          <div className="flex justify-between items-center">
                            <button
                              aria-label={`Select feed: ${feed.name}`}
                              className="flex-1 text-left"
                              data-testid={`feed-item-select-${feed.id}`}
                              onClick={() => handleSelectFeed(feed)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSelectFeed(feed);
                                }
                              }}
                            >
                              <p className="font-semibold">{feed.name}</p>
                              {feed.category && (
                                <p className="text-small text-default-500">
                                  {feed.category}
                                </p>
                              )}
                            </button>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                aria-label={`Refresh feed: ${feed.name}`}
                                data-testid={`feed-item-refresh-${feed.id}`}
                                isLoading={refreshingFeed === feed.id}
                                size="sm"
                                variant="light"
                                onPress={() => refreshFeed(feed)}
                              >
                                🔄
                              </Button>
                              <Button
                                isIconOnly
                                aria-label={`Delete feed: ${feed.name}`}
                                color="danger"
                                data-testid={`feed-item-delete-${feed.id}`}
                                isLoading={deletingFeedId === feed.id}
                                size="sm"
                                variant="light"
                                onPress={() => handleDeleteFeed(feed.id)}
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

          {/* Feed Content */}
          <Card
            className="lg:col-span-8 bg-content1"
            data-testid="card-feed-content"
          >
            <CardBody className="p-4">
              {!selectedFeed ? (
                <div
                  className="text-center p-8 text-default-500"
                  data-testid="empty-feed-content"
                >
                  <p>Select a feed to view its content</p>
                </div>
              ) : isLoadingFeedItems ? (
                <div
                  className="flex justify-center p-8"
                  data-testid="loading-feed-content"
                >
                  <Spinner
                    label={`Loading content for ${selectedFeed.name}...`}
                    size="lg"
                  />
                </div>
              ) : feedItemsError ? (
                <div
                  className="text-center p-8"
                  data-testid="error-feed-content"
                >
                  <p className="text-danger mb-2" role="alert">
                    Error loading feed content. The feed might be unavailable or
                    invalid.
                  </p>
                  <Button
                    aria-label={`Retry loading feed: ${selectedFeed.name}`}
                    color="primary"
                    data-testid="btn-retry-load-feed"
                    isLoading={refreshingFeed === selectedFeed.id}
                    variant="flat"
                    onPress={() => refreshFeed(selectedFeed)}
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
                      isLoading={refreshingFeed === selectedFeed.id}
                      variant="flat"
                      onPress={() => refreshFeed(selectedFeed)}
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
        </div>
      </CardBody>
    </Card>
  );
}
