'use client';

import { useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  generations: string;
}

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const getPlans = (annual: boolean): PricingTier[] => [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI tools",
      generations: "6 one-time credits",
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
      price: annual ? "$119" : "$12",
      period: annual ? "per year" : "per month",
      description: "For individuals and small projects",
      generations: "100 credits per month",
      tier: 'starter',
      features: [
        "100 credits per month",
        <span key="starter-icons">Create 50 SVGs or 100 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></span>,
        "7-day generation history",
        "Email support",
        "All 11 icon styles & 5 SVG styles",
        ...(annual ? [<span key="starter-save" className="text-green-600 font-medium">Save $25/year</span>] : []),
      ],
      cta: "Subscribe Now",
      highlighted: false,
    },
    {
      name: "Pro",
      price: annual ? "$289" : "$29",
      period: annual ? "per year" : "per month",
      description: "For professionals and businesses",
      generations: "350 credits per month",
      tier: 'pro',
      features: [
        "350 credits per month",
        <span key="pro-icons">Create 175 SVGs or 350 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></span>,
        "30-day extended history",
        "Priority email support",
        "All 11 icon styles & 5 SVG styles",
        ...(annual ? [<span key="pro-save" className="text-green-600 font-medium">Save $59/year</span>] : []),
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
        // If the server indicates the user already has a subscription, send them to the portal/ dashboard
        if (data.portal) {
          toast({
            title: 'You already have an active subscription',
            description: 'Redirecting to manage your existing plan…',
          });
          // Small delay so the toast is visible
          setTimeout(() => router.push('/dashboard'), 1500);
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
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
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isAnnual 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAnnual 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annual
            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Save up to 17%
            </span>
          </button>
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
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-sm font-medium text-[#FF7043] mt-2">
                {plan.generations}
              </p>
              {isAnnual && plan.tier && (
                <p className="text-xs text-gray-500 mt-1">
                  Billed annually • credits refresh monthly
                </p>
              )}
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
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