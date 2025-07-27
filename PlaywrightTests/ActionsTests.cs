using Microsoft.Playwright;

namespace PlaywrightTests;

/// <summary>
/// Demonstrates user interactions: filling forms, clicking, editing
/// </summary>
[TestClass]
public class ActionsTests : PageTest
{
    [TestMethod]
    [TestCategory("workshop")]
    public async Task UserInteractionsDemo()
    {
        // Demo: Navigate to todo app
        await Page.GotoAsync("https://demo.playwright.dev/todomvc/#/");

        // Demo: Fill input and press Enter
        var todoInput = Page.GetByRole(AriaRole.Textbox, new() { Name = "What needs to be done?" });
        await todoInput.FillAsync("Learn Playwright");
        await todoInput.PressAsync("Enter");

        // Demo: Double-click to edit
        await Page.GetByTestId("todo-title").DblClickAsync();
        
        var editInput = Page.GetByRole(AriaRole.Textbox, new() { Name = "Edit" });
        await editInput.FillAsync("Master Playwright!");
        await editInput.PressAsync("Enter");

        // Demo: Check the todo as completed
        await Page.GetByRole(AriaRole.Checkbox, new() { Name = "Toggle Todo" }).CheckAsync();

        // Verify the final state
        await Expect(Page.GetByRole(AriaRole.Checkbox, new() { Name = "Toggle Todo" })).ToBeCheckedAsync();
    }
}