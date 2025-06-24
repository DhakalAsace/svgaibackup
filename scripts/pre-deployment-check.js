#!/usr/bin/env node

/**
 * Pre-deployment checklist script
 * Run this before deploying to Vercel to ensure everything is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Running pre-deployment checks...\n');

let errors = 0;
let warnings = 0;

// Check for required files
const requiredFiles = [
  '.env.example',
  '.gitignore',
  'package.json',
  'next.config.mjs',
  'middleware.ts',
  'lib/supabase.ts',
  'lib/validation-schemas.ts'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    errors++;
  }
});

// Check .gitignore contains sensitive files
console.log('\n🔒 Checking .gitignore...');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const sensitivePatterns = ['.env', '.env.local', '.env.production', '.mcp.json'];
sensitivePatterns.forEach(pattern => {
  if (gitignore.includes(pattern)) {
    console.log(`  ✅ ${pattern} is ignored`);
  } else {
    console.log(`  ⚠️  ${pattern} should be in .gitignore`);
    warnings++;
  }
});

// Check for hardcoded secrets
console.log('\n🔍 Checking for hardcoded secrets...');
const filesToCheck = [
  'lib/stripe-config.ts',
  'lib/supabase.ts',
  'app/api/generate-svg/route.ts',
  'app/api/generate-icon/route.ts'
];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const secretPatterns = [
      /sk_live_/,
      /sk_test_/,
      /whsec_/,
      /eyJhbGciOi/,
      /https:\/\/[a-z]+\.supabase\.co/
    ];
    
    let hasSecrets = false;
    secretPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasSecrets = true;
      }
    });
    
    if (hasSecrets) {
      console.log(`  ❌ ${file} - Contains hardcoded secrets!`);
      errors++;
    } else {
      console.log(`  ✅ ${file} - No secrets found`);
    }
  }
});

// Check environment variables in .env.example
console.log('\n📋 Checking .env.example completeness...');
const envExample = fs.readFileSync('.env.example', 'utf8');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_STARTER_MONTHLY',
  'STRIPE_PRICE_STARTER_ANNUAL',
  'STRIPE_PRICE_PRO_MONTHLY',
  'STRIPE_PRICE_PRO_ANNUAL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'OPENAI_API_KEY_ONE',
  'REPLICATE_API_TOKEN'
];

requiredEnvVars.forEach(envVar => {
  if (envExample.includes(envVar)) {
    console.log(`  ✅ ${envVar}`);
  } else {
    console.log(`  ❌ ${envVar} - Missing from .env.example`);
    errors++;
  }
});

// Check if local .env.local exists (optional)
console.log('\n🔧 Local environment check...');
if (fs.existsSync('.env.local')) {
  console.log('  ✅ .env.local exists');
  
  // Check if it has actual values (not placeholders)
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  if (envLocal.includes('your_') || envLocal.includes('xxx')) {
    console.log('  ⚠️  .env.local contains placeholder values');
    warnings++;
  }
} else {
  console.log('  ℹ️  .env.local not found (will need to set in Vercel)');
}

// Summary
console.log('\n📊 Summary:');
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Please fix the errors before deploying!');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Deployment possible but review warnings');
  process.exit(0);
} else {
  console.log('\n✅ All checks passed! Ready for deployment');
  process.exit(0);
}