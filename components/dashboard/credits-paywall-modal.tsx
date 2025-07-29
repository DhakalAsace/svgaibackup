"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";

interface CreditsPaywallModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function CreditsPaywallModal({ isOpen, onClose }: CreditsPaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleClose = () => {
    onClose?.();
  };

  const handleSubscribe = async (tier: 'starter' | 'pro') => {
    const interval = isAnnual ? 'annual' : 'monthly';
    setLoading(tier);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier, interval }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? "$13.99" : "$19",
      period: isAnnual ? "/mo*" : "/month",
      yearlyBilling: isAnnual ? "Billed $168 today" : null,
      credits: "100 credits/month",
      features: [
        "Create 50 SVGs or 100 icons",
        "All 11 icon styles",
        "All 5 SVG styles",
        "7-day history",
        "Email support"
      ],
      tier: 'starter' as const,
      savings: isAnnual ? "3 months FREE vs monthly" : null
    },
    {
      name: "Pro",
      price: isAnnual ? "$29.99" : "$39",
      period: isAnnual ? "/mo*" : "/month",
      yearlyBilling: isAnnual ? "Billed $360 today" : null,
      credits: "350 credits/month",
      features: [
        "Create 175 SVGs or 350 icons",
        "All 11 icon styles",
        "All 5 SVG styles",
        "30-day history",
        "Priority support"
      ],
      tier: 'pro' as const,
      highlighted: true,
      savings: isAnnual ? "3 months FREE vs monthly" : null
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-4xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              You're Out of Credits!
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm sm:text-base">
              Upgrade to continue creating amazing AI-generated designs
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  !isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annual
                <span className="ml-1.5 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                  3 months FREE
                </span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative p-4 sm:p-6 ${plan.highlighted ? 'border-[#FF7043] shadow-lg' : ''}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7043] text-xs sm:text-sm">
                    Most Popular
                  </Badge>
                )}
                
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm sm:text-base text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  {plan.yearlyBilling && (
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.yearlyBilling}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs sm:text-sm font-medium text-[#FF7043]">
                      {plan.credits}
                    </p>
                    {plan.savings && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-4 sm:mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading !== null}
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:from-[#FF6034] hover:to-[#FF9716] text-white'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {loading === plan.tier ? 'Processing...' : 'Get Started'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}