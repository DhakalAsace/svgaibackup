#!/bin/bash

echo "Cleaning build artifacts..."

# Try to remove .next directory
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    # Try different methods
    rm -rf .next 2>/dev/null || true
    find .next -delete 2>/dev/null || true
    # If still exists, rename it
    if [ -d ".next" ]; then
        echo "Could not remove .next, renaming to .next.old"
        mv .next .next.old.$(date +%s) 2>/dev/null || true
    fi
fi

# Clean other build artifacts
echo "Cleaning node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Create fresh .next directory
mkdir -p .next

echo "Clean complete!"