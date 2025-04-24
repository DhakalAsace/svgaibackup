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
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  return <Profile userId={session.user.id} user={session.user} />;
}
