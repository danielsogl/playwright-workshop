using Microsoft.Playwright;
using static Microsoft.Playwright.Assertions;

namespace PlaywrightTests.PageObjects;

public class LoginPage
{
    private readonly IPage _page;
    private readonly ILocator _emailInput;
    private readonly ILocator _passwordInput;
    private readonly ILocator _loginButton;
    private readonly ILocator _loginHeader;

    public LoginPage(IPage page)
    {
        _page = page;
        _emailInput = page.GetByLabel("Email");
        _passwordInput = page.GetByLabel("Password");
        _loginButton = page.GetByRole(AriaRole.Button, new() { Name = "Submit sign in form" });
        _loginHeader = page.GetByRole(AriaRole.Heading, new() { Name = "Sign In" });
    }

    public async Task GoToAsync()
    {
        await _page.GotoAsync("http://localhost:3000/auth/signin");
        await _page.WaitForURLAsync("**/auth/signin");
        await Expect(_loginHeader).ToBeVisibleAsync();
    }

    public async Task LoginAsync(string email, string password)
    {
        await _emailInput.FillAsync(email);
        await _passwordInput.FillAsync(password);
        await _loginButton.ClickAsync();

        // Wait for either successful login or error
        try
        {
            // Try to wait for successful login (redirect to home page)
            await _page.WaitForURLAsync("http://localhost:3000/", new() { Timeout = 5000 });
            
            // Verify login success by checking for user profile menu
            await Expect(_page.GetByRole(AriaRole.Button, new() 
            { 
                Name = "User profile actions menu" 
            })).ToBeVisibleAsync();
        }
        catch (TimeoutException)
        {
            // Check if we're still on login page (login failed)
            var currentUrl = _page.Url;
            if (currentUrl.Contains("/auth/signin"))
            {
                throw new InvalidOperationException($"Login failed - still on login page. Check if user {email} has valid credentials.");
            }
            throw;
        }
    }
}