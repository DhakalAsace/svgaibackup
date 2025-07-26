"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { createClientComponentClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, marketingConsent?: boolean) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create the Supabase client directly inside the component
  // This ensures it has access to cookies in the browser context
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle PKCE flow completion and profile updates
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Session established successfully
          console.log('[Auth] User signed in successfully');
          
          // Check if we need to update marketing consent (for new signups)
          const pendingConsent = localStorage.getItem('pendingMarketingConsent');
          if (pendingConsent) {
            try {
              const consentData = JSON.parse(pendingConsent);
              
              // Only update profile if this is the same user
              if (consentData.userId === newSession.user.id) {
                // Profile already exists from trigger
                // Marketing consent is stored separately in user metadata
                // Update user metadata with marketing consent
                const { error: updateError } = await supabase.auth.updateUser({
                  data: {
                    marketing_consent: consentData.marketingConsent,
                    marketing_consent_date: consentData.marketingConsentDate,
                  }
                });
                
                if (updateError) {
                  console.error('Error updating marketing consent:', updateError);
                }
                
                // Clear the pending consent
                localStorage.removeItem('pendingMarketingConsent');
              }
            } catch (e) {
              console.error('Error parsing pending consent:', e);
              localStorage.removeItem('pendingMarketingConsent');
            }
          }
        }
      }
    );

    // Cleanup function to unsubscribe the listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]); // Include supabase.auth in the dependency array

  const signUp = async (email: string, password: string, marketingConsent?: boolean) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            marketing_consent: marketingConsent || false,
            marketing_consent_date: marketingConsent ? new Date().toISOString() : null,
          },
        },
      });
      
      if (error) throw error;
      
      // Store marketing consent in localStorage to be updated after email confirmation
      if (marketingConsent !== undefined && data.user?.id) {
        localStorage.setItem('pendingMarketingConsent', JSON.stringify({
          userId: data.user.id,
          marketingConsent,
          marketingConsentDate: marketingConsent ? new Date().toISOString() : null,
        }));
      }
      
      // Profile will be created automatically by database trigger
      // Marketing consent will be updated after email confirmation
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      // Store the redirect path in localStorage before OAuth redirect
      if (redirectPath && redirectPath !== '/') {
        localStorage.setItem('authRedirectPath', redirectPath);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}