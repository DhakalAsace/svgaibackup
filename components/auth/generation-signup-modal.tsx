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

interface GenerationSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsUsed: number;
  isSoftPrompt?: boolean;
  onContinueAsGuest?: () => void;
  isAuthenticated?: boolean;
  isSubscribed?: boolean;
  preservePrompt?: boolean; // NEW PROP
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
}: GenerationSignupModalProps) {
  const router = useRouter();

  const handleSignup = () => {
    onClose();
    // Include preservePrompt flag in URL
    const url = preservePrompt 
      ? '/signup?returnUrl=/&preservePrompt=true' 
      : '/signup?returnUrl=/';
    router.push(url);
  };

  const handleLogin = () => {
    onClose();
    // Include preservePrompt flag in URL
    const url = preservePrompt 
      ? '/login?returnUrl=/&preservePrompt=true' 
      : '/login?returnUrl=/';
    router.push(url);
  };

  const handleViewPricing = () => {
    onClose();
    router.push('/pricing');
  };

  if (isSoftPrompt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-[#FF7043]" />
              Love your creation?
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
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
    : "Create & save your designs";
  const description = isAuthenticatedFreeUser
    ? "You've used all 6 of your free credits. Subscribe for monthly credits!"
    : "Sign up or log in to continue generating awesome SVGs.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#FF7043]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {/* For unauthenticated users we skip free trial & upgrade copy */}
        {isAuthenticatedFreeUser && (
          <div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] p-4 rounded-lg text-white">
            <p className="font-medium mb-2">Want more? Pro plans include:</p>
            <ul className="space-y-1 text-sm">
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
            // Inline sign-up form with Google auth for new users
            <SignUpForm />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}