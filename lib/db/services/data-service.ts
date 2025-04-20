import fs from 'fs';
import path from 'path';
import type { RSSFeed } from '@/types/rss';

export interface SeedData {
  users: Array<{
    id: string;
    email: string;
    name?: string | null;
    password: string;
  }>;
  publicNews: Array<{
    id: string;
    title: string;
    link: string;
    pubDate?: string;
    snippet?: string;
    source?: string;
  }>;
  privateNewsFeeds: {
    [userId: string]: RSSFeed[];
  };
}

let cachedSeedData: SeedData | null = null;

/**
 * Loads and caches seed data from the config/data.json file.
 * Reads the file only once and caches the result for subsequent calls.
 *
 * @returns The parsed seed data object, or null if the file cannot be read or parsed.
 */
export const loadSeedData = (): SeedData | null => {
  // Return cached data if available
  if (cachedSeedData) {
    return cachedSeedData;
  }

  try {
    const filePath = path.resolve(process.cwd(), 'config/data.json');
    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
      console.error(`Error: Seed data file not found at ${filePath}`);

      return null;
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    // Parse the file content
    const data = JSON.parse(fileContent) as SeedData;

    // Basic validation to ensure core structures exist
    if (!data || !data.users || !data.privateNewsFeeds) {
      console.error(
        'Error: Seed data file is missing required sections (users, privateNewsFeeds).',
      );

      return null;
    }

    // Cache the loaded data
    cachedSeedData = data;

    return cachedSeedData;
  } catch (error) {
    console.error('Error loading or parsing seed data file:', error);

    return null; // Return null on any error during file read/parse
  }
};
