import { createClient } from '@supabase/supabase-js';
import { createLogger } from './logger';

const logger = createLogger('credit-operations');

interface CreditOperation<T> {
  operation: () => Promise<T>;
  userId: string | null;
  identifier: string;
  identifierType: 'user_id' | 'ip_address';
  generationType: 'icon' | 'svg' | 'video';
  supabaseAdmin: any; // Use 'any' to avoid complex Supabase generic type issues
}

interface CreditOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  deductResult?: any;
  remainingCredits?: number;
}

/**
 * Executes an operation that requires credits, with automatic refund on failure
 * This ensures credits are never lost due to external API failures
 */
export async function executeWithCredits<T>({
  operation,
  userId,
  identifier,
  identifierType,
  generationType,
  supabaseAdmin
}: CreditOperation<T>): Promise<CreditOperationResult<T>> {
  let deductResult: any = null;
  
  try {
    // Step 1: Deduct credits before operation
    logger.info(`Attempting to deduct credits for ${generationType}`, { 
      userId, 
      identifier,
      identifierType,
      identifierLength: identifier?.length || 0
    });
    
    // Validate identifier before passing to database
    if (!userId && (!identifier || identifier.trim() === '')) {
      logger.error('Invalid identifier for anonymous user', { 
        identifier,
        identifierType 
      });
      return {
        success: false,
        error: "Please sign up for a free account to continue generating. You'll get 6 bonus credits!",
        deductResult: null
      };
    }
    
    const { data: deductData, error: deductError } = await supabaseAdmin.rpc(
      'check_credits_v3',
      {
        p_user_id: userId,
        p_identifier: identifier,
        p_identifier_type: identifierType,
        p_generation_type: generationType
      }
    );
    
    deductResult = deductData;
    
    if (deductError || !deductResult?.[0]?.success) {
      logger.warn('Credit deduction failed', { 
        error: deductError, 
        result: deductResult 
      });
      // Check if it's an anonymous user hitting the database's 1-generation limit
      if (!userId && deductResult?.[0]?.limit_type === 'anonymous_daily') {
        return {
          success: false,
          error: "Sign up to continue generating for free and get 6 bonus credits!",
          deductResult
        };
      }
      
      // Handle specific error cases
      if (deductError?.message?.includes('null value in column "identifier"')) {
        // This happens when we can't get the user's IP address
        // Instead of showing a device error, encourage signup
        return {
          success: false,
          error: "Please sign up for a free account to continue generating. You'll get 6 bonus credits!",
          deductResult
        };
      }
      
      return {
        success: false,
        error: deductError?.message || "Insufficient credits or rate limit exceeded",
        deductResult
      };
    }
    
    logger.info('Credits deducted successfully', { 
      remainingCredits: deductResult[0].remaining_credits 
    });
    
    // Step 2: Execute the operation
    try {
      const result = await operation();
      
      logger.info(`${generationType} operation completed successfully`);
      
      return {
        success: true,
        data: result,
        deductResult,
        remainingCredits: deductResult[0].remaining_credits
      };
    } catch (operationError) {
      // Step 3: Operation failed - refund credits
      logger.error(`${generationType} operation failed, initiating refund`, { 
        error: operationError instanceof Error ? operationError.message : operationError 
      });
      
      // Calculate credit cost based on generation type
      const creditCost = generationType === 'video' ? 6 : generationType === 'svg' ? 2 : 1;
      
      // Refund based on user type
      if (userId && deductResult?.[0]?.is_subscribed !== undefined) {
        const isSubscribed = deductResult[0].is_subscribed;
        
        try {
          if (isSubscribed) {
            // Refund monthly credits
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('monthly_credits_used')
              .eq('id', userId)
              .single() as { data: { monthly_credits_used: number } | null };
            
            if (profile) {
              const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ 
                  monthly_credits_used: Math.max(0, profile.monthly_credits_used - creditCost)
                })
                .eq('id', userId);
              
              if (updateError) {
                logger.error('Failed to refund monthly credits', { error: updateError });
              } else {
                logger.info('Monthly credits refunded successfully', { 
                  refundedAmount: creditCost,
                  userId 
                });
              }
            }
          } else {
            // Refund lifetime credits
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('lifetime_credits_used')
              .eq('id', userId)
              .single() as { data: { lifetime_credits_used: number } | null };
            
            if (profile) {
              const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ 
                  lifetime_credits_used: Math.max(0, profile.lifetime_credits_used - creditCost)
                })
                .eq('id', userId);
              
              if (updateError) {
                logger.error('Failed to refund lifetime credits', { error: updateError });
              } else {
                logger.info('Lifetime credits refunded successfully', { 
                  refundedAmount: creditCost,
                  userId 
                });
              }
            }
          }
        } catch (refundError) {
          logger.error('Error during credit refund', { 
            error: refundError,
            userId,
            creditCost 
          });
        }
      } else if (!userId) {
        // Refund anonymous user counter
        try {
          // Need to hash the identifier if it's an IP address
          const hashedIdentifier = identifierType === 'ip_address' 
            ? await hashIdentifierForRefund(identifier, supabaseAdmin)
            : identifier;
          
          const { data: limitData } = await supabaseAdmin
            .from('daily_generation_limits')
            .select('count')
            .eq('identifier', hashedIdentifier)
            .eq('identifier_type', identifierType)
            .eq('generation_date', new Date().toISOString().split('T')[0])
            .eq('generation_type', generationType)
            .single();
          
          if (limitData && limitData.count > 0) {
            const { error: updateError } = await supabaseAdmin
              .from('daily_generation_limits')
              .update({ count: Math.max(0, limitData.count - 1) })
              .eq('identifier', hashedIdentifier)
              .eq('identifier_type', identifierType)
              .eq('generation_date', new Date().toISOString().split('T')[0])
              .eq('generation_type', generationType);
            
            if (updateError) {
              logger.error('Failed to decrement anonymous counter', { error: updateError });
            } else {
              logger.info('Anonymous counter decremented successfully');
            }
          }
        } catch (refundError) {
          logger.error('Error decrementing anonymous counter', { 
            error: refundError,
            identifier: identifier.substring(0, 10) + '...' 
          });
        }
      }
      
      // Re-throw the original error for caller to handle
      throw operationError;
    }
  } catch (error) {
    logger.error('Credit operation failed', { 
      error: error instanceof Error ? error.message : error,
      generationType 
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Operation failed",
      deductResult
    };
  }
}

/**
 * Helper function to hash IP addresses for anonymous refunds
 * This matches the hashing done in check_credits_v3
 */
async function hashIdentifierForRefund(
  identifier: string, 
  supabaseAdmin: any
): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin.rpc('hash_identifier', {
      p_identifier: identifier
    });
    
    if (error || !data) {
      logger.error('Failed to hash identifier for refund', { error });
      return identifier; // Fallback to unhashed
    }
    
    return data as string;
  } catch (error) {
    logger.error('Error hashing identifier', { error });
    return identifier; // Fallback to unhashed
  }
}