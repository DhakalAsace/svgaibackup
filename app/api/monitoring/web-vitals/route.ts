import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { metrics, url, userAgent } = data

    // Validate the data
    if (!metrics || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Evaluate metrics
    const evaluation = evaluateMetrics(metrics)
    
    // Store in database for historical tracking
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('web_vitals_logs')
      .insert({
        url,
        user_agent: userAgent,
        metrics,
        evaluation,
        timestamp: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Error storing web vitals:', dbError)
    }

    // Check for critical issues
    const criticalIssues = evaluation.issues.filter(i => i.severity === 'critical')
    if (criticalIssues.length > 0) {
      // Trigger alerts for critical performance issues
      await triggerPerformanceAlert(url, criticalIssues)
    }

    return NextResponse.json({
      success: true,
      evaluation,
      recommendations: getRecommendations(evaluation),
    })
  } catch (error) {
    console.error('Error processing web vitals:', error)
    return NextResponse.json(
      { error: 'Failed to process web vitals' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    const hours = parseInt(searchParams.get('hours') || '24')

    const supabase = createClient()
    
    // Build query
    let query = supabase
      .from('web_vitals_logs')
      .select('*')
      .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false })

    if (url) {
      query = query.eq('url', url)
    }

    const { data, error } = await query.limit(1000)

    if (error) {
      throw error
    }

    // Calculate aggregated metrics
    const aggregated = aggregateMetrics(data || [])

    return NextResponse.json({
      success: true,
      data: aggregated,
      raw: data,
    })
  } catch (error) {
    console.error('Error fetching web vitals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch web vitals' },
      { status: 500 }
    )
  }
}

function evaluateMetrics(metrics: any) {
  const issues: any[] = []
  const scores: Record<string, string> = {}

  Object.entries(THRESHOLDS).forEach(([metric, thresholds]) => {
    const value = metrics[metric]
    if (value === undefined) return

    let rating = 'good'
    if (value > thresholds.good) {
      rating = 'needs-improvement'
    }
    if (value > thresholds.poor) {
      rating = 'poor'
      issues.push({
        metric,
        value,
        threshold: thresholds.poor,
        severity: 'critical',
        message: `${metric} exceeded poor threshold: ${value} > ${thresholds.poor}`,
      })
    } else if (value > thresholds.good) {
      issues.push({
        metric,
        value,
        threshold: thresholds.good,
        severity: 'warning',
        message: `${metric} needs improvement: ${value} > ${thresholds.good}`,
      })
    }

    scores[metric] = rating
  })

  return {
    scores,
    issues,
    overallScore: calculateOverallScore(scores),
  }
}

function calculateOverallScore(scores: Record<string, string>) {
  const scoreValues = {
    good: 100,
    'needs-improvement': 50,
    poor: 0,
  }

  const values = Object.values(scores).map(s => scoreValues[s as keyof typeof scoreValues] || 0)
  return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
}

function getRecommendations(evaluation: any) {
  const recommendations: string[] = []

  evaluation.issues.forEach((issue: any) => {
    switch (issue.metric) {
      case 'LCP':
        recommendations.push(
          'Optimize Largest Contentful Paint:',
          '- Preload critical images',
          '- Optimize server response times',
          '- Use CDN for static assets',
          '- Reduce JavaScript execution time'
        )
        break
      case 'INP':
        recommendations.push(
          'Improve Interaction to Next Paint:',
          '- Optimize JavaScript execution',
          '- Use web workers for heavy tasks',
          '- Implement code splitting',
          '- Reduce main thread work'
        )
        break
      case 'CLS':
        recommendations.push(
          'Fix Cumulative Layout Shift:',
          '- Set explicit dimensions for images',
          '- Reserve space for dynamic content',
          '- Avoid inserting content above existing content',
          '- Use CSS transforms for animations'
        )
        break
      case 'FCP':
        recommendations.push(
          'Optimize First Contentful Paint:',
          '- Eliminate render-blocking resources',
          '- Inline critical CSS',
          '- Optimize font loading',
          '- Reduce server response time'
        )
        break
      case 'TTFB':
        recommendations.push(
          'Improve Time to First Byte:',
          '- Optimize server processing',
          '- Use CDN for global distribution',
          '- Enable compression',
          '- Optimize database queries'
        )
        break
    }
  })

  return [...new Set(recommendations)]
}

async function triggerPerformanceAlert(url: string, issues: any[]) {
  // In production, this would send alerts via email, Slack, etc.
  console.error(`PERFORMANCE ALERT for ${url}:`, issues)
  
  // Store alert in database
  const supabase = createClient()
  await supabase.from('performance_alerts').insert({
    url,
    issues,
    severity: 'critical',
    timestamp: new Date().toISOString(),
  })
}

function aggregateMetrics(data: any[]) {
  if (data.length === 0) return {}

  const grouped = data.reduce((acc, item) => {
    const url = item.url
    if (!acc[url]) {
      acc[url] = {
        url,
        count: 0,
        metrics: {},
        lastMeasured: item.timestamp,
      }
    }

    acc[url].count++
    
    // Aggregate metrics
    Object.entries(item.metrics).forEach(([metric, value]) => {
      if (!acc[url].metrics[metric]) {
        acc[url].metrics[metric] = {
          values: [],
          avg: 0,
          min: Infinity,
          max: -Infinity,
          p75: 0,
          p95: 0,
        }
      }
      
      acc[url].metrics[metric].values.push(value as number)
    })

    return acc
  }, {} as Record<string, any>)

  // Calculate statistics
  Object.values(grouped).forEach((page: any) => {
    Object.entries(page.metrics).forEach(([metric, data]: [string, any]) => {
      const values = data.values.sort((a: number, b: number) => a - b)
      data.avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
      data.min = values[0]
      data.max = values[values.length - 1]
      data.p75 = values[Math.floor(values.length * 0.75)]
      data.p95 = values[Math.floor(values.length * 0.95)]
      delete data.values // Remove raw values to reduce response size
    })
  })

  return grouped
}