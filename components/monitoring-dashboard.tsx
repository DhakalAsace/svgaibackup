'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Server,
  Zap,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  metrics: {
    avgResponseTime: number
    errorRate: number
    availability: number
  }
  checks: Array<{
    endpoint: string
    status: string
    responseTime: number
    error?: string
  }>
}

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: ServiceHealth[]
  uptime: Record<string, number>
  performance?: any[]
  alerts?: any
  errors?: any[]
  synthetic?: any[]
}

export default function MonitoringDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/monitoring/health?performance=true&alerts=true&errors=true')
      if (!response.ok) throw new Error('Failed to fetch health data')
      
      const data = await response.json()
      setHealthData(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitoring data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()

    // Auto-refresh every 30 seconds
    const interval = autoRefresh ? setInterval(fetchHealthData, 30000) : null

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800'
      case 'unhealthy':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading monitoring data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!healthData) return null

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Badge className={getStatusColor(healthData.status)}>
            {healthData.status.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={fetchHealthData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            {getStatusIcon(healthData.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{healthData.status}</div>
            <p className="text-xs text-muted-foreground">
              {healthData.services.filter(s => s.status === 'healthy').length} of {healthData.services.length} services healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                healthData.services.reduce((sum, s) => sum + s.metrics.avgResponseTime, 0) / 
                healthData.services.length
              )}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Across all services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                healthData.services.reduce((sum, s) => sum + s.metrics.errorRate, 0) / 
                healthData.services.length
              ).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average error rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(healthData.uptime).length > 0
                ? (Object.values(healthData.uptime).reduce((a, b) => a + b, 0) / Object.values(healthData.uptime).length).toFixed(2)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              24 hour average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {healthData.services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <CardTitle>{service.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold">{Math.round(service.metrics.avgResponseTime)}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Error Rate</p>
                    <p className="text-2xl font-bold">{service.metrics.errorRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <p className="text-2xl font-bold">{service.metrics.availability.toFixed(2)}%</p>
                  </div>
                </div>

                {service.checks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Endpoint Checks</h4>
                    <div className="space-y-2">
                      {service.checks.map((check, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check.status)}
                            <span>{check.endpoint}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">{check.responseTime}ms</span>
                            {check.error && (
                              <span className="text-red-500 text-xs">{check.error}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {healthData.performance?.map((report, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{report.service} Performance</CardTitle>
                <CardDescription>Last {report.period}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(report.metrics).map(([metric, stats]: [string, any]) => (
                    <div key={metric} className="space-y-2">
                      <h4 className="text-sm font-medium capitalize">
                        {metric.replace(/_/g, ' ')}
                      </h4>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">P50:</span> {stats.p50}ms
                        </div>
                        <div>
                          <span className="text-muted-foreground">P95:</span> {stats.p95}ms
                        </div>
                        <div>
                          <span className="text-muted-foreground">P99:</span> {stats.p99}ms
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg:</span> {Math.round(stats.avg)}ms
                        </div>
                      </div>
                    </div>
                  ))}

                  {report.violations.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Performance Violations</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside mt-2">
                          {report.violations.map((v: any, i: number) => (
                            <li key={i}>
                              {v.metric} {v.percentile}: {v.actual}ms (threshold: {v.threshold}ms)
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {healthData.alerts && (
            <Card>
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Alerts</p>
                      <p className="text-2xl font-bold">{healthData.alerts.total}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Failure Rate</p>
                      <p className="text-2xl font-bold">{healthData.alerts.failureRate.toFixed(2)}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">By Severity</h4>
                    <div className="space-y-2">
                      {Object.entries(healthData.alerts.bySeverity).map(([severity, count]) => (
                        <div key={severity} className="flex justify-between items-center">
                          <Badge className={
                            severity === 'critical' ? 'bg-red-100 text-red-800' :
                            severity === 'error' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {severity}
                          </Badge>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          {healthData.errors?.map((errorStats, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>Error Report</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Errors</p>
                      <p className="text-2xl font-bold">{errorStats.totalErrors}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unique Errors</p>
                      <p className="text-2xl font-bold">{errorStats.uniqueErrors}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Error Rate</p>
                      <p className="text-2xl font-bold">{errorStats.errorRate.toFixed(2)}/hr</p>
                    </div>
                  </div>

                  {errorStats.topErrors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Errors</h4>
                      <div className="space-y-2">
                        {errorStats.topErrors.map((error: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="truncate flex-1">{error.message}</span>
                            <Badge variant="secondary">{error.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}