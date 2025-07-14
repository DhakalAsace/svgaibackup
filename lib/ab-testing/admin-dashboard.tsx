/**
 * A/B Testing Admin Dashboard
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { abTestManager, ABTestConfig, VariantStats } from './index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'

// Test status colors
const statusColors = {
  draft: 'bg-gray-500',
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  completed: 'bg-blue-500',
}

// Chart colors
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

interface ABTestDashboardProps {
  isAdmin?: boolean
}

export function ABTestDashboard({ isAdmin = false }: ABTestDashboardProps) {
  const [tests, setTests] = useState<ABTestConfig[]>([])
  const [selectedTest, setSelectedTest] = useState<ABTestConfig | null>(null)
  const [testStats, setTestStats] = useState<VariantStats[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const loadTests = useCallback(() => {
    const allTests = abTestManager.getAllTests()
    setTests(allTests)
    if (!selectedTest && allTests.length > 0) {
      setSelectedTest(allTests[0])
    }
  }, [selectedTest])

  const loadTestStats = (testId: string) => {
    const stats = abTestManager.getTestStats(testId)
    setTestStats(stats)
  }

  useEffect(() => {
    loadTests()
  }, [refreshKey, loadTests])

  useEffect(() => {
    if (selectedTest) {
      loadTestStats(selectedTest.id)
      const interval = setInterval(() => {
        loadTestStats(selectedTest.id)
      }, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [selectedTest])

  const handleStatusChange = (testId: string, status: ABTestConfig['status']) => {
    abTestManager.updateTestStatus(testId, status)
    setRefreshKey(prev => prev + 1)
  }

  const handleCompleteTest = (testId: string, winnerId?: string) => {
    abTestManager.completeTest(testId, winnerId)
    setRefreshKey(prev => prev + 1)
  }

  const calculateSampleSize = (test: ABTestConfig) => {
    if (!test.minimumSampleSize) return null
    
    const totalParticipants = testStats.reduce((sum, stat) => sum + stat.participants, 0)
    const percentage = (totalParticipants / (test.minimumSampleSize * test.variants.length)) * 100
    
    return {
      current: totalParticipants,
      required: test.minimumSampleSize * test.variants.length,
      percentage: Math.min(percentage, 100),
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">A/B Testing Dashboard</h1>
        <Button
          onClick={() => setRefreshKey(prev => prev + 1)}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Test List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Experiments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tests.map(test => (
              <div
                key={test.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTest?.id === test.id ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedTest(test)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </div>
                  <Badge className={statusColors[test.status]}>
                    {test.status}
                  </Badge>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                  <span>{test.variants.length} variants</span>
                  <span>•</span>
                  <span>{test.successMetrics.length} metrics</span>
                  {test.trafficAllocation && test.trafficAllocation < 100 && (
                    <>
                      <span>•</span>
                      <span>{test.trafficAllocation}% traffic</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Test Details */}
      {selectedTest && (
        <div className="grid gap-6">
          {/* Test Controls */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                {selectedTest.status === 'draft' && (
                  <Button
                    onClick={() => handleStatusChange(selectedTest.id, 'active')}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                )}
                {selectedTest.status === 'active' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(selectedTest.id, 'paused')}
                      size="sm"
                      variant="outline"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Test
                    </Button>
                    <Button
                      onClick={() => handleCompleteTest(selectedTest.id)}
                      size="sm"
                      variant="outline"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Test
                    </Button>
                  </>
                )}
                {selectedTest.status === 'paused' && (
                  <Button
                    onClick={() => handleStatusChange(selectedTest.id, 'active')}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume Test
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sample Size Progress */}
          {selectedTest.minimumSampleSize && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Size Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const sampleSize = calculateSampleSize(selectedTest)
                  if (!sampleSize) return null
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{sampleSize.current.toLocaleString()} participants</span>
                        <span>{sampleSize.required.toLocaleString()} required</span>
                      </div>
                      <Progress value={sampleSize.percentage} />
                      <p className="text-sm text-muted-foreground">
                        {sampleSize.percentage < 100
                          ? `${(100 - sampleSize.percentage).toFixed(0)}% more data needed for statistical significance`
                          : 'Minimum sample size reached'}
                      </p>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Variant Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Variant Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="table" className="space-y-3">
                  {testStats.map(stat => {
                    const variant = selectedTest.variants.find(v => v.id === stat.variantId)
                    return (
                      <div
                        key={stat.variantId}
                        className={`p-4 border rounded-lg ${
                          stat.isWinner ? 'border-green-500 bg-green-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {stat.variantName}
                              {variant?.isControl && (
                                <Badge variant="outline" className="text-xs">Control</Badge>
                              )}
                              {stat.isWinner && (
                                <Badge className="bg-green-500 text-xs">Winner</Badge>
                              )}
                            </h4>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {(stat.conversionRate * 100).toFixed(2)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              conversion rate
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{stat.participants.toLocaleString()}</span>
                            </div>
                            <div className="text-muted-foreground">participants</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span className="font-medium">{stat.conversions.toLocaleString()}</span>
                            </div>
                            <div className="text-muted-foreground">conversions</div>
                          </div>
                          {stat.uplift !== undefined && (
                            <div>
                              <div className="flex items-center gap-1">
                                {stat.uplift > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`font-medium ${
                                  stat.uplift > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {stat.uplift > 0 ? '+' : ''}{stat.uplift.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-muted-foreground">vs control</div>
                            </div>
                          )}
                        </div>
                        
                        {stat.confidence && (
                          <div className="mt-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">
                              {stat.confidence}% confidence level
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </TabsContent>
                
                <TabsContent value="chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={testStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="variantName" />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip 
                        formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                      />
                      <Bar dataKey="conversionRate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={testStats}
                        dataKey="participants"
                        nameKey="variantName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.variantName}: ${entry.participants}`}
                      >
                        {testStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTest.successMetrics.map(metric => (
                  <div key={metric.id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {metric.type} • {metric.eventName}
                      </p>
                    </div>
                    {metric.goalValue && (
                      <Badge variant="outline">
                        Goal: {metric.goalValue}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}