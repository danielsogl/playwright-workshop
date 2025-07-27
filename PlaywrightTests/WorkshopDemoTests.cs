using Microsoft.Playwright;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace PlaywrightTests;

/// <summary>
/// Simplified tests for Playwright .NET workshop demonstrations
/// Focus: Clear examples of core Playwright concepts
/// </summary>
[TestClass]
public class WorkshopDemoTests : PageTest
{
    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo1_BasicNavigation()
    {
        // Demo: Basic page navigation and assertions
        await Page.GotoAsync("https://playwright.dev");
        
        await Expect(Page).ToHaveTitleAsync("Fast and reliable end-to-end testing for modern web apps | Playwright");
        await Expect(Page.GetByRole(AriaRole.Link, new() { Name = "Docs" })).ToBeVisibleAsync();
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo2_UserInteractions()
    {
        // Demo: User interactions - filling forms, clicking buttons
        await Page.GotoAsync("https://demo.playwright.dev/todomvc/#/");

        var todoInput = Page.GetByRole(AriaRole.Textbox, new() { Name = "What needs to be done?" });
        await todoInput.FillAsync("Learn Playwright");
        await todoInput.PressAsync("Enter");

        // Verify the todo was added
        await Expect(Page.GetByTestId("todo-title")).ToContainTextAsync("Learn Playwright");
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo3_ApiMocking()
    {
        // Demo: API route interception and mocking
        await Page.RouteAsync("**/api/users", async route =>
        {
            var mockUsers = new[]
            {
                new { id = 1, name = "Workshop User 1" },
                new { id = 2, name = "Workshop User 2" }
            };

            await route.FulfillAsync(new()
            {
                Status = 200,
                ContentType = "application/json",
                Body = JsonConvert.SerializeObject(mockUsers)
            });
        });

        await Page.GotoAsync("https://jsonplaceholder.typicode.com/");
        // In a real app, this would show the mocked data
        Console.WriteLine("API mocking demonstrated - check network tab");
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo4_WaitingStrategies()
    {
        // Demo: Different waiting strategies
        await Page.GotoAsync("https://playwright.dev");

        // Wait for element to be visible
        await Page.GetByRole(AriaRole.Link, new() { Name = "API" }).WaitForAsync();

        // Wait for network to be idle
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // Wait for specific URL
        await Page.GetByRole(AriaRole.Link, new() { Name = "API" }).ClickAsync();
        await Page.WaitForURLAsync("**/docs/api/**");

        await Expect(Page).ToHaveURLAsync(new Regex(".*api.*"));
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo5_MobileEmulation()
    {
        // Demo: Mobile device emulation
        var iPhone = Playwright.Devices["iPhone 13"];
        var context = await Browser.NewContextAsync(new()
        {
            UserAgent = iPhone.UserAgent,
            ViewportSize = iPhone.ViewportSize,
            IsMobile = true
        });

        var mobilePage = await context.NewPageAsync();
        await mobilePage.GotoAsync("https://playwright.dev");

        // Verify mobile navigation
        var mobileMenuButton = mobilePage.GetByRole(AriaRole.Button, new() { Name = "Toggle navigation bar" });
        if (await mobileMenuButton.CountAsync() > 0)
        {
            await mobileMenuButton.ClickAsync();
        }

        await context.CloseAsync();
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo6_Screenshots()
    {
        // Demo: Taking screenshots for visual testing
        await Page.GotoAsync("https://playwright.dev");

        // Full page screenshot
        await Page.ScreenshotAsync(new()
        {
            Path = "screenshots/workshop-demo-full.png",
            FullPage = true
        });

        // Element screenshot
        var heroSection = Page.GetByRole(AriaRole.Heading, new() { Name = "Playwright enables reliable" }).First;
        await heroSection.ScreenshotAsync(new()
        {
            Path = "screenshots/workshop-demo-element.png"
        });

        Console.WriteLine("Screenshots saved to screenshots/ directory");
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo7_MultiplePages()
    {
        // Demo: Working with multiple pages/tabs
        await Page.GotoAsync("https://playwright.dev");

        // Open new page in same context
        var newPage = await Context.NewPageAsync();
        await newPage.GotoAsync("https://github.com/microsoft/playwright");

        // Work with both pages
        await Expect(Page).ToHaveTitleAsync(new Regex(".*Playwright.*"));
        await Expect(newPage).ToHaveTitleAsync(new Regex(".*playwright.*"));

        await newPage.CloseAsync();
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo8_JavaScriptExecution()
    {
        // Demo: Executing JavaScript in the browser
        await Page.GotoAsync("https://playwright.dev");

        // Execute JavaScript and get result
        var pageTitle = await Page.EvaluateAsync<string>("() => document.title");
        Assert.IsTrue(pageTitle.Contains("Playwright"));

        // Modify page with JavaScript
        await Page.EvaluateAsync(@"() => {
            const banner = document.createElement('div');
            banner.innerHTML = 'Workshop Demo Banner';
            banner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: red; color: white; text-align: center; z-index: 9999; padding: 10px;';
            document.body.prepend(banner);
        }");

        // Verify the banner was added
        await Expect(Page.Locator("text=Workshop Demo Banner")).ToBeVisibleAsync();
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo9_CrossBrowserTesting()
    {
        // Demo: Getting browser information for conditional testing
        var browserName = Page.Context.Browser?.BrowserType.Name ?? "unknown";
        Console.WriteLine($"Running test in: {browserName}");

        await Page.GotoAsync("https://playwright.dev");

        // Browser-specific logic (if needed)
        switch (browserName)
        {
            case "webkit":
                Console.WriteLine("Running Safari-specific test logic");
                break;
            case "firefox":
                Console.WriteLine("Running Firefox-specific test logic");
                break;
            default: // chromium
                Console.WriteLine("Running Chromium-specific test logic");
                break;
        }

        // Common assertion for all browsers
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Playwright enables reliable" })).ToBeVisibleAsync();
    }

    [TestMethod]
    [TestCategory("workshop")]
    public async Task Demo10_PerformanceTesting()
    {
        // Demo: Basic performance measurement
        await Page.GotoAsync("https://playwright.dev");

        var performanceData = await Page.EvaluateAsync<dynamic>(@"() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                pageSize: document.documentElement.outerHTML.length
            };
        }");

        Console.WriteLine($"DOM Content Loaded: {performanceData.domContentLoaded}ms");
        Console.WriteLine($"Load Complete: {performanceData.loadComplete}ms");
        Console.WriteLine($"Page Size: {performanceData.pageSize} characters");

        // Assert reasonable performance
        Assert.IsTrue(Convert.ToDouble(performanceData.domContentLoaded) < 5000, "DOM content should load under 5 seconds");
    }
}