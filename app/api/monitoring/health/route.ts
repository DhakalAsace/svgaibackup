import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { 
  getHealthSummary, 
  checkAllServices, 
  checkDatabaseHealth,
  checkExternalAPIs,
  calculateUptime,
  runSyntheticChecks
} from '@/lib/monitoring/health-checks'
import { 
  generatePerformanceReport,
  trackAPIResponse 
} from '@/lib/monitoring/performance'
import { getAlertStats } from '@/lib/monitoring/alerts'
import { getErrorStats } from '@/lib/monitoring/error-tracking'
import { createErrorResponse } from '@/lib/error-handler'

// Cache health status for 30 seconds to avoid overloading
let healthCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check authorization for production
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const apiKey = process.env.MONITORING_API_KEY
    
    if (process.env.NODE_ENV === 'production' && apiKey) {
      if (authHeader !== `Bearer ${apiKey}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Check cache
    if (healthCache && Date.now() - healthCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(healthCache.data)
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const includePerformance = searchParams.get('performance') === 'true'
    const includeAlerts = searchParams.get('alerts') === 'true'
    const includeErrors = searchParams.get('errors') === 'true'
    const includeSynthetic = searchParams.get('synthetic') === 'true'
    const hours = parseInt(searchParams.get('hours') || '24')

    // Run health checks
    const healthSummary = await getHealthSummary()

    // Calculate uptime for critical services
    const uptimePromises = [
      'png-to-svg',
      'svg-to-png',
      'ai-generation',
      'database'
    ].map(async service => ({
      service,
      uptime: await calculateUptime(service, hours * 60 * 60 * 1000)
    }))
    
    const uptimeStats = await Promise.all(uptimePromises)

    // Build response
    const response: any = {
      status: healthSummary.overall,
      timestamp: healthSummary.timestamp,
      services: healthSummary.services.map(service => ({
        name: service.service,
        status: service.status,
        metrics: service.metrics,
        checks: service.checks.map(check => ({
          endpoint: check.endpoint,
          status: check.status,
          responseTime: check.responseTime,
          error: check.error
        }))
      })),
      uptime: Object.fromEntries(
        uptimeStats.map(({ service, uptime }) => [service, uptime])
      )
    }

    // Add performance data if requested
    if (includePerformance) {
      const performanceReports = await Promise.all([
        generatePerformanceReport('png-to-svg', hours),
        generatePerformanceReport('svg-to-png', hours),
        generatePerformanceReport('ai-generation', hours),
        generatePerformanceReport('database', hours)
      ])

      response.performance = performanceReports
    }

    // Add alert statistics if requested
    if (includeAlerts) {
      response.alerts = await getAlertStats(hours)
    }

    // Add error statistics if requested
    if (includeErrors) {
      const errorReports = await Promise.all([
        getErrorStats('converter-png-to-svg', hours),
        getErrorStats('converter-svg-to-png', hours),
        getErrorStats('ai-generation', hours)
      ])

      response.errors = errorReports
    }

    // Run synthetic checks if requested
    if (includeSynthetic) {
      response.synthetic = await runSyntheticChecks()
    }

    // Update cache
    healthCache = {
      data: response,
      timestamp: Date.now()
    }

    // Track API performance
    await trackAPIResponse(
      '/api/monitoring/health',
      'GET',
      200,
      Date.now() - startTime
    )

    return NextResponse.json(response)

  } catch (error) {
    await trackAPIResponse(
      '/api/monitoring/health',
      'GET',
      500,
      Date.now() - startTime,
      error instanceof Error ? error.message : 'Unknown error'
    )

    const errorResponse = createErrorResponse(
      error,
      'Failed to get health status',
      500
    )
    
    return NextResponse.json(errorResponse.response, { status: errorResponse.status })
  }
}

// Endpoint for specific service health
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { service, endpoint } = body

    if (!service) {
      return NextResponse.json(
        { error: 'Service name required' },
        { status: 400 }
      )
    }

    let result

    switch (service) {
      case 'database':
        result = await checkDatabaseHealth()
        break
      
      case 'external-apis':
        result = await checkExternalAPIs()
        break
      
      case 'synthetic':
        result = await runSyntheticChecks()
        break
      
      default:
        // Check specific service
        const services = await checkAllServices()
        const serviceHealth = services.find(s => s.service === service)
        
        if (!serviceHealth) {
          return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
          )
        }
        
        result = serviceHealth
    }

    await trackAPIResponse(
      '/api/monitoring/health',
      'POST',
      200,
      Date.now() - startTime
    )

    return NextResponse.json({
      service,
      result,
      timestamp: new Date()
    })

  } catch (error) {
    await trackAPIResponse(
      '/api/monitoring/health',
      'POST',
      500,
      Date.now() - startTime,
      error instanceof Error ? error.message : 'Unknown error'
    )

    const errorResponse = createErrorResponse(
      error,
      'Failed to check service health',
      500
    )
    
    return NextResponse.json(errorResponse.response, { status: errorResponse.status })
  }
}