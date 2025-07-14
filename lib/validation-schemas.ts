import { z } from 'zod';

// Generate SVG endpoint validation
export const generateSvgSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(2000, 'Prompt is too long. Please keep it under 2000 characters')
    .refine(
      (val) => !/<[^>]*>/.test(val), 
      'Prompt cannot contain HTML tags'
    ),
  style: z.string().optional(),
  format: z.enum(['svg', 'png']).optional().default('svg'),
  size: z.string().optional(),
  aspect_ratio: z.string().optional()
});

// Generate Icon endpoint validation
export const generateIconSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(2000, 'Prompt is too long. Please keep it under 2000 characters')
    .refine(
      (val) => !/<[^>]*>/.test(val), 
      'Prompt cannot contain HTML tags'
    ),
  style: z.string().optional(),
  format: z.enum(['svg', 'png']).optional().default('svg'),
  size: z.string().optional(),
  aspect_ratio: z.string().optional()
});

// Create checkout session validation
export const createCheckoutSessionSchema = z.object({
  tier: z.enum(['starter', 'pro'], {
    errorMap: () => ({ message: 'Invalid subscription tier' })
  }),
  interval: z.enum(['monthly', 'annual'], {
    errorMap: () => ({ message: 'Invalid billing interval' })
  }),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

// Manage subscription validation
export const manageSubscriptionSchema = z.object({
  action: z.enum(['cancel', 'resume', 'change'], {
    errorMap: () => ({ message: 'Invalid subscription action' })
  }),
  newTier: z.enum(['starter', 'pro']).optional(),
  newInterval: z.enum(['monthly', 'annual']).optional()
});

// Sync subscription validation
export const syncSubscriptionSchema = z.object({
  forceRefresh: z.boolean().optional().default(false)
});

// Delete user validation (admin only)
export const deleteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'Confirmation required' })
  })
});

// Create portal session validation
export const createPortalSessionSchema = z.object({
  returnUrl: z.string().url('Invalid return URL').optional()
});

// Helper function to validate request body
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { data: null, error: errors };
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: 'Invalid JSON body' };
  }
}

// Helper function to validate query params
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { data: T | null; error: string | null } {
  const params = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(params);
  
  if (!result.success) {
    const errors = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return { data: null, error: errors };
  }
  
  return { data: result.data, error: null };
}