# PowerShell script for cross-browser testing using runsettings
Write-Host "Running Playwright .NET tests across all browsers using runsettings..." -ForegroundColor Green

# Method 1: Using runsettings files (Recommended)
Write-Host "`n=== Running tests in Chromium ===" -ForegroundColor Yellow
dotnet test --settings chromium.runsettings --logger "console;verbosity=normal"

Write-Host "`n=== Running tests in Firefox ===" -ForegroundColor Yellow
dotnet test --settings firefox.runsettings --logger "console;verbosity=normal"

Write-Host "`n=== Running tests in WebKit ===" -ForegroundColor Yellow
dotnet test --settings webkit.runsettings --logger "console;verbosity=normal"

# Method 2: Using environment variables (Alternative)
Write-Host "`n=== Alternative: Using environment variables ===" -ForegroundColor Cyan

Write-Host "Chromium:" -ForegroundColor White
$env:BROWSER = "chromium"
dotnet test --logger "console;verbosity=minimal"

Write-Host "Firefox:" -ForegroundColor White
$env:BROWSER = "firefox"
dotnet test --logger "console;verbosity=minimal"

Write-Host "WebKit:" -ForegroundColor White
$env:BROWSER = "webkit"
dotnet test --logger "console;verbosity=minimal"

Write-Host "`n=== Cross-browser testing complete! ===" -ForegroundColor Green
Write-Host "`nTIP: Use the main runsettings for more control:" -ForegroundColor Cyan
Write-Host "dotnet test --settings playwright.runsettings" -ForegroundColor White