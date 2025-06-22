import { Metadata } from 'next';
import PricingSection from '@/components/pricing-section';

export const metadata: Metadata = {
  title: 'Pricing - Affordable AI SVG Generation Plans | SVG AI',
  description: 'Choose the perfect plan for your AI SVG generation needs. Free tier available, Pro plans starting at $12/month. No hidden fees.',
  keywords: ['svg ai pricing', 'ai svg generator cost', 'svg generation plans', 'ai icon generator pricing'],
  alternates: {
    canonical: '/pricing'
  },
  openGraph: {
    title: 'SVG AI Pricing - Start Free, Upgrade Anytime',
    description: 'Transparent pricing for AI-powered SVG generation. Free tier included.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-[#FF7043]">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <PricingSection />
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">What happens if I hit my monthly limit?</h3>
              <p className="text-gray-600">You'll be notified when you're close to your limit. You can upgrade your plan or wait for the next billing cycle.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Do unused generations roll over?</h3>
              <p className="text-gray-600">No, unused generations don't roll over to the next month. Your limit resets at the start of each billing cycle.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards through our secure payment processor, Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}