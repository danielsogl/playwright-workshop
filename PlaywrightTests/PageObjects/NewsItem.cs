using Microsoft.Playwright;

namespace PlaywrightTests.PageObjects;

public class NewsItem
{
    private readonly ILocator _root;
    private readonly ILocator _header;
    private readonly ILocator _newsTeaser;

    public NewsItem(ILocator root)
    {
        _root = root;
        _header = root.GetByRole(AriaRole.Heading, new() { Level = 2 });
        _newsTeaser = root.GetByRole(AriaRole.Paragraph);
    }

    public async Task<string?> GetHeaderAsync()
    {
        return await _header.TextContentAsync();
    }

    public async Task<string?> GetNewsTeaserAsync()
    {
        return await _newsTeaser.TextContentAsync();
    }
}