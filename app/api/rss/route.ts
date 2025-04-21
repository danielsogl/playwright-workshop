import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Parser from 'rss-parser';
import { z } from 'zod';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

const parser = new Parser();

// Define validation schema for query parameters
const RssQuerySchema = z.object({
  feedUrl: z.string().url('Invalid URL format'),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());

  // Validate query parameters
  const validationResult = RssQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid input',
        errors: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { feedUrl } = validationResult.data;

  try {
    const feed = await parser.parseURL(feedUrl);

    // Return only essential items to keep payload small, or adjust as needed
    const items = feed.items
      .map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
        snippet: item.contentSnippet?.substring(0, 200), // Limit snippet length
      }))
      .slice(0, 20); // Limit number of items returned
    return NextResponse.json({ items });
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch or parse RSS feed.';
    let statusCode = 500;

    if (error instanceof Error && error.message.includes('Status code')) {
      // Try to extract status code if available (e.g., 404, 403)
      const match = error.message.match(/Status code (\d+)/);

      if (match && match[1]) {
        const httpStatus = parseInt(match[1], 10);

        if (httpStatus >= 400 && httpStatus < 500) {
          statusCode = httpStatus;
          errorMessage = `Failed to fetch RSS feed (Status: ${httpStatus}). Check the URL.`;
        } else {
          statusCode = 502; // Bad Gateway - upstream error
          errorMessage = `Error fetching RSS feed from the source (Status: ${httpStatus}).`;
        }
      }
    } else if (
      error instanceof Error &&
      error.message.includes('Invalid XML')
    ) {
      statusCode = 400;
      errorMessage =
        'The provided URL does not point to a valid RSS/Atom feed.';
    }
    return NextResponse.json(
      {
        message: errorMessage,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: statusCode },
    );
  }
}
