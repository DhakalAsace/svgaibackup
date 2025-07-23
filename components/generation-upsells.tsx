'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Crown, TrendingUp, Zap, X, Clock, Palette, Download, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GenerationUpsellProps {
  creditsUsed: number;
  creditLimit: number;
  isSubscribed: boolean;
  limitType?: 'daily' | 'monthly' | 'lifetime';
  tier?: string | null;
}

export function GenerationUpsell({ 
  creditsUsed, 
  creditLimit, 
  isSubscribed,
  limitType = 'lifetime',
  tier
}: GenerationUpsellProps) {
  // Safeguard: For subscribed users, ensure we're showing monthly credits, not lifetime
  // Starter plan should have 100 credits, Pro should have 350
  const adjustedCreditLimit = isSubscribed 
    ? (tier === 'pro' ? 350 : 100) 
    : creditLimit;
  
  // If creditLimit doesn't match expected values for subscribers, log a warning
  if (isSubscribed && creditLimit !== adjustedCreditLimit) {
    console.warn('GenerationUpsell: Incorrect credit limit for subscribed user', {
      tier,
      receivedLimit: creditLimit,
      expectedLimit: adjustedCreditLimit,
      creditsUsed
    });
  }
  
  const percentage = adjustedCreditLimit > 0 ? (creditsUsed / adjustedCreditLimit) * 100 : 100;
  const remaining = Math.max(0, adjustedCreditLimit - creditsUsed);
  
  if (isSubscribed) {
    return (
      <Card className="p-4 bg-gradient-to-r from-[#FFF8F6] to-white border-[#FFE0B2]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {tier === 'pro' ? (
              <Crown className="w-5 h-5 text-[#FF7043] mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#FF7043] mr-2" />
            )}
            <span className="font-medium text-sm">
              {tier === 'pro' ? 'Pro' : 'Starter'} Plan
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {remaining} credits left
          </span>
        </div>
        <Progress value={percentage} className="h-2 mb-2" />
        <p className="text-xs text-gray-600">
          {creditsUsed} of {adjustedCreditLimit} credits used this month
        </p>
        {percentage > 80 && tier !== 'pro' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm mb-2">Running low on credits?</p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/pricing">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade to Pro (350 credits/month)
              </Link>
            </Button>
          </div>
        )}
      </Card>
    );
  }
  
  // Free user with lifetime credits
  if (limitType === 'lifetime') {
    return (
      <Card className="p-4 bg-gradient-to-r from-white to-[#FFF8F6] border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-sm">Free Account</span>
          <span className="text-sm text-gray-600">
            {remaining} lifetime credits left
          </span>
        </div>
        <Progress value={percentage} className="h-2 mb-3" />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            {creditsUsed} of {creditLimit} one-time credits used
          </p>
          
          {remaining === 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-[#FF7043] mr-2" />
                <p className="text-sm font-medium text-gray-900">
                  No credits remaining
                </p>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Subscribe to get monthly credits that refresh automatically
              </p>
              <Button size="sm" className="w-full bg-[#FF7043] hover:bg-[#FF5722] font-medium" asChild>
                <Link href="/pricing">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Get More Credits
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }
  
  // Default return - should not reach here
  return null;
}

// Loading state message component
export function GenerationLoadingMessage({ modelType }: { modelType: 'svg' | 'icon' }) {
  const [message, setMessage] = useState('');
  
  // Select a random message on client side only
  useEffect(() => {
    const messages = {
      svg: [
        "🏆 Creating with #1 rated AI design technology...",
        "✨ Generating with highest quality model...",
        "🎯 72% better quality than alternatives...",
        "📐 Creating infinitely scalable graphics...",
      ],
      icon: [
        "⚡ Crafting with 20 billion parameter AI...",
        "🎨 Designed specifically for icons...",
        "✓ Creating perfectly scalable vectors...",
        "💎 Professional icon generation in progress...",
      ]
    };
    
    const randomMessage = messages[modelType][Math.floor(Math.random() * messages[modelType].length)];
    setMessage(randomMessage);
  }, [modelType]);
  
  return (
    <div className="text-center text-sm text-gray-600 animate-pulse">
      {message || "Creating your design..."}
    </div>
  );
}

// Upgrade modal for showing after 3 free generations
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerDelay?: number; // Delay in ms before showing modal
  generationType?: "svg" | "icon";
  /**
   * When true, the user has no credits remaining and we should show the
   * red "out of credits" warning.  When false (default) we simply present a
   * generic upgrade encouragement.
   */
  isOutOfCredits?: boolean;
}

export function UpgradeModal({ isOpen, onClose, triggerDelay = 5000, generationType = "svg", isOutOfCredits = false }: UpgradeModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, triggerDelay);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isOpen, triggerDelay]);

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-xs sm:max-w-[400px] p-0 overflow-hidden">
        <DialogHeader className="bg-white border-b border-gray-100 p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Close</span>
          </button>
          
          <DialogTitle className="text-xl font-semibold pr-6 text-gray-900">
            Upgrade to Continue Creating
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Get monthly credits that refresh automatically
          </p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Warning only shown when the user is truly out of credits */}
          {isOutOfCredits && (
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-[#FF7043] mr-2" />
                <p className="text-sm font-medium text-gray-900">
                  No credits remaining
                </p>
              </div>
              <p className="text-xs text-gray-600">
                Subscribe to get monthly credits that refresh automatically
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Plan</h3>
              <p className="text-sm text-gray-600">Get monthly credits that refresh automatically</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">$19</div>
                <div className="text-sm font-medium text-gray-800 mt-1">Starter</div>
                <div className="text-xs text-gray-600 mt-1">100 credits/month</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#FFF8F6] to-white rounded-lg border-2 border-[#FF7043] relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#FF7043] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  POPULAR
                </div>
                <div className="text-2xl font-bold text-gray-900">$39</div>
                <div className="text-sm font-medium text-gray-800 mt-1">Pro</div>
                <div className="text-xs text-gray-600 mt-1">350 credits/month</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FF7043] rounded-full mr-3"></div>
                  <span className="text-gray-700">All 11 icon styles & 5 SVG styles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FF7043] rounded-full mr-3"></div>
                  <span className="text-gray-700">Credits refresh monthly</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FF7043] rounded-full mr-3"></div>
                  <span className="text-gray-700">Extended generation history</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FF7043] rounded-full mr-3"></div>
                  <span className="text-gray-700">Priority email support</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:shadow-md font-medium py-3"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get More Credits
          </Button>

          <p className="text-center text-xs text-gray-500">
            Cancel anytime • Secure checkout via Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}