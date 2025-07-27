#!/bin/bash

echo "🎭 Playwright Visual Testing Workshop Demo"
echo "=========================================="

# Check if localhost:3000 is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Error: localhost:3000 is not running"
    echo "Please start your workshop application first:"
    echo "  npm start (or equivalent)"
    exit 1
fi

echo "✅ Workshop app detected at localhost:3000"
echo ""

# Run visual tests
echo "📸 Running visual tests to create baseline screenshots..."
dotnet test --filter "TestCategory=visual" --logger "console;verbosity=normal"

echo ""
echo "📁 Screenshots created in: PlaywrightTests/screenshots/"
ls -la PlaywrightTests/screenshots/

echo ""
echo "🎨 Workshop Demo Instructions:"
echo "1. Check the created screenshots in PlaywrightTests/screenshots/"
echo "2. Modify your app's header color (e.g., change h1 color to red in CSS)"
echo "3. Run this script again to see the visual differences!"
echo "4. Compare the new screenshots with the previous ones"

echo ""
echo "📋 Available screenshots:"
echo "  - workshop-homepage-full.png    (Full page screenshot)"
echo "  - workshop-header-element.png   (Header element only)"
echo "  - baseline-homepage.png         (Fixed viewport baseline)"
echo "  - text-snapshot.json           (Text content snapshot)"