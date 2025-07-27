using Microsoft.Playwright;
using static Microsoft.Playwright.Assertions;

namespace PlaywrightTests.PageObjects;

public enum NewsCategory
{
    Technology,
    Business,
    WorldNews
}

public class NewsFeedPage
{
    private readonly IPage _page;
    private readonly ILocator _newsFeedHeader;
    private readonly ILocator _searchInput;
    private readonly ILocator _filterOptions;
    private readonly ILocator _errorText;
    private readonly ILocator _newsList;
    private readonly ILocator _newsItems;

    public ILocator LoadingSpinner { get; }

    public NewsFeedPage(IPage page)
    {
        _page = page;

        _newsFeedHeader = page.GetByRole(AriaRole.Heading, new() { Name = "News Feed" });
        _searchInput = page.GetByRole(AriaRole.Textbox, new() { Name = "Search news articles" });
        _filterOptions = page.GetByLabel("Filter news by category");

        _newsList = page.GetByRole(AriaRole.List, new() { Name = "News articles" });
        _newsItems = _newsList.GetByRole(AriaRole.Listitem);

        _errorText = page.GetByRole(AriaRole.Alert).First;
        LoadingSpinner = page.GetByRole(AriaRole.Status, new() { Name = "Loading news feed" }).First;
    }

    public async Task GoToPageAsync()
    {
        await _page.GotoAsync("http://localhost:3000/news/public");
        await Expect(_page).ToHaveURLAsync("http://localhost:3000/news/public");
    }

    public async Task FilterByTextAsync(string text)
    {
        await _searchInput.FillAsync(text);
    }

    public async Task FilterByCategoryAsync(NewsCategory category)
    {
        var categoryValue = category switch
        {
            NewsCategory.Technology => "Technology",
            NewsCategory.Business => "Business", 
            NewsCategory.WorldNews => "World News",
            _ => throw new ArgumentException($"Unknown category: {category}")
        };

        await _filterOptions.SelectOptionAsync(new[] { categoryValue });
        await Expect(_filterOptions).ToHaveValueAsync(categoryValue);
    }

    public NewsItem NewsItemByTitle(string title)
    {
        return new NewsItem(_newsItems.GetByRole(AriaRole.Heading, new() { Name = title }));
    }

    public NewsItem NewsItemByIndex(int index)
    {
        return new NewsItem(_newsItems.Nth(index));
    }

    public async Task<string?> GetErrorTextAsync()
    {
        return await _errorText.TextContentAsync();
    }

    public async Task<int> CountNewsItemsAsync()
    {
        return await _newsItems.CountAsync();
    }
}