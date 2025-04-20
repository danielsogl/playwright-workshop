import type { RSSFeed } from '@/types/rss';
import { v4 as uuidv4 } from 'uuid';

import { loadSeedData } from '../services/data-service';

const privateFeeds = new Map<string, RSSFeed[]>();

const seedPrivateFeeds = () => {
  const seedData = loadSeedData();

  if (!seedData?.privateNewsFeeds) {
    return;
  }

  Object.entries(seedData.privateNewsFeeds).forEach(([userId, feeds]) => {
    const feedsWithCategories = feeds.map((feed) => ({
      ...feed,
      category: feed.category || 'Uncategorized',
    }));

    privateFeeds.set(userId, feedsWithCategories);
  });
};

seedPrivateFeeds();

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
    id: uuidv4(),
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
