# Playwright .NET Tests

This project contains the converted Playwright tests from TypeScript to .NET with MSTest.

## Setup

1. Install dependencies:
```bash
dotnet restore
```

2. Install Playwright browsers:
```bash
pwsh bin/Debug/net9.0/playwright.ps1 install
# or on Unix systems:
./bin/Debug/net9.0/playwright.sh install
```

## Running Tests

Run all tests:
```bash
dotnet test
```

Run tests with specific categories:
```bash
dotnet test --filter TestCategory=regression
dotnet test --filter TestCategory=api
dotnet test --filter TestCategory=mobile
dotnet test --filter TestCategory=visual
```

## Converted Tests

- **ExampleTests.cs** - Basic smoke tests
- **ActionsTests.cs** - User interaction tests
- **NavigateTests.cs** - Navigation and URL tests
- **JsonPlaceholderApiTests.cs** - API testing
- **MobileTests.cs** - Mobile device testing
- **VisualTests.cs** - Visual regression tests
- **NewsApiTests.cs** - News API with mocking
- **PrivateNewsTests.cs** - Private news page tests
- **AccessibilityTests.cs** - Accessibility tests
- **LocatorsTests.cs** - Locator testing
- **PerformanceTests.cs** - Performance measurements
- **NewsFeedPomTests.cs** - Page Object Model tests

## Page Object Models

Located in `PageObjects/` folder:
- **NewsFeedPage.cs** - News feed page interactions
- **NewsItem.cs** - Individual news item interactions  
- **LoginPage.cs** - Login page interactions

## Authentication Tests

The `PrivateNewsTests` demonstrate proper authentication handling:

- **Without credentials**: Tests will skip gracefully with informative messages
- **With credentials**: Set environment variables and tests will perform full authentication flow

```bash
# Set test user credentials
export TEST_USER="your-test-email@example.com"
export TEST_USER_PASSWORD="your-test-password"

# Run authenticated tests
dotnet test --filter "FullyQualifiedName~PrivateNewsTests"
```

Authentication features:
- Proper login form automation
- Storage state management (saves to `playwright/.auth/user.json`)
- Authentication state reuse between tests
- Graceful handling when credentials are not available

## Notes

- Some features like axe-core accessibility testing and Lighthouse performance testing require additional setup or third-party libraries in .NET
- Text snapshot testing is not directly available in .NET Playwright like in TypeScript version
- Mobile device configurations use the same device names as TypeScript version
- Authentication tests require valid user credentials in environment variables for full functionality