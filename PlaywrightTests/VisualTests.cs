using Microsoft.Playwright;

namespace PlaywrightTests;

/// <summary>
/// Demonstrates visual testing and screenshot comparison for workshop
/// Uses localhost:3000 app so header colors can be changed to show visual diffs
/// </summary>
[TestClass]
public class VisualTests : PageTest
{
    [TestMethod]
    [TestCategory("visual")]
    [TestCategory("workshop")]
    public async Task ScreenshotDemo()
    {
        try
        {
            // Demo: Navigate to local workshop app
            await Page.GotoAsync("http://localhost:3000");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            
            // Ensure screenshots directory exists in project root
            var screenshotsDir = Path.Combine(Environment.CurrentDirectory, "..", "..", "..", "screenshots");
            Directory.CreateDirectory(screenshotsDir);
            
            // Demo: Full page screenshot for comparison
            await Page.ScreenshotAsync(new()
            {
                Path = Path.Combine(screenshotsDir, "workshop-homepage-full.png"),
                FullPage = true
            });
            
            // Demo: Header element screenshot (this is what we'll modify to show visual changes)
            var headerElement = Page.Locator("h1").First;
            if (await headerElement.CountAsync() > 0)
            {
                await headerElement.ScreenshotAsync(new()
                {
                    Path = Path.Combine(screenshotsDir, "workshop-header-element.png")
                });
            }
            
            Console.WriteLine("Screenshots saved - modify header color in app to see visual differences!");
        }
        catch (Exception ex) when (ex.Message.Contains("ERR_CONNECTION_REFUSED"))
        {
            Assert.Inconclusive("Workshop app not running on localhost:3000. Start the app to demo visual testing.");
        }
    }
    
    [TestMethod]
    [TestCategory("visual")]
    [TestCategory("workshop")]
    public async Task VisualComparisonDemo()
    {
        try
        {
            // Demo: Navigate and take baseline screenshot
            await Page.GotoAsync("http://localhost:3000");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            
            // Demo: Take screenshot of specific viewport size for consistent comparison
            await Page.SetViewportSizeAsync(1280, 720);
            
            // Ensure screenshots directory exists in project root
            var screenshotsDir = Path.Combine(Environment.CurrentDirectory, "..", "..", "..", "screenshots");
            Directory.CreateDirectory(screenshotsDir);
            
            var screenshot = await Page.ScreenshotAsync(new()
            {
                Path = Path.Combine(screenshotsDir, "baseline-homepage.png"),
                FullPage = false // Fixed viewport for reliable comparison
            });
            
            Assert.IsNotNull(screenshot);
            Assert.IsTrue(screenshot.Length > 0, "Screenshot should contain data");
            
            Console.WriteLine("Baseline screenshot created. Change the header color and run again to see differences!");
            Console.WriteLine("Example: In your app, change header text color from default to red/blue/green");
        }
        catch (Exception ex) when (ex.Message.Contains("ERR_CONNECTION_REFUSED"))
        {
            Assert.Inconclusive("Workshop app not running on localhost:3000. Start the app to demo visual regression testing.");
        }
    }
    
    [TestMethod]
    [TestCategory("visual")]
    [TestCategory("workshop")]
    public async Task TextSnapshotDemo()
    {
        try
        {
            // Demo: Navigate to workshop app
            await Page.GotoAsync("http://localhost:3000");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            
            // Demo: Capture text content for snapshot testing
            var pageTitle = await Page.TitleAsync();
            var headerText = await Page.Locator("h1").First.TextContentAsync();
            var bodyText = await Page.Locator("body").TextContentAsync();
            
            // Demo: Create text snapshot data
            var textSnapshot = new
            {
                Title = pageTitle,
                HeaderText = headerText,
                BodyLength = bodyText?.Length ?? 0,
                Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            };
            
            // Demo: Save text snapshot to file for comparison
            var snapshotJson = System.Text.Json.JsonSerializer.Serialize(textSnapshot, new System.Text.Json.JsonSerializerOptions
            {
                WriteIndented = true
            });
            
            // Ensure screenshots directory exists in project root
            var screenshotsDir = Path.Combine(Environment.CurrentDirectory, "..", "..", "..", "screenshots");
            Directory.CreateDirectory(screenshotsDir);
            
            await File.WriteAllTextAsync(Path.Combine(screenshotsDir, "text-snapshot.json"), snapshotJson);
            
            // Demo: Basic assertions on text content
            Assert.IsNotNull(pageTitle, "Page should have a title");
            Assert.IsNotNull(headerText, "Page should have header text");
            Assert.IsTrue(bodyText?.Length > 0, "Page should have body content");
            
            Console.WriteLine($"Text snapshot saved with title: '{pageTitle}' and header: '{headerText}'");
            Console.WriteLine("Modify the app content to see text snapshot changes!");
        }
        catch (Exception ex) when (ex.Message.Contains("ERR_CONNECTION_REFUSED"))
        {
            Assert.Inconclusive("Workshop app not running on localhost:3000. Start the app to demo text snapshot testing.");
        }
    }
}