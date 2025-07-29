import Replicate from "replicate"
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Import security utilities
import { sanitizeSvg } from '@/lib/svg-sanitizer'
import { isUrlSafe } from '@/lib/url-validator'
import { createLogger } from '@/lib/logger'
import { createErrorResponse, createSuccessResponse, successResponse, badRequest, tooManyRequests } from '@/lib/error-handler'
import { sanitizeAndTrimText } from '@/lib/text-sanitizer'
import { sanitizeData } from '@/lib/sanitize-utils'
import { addWatermarkNode } from '@/lib/svg-watermark'
import { generateSvgSchema, validateRequestBody } from '@/lib/validation-schemas'
import { executeWithCredits } from '@/lib/credit-operations'
import { handleAPIError, extractErrorDetails } from '@/lib/api-error-handler'

// Add export config to enable Edge Runtime with 30s timeout instead of 10s
export const runtime = 'edge';
// export const dynamic = "force-static"; // Removed as it's incompatible with Edge Runtime

// Add GET handler to prevent 405 errors
export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'This endpoint only accepts POST requests',
    method: 'POST',
    contentType: 'application/json'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

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

const DAILY_LIMIT = 2; // Free tier: 2 generations per day without signup

// Helper function that contains all the SVG generation logic
async function performSvgGeneration(
  validatedData: { prompt: string; style?: string; size?: string; aspect_ratio?: string },
  isSubscribed: boolean,
  user: any,
  identifier: string,
  identifier_type: 'user_id' | 'ip_address'
) {
  const { prompt, style = "any", size = "1024x1024", aspect_ratio = "Not set" } = validatedData;

  // Initialize Replicate client with validated API token
  if (!replicateApiToken) {
    logger.error('Missing Replicate API token during request', { operation: 'svg-generation' });
    throw new Error('Configuration error: Missing API credentials');
  }
  
  const replicate = new Replicate({
    auth: replicateApiToken,
  });

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

  // Initialize output variable
  let output: any = null;
  let predictionResult: any = null;

  try {
    logger.info('Attempting to run Replicate model', { 
      operation: 'svg-generation',
      promptLength: prompt.length
    });

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

    // Use the predictions.create method as recommended in documentation
    try {
      predictionResult = await replicate.predictions.create({
        model: "recraft-ai/recraft-v3-svg",
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
        const apiError = handleAPIError(statusCheckError);
        logger.error('Error checking prediction status', { 
          error: extractErrorDetails(statusCheckError),
          predictionId: predictionResult?.id,
          statusCode: apiError.statusCode
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
    throw error; // Re-throw to be caught by executeWithCredits
  }
  
  // Log the entire prediction object
  logger.debug("Completed Replicate Prediction Object:", {
    predictionId: predictionResult?.id,
    status: predictionResult?.status,
    outputSample: typeof output === 'string' ? output.substring(0, 100) : JSON.stringify(output).substring(0, 100)
  });
  
  // Extract the SVG URL - handle different possible structures
  let svgUrl: string | null = null;
  let directSvgContent: string | null = null;
  
  // Add detailed logging of the output for debugging
  logger.debug("Raw Replicate output:", { 
    outputType: typeof output, 
    isArray: Array.isArray(output),
    length: typeof output === 'string' ? output.length : (Array.isArray(output) ? output.length : 'N/A')
  });
  
  // According to Replicate docs, the output should be a direct URL string
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
    // If it's an array, use the first item
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
      predictionId: predictionResult?.id
    });
    throw new Error('SVG generation succeeded according to Replicate, but no usable output (URL or content) was found.');
  }
  
  const svgTitle = sanitizeAndTrimText(prompt, 50) || 'Untitled SVG';
  
  // If we have direct SVG content but no URL, we can process it directly
  if (directSvgContent && !svgUrl) {
    logger.info("Using direct SVG content from API response instead of URL");
    
    // Sanitize the direct SVG content
    const sanitizedSvgText = sanitizeSvg(directSvgContent);
    
    // For authenticated users, save to database
    if (identifier_type === 'user_id') {
      try {
        logger.info(`Inserting direct SVG content for user`);
        
        const { error: insertError } = await supabaseAdmin
          .from('svg_designs')
          .insert({
            user_id: identifier,
            prompt: prompt,
            svg_content: sanitizedSvgText,
            title: svgTitle,
            tags: ['svg'] // Explicitly tag as SVG since it's from SVG generator
          });
        
        if (insertError) {
          logger.error("Error saving direct SVG content to database", { error: insertError });
        } else {
          logger.info(`Successfully inserted direct SVG content`);
        }
      } catch (saveError) {
        logger.error("Error saving direct SVG content", { error: saveError });
      }
    }
    
    // Create a data URL from the SVG content for the response
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(sanitizedSvgText).toString('base64')}`;
    
    return {
      svgUrl: svgDataUrl,
      directSvgContent: sanitizedSvgText,
      svgTitle,
      isSubscribed
    };
  }
  
  logger.info("Extracted SVG URL", { urlFound: !!svgUrl, url: svgUrl ? svgUrl.substring(0, 50) + '...' : null });
  
  // Save SVG details for logged-in users
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
      let sanitizedSvgText = sanitizeSvg(rawSvgText);
      
      // Add watermark for non-subscribed users
      sanitizedSvgText = addWatermarkNode(sanitizedSvgText, isSubscribed);

      logger.info(`Inserting sanitized SVG content for user`);
      
      const { error: insertError } = await supabaseAdmin
        .from('svg_designs')
        .insert({
          user_id: identifier,
          prompt: prompt,
          svg_content: sanitizedSvgText, // Store sanitized content
          title: svgTitle, // Add sanitized title
          tags: ['svg'] // Explicitly tag as SVG since it's from SVG generator
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
  
  return {
    svgUrl,
    directSvgContent,
    svgTitle,
    isSubscribed
  };
}

export async function POST(req: NextRequest) {
  // Declare deductResult outside try/catch so it's accessible in error handling
  const deductResult: any = null;
  let isSubscribed = false;
  let user: any = null;
  let identifier: string = '';
  let identifier_type: 'user_id' | 'ip_address' = 'ip_address';
  let remainingCredits = 0;
  
  try {
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
          canGenerate = remainingCredits >= 2; // SVG costs 2 credits
        } else {
          // Check lifetime credits
          remainingCredits = checkResult.lifetime_credits_granted - checkResult.lifetime_credits_used;
          canGenerate = remainingCredits >= 2; // SVG costs 2 credits
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
      
      // SVG costs 2 credits, so check if they have enough
      if (creditsRemaining < 2) {
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
    const { data: validatedData, error: validationError } = await validateRequestBody(req, generateSvgSchema);
    
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
        return await performSvgGeneration(validatedData!, isSubscribed, user, identifier, identifier_type);
      },
      userId: user?.id || null,
      identifier,
      identifierType: identifier_type,
      generationType: 'svg',
      supabaseAdmin: supabaseAdmin as any
    });
    
    if (!result.success) {
      logger.error('SVG generation failed', { error: result.error });
      return tooManyRequests(result.error || "Generation failed");
    }
    
    // Extract data from successful result
    const { svgUrl, directSvgContent, svgTitle } = result.data!;
    remainingCredits = result.remainingCredits || 0;
    
    // Create and return success response
    const successData = createSuccessResponse({
      svgUrl: svgUrl || undefined,
      svgContent: directSvgContent || undefined,
      remainingGenerations: remainingCredits,
      creditsUsed: 2, // SVG costs 2 credits
      modelInfo: 'recraft-ai/recraft-v3-svg',
      isSubscribed: result.data?.isSubscribed || false
    });
    
    return successResponse(successData);

  } catch (error) {
    // Error handling is now simplified since refunds are handled by executeWithCredits
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
