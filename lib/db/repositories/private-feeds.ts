import type { RSSFeed } from '@/types/rss';

import fs from 'fs';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';

// In-memory store for private feeds
const privateFeeds = new Map<string, RSSFeed[]>();

interface SeedData {
  privateNewsFeeds: {
    [userId: string]: RSSFeed[];
  };
}

// Load seed data from JSON file
const loadSeedData = (): SeedData | null => {
  try {
    const filePath = path.resolve(process.cwd(), 'config/data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(fileContent) as SeedData;
  } catch {
    return null;
  }
};

// Seed private feeds from the JSON file
const seedPrivateFeeds = () => {
  const seedData = loadSeedData();

  if (!seedData?.privateNewsFeeds) {
    return;
  }

  Object.entries(seedData.privateNewsFeeds).forEach(([userId, feeds]) => {
    // Ensure each feed has a category
    const feedsWithCategories = feeds.map((feed) => ({
      ...feed,
      category: feed.category || 'Uncategorized',
    }));

    privateFeeds.set(userId, feedsWithCategories);
  });
};

// Initialize seed data
seedPrivateFeeds();

// Repository functions
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
    return false; // Feed not found
  }

  privateFeeds.set(userId, updatedFeeds);

  return true;
};
