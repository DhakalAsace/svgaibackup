# Payment System Incident Response Plan

## Incident Classification

### Severity Levels
- **P0 (Critical)**: Complete payment system failure, data breach, widespread fraud
- **P1 (High)**: Webhook failures affecting > 10% of transactions, checkout unavailable
- **P2 (Medium)**: Individual payment failures, sync issues, high error rate
- **P3 (Low)**: Minor UI issues, delayed notifications, performance degradation

## Response Team

### Roles and Responsibilities
- **Incident Commander**: Overall incident coordination
- **Technical Lead**: Technical investigation and fixes
- **Communications Lead**: User and stakeholder updates
- **Security Lead**: Security implications assessment

## Incident Response Phases

### 1. Detection and Alert (0-15 minutes)
- **Automated Alerts**
  - Webhook failure rate > 5%
  - Checkout error rate > 10%
  - Database connection failures
  - Unusual traffic patterns

- **Manual Detection**
  - User reports via support
  - Internal testing discoveries
  - Monitoring dashboard anomalies

### 2. Initial Assessment (15-30 minutes)
- Confirm incident severity
- Identify affected systems
- Estimate user impact
- Activate response team

### 3. Containment (30-60 minutes)
- **For Security Incidents**
  - Disable affected API endpoints
  - Block suspicious IP addresses
  - Rotate compromised credentials
  - Enable additional logging

- **For System Failures**
  - Switch to fallback systems
  - Enable maintenance mode
  - Queue failed transactions
  - Notify Stripe support if needed

### 4. Investigation and Diagnosis
- Review error logs and stack traces
- Query payment audit logs
- Check Stripe webhook logs
- Analyze database state
- Identify root cause

### 5. Resolution and Recovery
- Deploy fixes to staging first
- Test thoroughly before production
- Gradual rollout if possible
- Monitor closely during recovery

### 6. Post-Incident Review
- Document timeline and actions
- Identify improvement areas
- Update runbooks
- Share learnings with team

## Specific Incident Playbooks

### Webhook Processing Failure
1. **Symptoms**
   - Subscriptions not updating
   - Credits not allocated
   - Payment confirmations missing

2. **Immediate Actions**
   ```bash
   # Check webhook endpoint health
   curl -I https://your-domain.com/api/webhooks/stripe
   
   # View recent webhook events
   stripe events list --limit 10
   
   # Check for signature errors in logs
   grep "webhook signature" /path/to/logs
   ```

3. **Recovery Steps**
   - Verify webhook secret is correct
   - Check for middleware blocking requests
   - Replay failed webhooks from Stripe Dashboard
   - Run manual subscription sync

### Credit System Exploitation
1. **Symptoms**
   - Unusual credit usage patterns
   - Multiple generations from same user
   - Database constraint violations

2. **Immediate Actions**
   - Block affected user accounts
   - Review credit deduction logs
   - Check for race condition exploits

3. **Recovery Steps**
   - Fix race condition in database
   - Recalculate user credits
   - Add additional rate limiting
   - Update monitoring rules

### Payment Processing Outage
1. **Symptoms**
   - Checkout sessions failing
   - Stripe API errors
   - Network timeouts

2. **Immediate Actions**
   - Check Stripe status page
   - Verify API keys are valid
   - Test with Stripe CLI
   - Enable fallback messaging

3. **Recovery Steps**
   - Queue failed payment attempts
   - Notify affected users
   - Process queued payments when restored
   - Offer compensation if needed

## Communication Templates

### User Notification (P0/P1)
```
Subject: Payment System Maintenance

We are currently experiencing issues with our payment system. 
Your data is safe, but new subscriptions and upgrades are 
temporarily unavailable.

Status updates: [status page URL]
Expected resolution: [time]

We apologize for the inconvenience.
```

### Internal Alert (All Severities)
```
INCIDENT ALERT - [Severity]
System: Payment Processing
Issue: [Brief description]
Impact: [User impact]
Commander: [Name]
Channel: #incident-[number]
```

### Post-Incident User Update
```
Subject: Payment System Restored

Our payment system has been fully restored. All pending 
transactions have been processed successfully.

If you experienced any issues, please contact support 
with reference: [incident number]

Thank you for your patience.
```

## Recovery Procedures

### Database Rollback
```sql
-- Check current state
SELECT COUNT(*) FROM payment_audit_log 
WHERE created_at > '[incident_start_time]';

-- Backup current state
pg_dump -t payment_audit_log > backup_[timestamp].sql

-- Restore if needed
psql < backup_[previous_timestamp].sql
```

### Stripe Webhook Replay
```bash
# List events during incident window
stripe events list \
  --created="gte:1234567890,lte:1234567899" \
  --limit 100

# Replay specific event
stripe events replay evt_[event_id] \
  --webhook-endpoint we_[endpoint_id]
```

### Manual Subscription Sync
```typescript
// Run sync for affected users
const affectedUsers = ['user_id_1', 'user_id_2'];
for (const userId of affectedUsers) {
  await syncUserSubscription(userId);
}
```

## Monitoring and Alerting

### Key Metrics to Monitor
- Webhook success rate (target: > 99%)
- Checkout completion rate (target: > 80%)
- API response time (target: < 500ms)
- Error rate by endpoint (target: < 1%)

### Alert Channels
- **P0**: Phone call + Slack + Email
- **P1**: Slack + Email
- **P2**: Slack
- **P3**: Daily digest

## Lessons Learned Repository

### Previous Incidents
1. **Date**: [Date]
   - **Issue**: Webhook timeout during high load
   - **Resolution**: Increased timeout, added queue
   - **Prevention**: Load testing, auto-scaling

2. **Date**: [Date]
   - **Issue**: Race condition in credit deduction
   - **Resolution**: Added row locking
   - **Prevention**: Concurrent testing

## Testing and Drills

### Monthly Tests
- Webhook failure simulation
- Database failover test
- API key rotation drill
- Communication flow test

### Quarterly Reviews
- Update incident playbooks
- Review monitoring thresholds
- Test backup procedures
- Security audit

## Appendix

### Important URLs
- Stripe Dashboard: https://dashboard.stripe.com
- Supabase Dashboard: https://app.supabase.io
- Status Page: [Your status page]
- Runbook Wiki: [Internal wiki]

### Emergency Contacts
- Stripe Support: +1-888-926-2289
- Supabase Support: [Contact]
- On-call Engineer: [Rotation schedule]

Last Updated: [Date]
Next Drill: [Date]