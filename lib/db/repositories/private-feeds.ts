import type { RSSFeed } from '@/types/rss';

import data from '@/config/data.json';

const privateFeeds = new Map<string, RSSFeed[]>(
  Object.entries(data.privateNewsFeeds),
);

export const getPrivateFeedsByUserId = async (
  userId: string,
): Promise<RSSFeed[]> => {
  return privateFeeds.get(userId) || [];
};

export const addPrivateFeed = async (
  userId: string,
  feed: Omit<RSSFeed, 'id'>,
): Promise<RSSFeed> => {
  const userFeeds = await getPrivateFeedsByUserId(userId);
  const newFeed: RSSFeed = {
    ...feed,
    id: crypto.randomUUID(),
    category: feed.category || 'Uncategorized',
  };

  privateFeeds.set(userId, [...userFeeds, newFeed]);

  return newFeed;
};

export const deletePrivateFeed = async (
  userId: string,
  feedId: string,
): Promise<boolean> => {
  const userFeeds = await getPrivateFeedsByUserId(userId);
  const updatedFeeds = userFeeds.filter((feed) => feed.id !== feedId);

  if (updatedFeeds.length === userFeeds.length) {
    return false;
  }

  privateFeeds.set(userId, updatedFeeds);

  return true;
};
