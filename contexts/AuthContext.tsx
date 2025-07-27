"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { createClientComponentClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { AuthErrorHandler } from "@/lib/auth-error-handler";

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
  const [supabase] = useState(() => createClientComponentClient<Database>());

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error && !error.message.includes('Failed to fetch')) {
          // Only log non-network errors
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Auth] Session check error:', error.message);
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error: any) {
        // Network errors are expected in some environments
        // Just set no session and continue
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle PKCE flow completion and profile updates
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Session established successfully
          
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
                
                // Error updating marketing consent is not critical
                
                // Clear the pending consent
                localStorage.removeItem('pendingMarketingConsent');
              }
            } catch (e) {
              // Error parsing consent data
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
      
      if (error) {
        const errorMessage = AuthErrorHandler.getErrorMessage(error);
        throw new Error(errorMessage);
      }
      
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
    } catch (error: any) {
      // Use AuthErrorHandler for consistent error messages
      const errorMessage = AuthErrorHandler.getErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const errorMessage = AuthErrorHandler.getErrorMessage(error);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = AuthErrorHandler.getErrorMessage(error);
      throw new Error(errorMessage);
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
      if (error) {
        const errorMessage = AuthErrorHandler.getErrorMessage(error);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = AuthErrorHandler.getErrorMessage(error);
      throw new Error(errorMessage);
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