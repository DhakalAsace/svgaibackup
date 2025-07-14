import { z } from 'zod'
import { createLogger } from '@/lib/logger'

const logger = createLogger('env')

// This file should only be imported server-side
if (typeof window !== 'undefined') {
  throw new Error('env.ts should not be imported in client-side code. Use env-client.ts instead.')
}

const envSchema = z.object({
  // Existing variables
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Converter Tool Configuration
  CONVERTER_MAX_FILE_SIZE: z.string().transform(Number).default('104857600'), // 100MB default
  CONVERTER_ALLOWED_FORMATS: z.string().default('png,jpg,jpeg,gif,webp,bmp,svg,pdf,ico,tiff,eps,ai,dxf,stl,avif,cdr,mp4,html,ttf'),
  CONVERTER_OUTPUT_QUALITY: z.string().transform(Number).default('90'),
  CONVERTER_POTRACE_THRESHOLD: z.string().transform(Number).default('128'),
  
  // Advanced Converter Settings
  CONVERTER_MAX_DIMENSIONS: z.string().default('10000x10000'),
  CONVERTER_ENABLE_SECURITY_CHECKS: z.string().transform(v => v === 'true').default('true'),
  CONVERTER_TIMEOUT_MS: z.string().transform(Number).default('30000'), // 30 seconds
  CONVERTER_ENABLE_DETAILED_ERRORS: z.string().transform(v => v === 'true').default('true'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_CONVERTERS: z.string().transform(v => v === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_GALLERIES: z.string().transform(v => v === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_LEARN_PAGES: z.string().transform(v => v === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_ANIMATION_TOOL: z.string().transform(v => v === 'true').default('true'),
  
  // SEO Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://svgai.org'),
  NEXT_PUBLIC_CANONICAL_DOMAIN: z.string().default('svgai.org'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'))
      
      if (missing.length > 0) {
        logger.warn('Missing environment variables:', missing.join(', '))
      }
    }
    throw error
  }
}

export const env = validateEnv()

// Export specific config objects
export const converterConfig = {
  maxFileSize: env.CONVERTER_MAX_FILE_SIZE,
  allowedFormats: env.CONVERTER_ALLOWED_FORMATS.split(','),
  outputQuality: env.CONVERTER_OUTPUT_QUALITY,
  potraceThreshold: env.CONVERTER_POTRACE_THRESHOLD,
  maxDimensions: env.CONVERTER_MAX_DIMENSIONS.split('x').map(Number),
  enableSecurityChecks: env.CONVERTER_ENABLE_SECURITY_CHECKS,
  timeoutMs: env.CONVERTER_TIMEOUT_MS,
  enableDetailedErrors: env.CONVERTER_ENABLE_DETAILED_ERRORS,
}

export const featureFlags = {
  converters: env.NEXT_PUBLIC_ENABLE_CONVERTERS,
  galleries: env.NEXT_PUBLIC_ENABLE_GALLERIES,
  learnPages: env.NEXT_PUBLIC_ENABLE_LEARN_PAGES,
  animationTool: env.NEXT_PUBLIC_ENABLE_ANIMATION_TOOL,
}

export const seoConfig = {
  siteUrl: env.NEXT_PUBLIC_SITE_URL,
  canonicalDomain: env.NEXT_PUBLIC_CANONICAL_DOMAIN,
}