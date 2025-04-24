import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";


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
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect("/login?redirectedFrom=/dashboard");
  }

  // TypeScript narrowing: After the redirect, we know userId exists and is a string
  const userId = session.user.id;

  // Load user's SVGs - use a try/catch to handle the case where session might exist but data fetch fails
  let svgs: SvgDesign[] = [];
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
  } catch (error) {
    console.error("Error fetching SVGs:", error);
    // Don't redirect - just show an empty dashboard
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
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
      <Dashboard initialSvgs={svgs} userId={userId} />
    </div>
  );
}
