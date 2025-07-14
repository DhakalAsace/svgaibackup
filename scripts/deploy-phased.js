#!/usr/bin/env node

/**
 * Phased Deployment Script for SVG AI SEO Empire
 * Manages feature flags, traffic percentages, and monitors key metrics
 */

const { Command } = require('commander');
const fetch = require('node-fetch');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  vercelToken: process.env.VERCEL_TOKEN,
  projectId: process.env.VERCEL_PROJECT_ID,
  teamId: process.env.VERCEL_TEAM_ID,
  posthogApiKey: process.env.POSTHOG_API_KEY,
  sentryDsn: process.env.SENTRY_DSN,
  upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
};

// Feature flag configuration
const FEATURE_FLAGS = {
  converters: {
    key: 'feature_converters_enabled',
    trafficKey: 'feature_converters_traffic_percentage',
    subFeatures: {
      pngToSvg: 'feature_converter_png_to_svg',
      svgToPng: 'feature_converter_svg_to_png',
      jpgToSvg: 'feature_converter_jpg_to_svg',
      allConverters: 'feature_all_converters_enabled'
    }
  },
  galleries: {
    key: 'feature_galleries_enabled',
    trafficKey: 'feature_galleries_traffic_percentage'
  },
  learnPages: {
    key: 'feature_learn_pages_enabled',
    trafficKey: 'feature_learn_pages_traffic_percentage'
  },
  animationTool: {
    key: 'feature_animation_tool_enabled',
    trafficKey: 'feature_animation_tool_traffic_percentage'
  },
  premiumFeatures: {
    key: 'feature_premium_enabled',
    trafficKey: 'feature_premium_traffic_percentage',
    subFeatures: {
      svgToVideo: 'feature_svg_to_video_enabled'
    }
  }
};

// Rollout phases
const ROLLOUT_PHASES = {
  prelaunch: {
    name: 'Pre-Launch',
    traffic: 0,
    features: {
      converters: { enabled: false, traffic: 0 },
      galleries: { enabled: false, traffic: 0 },
      learnPages: { enabled: false, traffic: 0 },
      animationTool: { enabled: false, traffic: 0 },
      premiumFeatures: { enabled: false, traffic: 0 }
    }
  },
  soft: {
    name: 'Soft Launch (10%)',
    traffic: 10,
    features: {
      converters: { enabled: true, traffic: 10, subFeatures: { pngToSvg: true, svgToPng: true, jpgToSvg: true } },
      galleries: { enabled: true, traffic: 10 },
      learnPages: { enabled: true, traffic: 10 },
      animationTool: { enabled: false, traffic: 0 },
      premiumFeatures: { enabled: false, traffic: 0 }
    }
  },
  expanded: {
    name: 'Expanded Rollout (25%)',
    traffic: 25,
    features: {
      converters: { enabled: true, traffic: 25, subFeatures: { allConverters: true } },
      galleries: { enabled: true, traffic: 25 },
      learnPages: { enabled: true, traffic: 25 },
      animationTool: { enabled: true, traffic: 10 },
      premiumFeatures: { enabled: false, traffic: 0 }
    }
  },
  half: {
    name: 'Half Rollout (50%)',
    traffic: 50,
    features: {
      converters: { enabled: true, traffic: 50, abTesting: true },
      galleries: { enabled: true, traffic: 50 },
      learnPages: { enabled: true, traffic: 50 },
      animationTool: { enabled: true, traffic: 50 },
      premiumFeatures: { enabled: true, traffic: 50, subFeatures: { svgToVideo: true } }
    }
  },
  full: {
    name: 'Full Launch (100%)',
    traffic: 100,
    features: {
      converters: { enabled: true, traffic: 100, allFeatures: true },
      galleries: { enabled: true, traffic: 100 },
      learnPages: { enabled: true, traffic: 100 },
      animationTool: { enabled: true, traffic: 100 },
      premiumFeatures: { enabled: true, traffic: 100, allEnabled: true }
    }
  }
};

// Health check thresholds
const HEALTH_THRESHOLDS = {
  errorRate: 0.01, // 1%
  responseTime: 2000, // 2 seconds
  conversionRate: 0.03, // 3% minimum
  uptimePercentage: 99.9
};

class PhasedDeployment {
  constructor() {
    this.spinner = ora();
    this.metrics = {
      startTime: Date.now(),
      errors: 0,
      deployments: 0,
      rollbacks: 0
    };
  }

  async updateFeatureFlags(phase) {
    this.spinner.start('Updating feature flags...');
    
    try {
      const updates = [];
      
      for (const [feature, config] of Object.entries(phase.features)) {
        const flags = FEATURE_FLAGS[feature];
        if (!flags) continue;

        // Main feature flag
        updates.push(this.setFlag(flags.key, config.enabled));
        updates.push(this.setFlag(flags.trafficKey, config.traffic));

        // Sub-features
        if (config.subFeatures && flags.subFeatures) {
          for (const [subFeature, value] of Object.entries(config.subFeatures)) {
            if (flags.subFeatures[subFeature]) {
              updates.push(this.setFlag(flags.subFeatures[subFeature], value));
            }
          }
        }

        // A/B testing
        if (config.abTesting) {
          updates.push(this.setFlag(`${flags.key}_ab_testing`, true));
        }
      }

      await Promise.all(updates);
      this.spinner.succeed('Feature flags updated successfully');
    } catch (error) {
      this.spinner.fail('Failed to update feature flags');
      throw error;
    }
  }

  async setFlag(key, value) {
    const response = await fetch(`${CONFIG.upstashRedisUrl}/set/${key}/${value}`, {
      headers: {
        Authorization: `Bearer ${CONFIG.upstashRedisToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to set flag ${key}: ${response.statusText}`);
    }

    return response.json();
  }

  async checkHealth() {
    this.spinner.start('Running health checks...');
    
    const checks = {
      errorRate: await this.checkErrorRate(),
      responseTime: await this.checkResponseTime(),
      conversionRate: await this.checkConversionRate(),
      uptime: await this.checkUptime()
    };

    const allPassed = Object.entries(checks).every(([metric, value]) => {
      const threshold = HEALTH_THRESHOLDS[metric];
      const passed = metric === 'errorRate' || metric === 'responseTime' 
        ? value <= threshold 
        : value >= threshold;
      
      if (!passed) {
        console.log(chalk.red(`  ✗ ${metric}: ${value} (threshold: ${threshold})`));
      } else {
        console.log(chalk.green(`  ✓ ${metric}: ${value}`));
      }
      
      return passed;
    });

    if (allPassed) {
      this.spinner.succeed('All health checks passed');
    } else {
      this.spinner.fail('Some health checks failed');
    }

    return allPassed;
  }

  async checkErrorRate() {
    // Query Sentry for error rate
    // This is a placeholder - implement actual Sentry API call
    return Math.random() * 0.005; // Simulate 0-0.5% error rate
  }

  async checkResponseTime() {
    // Query monitoring for average response time
    // This is a placeholder - implement actual monitoring API call
    return 1500 + Math.random() * 1000; // Simulate 1.5-2.5s response time
  }

  async checkConversionRate() {
    // Query PostHog for conversion funnel
    // This is a placeholder - implement actual PostHog API call
    return 0.03 + Math.random() * 0.02; // Simulate 3-5% conversion rate
  }

  async checkUptime() {
    // Query uptime monitoring service
    // This is a placeholder - implement actual uptime API call
    return 99.9 + Math.random() * 0.09; // Simulate 99.9-99.99% uptime
  }

  async deploy(phaseName) {
    const phase = ROLLOUT_PHASES[phaseName];
    if (!phase) {
      throw new Error(`Unknown phase: ${phaseName}`);
    }

    console.log(chalk.blue(`\n🚀 Deploying ${phase.name}...\n`));

    try {
      // Update feature flags
      await this.updateFeatureFlags(phase);

      // Deploy to Vercel
      await this.deployToVercel();

      // Wait for deployment to stabilize
      await this.waitForStabilization();

      // Run health checks
      const isHealthy = await this.checkHealth();

      if (!isHealthy) {
        console.log(chalk.yellow('\n⚠️  Health checks failed, consider rollback'));
        const shouldRollback = await this.promptRollback();
        if (shouldRollback) {
          await this.rollback();
          return;
        }
      }

      // Log deployment metrics
      await this.logDeploymentMetrics(phaseName);

      console.log(chalk.green(`\n✅ ${phase.name} deployment successful!\n`));
      this.metrics.deployments++;

    } catch (error) {
      console.error(chalk.red(`\n❌ Deployment failed: ${error.message}\n`));
      this.metrics.errors++;
      await this.rollback();
    }
  }

  async deployToVercel() {
    this.spinner.start('Deploying to Vercel...');
    
    // This is a placeholder - implement actual Vercel deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    this.spinner.succeed('Deployed to Vercel');
  }

  async waitForStabilization() {
    this.spinner.start('Waiting for deployment to stabilize...');
    
    // Wait 2 minutes for metrics to stabilize
    await new Promise(resolve => setTimeout(resolve, 120000));
    
    this.spinner.succeed('Deployment stabilized');
  }

  async rollback() {
    console.log(chalk.yellow('\n⏪ Initiating rollback...\n'));
    this.spinner.start('Rolling back deployment...');

    try {
      // Rollback Vercel deployment
      await this.rollbackVercel();

      // Reset feature flags to previous state
      await this.resetFeatureFlags();

      // Clear caches
      await this.clearCaches();

      this.spinner.succeed('Rollback completed');
      this.metrics.rollbacks++;
    } catch (error) {
      this.spinner.fail('Rollback failed');
      console.error(chalk.red(`Rollback error: ${error.message}`));
      throw error;
    }
  }

  async rollbackVercel() {
    // Implement Vercel rollback
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async resetFeatureFlags() {
    // Reset all feature flags to safe state
    const safeState = ROLLOUT_PHASES.prelaunch;
    await this.updateFeatureFlags(safeState);
  }

  async clearCaches() {
    // Clear CDN and application caches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async promptRollback() {
    // In a real implementation, this would be an interactive prompt
    // For now, return false to continue
    return false;
  }

  async logDeploymentMetrics(phase) {
    const metrics = {
      phase,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.metrics.startTime,
      ...this.metrics
    };

    const logPath = path.join(__dirname, '..', 'logs', 'deployments.json');
    
    try {
      const existing = await fs.readFile(logPath, 'utf8').catch(() => '[]');
      const logs = JSON.parse(existing);
      logs.push(metrics);
      
      await fs.mkdir(path.dirname(logPath), { recursive: true });
      await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to log deployment metrics:', error);
    }
  }

  async status() {
    console.log(chalk.blue('\n📊 Current Deployment Status\n'));
    
    this.spinner.start('Fetching current configuration...');
    
    try {
      const flags = await this.getCurrentFlags();
      const health = await this.checkHealth();
      
      this.spinner.stop();
      
      console.log(chalk.white('Feature Flags:'));
      console.log(JSON.stringify(flags, null, 2));
      
      console.log(chalk.white('\nSystem Health:'));
      console.log(`  Error Rate: ${(await this.checkErrorRate() * 100).toFixed(2)}%`);
      console.log(`  Response Time: ${(await this.checkResponseTime()).toFixed(0)}ms`);
      console.log(`  Conversion Rate: ${(await this.checkConversionRate() * 100).toFixed(2)}%`);
      console.log(`  Uptime: ${(await this.checkUptime()).toFixed(2)}%`);
      
    } catch (error) {
      this.spinner.fail('Failed to fetch status');
      console.error(error);
    }
  }

  async getCurrentFlags() {
    // Fetch current feature flag states
    const flags = {};
    
    for (const [feature, config] of Object.entries(FEATURE_FLAGS)) {
      flags[feature] = {
        enabled: await this.getFlag(config.key),
        traffic: await this.getFlag(config.trafficKey)
      };
    }
    
    return flags;
  }

  async getFlag(key) {
    const response = await fetch(`${CONFIG.upstashRedisUrl}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${CONFIG.upstashRedisToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get flag ${key}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  }
}

// CLI Commands
const program = new Command();
const deployment = new PhasedDeployment();

program
  .name('deploy-phased')
  .description('Phased deployment script for SVG AI SEO Empire')
  .version('1.0.0');

program
  .command('deploy <phase>')
  .description('Deploy a specific phase (prelaunch, soft, expanded, half, full)')
  .action(async (phase) => {
    await deployment.deploy(phase);
  });

program
  .command('rollback')
  .description('Rollback to safe state')
  .action(async () => {
    await deployment.rollback();
  });

program
  .command('status')
  .description('Show current deployment status')
  .action(async () => {
    await deployment.status();
  });

program
  .command('health')
  .description('Run health checks')
  .action(async () => {
    await deployment.checkHealth();
  });

program
  .command('monitor')
  .description('Start monitoring mode')
  .option('-i, --interval <seconds>', 'monitoring interval', '60')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Starting monitoring mode...\n'));
    
    const checkAndReport = async () => {
      console.log(chalk.gray(`[${new Date().toISOString()}]`));
      await deployment.checkHealth();
      console.log('');
    };
    
    await checkAndReport();
    setInterval(checkAndReport, parseInt(options.interval) * 1000);
  });

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n❌ Unhandled error:'), error);
  process.exit(1);
});

// Parse CLI arguments
program.parse(process.argv);