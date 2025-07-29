'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlayCircle, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CronJob {
  job_name: string;
  schedule: string;
  is_active: boolean;
  last_execution: string | null;
  last_success: boolean | null;
  last_affected_rows: number | null;
  last_error: string | null;
  executions_24h: number;
  success_rate_24h: number;
  avg_duration_ms: number | null;
  health_status: string;
}

interface CronLog {
  id: string;
  job_name: string;
  execution_time: string;
  success: boolean;
  affected_rows: number | null;
  error_message: string | null;
  execution_duration_ms: number | null;
}

export function CronMonitor() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [recentLogs, setRecentLogs] = useState<CronLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/cron-monitor');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCronJobs(data.cronJobs || []);
      setRecentLogs(data.recentLogs || []);
    } catch (err) {
      console.error('Error fetching cron data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cron data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const testCronJob = async (jobName: string) => {
    setTesting(jobName);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/cron-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', jobName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Test failed');
      }
      
      // Refresh data after test
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setTesting(null);
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'DEGRADED':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'FAILING':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'INACTIVE':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      case 'STALE':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getHealthBadge = (status: string) => {
    const variants: Record<string, any> = {
      HEALTHY: 'default',
      DEGRADED: 'warning',
      FAILING: 'destructive',
      INACTIVE: 'secondary',
      STALE: 'secondary',
      NEVER_RUN: 'outline',
    };
    
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getScheduleDescription = (schedule: string) => {
    if (schedule === '0 3 * * *') return 'Daily at 3:00 AM';
    if (schedule === '0 2 * * *') return 'Daily at 2:00 AM';
    return schedule;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading cron job data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cron Job Monitor</CardTitle>
              <CardDescription>
                Monitor and test scheduled background jobs
              </CardDescription>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              {error}
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="logs">Recent Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Success Rate (24h)</TableHead>
                      <TableHead>Avg Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cronJobs.map((job) => (
                      <TableRow key={job.job_name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getHealthIcon(job.health_status)}
                            <div>
                              <div>{job.job_name}</div>
                              {job.last_error && (
                                <div className="text-xs text-red-600 mt-1">
                                  Error: {job.last_error}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{getScheduleDescription(job.schedule)}</div>
                            <div className="text-xs text-gray-500">{job.schedule}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getHealthBadge(job.health_status)}</TableCell>
                        <TableCell>
                          {job.last_execution ? (
                            <div className="text-sm">
                              <div>{formatDistanceToNow(new Date(job.last_execution), { addSuffix: true })}</div>
                              {job.last_affected_rows !== null && (
                                <div className="text-xs text-gray-500">
                                  {job.last_affected_rows} rows affected
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{job.success_rate_24h}%</div>
                            <div className="text-xs text-gray-500">
                              {job.executions_24h} runs
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {job.avg_duration_ms ? (
                            <span className="text-sm">{job.avg_duration_ms}ms</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => testCronJob(job.job_name)}
                            disabled={testing === job.job_name || !job.is_active}
                            size="sm"
                            variant="outline"
                          >
                            <PlayCircle className="w-4 h-4 mr-1" />
                            {testing === job.job_name ? 'Running...' : 'Test'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Cron Job Descriptions</h4>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    <span className="font-medium">reset-annual-subscriber-credits:</span> Resets monthly credits for annual subscribers on their billing anniversary
                  </li>
                  <li>
                    <span className="font-medium">cleanup-expired-videos:</span> Removes expired video files and queues storage cleanup
                  </li>
                  <li>
                    <span className="font-medium">cleanup-old-svg-designs:</span> Removes old SVG designs based on user tier retention policy
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Affected Rows</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {formatDistanceToNow(new Date(log.execution_time), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {log.job_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.success ? 'default' : 'destructive'}>
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.affected_rows ?? '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.execution_duration_ms ? `${log.execution_duration_ms}ms` : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-red-600">
                          {log.error_message || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {recentLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No execution logs yet. Cron jobs will start logging after their next run.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}