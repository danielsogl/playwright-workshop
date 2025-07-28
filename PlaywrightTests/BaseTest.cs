using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

public abstract class BaseTest : PageTest
{
    [TestInitialize]
    public void BaseTestInitialize()
    {
        TestConfiguration.Initialize(TestContext);
    }

    public override BrowserNewContextOptions ContextOptions()
    {
        return new BrowserNewContextOptions()
        {
            BaseURL = TestConfiguration.BaseUrl,
            Locale = TestConfiguration.Locale,
            ViewportSize = new()
            {
                Width = TestConfiguration.ViewportWidth,
                Height = TestConfiguration.ViewportHeight
            }
        };
    }
}