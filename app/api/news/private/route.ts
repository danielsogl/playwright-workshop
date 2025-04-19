import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getPrivateFeedsByUserId,
  addPrivateFeed,
  deletePrivateFeed,
} from "@/lib/db/repositories/private-feeds";

const addFeedSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  category: z.string().optional(), // Added optional category
});

/**
 * API handler to get private RSS feeds for the authenticated user.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const feeds = await getPrivateFeedsByUserId(session.user.id);

    return NextResponse.json(feeds);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch private feeds" },
      { status: 500 },
    );
  }
}

/**
 * API handler to add a new private RSS feed for the authenticated user.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = addFeedSchema.parse(body);

    // Provide a default category if not present
    const feedData = {
      ...validatedData,
      category: validatedData.category || "Uncategorized",
    };

    const newFeed = await addPrivateFeed(session.user.id, feedData);

    return NextResponse.json(newFeed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid feed data", errors: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to add private feed" },
      { status: 500 },
    );
  }
}

/**
 * API handler to delete a private RSS feed for the authenticated user.
 * Expects feedId as a query parameter, e.g., /api/news/private?feedId=...
 */
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const feedId = searchParams.get("feedId");

  if (!feedId) {
    return NextResponse.json(
      { message: "Feed ID is required" },
      { status: 400 },
    );
  }

  try {
    const success = await deletePrivateFeed(session.user.id, feedId);

    if (!success) {
      return NextResponse.json({ message: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete private feed" },
      { status: 500 },
    );
  }
}
