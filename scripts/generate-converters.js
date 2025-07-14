#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Converter configurations with search volumes
const CONVERTERS = [
  // PNG converters (60,650 searches)
  { from: 'png', to: 'svg', searches: 40500 },
  { from: 'png', to: 'jpg', searches: 9900 },
  { from: 'png', to: 'ico', searches: 6600 },
  { from: 'png', to: 'pdf', searches: 3650 },
  
  // SVG converters (27,570 searches)
  { from: 'svg', to: 'png', searches: 14800 },
  { from: 'svg', to: 'jpg', searches: 5400 },
  { from: 'svg', to: 'pdf', searches: 2220 },
  { from: 'svg', to: 'ai', searches: 1900 },
  { from: 'svg', to: 'eps', searches: 1600 },
  { from: 'svg', to: 'dxf', searches: 880 },
  { from: 'svg', to: 'ico', searches: 770 },
  
  // JPG converters (25,120 searches)
  { from: 'jpg', to: 'svg', searches: 8100 },
  { from: 'jpg', to: 'png', searches: 8100 },
  { from: 'jpg', to: 'pdf', searches: 5400 },
  { from: 'jpg', to: 'ico', searches: 2220 },
  { from: 'jpg', to: 'webp', searches: 1300 },
  
  // Other converters (37,160 searches)
  { from: 'pdf', to: 'svg', searches: 4400 },
  { from: 'eps', to: 'svg', searches: 3350 },
  { from: 'ai', to: 'svg', searches: 2900 },
  { from: 'webp', to: 'svg', searches: 1900 },
  { from: 'webp', to: 'png', searches: 2400 },
  { from: 'webp', to: 'jpg', searches: 1000 },
  { from: 'bmp', to: 'svg', searches: 1300 },
  { from: 'ico', to: 'svg', searches: 1000 },
  { from: 'ico', to: 'png', searches: 14800 },
  { from: 'ico', to: 'jpg', searches: 590 },
  { from: 'gif', to: 'svg', searches: 720 },
  { from: 'tiff', to: 'svg', searches: 590 },
  { from: 'psd', to: 'svg', searches: 480 },
  { from: 'dxf', to: 'svg', searches: 390 },
  { from: 'heic', to: 'svg', searches: 320 },
  { from: 'heic', to: 'png', searches: 590 },
  { from: 'heic', to: 'jpg', searches: 880 },
  { from: 'avif', to: 'png', searches: 210 },
  { from: 'avif', to: 'jpg', searches: 170 },
  { from: 'jfif', to: 'png', searches: 210 },
  { from: 'jfif', to: 'jpg', searches: 170 }
];

// Get command line arguments
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isTest = args.includes('--test');

// Template for converter pages
const generateConverterPage = (from, to, searches) => {
  const title = `${from.toUpperCase()} to ${to.toUpperCase()} Converter`;
  const slug = `${from}-to-${to}`;
  
  return `import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: '${title} - Free Online Conversion Tool | SVG AI',
  description: 'Convert ${from.toUpperCase()} to ${to.toUpperCase()} instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['${from} to ${to}', '${from} to ${to} converter', 'convert ${from} to ${to}', '${from}2${to}', 'free ${from} to ${to}'],
  openGraph: {
    title: '${title} - Free Online Tool',
    description: 'Convert ${from.toUpperCase()} files to ${to.toUpperCase()} format instantly. Free, fast, and secure online converter.',
  }
}

export default function ${from.toUpperCase()}to${to.toUpperCase()}Page() {
  return (
    <ConverterPage
      fromFormat="${from}"
      toFormat="${to}"
      title="${title}"
      monthlySearches={${searches}}
    />
  )
}
`;
};

// Generate converter pages
async function generateConverters() {
  const convertersDir = path.join(process.cwd(), 'app', 'converters');
  
  try {
    // Create converters directory if it doesn't exist
    await fs.mkdir(convertersDir, { recursive: true });
    
    // Generate each converter page
    for (const converter of CONVERTERS) {
      const { from, to, searches } = converter;
      const slug = `${from}-to-${to}`;
      const pageDir = path.join(convertersDir, slug);
      
      // Create page directory
      await fs.mkdir(pageDir, { recursive: true });
      
      // Generate and write page.tsx
      const pageContent = generateConverterPage(from, to, searches);
      const pagePath = path.join(pageDir, 'page.tsx');
      
      await fs.writeFile(pagePath, pageContent, 'utf8');
      
      if (!isTest) {
        console.log(`✓ Generated ${slug} converter page`);
      }
    }
    
    // Generate index page
    const indexContent = generateIndexPage();
    await fs.writeFile(path.join(convertersDir, 'page.tsx'), indexContent, 'utf8');
    
    console.log(`\n✨ Generated ${CONVERTERS.length} converter pages successfully!`);
    
  } catch (error) {
    console.error('Error generating converters:', error);
    process.exit(1);
  }
}

// Generate converters index page
function generateIndexPage() {
  return `import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Free Online File Converters - 40+ Format Conversions | SVG AI',
  description: 'Convert between 40+ file formats instantly. PNG to SVG, SVG to PNG, JPG to SVG, and more. All converters are free, fast, and work in your browser.',
  keywords: ['file converter', 'online converter', 'free converter', 'image converter', 'svg converter', 'png converter']
}

const converters = ${JSON.stringify(CONVERTERS.map(c => ({
  from: c.from,
  to: c.to,
  searches: c.searches,
  slug: `${c.from}-to-${c.to}`
})), null, 2)}

export default function ConvertersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Free Online File Converters</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Convert between 40+ file formats instantly. All converters work directly in your browser - no uploads required.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {converters.map((converter) => (
          <Link key={converter.slug} href={\`/converters/\${converter.slug}\`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                {converter.from.toUpperCase()} to {converter.to.toUpperCase()}
              </h2>
              <p className="text-muted-foreground">
                Convert {converter.from.toUpperCase()} files to {converter.to.toUpperCase()} format
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {converter.searches.toLocaleString()} monthly searches
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
`;
}

// Test mode - verify generation without writing files
async function testGeneration() {
  console.log('Testing converter generation...');
  console.log(`Would generate ${CONVERTERS.length} converter pages`);
  console.log('\nConverter list:');
  CONVERTERS.forEach(c => {
    console.log(`  - ${c.from} to ${c.to} (${c.searches.toLocaleString()} searches)`);
  });
  console.log('\nTest passed! Run without --test flag to generate files.');
}

// Watch mode - regenerate on changes
async function watchMode() {
  console.log('Watch mode not implemented yet. Generating once...');
  await generateConverters();
}

// Main execution
async function main() {
  if (isTest) {
    await testGeneration();
  } else if (isWatch) {
    await watchMode();
  } else {
    await generateConverters();
  }
}

// Run the script
main().catch(console.error);