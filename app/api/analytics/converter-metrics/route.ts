import { NextRequest, NextResponse } from 'next/server'
import { converterConfigs } from '@/app/convert/converter-config'
import { calculateConversionRates } from '@/lib/conversion-tracking'
import { getISRConfigBySearchVolume } from '@/lib/isr-config'

/**
 * GET /api/analytics/converter-metrics
 * Returns conversion metrics for converters
 * 
 * Query params:
 * - converter: specific converter slug
 * - priority: filter by priority (high, medium, low)
 * - period: time period (24h, 7d, 30d)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const converterSlug = searchParams.get('converter')
  const priority = searchParams.get('priority') as 'high' | 'medium' | 'low' | null
  const period = searchParams.get('period') || '7d'
  
  try {
    // In production, fetch from your analytics database
    // This is mock data for demonstration
    const mockMetrics = generateMockMetrics()
    
    if (converterSlug) {
      const converter = converterConfigs.find(c => c.urlSlug === converterSlug)
      if (!converter) {
        return NextResponse.json({ error: 'Converter not found' }, { status: 404 })
      }
      
      const metrics = mockMetrics[converterSlug] || generateConverterMetrics(converter)
      
      return NextResponse.json({
        converter: {
          slug: converter.urlSlug,
          title: converter.title,
          searchVolume: converter.searchVolume,
          priority: getISRConfigBySearchVolume(converter.searchVolume).priority,
        },
        period,
        metrics,
        funnel: calculateConversionRates(metrics),
      })
    }
    
    // Return aggregated metrics
    const allMetrics = converterConfigs.map(converter => {
      const isrConfig = getISRConfigBySearchVolume(converter.searchVolume)
      const metrics = mockMetrics[converter.urlSlug] || generateConverterMetrics(converter)
      const funnel = calculateConversionRates(metrics)
      
      return {
        converter: converter.urlSlug,
        title: converter.title,
        searchVolume: converter.searchVolume,
        priority: isrConfig.priority,
        conversionRate: funnel.conversionRate,
        totalConversions: metrics.conversionsCompleted,
      }
    })
    
    // Filter by priority if specified
    const filtered = priority 
      ? allMetrics.filter(m => m.priority === priority)
      : allMetrics
    
    // Sort by search volume
    const sorted = filtered.sort((a, b) => b.searchVolume - a.searchVolume)
    
    // Calculate summary statistics
    const summary = {
      totalConverters: sorted.length,
      avgConversionRate: sorted.reduce((sum, m) => sum + m.conversionRate, 0) / sorted.length,
      totalConversions: sorted.reduce((sum, m) => sum + m.totalConversions, 0),
      byPriority: {
        high: allMetrics.filter(m => m.priority === 'high').length,
        medium: allMetrics.filter(m => m.priority === 'medium').length,
        low: allMetrics.filter(m => m.priority === 'low').length,
      }
    }
    
    return NextResponse.json({
      period,
      summary,
      converters: sorted.slice(0, 20), // Top 20 converters
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

/**
 * Generate mock metrics for demonstration
 * In production, fetch from your analytics database
 */
function generateMockMetrics() {
  const metrics: Record<string, any> = {}
  
  // High-traffic converters get better metrics
  const highTrafficConverters = ['png-to-svg', 'svg-to-png', 'svg-converter', 'jpg-to-svg']
  
  highTrafficConverters.forEach(slug => {
    metrics[slug] = {
      pageViews: Math.floor(Math.random() * 5000) + 10000,
      fileSelections: Math.floor(Math.random() * 4000) + 8000,
      conversionsStarted: Math.floor(Math.random() * 3500) + 7000,
      conversionsCompleted: Math.floor(Math.random() * 3000) + 6500,
      downloads: Math.floor(Math.random() * 2800) + 6000,
    }
  })
  
  return metrics
}

/**
 * Generate converter-specific metrics based on search volume
 */
function generateConverterMetrics(converter: any) {
  // Generate realistic metrics based on search volume
  const baseViews = converter.searchVolume * 0.3 // Assume 30% of searches lead to page views
  
  return {
    pageViews: Math.floor(baseViews + Math.random() * baseViews * 0.2),
    fileSelections: Math.floor(baseViews * 0.8 + Math.random() * baseViews * 0.1),
    conversionsStarted: Math.floor(baseViews * 0.7 + Math.random() * baseViews * 0.1),
    conversionsCompleted: Math.floor(baseViews * 0.65 + Math.random() * baseViews * 0.1),
    downloads: Math.floor(baseViews * 0.6 + Math.random() * baseViews * 0.1),
  }
}