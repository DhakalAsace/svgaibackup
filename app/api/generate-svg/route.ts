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
import { sanitizeData } from '@/lib/sanitize-utils'

// Add export config to enable Edge Runtime with 30s timeout instead of 10s
export const runtime = 'edge';
// export const dynamic = "force-static"; // Removed as it's incompatible with Edge Runtime

// Initialize logger
const logger = createLogger('api:generate-svg');

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

const DAILY_LIMIT = 10;

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
          error: "Something went wrong, please try again later"
        }, { status: 403 })
      }
      
      // Use a placeholder for development environment
      if (identifier === 'unknown_ip' && isDevelopment) {
        identifier = 'development_user'
        logger.info("Development environment detected, using placeholder identifier")
      }
    }

    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

    // To address race condition in rate limiting, we'll use the atomic function
    // This function will check and increment in a single transaction
    const { data: limitResult, error: limitError } = await supabaseAdmin.rpc(
      'check_and_increment_limit',
      {
        p_identifier: identifier,
        p_identifier_type: identifier_type,
        p_generation_date: today,
        p_limit: DAILY_LIMIT
      }
    );
    
    if (limitError) {
      logger.error('Error checking generation limit', { error: limitError })
      const { response, status } = createErrorResponse(
        limitError, 
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

    // 3. Proceed with SVG generation
    const { prompt, style = "any", size = "1024x1024", aspect_ratio = "Not set" } = await req.json()

    if (!prompt) {
      return badRequest("Prompt is required");
    }

    // Initialize Replicate client with validated API token
    // SECURITY: Never directly embed environment variables in objects
    // that might be serialized or logged
    if (!replicateApiToken) {
      logger.error('Missing Replicate API token during request', { operation: 'svg-generation' });
      throw new Error('Configuration error: Missing API credentials');
    }
    
    const replicate = new Replicate({
      auth: replicateApiToken,
    })

    // Add validation for Replicate input
    const allowedStyles = ["any", "engraving", "line_art", "line_circuit", "linocut"];
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
    const validatedStyle = allowedStyles.includes(style) ? style : "any";
    const validatedSize = allowedSizes.includes(size) ? size : "1024x1024";
    const validatedAspectRatio = allowedAspectRatios.includes(aspect_ratio) ? aspect_ratio : "Not set";
    
    logger.debug('Initiating Replicate SVG generation request', {
      operation: 'svg-generation',
      style: validatedStyle,
      size: validatedSize,
      aspect_ratio: validatedAspectRatio,
      promptLength: prompt ? prompt.length : 0
    });

    // Initialize output variable outside try/catch
    let output: any = null; // Using 'any' for flexibility with Replicate's potential outputs
    let predictionResult: any = null; // Variable to hold the full prediction result

    try {
      logger.info('Attempting to run Replicate model', { 
        operation: 'svg-generation',
        promptLength: prompt.length
      });

      // --- Add logging for input parameters --- 
      const replicateInput: any = {
        prompt,
        style: validatedStyle,
        size: validatedSize,
      };
      
      // Only include aspect_ratio if it's not "Not set"
      if (validatedAspectRatio && validatedAspectRatio !== "Not set") {
        replicateInput.aspect_ratio = validatedAspectRatio;
      }
      
      logger.debug('Sending input to Replicate:', { input: replicateInput });
      // ----------------------------------------

      try {
        // Use the predictions.create method as recommended in documentation
        // for more detailed response and error information
        predictionResult = await replicate.predictions.create({
          model: "recraft-ai/recraft-v3-svg",
          input: replicateInput,
          // Add webhook for completion notification (optional)
          // webhook: process.env.REPLICATE_WEBHOOK_URL,
          // webhook_events_filter: ["completed"]
        });
        
        logger.debug('Prediction created successfully', { 
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
          // Sleep for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000));
          waitTime++;
          
          try {
            // Get the latest prediction
            predictionResult = await replicate.predictions.get(predictionResult.id);
            
            logger.debug('Prediction status updated', { 
              status: predictionResult?.status,
              waitTime: `${waitTime}/${maxWaitTime} seconds`,
              completed_at: predictionResult?.completed_at || null
            });
          } catch (statusCheckError) {
            logger.error('Error checking prediction status', { 
              error: statusCheckError,
              predictionId: predictionResult?.id
            });
            // Continue the loop but log the error
          }
        }
        
        // Check for timeout
        if (waitTime >= maxWaitTime && predictionResult.status !== "succeeded") {
          logger.error('Prediction timed out', {
            predictionId: predictionResult?.id,
            status: predictionResult?.status
          });
          throw new Error(`Prediction timed out after ${maxWaitTime} seconds`);
        }
        
        // Check if prediction failed
        if (predictionResult.status === "failed") {
          logger.error('Prediction failed', {
            predictionId: predictionResult?.id,
            error: predictionResult.error
          });
          throw new Error(`Prediction failed: ${predictionResult.error || "Unknown error"}`);
        }
        
        // Extract the output from the completed prediction
        if (!predictionResult.output) {
          logger.error('Prediction succeeded but has no output', {
            predictionId: predictionResult?.id,
            status: predictionResult?.status
          });
          throw new Error("Prediction succeeded but returned no output");
        }
        
        output = predictionResult.output;
      } catch (error) {
        logger.error('Error running Replicate prediction', { 
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    
    } catch (replicateError) {
      // Enhanced error logging
      console.error("Replicate API Error:", replicateError);
      
      // Attempt to serialize the error properly
      let errorMessage = "Error from SVG generation service";
      let errorDetails = "Unknown error";
      
      if (replicateError instanceof Error) {
        errorMessage = replicateError.message;
        errorDetails = replicateError.stack || "No stack trace";
      } else if (typeof replicateError === 'string') {
        errorMessage = replicateError;
      } else if (replicateError && typeof replicateError === 'object') {
        try {
          errorDetails = JSON.stringify(replicateError);
        } catch (e) {
          errorDetails = "Error object couldn't be stringified";
        }
      }
      
      console.error("Formatted error message:", errorMessage);
      console.error("Error details:", errorDetails);
      
      return Response.json({ 
        success: false, 
        error: errorMessage,
        details: errorDetails,
        env: process.env.NODE_ENV
      }, { status: 500 });
    }
    
    // Log the entire prediction object, focusing on the output field, for detailed debugging
    logger.debug("Completed Replicate Prediction Object:", {
      predictionId: predictionResult?.id,
      status: predictionResult?.status,
      outputSample: typeof output === 'string' ? output.substring(0, 100) : JSON.stringify(output).substring(0, 100)
    });
    
    // Extract the SVG URL - handle different possible structures
    let svgUrl: string | null = null
    let directSvgContent: string | null = null
    
    // Add detailed logging of the output for debugging
    logger.debug("Raw Replicate output:", { 
      outputType: typeof output, 
      isArray: Array.isArray(output),
      length: typeof output === 'string' ? output.length : (Array.isArray(output) ? output.length : 'N/A')
    });
    
    // According to Replicate docs, the output should be a direct URL string
    // But let's handle various possible output formats for robustness
    if (typeof output === 'string') {
      if (output.trim().toLowerCase().startsWith('<svg')) {
        directSvgContent = output;
        logger.debug("Found direct SVG content in the response");
      } else if (output.startsWith('http')) {
        svgUrl = output;
        logger.debug("Extracted URL directly from string output");
      } else {
        logger.warn("Received string from Replicate but it's neither a URL nor SVG content", {
          sample: output.substring(0, 50) + '...'
        });
      }
    } else if (Array.isArray(output) && output.length > 0) {
      // If it's an array (which sometimes happens with newer models), use the first item
      const firstItem = output[0];
      if (typeof firstItem === 'string') {
        if (firstItem.startsWith('http')) {
          svgUrl = firstItem;
          logger.debug("Extracted URL from first array item");
        } else if (firstItem.trim().toLowerCase().startsWith('<svg')) {
          directSvgContent = firstItem;
          logger.debug("Found direct SVG content in first array item");
        }
      }
      
      // If we couldn't extract from the first item, try all items
      if (!svgUrl && !directSvgContent) {
        for (const item of output) {
          if (typeof item === 'string' && item.startsWith('http')) {
            svgUrl = item;
            logger.debug("Extracted URL from array item at position " + output.indexOf(item));
            break;
          } else if (typeof item === 'string' && item.trim().toLowerCase().startsWith('<svg')) {
            directSvgContent = item;
            logger.debug("Found direct SVG content in array item at position " + output.indexOf(item));
            break;
          }
        }
      }
    }
    
    // If we have neither direct content nor a URL at this point, something went wrong
    if (!svgUrl && !directSvgContent) {
      logger.warn('Could not extract SVG URL or direct content from Replicate response', {
        identifier_type,
        hasIdentifier: !!identifier,
        predictionId: predictionResult?.id // Corrected: Use predictionResult.id
      });

      // Return a 422 error 
      return Response.json(
        { 
          success: false, 
          error: 'SVG generation succeeded according to Replicate, but no usable output (URL or content) was found.' 
        },
        { status: 422 } // Unprocessable Entity
      ); 
    }
    
    // If we have direct SVG content but no URL, we can skip the fetching step
    if (directSvgContent && !svgUrl) {
      logger.info("Using direct SVG content from API response instead of URL")
      
      // Sanitize the direct SVG content
      const sanitizedSvgText = sanitizeSvg(directSvgContent)
      
      // Sanitize the title derived from the prompt
      const svgTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled SVG'
      
      // For authenticated users, save to database
      if (identifier_type === 'user_id') {
        try {
          logger.info(`Inserting direct SVG content for user`)
          
          const { error: insertError } = await supabaseAdmin
            .from('svg_designs')
            .insert({
              user_id: identifier,
              prompt: prompt,
              svg_content: sanitizedSvgText,
              title: svgTitle
            })
          
          if (insertError) {
            logger.error("Error saving direct SVG content to database", { error: insertError })
          } else {
            logger.info(`Successfully inserted direct SVG content`)
          }
        } catch (saveError) {
          logger.error("Error saving direct SVG content", { error: saveError })
        }
      }
      
      // Create a data URL from the SVG content for the response
      const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(sanitizedSvgText).toString('base64')}`
      
      // Return success with the data URL
      const result = createSuccessResponse({
        svgUrl: svgDataUrl,
        remainingGenerations: remainingGenerations,
        modelInfo: 'recraft-ai/recraft-v3-svg',
        directContent: true // Flag to indicate this is direct content
      })
      
      return successResponse(result)
    }
    
    logger.info("Extracted SVG URL", { urlFound: !!svgUrl, url: svgUrl ? svgUrl.substring(0, 50) + '...' : null })
    
    // Save SVG details for logged-in users (if needed)
    if (identifier_type === 'user_id' && svgUrl) {
      try {
        // Validate URL before fetching to prevent SSRF
        if (!isUrlSafe(svgUrl, ALLOWED_DOMAINS)) {
          logger.error(`Blocked potentially unsafe URL`, { url: svgUrl });
          throw new Error('SVG URL failed security validation');
        }
        
        // Fetch the actual SVG content from the URL
        logger.info(`Fetching SVG content from validated URL: ${svgUrl.substring(0, 50)}...`);
        
        // Add timeout to prevent hanging connections
        const svgResponse = await fetch(svgUrl, { 
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'image/svg+xml, */*'
          }
        });
        
        if (!svgResponse.ok) {
          logger.error(`Failed to fetch SVG content: ${svgResponse.status} ${svgResponse.statusText}`);
          throw new Error(`Failed to fetch SVG content: ${svgResponse.status}`);
        }
        
        const contentType = svgResponse.headers.get('content-type');
        logger.debug(`SVG response content type: ${contentType}`);
        
        const rawSvgText = await svgResponse.text();
        
        // Log a sample of the content for debugging
        logger.debug(`SVG content sample: ${rawSvgText.substring(0, 100)}...`);
        
        // Basic validation
        if (!rawSvgText || !rawSvgText.trim().toLowerCase().startsWith('<svg')) {
          logger.error('Fetched content does not appear to be a valid SVG', {
            contentStart: rawSvgText.substring(0, 100),
            contentLength: rawSvgText.length
          });
          throw new Error('Fetched content does not appear to be a valid SVG.');
        }
        
        // Sanitize SVG content to prevent XSS attacks
        const sanitizedSvgText = sanitizeSvg(rawSvgText);
        
        // Sanitize the title derived from the prompt
        const svgTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled SVG';

        logger.info(`Inserting sanitized SVG content for user`);
        
        // For authenticated users, use their own client with RLS protection when possible
        // In this case we still need admin client since we're storing for their user_id
        const { error: insertError } = await supabaseAdmin
          .from('svg_designs')
          .insert({
            user_id: identifier,
            prompt: prompt,
            svg_content: sanitizedSvgText, // Store sanitized content
            title: svgTitle // Add sanitized title
          });

        if (insertError) {
          logger.error("Error saving SVG design to database", { error: insertError });
        } else {
          logger.info(`Successfully inserted SVG design`);
        }
      } catch (fetchSaveError) {
        logger.error("Error processing SVG", { error: fetchSaveError });
      }
    }
    
    // Return only necessary information to the client
    // Return success only if we have a URL or direct content
    const result = createSuccessResponse({
        svgUrl: svgUrl, // Can be null if directSvgContent is present
        svgContent: directSvgContent, // Can be null if svgUrl is present
        remainingGenerations: remainingGenerations,
        modelInfo: 'recraft-ai/recraft-20b-svg' // Or dynamically get model info if needed
      });
    return successResponse(result);

  } catch (error) {
    // SECURITY: Sanitize error objects before logging to prevent token leakage
    const sanitizedError = sanitizeData(error);
    
    logger.error("Error generating SVG", { error: sanitizedError });
    
    // Use genericized error message for production to prevent information leakage
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? "Failed to generate SVG" 
      : (error instanceof Error ? error.message : "Unknown error");
    
    const { response, status } = createErrorResponse(
      null, // Never pass the raw error object to prevent token leakage
      errorMessage,
      500
    );
    
    return Response.json(response, { status });
  }
}
