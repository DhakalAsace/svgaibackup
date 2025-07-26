'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Crown, TrendingUp, Zap, X, Clock, Palette, Download, Shield, Check } from "lucide-react";
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
  
  // If creditLimit doesn't match expected values for subscribers, this indicates a data issue
  // Expected: Starter=100, Pro=350 monthly credits
  const hasIncorrectLimit = isSubscribed && creditLimit !== adjustedCreditLimit;
  
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
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual for better value

  useEffect(() => {
    if (isOpen) {
      // UpgradeModal: isOpen=true, triggerDelay set
      const timer = setTimeout(() => {
        // UpgradeModal: setting showModal=true
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

  // UpgradeModal render - showModal and isOpen state tracked
  
  return (
    <Dialog open={showModal} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="w-screen h-screen sm:w-[90vw] sm:h-auto md:w-[560px] max-w-none sm:max-w-[90vw] md:max-w-[560px] p-0 overflow-hidden rounded-none sm:rounded-xl md:rounded-2xl left-0 top-0 translate-x-0 translate-y-0 sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] bg-white">
        <DialogHeader className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] p-4 sm:p-5 md:p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white/20 p-1.5 sm:p-2 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="sr-only">Close</span>
          </button>
          
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold pr-10 sm:pr-12 text-white text-center">
            {isOutOfCredits ? '💔 Out of Credits!' : '✨ Unlock More Creations'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 h-[calc(100vh-64px)] sm:h-auto sm:max-h-[70vh] overflow-y-auto">
          {/* Billing toggle - responsive */}
          <div className="flex justify-center mb-2">
            <div className="bg-gray-100 p-0.5 rounded-full inline-flex text-sm sm:text-base">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all ${
                  !isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all ${
                  isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Annual
                {isAnnual && (
                  <span className="ml-1 text-xs sm:text-sm text-green-600 font-semibold">SAVE 25%</span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing cards - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Starter Plan */}
            <button 
              onClick={handleUpgrade}
              className="relative p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-[#FF7043] transition-all hover:shadow-lg cursor-pointer group"
            >
              <div className="text-center">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Starter</h4>
                <div className="mb-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{isAnnual ? '$13.99' : '$19'}</span>
                  <span className="text-sm sm:text-base text-gray-500 ml-1">/month</span>
                </div>
                {isAnnual && <div className="text-xs sm:text-sm text-gray-600 mb-3">Billed annually</div>}
                <div className="bg-[#FF7043]/10 rounded-lg py-3 px-4 mb-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF7043]">100</div>
                  <div className="text-xs sm:text-sm text-gray-600">AI credits/month</div>
                </div>
              </div>
            </button>
            
            {/* Pro Plan */}
            <button 
              onClick={handleUpgrade}
              className="relative p-4 sm:p-5 bg-gradient-to-br from-[#FFF8F6] to-white rounded-xl border-2 border-[#FF7043] hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FF7043] text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
                BEST VALUE
              </div>
              <div className="text-center mt-2">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Pro</h4>
                <div className="mb-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{isAnnual ? '$29.99' : '$39'}</span>
                  <span className="text-sm sm:text-base text-gray-500 ml-1">/month</span>
                </div>
                {isAnnual && <div className="text-xs sm:text-sm text-gray-600 mb-3">Billed annually</div>}
                <div className="bg-[#FF7043]/10 rounded-lg py-3 px-4 mb-3">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF7043]">350</div>
                  <div className="text-xs sm:text-sm text-gray-600">AI credits/month</div>
                </div>
              </div>
            </button>
          </div>

          {/* Key benefits */}
          <div className="bg-[#FFF8F6] rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7043] flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">All styles unlocked</span> - 11 icon & 5 SVG styles
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7043] flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Monthly refresh</span> - Fresh credits every cycle
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7043] flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Cancel anytime</span> - Keep credits until period ends
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:shadow-lg font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-full transition-all hover:scale-105"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            {isOutOfCredits ? 'Get Credits Now' : 'Unlock More Credits'}
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            Secure checkout • Instant activation • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}