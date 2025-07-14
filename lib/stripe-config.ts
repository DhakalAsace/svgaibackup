// Ensure all required environment variables are set
if (!process.env.STRIPE_PRICE_STARTER_MONTHLY || 
    !process.env.STRIPE_PRICE_STARTER_ANNUAL ||
    !process.env.STRIPE_PRICE_PRO_MONTHLY ||
    !process.env.STRIPE_PRICE_PRO_ANNUAL) {
  throw new Error('Missing required Stripe price environment variables');
}

export const STRIPE_CONFIG = {
  prices: {
    starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL,
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  webhookTimeout: 300000,
  maxRetries: 3
} as const;

export const PRICE_TO_TIER: Record<string, { tier: string; credits: number; interval: string }> = {
  [STRIPE_CONFIG.prices.starter_monthly]: { tier: 'starter', credits: 100, interval: 'monthly' },
  [STRIPE_CONFIG.prices.starter_annual]: { tier: 'starter', credits: 100, interval: 'annual' },
  [STRIPE_CONFIG.prices.pro_monthly]: { tier: 'pro', credits: 350, interval: 'monthly' },
  [STRIPE_CONFIG.prices.pro_annual]: { tier: 'pro', credits: 350, interval: 'annual' },
};