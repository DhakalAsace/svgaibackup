import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    console.log('[Cleanup Storage] Request received')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    if (req.method === 'GET') {
      // Return queue status
      const { data, error } = await supabaseClient
        .from('storage_cleanup_queue')
        .select('processed_at')
      
      if (error) {
        throw error
      }

      const pending = data?.filter(item => !item.processed_at).length || 0
      const processed = data?.filter(item => item.processed_at).length || 0

      return new Response(
        JSON.stringify({
          totalItems: data?.length || 0,
          pending,
          processed
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // POST method - process cleanup queue
    const { data: cleanupItems, error: fetchError } = await supabaseClient
      .from('storage_cleanup_queue')
      .select('*')
      .is('processed_at', null)
      .limit(100) // Edge functions can handle more items

    if (fetchError) {
      throw fetchError
    }

    if (!cleanupItems || cleanupItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No items to clean up',
          processed: 0,
          deleted: 0,
          errors: 0
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    console.log(`[Cleanup Storage] Processing ${cleanupItems.length} items`)

    let deletedCount = 0
    let errorCount = 0
    const processedIds: string[] = []

    // Process each item
    for (const item of cleanupItems) {
      try {
        // Delete from storage
        const { error: deleteError } = await supabaseClient.storage
          .from(item.bucket_name)
          .remove([item.storage_path])

        if (deleteError) {
          // If file doesn't exist, that's okay - still mark as processed
          if (deleteError.message?.includes('not found')) {
            console.log(`[Cleanup Storage] File already gone: ${item.storage_path}`)
            processedIds.push(item.id)
          } else {
            console.error(`[Cleanup Storage] Failed to delete ${item.storage_path}:`, deleteError)
            errorCount++
          }
        } else {
          console.log(`[Cleanup Storage] Deleted: ${item.storage_path}`)
          deletedCount++
          processedIds.push(item.id)
        }
      } catch (error) {
        console.error(`[Cleanup Storage] Error processing ${item.storage_path}:`, error)
        errorCount++
      }
    }

    // Mark successfully processed items
    if (processedIds.length > 0) {
      const { error: updateError } = await supabaseClient
        .from('storage_cleanup_queue')
        .update({ processed_at: new Date().toISOString() })
        .in('id', processedIds)

      if (updateError) {
        console.error('[Cleanup Storage] Failed to mark items as processed:', updateError)
      }
    }

    // Clean up old processed items (older than 7 days)
    const { error: cleanupError } = await supabaseClient
      .from('storage_cleanup_queue')
      .delete()
      .lt('processed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (cleanupError) {
      console.error('[Cleanup Storage] Failed to clean old queue items:', cleanupError)
    }

    return new Response(
      JSON.stringify({
        message: 'Cleanup completed',
        processed: cleanupItems.length,
        deleted: deletedCount,
        errors: errorCount,
        markedProcessed: processedIds.length
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    console.error('[Cleanup Storage] Fatal error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})