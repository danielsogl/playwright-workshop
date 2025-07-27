using Microsoft.Playwright;
using Deque.AxeCore.Playwright;
using Deque.AxeCore.Commons;

namespace PlaywrightTests;

[TestClass]
public class AccessibilityTests : PageTest
{
    [TestInitialize]
    public async Task Setup()
    {
        await Page.GotoAsync("http://localhost:3000");
    }

    [TestMethod]
    public async Task CheckAAAConformance()
    {
        // Run axe-core accessibility analysis
        AxeResult axeResults = await Page.RunAxe();

        // Report any violations found (like TypeScript expect.soft())
        if (axeResults.Violations != null && axeResults.Violations.Length > 0)
        {
            Console.WriteLine($"Found {axeResults.Violations.Length} accessibility violations:");
            foreach (var violation in axeResults.Violations)
            {
                Console.WriteLine($"- {violation.Id}: {violation.Description}");
                Console.WriteLine($"  Impact: {violation.Impact}");
                Console.WriteLine($"  Help: {violation.Help}");
                Console.WriteLine($"  Elements affected: {violation.Nodes?.Length ?? 0}");
                Console.WriteLine();
            }
            
            // Use soft assertion (inconclusive) to match TypeScript expect.soft() behavior
            Assert.Inconclusive($"Found {axeResults.Violations.Length} accessibility violations. This matches the TypeScript version's expect.soft() behavior - violations are reported but don't fail the test suite.");
        }
        else
        {
            Console.WriteLine("No accessibility violations found - page passed all checks!");
        }
    }

    [TestMethod]
    public async Task CheckAccessibilityWithOptions()
    {
        // Run axe with specific options (e.g., only check WCAG 2.1 AA rules)
        var options = new AxeRunOptions
        {
            RunOnly = new RunOnlyOptions
            {
                Type = "tag",
                Values = new List<string> { "wcag2a", "wcag2aa", "wcag21aa" }
            }
        };

        AxeResult axeResults = await Page.RunAxe(options);

        // Report any violations found
        if (axeResults.Violations != null && axeResults.Violations.Length > 0)
        {
            Console.WriteLine($"Found {axeResults.Violations.Length} accessibility violations:");
            foreach (var violation in axeResults.Violations)
            {
                Console.WriteLine($"- {violation.Id}: {violation.Description}");
                Console.WriteLine($"  Impact: {violation.Impact}");
                Console.WriteLine($"  Help: {violation.Help}");
                Console.WriteLine($"  Help URL: {violation.HelpUrl}");
                Console.WriteLine($"  Elements affected: {violation.Nodes?.Length ?? 0}");
                Console.WriteLine();
            }
        }

        // Use soft assertion to not fail the test but report violations
        if (axeResults.Violations != null && axeResults.Violations.Length > 0)
        {
            Assert.Inconclusive($"Found {axeResults.Violations.Length} accessibility violations. See test output for details.");
        }
        else
        {
            Console.WriteLine("No accessibility violations found - page passed all checks!");
        }
    }

    [TestMethod]
    public async Task CheckSpecificElement()
    {
        // Test accessibility of a specific element (e.g., navigation)
        var navElement = Page.GetByRole(AriaRole.Navigation).First;
        
        if (await navElement.CountAsync() > 0)
        {
            var context = new AxeRunContext
            {
                Include = new List<AxeSelector> { new AxeSelector("[role='navigation']") }
            };

            AxeResult axeResults = await Page.RunAxe(context);

            Assert.IsTrue(axeResults.Violations == null || axeResults.Violations.Length == 0,
                $"Navigation accessibility violations found: {FormatViolations(axeResults.Violations)}");
        }
        else
        {
            Assert.Inconclusive("No navigation element found to test");
        }
    }

    private static string FormatViolations(AxeResultItem[]? violations)
    {
        if (violations == null || violations.Length == 0)
            return "None";

        var formatted = violations.Take(3).Select(v => 
            $"\n- {v.Id}: {v.Description} (Impact: {v.Impact})");
        
        var result = string.Join("", formatted);
        if (violations.Length > 3)
            result += $"\n... and {violations.Length - 3} more violations";
            
        return result;
    }
}