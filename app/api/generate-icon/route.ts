import Replicate from "replicate"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Import security utilities
import { sanitizeSvg } from '@/lib/svg-sanitizer'
import { isUrlSafe } from '@/lib/url-validator'
import { createLogger } from '@/lib/logger'
import { createErrorResponse, createSuccessResponse, successResponse, badRequest, tooManyRequests } from '@/lib/error-handler'
import { sanitizeAndTrimText } from '@/lib/text-sanitizer'
import { sanitizeData } from '@/lib/sanitize-utils' // Import shared sanitizer

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

const DAILY_LIMIT = 100;

function createApiError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUserClient = createRouteHandlerClient({ cookies }) // Pass cookies function directly

    const { data: { session } } = await supabaseUserClient.auth.getSession()

    let identifier: string
    let identifier_type: 'user_id' | 'ip_address'

    if (session?.user?.id) {
      identifier = session.user.id
      identifier_type = 'user_id'
      logger.info('Authenticated user request', { userId: identifier })
    } else {
      // Use IP address for anonymous users
      const forwardedFor = req.headers.get('x-forwarded-for')
      const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : null
      const realIp = req.headers.get('x-real-ip')
      
      identifier = ip || realIp || 'unknown_ip'
      identifier_type = 'ip_address'
      logger.info('Anonymous user request', { ipSource: forwardedFor ? 'x-forwarded-for' : (realIp ? 'x-real-ip' : 'unknown') })
      
      // Check if we're in development environment
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      // Block requests with unknown IP to prevent rate limit bypass, but allow in development
      if (identifier === 'unknown_ip' && !isDevelopment) {
        logger.warn("Could not determine IP address - blocking request")
        return Response.json({
          success: false,
          error: "Unable to verify request origin"
        }, { status: 403 })
      }
      
      // Use a placeholder for development environment
      if (identifier === 'unknown_ip' && isDevelopment) {
        identifier = 'development_user'
        logger.info("Development environment detected, using placeholder identifier")
      }
    }

    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

    // 1. Check current count
    const { data: limitData, error: limitSelectError } = await supabaseAdmin
      .from('daily_generation_limits')
      .select('count')
      .eq('identifier', identifier)
      .eq('identifier_type', identifier_type)
      .eq('generation_date', today)
      .single()

    // To address race condition in rate limiting, we'll switch to an atomic function
    // This function will check and increment in a single transaction
    const { data: limitResult, error: limitRpcError } = await supabaseAdmin.rpc(
      'check_and_increment_limit',
      {
        p_identifier: identifier,
        p_identifier_type: identifier_type,
        p_generation_date: today,
        p_limit: DAILY_LIMIT
      }
    );
    
    if (limitRpcError) {
      logger.error('Error checking generation limit', { error: limitRpcError })
      const { response, status } = createErrorResponse(
        limitRpcError, 
        'Error checking usage limit', 
        500
      );
      return Response.json(response, { status });
    }
    
    // If no result or limit reached
    if (!limitResult || !limitResult[0]?.success) {
      logger.info('Daily limit reached', { identifierType: identifier_type })
      return tooManyRequests(`Daily generation limit of ${DAILY_LIMIT} reached.`);
    }
    
    // Calculate remaining generations
    const remainingGenerations = limitResult[0].remaining;

    logger.info('Usage count incremented', { identifierType: identifier_type, remainingGenerations })

    // 3. Proceed with Icon SVG generation
    const { prompt, style = "icon", size = "1024x1024", aspect_ratio = "1:1" } = await req.json()

    if (!prompt) {
      return badRequest("Prompt is required");
    }

    // Initialize Replicate client with validated API token
    // SECURITY: Never directly embed environment variables in objects
    // that might be serialized or logged
    if (!replicateApiToken) {
      logger.error('Missing Replicate API token during request', { operation: 'icon-generation' });
      throw new Error('Configuration error: Missing API credentials');
    }
    
    const replicate = new Replicate({
      auth: replicateApiToken,
    })

    // Add validation for Replicate input - use icon styles only
    const allowedStyles = [
      "icon", "icon/broken_line", "icon/colored_outline", 
      "icon/colored_shapes", "icon/colored_shapes_gradient", "icon/doodle_fill", 
      "icon/doodle_offset_fill", "icon/offset_fill", "icon/outline", 
      "icon/outline_gradient", "icon/uneven_fill"
    ];
    
    const allowedSizes = [
      "1024x1024", "1365x1024", "1024x1365", "1536x1024", "1024x1536",
      "1820x1024", "1024x1820", "1024x2048", "2048x1024", "1434x1024",
      "1024x1434", "1024x1280", "1280x1024", "1024x1707", "1707x1024"
    ];
    
    const allowedAspectRatios = [
      "Not set", "1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16",
      "1:2", "2:1", "7:5", "5:7", "4:5", "5:4", "3:5", "5:3"
    ];

    // Sanitize inputs
    const validatedStyle = allowedStyles.includes(style) ? style : "icon";
    const validatedSize = allowedSizes.includes(size) ? size : "1024x1024";
    const validatedAspectRatio = allowedAspectRatios.includes(aspect_ratio) ? aspect_ratio : "1:1";
    
    // SECURITY: Generate the SVG using a securely sanitized prompt
    // This prevents injection attacks in the model API
    const sanitizedPrompt = sanitizeAndTrimText(prompt, 1000);
    
    if (sanitizedPrompt !== prompt) {
      logger.info('Prompt was sanitized or truncated', {
        // SECURITY: Don't log full prompts, just the relevant info about the changes
        originalLength: prompt.length,
        newLength: sanitizedPrompt.length
      });
    }
    
    // SECURITY: All inputs validated and sanitized before passing to external API
    let output: any;
    try {
      // This extra validation at request-time ensures the token hasn't been unset
      // since the route handler was initialized
      if (!replicateApiToken) {
        logger.error('Missing Replicate API token during request', { operation: 'icon-generation' });
        throw new Error('Configuration error: Missing API credentials');
      }
      
      // --- Add logging for input parameters --- 
      const replicateInput: any = {
        prompt: sanitizedPrompt,
        style: validatedStyle,
        size: validatedSize,
      };
      
      // Only include aspect_ratio if it's not "Not set"
      if (validatedAspectRatio && validatedAspectRatio !== "Not set") {
        replicateInput.aspect_ratio = validatedAspectRatio;
      }
      
      logger.debug('Sending input to Replicate (icon):', { input: replicateInput });
      // ----------------------------------------
      
      let predictionResult: any = null;
      
      try {
        // Use the predictions.create method
        predictionResult = await replicate.predictions.create({
          model: "recraft-ai/recraft-20b-svg",
          input: replicateInput,
        });
        
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
            logger.error('Error checking icon prediction status', { 
              error: statusCheckError instanceof Error ? statusCheckError.message : String(statusCheckError),
              predictionId: predictionResult?.id
            });
            // Allow loop to continue, maybe a transient error
          }
        }
        
        // Check for timeout
        if (waitTime >= maxWaitTime && predictionResult.status !== "succeeded") {
          logger.error('Icon prediction timed out', { predictionId: predictionResult?.id, status: predictionResult?.status });
          throw new Error(`Icon prediction timed out after ${maxWaitTime} seconds`);
        }
        
        // Check if prediction failed
        if (predictionResult.status === "failed") {
          logger.error('Icon prediction failed', { predictionId: predictionResult?.id, error: predictionResult.error });
          throw new Error(`Icon prediction failed: ${predictionResult.error || "Unknown error"}`);
        }
        
        // Check if prediction succeeded but has no output
        if (predictionResult.status === "succeeded" && !predictionResult.output) {
          logger.error('Icon prediction succeeded but has no output', { predictionId: predictionResult?.id });
          throw new Error("Icon prediction succeeded but returned no output");
        }
        
        output = predictionResult.output;
        
      } catch (error) {
        logger.error('Error running Replicate prediction for icon', { 
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        // Re-throw the error to be caught by the main handler
        throw error; 
      }
      
      // Extract the SVG URL - should be a string or an array containing a string
      let svgUrl: string | null = null;
      if (typeof output === 'string' && output.startsWith('http')) {
        svgUrl = output;
      } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string' && output[0].startsWith('http')) {
        svgUrl = output[0];
      } else {
        logger.warn('Could not extract SVG URL from Replicate response', { 
          identifier_type: identifier_type,
          hasIdentifier: !!identifier,
          outputType: typeof output
        });
        // Use createApiError for a structured 422 response
        return createApiError(422, "Could not extract SVG URL from the generation service.");
      }
      
      logger.info('Extracted Icon URL', { url: svgUrl ? svgUrl.substring(0, 50) + '...' : 'None' });

      // Save icon details for logged-in users
      if (identifier_type === 'user_id' && svgUrl) {
        try {
          // Validate URL before fetching to prevent SSRF
          if (!isUrlSafe(svgUrl, ALLOWED_DOMAINS)) {
            logger.error(`Blocked potentially unsafe URL`, { url: svgUrl });
            throw new Error('Icon URL failed security validation');
          }
          
          // Fetch the actual SVG content from the URL
          logger.info(`Fetching icon content from validated URL: ${svgUrl.substring(0, 50)}...`);
          
          // Add timeout to prevent hanging connections
          const svgResponse = await fetch(svgUrl, { 
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'image/svg+xml, */*'
            }
          });
          
          if (!svgResponse.ok) {
            logger.error(`Failed to fetch icon content: ${svgResponse.status} ${svgResponse.statusText}`);
            throw new Error(`Failed to fetch icon content: ${svgResponse.status}`);
          }
          
          const contentType = svgResponse.headers.get('content-type');
          logger.debug(`Icon response content type: ${contentType}`);
          
          const rawSvgText = await svgResponse.text();
          
          // Basic validation
          if (!rawSvgText || !rawSvgText.trim().toLowerCase().startsWith('<svg')) {
            logger.error('Fetched content does not appear to be a valid SVG icon', {
              contentStart: rawSvgText.substring(0, 100),
              contentLength: rawSvgText.length
            });
            throw new Error('Fetched content does not appear to be a valid SVG icon.');
          }
          
          // Sanitize SVG content to prevent XSS attacks
          const sanitizedSvgText = sanitizeSvg(rawSvgText);
          
          // Sanitize the title derived from the prompt
          const svgTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled Icon';

          logger.info(`Inserting sanitized icon content for user`);
          
          // For authenticated users, use their own client with RLS protection when possible
          // In this case we still need admin client since we're storing for their user_id
          const { error: insertError } = await supabaseAdmin
            .from('svg_designs')
            .insert({
              user_id: identifier,
              prompt: prompt,
              svg_content: sanitizedSvgText, // Store sanitized content
              title: svgTitle, // Add sanitized title
              tags: ['icon'] // Add icon tag to differentiate from regular SVGs
            });

          if (insertError) {
            logger.error("Error saving icon design to database", { error: insertError });
          } else {
            logger.info(`Successfully inserted icon design`);
          }
        } catch (fetchSaveError) {
          logger.error("Error processing icon", { error: fetchSaveError });
          // Continue execution even if saving fails - we still want to return the URL
        }
      }

      // Return the URL and remaining generations
      const result = createSuccessResponse({
          svgUrl: svgUrl, 
          remainingGenerations: remainingGenerations, 
          modelInfo: 'recraft-ai/recraft-20b-svg'
        });
      return successResponse(result);

    } catch (error) {
      // SECURITY: Sanitize error objects before logging to prevent token leakage
      const sanitizedError = sanitizeData(error);
      
      logger.error("Error generating SVG icon", { error: sanitizedError });
      
      // Use genericized error message for production to prevent information leakage
      const errorMessage = process.env.NODE_ENV === 'production' 
        ? "Failed to generate SVG icon" 
        : (error instanceof Error ? error.message : "Unknown error");
      
      const { response, status } = createErrorResponse(
        null, // Never pass the raw error object to prevent token leakage
        errorMessage,
        500
      );
      
      return Response.json(response, { status });
    }
  } catch (error) {
    // SECURITY: Sanitize error objects before logging to prevent token leakage
    const sanitizedError = sanitizeData(error);
    
    logger.error("Error generating SVG icon", { error: sanitizedError });
    
    // Use genericized error message for production to prevent information leakage
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? "Failed to generate SVG icon" 
      : (error instanceof Error ? error.message : "Unknown error");
    
    const { response, status } = createErrorResponse(
      null, // Never pass the raw error object to prevent token leakage
      errorMessage,
      500
    );
    
    return Response.json(response, { status });
  }
}