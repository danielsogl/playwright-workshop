# Public News Page Test Plan

## Application Overview

The Public News page (/news/public) displays an RSS-aggregated news feed accessible to authenticated users. It features a "News Feed" heading with subtitle, a live-filtering search input, a category dropdown filter (All Categories, Technology, Business, World News), an article count indicator, and a list of article cards. Each card shows a source badge, category badge, headline link (to external URL), description excerpt, and publication date. Filtering (search and category) is client-side and reactive — results update immediately. The page is reachable via the main navigation bar.

## Test Scenarios

### 1. Public News – Page Load & Structure

**Seed:** `e2e/login.setup.ts`

#### 1.1. should display the page heading and subtitle

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public
    - expect: The page title is 'Playwright Demo App'
    - expect: A level-1 heading 'News Feed' is visible
    - expect: The subtitle 'Browse the latest news from public RSS feeds' is visible

#### 1.2. should show the articles count after loading

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public
    - expect: The loading spinner/status 'Loading news feed…' is shown initially
  2. Wait for the loading indicator to disappear
    - expect: An article count indicator is visible showing a positive number of articles, e.g. '97 articles found'
    - expect: The news articles list contains at least one article

#### 1.3. should render article cards with all required fields

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for the feed to load
  2. Inspect the first article card in the 'News articles' list
    - expect: A source badge is visible (e.g. 'Hacker News', 'TechCrunch', 'BBC World', 'Reuters Financial News')
    - expect: A category badge is visible (e.g. 'Technology', 'Business', 'World News')
    - expect: A headline is visible as a clickable link pointing to an external URL (https://...)
    - expect: A description/excerpt paragraph is visible
    - expect: A publication date is visible

#### 1.4. should display the search input with correct placeholder

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for feed to load
  2. Inspect the search region labeled 'News filter options'
    - expect: A text input with the accessible name 'Search news articles' is visible
    - expect: The input has placeholder text 'Search news…'
    - expect: A category combobox labeled 'Filter news by category' is visible with 'All Categories' selected by default

### 2. Public News – Search Functionality

**Seed:** `e2e/login.setup.ts`

#### 2.1. should filter articles when searching by keyword

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
    - expect: Article count shows a positive total, e.g. '97 articles found'
  2. Type 'PHP' into the 'Search news articles' input
    - expect: The article count decreases and reflects the filtered result, e.g. '1 articles found'
    - expect: All visible article cards contain 'PHP' in their title or description
    - expect: Articles not matching 'PHP' are no longer visible in the list

#### 2.2. should show zero results for a search term with no matches

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Type 'xyzxyzxyznonexistentarticle' into the 'Search news articles' input
    - expect: The article count shows '0 articles found'
    - expect: The 'News articles' list is empty — no article cards are rendered

#### 2.3. should restore all articles when search input is cleared

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
    - expect: All articles are shown with the full article count
  2. Type 'BBC' into the 'Search news articles' input
    - expect: The article count decreases to match BBC-related articles only
  3. Clear the search input (set value to empty string)
    - expect: The article count returns to the original total
    - expect: All articles are visible again in the 'News articles' list

#### 2.4. should perform case-insensitive search

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Type 'ukraine' (lowercase) into the 'Search news articles' input
    - expect: At least one article is returned — articles containing 'Ukraine' (any casing) are shown
  3. Clear the input and type 'UKRAINE' (uppercase)
    - expect: The same or equivalent number of articles is returned as with the lowercase query

### 3. Public News – Category Filter

**Seed:** `e2e/login.setup.ts`

#### 3.1. should filter articles by Technology category

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Select 'Technology' in the 'Filter news by category' dropdown
    - expect: The article count updates to show only Technology articles (e.g. '40 articles found')
    - expect: Every visible article card displays a 'Technology' category badge
    - expect: No article card shows a 'Business' or 'World News' category badge

#### 3.2. should filter articles by Business category

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Select 'Business' in the 'Filter news by category' dropdown
    - expect: The article count updates to show only Business articles
    - expect: Every visible article card displays a 'Business' category badge
    - expect: No article card shows a 'Technology' or 'World News' category badge

#### 3.3. should filter articles by World News category

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Select 'World News' in the 'Filter news by category' dropdown
    - expect: The article count updates to show only World News articles
    - expect: Every visible article card displays a 'World News' category badge
    - expect: No article card shows a 'Technology' or 'Business' category badge

#### 3.4. should restore all articles when switching back to All Categories

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
    - expect: Full article count is shown
  2. Select 'Technology' in the 'Filter news by category' dropdown
    - expect: Article count decreases to Technology-only count
  3. Select 'All Categories' in the 'Filter news by category' dropdown
    - expect: The article count returns to the original total
    - expect: Articles from all categories (Technology, Business, World News) are visible

### 4. Public News – Combined Search and Category Filter

**Seed:** `e2e/login.setup.ts`

#### 4.1. should apply search and category filter simultaneously

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Select 'Technology' in the 'Filter news by category' dropdown
    - expect: Article count shows Technology-only articles
  3. Type 'AI' into the 'Search news articles' input
    - expect: The article count further decreases to match Technology articles containing 'AI'
    - expect: All visible articles have a 'Technology' badge and contain 'AI' in the title or description

#### 4.2. should show zero results when combined filters match nothing

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Select 'Business' in the 'Filter news by category' dropdown
    - expect: Business articles are shown
  3. Type 'xyzxyzxyznonexistent' into the 'Search news articles' input
    - expect: The article count shows '0 articles found'
    - expect: The article list is empty

### 5. Public News – Navigation

**Seed:** `e2e/login.setup.ts`

#### 5.1. should navigate to Public News via the main navigation bar

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 (homepage)
    - expect: The main navigation bar is visible with menu items including 'Public News'
  2. Click the 'Navigate to Public News' menu item in the navigation
    - expect: The URL changes to /news/public
    - expect: The page heading 'News Feed' is visible
    - expect: The news article list loads successfully

#### 5.2. should have 'Public News' as the active navigation item on the page

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public
    - expect: The 'Navigate to Public News' menu item is visible in the navbar

#### 5.3. should navigate back to homepage via the Feeds logo link

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Click the 'Go to homepage' logo/link in the navigation bar
    - expect: The URL changes to /
    - expect: The homepage is displayed

### 6. Public News – Article Links

**Seed:** `e2e/login.setup.ts`

#### 6.1. should have article headline links pointing to external URLs

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and wait for articles to load
  2. Inspect the href attribute of the first article headline link in the list
    - expect: The href starts with 'https://', pointing to an external source (e.g. a news site or GitHub repository)
    - expect: The link is not an internal application URL

#### 6.2. should show correct source badge per article

**File:** `e2e/news/public-news.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/news/public and select 'Technology' from the category dropdown
    - expect: Only Technology articles are shown
  2. Verify source badges on the visible articles
    - expect: Source badges include values such as 'Hacker News', 'TechCrunch', or 'Reuters Financial News'
    - expect: Each article displays exactly one source badge
