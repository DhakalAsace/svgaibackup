"use client"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@/lib/supabase'
export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const plans = [
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
      cta: "Start Creating Free",
      highlighted: false,
      showBillingToggle: false,
    },
    {
      name: "Starter",
      price: { monthly: "$19", annual: "$189" },
      period: { monthly: "per month", annual: "per year" },
      savings: "Save $39/year",
      description: "For individuals and small projects",
      features: [
        "100 credits per month",
        <span key="starter-icons">Create 50 SVGs or 100 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></span>,
        "7-day generation history",
        "Email support",
        "All 11 icon styles & 5 SVG styles",
      ],
      cta: "Subscribe Now",
      highlighted: false,
      tier: 'starter' as const,
      showBillingToggle: true,
    },
    {
      name: "Pro",
      price: { monthly: "$39", annual: "$389" },
      period: { monthly: "per month", annual: "per year" },
      savings: "Save $79/year",
      description: "For professionals and businesses",
      features: [
        "350 credits per month",
        <span key="pro-icons">Create 175 SVGs or 350 <Link href="/ai-icon-generator" className="underline" target="_blank" rel="noopener noreferrer">icons</Link></span>,
        "30-day extended history",
        "Priority email support",
        "All 11 icon styles & 5 SVG styles",
      ],
      cta: "Subscribe Now",
      highlighted: true,
      tier: 'pro' as const,
      showBillingToggle: true,
    },
  ]
  const handleSubscribe = async (tier?: 'starter' | 'pro') => {
    const interval = billingInterval === 'annual' ? 'annual' : 'monthly';
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
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 text-[#FF7043]">
            Pricing Plans
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the right text to SVG AI plan for your creative needs. Start free, upgrade when you need more.
          </p>
        </div>
        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-[#00B894]">Save 17%</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={`${plan.name}-${billingInterval}-${index}`}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border flex flex-col ${
                plan.highlighted ? "border-[#FF7043] shadow-lg scale-105" : "border-gray-200/80 hover:shadow-md transition-shadow duration-300"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-[#FF7043] text-white text-center py-2 text-sm font-medium">Most Popular</div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">
                      {plan.showBillingToggle && typeof plan.price === 'object' 
                        ? plan.price[billingInterval] 
                        : plan.price as string}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{plan.showBillingToggle && typeof plan.period === 'object' 
                        ? plan.period[billingInterval] 
                        : plan.period as string}
                    </span>
                  </div>
                  {plan.showBillingToggle && billingInterval === 'annual' && plan.savings && (
                    <p className="text-sm text-[#00B894] mt-1">{plan.savings}</p>
                  )}
                </div>
                <p className="text-gray-600 mb-6 text-sm flex-grow">{plan.description}</p>
                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90 transition-opacity"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  }`}
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading !== null}
                >
                  {loading === plan.tier ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-[#00B894] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-600 mb-3">Need a custom plan for your enterprise?</p>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            Contact Our Sales Team
          </Button>
        </div>
      </div>
    </section>
  )
}
