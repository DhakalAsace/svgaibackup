const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// All 40 converters grouped for parallel testing
const converterGroups = [
  {
    name: 'Popular Converters',
    agent: 'Sub-Agent-1',
    converters: [
      { slug: 'png-to-svg', searches: 40500 },
      { slug: 'svg-to-png', searches: 33100 },
      { slug: 'jpg-to-svg', searches: 22200 },
      { slug: 'svg-to-pdf', searches: 8100 },
      { slug: 'webp-to-svg', searches: 1900 }
    ]
  },
  {
    name: 'Image to SVG',
    agent: 'Sub-Agent-2',
    converters: [
      { slug: 'bmp-to-svg', searches: 1000 },
      { slug: 'gif-to-svg', searches: 1600 },
      { slug: 'tiff-to-svg', searches: 720 },
      { slug: 'ico-to-svg', searches: 480 },
      { slug: 'heic-to-svg', searches: 320 }
    ]
  },
  {
    name: 'SVG to Image',
    agent: 'Sub-Agent-3',
    converters: [
      { slug: 'svg-to-jpg', searches: 6600 },
      { slug: 'svg-to-webp', searches: 880 },
      { slug: 'svg-to-bmp', searches: 590 },
      { slug: 'svg-to-gif', searches: 1900 },
      { slug: 'svg-to-tiff', searches: 390 }
    ]
  },
  {
    name: 'Vector Formats',
    agent: 'Sub-Agent-4',
    converters: [
      { slug: 'svg-to-eps', searches: 1300 },
      { slug: 'eps-to-svg', searches: 2400 },
      { slug: 'svg-to-ai', searches: 880 },
      { slug: 'ai-to-svg', searches: 1600 },
      { slug: 'svg-to-dxf', searches: 2900 }
    ]
  },
  {
    name: 'Document Converters',
    agent: 'Sub-Agent-5',
    converters: [
      { slug: 'pdf-to-svg', searches: 5400 },
      { slug: 'svg-to-html', searches: 1300 },
      { slug: 'svg-to-canvas', searches: 590 },
      { slug: 'dxf-to-svg', searches: 1900 },
      { slug: 'svg-to-wmf', searches: 210 }
    ]
  },
  {
    name: 'Specialized',
    agent: 'Sub-Agent-6',
    converters: [
      { slug: 'svg-to-base64', searches: 2400 },
      { slug: 'base64-to-svg', searches: 880 },
      { slug: 'svg-to-react', searches: 1600 },
      { slug: 'svg-to-vue', searches: 390 },
      { slug: 'svg-to-css', searches: 720 }
    ]
  },
  {
    name: 'Mobile & App',
    agent: 'Sub-Agent-7',
    converters: [
      { slug: 'svg-to-android', searches: 480 },
      { slug: 'svg-to-xaml', searches: 210 },
      { slug: 'svg-to-swiftui', searches: 170 },
      { slug: 'text-to-svg', searches: 1900 },
      { slug: 'svg-to-font', searches: 590 }
    ]
  },
  {
    name: 'Data & Other',
    agent: 'Sub-Agent-8',
    converters: [
      { slug: 'csv-to-svg', searches: 320 },
      { slug: 'json-to-svg', searches: 480 },
      { slug: 'svg-to-emf', searches: 170 },
      { slug: 'svg-to-ico', searches: 1000 },
      { slug: 'svg-converter', searches: 8100 }
    ]
  }
];

// Worker thread code
if (!isMainThread) {
  const { group } = workerData;
  
  async function testConverter(converter) {
    const startTime = Date.now();
    const url = `http://localhost:3000/convert/${converter.slug}`;
    
    return new Promise((resolve) => {
      http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const endTime = Date.now();
          const result = {
            converter: converter.slug,
            searches: converter.searches,
            status: res.statusCode,
            loadTime: endTime - startTime,
            hasError: data.includes('Error:') || data.includes('error'),
            isComingSoon: data.includes('Coming Soon') || data.includes('coming soon'),
            hasUploadInterface: data.includes('upload') || data.includes('Drop'),
            timestamp: new Date().toISOString()
          };
          resolve(result);
        });
      }).on('error', (err) => {
        resolve({
          converter: converter.slug,
          searches: converter.searches,
          status: 'error',
          error: err.message,
          timestamp: new Date().toISOString()
        });
      });
    });
  }
  
  // Test all converters in this group
  (async () => {
    console.log(`${group.agent} starting tests for ${group.name}...`);
    const results = [];
    
    for (const converter of group.converters) {
      console.log(`${group.agent}: Testing ${converter.slug}...`);
      const result = await testConverter(converter);
      results.push(result);
    }
    
    parentPort.postMessage({
      agent: group.agent,
      group: group.name,
      results: results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 200).length,
        errors: results.filter(r => r.status === 'error' || r.hasError).length,
        comingSoon: results.filter(r => r.isComingSoon).length,
        implemented: results.filter(r => !r.isComingSoon && r.hasUploadInterface).length
      }
    });
  })();
}

// Main thread code
if (isMainThread) {
  console.log('🚀 Starting Parallel Converter Testing with 8 Sub-Agents\n');
  console.log('Each sub-agent will test 5 converters simultaneously...\n');
  
  const startTime = Date.now();
  const workers = [];
  const results = [];
  
  // Launch all workers (sub-agents) in parallel
  converterGroups.forEach((group, index) => {
    const worker = new Worker(__filename, {
      workerData: { group }
    });
    
    worker.on('message', (result) => {
      results.push(result);
      console.log(`\n✅ ${result.agent} completed testing ${result.group}`);
      console.log(`   Total: ${result.summary.total}, Implemented: ${result.summary.implemented}, Coming Soon: ${result.summary.comingSoon}`);
    });
    
    worker.on('error', (err) => {
      console.error(`❌ ${group.agent} error:`, err);
    });
    
    workers.push(worker);
  });
  
  // Wait for all workers to complete
  Promise.all(workers.map(w => new Promise(resolve => w.on('exit', resolve)))).then(async () => {
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    // Generate comprehensive report
    const report = {
      testRun: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        totalDuration: `${totalTime}s`,
        parallelAgents: 8,
        totalConverters: 40
      },
      agentResults: results,
      overallSummary: {
        totalTested: results.reduce((sum, r) => sum + r.summary.total, 0),
        totalImplemented: results.reduce((sum, r) => sum + r.summary.implemented, 0),
        totalComingSoon: results.reduce((sum, r) => sum + r.summary.comingSoon, 0),
        totalErrors: results.reduce((sum, r) => sum + r.summary.errors, 0)
      }
    };
    
    // Save results
    const resultsDir = path.join(__dirname, '../test-results/parallel-tests');
    await fs.mkdir(resultsDir, { recursive: true });
    await fs.writeFile(
      path.join(resultsDir, 'parallel-test-results.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Generate markdown report
    let mdReport = `# Parallel Converter Testing Report\n\n`;
    mdReport += `**Test Duration:** ${totalTime}s with 8 parallel sub-agents\n\n`;
    mdReport += `## Overall Summary\n\n`;
    mdReport += `- Total Converters Tested: ${report.overallSummary.totalTested}\n`;
    mdReport += `- Implemented: ${report.overallSummary.totalImplemented}\n`;
    mdReport += `- Coming Soon: ${report.overallSummary.totalComingSoon}\n`;
    mdReport += `- Errors: ${report.overallSummary.totalErrors}\n\n`;
    
    mdReport += `## Sub-Agent Results\n\n`;
    results.forEach(agentResult => {
      mdReport += `### ${agentResult.agent}: ${agentResult.group}\n\n`;
      agentResult.results.forEach(r => {
        const status = r.status === 200 ? '✅' : '❌';
        const impl = r.isComingSoon ? '🔜 Coming Soon' : r.hasUploadInterface ? '✅ Implemented' : '❓ Unknown';
        mdReport += `- **${r.converter}** (${r.searches} searches): ${status} ${impl} - ${r.loadTime}ms\n`;
      });
      mdReport += '\n';
    });
    
    await fs.writeFile(
      path.join(resultsDir, 'parallel-test-report.md'),
      mdReport
    );
    
    console.log('\n\n🎉 All parallel tests completed!');
    console.log(`📊 Total time: ${totalTime}s for 40 converters`);
    console.log(`⚡ Average time per converter: ${(totalTime / 40).toFixed(2)}s`);
    console.log(`📁 Results saved to test-results/parallel-tests/`);
  });
}