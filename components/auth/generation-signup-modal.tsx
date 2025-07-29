'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, History, Zap, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GenerationSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsUsed: number;
  isSoftPrompt?: boolean;
  onContinueAsGuest?: () => void;
  isAuthenticated?: boolean;
  isSubscribed?: boolean;
  preservePrompt?: boolean; // NEW PROP
  source?: 'homepage' | 'icon-generator' | 'results'; // NEW PROP for smart redirection
}

export function GenerationSignupModal({
  isOpen,
  onClose,
  generationsUsed,
  isSoftPrompt = false,
  onContinueAsGuest,
  isAuthenticated = false,
  isSubscribed = false,
  preservePrompt = false,
  source = 'homepage',
}: GenerationSignupModalProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [internalOpen, setInternalOpen] = useState(isOpen);

  // Sync internal open state with prop, but preserve if showing success
  useEffect(() => {
    if (isOpen || showSuccess) {
      setInternalOpen(true);
    } else {
      setInternalOpen(false);
    }
  }, [isOpen, showSuccess]);

  // For authenticated free users who hit their limit, redirect to pricing instead of showing modal
  useEffect(() => {
    if (isOpen && isAuthenticated && !isSubscribed && !isSoftPrompt) {
      router.push('/pricing');
      onClose();
    }
  }, [isOpen, isAuthenticated, isSubscribed, isSoftPrompt, router, onClose]);

  // Reset success state when modal is closed
  useEffect(() => {
    if (!internalOpen) {
      setShowSuccess(false);
    }
  }, [internalOpen]);

  // Determine the return URL based on the source
  const getReturnUrl = () => {
    switch (source) {
      case 'icon-generator':
        return '/ai-icon-generator';
      case 'results':
        return '/'; // Results page redirects to homepage
      case 'homepage':
      default:
        return '/';
    }
  };

  const handleSignup = () => {
    onClose();
    // Include preservePrompt flag and source-based returnUrl in URL
    const returnUrl = getReturnUrl();
    const url = preservePrompt 
      ? `/signup?returnUrl=${encodeURIComponent(returnUrl)}&preservePrompt=true` 
      : `/signup?returnUrl=${encodeURIComponent(returnUrl)}`;
    router.push(url);
  };

  const handleLogin = () => {
    onClose();
    // Include preservePrompt flag and source-based returnUrl in URL
    const returnUrl = getReturnUrl();
    const url = preservePrompt 
      ? `/login?returnUrl=${encodeURIComponent(returnUrl)}&preservePrompt=true` 
      : `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    router.push(url);
  };

  const handleViewPricing = () => {
    onClose();
    router.push('/pricing');
  };

  if (isSoftPrompt) {
    return (
      <Dialog open={internalOpen} onOpenChange={(open) => {
        if (!open) {
          // Allow closing from X button even in success state
          setShowSuccess(false);
          setInternalOpen(false);
          onClose();
        } else {
          setInternalOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => {
          // Prevent closing by clicking outside when showing form or success
          e.preventDefault();
        }}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center pr-8">
              <Sparkles className="mr-2 h-5 w-5 text-[#FF7043] flex-shrink-0" />
              Love your creation?
            </DialogTitle>
            <DialogDescription className="text-sm mt-2">
              Sign up for free and unlock more features!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-start space-x-3">
              <Gift className="h-5 w-5 text-[#FF7043] mt-0.5" />
              <div>
                <p className="font-medium">6 free credits on signup</p>
                <p className="text-sm text-gray-600">Create 3 SVGs or 6 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <History className="h-5 w-5 text-[#FF7043] mt-0.5" />
              <div>
                <p className="font-medium">Save your creations</p>
                <p className="text-sm text-gray-600">Access your designs anytime</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-[#FF7043] mt-0.5" />
              <div>
                <p className="font-medium">Track your credits</p>
                <p className="text-sm text-gray-600">See usage and remaining balance</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={handleSignup}
              className="w-full bg-[#FF7043] hover:bg-[#FF5722]"
            >
              Sign Up Free
            </Button>
            
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="w-full"
            >
              Already have an account? Log In
            </Button>
            
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render modal for authenticated free users
  if (isAuthenticated && !isSubscribed && !isSoftPrompt) {
    return null;
  }

  // Only show modal for unauthenticated users or soft prompts
  return (
    <Dialog open={internalOpen} onOpenChange={(open) => {
      if (!open) {
        // Allow closing from X button even in success state
        setShowSuccess(false);
        setInternalOpen(false);
        onClose();
      } else {
        setInternalOpen(open);
      }
    }}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => {
        // Always prevent closing by clicking outside
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-[#FF7043] pr-8">
            Continue generating for free!
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            Sign up to continue generating for free and get 6 bonus credits!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          {/* Inline sign-up form for new users */}
          <InlineSignupForm onClose={onClose} source={source} preservePrompt={preservePrompt} onSuccessChange={setShowSuccess} setInternalOpen={setInternalOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Inline signup form component for modal use
function InlineSignupForm({ onClose, source, preservePrompt, onSuccessChange, setInternalOpen }: { 
  onClose: () => void; 
  source: string;
  preservePrompt: boolean;
  onSuccessChange?: (success: boolean) => void;
  setInternalOpen?: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const getReturnUrl = () => {
    switch (source) {
      case 'icon-generator':
        return '/ai-icon-generator';
      case 'results':
        return '/';
      case 'homepage':
      default:
        return '/';
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    setError(null);
    setIsLoading(true);

    try {
      await signUp(email, password);
      // Set success state immediately
      setIsSuccess(true);
      // Notify parent component about success
      onSuccessChange?.(true);
      // Ensure modal stays open by setting internal state
      if (setInternalOpen) {
        setInternalOpen(true);
      }
      // Don't close modal - show success message instead
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const returnUrl = getReturnUrl();
      const redirectPath = preservePrompt 
        ? `${returnUrl}?preservePrompt=true`
        : returnUrl;
      await signInWithGoogle(redirectPath);
      onClose();
    } catch (error: any) {
      setError(error.message || "An error occurred with Google sign in");
    }
  };

  // Show success message if signup was successful
  if (isSuccess) {
    return (
      <div className="space-y-6" data-signup-form="true" data-success="true">
        <div className="text-center space-y-5">
          {/* Success icon with brand styling */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF7043]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF7043] to-[#FF5722] rounded-full flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
          </div>
          
          {/* Title with brand gradient */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#FF7043] to-[#FF5722] bg-clip-text text-transparent">
              Check your email
            </h3>
            <p className="text-sm text-gray-600 mt-2">We sent a verification link to</p>
          </div>
          
          {/* Email address with brand styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7043]/5 to-[#FF5722]/5 blur-md"></div>
            <div className="relative bg-white border border-[#FF7043]/20 rounded-xl px-5 py-3">
              <p className="text-sm font-semibold text-gray-900 break-all">
                {email}
              </p>
            </div>
          </div>
          
          {/* Instructions with enhanced credits badge */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Click the link to verify your email and receive
            </p>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7043] to-[#FF5722] blur opacity-30"></div>
              <div className="relative inline-flex items-center gap-2.5 bg-gradient-to-r from-[#FF7043] to-[#FF5722] text-white rounded-full px-5 py-2.5 shadow-lg">
                <Gift className="h-5 w-5" />
                <span className="text-sm font-bold">6 free credits</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <Button
          onClick={() => {
            setIsSuccess(false);
            onSuccessChange?.(false);
            if (setInternalOpen) {
              setInternalOpen(false);
            }
            onClose();
          }}
          className="w-full"
          variant="outline"
          type="button"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-signup-form="true" data-loading={isLoading ? "true" : "false"}>
      {error && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign In First */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Email Sign Up Form */}
      <form onSubmit={handleSignUp} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-9 text-sm"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up Free"}
        </Button>
      </form>

      {/* Terms and Privacy - Prominent */}
      <p className="text-xs text-center text-gray-500">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-gray-600 hover:text-gray-800 underline">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="text-gray-600 hover:text-gray-800 underline">
          Privacy Policy
        </Link>
      </p>

      {/* Login Link */}
      <div className="text-center pt-2 border-t">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose();
              const returnUrl = getReturnUrl();
              const url = preservePrompt 
                ? `/login?returnUrl=${encodeURIComponent(returnUrl)}&preservePrompt=true` 
                : `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
              router.push(url);
            }}
            className="text-[#FF7043] hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}