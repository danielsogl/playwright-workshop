# 📸 Visual Testing Workshop Demo

## 🎯 Purpose
Demonstrate how Playwright can detect visual changes by comparing screenshots and text snapshots.

## 🚀 Demo Steps

### Step 1: Run Baseline Tests
```bash
# Run visual tests to create baseline screenshots
dotnet test --filter "TestCategory=visual" --logger "console;verbosity=normal"
```

This creates:
- `screenshots/workshop-homepage-full.png` - Full page screenshot
- `screenshots/workshop-header-element.png` - Header element only  
- `screenshots/baseline-homepage.png` - Fixed viewport screenshot
- `screenshots/text-snapshot.json` - Text content snapshot

### Step 2: Modify Your App
**Make a visual change in your localhost:3000 app:**

#### Example Changes:
1. **Header Color**: Change the main header text color from default to red/blue/green
2. **Background**: Modify the page background color
3. **Text Content**: Change the header text content
4. **Layout**: Add/remove elements from the page

#### CSS Example:
```css
/* In your app's CSS file, modify: */
h1 {
    color: red; /* Change from default color */
}

/* Or add new styling: */
.header {
    background-color: yellow;
    padding: 20px;
}
```

### Step 3: Run Tests Again
```bash
# Run visual tests after making changes
dotnet test --filter "TestCategory=visual" --logger "console;verbosity=normal"
```

### Step 4: Compare Screenshots
**Manual Comparison:**
1. Open `screenshots/` directory
2. Compare the new screenshots with originals
3. Notice the visual differences!

**Automated Comparison (Advanced):**
```bash
# You could use image comparison tools like:
# - ImageMagick: compare baseline.png new.png diff.png
# - Or integrate with visual testing services
```

## 📊 Workshop Demo Flow

### 1. **ScreenshotDemo Test**
- Takes full page and element screenshots
- Perfect for showing "before and after" changes
- **Demo**: Change header color → retake screenshots → compare

### 2. **VisualComparisonDemo Test**  
- Creates baseline screenshots with fixed viewport
- Consistent for reliable comparison
- **Demo**: Modify layout → run test → show size differences

### 3. **TextSnapshotDemo Test**
- Captures text content as JSON snapshot
- Detects content changes, not just visual
- **Demo**: Change header text → run test → compare JSON files

## 💡 Workshop Teaching Points

### Visual Regression Detection
```csharp
// Take screenshot
await Page.ScreenshotAsync(new() { Path = "baseline.png" });

// Later, take another screenshot and compare manually
// Or integrate with visual testing platforms
```

### Consistent Screenshot Conditions
```csharp
// Set fixed viewport for reliable comparison
await Page.SetViewportSizeAsync(1280, 720);

// Wait for page to be fully loaded
await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
```

### Element-Specific Screenshots
```csharp
// Screenshot just the header element
var header = Page.Locator("h1").First;
await header.ScreenshotAsync(new() { Path = "header.png" });
```

### Text Content Snapshots
```csharp
// Capture text for content regression testing
var textContent = await Page.TextContentAsync("body");
await File.WriteAllTextAsync("content-snapshot.txt", textContent);
```

## 🎓 Learning Outcomes

Participants will learn:
1. **Visual regression testing** - Detecting unintended UI changes
2. **Screenshot strategies** - Full page vs element-specific  
3. **Baseline management** - Creating and maintaining visual baselines
4. **Text snapshots** - Content change detection
5. **Viewport consistency** - Reliable screenshot conditions

## 🔧 Advanced Extensions

For advanced workshops, you can show:
- Integration with visual testing platforms (Percy, Chromatic)
- Automated visual diff reporting
- CI/CD pipeline integration
- Cross-browser visual consistency testing

---

**Happy Visual Testing! 📸✨**