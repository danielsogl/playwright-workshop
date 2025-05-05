import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// The path to the feed.json file
const feedJsonPath = path.join(process.cwd(), 'app/api/feed.json');

export async function GET() {
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
} 