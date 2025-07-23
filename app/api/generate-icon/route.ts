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

export async function POST(req: NextRequest) {
  // Declare deductResult outside try/catch so it's accessible in error handling
  let deductResult: any = null;
  let isSubscribed = false;
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
      const { data: anonCheck } = await supabaseAdmin
        .from('daily_generation_limits')
        .select('count')
        .eq('identifier', identifier)
        .eq('identifier_type', identifier_type)
        .eq('generation_date', new Date().toISOString().split('T')[0])
        .single();
      
      if (anonCheck && anonCheck.count >= 1) {
        return tooManyRequests("Sign up to continue generating for free and get 6 bonus credits!");
      }
      
      canGenerate = true;
      remainingCredits = 1;
    }

    logger.info('Credit check passed', { identifierType: identifier_type, remainingCredits })

    // 3. Validate request body
    const { data: validatedData, error: validationError } = await validateRequestBody(req, generateIconSchema);
    
    if (validationError) {
      logger.warn('Invalid request body', { error: validationError });
      return badRequest(validationError);
    }
    
    // 4. DEDUCT CREDITS BEFORE GENERATION to prevent race conditions
    const { data: deductData, error: deductError } = await supabaseAdmin.rpc(
      'check_credits_v3',
      {
        p_user_id: user?.id || null,
        p_identifier: identifier,
        p_identifier_type: identifier_type,
        p_generation_type: 'icon'
      }
    );
    
    deductResult = deductData; // Store in outer scope variable
    
    if (deductError || !deductResult?.[0]?.success) {
      logger.error('Error deducting credits', { error: deductError, result: deductResult });
      return tooManyRequests("Insufficient credits or rate limit exceeded");
    }
    
    // Update remaining credits from the deduction
    remainingCredits = deductResult[0].remaining_credits;
    
    // 5. Proceed with Icon SVG generation
    const { prompt, style = "icon", size = "1024x1024", aspect_ratio = "1:1" } = validatedData!;

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

      // Save icon details for logged-in users (best-effort)
      if (identifier_type === 'user_id' && svgUrl) {
        try {
          // Validate URL before fetching to prevent SSRF
          if (!isUrlSafe(svgUrl, ALLOWED_DOMAINS)) {
            logger.error('Blocked potentially unsafe URL', { url: svgUrl });
            throw new Error('Icon URL failed security validation');
          }

          // Fetch the SVG content (with timeout) so we can sanitize & store it
          const svgResponse = await fetch(svgUrl, {
            signal: AbortSignal.timeout(10000),
            headers: { Accept: 'image/svg+xml, */*' },
          });

          if (!svgResponse.ok) {
            throw new Error(`Failed to fetch icon content: ${svgResponse.status}`);
          }

          const rawSvgText = await svgResponse.text();

          if (!rawSvgText.trim().toLowerCase().startsWith('<svg')) {
            throw new Error('Fetched content does not appear to be a valid SVG icon.');
          }

          // Sanitize & (optionally) watermark the SVG for free users
          let sanitizedSvgText = sanitizeSvg(rawSvgText);
          sanitizedSvgText = addWatermarkNode(sanitizedSvgText, isSubscribed);

          const svgTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled Icon';

          // Store the design (ignore errors – non-critical)
          await supabaseAdmin.from('svg_designs').insert({
            user_id: identifier,
            prompt: prompt,
            svg_content: sanitizedSvgText,
            title: svgTitle,
            tags: ['icon'],
          });
        } catch (saveErr) {
          logger.error('Error saving icon design', {
            error: saveErr instanceof Error ? saveErr.message : String(saveErr),
          });
        }
      }

      // Credits already deducted before generation, no need to deduct again

      // Return the URL and remaining credits
      return successResponse(
        createSuccessResponse({
          svgUrl,
          remainingGenerations: remainingCredits, // Use the credits from after deduction
          creditsUsed: 1,
          modelInfo: 'recraft-ai/recraft-20b-svg',
          isSubscribed,
        }),
      );

    } catch (error) {
      const sanitizedError = sanitizeData(error);
      logger.error('Error generating SVG icon', { error: sanitizedError });
      
      // REFUND CREDITS if generation failed (only if we deducted them)
      if (deductResult?.[0]?.success) {
        try {
          // Refund the credits by reversing the deduction
          if (user?.id) {
            if (isSubscribed) {
              // Get current credits and subtract
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('monthly_credits_used')
                .eq('id', user.id)
                .single();
              
              if (profile) {
                await supabaseAdmin
                  .from('profiles')
                  .update({ 
                    monthly_credits_used: Math.max(0, profile.monthly_credits_used - 1)
                  })
                  .eq('id', user.id);
              }
            } else {
              // Get current credits and subtract
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('lifetime_credits_used')
                .eq('id', user.id)
                .single();
              
              if (profile) {
                await supabaseAdmin
                  .from('profiles')
                  .update({ 
                    lifetime_credits_used: Math.max(0, profile.lifetime_credits_used - 1)
                  })
                  .eq('id', user.id);
              }
            }
            logger.info('Credits refunded due to generation failure');
          } else {
            // For anonymous users, decrement the daily counter
            // Get current count and decrement
            const { data: limitData } = await supabaseAdmin
              .from('daily_generation_limits')
              .select('count')
              .eq('identifier', identifier)
              .eq('identifier_type', identifier_type)
              .eq('generation_date', new Date().toISOString().split('T')[0])
              .single();
            
            if (limitData) {
              await supabaseAdmin
                .from('daily_generation_limits')
                .update({ count: Math.max(0, limitData.count - 1) })
                .eq('identifier', identifier)
                .eq('identifier_type', identifier_type)
                .eq('generation_date', new Date().toISOString().split('T')[0]);
            }
            logger.info('Anonymous counter decremented due to generation failure');
          }
        } catch (refundError) {
          logger.error('Failed to refund credits', { error: refundError });
        }
      }
      
      const errorMessage =
        process.env.NODE_ENV === 'production'
          ? 'Failed to generate SVG icon'
          : error instanceof Error
          ? error.message
          : 'Unknown error';

      const { response, status } = createErrorResponse(null, errorMessage, 500);
      return Response.json(response, { status });
    }
  } catch (error) {
    const sanitizedError = sanitizeData(error);
    logger.error('Error generating SVG icon - outer catch', { error: sanitizedError });
    
    // REFUND CREDITS if generation failed (only if we deducted them)
    if (deductResult?.[0]?.success) {
      try {
        // Refund the credits by reversing the deduction
        if (user?.id) {
          if (isSubscribed) {
            // Get current credits and subtract
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('monthly_credits_used')
              .eq('id', user.id)
              .single();
            
            if (profile) {
              await supabaseAdmin
                .from('profiles')
                .update({ 
                  monthly_credits_used: Math.max(0, profile.monthly_credits_used - 1)
                })
                .eq('id', user.id);
            }
          } else {
            // Get current credits and subtract
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('lifetime_credits_used')
              .eq('id', user.id)
              .single();
            
            if (profile) {
              await supabaseAdmin
                .from('profiles')
                .update({ 
                  lifetime_credits_used: Math.max(0, profile.lifetime_credits_used - 1)
                })
                .eq('id', user.id);
            }
          }
          logger.info('Credits refunded due to generation failure');
        } else {
          // For anonymous users, decrement the daily counter
          // Get current count and decrement
          const { data: limitData } = await supabaseAdmin
            .from('daily_generation_limits')
            .select('count')
            .eq('identifier', identifier)
            .eq('identifier_type', identifier_type)
            .eq('generation_date', new Date().toISOString().split('T')[0])
            .single();
          
          if (limitData) {
            await supabaseAdmin
              .from('daily_generation_limits')
              .update({ count: Math.max(0, limitData.count - 1) })
              .eq('identifier', identifier)
              .eq('identifier_type', identifier_type)
              .eq('generation_date', new Date().toISOString().split('T')[0]);
          }
          logger.info('Anonymous counter decremented due to generation failure');
        }
      } catch (refundError) {
        logger.error('Failed to refund credits', { error: refundError });
      }
    }
    
    const errorMessage =
      process.env.NODE_ENV === 'production'
        ? 'Failed to generate SVG icon'
        : error instanceof Error
        ? error.message
        : 'Unknown error';

    const { response, status } = createErrorResponse(null, errorMessage, 500);
    return Response.json(response, { status });
  }
}