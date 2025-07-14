'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Activity, Zap, Eye, Clock } from 'lucide-react'
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  INP: { good: 200, poor: 500, unit: 'ms' },
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
}

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

interface PerformanceData {
  timestamp: Date
  metrics: {
    [key: string]: WebVitalMetric
  }
  pageUrl: string
}

export function PerformanceDashboard() {
  const [currentMetrics, setCurrentMetrics] = useState<Record<string, WebVitalMetric>>({})
  const [historicalData, setHistoricalData] = useState<PerformanceData[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)

  // Calculate metric rating
  const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
    if (!threshold) return 'good'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  // Format metric value
  const formatMetricValue = (name: string, value: number): string => {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
    if (!threshold) return value.toString()
    
    if (name === 'CLS') return value.toFixed(3)
    return `${Math.round(value)}${threshold.unit}`
  }

  // Handle metric update
  const handleMetricUpdate = useCallback((metric: any) => {
    const webVitalMetric: WebVitalMetric = {
      name: metric.name,
      value: metric.value,
      rating: getMetricRating(metric.name, metric.value),
      delta: metric.delta,
      navigationType: metric.navigationType || 'navigate',
    }

    setCurrentMetrics(prev => ({
      ...prev,
      [metric.name]: webVitalMetric,
    }))

    // Add to historical data
    setHistoricalData(prev => {
      const newData: PerformanceData = {
        timestamp: new Date(),
        metrics: {
          ...prev[prev.length - 1]?.metrics || {},
          [metric.name]: webVitalMetric,
        },
        pageUrl: window.location.pathname,
      }
      
      // Keep only last 50 data points
      return [...prev.slice(-49), newData]
    })

    // Check for alerts
    if (webVitalMetric.rating === 'poor') {
      const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS]
      const alertMessage = `${metric.name} exceeded threshold: ${formatMetricValue(metric.name, metric.value)} > ${threshold?.poor}${threshold?.unit || ''}`
      setAlerts(prev => [...prev.slice(-4), alertMessage])
    }
  }, [])

  // Set up Web Vitals monitoring
  useEffect(() => {
    if (!isMonitoring) return

    const unsubscribers = [
      onCLS(handleMetricUpdate),
      onINP(handleMetricUpdate),
      onLCP(handleMetricUpdate),
      onFCP(handleMetricUpdate),
      onTTFB(handleMetricUpdate),
    ]

    // Cleanup function not needed as web-vitals handles it internally
    return () => {
      setIsMonitoring(false)
    }
  }, [isMonitoring, handleMetricUpdate])

  // Get metric icon
  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'LCP': return <Eye className="h-4 w-4" />
      case 'INP': return <Zap className="h-4 w-4" />
      case 'CLS': return <Activity className="h-4 w-4" />
      case 'FCP': return <Eye className="h-4 w-4" />
      case 'TTFB': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  // Get metric description
  const getMetricDescription = (name: string) => {
    switch (name) {
      case 'LCP': return 'Largest Contentful Paint - Loading performance'
      case 'INP': return 'Interaction to Next Paint - Responsiveness'
      case 'CLS': return 'Cumulative Layout Shift - Visual stability'
      case 'FCP': return 'First Contentful Paint - First render'
      case 'TTFB': return 'Time to First Byte - Server response'
      default: return ''
    }
  }

  // Get rating color
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Calculate average score
  const getAverageScore = () => {
    const metrics = Object.values(currentMetrics)
    if (metrics.length === 0) return 100

    const scores = metrics.map(m => {
      if (m.rating === 'good') return 100
      if (m.rating === 'needs-improvement') return 50
      return 0
    })

    return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
  }

  // Get performance trend
  const getPerformanceTrend = () => {
    if (historicalData.length < 2) return null

    const recentScores = historicalData.slice(-10).map(data => {
      const metrics = Object.values(data.metrics)
      const goodCount = metrics.filter(m => m.rating === 'good').length
      return (goodCount / metrics.length) * 100
    })

    const trend = recentScores[recentScores.length - 1] - recentScores[0]
    return trend
  }

  const averageScore = getAverageScore()
  const trend = getPerformanceTrend()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitoring Dashboard</h2>
          <p className="text-muted-foreground">Real-time Core Web Vitals monitoring</p>
        </div>
        <Badge variant={isMonitoring ? "default" : "secondary"}>
          {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
        </Badge>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance Score</CardTitle>
          <CardDescription>Based on current Core Web Vitals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{averageScore}%</div>
              {trend !== null && (
                <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="ml-1 text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <Progress value={averageScore as 0 | 50 | 100} className="w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Metrics</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(THRESHOLDS).map(([metricName]) => {
              const metric = currentMetrics[metricName]
              const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS]
              
              return (
                <Card key={metricName}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {getMetricIcon(metricName)}
                        {metricName}
                      </CardTitle>
                      {metric && (
                        <Badge className={getRatingColor(metric.rating)} variant="secondary">
                          {metric.rating}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {getMetricDescription(metricName)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metric ? formatMetricValue(metricName, metric.value) : '-'}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Good: ≤ {threshold.good}{threshold.unit} | 
                      Poor: {'>'} {threshold.poor}{threshold.unit}
                    </div>
                    {metric && metric.delta !== 0 && (
                      <div className={`mt-1 text-xs ${metric.delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {metric.delta > 0 ? '+' : ''}{formatMetricValue(metricName, metric.delta)} from previous
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <CardDescription>Last {historicalData.length} measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {historicalData.slice(-10).reverse().map((data, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="text-sm">
                      <div className="font-medium">{data.pageUrl}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(data.metrics).map(([name, metric]) => (
                        <Badge
                          key={name}
                          variant="outline"
                          className={getRatingColor(metric.rating)}
                        >
                          {name}: {formatMetricValue(name, metric.value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Recent performance issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  No performance issues detected
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{alert}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {Object.values(currentMetrics).some(m => m.rating !== 'good') && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Recommendations</CardTitle>
            <CardDescription>Based on current metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentMetrics.LCP?.rating !== 'good' && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <div>
                    <strong>Optimize Largest Contentful Paint:</strong>
                    <ul className="mt-1 ml-4 text-sm text-muted-foreground">
                      <li>- Preload critical images and fonts</li>
                      <li>- Optimize server response times</li>
                      <li>- Use CDN for static assets</li>
                    </ul>
                  </div>
                </li>
              )}
              {currentMetrics.INP?.rating !== 'good' && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <div>
                    <strong>Improve Interaction Responsiveness:</strong>
                    <ul className="mt-1 ml-4 text-sm text-muted-foreground">
                      <li>- Optimize JavaScript execution</li>
                      <li>- Use web workers for heavy tasks</li>
                      <li>- Reduce main thread blocking</li>
                    </ul>
                  </div>
                </li>
              )}
              {currentMetrics.CLS?.rating !== 'good' && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <div>
                    <strong>Fix Layout Shifts:</strong>
                    <ul className="mt-1 ml-4 text-sm text-muted-foreground">
                      <li>- Set explicit dimensions for images</li>
                      <li>- Avoid inserting content above existing content</li>
                      <li>- Use CSS transform for animations</li>
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}