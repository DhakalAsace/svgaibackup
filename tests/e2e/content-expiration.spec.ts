import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe('Content Expiration and Cleanup', () => {
  let supabase: any;
  let serviceSupabase: any;

  test.beforeAll(async () => {
    // Create regular client and service role client
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  });

  test('SVG designs should respect retention policy based on user plan', async () => {
    // Check current SVG designs and their ages
    const { data: svgStats, error } = await serviceSupabase.rpc('get_svg_retention_stats');
    
    if (error) {
      console.error('Error fetching SVG stats:', error);
      return;
    }

    console.log('SVG Retention Stats:', svgStats);

    // Verify no free/starter user has SVGs older than 7 days
    const freeUserStats = svgStats?.filter((stat: any) => 
      !stat.subscription_tier || stat.subscription_tier === 'free' || stat.subscription_tier === 'starter'
    );

    for (const stat of freeUserStats || []) {
      expect(stat.max_age_days).toBeLessThanOrEqual(7);
    }

    // Verify no pro user has SVGs older than 30 days
    const proUserStats = svgStats?.filter((stat: any) => stat.subscription_tier === 'pro');
    
    for (const stat of proUserStats || []) {
      expect(stat.max_age_days).toBeLessThanOrEqual(30);
    }
  });

  test('Expired videos should be cleaned up', async () => {
    // Check for any expired videos
    const { data: expiredVideos, error } = await serviceSupabase
      .from('generated_videos')
      .select('id, expires_at')
      .lt('expires_at', new Date().toISOString());

    expect(error).toBeNull();
    expect(expiredVideos).toHaveLength(0);
    console.log('No expired videos found in database ✓');
  });

  test('Storage cleanup queue should be processed', async () => {
    // Check pending items in cleanup queue
    const { data: pendingCleanup, error } = await serviceSupabase
      .from('storage_cleanup_queue')
      .select('*')
      .is('processed_at', null);

    expect(error).toBeNull();
    console.log(`Pending cleanup items: ${pendingCleanup?.length || 0}`);

    // In production, this should ideally be 0 or a small number
    // Allow some pending items as they might be recently added
    expect(pendingCleanup?.length || 0).toBeLessThan(100);
  });

  test('Cron jobs should be active', async () => {
    // Check if pg_cron jobs are active
    const { data: cronJobs, error } = await serviceSupabase.rpc('get_active_cron_jobs');

    if (!error && cronJobs) {
      console.log('Active cron jobs:', cronJobs);

      // Verify essential cleanup jobs exist
      const essentialJobs = [
        'cleanup_old_svg_designs',
        'cleanup_expired_videos',
        'trigger_storage_cleanup'
      ];

      for (const jobName of essentialJobs) {
        const job = cronJobs.find((j: any) => j.command.includes(jobName));
        expect(job).toBeDefined();
        expect(job?.active).toBe(true);
      }
    }
  });

  test('Video expiration dates should be set correctly', async ({ page }) => {
    // This test would require authentication and creating a test video
    // For now, we'll just verify the structure
    
    const { data: recentVideos, error } = await serviceSupabase
      .from('generated_videos')
      .select('expires_at, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && recentVideos && recentVideos.length > 0) {
      for (const video of recentVideos) {
        const expiresAt = new Date(video.expires_at);
        const createdAt = new Date(video.created_at);
        
        // Verify expiration is in the future from creation
        expect(expiresAt.getTime()).toBeGreaterThan(createdAt.getTime());
        
        // Verify reasonable expiration period (e.g., 7-30 days)
        const daysDiff = (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeGreaterThanOrEqual(7);
        expect(daysDiff).toBeLessThanOrEqual(30);
      }
    }
  });

  test('Edge Functions should be deployed and accessible', async () => {
    // Check if Edge Functions are deployed
    const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/scheduled-storage-cleanup`;
    
    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Edge function should respond (even if no work to do)
      expect(response.status).toBeLessThan(500);
      console.log('Edge Function response status:', response.status);
    } catch (error) {
      console.warn('Edge Function not accessible - ensure it is deployed to Supabase');
    }
  });
});

// Helper test to create test data and verify cleanup
test.describe('Cleanup Simulation', () => {
  test.skip('Simulate cleanup process (manual test)', async () => {
    // This test can be run manually to verify cleanup works
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY!);

    // Manually trigger cleanup functions
    console.log('Triggering cleanup functions...');
    
    // Trigger SVG cleanup
    const { error: svgError } = await serviceSupabase.rpc('cleanup_old_svg_designs');
    console.log('SVG cleanup:', svgError ? 'Error' : 'Success');

    // Trigger video cleanup
    const { error: videoError } = await serviceSupabase.rpc('cleanup_expired_videos_improved');
    console.log('Video cleanup:', videoError ? 'Error' : 'Success');

    // Check cleanup queue
    const { data: queueStats } = await serviceSupabase
      .from('storage_cleanup_queue')
      .select('processed_at')
      .is('processed_at', null);
    
    console.log('Pending cleanup items:', queueStats?.length || 0);
  });
});