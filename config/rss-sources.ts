import { RSSSource } from '../types/rss';

import data from './data.json';

export const RSS_SOURCES: RSSSource[] = data.rssFeeds.sources;
export const RSS_CATEGORIES: string[] = data.rssFeeds.categories;
