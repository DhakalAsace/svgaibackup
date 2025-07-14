"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { createLogger } from '@/lib/logger';

const logger = createLogger('settings-form');
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type SettingsFormProps = {
  userId: string;
};

export function SettingsForm({ userId }: SettingsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
  });

  // Create the client inside the component
  const supabase = createClientComponentClient<Database>();

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if profiles table exists
      const { data: profilesExist, error: checkError } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (checkError && !checkError.message.includes('does not exist')) {
        throw checkError;
      }

      // If profiles table exists, update the profile
      if (!checkError) {
        const { error } = await (supabase as any)
          .from('profiles')
          .upsert({
            id: userId,
            name: formData.name,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (error) throw error;
      }

      // Update user metadata in auth.users
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: formData.name },
      });

      if (updateError) throw updateError;

      toast({
        title: "Settings updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // 0. Get the current user and session for access token
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (userError || !user || sessionError || !sessionData?.session?.access_token) {
        console.error("Error getting user or session:", userError || sessionError);
        toast({ title: "Error", description: "Could not verify user session. Please try logging in again.", variant: "destructive" });
        setIsDeleting(false);
        return;
      }
      const accessToken = sessionData.session.access_token;
      const currentUserId = user.id; // Get user ID from authenticated user

      // 1. Delete user's SVG designs (using ID from session)
      const { error: deleteDesignsError } = await supabase
        .from('svg_designs')
        .delete()
        .eq('user_id', currentUserId);

      if (deleteDesignsError && !deleteDesignsError.message.includes('does not exist')) {
        console.error("Error deleting designs:", deleteDesignsError);
        // Optionally: add toast, decide whether to stop or continue
      }

      // 2. Delete user's profile if it exists (client-side attempt, also done server-side)
      try {
        const { error: deleteProfileError } = await (supabase as any)
          .from('profiles')
          .delete()
          .eq('id', currentUserId);

        if (deleteProfileError && !deleteProfileError.message.includes('does not exist')) {
          console.error("Error deleting profile client-side:", deleteProfileError);
        }
      } catch (profileError) {
        console.error("Profile deletion error client-side:", profileError);
      }

      // 3. Call the server-side API to delete the auth user, sending the token
      try {
        const response = await fetch('/api/delete-user', {
          method: 'POST',
          headers: {
            // No 'Content-Type' needed if body is empty
            'Authorization': `Bearer ${accessToken}`, // Send the token
          },
          // No body needed, user ID derived from token on server
        });

        if (!response.ok) {
          let errorMsg = 'Failed to delete user account';
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorData.message || errorMsg; // Prefer server error message
          } catch (jsonError) {
             logger.warn("Could not parse error response body as JSON");
             // Use the generic message if parsing fails
          }
          throw new Error(errorMsg);
        }

        // 4. Sign out the user *after* successful server-side deletion
        await signOut();

        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });

        router.push('/'); // Redirect after successful deletion and sign out

      } catch (error: any) {
        console.error("Error calling delete API or processing response:", error);
        toast({
          title: "Deletion Error",
          description: error.message || "Failed to complete account deletion on the server.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in overall account deletion process:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during account deletion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                disabled 
                className="bg-muted/40" 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="border-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
      
      {/* Danger Zone - Temporarily commented out 
      <CardFooter className="flex flex-col items-stretch border-t pt-6 mt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          </div>
          
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm mb-4">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" className="w-full sm:w-auto" disabled={isDeleting}>
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your
                    data from our servers, including all your SVG designs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardFooter>
      */}
    </Card>
  );
}
