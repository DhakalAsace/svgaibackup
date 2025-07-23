'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer,
  Target,
  ChevronRight,
  Activity
} from 'lucide-react'

// Mock types for funnel tracking since lib/funnel-tracking doesn't exist
interface FunnelMetrics {
  totalSessions: number
  uniqueUsers: number
  conversions: number
  conversionRate: number
  avgTimeToConversion: number
  dropoffByStep: Record<string, number>
  topPaths: string[][]
  ctaPerformance: Record<string, {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
  }>
}

interface FunnelVisualizationProps {
  tool?: string
  timeRange?: '24h' | '7d' | '30d'
}

const FUNNEL_STAGES = [
  { id: 'discovery', name: 'Tool Discovery', icon: Users },
  { id: 'engagement', name: 'Feature Usage', icon: MousePointer },
  { id: 'intent', name: 'Upgrade Intent', icon: Target },
  { id: 'conversion', name: 'Premium Conversion', icon: TrendingUp }
]

export default function FunnelVisualization({ 
  tool = 'all',
  timeRange = '7d' 
}: FunnelVisualizationProps) {
  const [metrics, setMetrics] = useState<FunnelMetrics | null>(null)
  const [paths, setPaths] = useState<any[]>([])
  const [selectedPath, setSelectedPath] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [tool, timeRange])

  const loadData = async () => {
    setLoading(true)
    try {
      // In production, this would fetch real data
      // For now, using mock data
      const mockMetrics: FunnelMetrics = {
        totalSessions: 5420,
        uniqueUsers: 3850,
        conversions: 425,
        conversionRate: 0.0784,
        avgTimeToConversion: 540000, // 9 minutes
        dropoffByStep: {
          'discovery_to_engagement': 0.22,
          'engagement_to_intent': 0.58,
          'intent_to_conversion': 0.35
        },
        topPaths: [
          ['tool_visited', 'feature_used', 'cta_shown', 'cta_clicked', 'conversion'],
          ['tool_visited', 'error_occurred', 'cta_shown', 'cta_clicked', 'conversion'],
          ['tool_visited', 'feature_used', 'feature_used', 'cta_shown', 'conversion']
        ],
        ctaPerformance: {
          'floating-cta': {
            impressions: 1250,
            clicks: 150,
            ctr: 0.12,
            conversions: 55
          },
          'inline-upgrade': {
            impressions: 2100,
            clicks: 189,
            ctr: 0.09,
            conversions: 72
          },
          'error-suggestion': {
            impressions: 450,
            clicks: 135,
            ctr: 0.30,
            conversions: 48
          },
          'feature-limitation': {
            impressions: 680,
            clicks: 170,
            ctr: 0.25,
            conversions: 62
          }
        }
      }
      setMetrics(mockMetrics)

      // Mock path analysis
      const mockPaths = [
        {
          path: ['svg-editor', 'file_upload', 'error', 'ai_suggestion', 'conversion'],
          count: 125,
          conversionRate: 0.38,
          avgDuration: 420000
        },
        {
          path: ['svg-optimizer', 'optimize', 'view_results', 'upgrade_prompt', 'conversion'],
          count: 98,
          conversionRate: 0.31,
          avgDuration: 360000
        },
        {
          path: ['svg-to-video', 'preview', 'credit_limit', 'purchase'],
          count: 85,
          conversionRate: 0.65,
          avgDuration: 180000
        }
      ]
      setPaths(mockPaths)
    } catch (error) {
      console.error('Error loading funnel data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
    return <div className="animate-pulse">Loading funnel data...</div>
  }

  const funnelData = [
    { stage: 'Discovery', count: metrics.totalSessions, percentage: 100 },
    { stage: 'Engagement', count: Math.floor(metrics.totalSessions * 0.78), percentage: 78 },
    { stage: 'Intent', count: Math.floor(metrics.totalSessions * 0.33), percentage: 33 },
    { stage: 'Conversion', count: metrics.conversions, percentage: metrics.conversionRate * 100 }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.uniqueUsers.toLocaleString()} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.conversionRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Convert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(metrics.avgTimeToConversion / 60000)}m
            </div>
            <p className="text-xs text-muted-foreground">
              from first visit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Performing CTA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30%</div>
            <p className="text-xs text-muted-foreground">
              Error suggestion CTR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === funnelData.length - 1 ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{stage.count.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({stage.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="ml-10">
                  <Progress value={stage.percentage} className="h-3" />
                </div>
                {index < funnelData.length - 1 && (
                  <div className="ml-4 mt-2 mb-4 flex items-center text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 mr-1" />
                    {((funnelData[index].percentage - funnelData[index + 1].percentage) / funnelData[index].percentage * 100).toFixed(1)}% drop-off
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Performance */}
      <Card>
        <CardHeader>
          <CardTitle>CTA Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.ctaPerformance).map(([ctaId, data]) => (
              <div key={ctaId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium capitalize">
                      {ctaId.replace(/-/g, ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {data.impressions.toLocaleString()} impressions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(data.ctr * 100).toFixed(1)}% CTR
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="font-medium">{data.clicks}</p>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="font-medium">
                      {((data.conversions / data.clicks) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Click to Convert</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="font-medium">
                      ${(data.conversions * 5).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Est. Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Journey Paths */}
      <Card>
        <CardHeader>
          <CardTitle>Top Conversion Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paths.map((path, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPath === index ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPath(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    {path.path.map((step: string, stepIndex: number) => (
                      <React.Fragment key={stepIndex}>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {step}
                        </span>
                        {stepIndex < path.path.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Users</p>
                    <p className="font-medium">{path.count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="font-medium">{(path.conversionRate * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Duration</p>
                    <p className="font-medium">
                      {Math.floor(path.avgDuration / 60000)}m
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Funnel Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="font-medium">Error-triggered CTAs perform best</p>
                <p className="text-sm text-muted-foreground">
                  30% CTR when users encounter errors. Consider showing helpful AI suggestions at friction points.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <div>
                <p className="font-medium">High drop-off between engagement and intent</p>
                <p className="text-sm text-muted-foreground">
                  58% of engaged users don't show upgrade intent. Test more contextual value propositions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="font-medium">Quick converters have higher success rate</p>
                <p className="text-sm text-muted-foreground">
                  Users converting within 3 minutes have 65% completion rate vs 31% for longer journeys.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}