import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check authorization (you might want to add admin check here)
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (you can add your own logic here)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // For now, allow any authenticated user - you should restrict this to admins
    
    // Get items from cleanup queue
    const { data: cleanupItems, error: fetchError } = await supabase
      .from('storage_cleanup_queue')
      .select('*')
      .is('processed_at', null)
      .limit(50)

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch cleanup queue: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!cleanupItems || cleanupItems.length === 0) {
      return NextResponse.json({ 
        message: 'No items to clean up',
        processed: 0,
        deleted: 0,
        errors: 0
      })
    }

    console.log(`[Storage Cleanup] Processing ${cleanupItems.length} items`)

    let deletedCount = 0
    let errorCount = 0
    const processedIds: string[] = []

    // Process each item
    for (const item of cleanupItems) {
      try {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from(item.bucket_name)
          .remove([item.storage_path])

        if (deleteError) {
          // If file doesn't exist, that's okay - still mark as processed
          if (deleteError.message?.includes('not found')) {
            console.log(`[Storage Cleanup] File already gone: ${item.storage_path}`)
            processedIds.push(item.id)
          } else {
            console.error(`[Storage Cleanup] Failed to delete ${item.storage_path}:`, deleteError)
            errorCount++
          }
        } else {
          console.log(`[Storage Cleanup] Deleted: ${item.storage_path}`)
          deletedCount++
          processedIds.push(item.id)
        }
      } catch (error) {
        console.error(`[Storage Cleanup] Error processing ${item.storage_path}:`, error)
        errorCount++
      }
    }

    // Mark successfully processed items
    if (processedIds.length > 0) {
      const { error: updateError } = await supabase
        .from('storage_cleanup_queue')
        .update({ processed_at: new Date().toISOString() })
        .in('id', processedIds)

      if (updateError) {
        console.error('[Storage Cleanup] Failed to mark items as processed:', updateError)
      }
    }

    // Clean up old processed items (older than 7 days)
    const { error: cleanupError } = await supabase
      .from('storage_cleanup_queue')
      .delete()
      .lt('processed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (cleanupError) {
      console.error('[Storage Cleanup] Failed to clean old queue items:', cleanupError)
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      processed: cleanupItems.length,
      deleted: deletedCount,
      errors: errorCount,
      markedProcessed: processedIds.length
    })

  } catch (error) {
    console.error('[Storage Cleanup] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also support GET to check queue status
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get queue stats
    const { data, error } = await supabase
      .from('storage_cleanup_queue')
      .select('processed_at')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const pending = data?.filter(item => !item.processed_at).length || 0
    const processed = data?.filter(item => item.processed_at).length || 0

    return NextResponse.json({
      totalItems: data?.length || 0,
      pending,
      processed
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}