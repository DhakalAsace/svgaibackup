import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Profile from "@/components/profile/profile";


export const metadata: Metadata = {
  title: "Profile | SVG AI",
  description: "Manage your SVG AI account settings",
};

export default async function ProfilePage() {
  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If no user or auth error, redirect to login
  if (!user || authError) {
    redirect("/login");
  }

  return <Profile userId={user.id} />;
}
