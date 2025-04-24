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
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect("/login?redirectedFrom=/settings");
  }
  
  const userId = session.user.id;
  
  return (
    <div className="container py-10">
      <SettingsForm userId={userId} />
    </div>
  );
}
