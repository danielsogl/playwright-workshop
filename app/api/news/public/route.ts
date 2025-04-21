import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_SOURCES } from '@/config/rss-sources';
import type { RSSItem } from '@/types/rss';

const parser = new Parser();

async function fetchRSSFeed(source: typeof RSS_SOURCES[0]): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      description: item.contentSnippet || item.content || '',
      pubDate: item.pubDate || item.isoDate || '',
      category: source.category,
      source: source.name
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${source.name}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const feedPromises = RSS_SOURCES.map(source => fetchRSSFeed(source));
    const feedsArrays = await Promise.all(feedPromises);
    const feeds = feedsArrays.flat().sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ items: feeds });
  } catch (error) {
    console.error('Failed to fetch public feeds:', error);
    return NextResponse.json(
      { message: 'Failed to fetch public feeds' },
      { status: 500 },
    );
  }
} 