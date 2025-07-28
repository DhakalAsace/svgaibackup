import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return NextResponse.json({ user: user ? { id: user.id } : null });
}