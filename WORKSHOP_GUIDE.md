# 🎭 Playwright .NET Workshop Guide

## 🎯 Workshop Overview

This workshop demonstrates core Playwright .NET concepts through simple, focused examples. Each test file showcases specific features and best practices.

## 📚 Test Categories

### **🟢 Basic Examples** (`ExampleTests.cs`)
- **BasicNavigationTest**: Page navigation and title verification
- **ElementVisibilityTest**: Finding elements and checking visibility

### **🔄 User Interactions** (`ActionsTests.cs`)  
- **UserInteractionsDemo**: Filling forms, clicking, editing text

### **📱 Mobile Testing** (`MobileTests.cs`)
- **MobileEmulationDemo**: Device emulation and mobile-specific interactions

### **📸 Visual Testing** (`VisualTests.cs`) - Uses localhost:3000 App
- **ScreenshotDemo**: Taking full page and element screenshots of workshop app
- **VisualComparisonDemo**: Creating baseline screenshots for comparison
- **TextSnapshotDemo**: Text content snapshot testing for content changes

> **🎨 Workshop Demo**: Change header color in localhost:3000 app to demonstrate visual regression detection!

### **🎓 Comprehensive Demos** (`WorkshopDemoTests.cs`)
1. **Demo1_BasicNavigation**: Page navigation and assertions
2. **Demo2_UserInteractions**: Form interactions and input handling
3. **Demo3_ApiMocking**: Route interception and API mocking
4. **Demo4_WaitingStrategies**: Different waiting approaches
5. **Demo5_MobileEmulation**: Mobile device testing
6. **Demo6_Screenshots**: Visual testing capabilities
7. **Demo7_MultiplePages**: Working with multiple tabs/pages
8. **Demo8_JavaScriptExecution**: Executing custom JavaScript
9. **Demo9_CrossBrowserTesting**: Browser-specific logic
10. **Demo10_PerformanceTesting**: Basic performance measurement

## 🚀 Running Tests

### Run All Workshop Tests
```bash
dotnet test --filter "TestCategory=workshop"
```

### Run Specific Test Categories
```bash
# Basic examples
dotnet test --filter "FullyQualifiedName~ExampleTests"

# User interaction demos  
dotnet test --filter "FullyQualifiedName~ActionsTests"

# Mobile testing
dotnet test --filter "TestCategory=mobile"

# Visual testing (requires localhost:3000 app running)
dotnet test --filter "TestCategory=visual"

# 🎨 Demo: Change app header color, then run visual tests again to see differences!
```

### Cross-Browser Testing
```bash
# Test in different browsers
BROWSER=chromium dotnet test --filter "TestCategory=workshop"
BROWSER=firefox dotnet test --filter "TestCategory=workshop"  
BROWSER=webkit dotnet test --filter "TestCategory=workshop"

# Using runsettings
dotnet test --settings chromium.runsettings --filter "TestCategory=workshop"
```

## 🎛️ Key Playwright Concepts Demonstrated

### **Navigation & Assertions**
```csharp
await Page.GotoAsync("https://example.com");
await Expect(Page).ToHaveTitleAsync("Expected Title");
await Expect(element).ToBeVisibleAsync();
```

### **Element Selection**
```csharp
// By role and name
Page.GetByRole(AriaRole.Button, new() { Name = "Submit" })

// By test ID
Page.GetByTestId("submit-button")  

// By text content
Page.GetByText("Click me")

// CSS selectors
Page.Locator(".my-class")
```

### **User Interactions**
```csharp
await element.ClickAsync();
await input.FillAsync("text");
await input.PressAsync("Enter");
await checkbox.CheckAsync();
```

### **Waiting Strategies**
```csharp
// Wait for element
await element.WaitForAsync();

// Wait for network
await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

// Wait for URL
await Page.WaitForURLAsync("**/path/**");
```

### **API Mocking**
```csharp
await Page.RouteAsync("**/api/**", async route =>
{
    await route.FulfillAsync(new()
    {
        Status = 200,
        ContentType = "application/json",
        Body = JsonConvert.SerializeObject(mockData)
    });
});
```

### **Mobile Emulation**
```csharp
var iPhone = Playwright.Devices["iPhone 13"];
var context = await Browser.NewContextAsync(new()
{
    UserAgent = iPhone.UserAgent,
    ViewportSize = iPhone.ViewportSize,
    IsMobile = true
});
```

## 🔧 Workshop Structure

```
PlaywrightTests/
├── ExampleTests.cs          # Basic navigation examples
├── ActionsTests.cs          # User interaction demos
├── MobileTests.cs           # Mobile device emulation
├── VisualTests.cs           # Screenshot capabilities
├── WorkshopDemoTests.cs     # Comprehensive demo suite
├── screenshots/             # Generated screenshots
└── *.runsettings           # Browser configurations
```

## 💡 Best Practices Shown

1. **Clear Test Names**: Descriptive method names indicating purpose
2. **Test Categories**: Organized tests with `[TestCategory]` attributes  
3. **Page Object Pattern**: Reusable page components (see `PageObjects/`)
4. **Error Handling**: Graceful handling of server connection issues
5. **Cross-Browser**: Environment-based browser configuration
6. **Documentation**: Comments explaining Playwright concepts

## 🎓 Learning Path

1. **Start with**: `ExampleTests.cs` - Basic navigation
2. **Move to**: `ActionsTests.cs` - User interactions  
3. **Explore**: `WorkshopDemoTests.cs` - Advanced features
4. **Practice**: `MobileTests.cs` & `VisualTests.cs` - Specialized testing

## 📖 Resources

- [Playwright .NET Documentation](https://playwright.dev/dotnet/)
- [API Reference](https://playwright.dev/dotnet/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/dotnet/docs/best-practices)

---

**Happy Testing with Playwright .NET! 🎭**