'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CleanupStatus {
  expired_videos_count: number;
  expired_svgs_free_starter: number;
  expired_svgs_pro: number;
  storage_queue_pending: number;
  storage_queue_processed: number;
}

export function CleanupStatusDashboard() {
  const [status, setStatus] = useState<CleanupStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await (supabase as any).rpc('get_cleanup_status');
      
      if (error) throw error;
      
      setStatus(data[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cleanup status');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const runManualCleanup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the cleanup functions directly via Supabase RPC
      const { error: videoCleanupError } = await (supabase as any).rpc('cleanup_expired_videos');
      
      if (videoCleanupError) {
        throw new Error(`Video cleanup failed: ${videoCleanupError.message}`);
      }
      
      // Also run SVG cleanup
      const { error: svgCleanupError } = await (supabase as any).rpc('cleanup_old_svg_designs');
      
      if (svgCleanupError) {
        throw new Error(`SVG cleanup failed: ${svgCleanupError.message}`);
      }
      
      await fetchStatus(); // Refresh status after cleanup
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run cleanup');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const totalExpired = status ? 
    status.expired_videos_count + 
    status.expired_svgs_free_starter + 
    status.expired_svgs_pro : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Cleanup Status</CardTitle>
            <CardDescription>
              Monitor expired content and cleanup queue
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={runManualCleanup}
              disabled={loading || totalExpired === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Run Cleanup
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !status ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading cleanup status...
          </div>
        ) : status && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expired Videos</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{status.expired_videos_count}</span>
                {status.expired_videos_count > 0 && (
                  <Badge variant="destructive">Needs cleanup</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expired SVGs (Free/Starter)</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{status.expired_svgs_free_starter}</span>
                {status.expired_svgs_free_starter > 0 && (
                  <Badge variant="destructive">7+ days old</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expired SVGs (Pro)</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{status.expired_svgs_pro}</span>
                {status.expired_svgs_pro > 0 && (
                  <Badge variant="destructive">30+ days old</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Storage Queue (Pending)</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{status.storage_queue_pending}</span>
                {status.storage_queue_pending > 0 && (
                  <Badge variant="warning">Awaiting deletion</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Storage Queue (Processed)</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{status.storage_queue_processed}</span>
                <Badge variant="default">Completed</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Expired Content</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{totalExpired}</span>
                {totalExpired > 0 && (
                  <Badge variant="destructive">Action needed</Badge>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Retention Policies</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Free & Starter users: SVGs retained for 7 days</li>
            <li>• Pro users: SVGs retained for 30 days</li>
            <li>• Videos: Retention based on user tier (7 or 30 days)</li>
            <li>• Cleanup runs automatically at 2 AM UTC daily</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}