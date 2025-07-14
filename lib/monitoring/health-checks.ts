/**
 * Health Check System
 * Monitors service availability and performance
 */

import { createClient } from '@/lib/supabase'
import { MONITORING_CONFIG, getServicesWithEndpoints, MonitoringEndpoint } from './config'
import { checkThreshold } from '@/lib/analytics-alerts'
import { track } from '@vercel/analytics'

export interface HealthCheckResult {
  service: string
  endpoint: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  statusCode?: number
  error?: string
  timestamp: Date
}

export interface ServiceHealth {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: HealthCheckResult[]
  metrics: {
    avgResponseTime: number
    errorRate: number
    availability: number
  }
}

/**
 * Perform health check on a single endpoint
 */
async function checkEndpoint(
  service: string,
  endpoint: MonitoringEndpoint
): Promise<HealthCheckResult> {
  const startTime = Date.now()
  const result: HealthCheckResult = {
    service,
    endpoint: endpoint.name,
    status: 'healthy',
    responseTime: 0,
    timestamp: new Date()
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout)

    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      signal: controller.signal,
      headers: {
        'User-Agent': 'SVG-AI-Monitor/1.0',
        'X-Health-Check': 'true'
      },
      // For POST endpoints, send minimal test data
      body: endpoint.method === 'POST' ? JSON.stringify({ test: true }) : undefined
    })

    clearTimeout(timeoutId)

    result.responseTime = Date.now() - startTime
    result.statusCode = response.status

    if (!endpoint.expectedStatus.includes(response.status)) {
      result.status = 'unhealthy'
      result.error = `Unexpected status code: ${response.status}`
    } else if (result.responseTime > endpoint.timeout * 0.8) {
      result.status = 'degraded'
      result.error = 'Response time near timeout threshold'
    }

  } catch (error) {
    result.status = 'unhealthy'
    result.responseTime = Date.now() - startTime
    result.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Record metrics
  await recordHealthMetric(result)

  return result
}

/**
 * Record health check metrics to database
 */
async function recordHealthMetric(result: HealthCheckResult) {
  const supabase = createClient()

  try {
    // Record to monitoring_metrics table
    await supabase.from('monitoring_metrics').insert({
      tool: result.service,
      metric: 'health_check_response_time',
      value: result.responseTime,
      metadata: {
        endpoint: result.endpoint,
        status: result.status,
        statusCode: result.statusCode,
        error: result.error
      }
    })

    // Check thresholds
    if (result.status === 'unhealthy') {
      checkThreshold(result.service, 'endpoint_failures', 1, {
        endpoint: result.endpoint,
        error: result.error
      })
    }

    if (result.responseTime > 5000) {
      checkThreshold(result.service, 'response_time', result.responseTime, {
        endpoint: result.endpoint
      })
    }

  } catch (error) {
    console.error('Failed to record health metric:', error)
  }
}

/**
 * Check health of all configured services
 */
export async function checkAllServices(): Promise<ServiceHealth[]> {
  const servicesWithEndpoints = getServicesWithEndpoints()
  const results: ServiceHealth[] = []

  for (const config of servicesWithEndpoints) {
    const checks: HealthCheckResult[] = []

    // Check all endpoints for this service
    if (config.endpoints) {
      for (const endpoint of config.endpoints) {
        const result = await checkEndpoint(config.service, endpoint)
        checks.push(result)
      }
    }

    // Calculate service metrics
    const healthyChecks = checks.filter(c => c.status === 'healthy').length
    const totalChecks = checks.length
    const avgResponseTime = checks.reduce((sum, c) => sum + c.responseTime, 0) / totalChecks
    const errorRate = (totalChecks - healthyChecks) / totalChecks * 100
    const availability = (healthyChecks / totalChecks) * 100

    // Determine overall service status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (errorRate > 50) {
      status = 'unhealthy'
    } else if (errorRate > 10 || avgResponseTime > 5000) {
      status = 'degraded'
    }

    const serviceHealth: ServiceHealth = {
      service: config.service,
      status,
      checks,
      metrics: {
        avgResponseTime,
        errorRate,
        availability
      }
    }

    results.push(serviceHealth)

    // Track in analytics
    track('service_health_check', {
      service: config.service,
      status,
      availability,
      avgResponseTime,
      errorRate
    })
  }

  return results
}

/**
 * Check database connectivity
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now()
  const result: HealthCheckResult = {
    service: 'database',
    endpoint: 'supabase',
    status: 'healthy',
    responseTime: 0,
    timestamp: new Date()
  }

  try {
    const supabase = createClient()
    
    // Simple query to test connectivity
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single()

    result.responseTime = Date.now() - startTime

    if (error && error.code !== 'PGRST116') { // Not found is ok
      result.status = 'unhealthy'
      result.error = error.message
    } else if (result.responseTime > 1000) {
      result.status = 'degraded'
      result.error = 'Slow database response'
    }

  } catch (error) {
    result.status = 'unhealthy'
    result.responseTime = Date.now() - startTime
    result.error = error instanceof Error ? error.message : 'Database connection failed'
  }

  await recordHealthMetric(result)
  return result
}

/**
 * Check external API integrations
 */
export async function checkExternalAPIs(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = []

  // Check Replicate API
  if (process.env.REPLICATE_API_TOKEN) {
    const replicateResult = await checkEndpoint('replicate-api', {
      name: 'Replicate API',
      url: 'https://api.replicate.com/v1/models',
      method: 'GET',
      expectedStatus: [200],
      timeout: 10000,
      checkInterval: 60
    })
    results.push(replicateResult)
  }

  // Add other external API checks as needed

  return results
}

/**
 * Calculate uptime percentage for a service
 */
export async function calculateUptime(
  service: string,
  timeRange: number = 86400000 // 24 hours
): Promise<number> {
  const supabase = createClient()
  const since = new Date(Date.now() - timeRange)

  try {
    const { data, error } = await supabase
      .from('monitoring_metrics')
      .select('metadata')
      .eq('tool', service)
      .eq('metric', 'health_check_response_time')
      .gte('created_at', since.toISOString())

    if (error || !data) {
      console.error('Failed to calculate uptime:', error)
      return 0
    }

    const totalChecks = data.length
    const healthyChecks = data.filter(
      (record: any) => record.metadata?.status === 'healthy'
    ).length

    return totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 100

  } catch (error) {
    console.error('Uptime calculation error:', error)
    return 0
  }
}

/**
 * Get health status summary for all services
 */
export async function getHealthSummary(): Promise<{
  overall: 'healthy' | 'degraded' | 'unhealthy'
  services: ServiceHealth[]
  timestamp: Date
}> {
  const services = await checkAllServices()
  const database = await checkDatabaseHealth()
  const externalAPIs = await checkExternalAPIs()

  // Add database and external API results
  services.push({
    service: 'database',
    status: database.status,
    checks: [database],
    metrics: {
      avgResponseTime: database.responseTime,
      errorRate: database.status === 'unhealthy' ? 100 : 0,
      availability: database.status === 'healthy' ? 100 : 0
    }
  })

  if (externalAPIs.length > 0) {
    const externalStatus = externalAPIs.every(api => api.status === 'healthy') 
      ? 'healthy' 
      : externalAPIs.some(api => api.status === 'unhealthy') 
      ? 'unhealthy' 
      : 'degraded'

    services.push({
      service: 'external-apis',
      status: externalStatus,
      checks: externalAPIs,
      metrics: {
        avgResponseTime: externalAPIs.reduce((sum, api) => sum + api.responseTime, 0) / externalAPIs.length,
        errorRate: (externalAPIs.filter(api => api.status === 'unhealthy').length / externalAPIs.length) * 100,
        availability: (externalAPIs.filter(api => api.status === 'healthy').length / externalAPIs.length) * 100
      }
    })
  }

  // Determine overall status
  const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
  const degradedCount = services.filter(s => s.status === 'degraded').length
  
  let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  if (unhealthyCount > 0) {
    overall = 'unhealthy'
  } else if (degradedCount > 0) {
    overall = 'degraded'
  }

  return {
    overall,
    services,
    timestamp: new Date()
  }
}

/**
 * Synthetic check for critical user paths
 */
export async function runSyntheticChecks(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = []
  
  // Define critical user paths
  const criticalPaths = [
    {
      name: 'User can access homepage',
      url: '/',
      expectedContent: 'SVG AI'
    },
    {
      name: 'User can access PNG to SVG converter',
      url: '/convert/png-to-svg',
      expectedContent: 'PNG to SVG'
    },
    {
      name: 'User can generate AI icon',
      url: '/ai-icon-generator',
      expectedContent: 'Generate'
    }
  ]

  for (const path of criticalPaths) {
    const startTime = Date.now()
    const result: HealthCheckResult = {
      service: 'synthetic-monitoring',
      endpoint: path.name,
      status: 'healthy',
      responseTime: 0,
      timestamp: new Date()
    }

    try {
      const response = await fetch(path.url, {
        headers: {
          'User-Agent': 'SVG-AI-Synthetic-Monitor/1.0'
        }
      })

      result.responseTime = Date.now() - startTime
      result.statusCode = response.status

      if (response.status !== 200) {
        result.status = 'unhealthy'
        result.error = `Unexpected status: ${response.status}`
      } else {
        const text = await response.text()
        if (!text.includes(path.expectedContent)) {
          result.status = 'unhealthy'
          result.error = 'Expected content not found'
        }
      }

    } catch (error) {
      result.status = 'unhealthy'
      result.responseTime = Date.now() - startTime
      result.error = error instanceof Error ? error.message : 'Synthetic check failed'
    }

    results.push(result)
    await recordHealthMetric(result)
  }

  return results
}