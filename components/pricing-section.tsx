'use client';
import { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, Loader2, ChevronDown, ChevronUp, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@/lib/supabase';
import Link from 'next/link';
interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: React.ReactNode[];
  cta: string;
  highlighted: boolean;
  tier?: 'starter' | 'pro';
}
export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual
  const [showCancelDetails, setShowCancelDetails] = useState(false);
  const [showCreditTooltip, setShowCreditTooltip] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle click outside to close tooltips
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-tooltip-trigger]') && !target.closest('[data-tooltip-content]')) {
        setShowCreditTooltip(null);
        setShowCancelDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getPlans = (annual: boolean): PricingTier[] => [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI tools",
      features: [
        "6 one-time credits on signup",
        <span key="free-icons">Create 3 SVGs or 6 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></span>,
        "All 11 icon styles & 5 SVG styles",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Starter",
      price: annual ? "$13.99" : "$19",
      period: annual ? "/mo*" : "/month", 
      description: "For individuals and small projects",
      tier: 'starter',
      features: [
        <div key="starter-credits" className="relative">
          <button
            onClick={() => setShowCreditTooltip(showCreditTooltip === 'starter' ? null : 'starter')}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors text-left"
            data-tooltip-trigger
          >
            <span>100 credits per month</span>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {showCreditTooltip === 'starter' && (
            <div 
              className="absolute top-full left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-1 z-10"
              data-tooltip-content
            >
              <p className="text-xs text-gray-600">
                100 credits allows you to create 50 SVGs or 100 <Link href="/ai-icon-generator" className="underline text-[#FF7043]" target="_blank" rel="noopener noreferrer">icons</Link> per month. Credits reset monthly.
              </p>
            </div>
          )}
        </div>,
        "7-day generation history",
        "Email support",
        "All 11 icon styles & 5 SVG styles",
      ],
      cta: "Subscribe Now",
      highlighted: false,
    },
    {
      name: "Pro",
      price: annual ? "$29.99" : "$39",
      period: annual ? "/mo*" : "/month",
      description: "For professionals and businesses",
      tier: 'pro',
      features: [
        <div key="pro-credits" className="relative">
          <button
            onClick={() => setShowCreditTooltip(showCreditTooltip === 'pro' ? null : 'pro')}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors text-left"
            data-tooltip-trigger
          >
            <span>350 credits per month</span>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {showCreditTooltip === 'pro' && (
            <div 
              className="absolute top-full left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-1 z-10"
              data-tooltip-content
            >
              <p className="text-xs text-gray-600">
                350 credits allows you to create 175 SVGs or 350 <Link href="/ai-icon-generator" className="underline text-[#FF7043]" target="_blank" rel="noopener noreferrer">icons</Link> per month. Credits reset monthly.
              </p>
            </div>
          )}
        </div>,
        "30-day extended history",
        "Priority email support",
        "All 11 icon styles & 5 SVG styles",
      ],
      cta: "Subscribe Now",
      highlighted: true,
    },
  ];
  const handleSubscribe = async (tier?: 'starter' | 'pro') => {
    const interval = isAnnual ? 'annual' : 'monthly';
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=/pricing&plan=${tier || 'free'}`);
      return;
    }
    if (!tier) {
      // Free plan - just redirect to dashboard
      router.push('/dashboard');
      return;
    }
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
        
        // If the server indicates the user already has a subscription, send them to the portal/dashboard
        if (data.portal) {
          toast({
            title: 'You already have an active subscription',
            description: 'Redirecting to manage your existing plan…',
          });
          // Small delay so the toast is visible
          setTimeout(() => router.push('/dashboard'), 1500);
          setLoading(null);
          return;
        }
        
        // Only log error if it's not a subscription conflict
        console.error('Checkout session failed:', { status: response.status, data });
        
        // Show the actual error to help debug
        toast({
          title: "Checkout Error",
          description: data.error || `Failed to create checkout session (Status: ${response.status})`,
          variant: "destructive",
        });
        setLoading(null);
        return;
      }
      const { url } = await response.json();
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
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
  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  !isAnnual 
                    ? 'bg-[#FF7043] text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  isAnnual 
                    ? 'bg-[#FF7043] text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Annual
                <span className={`text-xs ${isAnnual ? 'text-white/90' : 'text-green-600'}`}>Save 3 months</span>
              </button>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6">
            {/* Cancel Anytime - Expandable */}
            <div className="relative">
              <button
                onClick={() => setShowCancelDetails(!showCancelDetails)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                data-tooltip-trigger
              >
                <span className="text-sm">Cancel anytime</span>
                {showCancelDetails ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              {showCancelDetails && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-white rounded-lg shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-1 z-10"
                  data-tooltip-content
                >
                  <p className="text-xs text-gray-600">
                    Cancel future billing anytime. Keep using your credits for the entire paid period.
                  </p>
                </div>
              )}
            </div>
            
            {/* Secure Payment */}
            <div className="flex items-center gap-1 text-gray-500">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-sm">Secure payment</span>
            </div>
          </div>
        </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {getPlans(isAnnual).map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.highlighted ? 'border-[#FF7043] shadow-lg scale-105' : ''}`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7043]">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                {isAnnual && plan.tier && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Billed {plan.tier === 'starter' ? '$168' : '$360'} today
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.highlighted ? 'bg-[#FF7043] hover:bg-[#FF5722]' : ''}`}
                onClick={() => handleSubscribe(plan.tier)}
                disabled={loading !== null}
              >
                {loading === plan.tier ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : plan.highlighted ? (
                  <Sparkles className="mr-2 h-4 w-4" />
                ) : null}
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}