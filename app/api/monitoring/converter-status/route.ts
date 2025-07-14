import { NextRequest, NextResponse } from 'next/server'
import { getMonitoringProfile, getConvertersByMonitoringPriority } from '@/lib/monitoring-config'
import { getRevalidationSchedule } from '@/lib/revalidation-manager'

/**
 * GET /api/monitoring/converter-status
 * Returns monitoring status for converters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const converterSlug = searchParams.get('converter')
  const priority = searchParams.get('priority') as 'high' | 'medium' | 'low' | null
  
  try {
    // Get status for specific converter
    if (converterSlug) {
      const profile = getMonitoringProfile(converterSlug)
      if (!profile) {
        return NextResponse.json(
          { error: 'Converter not found' },
          { status: 404 }
        )
      }
      
      const revalidationSchedule = getRevalidationSchedule()
      const revalidationInfo = revalidationSchedule.find(
        (item: any) => item.converter === converterSlug
      )
      
      return NextResponse.json({
        converter: converterSlug,
        monitoring: profile,
        revalidation: revalidationInfo,
        healthCheck: {
          status: 'healthy', // In production, check actual metrics
          lastChecked: new Date().toISOString(),
          metrics: {
            errorRate: 0.5,    // Mock data - replace with real metrics
            responseTime: 800,
            availability: 99.9,
            conversionRate: 95
          }
        }
      })
    }
    
    // Get grouped status by priority
    const grouped = getConvertersByMonitoringPriority()
    
    if (priority && grouped[priority]) {
      return NextResponse.json({
        priority,
        converters: grouped[priority].map(profile => ({
          slug: profile.converterSlug,
          searchVolume: profile.searchVolume,
          isComplex: profile.isComplex,
          alerts: profile.alerts.channels
        })),
        count: grouped[priority].length
      })
    }
    
    // Return overview of all converters
    const overview = {
      totalConverters: Object.values(grouped).flat().length,
      byPriority: {
        high: {
          count: grouped.high.length,
          topConverters: grouped.high.slice(0, 5).map(p => ({
            slug: p.converterSlug,
            searchVolume: p.searchVolume
          }))
        },
        medium: {
          count: grouped.medium.length,
          examples: grouped.medium.slice(0, 3).map(p => p.converterSlug)
        },
        low: {
          count: grouped.low.length,
          examples: grouped.low.slice(0, 3).map(p => p.converterSlug)
        }
      },
      complexConverters: Object.values(grouped).flat()
        .filter(p => p.isComplex)
        .map(p => p.converterSlug),
      monitoringActive: true,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(overview)
    
  } catch (error) {
    console.error('Monitoring status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monitoring status' },
      { status: 500 }
    )
  }
}