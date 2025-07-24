"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { createLogger } from '@/lib/logger';
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
import { Switch } from "@/components/ui/switch";

const logger = createLogger('settings-form');

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
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Create the client inside the component
  const supabase = createClientComponentClient<Database>();

  // Load user data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        // Load from user metadata first
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || ""
        }));
        
        // Try to load marketing consent from profile
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('marketing_consent')
            .eq('id', userId)
            .single();
            
          if (profile) {
            setMarketingConsent(profile.marketing_consent || false);
          }
        } catch (error) {
          // Profile might not exist yet, default to false
          setMarketingConsent(false);
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    
    loadProfile();
  }, [user, userId, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleMarketingToggle = async (checked: boolean) => {
    setMarketingConsent(checked);
    
    // Immediately save the marketing preference
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          marketing_consent: checked,
          marketing_consent_date: checked ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        
      if (error) throw error;
      
      toast({
        title: "Email preferences updated",
        description: checked 
          ? "You'll receive our marketing emails" 
          : "You've unsubscribed from marketing emails",
      });
    } catch (error: any) {
      // Revert on error
      setMarketingConsent(!checked);
      toast({
        title: "Error",
        description: "Failed to update email preferences",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the profile with name and ensure marketing consent is preserved
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: formData.name,
          marketing_consent: marketingConsent,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) throw error;

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
        // Optionally: add toast, decide whether to stop or continue
      }

      // 2. Delete user's profile if it exists (client-side attempt, also done server-side)
      try {
        const { error: deleteProfileError } = await (supabase as any)
          .from('profiles')
          .delete()
          .eq('id', currentUserId);

        if (deleteProfileError && !deleteProfileError.message.includes('does not exist')) {
        }
      } catch (profileError) {
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
        toast({
          title: "Deletion Error",
          description: error.message || "Failed to complete account deletion on the server.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
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
    <div className="space-y-6">
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
      </Card>

      {/* Email Preferences Card */}
      <Card className="w-full max-w-2xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>
            Control what emails you receive from us
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails" className="text-base font-normal">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Get exclusive tips, new features, and special offers
              </p>
            </div>
            <Switch 
              id="marketing-emails"
              checked={marketingConsent}
              onCheckedChange={handleMarketingToggle}
              disabled={loadingProfile}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            You can change this preference at any time. We'll never share your email with third parties.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone - Temporarily commented out
      <Card className="w-full max-w-2xl mx-auto shadow-sm border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
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
        </CardContent>
      </Card>
      */}
    </div>
  );
}