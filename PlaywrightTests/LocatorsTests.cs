using Microsoft.Playwright;

namespace PlaywrightTests;

[TestClass]
public class LocatorsTests : PageTest
{
    [TestInitialize]
    public async Task Setup()
    {
        await Page.GotoAsync("https://playwright.dev/");
    }

    [TestMethod]
    [TestCategory("regression")]
    public async Task ShouldShowTitle()
    {
        await Expect(Page.GetByRole(AriaRole.Heading, new() 
        { 
            Name = "Playwright enables reliable" 
        })).ToBeVisibleAsync();
    }

    [TestMethod]
    [TestCategory("regression")]
    public async Task ShouldShowDocsLink()
    {
        await Expect(Page.GetByRole(AriaRole.Link, new() 
        { 
            Name = "Docs" 
        })).ToBeVisibleAsync();
    }
}