#!/bin/bash

echo "🚀 Building for production..."
npm run build

echo "✅ Build complete! Starting production server..."
echo "📊 Once started, test at http://localhost:3000"
echo "⚡ This will show REAL performance metrics!"
npm start