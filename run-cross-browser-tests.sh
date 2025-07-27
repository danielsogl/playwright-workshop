#!/bin/bash

echo "Running Playwright .NET tests across all browsers using runsettings..."

# Method 1: Using runsettings files (Recommended)
echo "=== Running tests in Chromium ==="
dotnet test --settings chromium.runsettings --logger "console;verbosity=normal"

echo -e "\n=== Running tests in Firefox ==="
dotnet test --settings firefox.runsettings --logger "console;verbosity=normal"

echo -e "\n=== Running tests in WebKit ==="
dotnet test --settings webkit.runsettings --logger "console;verbosity=normal"

# Method 2: Using environment variables (Alternative)
echo -e "\n=== Alternative: Using environment variables ==="
echo "Chromium:"
BROWSER=chromium dotnet test --logger "console;verbosity=minimal"

echo "Firefox:"
BROWSER=firefox dotnet test --logger "console;verbosity=minimal"

echo "WebKit:"
BROWSER=webkit dotnet test --logger "console;verbosity=minimal"

echo -e "\n=== Cross-browser testing complete! ===\n"
echo "TIP: Use specific runsettings for more control:"
echo "dotnet test --settings playwright.runsettings"