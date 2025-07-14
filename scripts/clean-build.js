const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning build directories...');

const nextDir = path.join(process.cwd(), '.next');

// Try to remove .next directory
try {
  if (fs.existsSync(nextDir)) {
    // On Windows, sometimes we need to remove files individually
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

console.log('🏗️  Starting build...');

// Run the build
try {
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('✅ Build completed successfully!');