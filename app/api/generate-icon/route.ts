import Replicate from "replicate"
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { generateIconSchema, validateRequestBody } from '@/lib/validation-schemas'

// Import security utilities
import { sanitizeSvg } from '@/lib/svg-sanitizer'
import { isUrlSafe } from '@/lib/url-validator'
import { createLogger } from '@/lib/logger'
import { createErrorResponse, createSuccessResponse, successResponse, badRequest, tooManyRequests } from '@/lib/error-handler'
import { sanitizeAndTrimText } from '@/lib/text-sanitizer'
import { sanitizeData } from '@/lib/sanitize-utils' // Import shared sanitizer
import { addWatermarkNode } from '@/lib/svg-watermark'
import { executeWithCredits } from '@/lib/credit-operations'
import { handleAPIError, extractErrorDetails } from '@/lib/api-error-handler'

// Add export config to enable Edge Runtime with 30s timeout instead of 10s
export const runtime = 'edge';
// export const dynamic = "force-static"; // Removed as it's incompatible with Edge Runtime

// Initialize logger
const logger = createLogger('api:generate-icon');

// Get required environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const replicateApiToken = process.env.REPLICATE_API_TOKEN;

// Validate critical environment variables
if (!supabaseUrl || !supabaseServiceRoleKey || !replicateApiToken) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceRoleKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!replicateApiToken) missingVars.push('REPLICATE_API_TOKEN');
  
  logger.error('Missing required environment variables', { 
    missingVariables: missingVars.join(', ') 
  });
  
  // In production, we'll throw an error during initialization
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Server configuration error: Missing ${missingVars.join(', ')}`);
  }
}

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  supabaseUrl || '',  // Will only reach here with empty string if not in production
  supabaseServiceRoleKey || '',
  { auth: { persistSession: false } }
);

// Allowed domains for SVG URLs (Replicate endpoints)
const ALLOWED_DOMAINS = [
  'replicate.delivery',
  'replicate.com',
  'replicate-api-prod-models.s3.amazonaws.com',
  'storage.googleapis.com',
];

const DAILY_LIMIT = 2; // Free tier: 2 generations per day without signup

function createApiError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper function that contains all the icon generation logic
async function performIconGeneration(
  validatedData: { prompt: string; size?: string; number_of_images?: number },
  isSubscribed: boolean,
  user: any,
  identifier: string,
  identifier_type: 'user_id' | 'ip_address'
) {
  const { prompt, size = "1024x1024", number_of_images = 1 } = validatedData;

  // Initialize Replicate client with validated API token
  if (!replicateApiToken) {
    logger.error('Missing Replicate API token during request', { operation: 'icon-generation' });
    throw new Error('Configuration error: Missing API credentials');
  }
  
  const replicate = new Replicate({
    auth: replicateApiToken,
  });

  // Add validation for Replicate input
  const allowedSizes = ["1024x1024", "512x512", "256x256"];
  const validatedSize = allowedSizes.includes(size) ? size : "1024x1024";
  const validatedNumberOfImages = Math.min(Math.max(1, number_of_images), 4);

  logger.debug('Initiating Replicate icon generation request', {
    operation: 'icon-generation',
    size: validatedSize,
    numberOfImages: validatedNumberOfImages,
    promptLength: prompt ? prompt.length : 0
  });

  try {
    logger.info('Attempting to run Replicate model for icon generation', { 
      promptLength: prompt.length
    });

    const replicateInput = {
      prompt,
      size: validatedSize,
      number_of_images: validatedNumberOfImages,
      style: "icon" // Icon style for Recraft
    };
    
    logger.debug('Sending input to Replicate:', { input: replicateInput });

    // Use predictions.create for better error handling
    let predictionResult;
    try {
      predictionResult = await replicate.predictions.create({
        model: "recraft-ai/recraft-20b-svg",
        input: replicateInput,
      });
    } catch (replicateError) {
      // Handle Replicate API errors
      const errorDetails = extractErrorDetails(replicateError);
      const apiError = handleAPIError(replicateError);
      
      logger.error('Replicate API error', { 
        error: errorDetails,
        statusCode: apiError.statusCode
      });
      
      throw new Error(apiError.userMessage);
    }
    
    logger.debug('Icon prediction created successfully', { 
      predictionId: predictionResult?.id,
      status: predictionResult?.status 
    });
    
    // Wait for the prediction to complete with timeout
    const maxWaitTime = 25; // seconds
    let waitTime = 0;
    
    while (
      predictionResult.status !== "succeeded" && 
      predictionResult.status !== "failed" &&
      waitTime < maxWaitTime
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      waitTime++;
      
      try {
        predictionResult = await replicate.predictions.get(predictionResult.id);
        logger.debug('Icon prediction status updated', { 
          status: predictionResult?.status,
          waitTime: `${waitTime}/${maxWaitTime} seconds`
        });
      } catch (statusCheckError) {
        const apiError = handleAPIError(statusCheckError);
        logger.error('Error checking prediction status', { 
          error: extractErrorDetails(statusCheckError),
          predictionId: predictionResult?.id,
          statusCode: apiError.statusCode
        });
        // Don't throw here, let it retry or timeout
      }
    }
    
    // Check for timeout
    if (waitTime >= maxWaitTime && predictionResult.status !== "succeeded") {
      logger.error('Icon prediction timed out', {
        predictionId: predictionResult?.id,
        status: predictionResult?.status
      });
      throw new Error(`Prediction timed out after ${maxWaitTime} seconds`);
    }
    
    // Check if prediction failed
    if (predictionResult.status === "failed") {
      logger.error('Icon prediction failed', {
        predictionId: predictionResult?.id,
        error: predictionResult.error
      });
      throw new Error(`Prediction failed: ${predictionResult.error || "Unknown error"}`);
    }
    
    // Extract the output
    if (!predictionResult.output) {
      throw new Error("Prediction succeeded but returned no output");
    }
    
    const output = predictionResult.output;

    // Extract SVG URL - Recraft returns a single URL string
    let svgUrl: string | null = null;
    
    if (typeof output === 'string' && output.startsWith('http')) {
      svgUrl = output;
    } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
      svgUrl = output[0];
    }

    if (!svgUrl) {
      throw new Error('No SVG URL returned from icon generation service');
    }

    logger.info('Generated icon SVG successfully', { url: svgUrl.substring(0, 50) + '...' });

    // For authenticated users, save to database
    if (identifier_type === 'user_id' && svgUrl) {
      try {
        // Validate URL
        if (!isUrlSafe(svgUrl, ALLOWED_DOMAINS)) {
          logger.error('Blocked potentially unsafe URL', { url: svgUrl });
          throw new Error('Icon URL failed security validation');
        }

        // Fetch SVG content
        const svgResponse = await fetch(svgUrl, { 
          signal: AbortSignal.timeout(10000),
          headers: { 'Accept': 'image/svg+xml, */*' }
        });

        if (!svgResponse.ok) {
          logger.error(`Failed to fetch icon SVG: ${svgResponse.status}`);
          throw new Error(`Failed to fetch icon content: ${svgResponse.status}`);
        }

        const rawSvgText = await svgResponse.text();

        // Basic validation
        if (!rawSvgText || !rawSvgText.trim().toLowerCase().startsWith('<svg')) {
          logger.error('Fetched content does not appear to be a valid SVG');
          throw new Error('Fetched content does not appear to be a valid SVG icon.');
        }

        // Sanitize & watermark the SVG
        let sanitizedSvgText = sanitizeSvg(rawSvgText);
        sanitizedSvgText = addWatermarkNode(sanitizedSvgText, isSubscribed);

        const iconTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled Icon';

        const { error: insertError } = await supabaseAdmin
          .from('svg_designs')
          .insert({
            user_id: identifier,
            prompt: prompt,
            svg_content: sanitizedSvgText,
            title: iconTitle,
            tags: ['icon'] // Tag as icon since it's from icon generator
          });

        if (insertError) {
          logger.error("Error saving icon to database", { error: insertError });
        } else {
          logger.info('Successfully saved icon SVG to database');
        }
      } catch (fetchError) {
        logger.error("Error processing icon SVG", { error: fetchError });
      }
    }

    return {
      iconUrl: svgUrl,
      isSubscribed
    };
  } catch (error) {
    logger.error('Error running Replicate for icon generation', { 
      error: error instanceof Error ? error.message : String(error)
    });
    throw error; // Re-throw to be caught by executeWithCredits
  }
}

export async function POST(req: NextRequest) {
  // Declare deductResult outside try/catch so it's accessible in error handling
  const deductResult: any = null;
  const isSubscribed = false;
  let user: any = null;
  let identifier: string = '';
  let identifier_type: 'user_id' | 'ip_address' = 'ip_address';
  
  try {
    const cookieStore = cookies();
    const supabaseUserClient = await createRouteClient();

    const authResult = await supabaseUserClient.auth.getUser()
    user = authResult.data.user;
    const authError = authResult.error;

    if (user?.id && !authError) {
      identifier = user.id
      identifier_type = 'user_id'
      logger.info('Authenticated user request', { userId: identifier })
    } else {
      // Use IP address for anonymous users
      // Try multiple headers in order of preference
      const forwardedFor = req.headers.get('x-forwarded-for')
      const realIp = req.headers.get('x-real-ip')
      const cfConnectingIp = req.headers.get('cf-connecting-ip') // Cloudflare
      const vercelIp = req.headers.get('x-vercel-forwarded-for') // Vercel specific
      const forwarded = req.headers.get('forwarded') // Standard forwarded header
      
      // Log all available headers for debugging
      logger.debug('Available headers for IP detection', {
        'x-forwarded-for': forwardedFor,
        'x-real-ip': realIp,
        'cf-connecting-ip': cfConnectingIp,
        'x-vercel-forwarded-for': vercelIp,
        'forwarded': forwarded,
        // Try to access NextRequest ip property if available
        'req.ip': (req as any).ip || null
      })
      
      // Extract IP from various sources
      let ip = null
      
      // First try NextRequest.ip property (available in Edge Runtime)
      if ((req as any).ip) {
        ip = (req as any).ip
        logger.info('Got IP from NextRequest.ip property', { ip })
      } else if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        ip = forwardedFor.split(',')[0].trim()
      } else if (realIp) {
        ip = realIp
      } else if (cfConnectingIp) {
        ip = cfConnectingIp
      } else if (vercelIp) {
        ip = vercelIp.split(',')[0].trim()
      } else if (forwarded) {
        // Parse the standard Forwarded header
        const match = forwarded.match(/for=([^;,]+)/)
        if (match) {
          ip = match[1].replace(/["[\]]/g, '').replace(/^\[|\]$/g, '') // Remove quotes and brackets
        }
      }
      
      // Validate IP format (basic check)
      if (ip && !ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/)) {
        logger.warn('Invalid IP format detected', { ip })
        ip = null
      }
      
      identifier = ip || 'unknown_ip'
      identifier_type = 'ip_address'
      logger.info('Anonymous user request', { 
        ipSource: (req as any).ip ? 'NextRequest.ip' :
                 (forwardedFor ? 'x-forwarded-for' : 
                 (realIp ? 'x-real-ip' : 
                 (cfConnectingIp ? 'cf-connecting-ip' :
                 (vercelIp ? 'x-vercel-forwarded-for' :
                 (forwarded ? 'forwarded' : 'unknown'))))),
        detectedIp: identifier
      })
      
      // Check if we're in development environment
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      // If we can't determine IP, use a fallback identifier but still allow generation
      if (identifier === 'unknown_ip' && !isDevelopment) {
        // Instead of blocking, use a consistent fallback identifier
        // This could be based on other request properties or a fixed value
        identifier = 'anonymous_fallback_' + new Date().toISOString().split('T')[0] // Daily fallback
        logger.warn("Could not determine IP address - using fallback identifier", { identifier })
      }
      
      // Use a placeholder for development environment
      if (identifier === 'unknown_ip' && isDevelopment) {
        identifier = 'development_user'
        logger.info("Development environment detected, using placeholder identifier")
      }
    }

    // First check if user has credits WITHOUT deducting them
    // We'll use a modified query that doesn't update the count
    const { data: checkResult, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('*, subscription_status')
      .eq('id', user?.id || '')
      .single();
    
    let canGenerate = false;
    let remainingCredits = 0;
    let isSubscribed = false;
    
    if (user?.id) {
      // For logged-in users, check their credits
      if (checkError && checkError.code !== 'PGRST116') {
        logger.error('Error checking user profile', { error: checkError });
        return Response.json({ error: 'Error checking usage limit' }, { status: 500 });
      }
      
      if (checkResult) {
        isSubscribed = checkResult.subscription_status === 'active';
        
        if (isSubscribed) {
          // Check monthly credits
          remainingCredits = checkResult.monthly_credits - checkResult.monthly_credits_used;
          canGenerate = remainingCredits >= 1;
        } else {
          // Check lifetime credits
          remainingCredits = checkResult.lifetime_credits_granted - checkResult.lifetime_credits_used;
          canGenerate = remainingCredits >= 1;
        }
      }
      
      if (!canGenerate) {
        const errorMessage = isSubscribed 
          ? `You've used all your monthly credits. Upgrade your plan or wait for next month.`
          : "You've used all your free credits. Upgrade to Pro for more!";
        return tooManyRequests(errorMessage);
      }
    } else {
      // For anonymous users, check daily limit
      // Anonymous users get 2 free credits total per day:
      // - Can generate 2 icons (1 credit each), OR
      // - Can generate 1 SVG (2 credits), OR
      // - Can generate 1 icon then have 1 credit left (not enough for SVG)
      // We need to check all generation types to calculate total credits used
      // IMPORTANT: IP addresses are hashed in the database for privacy
      let hashedIdentifier = identifier;
      if (identifier_type === 'ip_address') {
        const { data: hashData, error: hashError } = await supabaseAdmin.rpc('hash_identifier', {
          p_identifier: identifier
        });
        if (!hashError && hashData) {
          hashedIdentifier = hashData;
        }
      }
      
      const { data: iconCheck } = await supabaseAdmin
        .from('daily_generation_limits')
        .select('count')
        .eq('identifier', hashedIdentifier)
        .eq('identifier_type', identifier_type)
        .eq('generation_date', new Date().toISOString().split('T')[0])
        .eq('generation_type', 'icon')
        .single();
      
      const { data: svgCheck } = await supabaseAdmin
        .from('daily_generation_limits')
        .select('count')
        .eq('identifier', hashedIdentifier)
        .eq('identifier_type', identifier_type)
        .eq('generation_date', new Date().toISOString().split('T')[0])
        .eq('generation_type', 'svg')
        .single();
      
      // Calculate total credits used (icon=1, svg=2)
      const iconCreditsUsed = (iconCheck?.count || 0) * 1;
      const svgCreditsUsed = (svgCheck?.count || 0) * 2;
      const totalCreditsUsed = iconCreditsUsed + svgCreditsUsed;
      const creditsRemaining = 2 - totalCreditsUsed;
      
      if (creditsRemaining < 1) {
        return tooManyRequests("Sign up to continue generating for free and get 6 bonus credits!");
      }
      
      canGenerate = true;
      remainingCredits = creditsRemaining;
    }

    logger.info('Credit check passed', { 
      identifierType: identifier_type, 
      remainingCredits,
      identifier: identifier ? `${identifier.substring(0, 10)}...` : 'null',
      identifierLength: identifier?.length || 0
    })

    // 3. Validate request body
    const { data: validatedData, error: validationError } = await validateRequestBody(req, generateIconSchema);
    
    if (validationError) {
      logger.warn('Invalid request body', { error: validationError });
      return badRequest(validationError);
    }
    
    // Debug log before calling executeWithCredits
    logger.debug('About to call executeWithCredits', {
      userId: user?.id || 'null',
      identifier: identifier || 'null',
      identifierType: identifier_type,
      identifierLength: identifier?.length || 0
    });
    
    // Guard against null identifier
    if (!identifier && !user?.id) {
      logger.error('Identifier is null for anonymous user', {
        identifier,
        identifierType: identifier_type
      });
      return tooManyRequests("Please sign up for a free account to continue generating. You'll get 6 bonus credits!");
    }
    
    // 4. Execute generation with automatic credit handling
    const result = await executeWithCredits({
      operation: async () => {
        // All the generation logic will go here
        return await performIconGeneration(validatedData!, isSubscribed, user, identifier, identifier_type);
      },
      userId: user?.id || null,
      identifier,
      identifierType: identifier_type,
      generationType: 'icon',
      supabaseAdmin: supabaseAdmin as any
    });
    
    if (!result.success) {
      logger.error('Icon generation failed', { error: result.error });
      return tooManyRequests(result.error || "Generation failed");
    }
    
    // Extract data from successful result
    const { iconUrl } = result.data!;
    remainingCredits = result.remainingCredits || 0;
    
    // Create and return success response
    const successData = createSuccessResponse({
      svgUrl: iconUrl, // Return the icon SVG URL
      remainingGenerations: remainingCredits,
      creditsUsed: 1, // Icon costs 1 credit
      modelInfo: 'recraft-ai/recraft-20b-svg',
      isSubscribed: result.data?.isSubscribed || false
    });
    
    return successResponse(successData);

  } catch (error) {
    // Error handling is now simplified since refunds are handled by executeWithCredits
    // SECURITY: Sanitize error objects before logging to prevent token leakage
    const sanitizedError = sanitizeData(error);
    
    logger.error("Error generating icon", { error: sanitizedError });
    
    // Use genericized error message for production to prevent information leakage
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? "Failed to generate icon" 
      : (error instanceof Error ? error.message : "Unknown error");
    
    const { response, status } = createErrorResponse(
      null, // Never pass the raw error object to prevent token leakage
      errorMessage,
      500
    );
    
    return Response.json(response, { status });
  }
}
