using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class MultiBrowserTests : PageTest
{
    [TestMethod]
    [TestCategory("cross-browser")]
    public async Task ShouldWorkAcrossAllBrowsers()
    {
        await Page.GotoAsync("https://playwright.dev");
        await Expect(Page).ToHaveTitleAsync("Fast and reliable end-to-end testing for modern web apps | Playwright");
        
        // Get browser name for reporting
        var browserName = Page.Context.Browser?.BrowserType.Name ?? "unknown";
        Console.WriteLine($"Running test in browser: {browserName}");
        
        // Browser-specific assertions if needed
        if (browserName == "webkit")
        {
            // WebKit specific test logic
            Console.WriteLine("Running WebKit-specific assertions");
        }
        else if (browserName == "firefox") 
        {
            // Firefox specific test logic
            Console.WriteLine("Running Firefox-specific assertions");
        }
        else
        {
            // Chromium specific test logic
            Console.WriteLine("Running Chromium-specific assertions");
        }
    }
}

// Separate test classes for specific browsers if needed
[TestClass]
public class ChromiumOnlyTests : BrowserTest
{
    private IPage _page = null!;

    [TestInitialize]
    public async Task Setup()
    {
        var context = await Browser.NewContextAsync();
        _page = await context.NewPageAsync();
    }

    [TestMethod]
    [TestCategory("chromium-only")]
    public async Task ChromiumSpecificFeature()
    {
        // Test Chrome DevTools Protocol features or Chromium-specific behavior
        await _page.GotoAsync("https://example.com");
        
        var browserName = _page.Context.Browser?.BrowserType.Name;
        Assert.AreEqual("chromium", browserName);
        
        Console.WriteLine("Testing Chromium-specific features");
    }
    
    [TestCleanup]
    public async Task Cleanup()
    {
        await _page.Context.CloseAsync();
    }
}