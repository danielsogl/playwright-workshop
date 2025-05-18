import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { RSS_SOURCES } from '@/config/rss-sources';
import Parser from 'rss-parser';

// The path to the feed.json file
const feedJsonPath = path.join(process.cwd(), 'app/api/feed.json');

const parser = new Parser();

export async function GET() {
  const offlineMode = String(process.env.RSS_OFFLINE_MODE).toLowerCase() === 'true';

  if (offlineMode) {
    try {
      // Read the feed.json file
      const feedJson = await fs.readFile(feedJsonPath, 'utf-8');
      const feed = JSON.parse(feedJson);
      return NextResponse.json(feed);
    } catch (error) {
      console.error('Failed to fetch feed data:', error);
      return NextResponse.json(
        { message: 'Failed to fetch feed data' },
        { status: 500 },
      );
    }
  } else {
    try {
      // Fetch and parse all RSS feeds in parallel
      const allItems = (
        await Promise.all(
          RSS_SOURCES.map(async (source) => {
            try {
              const feed = await parser.parseURL(source.url);
              return (feed.items || []).map((item) => ({
                title: item.title || '',
                link: item.link,
                description: item.contentSnippet || item.content || item.description || '',
                pubDate: item.pubDate,
                category: source.category,
                source: source.name,
                snippet: item.contentSnippet,
                isoDate: item.isoDate,
              }));
            } catch (err) {
              // If a single feed fails, log and skip it
              console.error(`Failed to fetch/parse feed: ${source.url}`, err);
              return [];
            }
          })
        )
      ).flat();

      // Sort items by pubDate descending
      allItems.sort((a, b) => {
        const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return dateB - dateA;
      });

      // Return in the same format as feed.json
      return NextResponse.json({ items: allItems });
    } catch (error) {
      console.error('Failed to fetch live RSS feeds:', error);
      return NextResponse.json(
        { message: 'Failed to fetch live RSS feeds' },
        { status: 500 },
      );
    }
  }
}
