#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface VisualTestReport {
  timestamp: string;
  totalTests: number;
  pages: Record<string, {
    viewports: Record<string, {
      performance: {
        firstContentfulPaint: number;
        domContentLoaded: number;
        layoutShifts: number;
      };
      hasAccessibilityIssues: boolean;
    }>;
    averagePerformance: {
      firstContentfulPaint: number;
      domContentLoaded: number;
      layoutShifts: number;
    };
  }>;
}

async function runVisualTests() {
  console.log('🎨 Starting Visual Consistency Tests...\n');

  try {
    // Install Playwright if not already installed
    console.log('📦 Ensuring Playwright is installed...');
    execSync('npx playwright install', { stdio: 'inherit' });

    // Run the visual tests
    console.log('\n🧪 Running visual consistency tests...');
    execSync('npx playwright test visual-regression/visual-consistency.spec.ts', { 
      stdio: 'inherit' 
    });

    // Read the generated summary
    const summaryPath = join(process.cwd(), 'tests/visual-regression/visual-consistency-summary.json');
    
    if (existsSync(summaryPath)) {
      const summary: VisualTestReport = JSON.parse(readFileSync(summaryPath, 'utf8'));
      
      // Generate markdown report
      let report = `# Visual Consistency Test Report\n\n`;
      report += `**Generated:** ${new Date(summary.timestamp).toLocaleString()}\n\n`;
      report += `**Total Pages Tested:** ${Object.keys(summary.pages).length}\n`;
      report += `**Total Test Configurations:** ${summary.totalTests}\n\n`;
      
      report += `## Performance Summary\n\n`;
      report += `| Page | Avg FCP (ms) | Avg DOM Load (ms) | Avg Layout Shifts | Status |\n`;
      report += `|------|--------------|-------------------|-------------------|--------|\n`;
      
      const performanceIssues: string[] = [];
      const accessibilityIssues: string[] = [];
      
      Object.entries(summary.pages).forEach(([page, data]) => {
        const fcp = data.averagePerformance.firstContentfulPaint;
        const domLoad = data.averagePerformance.domContentLoaded;
        const shifts = data.averagePerformance.layoutShifts;
        
        // Check for issues
        const hasPerformanceIssue = fcp > 3000 || shifts > 5;
        const hasA11yIssue = Object.values(data.viewports).some(v => v.hasAccessibilityIssues);
        
        if (hasPerformanceIssue) {
          performanceIssues.push(page);
        }
        if (hasA11yIssue) {
          accessibilityIssues.push(page);
        }
        
        const status = hasPerformanceIssue || hasA11yIssue ? '⚠️' : '✅';
        
        report += `| ${page} | ${fcp.toFixed(0)} | ${domLoad.toFixed(0)} | ${shifts.toFixed(1)} | ${status} |\n`;
      });
      
      // Add issues section
      if (performanceIssues.length > 0 || accessibilityIssues.length > 0) {
        report += `\n## Issues Found\n\n`;
        
        if (performanceIssues.length > 0) {
          report += `### Performance Issues\n\n`;
          report += `The following pages have performance concerns:\n\n`;
          performanceIssues.forEach(page => {
            report += `- **${page}**: FCP > 3000ms or excessive layout shifts\n`;
          });
        }
        
        if (accessibilityIssues.length > 0) {
          report += `\n### Accessibility Issues\n\n`;
          report += `The following pages have accessibility concerns:\n\n`;
          accessibilityIssues.forEach(page => {
            report += `- **${page}**: Missing alt text or aria labels\n`;
          });
        }
      }
      
      // Add recommendations
      report += `\n## Recommendations\n\n`;
      report += `### Visual Consistency\n\n`;
      report += `1. **Button Styles**: Ensure all CTA buttons use consistent colors, padding, and border radius\n`;
      report += `2. **Typography Hierarchy**: Maintain consistent font sizes and line heights across pages\n`;
      report += `3. **Spacing**: Use consistent padding/margin values from the design system\n`;
      report += `4. **Mobile Responsiveness**: Test all CTAs and grids on mobile viewports\n\n`;
      
      report += `### Performance Optimization\n\n`;
      report += `1. **Lazy Loading**: Implement lazy loading for SVG galleries\n`;
      report += `2. **Code Splitting**: Split converter-specific code into separate bundles\n`;
      report += `3. **Image Optimization**: Use Next.js Image component for all images\n`;
      report += `4. **Reduce Layout Shifts**: Set explicit dimensions for images and dynamic content\n\n`;
      
      report += `### Accessibility Improvements\n\n`;
      report += `1. **Alt Text**: Add descriptive alt text to all SVG images\n`;
      report += `2. **ARIA Labels**: Ensure all interactive elements have proper labels\n`;
      report += `3. **Color Contrast**: Verify all text meets WCAG AA standards (4.5:1 ratio)\n`;
      report += `4. **Keyboard Navigation**: Test all interactive elements with keyboard only\n\n`;
      
      report += `### Next Steps\n\n`;
      report += `1. Review screenshots in \`tests/visual-regression/screenshots/\`\n`;
      report += `2. Open HTML report: \`npx playwright show-report tests/visual-regression/html-report\`\n`;
      report += `3. Fix identified issues prioritizing performance and accessibility\n`;
      report += `4. Re-run tests after fixes to verify improvements\n`;
      
      // Write markdown report
      const reportPath = join(process.cwd(), 'tests/visual-regression/VISUAL_TEST_REPORT.md');
      writeFileSync(reportPath, report);
      
      console.log(`\n✅ Visual tests completed!`);
      console.log(`📊 Report generated: ${reportPath}`);
      console.log(`🖼️  Screenshots saved: tests/visual-regression/screenshots/`);
      console.log(`📈 HTML Report: Run 'npx playwright show-report tests/visual-regression/html-report'`);
      
      // Print summary
      console.log('\n📋 Quick Summary:');
      console.log(`   - Pages tested: ${Object.keys(summary.pages).length}`);
      console.log(`   - Performance issues: ${performanceIssues.length}`);
      console.log(`   - Accessibility issues: ${accessibilityIssues.length}`);
      
      if (performanceIssues.length === 0 && accessibilityIssues.length === 0) {
        console.log('\n🎉 All pages passed visual consistency checks!');
      } else {
        console.log('\n⚠️  Some issues were found. Please review the full report.');
      }
      
    } else {
      console.error('❌ Summary file not found. Tests may have failed.');
    }
    
  } catch (error) {
    console.error('❌ Error running visual tests:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runVisualTests();
}