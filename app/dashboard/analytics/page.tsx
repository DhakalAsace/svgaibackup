import { Metadata } from 'next'
import AnalyticsDashboard from '@/components/analytics-dashboard'
import FunnelVisualization from '@/components/funnel-visualization'
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Tool usage analytics and performance monitoring',
}

export default async function AnalyticsPage() {
  // Check if user is authenticated and has admin access
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // In production, you might want to check if user has admin role
  // For now, all authenticated users can view analytics
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="tools">Tool Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="funnel" className="space-y-4">
          <FunnelVisualization />
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <div className="text-muted-foreground">
            Tool-specific analytics coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}