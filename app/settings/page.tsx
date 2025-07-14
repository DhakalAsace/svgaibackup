import { Metadata } from "next";
import { SettingsForm } from "@/components/settings/settings-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Settings | SVG AI",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  // Fix cookies implementation to match Supabase's expected Promise<ReadonlyRequestCookies> type
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get the authenticated user - this validates the session with Supabase Auth server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // If no user or auth error, redirect to login
  if (!user || authError) {
    redirect("/login?redirectedFrom=/settings");
  }
  
  const userId = user.id;
  
  return (
    <div className="container py-10">
      <SettingsForm userId={userId} />
    </div>
  );
}
