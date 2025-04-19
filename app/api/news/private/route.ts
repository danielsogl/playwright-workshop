import { NextRequest } from 'next/server';
import { z } from 'zod';
import type { Session } from 'next-auth';

import { withAuth } from '@/lib/api/middleware/withAuth';
import {
  jsonSuccess,
  jsonError,
  jsonValidationError,
  jsonNotFound,
} from '@/lib/utils/api';
import {
  getPrivateFeedsByUserId,
  addPrivateFeed,
  deletePrivateFeed,
} from '@/lib/db/repositories/private-feeds';

const addFeedSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  category: z.string().optional(),
});

const getHandler = async (_req: NextRequest, session: Session) => {
  try {
    const feeds = await getPrivateFeedsByUserId(session.user.id);

    return jsonSuccess(feeds);
  } catch (error) {
    console.error('Failed to fetch private feeds:', error);

    return jsonError('Failed to fetch private feeds');
  }
};

const postHandler = async (req: NextRequest, session: Session) => {
  try {
    const body = await req.json();
    const validationResult = addFeedSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonValidationError(validationResult.error);
    }

    const { name, url, category } = validationResult.data;

    const feedData = {
      name,
      url,
      category: category || 'Uncategorized',
    };

    const newFeed = await addPrivateFeed(session.user.id, feedData);

    return jsonSuccess(newFeed, 201);
  } catch (error) {
    console.error('Failed to add private feed:', error);
    if (error instanceof z.ZodError) {
      return jsonValidationError(error);
    }

    return jsonError('Failed to add private feed');
  }
};

const deleteHandler = async (req: NextRequest, session: Session) => {
  const { searchParams } = new URL(req.url);
  const feedId = searchParams.get('feedId');

  if (!feedId) {
    return jsonError('Feed ID is required', 400);
  }

  try {
    const success = await deletePrivateFeed(session.user.id, feedId);

    if (!success) {
      return jsonNotFound('Feed');
    }

    return jsonSuccess({ success: true });
  } catch (error) {
    console.error('Failed to delete private feed:', error);

    return jsonError('Failed to delete private feed');
  }
};

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
export const DELETE = withAuth(deleteHandler);
