import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (req) => {
  try {
    console.log('[Scheduled Cleanup] Starting storage cleanup')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get pending items from cleanup queue
    const { data: pendingItems, error: countError } = await supabaseClient
      .from('storage_cleanup_queue')
      .select('id')
      .is('processed_at', null)

    const pendingCount = pendingItems?.length || 0
    
    if (pendingCount === 0) {
      console.log('[Scheduled Cleanup] No items to clean up')
      return new Response(JSON.stringify({ message: 'No items to clean up' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log(`[Scheduled Cleanup] Found ${pendingCount} items to clean up`)

    // Process in batches of 50
    let totalDeleted = 0
    let totalErrors = 0
    let batchNumber = 0

    while (true) {
      batchNumber++
      
      // Get next batch
      const { data: batch, error: fetchError } = await supabaseClient
        .from('storage_cleanup_queue')
        .select('*')
        .is('processed_at', null)
        .limit(50)

      if (fetchError || !batch || batch.length === 0) {
        break
      }

      console.log(`[Scheduled Cleanup] Processing batch ${batchNumber} with ${batch.length} items`)

      const processedIds: string[] = []

      for (const item of batch) {
        try {
          const { error: deleteError } = await supabaseClient.storage
            .from(item.bucket_name)
            .remove([item.storage_path])

          if (!deleteError || deleteError.message?.includes('not found')) {
            processedIds.push(item.id)
            if (!deleteError) totalDeleted++
          } else {
            console.error(`[Scheduled Cleanup] Delete error for ${item.storage_path}:`, deleteError)
            totalErrors++
          }
        } catch (error) {
          console.error(`[Scheduled Cleanup] Error processing ${item.storage_path}:`, error)
          totalErrors++
        }
      }

      // Mark as processed
      if (processedIds.length > 0) {
        await supabaseClient
          .from('storage_cleanup_queue')
          .update({ processed_at: new Date().toISOString() })
          .in('id', processedIds)
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Clean up old processed items
    await supabaseClient
      .from('storage_cleanup_queue')
      .delete()
      .lt('processed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const summary = {
      message: 'Scheduled cleanup completed',
      totalProcessed: pendingCount,
      totalDeleted,
      totalErrors,
      timestamp: new Date().toISOString()
    }

    console.log('[Scheduled Cleanup]', summary)

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[Scheduled Cleanup] Fatal error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})