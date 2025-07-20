import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { AuthRedirectHandler } from "@/components/auth/auth-redirect-handler";


// Dynamically import the minimalist dashboard component
const Dashboard = dynamic(() => import("@/components/dashboard/minimalist-dashboard"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white border-b border-gray-200 h-16"></div>
        
        <div className="flex">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen"></div>
          
          {/* Main content skeleton */}
          <div className="flex-1 p-8">
            {/* Metrics skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
              ))}
            </div>
            
            {/* Quick actions skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl h-32 mb-6"></div>
            
            {/* Content grid skeleton */}
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Dashboard",
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
  const supabase = createServerComponentClient<Database>({ cookies });
  
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
    svgs = (designs || []) as SvgDesign[];
    
    // Fetch user profile for subscription info and credit data
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, lifetime_credits_granted, lifetime_credits_used, monthly_credits, monthly_credits_used, credits_reset_at, subscription_interval, stripe_customer_id')
      .eq('id', userId as any)
      .single();
      
    userProfile = profile && !('error' in profile) ? profile : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Don't redirect - just show an empty dashboard
  }

  return (
    <>
      <AuthRedirectHandler />
      <Dashboard initialSvgs={svgs} userId={userId} userProfile={userProfile ? {
        subscription_tier: userProfile.subscription_tier,
        subscription_status: userProfile.subscription_status,
        lifetime_credits_granted: userProfile.lifetime_credits_granted,
        lifetime_credits_used: userProfile.lifetime_credits_used,
        monthly_credits: userProfile.monthly_credits,
        monthly_credits_used: userProfile.monthly_credits_used,
        credits_reset_at: userProfile.credits_reset_at,
        subscription_interval: userProfile.subscription_interval,
        stripe_customer_id: userProfile.stripe_customer_id
      } : undefined} />
    </>
  );
}
