CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_idempotency ON webhook_events(idempotency_key);