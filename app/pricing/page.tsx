import { Metadata } from 'next';
import PricingSection from '@/components/pricing-section';

export const metadata: Metadata = {
  title: 'SVG AI Pricing - Affordable AI SVG Generator Plans Starting Free',
  description: 'Compare SVG AI pricing plans: Free forever tier, Starter $12/month, Pro $29/month. Transparent pricing for AI SVG generation with no hidden fees. Start free today!',
  keywords: [
    'svg ai pricing', 
    'ai svg generator cost', 
    'svg generation plans', 
    'ai icon generator pricing',
    'svg tool subscription',
    'free vs paid svg tools',
    'best svg ai plans',
    'svg generation pricing',
    'ai svg creator cost',
    'svg maker pricing',
    'vector ai pricing',
    'affordable svg ai',
    'svg ai subscription cost',
    'ai vector generator pricing'
  ],
  alternates: {
    canonical: '/pricing'
  },
  openGraph: {
    title: 'SVG AI Pricing - Start Free, Upgrade When You Need More',
    description: 'Transparent pricing for AI-powered SVG generation. Free tier with 6 credits, Starter $12/month, Pro $29/month. Compare plans and start free.',
    url: '/pricing',
    images: [
      {
        url: '/pricing-social.jpg',
        width: 1200,
        height: 630,
        alt: 'SVG AI Pricing Plans - Free, Starter, and Pro tiers'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG AI Pricing - Start Free, Upgrade When You Need More',
    description: 'Transparent pricing for AI-powered SVG generation. Free tier with 6 credits, Starter $12/month, Pro $29/month.',
    images: ['/pricing-social.jpg']
  }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Simple, Transparent <span className="text-[#FF7043]">Pricing</span>
          </h1>
          <p className="text-lg text-gray-600">
            Start free. Upgrade when you need more credits.
          </p>
        </div>
        
        <PricingSection />
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Pricing FAQs - Everything You Need to Know</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">How much does SVG AI cost?</h3>
              <p className="text-gray-600">SVG AI offers transparent pricing with a free forever plan (6 credits), Starter plan at $12/month (100 credits), and Pro plan at $29/month (350 credits). Annual billing saves up to 17%.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Is there a free SVG AI plan?</h3>
              <p className="text-gray-600">Yes! Our free plan includes 6 one-time credits to create up to 3 SVGs or 6 icons. Perfect for testing our AI SVG generator before upgrading.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">What's the difference between Starter and Pro pricing?</h3>
              <p className="text-gray-600">Starter ($12/month) includes 100 credits and 7-day history. Pro ($29/month) includes 350 credits, 30-day history, and priority support. Both include all 11 icon styles and 5 SVG styles.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes! You can cancel your plan at any time. Cancellation takes effect at the end of your current billing period. Any unused credits will be forfeited.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Do unused AI generation credits roll over?</h3>
              <p className="text-gray-600">No, unused credits don't roll over to the next month. Your credit limit resets at the start of each billing cycle to ensure fair usage.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. No PayPal currently.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Is SVG AI pricing worth it compared to competitors?</h3>
              <p className="text-gray-600">SVG AI offers the best value with transparent pricing, no hidden fees, 11 icon styles, 5 SVG styles, and both monthly/annual options. Most competitors charge more for fewer features.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Can I cancel my SVG AI subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel anytime with no cancellation fees. You'll retain access to your plan features until the end of your current billing period.</p>
            </div>
          </div>
        </div>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "SVG AI",
              "description": "AI-powered SVG and icon generation tool with transparent pricing",
              "brand": {
                "@type": "Brand",
                "name": "SVG AI"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "description": "Perfect for trying out our AI tools",
                  "price": "0",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "0",
                    "priceCurrency": "USD",
                    "billingIncrement": "forever"
                  },
                  "availability": "https://schema.org/InStock",
                  "validFrom": "2024-01-01",
                  "seller": {
                    "@type": "Organization",
                    "name": "SVG AI"
                  }
                },
                {
                  "@type": "Offer",
                  "name": "Starter Plan",
                  "description": "For individuals and small projects",
                  "price": "12",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "12",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1M"
                  },
                  "availability": "https://schema.org/InStock",
                  "validFrom": "2024-01-01",
                  "seller": {
                    "@type": "Organization",
                    "name": "SVG AI"
                  }
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "description": "For professionals and businesses",
                  "price": "29",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "29",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1M"
                  },
                  "availability": "https://schema.org/InStock",
                  "validFrom": "2024-01-01",
                  "seller": {
                    "@type": "Organization",
                    "name": "SVG AI"
                  }
                },
                {
                  "@type": "Offer",
                  "name": "Starter Annual Plan",
                  "description": "For individuals and small projects - Annual billing",
                  "price": "119",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "119",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1Y"
                  },
                  "availability": "https://schema.org/InStock",
                  "validFrom": "2024-01-01",
                  "seller": {
                    "@type": "Organization",
                    "name": "SVG AI"
                  }
                },
                {
                  "@type": "Offer",
                  "name": "Pro Annual Plan",
                  "description": "For professionals and businesses - Annual billing",
                  "price": "289",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "289",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1Y"
                  },
                  "availability": "https://schema.org/InStock",
                  "validFrom": "2024-01-01",
                  "seller": {
                    "@type": "Organization",
                    "name": "SVG AI"
                  }
                }
              ]
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does SVG AI cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SVG AI offers transparent pricing with a free forever plan (6 credits), Starter plan at $12/month (100 credits), and Pro plan at $29/month (350 credits). Annual billing saves up to 17%."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a free SVG AI plan?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our free plan includes 6 one-time credits to create up to 3 SVGs or 6 icons. Perfect for testing our AI SVG generator before upgrading."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's the difference between Starter and Pro pricing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Starter ($12/month) includes 100 credits and 7-day history. Pro ($29/month) includes 350 credits, 30-day history, and priority support. Both include all 11 icon styles and 5 SVG styles."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I change plans anytime?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can cancel your plan at any time. Cancellation takes effect at the end of your current billing period. Any unused credits will be forfeited."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do unused AI generation credits roll over?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, unused credits don't roll over to the next month. Your credit limit resets at the start of each billing cycle to ensure fair usage."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What payment methods do you accept?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. No PayPal currently."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is SVG AI pricing worth it compared to competitors?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SVG AI offers the best value with transparent pricing, no hidden fees, 11 icon styles, 5 SVG styles, and both monthly/annual options. Most competitors charge more for fewer features."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I cancel my SVG AI subscription anytime?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can cancel anytime with no cancellation fees. You'll retain access to your plan features until the end of your current billing period."
                  }
                }
              ]
            })
          }}
        />
      </div>
    </div>
  );
}