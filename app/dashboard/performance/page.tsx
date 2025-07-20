import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PerformanceDashboard } from '@/components/performance-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Performance Dashboard',
  description: 'Monitor Core Web Vitals and SEO performance metrics',
}

export default async function PerformanceDashboardPage() {
  const supabase = createClient()
  
  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Real-time Core Web Vitals and SEO performance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/api/monitoring/web-vitals" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              API Endpoint
            </Link>
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Verification Script</CardTitle>
            <CardDescription>Run comprehensive SEO performance tests</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted p-2 rounded block mb-4">
              npm run perf:verify
            </code>
            <Button size="sm" variant="outline" asChild>
              <Link href="/docs/SEO_PERFORMANCE_REPORT.md" target="_blank">
                View Documentation
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PageSpeed Insights</CardTitle>
            <CardDescription>External performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link 
                  href="https://pagespeed.web.dev/analysis?url=https://svgai.org" 
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Analyze Homepage
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link 
                  href="https://pagespeed.web.dev/analysis?url=https://svgai.org/convert/png-to-svg" 
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Analyze Converter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vercel Analytics</CardTitle>
            <CardDescription>Production performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link 
                href="https://vercel.com/analytics" 
                target="_blank"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Analytics Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Dashboard Component */}
      <PerformanceDashboard />

      {/* Additional Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tools</CardTitle>
          <CardDescription>Additional resources for performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Monitoring Scripts</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <code>npm run perf:check</code> - Run Lighthouse locally</li>
                <li>• <code>npm run perf:monitor</code> - Monitor Web Vitals</li>
                <li>• <code>npm run perf:verify</code> - Full SEO verification</li>
                <li>• <code>npm run analyze</code> - Bundle size analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Pages to Monitor</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Homepage - Main landing page</li>
                <li>• PNG to SVG - Highest traffic converter</li>
                <li>• Heart SVG Gallery - Popular gallery page</li>
                <li>• What is SVG - Top learn page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}