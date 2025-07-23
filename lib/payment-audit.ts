import { SupabaseClient } from '@supabase/supabase-js';
export async function logPaymentEvent(
  supabase: SupabaseClient,
  userId: string | null,
  eventType: string,
  eventData: unknown,
  stripeEventId?: string,
  request?: Request
) {
  try {
    const ip = request?.headers.get('x-forwarded-for')?.split(',')[0] ||
               request?.headers.get('x-real-ip') || null;
    const userAgent = request?.headers.get('user-agent') || null;
    const { error } = await supabase.from('payment_audit_log').insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      stripe_event_id: stripeEventId,
      ip_address: ip,
      user_agent: userAgent,
    });
    if (error) {
    }
  } catch (err) {
  }
}