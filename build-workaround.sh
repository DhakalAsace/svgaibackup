#!/bin/bash

echo "Build workaround script..."

# Check if .next.backup exists and use it
if [ -d ".next.backup" ]; then
    echo "Found .next.backup, removing it first..."
    rm -rf .next.backup 2>/dev/null || true
fi

# Rename the corrupted .next to backup
if [ -d ".next" ]; then
    echo "Moving corrupted .next to .next.backup..."
    mv .next .next.backup 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "Warning: Could not move .next directory. Trying to work around it..."
        # Create a new build directory
        export NEXT_BUILD_DIR=".next-build"
        echo "Using alternate build directory: $NEXT_BUILD_DIR"
    fi
fi

# Create fresh .next directory if it doesn't exist
if [ ! -d ".next" ]; then
    mkdir -p .next
    echo "Created fresh .next directory"
fi

# Run the build
echo "Starting build..."
npm run build