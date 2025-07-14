'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  MousePointer, 
  TrendingUp,
  Users,
  Download,
  Zap,
  DollarSign
} from 'lucide-react'

interface ToolMetrics {
  name: string
  sessions: number
  avgDuration: number
  errors: number
  conversions: number
  features: {
    name: string
    usage: number
  }[]
  funnelSteps: {
    step: string
    count: number
    dropoff: number
  }[]
}

interface DashboardData {
  tools: ToolMetrics[]
  totalSessions: number
  totalConversions: number
  errorRate: number
  avgSessionDuration: number
  premiumUsage: {
    tool: string
    credits: number
    revenue: number
  }[]
}

// Mock data - in production, this would come from your analytics API
const mockData: DashboardData = {
  tools: [
    {
      name: 'svg-editor',
      sessions: 1250,
      avgDuration: 180,
      errors: 45,
      conversions: 150,
      features: [
        { name: 'file_upload', usage: 320 },
        { name: 'download', usage: 280 },
        { name: 'copy_to_clipboard', usage: 450 },
        { name: 'reset_to_default', usage: 95 }
      ],
      funnelSteps: [
        { step: 'tool_opened', count: 1250, dropoff: 0 },
        { step: 'feature_used', count: 980, dropoff: 21.6 },
        { step: 'cta_shown', count: 420, dropoff: 57.1 },
        { step: 'cta_clicked', count: 150, dropoff: 64.3 }
      ]
    },
    {
      name: 'svg-optimizer',
      sessions: 890,
      avgDuration: 120,
      errors: 12,
      conversions: 95,
      features: [
        { name: 'optimize', usage: 780 },
        { name: 'download_optimized', usage: 650 },
        { name: 'settings_changed', usage: 230 }
      ],
      funnelSteps: [
        { step: 'tool_opened', count: 890, dropoff: 0 },
        { step: 'feature_used', count: 780, dropoff: 12.4 },
        { step: 'cta_shown', count: 280, dropoff: 64.1 },
        { step: 'cta_clicked', count: 95, dropoff: 66.1 }
      ]
    },
    {
      name: 'svg-to-video',
      sessions: 450,
      avgDuration: 240,
      errors: 8,
      conversions: 180,
      features: [
        { name: 'video_generated', usage: 180 },
        { name: 'settings_adjusted', usage: 320 },
        { name: 'preview_played', usage: 410 }
      ],
      funnelSteps: [
        { step: 'tool_opened', count: 450, dropoff: 0 },
        { step: 'feature_used', count: 410, dropoff: 8.9 },
        { step: 'export_started', count: 200, dropoff: 51.2 },
        { step: 'export_completed', count: 180, dropoff: 10.0 }
      ]
    }
  ],
  totalSessions: 2590,
  totalConversions: 425,
  errorRate: 2.5,
  avgSessionDuration: 173,
  premiumUsage: [
    { tool: 'svg-to-video', credits: 450, revenue: 225 },
    { tool: 'svg-to-gif', credits: 120, revenue: 60 }
  ]
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData>(mockData)
  const [selectedTool, setSelectedTool] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('7d')

  // In production, fetch real data from your analytics API
  useEffect(() => {
    // fetchAnalyticsData(timeRange).then(setData)
  }, [timeRange])

  const getToolData = () => {
    if (selectedTool === 'all') return data
    const tool = data.tools.find(t => t.name === selectedTool)
    if (!tool) return data
    
    return {
      ...data,
      tools: [tool],
      totalSessions: tool.sessions,
      totalConversions: tool.conversions,
      errorRate: (tool.errors / tool.sessions) * 100
    }
  }

  const currentData = getToolData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tool Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select
            className="px-3 py-1 border rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <select
            className="px-3 py-1 border rounded-md"
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
          >
            <option value="all">All Tools</option>
            <option value="svg-editor">SVG Editor</option>
            <option value="svg-optimizer">SVG Optimizer</option>
            <option value="svg-to-video">SVG to Video</option>
            <option value="svg-animation">SVG Animation</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              {((currentData.totalConversions / currentData.totalSessions) * 100).toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(currentData.avgSessionDuration / 60)}:{(currentData.avgSessionDuration % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-muted-foreground">
              minutes:seconds
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {currentData.errorRate < 3 ? 'Healthy' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tool-specific Analytics */}
      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funnel" className="space-y-4">
          {currentData.tools.map(tool => (
            <Card key={tool.name}>
              <CardHeader>
                <CardTitle className="text-lg">{tool.name} Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tool.funnelSteps.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{step.step.replace(/_/g, ' ')}</span>
                      <span>{step.count} ({100 - step.dropoff}%)</span>
                    </div>
                    <Progress value={100 - step.dropoff} className="h-2" />
                    {index > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {step.dropoff.toFixed(1)}% drop-off from previous step
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          {currentData.tools.map(tool => (
            <Card key={tool.name}>
              <CardHeader>
                <CardTitle className="text-lg">{tool.name} Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tool.features.map(feature => (
                    <div key={feature.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {feature.name.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(feature.usage / tool.sessions) * 100} 
                          className="w-32 h-2"
                        />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {feature.usage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Average Load Time</p>
                    <p className="text-2xl font-bold">1.2s</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Processing Time</p>
                    <p className="text-2xl font-bold">0.8s</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Core Web Vitals</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>LCP (Largest Contentful Paint)</span>
                      <span className="text-green-600">Good (1.8s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>INP (Interaction to Next Paint)</span>
                      <span className="text-green-600">Good (95ms)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CLS (Cumulative Layout Shift)</span>
                      <span className="text-green-600">Good (0.05)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Premium Tool Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.premiumUsage.map(tool => (
                  <div key={tool.tool} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{tool.tool}</p>
                      <p className="text-sm text-muted-foreground">{tool.credits} credits used</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${tool.revenue}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(tool.revenue / tool.credits).toFixed(2)}/credit
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${data.premiumUsage.reduce((sum, tool) => sum + tool.revenue, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}