const fs = require('fs').promises;
const path = require('path');
const { optimize } = require('svgo');

const config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeEmptyAttrs: false,
          cleanupIds: {
            minify: true
          }
        }
      }
    },
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'cleanupEnableBackground',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupIds',
    'cleanupNumericValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'removeRasterImages',
    'mergePaths',
    'convertShapeToPath',
    'sortAttrs',
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: '(stroke|fill):(black|none)'
      }
    }
  ]
};

async function optimizeSVGFiles() {
  const svgDir = path.join(__dirname, '../public/svg-examples');
  
  try {
    const files = await fs.readdir(svgDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    console.log(`Found ${svgFiles.length} SVG files to optimize`);
    
    let totalSaved = 0;
    
    for (const file of svgFiles) {
      const filePath = path.join(svgDir, file);
      const originalContent = await fs.readFile(filePath, 'utf8');
      const originalSize = Buffer.byteLength(originalContent, 'utf8');
      
      // Skip if file is already small
      if (originalSize < 5000) {
        console.log(`Skipping ${file} (already small: ${(originalSize / 1024).toFixed(2)}KB)`);
        continue;
      }
      
      try {
        const result = optimize(originalContent, { path: filePath, ...config });
        const optimizedSize = Buffer.byteLength(result.data, 'utf8');
        const savedBytes = originalSize - optimizedSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);
        
        if (savedBytes > 0) {
          await fs.writeFile(filePath, result.data);
          totalSaved += savedBytes;
          console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (saved ${savedPercent}%)`);
        } else {
          console.log(`- ${file}: Already optimized`);
        }
      } catch (error) {
        console.error(`✗ Error optimizing ${file}:`, error.message);
      }
    }
    
    console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

optimizeSVGFiles();