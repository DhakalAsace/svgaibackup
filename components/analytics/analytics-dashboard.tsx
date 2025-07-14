'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  FileImage,
  Zap,
  Target,
  Activity,
  Download,
  Eye,
  MousePointer,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Mock data - in production this would come from analytics APIs
const mockData = {
  overview: {
    totalUsers: 45234,
    totalSessions: 128456,
    totalConversions: 3421,
    totalRevenue: 34521,
    userGrowth: 12.5,
    sessionGrowth: 8.3,
    conversionGrowth: 15.2,
    revenueGrowth: 23.4,
  },
  dailyMetrics: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    users: Math.floor(Math.random() * 2000) + 1000,
    sessions: Math.floor(Math.random() * 5000) + 2000,
    conversions: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 2000) + 500,
  })),
  converterUsage: [
    { name: 'PNG to SVG', sessions: 23456, conversions: 1234, rate: 5.3 },
    { name: 'SVG to PNG', sessions: 18234, conversions: 987, rate: 5.4 },
    { name: 'JPG to SVG', sessions: 15678, conversions: 823, rate: 5.2 },
    { name: 'SVG to PDF', sessions: 12345, conversions: 654, rate: 5.3 },
    { name: 'WebP to SVG', sessions: 9876, conversions: 432, rate: 4.4 },
  ],
  conversionFunnel: [
    { name: 'Page View', value: 100000, fill: '#8884d8' },
    { name: 'File Selected', value: 65000, fill: '#83a6ed' },
    { name: 'Conversion Started', value: 45000, fill: '#8dd1e1' },
    { name: 'Conversion Completed', value: 40000, fill: '#82ca9d' },
    { name: 'Download Completed', value: 38000, fill: '#a4de6c' },
  ],
  userSegments: [
    { name: 'Free Users', value: 85, fill: '#8884d8' },
    { name: 'Paid Users', value: 10, fill: '#82ca9d' },
    { name: 'Trial Users', value: 5, fill: '#ffc658' },
  ],
  topReferrers: [
    { source: 'Google Search', users: 23456, percentage: 45 },
    { source: 'Direct', users: 18234, percentage: 35 },
    { source: 'Social Media', users: 6789, percentage: 13 },
    { source: 'Email', users: 3456, percentage: 7 },
  ],
  performanceMetrics: {
    avgLoadTime: 1.2,
    avgConversionTime: 3.4,
    avgSessionDuration: 245,
    bounceRate: 42,
    errorRate: 0.8,
  },
  premiumFeatures: {
    videoExports: 1234,
    gifExports: 876,
    aiGenerations: 4567,
    creditsUsed: 12345,
    revenueGenerated: 23456,
  },
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('users')
  
  // Metric cards with trends
  const MetricCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    format = 'number' 
  }: { 
    title: string
    value: number
    growth: number
    icon: any
    format?: 'number' | 'currency' | 'percentage'
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString()}`
        case 'percentage':
          return `${val}%`
        default:
          return val.toLocaleString()
      }
    }
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          <div className="flex items-center text-xs">
            {growth > 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={growth > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(growth)}%
            </span>
            <span className="ml-1 text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor your SVG AI performance and user behavior</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={mockData.overview.totalUsers}
          growth={mockData.overview.userGrowth}
          icon={Users}
        />
        <MetricCard
          title="Total Sessions"
          value={mockData.overview.totalSessions}
          growth={mockData.overview.sessionGrowth}
          icon={Activity}
        />
        <MetricCard
          title="Conversions"
          value={mockData.overview.totalConversions}
          growth={mockData.overview.conversionGrowth}
          icon={Target}
        />
        <MetricCard
          title="Revenue"
          value={mockData.overview.totalRevenue}
          growth={mockData.overview.revenueGrowth}
          icon={DollarSign}
          format="currency"
        />
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="converters">Converters</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="premium">Premium Features</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metrics Over Time</CardTitle>
              <CardDescription>Track key metrics trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockData.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Converter Performance</CardTitle>
              <CardDescription>Usage and conversion rates by converter type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData.converterUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="conversions" fill="#82ca9d" />
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockData.converterUsage.map((converter) => (
              <Card key={converter.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{converter.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sessions</span>
                      <span className="text-sm font-medium">{converter.sessions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversions</span>
                      <span className="text-sm font-medium">{converter.conversions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rate</span>
                      <Badge variant="secondary">{converter.rate}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from page view to download</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={mockData.conversionFunnel}
                    isAnimationActive
                  >
                    <LabelList position="center" fill="#fff" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.userSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.userSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.topReferrers.map((referrer) => (
                    <div key={referrer.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{referrer.source}</span>
                        <span className="text-sm text-muted-foreground">
                          {referrer.users.toLocaleString()} users
                        </span>
                      </div>
                      <Progress value={referrer.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.performanceMetrics.avgLoadTime}s</div>
                <Progress value={100 - (mockData.performanceMetrics.avgLoadTime / 3) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Target: &lt; 3s</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.performanceMetrics.avgConversionTime}s</div>
                <Progress value={100 - (mockData.performanceMetrics.avgConversionTime / 5) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Target: &lt; 5s</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(mockData.performanceMetrics.avgSessionDuration / 60)}m {mockData.performanceMetrics.avgSessionDuration % 60}s
                </div>
                <Progress value={(mockData.performanceMetrics.avgSessionDuration / 300) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Industry avg: 2-3 min</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.performanceMetrics.bounceRate}%</div>
                <Progress value={100 - mockData.performanceMetrics.bounceRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Target: &lt; 40%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.performanceMetrics.errorRate}%</div>
                <Progress value={100 - mockData.performanceMetrics.errorRate * 10} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Target: &lt; 1%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Video Exports</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.premiumFeatures.videoExports.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GIF Exports</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.premiumFeatures.gifExports.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.premiumFeatures.aiGenerations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.premiumFeatures.creditsUsed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total consumption</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockData.premiumFeatures.revenueGenerated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From premium features</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}