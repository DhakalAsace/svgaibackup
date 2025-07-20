#!/usr/bin/env node

/**
 * Clean Build Script
 * 1. Removes console.log statements from production builds
 * 2. Cleans .next directory
 * 3. Runs the build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define directories to clean console.logs from
const directoriesToClean = [
  'app',
  'components', 
  'lib',
  'scripts',
  'services',
  'utils'
];

// Define file extensions to process
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

let totalConsoleLogsRemoved = 0;
let filesProcessed = 0;

/**
 * Remove console.log statements from a file
 * @param {string} filePath - Path to the file
 */
function removeConsoleLogsFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Multiple patterns to catch various console.log formats
    const patterns = [
      // Standard console.log
      /console\s*\.\s*log\s*\([^)]*\)\s*;?/g,
      // Console.error, console.warn, console.info, console.debug
      /console\s*\.\s*(error|warn|info|debug|trace|time|timeEnd|group|groupEnd)\s*\([^)]*\)\s*;?/g,
      // Multi-line console.log (simplified to avoid complex parsing)
      /console\s*\.\s*log\s*\([^;]+\);?/g,
      // Debugging console statements
      /\/\/\s*console\s*\.\s*log.*$/gm,
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        totalConsoleLogsRemoved += matches.length;
        content = content.replace(pattern, '');
      }
    });
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    filesProcessed++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 * @param {string} dir - Directory path
 */
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath);
      if (fileExtensions.includes(ext)) {
        removeConsoleLogsFromFile(fullPath);
      }
    }
  });
}

console.log('🧹 Starting production build cleanup...\n');

// Step 1: Remove console.log statements
console.log('📝 Removing console.log statements...');
directoriesToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    processDirectory(fullPath);
  }
});

console.log(`✓ Removed ${totalConsoleLogsRemoved} console statements from ${filesProcessed} files\n`);

// Step 2: Clean .next directory
console.log('🗑️  Cleaning build directories...');
const nextDir = path.join(process.cwd(), '.next');

try {
  if (fs.existsSync(nextDir)) {
    if (process.platform === 'win32') {
      try {
        execSync(`rmdir /s /q "${nextDir}"`, { stdio: 'inherit' });
      } catch (e) {
        console.log('⚠️  Could not remove .next directory, continuing anyway...');
      }
    } else {
      execSync(`rm -rf "${nextDir}"`, { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.log('⚠️  Could not clean .next directory:', error.message);
}

// Create a fresh .next directory
try {
  fs.mkdirSync(nextDir, { recursive: true });
} catch (error) {
  console.log('⚠️  Could not create .next directory:', error.message);
}

// Step 3: Run the build
console.log('\n🏗️  Starting Next.js build...');

try {
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n✅ Build completed successfully!');
console.log(`📊 Build stats:`);
console.log(`   - Console statements removed: ${totalConsoleLogsRemoved}`);
console.log(`   - Files processed: ${filesProcessed}`);