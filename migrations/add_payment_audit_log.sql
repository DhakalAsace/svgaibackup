CREATE TABLE IF NOT EXISTS payment_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  stripe_event_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_audit_user ON payment_audit_log(user_id);
CREATE INDEX idx_payment_audit_event ON payment_audit_log(event_type);
CREATE INDEX idx_payment_audit_created ON payment_audit_log(created_at);