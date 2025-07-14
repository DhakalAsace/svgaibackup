import { z } from 'zod'

const clientEnvSchema = z.object({
  // Public Supabase Configuration - optional with defaults
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().default('placeholder-key'),
  
  // Feature Flags - all optional with defaults
  NEXT_PUBLIC_ENABLE_CONVERTERS: z.string().optional().transform(v => v === 'true' || v === undefined).default('true'),
  NEXT_PUBLIC_ENABLE_GALLERIES: z.string().optional().transform(v => v === 'true' || v === undefined).default('true'),
  NEXT_PUBLIC_ENABLE_LEARN_PAGES: z.string().optional().transform(v => v === 'true' || v === undefined).default('true'),
  NEXT_PUBLIC_ENABLE_ANIMATION_TOOL: z.string().optional().transform(v => v === 'true' || v === undefined).default('true'),
  
  // SEO Configuration - optional with defaults
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('https://svgai.org'),
  NEXT_PUBLIC_CANONICAL_DOMAIN: z.string().optional().default('svgai.org'),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>

function validateClientEnv(): ClientEnv {
  // Parse with defaults - this should never throw since all fields are optional
  const parsed = clientEnvSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.warn('Client environment validation issues:', parsed.error.errors)
  }
  
  // Return parsed data or use schema defaults
  return parsed.success ? parsed.data : clientEnvSchema.parse({})
}

export const clientEnv = validateClientEnv()

// Export feature flags for client use
export const featureFlags = {
  converters: clientEnv.NEXT_PUBLIC_ENABLE_CONVERTERS,
  galleries: clientEnv.NEXT_PUBLIC_ENABLE_GALLERIES,
  learnPages: clientEnv.NEXT_PUBLIC_ENABLE_LEARN_PAGES,
  animationTool: clientEnv.NEXT_PUBLIC_ENABLE_ANIMATION_TOOL,
}

// Default converter config for client-side use
export const converterConfig = {
  maxFileSize: 104857600, // 100MB
  allowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'pdf', 'ico', 'tiff', 'eps', 'ai', 'dxf', 'stl', 'avif', 'cdr', 'mp4', 'html', 'ttf'],
  outputQuality: 90,
  potraceThreshold: 128,
  maxDimensions: [10000, 10000],
  enableSecurityChecks: true,
  timeoutMs: 30000,
  enableDetailedErrors: true,
}