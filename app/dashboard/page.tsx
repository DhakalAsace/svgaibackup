import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { AuthRedirectHandler } from "@/components/auth/auth-redirect-handler";


// Dynamically import the dashboard component to reduce initial JS bundle size
// No ssr:false here since this is a server component
const Dashboard = dynamic(() => import("@/components/dashboard/dashboard"), {
  loading: () => <div className="container py-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Your SVG Designs</h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-64"></div>
      ))}
    </div>
  </div>
});

export const metadata: Metadata = {
  title: "Dashboard | SVG AI",
  description: "Manage your SVG designs",
};

type SvgDesign = {
  id: string;
  title: string;
  description: string | null;
  svg_content: string;
  prompt: string | null;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  tags: string[] | null;
  user_id: string;
};

export default async function DashboardPage() {
  // Fix the cookies implementation to match Supabase's expected Promise<ReadonlyRequestCookies> type
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
  // Get the authenticated user - this validates the session with Supabase Auth server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // If no user or auth error, redirect to login
  if (!user || authError) {
    redirect("/login?redirectedFrom=/dashboard");
  }

  // TypeScript narrowing: After the redirect, we know userId exists and is a string
  const userId = user.id;

  // Load user's SVGs and profile - use a try/catch to handle the case where session might exist but data fetch fails
  let svgs: SvgDesign[] = [];
  let userProfile = null;
  
  try {
    // Fetch the user's SVG designs
    // Using a direct filter object instead of .eq() method to avoid TypeScript issues
    const { data: designs, error } = await supabase
      .from('svg_designs')
      .select('*')
      .filter('user_id', 'eq', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    svgs = designs || [];
    
    // Fetch user profile for subscription info and credit data
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, lifetime_credits_granted, lifetime_credits_used, monthly_credits, monthly_credits_used, credits_reset_at, subscription_interval, stripe_customer_id')
      .eq('id', userId)
      .single();
      
    userProfile = profile;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Don't redirect - just show an empty dashboard
  }

  return (
    <>
      <AuthRedirectHandler />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            {/* Temporary sync button for testing */}
            {/* SyncSubscriptionButton removed for end users */}
            <Button asChild size="sm" variant="outline">
              <Link href="/ai-icon-generator">
                <Plus className="mr-2 h-4 w-4" /> Create Icons
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/">
                <Plus className="mr-2 h-4 w-4" /> Create SVG
              </Link>
            </Button>
          </div>
        </div>
        <Dashboard initialSvgs={svgs} userId={userId} userProfile={userProfile || undefined} />
      </div>
    </>
  );
}
