using Microsoft.Playwright;

namespace PlaywrightTests;

[TestClass]
public class NavigateTests : PageTest
{
    private const string BaseUrl = "http://localhost:3000";
    private const string PublicNewsUrl = $"{BaseUrl}/news/public";
    private const int ExtendedTimeout = 20000; // Backend takes time to start
    
    private ILocator PublicNewsMenuItem => Page.GetByRole(AriaRole.Menuitem, new() 
    { 
        Name = "Navigate to Public News" 
    });
    
    private ILocator NewsFeedHeading => Page.GetByRole(AriaRole.Heading, new() 
    { 
        Name = "News Feed" 
    });

    [TestInitialize]
    public async Task Setup()
    {
        try
        {
            await Page.GotoAsync(BaseUrl);
        }
        catch (Exception ex) when (ex.Message.Contains("ERR_CONNECTION_REFUSED"))
        {
            Assert.Inconclusive("Development server not running on localhost:3000");
        }
    }

    [TestMethod]
    [TestCategory("regression")]
    public async Task NavigateToPublicNewsPageAndCheckUrl()
    {
        await PublicNewsMenuItem.ClickAsync();
        await Expect(Page).ToHaveURLAsync(PublicNewsUrl);
    }

    [TestMethod]
    [TestCategory("regression")]
    public async Task NavigateToPublicNewsPageAndCheckTitle()
    {
        await PublicNewsMenuItem.ClickAsync();
        
        // Backend takes time to start, so use extended timeout
        await Expect(NewsFeedHeading).ToBeVisibleAsync(new() 
        { 
            Timeout = ExtendedTimeout 
        });
    }
    
    [TestMethod]
    [TestCategory("regression")]
    public async Task ShouldHaveNavigationMenuVisible()
    {
        await Expect(PublicNewsMenuItem).ToBeVisibleAsync();
        await Expect(PublicNewsMenuItem).ToBeEnabledAsync();
    }
}