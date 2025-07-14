# Monitoring System Setup Guide

## Overview

The SVG AI monitoring system provides comprehensive observability for all services, including:
- Health checks and uptime monitoring
- Performance tracking and alerting
- Error tracking and grouping
- Real-time dashboards
- Multi-channel alert notifications

## Components

### 1. Health Monitoring (`/lib/monitoring/health-checks.ts`)
- Endpoint availability checks
- Database connectivity monitoring
- External API health verification
- Synthetic user journey testing
- Uptime calculation and tracking

### 2. Performance Monitoring (`/lib/monitoring/performance.ts`)
- Response time tracking (P50, P95, P99)
- Memory usage monitoring
- Web Vitals collection
- Database query performance
- Converter execution metrics

### 3. Alert System (`/lib/monitoring/alerts.ts`)
- Multi-channel notifications (Email, Slack, PagerDuty, Webhooks)
- Alert thresholds and escalation
- Alert acknowledgment and tracking
- Automatic retry for failed notifications

### 4. Error Tracking (`/lib/monitoring/error-tracking.ts`)
- Automatic error capture and grouping
- Sentry integration
- Error fingerprinting for deduplication
- Error statistics and trends

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local`:

```env
# Monitoring API Key (for external access)
MONITORING_API_KEY=your_secure_api_key

# Internal API Key (for internal service communication)
INTERNAL_API_KEY=your_internal_api_key

# Email Notifications
MONITORING_EMAIL_ENABLED=true
MONITORING_EMAIL_RECIPIENTS=alerts@example.com,admin@example.com
MONITORING_EMAIL_SENDER=monitoring@svgai.org

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_ALERT_CHANNEL=#alerts

# PagerDuty Integration
PAGERDUTY_INTEGRATION_KEY=your_pagerduty_key

# Webhook Notifications
MONITORING_WEBHOOK_URL=https://your-webhook-endpoint.com
MONITORING_WEBHOOK_TOKEN=your_webhook_token

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Cron Job Secret (for Vercel Cron)
CRON_SECRET=your_cron_secret
```

### 2. Database Setup

Run the migration files to create monitoring tables:

```bash
# Run all monitoring-related migrations
npx supabase db push
```

Or manually run:
- `/migrations/add_monitoring_alerts_table.sql`
- `/migrations/add_error_tracking_tables.sql`

### 3. Vercel Cron Configuration

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/monitoring/health-check",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 4. Initialize Monitoring in Your App

In your root layout or app initialization:

```typescript
import { monitoring } from '@/lib/monitoring'

// Initialize monitoring system
monitoring.initialize()
```

### 5. Email Service Integration

Choose and configure an email service provider:

#### SendGrid
```bash
npm install @sendgrid/mail
```

Update `/app/api/monitoring/send-email/route.ts`:
```typescript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to,
  from,
  subject,
  html,
})
```

#### Resend
```bash
npm install resend
```

```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from,
  to,
  subject,
  html,
})
```

### 6. Sentry Setup

1. Create a Sentry project at https://sentry.io
2. Install Sentry SDK:
```bash
npm install @sentry/nextjs
```
3. Run Sentry wizard:
```bash
npx @sentry/wizard -i nextjs
```

## Usage

### Tracking Performance

```typescript
import { PerformanceTracker } from '@/lib/monitoring/performance'

// Track converter performance
const tracker = new PerformanceTracker('png-to-svg', 'conversion')
tracker.mark('upload-complete')
tracker.mark('processing-complete')
tracker.addMetadata('fileSize', 1024000)
await tracker.complete(true)
```

### Capturing Errors

```typescript
import { captureError } from '@/lib/monitoring/error-tracking'

try {
  // Your code
} catch (error) {
  await captureError(error, 'converter-service', {
    userId: user.id,
    converter: 'png-to-svg'
  })
}
```

### Manual Health Checks

```typescript
import { checkServiceHealth } from '@/lib/monitoring'

const health = await checkServiceHealth('png-to-svg')
console.log('Service status:', health.status)
```

### Custom Alerts

```typescript
import { checkThreshold } from '@/lib/analytics-alerts'

// Check custom threshold
checkThreshold('my-service', 'custom-metric', value, {
  context: 'additional-info'
})
```

## Monitoring Dashboard

Access the monitoring dashboard at: `/dashboard/monitoring`

Features:
- Real-time service health status
- Performance metrics visualization
- Alert history and statistics
- Error tracking and trends
- Uptime percentages

## Alert Configuration

Modify alert thresholds in `/lib/monitoring/config.ts`:

```typescript
alertThresholds: [
  { 
    metric: 'error_rate', 
    threshold: 5, 
    comparison: 'above', 
    severity: 'warning' 
  },
  { 
    metric: 'response_time', 
    threshold: 3000, 
    comparison: 'above', 
    severity: 'error' 
  }
]
```

## Best Practices

1. **Set Appropriate Thresholds**: Start with conservative thresholds and adjust based on actual usage patterns
2. **Use Severity Levels**: Reserve 'critical' for issues requiring immediate attention
3. **Monitor Key User Journeys**: Set up synthetic checks for critical paths
4. **Regular Review**: Review alert patterns weekly to reduce noise
5. **Document Runbooks**: Create response procedures for common alerts

## Troubleshooting

### Alerts Not Sending
1. Check environment variables are set correctly
2. Verify notification channel configurations
3. Check `/api/monitoring/alert` endpoint logs
4. Review failed alerts in the database

### High Memory Usage
1. Check for memory leaks in converters
2. Review file upload size limits
3. Monitor browser memory for animation tool
4. Implement cleanup in long-running processes

### Performance Issues
1. Review performance reports in dashboard
2. Check for N+1 queries in database logs
3. Analyze slow API endpoints
4. Optimize converter algorithms

## Maintenance

### Regular Tasks
- Review and acknowledge alerts weekly
- Clean up old monitoring data (automated via cron)
- Update alert thresholds based on trends
- Test alert channels monthly

### Database Cleanup
Old monitoring data is automatically cleaned up via the `cleanup_old_monitoring_data()` function:
- Error events: 30 days retention
- Resolved errors: 90 days retention
- Synthetic checks: 7 days retention
- Uptime metrics: 30 days retention

## Security Considerations

1. **API Keys**: Use strong, unique keys for monitoring endpoints
2. **Access Control**: Limit monitoring dashboard to authenticated users
3. **Data Sensitivity**: Sanitize error messages before logging
4. **Rate Limiting**: Implement rate limits on monitoring endpoints
5. **Encryption**: Use HTTPS for all webhook notifications

## Integration Examples

### GitHub Actions
```yaml
- name: Health Check
  run: |
    curl -X GET https://svgai.org/api/monitoring/health \
      -H "Authorization: Bearer ${{ secrets.MONITORING_API_KEY }}"
```

### External Monitoring Services
- **Datadog**: Use webhook notifications to send alerts
- **New Relic**: Export metrics via API endpoint
- **Grafana**: Query monitoring database directly
- **StatusPage**: Update component status via webhooks