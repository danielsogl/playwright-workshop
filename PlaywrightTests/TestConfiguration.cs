using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

public static class TestConfiguration
{
    public static string BaseUrl => TestContext?.Properties["BASE_URL"]?.ToString() ?? "https://playwright.dev";
    
    public static string Locale => TestContext?.Properties["LOCALE"]?.ToString() ?? "en-US";
    
    public static int ViewportWidth => int.TryParse(TestContext?.Properties["VIEWPORT_WIDTH"]?.ToString(), out var width) ? width : 1280;
    
    public static int ViewportHeight => int.TryParse(TestContext?.Properties["VIEWPORT_HEIGHT"]?.ToString(), out var height) ? height : 720;
    
    private static TestContext? TestContext { get; set; }
    
    public static void Initialize(TestContext testContext)
    {
        TestContext = testContext;
    }
}