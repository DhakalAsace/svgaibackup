/**
 * Analytics Tracking Configuration
 * Centralized configuration for all analytics events across the application
 */

export interface AnalyticsEvent {
  name: string
  category: string
  description: string
  parameters?: Record<string, any>
  customDimensions?: string[]
}

export interface ConversionGoal {
  id: string
  name: string
  type: 'destination' | 'duration' | 'pages' | 'event'
  value?: number
  conditions: Record<string, any>
}

// Custom dimensions configuration
export const CUSTOM_DIMENSIONS = {
  USER_TYPE: 'dimension1', // free/paid/trial
  CONVERTER_TYPE: 'dimension2', // png-to-svg, svg-to-png, etc.
  CONTENT_CATEGORY: 'dimension3', // converter/gallery/learn/tool
  SESSION_QUALITY: 'dimension4', // engaged/bounced/converted
  FEATURE_TIER: 'dimension5', // free/premium
  REFERRAL_SOURCE: 'dimension6', // organic/paid/social/direct
  AB_TEST_VARIANT: 'dimension7', // test variants
  USER_JOURNEY_STAGE: 'dimension8', // awareness/consideration/decision
} as const

// Event categories
export const EVENT_CATEGORIES = {
  // Converter events
  CONVERTER: 'converter',
  CONVERTER_ERROR: 'converter_error',
  CONVERTER_PERFORMANCE: 'converter_performance',
  
  // Gallery events
  GALLERY: 'gallery',
  GALLERY_INTERACTION: 'gallery_interaction',
  
  // Tool events
  TOOL_EDITOR: 'tool_editor',
  TOOL_OPTIMIZER: 'tool_optimizer',
  TOOL_ANIMATOR: 'tool_animator',
  
  // Premium feature events
  PREMIUM_VIDEO_EXPORT: 'premium_video_export',
  PREMIUM_USAGE: 'premium_usage',
  
  // Learn page events
  LEARN_ENGAGEMENT: 'learn_engagement',
  CONTENT_INTERACTION: 'content_interaction',
  
  // Conversion funnel events
  FUNNEL: 'conversion_funnel',
  SIGNUP: 'signup',
  SUBSCRIPTION: 'subscription',
  
  // User engagement
  ENGAGEMENT: 'user_engagement',
  NAVIGATION: 'navigation',
  
  // Performance
  PERFORMANCE: 'performance',
  WEB_VITALS: 'web_vitals',
} as const

// Comprehensive event tracking configuration
export const TRACKING_EVENTS = {
  // Converter tracking events
  converter: {
    pageView: {
      name: 'converter_page_view',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'User viewed a converter page',
      parameters: {
        converter_type: 'string',
        search_volume: 'number',
        priority: 'string',
      },
    },
    fileSelected: {
      name: 'converter_file_selected',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'User selected a file for conversion',
      parameters: {
        converter_type: 'string',
        file_size: 'number',
        file_type: 'string',
      },
    },
    conversionStarted: {
      name: 'converter_conversion_started',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'Conversion process initiated',
      parameters: {
        converter_type: 'string',
        input_format: 'string',
        output_format: 'string',
      },
    },
    conversionCompleted: {
      name: 'converter_conversion_completed',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'Conversion successfully completed',
      parameters: {
        converter_type: 'string',
        conversion_time: 'number',
        input_size: 'number',
        output_size: 'number',
        compression_ratio: 'number',
      },
    },
    conversionError: {
      name: 'converter_conversion_error',
      category: EVENT_CATEGORIES.CONVERTER_ERROR,
      description: 'Conversion failed with error',
      parameters: {
        converter_type: 'string',
        error_type: 'string',
        error_message: 'string',
        file_size: 'number',
      },
    },
    downloadStarted: {
      name: 'converter_download_started',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'User initiated file download',
      parameters: {
        converter_type: 'string',
        file_size: 'number',
        format: 'string',
      },
    },
    downloadCompleted: {
      name: 'converter_download_completed',
      category: EVENT_CATEGORIES.CONVERTER,
      description: 'File download completed',
      parameters: {
        converter_type: 'string',
        download_time: 'number',
      },
    },
  },

  // Gallery tracking events
  gallery: {
    pageView: {
      name: 'gallery_page_view',
      category: EVENT_CATEGORIES.GALLERY,
      description: 'User viewed a gallery page',
      parameters: {
        gallery_theme: 'string',
        search_volume: 'number',
        item_count: 'number',
      },
    },
    itemViewed: {
      name: 'gallery_item_viewed',
      category: EVENT_CATEGORIES.GALLERY_INTERACTION,
      description: 'User viewed a gallery item',
      parameters: {
        gallery_theme: 'string',
        item_id: 'string',
        item_type: 'string',
      },
    },
    itemDownloaded: {
      name: 'gallery_item_downloaded',
      category: EVENT_CATEGORIES.GALLERY_INTERACTION,
      description: 'User downloaded a gallery item',
      parameters: {
        gallery_theme: 'string',
        item_id: 'string',
        format: 'string',
      },
    },
    itemShared: {
      name: 'gallery_item_shared',
      category: EVENT_CATEGORIES.GALLERY_INTERACTION,
      description: 'User shared a gallery item',
      parameters: {
        gallery_theme: 'string',
        item_id: 'string',
        share_method: 'string',
      },
    },
    searchPerformed: {
      name: 'gallery_search',
      category: EVENT_CATEGORIES.GALLERY,
      description: 'User searched within gallery',
      parameters: {
        gallery_theme: 'string',
        search_query: 'string',
        results_count: 'number',
      },
    },
  },

  // Tool tracking events
  tools: {
    editorOpened: {
      name: 'tool_editor_opened',
      category: EVENT_CATEGORIES.TOOL_EDITOR,
      description: 'User opened SVG editor',
      parameters: {
        source: 'string',
        with_file: 'boolean',
      },
    },
    editorFeatureUsed: {
      name: 'tool_editor_feature_used',
      category: EVENT_CATEGORIES.TOOL_EDITOR,
      description: 'User used editor feature',
      parameters: {
        feature: 'string',
        duration: 'number',
      },
    },
    optimizerUsed: {
      name: 'tool_optimizer_used',
      category: EVENT_CATEGORIES.TOOL_OPTIMIZER,
      description: 'User optimized SVG',
      parameters: {
        input_size: 'number',
        output_size: 'number',
        reduction_percentage: 'number',
        options_used: 'object',
      },
    },
    animatorOpened: {
      name: 'tool_animator_opened',
      category: EVENT_CATEGORIES.TOOL_ANIMATOR,
      description: 'User opened animation tool',
      parameters: {
        source: 'string',
      },
    },
    animationCreated: {
      name: 'tool_animation_created',
      category: EVENT_CATEGORIES.TOOL_ANIMATOR,
      description: 'User created animation',
      parameters: {
        animation_type: 'string',
        duration: 'number',
        elements_count: 'number',
      },
    },
  },

  // Premium feature tracking
  premium: {
    videoExportStarted: {
      name: 'premium_video_export_started',
      category: EVENT_CATEGORIES.PREMIUM_VIDEO_EXPORT,
      description: 'User started video export',
      parameters: {
        format: 'string',
        duration: 'number',
        resolution: 'string',
        credits_required: 'number',
      },
    },
    videoExportCompleted: {
      name: 'premium_video_export_completed',
      category: EVENT_CATEGORIES.PREMIUM_VIDEO_EXPORT,
      description: 'Video export completed',
      parameters: {
        format: 'string',
        export_time: 'number',
        file_size: 'number',
        credits_used: 'number',
      },
    },
    creditsPurchased: {
      name: 'premium_credits_purchased',
      category: EVENT_CATEGORIES.PREMIUM_USAGE,
      description: 'User purchased credits',
      parameters: {
        package: 'string',
        credits: 'number',
        price: 'number',
        source: 'string',
      },
    },
    subscriptionStarted: {
      name: 'premium_subscription_started',
      category: EVENT_CATEGORIES.SUBSCRIPTION,
      description: 'User started subscription',
      parameters: {
        plan: 'string',
        interval: 'string',
        price: 'number',
        trial: 'boolean',
      },
    },
  },

  // Learn page tracking
  learn: {
    pageView: {
      name: 'learn_page_view',
      category: EVENT_CATEGORIES.LEARN_ENGAGEMENT,
      description: 'User viewed learn page',
      parameters: {
        topic: 'string',
        search_volume: 'number',
        content_length: 'number',
      },
    },
    scrollDepth: {
      name: 'learn_scroll_depth',
      category: EVENT_CATEGORIES.LEARN_ENGAGEMENT,
      description: 'User scroll depth on learn page',
      parameters: {
        topic: 'string',
        depth_percentage: 'number',
        time_on_page: 'number',
      },
    },
    contentInteraction: {
      name: 'learn_content_interaction',
      category: EVENT_CATEGORIES.CONTENT_INTERACTION,
      description: 'User interacted with content',
      parameters: {
        topic: 'string',
        interaction_type: 'string',
        element: 'string',
      },
    },
    exampleCopied: {
      name: 'learn_example_copied',
      category: EVENT_CATEGORIES.CONTENT_INTERACTION,
      description: 'User copied code example',
      parameters: {
        topic: 'string',
        example_type: 'string',
      },
    },
  },

  // Conversion funnel tracking
  funnel: {
    stepCompleted: {
      name: 'funnel_step_completed',
      category: EVENT_CATEGORIES.FUNNEL,
      description: 'User completed funnel step',
      parameters: {
        funnel_name: 'string',
        step_name: 'string',
        step_number: 'number',
        time_since_start: 'number',
      },
    },
    conversionCompleted: {
      name: 'funnel_conversion_completed',
      category: EVENT_CATEGORIES.FUNNEL,
      description: 'User completed conversion',
      parameters: {
        funnel_name: 'string',
        conversion_type: 'string',
        value: 'number',
        journey_duration: 'number',
      },
    },
    dropoff: {
      name: 'funnel_dropoff',
      category: EVENT_CATEGORIES.FUNNEL,
      description: 'User dropped off from funnel',
      parameters: {
        funnel_name: 'string',
        dropoff_step: 'string',
        time_on_step: 'number',
        reason: 'string',
      },
    },
  },

  // User engagement tracking
  engagement: {
    sessionStarted: {
      name: 'session_started',
      category: EVENT_CATEGORIES.ENGAGEMENT,
      description: 'User session started',
      parameters: {
        entry_page: 'string',
        referrer: 'string',
        device_type: 'string',
        browser: 'string',
      },
    },
    sessionEnded: {
      name: 'session_ended',
      category: EVENT_CATEGORIES.ENGAGEMENT,
      description: 'User session ended',
      parameters: {
        duration: 'number',
        pages_viewed: 'number',
        actions_taken: 'number',
        converted: 'boolean',
      },
    },
    ctaShown: {
      name: 'cta_shown',
      category: EVENT_CATEGORIES.ENGAGEMENT,
      description: 'CTA displayed to user',
      parameters: {
        cta_id: 'string',
        cta_type: 'string',
        location: 'string',
        variant: 'string',
      },
    },
    ctaClicked: {
      name: 'cta_clicked',
      category: EVENT_CATEGORIES.ENGAGEMENT,
      description: 'User clicked CTA',
      parameters: {
        cta_id: 'string',
        cta_type: 'string',
        location: 'string',
        variant: 'string',
        time_to_click: 'number',
      },
    },
    newsletterSignup: {
      name: 'newsletter_signup',
      category: EVENT_CATEGORIES.SIGNUP,
      description: 'User signed up for newsletter',
      parameters: {
        source: 'string',
        incentive: 'string',
      },
    },
    accountCreated: {
      name: 'account_created',
      category: EVENT_CATEGORIES.SIGNUP,
      description: 'User created account',
      parameters: {
        method: 'string',
        source: 'string',
        referral_code: 'string',
      },
    },
  },

  // Performance tracking
  performance: {
    pageLoadTime: {
      name: 'page_load_time',
      category: EVENT_CATEGORIES.PERFORMANCE,
      description: 'Page load performance',
      parameters: {
        page_type: 'string',
        load_time: 'number',
        first_contentful_paint: 'number',
        time_to_interactive: 'number',
      },
    },
    webVitals: {
      name: 'web_vitals',
      category: EVENT_CATEGORIES.WEB_VITALS,
      description: 'Core Web Vitals metrics',
      parameters: {
        metric_name: 'string',
        value: 'number',
        rating: 'string',
        page_type: 'string',
      },
    },
    apiLatency: {
      name: 'api_latency',
      category: EVENT_CATEGORIES.PERFORMANCE,
      description: 'API call latency',
      parameters: {
        endpoint: 'string',
        method: 'string',
        latency: 'number',
        status_code: 'number',
      },
    },
  },
} as const

// Conversion goals configuration
export const CONVERSION_GOALS: ConversionGoal[] = [
  {
    id: 'free_to_paid',
    name: 'Free Tool to Paid Conversion',
    type: 'event',
    value: 0,
    conditions: {
      event: 'premium_subscription_started',
      previousEvents: ['converter_conversion_completed'],
    },
  },
  {
    id: 'newsletter_signup',
    name: 'Newsletter Signup',
    type: 'event',
    conditions: {
      event: 'newsletter_signup',
    },
  },
  {
    id: 'account_creation',
    name: 'Account Creation',
    type: 'event',
    value: 5,
    conditions: {
      event: 'account_created',
    },
  },
  {
    id: 'premium_upgrade',
    name: 'Premium Upgrade',
    type: 'event',
    value: 50,
    conditions: {
      event: 'premium_subscription_started',
    },
  },
  {
    id: 'video_export',
    name: 'Video Export Usage',
    type: 'event',
    value: 10,
    conditions: {
      event: 'premium_video_export_completed',
    },
  },
]

// Enhanced commerce tracking for premium features
export const ECOMMERCE_TRACKING = {
  currencyCode: 'USD',
  items: {
    starter_monthly: {
      item_id: 'starter_monthly',
      item_name: 'Starter Plan - Monthly',
      item_category: 'subscription',
      item_variant: 'monthly',
      price: 9.99,
    },
    starter_annual: {
      item_id: 'starter_annual',
      item_name: 'Starter Plan - Annual',
      item_category: 'subscription',
      item_variant: 'annual',
      price: 99.99,
    },
    pro_monthly: {
      item_id: 'pro_monthly',
      item_name: 'Pro Plan - Monthly',
      item_category: 'subscription',
      item_variant: 'monthly',
      price: 29.99,
    },
    pro_annual: {
      item_id: 'pro_annual',
      item_name: 'Pro Plan - Annual',
      item_category: 'subscription',
      item_variant: 'annual',
      price: 299.99,
    },
    credit_pack_10: {
      item_id: 'credits_10',
      item_name: '10 Export Credits',
      item_category: 'credits',
      quantity: 10,
      price: 4.99,
    },
    credit_pack_50: {
      item_id: 'credits_50',
      item_name: '50 Export Credits',
      item_category: 'credits',
      quantity: 50,
      price: 19.99,
    },
    credit_pack_100: {
      item_id: 'credits_100',
      item_name: '100 Export Credits',
      item_category: 'credits',
      quantity: 100,
      price: 34.99,
    },
  },
}

// Debug mode configuration
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: process.env.ANALYTICS_LOG_LEVEL || 'info',
  consoleOutput: true,
  preserveLogs: true,
  showEventValidation: true,
}

// Server-side tracking configuration
export const SERVER_TRACKING_CONFIG = {
  enabled: true,
  endpoints: [
    '/api/generate-svg',
    '/api/generate-icon',
    '/api/convert',
    '/api/create-portal-session',
    '/api/manage-subscription',
  ],
  criticalEvents: [
    'premium_subscription_started',
    'premium_credits_purchased',
    'account_created',
    'converter_conversion_completed',
  ],
}

// Export helper functions
export function getEventConfig(category: string, eventName: string) {
  const categoryEvents = Object.values(TRACKING_EVENTS).find(
    events => Object.values(events).some(e => e.category === category)
  )
  
  if (!categoryEvents) return null
  
  return Object.values(categoryEvents).find(e => e.name === eventName)
}

export function validateEventParameters(
  eventName: string,
  parameters: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const eventConfig = Object.values(TRACKING_EVENTS)
    .flatMap(category => Object.values(category))
    .find(event => event.name === eventName)
  
  if (!eventConfig) {
    errors.push(`Unknown event: ${eventName}`)
    return { valid: false, errors }
  }
  
  // Validate required parameters
  if (eventConfig.parameters) {
    Object.entries(eventConfig.parameters).forEach(([param, type]) => {
      if (!(param in parameters)) {
        errors.push(`Missing required parameter: ${param}`)
      } else if (typeof parameters[param] !== type && type !== 'object') {
        errors.push(`Invalid type for ${param}: expected ${type}, got ${typeof parameters[param]}`)
      }
    })
  }
  
  return { valid: errors.length === 0, errors }
}