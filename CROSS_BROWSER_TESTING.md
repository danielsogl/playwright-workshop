# Cross-Browser Testing with .NET Playwright

## 📋 Overview

This guide shows how to run Playwright .NET tests across multiple browsers using different configuration methods.

## 🎯 Method 1: RunSettings Files (Recommended)

The official and most flexible approach using `.runsettings` files:

### Basic Browser-Specific Settings

```bash
# Run tests with specific browser configurations
dotnet test --settings chromium.runsettings
dotnet test --settings firefox.runsettings  
dotnet test --settings webkit.runsettings
```

### Advanced Configuration

Use `advanced.runsettings` for comprehensive browser and test settings:
```bash
dotnet test --settings advanced.runsettings
```

### RunSettings Features

✅ **Browser Configuration**: Set browser type and launch options  
✅ **Timeout Settings**: Configure expect and global timeouts  
✅ **Viewport Control**: Set screen resolution and device emulation  
✅ **Network Options**: Configure headers, SSL, and proxy settings  
✅ **Debug Settings**: Enable debug mode and slow motion  
✅ **Test Execution**: Control parallelization and workers  

## 🔧 Method 2: Environment Variables

Quick browser switching without config files:

```bash
# Set browser via environment variable
BROWSER=chromium dotnet test
BROWSER=firefox dotnet test
BROWSER=webkit dotnet test

# With test filtering
BROWSER=webkit dotnet test --filter "TestCategory=smoke"
```

## 🚀 Method 3: Automated Scripts

### Bash Script
```bash
./run-cross-browser-tests.sh
```

### PowerShell Script  
```powershell
./run-cross-browser-tests.ps1
```

## 🎛️ Available Browsers

| Browser | Identifier | Description |
|---------|------------|-------------|
| **Chromium** | `chromium` | Chrome, Edge, Chromium |
| **Firefox** | `firefox` | Mozilla Firefox |
| **WebKit** | `webkit` | Safari, WebKit |

## 📊 RunSettings Configuration Options

### Browser Launch Options
```xml
<LaunchOptions>
  <Headless>false</Headless>
  <SlowMo>100</SlowMo>
  <Channel>chrome</Channel>
  <Args>
    <Arg>--disable-web-security</Arg>
  </Args>
</LaunchOptions>
```

### Context Options
```xml
<ContextOptions>
  <ViewportSize>
    <Width>1920</Width>
    <Height>1080</Height>
  </ViewportSize>
  <IgnoreHTTPSErrors>true</IgnoreHTTPSErrors>
  <UserAgent>Custom-Agent</UserAgent>
</ContextOptions>
```

## 🧪 Browser Detection in Tests

```csharp
[TestMethod]
public async Task CrossBrowserTest()
{
    await Page.GotoAsync("https://example.com");
    
    // Get current browser for conditional logic
    var browserName = Page.Context.Browser?.BrowserType.Name;
    Console.WriteLine($"Running in: {browserName}");
    
    // Browser-specific assertions
    switch (browserName)
    {
        case "webkit":
            // Safari-specific testing
            break;
        case "firefox":
            // Firefox-specific testing  
            break;
        default: // chromium
            // Chrome-specific testing
            break;
    }
}
```

## 📁 File Structure

```
PlaywrightTests/
├── chromium.runsettings      # Chromium configuration
├── firefox.runsettings       # Firefox configuration  
├── webkit.runsettings        # WebKit configuration
├── playwright.runsettings    # Default configuration
├── advanced.runsettings      # Advanced configuration
└── MultiBrowserTests.cs      # Cross-browser test examples
```

## 🔍 Example Commands

```bash
# Basic cross-browser testing
dotnet test --settings chromium.runsettings
dotnet test --settings firefox.runsettings
dotnet test --settings webkit.runsettings

# With specific test filters
dotnet test --settings webkit.runsettings --filter "TestCategory=mobile"

# Environment variable approach
BROWSER=firefox dotnet test --filter "FullyQualifiedName~NewsApiTests"

# Run all browsers automatically
./run-cross-browser-tests.sh
```

## 💡 Best Practices

1. **Use RunSettings** for consistent configuration across environments
2. **Browser-specific logic** only when necessary
3. **Test isolation** - ensure tests work across all browsers
4. **Conditional assertions** for browser-specific behavior
5. **Headless mode** for CI/CD pipelines

## 🐛 Troubleshooting

- **Browser not found**: Ensure browsers are installed with `pwsh bin/Debug/net9.0/playwright.ps1 install`
- **Timeout issues**: Adjust timeout values in runsettings
- **SSL errors**: Set `IgnoreHTTPSErrors` to `true` in ContextOptions
- **Viewport issues**: Configure ViewportSize in ContextOptions

---

📚 **Documentation**: [Playwright .NET Testing](https://playwright.dev/dotnet/docs/running-tests)