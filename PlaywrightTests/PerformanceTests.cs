using Microsoft.Playwright;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PlaywrightTests;

[TestClass]
public class PerformanceTests : PageTest
{
    [TestMethod]
    public async Task MeasureNavigationPerformance()
    {
        await Page.GotoAsync("https://google.com");

        // Get navigation timing data using a more robust approach
        var performanceData = await Page.EvaluateAsync<dynamic>(@"() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (!navigation) return null;
            
            return {
                duration: navigation.duration,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                ttfb: navigation.responseStart - navigation.requestStart
            };
        }");
        
        if (performanceData != null)
        {
            var duration = Convert.ToDouble(performanceData.duration);
            var ttfb = Convert.ToDouble(performanceData.ttfb);
            
            Console.WriteLine($"Navigation duration: {duration}ms");
            Console.WriteLine($"Time to First Byte: {ttfb}ms");
            Console.WriteLine($"DOM Content Loaded: {performanceData.domContentLoaded}ms");
            Console.WriteLine($"Load Complete: {performanceData.loadComplete}ms");
            
            Assert.IsTrue(duration > 0, "Navigation duration should be positive");
            Assert.IsTrue(duration < 10000, $"Navigation took {duration}ms, which seems too long");
            Assert.IsTrue(ttfb < 5000, $"Time to first byte was {ttfb}ms, which seems too long");
        }
        else
        {
            Assert.Inconclusive("No navigation timing data available");
        }
    }

    [TestMethod]
    public async Task BasicPerformanceMetrics()
    {
        await Page.GotoAsync("https://playwright.dev");
        
        // Measure basic performance metrics available in the browser
        var metrics = await Page.EvaluateAsync<dynamic>(@"() => {
            const paintEntries = performance.getEntriesByType('paint');
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
            
            return {
                firstContentfulPaint: fcp ? fcp.startTime : null,
                largestContentfulPaint: lcp ? lcp.startTime : null,
                domNodes: document.querySelectorAll('*').length,
                imagesCount: document.images.length
            };
        }");
        
        Console.WriteLine($"DOM nodes: {metrics.domNodes}");
        Console.WriteLine($"Images count: {metrics.imagesCount}");
        
        if (metrics.firstContentfulPaint != null)
        {
            var fcp = Convert.ToDouble(metrics.firstContentfulPaint);
            Console.WriteLine($"First Contentful Paint: {fcp}ms");
            Assert.IsTrue(fcp < 3000, $"First Contentful Paint was {fcp}ms, should be under 3000ms");
        }
        
        Assert.IsTrue(Convert.ToInt32(metrics.domNodes) > 0, "Page should have DOM nodes");
    }
}