/**
 * A/B Testing Framework - Main Export
 */

// Re-export everything from the main module
export * from './index'

// Export React components
export {
  ABTestProvider,
  ABTest,
  Variant,
  FeatureFlag,
  Rollout,
  ConversionTracker,
  MultiVariantTest,
  TestPreview,
  ExperimentDebugger,
  useABTest,
  useFeatureFlag,
  useFeatureValue,
  useRollout,
} from './components'

// Export experiments
export {
  converterLayoutTest,
  ctaButtonTest,
  galleryGridTest,
  pricingDisplayTest,
  heroVariationsTest,
  mobileConverterUITest,
  allExperiments,
  initializeExperiments,
  featureFlags,
  rollouts,
  getCurrentRolloutPercentage,
} from './experiments'

// Export admin dashboard
export { ABTestDashboard } from './admin-dashboard'

// Export utilities
export {
  ABTestingQA,
  ABTestingPrivacy,
  ABTestingPerformance,
  ABTestValidator,
  ABTestingURL,
  ABTestingKillSwitch,
  exportTestResults,
} from './utils'