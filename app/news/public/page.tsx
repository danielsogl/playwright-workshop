"use client";

import type { RSSItem } from "@/types/rss";
import type { ChangeEvent } from "react";

import { Card, Input } from "@heroui/react";
import { useState } from "react";
import useSWR from "swr";

import { filterFeedItems } from "@/lib/rss";
import { RSS_CATEGORIES } from "@/config/rss-sources";
import { fetcher } from "@/lib/utils/fetchers";

interface NewsApiResponse {
  items: RSSItem[];
}

export default function PublicNewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data, error, isLoading } = useSWR<NewsApiResponse>(
    "/api/news/public",
    fetcher
  );

  const filteredItems = filterFeedItems(
    data?.items || [],
    searchQuery,
    selectedCategory
  );

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        data-testid="loading-news"
      >
        <div
          aria-label="Loading news feed"
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"
          role="status"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        data-testid="error-news"
      >
        <div className="text-red-500" role="alert">
          Failed to load RSS feeds
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-public-news">
      <h1 className="text-3xl font-bold mb-8">News Feed</h1>

      <div className="flex gap-4 mb-8" data-testid="news-filters">
        <Input
          aria-label="Search news articles"
          className="flex-1"
          data-testid="input-search-news"
          placeholder="Search news..."
          type="text"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />

        <select
          aria-label="Filter news by category"
          className="w-48 rounded-lg border border-gray-300 px-3 py-2"
          data-testid="select-category-news"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {RSS_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        data-testid="grid-news-items"
      >
        {filteredItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden"
            data-testid={`news-item-${index}`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span
                  className="text-sm text-gray-500"
                  data-testid={`news-item-source-${index}`}
                >
                  {item.source}
                </span>
                <span
                  className="text-sm text-gray-500"
                  data-testid={`news-item-category-${index}`}
                >
                  {item.category}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-2">
                <a
                  aria-label={`Read article: ${item.title}`}
                  className="hover:text-blue-600 transition-colors"
                  data-testid={`news-item-link-${index}`}
                  href={item.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              </h2>

              <p
                className="text-gray-600 mb-4 line-clamp-3"
                data-testid={`news-item-desc-${index}`}
              >
                {item.description?.replace(/<[^>]*>/g, "") ??
                  "No description available"}
              </p>

              <div className="text-sm text-gray-500">
                {item.pubDate
                  ? new Date(item.pubDate).toLocaleDateString()
                  : "Date unavailable"}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
