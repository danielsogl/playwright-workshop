using Microsoft.Playwright;

namespace PlaywrightTests;

/// <summary>
/// Demonstrates mobile device emulation
/// </summary>
[TestClass]
public class MobileTests : BrowserTest
{
    [TestMethod]
    [TestCategory("mobile")]
    [TestCategory("workshop")]
    public async Task MobileEmulationDemo()
    {
        // Demo: Create mobile context with iPhone settings
        var iPhone = Playwright.Devices["iPhone 13"];
        var context = await Browser.NewContextAsync(new()
        {
            UserAgent = iPhone.UserAgent,
            ViewportSize = iPhone.ViewportSize,
            IsMobile = true
        });

        var page = await context.NewPageAsync();
        await page.GotoAsync("https://playwright.dev");

        // Demo: Verify mobile-specific elements
        var mobileMenuButton = page.GetByRole(AriaRole.Button, new() { Name = "Toggle navigation bar" });
        if (await mobileMenuButton.CountAsync() > 0)
        {
            await mobileMenuButton.ClickAsync();
        }
        
        await context.CloseAsync();
    }

    [TestMethod]
    [TestCategory("mobile")]
    public async Task ShouldNavigateToDocsPageOnMobile()
    {
        var context = await Browser.NewContextAsync(new()
        {
            UserAgent = Playwright.Devices["iPhone 15"].UserAgent,
            ViewportSize = Playwright.Devices["iPhone 15"].ViewportSize,
            ColorScheme = ColorScheme.Dark
        });

        var page = await context.NewPageAsync();
        await page.GotoAsync("https://playwright.dev");

        // Verify mobile navigation works
        await page.GetByRole(AriaRole.Button, new() 
        { 
            Name = "Toggle navigation bar" 
        }).ClickAsync();
        
        await page.GetByRole(AriaRole.Link, new() 
        { 
            Name = "Docs" 
        }).ClickAsync();

        await Expect(page).ToHaveURLAsync("https://playwright.dev/docs/intro");
        
        await context.CloseAsync();
    }
    
    [TestMethod]
    [TestCategory("mobile")]
    public async Task ShouldAdaptToDesktopViewport()
    {
        var context = await Browser.NewContextAsync(new()
        {
            UserAgent = Playwright.Devices["iPhone 15"].UserAgent,
            ViewportSize = Playwright.Devices["iPhone 15"].ViewportSize
        });

        var page = await context.NewPageAsync();
        await page.GotoAsync("https://playwright.dev");
        
        // Switch to desktop viewport
        await page.SetViewportSizeAsync(1920, 1080);
        
        // Verify desktop navigation works
        await page.GetByRole(AriaRole.Link, new() 
        { 
            Name = "API",
            Exact = true
        }).First.ClickAsync();
        
        await Expect(page).ToHaveURLAsync("https://playwright.dev/docs/api/class-playwright");
        
        await context.CloseAsync();
    }
}