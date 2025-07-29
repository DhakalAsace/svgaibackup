import Stripe from 'stripe';

// CRITICAL: These are the only valid prices for the application
// Any price not matching these exact amounts should be rejected
export const VALID_PRICES = {
  starter_monthly: {
    amount: 1900,        // $19.00
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
  },
  starter_annual: {
    amount: 16800,       // $168.00 ($14/month)
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
  },
  pro_monthly: {
    amount: 3900,        // $39.00
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
  },
  pro_annual: {
    amount: 36000,       // $360.00 ($30/month)
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
  },
} as const;

export type PriceKey = keyof typeof VALID_PRICES;

/**
 * Validates a Stripe price against our expected configuration
 * This prevents price manipulation attacks
 */
export async function validateStripePrice(
  stripe: Stripe,
  priceId: string,
  expectedKey: PriceKey
): Promise<{ valid: boolean; error?: string }> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    const expected = VALID_PRICES[expectedKey];

    // Validate amount
    if (price.unit_amount !== expected.amount) {
      return {
        valid: false,
        error: `Price amount mismatch: expected ${expected.amount}, got ${price.unit_amount}`,
      };
    }

    // Validate currency
    if (price.currency !== expected.currency) {
      return {
        valid: false,
        error: `Currency mismatch: expected ${expected.currency}, got ${price.currency}`,
      };
    }

    // Validate it's a recurring price
    if (price.type !== 'recurring') {
      return {
        valid: false,
        error: `Price type must be recurring, got ${price.type}`,
      };
    }

    // Validate interval for recurring prices
    if (price.recurring) {
      if (price.recurring.interval !== expected.interval) {
        return {
          valid: false,
          error: `Interval mismatch: expected ${expected.interval}, got ${price.recurring.interval}`,
        };
      }

      if (price.recurring.interval_count !== expected.intervalCount) {
        return {
          valid: false,
          error: `Interval count mismatch: expected ${expected.intervalCount}, got ${price.recurring.interval_count}`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to retrieve price: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get price metadata for a validated price key
 */
export function getPriceMetadata(priceKey: PriceKey) {
  const [tier, interval] = priceKey.split('_') as [string, string];
  
  return {
    tier,
    interval,
    amount: VALID_PRICES[priceKey].amount,
    displayAmount: `$${(VALID_PRICES[priceKey].amount / 100).toFixed(2)}`,
    credits: tier === 'starter' ? 100 : 350,
  };
}