'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Subscriber {
  id: string;
  email: string;
  subscription_tier: string;
  monthly_credits: number;
  monthly_credits_used: number;
  credits_reset_at: string | null;
  billing_day: number | null;
  created_at: string;
}

interface Subscription {
  user_id: string;
  stripe_price_id: string;
  current_period_start: string;
  current_period_end: string;
}

export function CreditResetMonitor() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cronStatus, setCronStatus] = useState<any>(null);
  
  const supabase = createBrowserClient();

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch data from admin API endpoint (bypasses RLS)
      const response = await fetch('/api/admin/credit-resets');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setSubscribers(data.subscribers || []);
      setSubscriptions(data.subscriptions || []);
      setCronStatus(data.cronStatus || null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getSubscriptionType = (userId: string) => {
    const sub = subscriptions.find(s => s.user_id === userId);
    if (!sub) return 'Unknown';
    
    // Check if monthly or annual based on price ID
    const priceId = sub.stripe_price_id;
    if (priceId?.includes('monthly')) return 'Monthly';
    if (priceId?.includes('annual')) return 'Annual';
    
    // Fallback: check period duration
    const start = new Date(sub.current_period_start);
    const end = new Date(sub.current_period_end);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 40 ? 'Annual' : 'Monthly';
  };

  const getResetStatus = (subscriber: Subscriber) => {
    const now = new Date();
    const today = now.getDate();
    const resetDate = subscriber.credits_reset_at ? new Date(subscriber.credits_reset_at) : null;
    const daysSinceReset = resetDate ? Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    // Check if should reset today
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const shouldResetToday = subscriber.billing_day === today || 
      (subscriber.billing_day && subscriber.billing_day > lastDayOfMonth && today === lastDayOfMonth);
    
    if (daysSinceReset === 0) {
      return { status: 'reset-today', label: 'Reset Today', color: 'bg-green-100 text-green-800' };
    } else if (shouldResetToday && daysSinceReset > 25) {
      return { status: 'needs-reset', label: 'Needs Reset', color: 'bg-red-100 text-red-800' };
    } else if (daysSinceReset < 7) {
      return { status: 'recent', label: `${daysSinceReset}d ago`, color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'normal', label: `${daysSinceReset}d ago`, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading credit reset data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const needsResetCount = subscribers.filter(s => getResetStatus(s).status === 'needs-reset').length;
  const resetTodayCount = subscribers.filter(s => getResetStatus(s).status === 'reset-today').length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Reset Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold">{resetTodayCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Needs Reset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold">{needsResetCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cron Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {cronStatus?.active ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium">Inactive</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Credit Reset Monitor</CardTitle>
              <CardDescription>
                Track credit resets for all active subscribers
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Credits Used</TableHead>
                  <TableHead>Billing Day</TableHead>
                  <TableHead>Last Reset</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => {
                  const resetStatus = getResetStatus(subscriber);
                  const subType = getSubscriptionType(subscriber.id);
                  
                  return (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {subscriber.subscription_tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subType === 'Annual' ? 'default' : 'outline'}>
                          {subType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscriber.monthly_credits_used} / {subscriber.monthly_credits}
                      </TableCell>
                      <TableCell>{subscriber.billing_day || 'Not set'}</TableCell>
                      <TableCell>
                        {subscriber.credits_reset_at ? (
                          <span className="text-sm text-gray-600">
                            {formatDistanceToNow(new Date(subscriber.credits_reset_at), { addSuffix: true })}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={resetStatus.color}>
                          {resetStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {subscribers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active subscribers found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cron Job Details */}
      {cronStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cron Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Job Name:</span> {cronStatus.jobname}
              </div>
              <div>
                <span className="font-medium">Schedule:</span> {cronStatus.schedule} (Daily at 3 AM)
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <Badge variant={cronStatus.active ? 'default' : 'destructive'}>
                  {cronStatus.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {cronStatus.nodename && (
                <div>
                  <span className="font-medium">Node:</span> {cronStatus.nodename}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}