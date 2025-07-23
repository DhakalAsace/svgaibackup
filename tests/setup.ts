import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
// Validate required environment variables before creating clients
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Environment variable SUPABASE_SERVICE_ROLE_KEY is not defined');
}
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Environment variable STRIPE_SECRET_KEY is not defined');
}
export const testSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export const testStripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});
export async function createTestUser() {
  const email = `test-${Date.now()}@example.com`;
  const { data, error } = await testSupabase.auth.admin.createUser({
    email,
    password: 'test123456',
  });
  return data?.user;
}
export async function cleanupTestUser(userId: string) {
  try {
    await testSupabase.auth.admin.deleteUser(userId);
  } catch (error) {
  }
}