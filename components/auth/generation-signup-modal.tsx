'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, History, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { useState } from "react";
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center">
              <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-[#FF7043]" />
              Love your creation?
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base mt-2">
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

  // Hard prompt for users who hit their limit
  const isAuthenticatedFreeUser = isAuthenticated && !isSubscribed;
  
  // Determine modal content based on authentication status
  const title = isAuthenticatedFreeUser
    ? "Monthly limit reached!"
    : "Continue generating for free!";
  const description = isAuthenticatedFreeUser
    ? "You've used all 6 of your free credits. Subscribe for monthly credits!"
    : "Sign up to continue generating for free and get 6 bonus credits!";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-[#FF7043]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {/* For unauthenticated users we skip free trial & upgrade copy */}
        {isAuthenticatedFreeUser && (
          <div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] p-3 sm:p-4 rounded-lg text-white">
            <p className="font-medium mb-2 text-sm sm:text-base">Want more? Pro plans include:</p>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>• 100-350 credits per month</li>
              <li>• Credits refresh monthly</li>
              <li>• All styles & formats</li>
              <li>• Extended 30-day history (Pro)</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col gap-3 mt-6">
          {isAuthenticated ? (
            // For authenticated users, only show upgrade options
            <>
              <Button 
                onClick={handleViewPricing}
                className="w-full bg-[#FF7043] hover:bg-[#FF5722]"
              >
                Upgrade to Pro
              </Button>
              
              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Maybe Later
              </Button>
            </>
          ) : (
            // Inline sign-up form for new users
            <InlineSignupForm onClose={onClose} source={source} preservePrompt={preservePrompt} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Inline signup form component for modal use
function InlineSignupForm({ onClose, source, preservePrompt }: { 
  onClose: () => void; 
  source: string;
  preservePrompt: boolean;
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
    setError(null);
    setIsLoading(true);

    try {
      await signUp(email, password);
      setIsSuccess(true);
      onClose();
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

  return (
    <div className="space-y-4">
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