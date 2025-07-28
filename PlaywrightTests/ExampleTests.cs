using Microsoft.Playwright;

namespace PlaywrightTests;

/// <summary>
/// Simple example tests for workshop demonstration
/// </summary>
[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    [TestCategory("smoke")]
    public async Task BasicNavigationTest()
    {
        // Start tracing
        await Context.Tracing.StartAsync(new()
        {
            Title = $"{TestContext.TestName}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
        
        try
        {
            // Demo: Basic page navigation and title verification
            await Page.GotoAsync("https://playwright.dev");
            await Expect(Page).ToHaveTitleAsync("Fast and reliable end-to-end testing for modern web apps | Playwright");
        }
        finally
        {
            // Stop tracing and save
            await Context.Tracing.StopAsync(new()
            {
                Path = $"traces/{TestContext.TestName}.zip"
            });
        }
    }
    
    [TestMethod]
    [TestCategory("smoke")]
    public async Task ElementVisibilityTest()
    {
        // Demo: Finding elements and checking visibility
        await Page.GotoAsync("https://playwright.dev");
        
        await Expect(Page.GetByRole(AriaRole.Link, new() { Name = "Docs" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Link, new() { Name = "API" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Playwright enables reliable" })).ToBeVisibleAsync();
    }
}