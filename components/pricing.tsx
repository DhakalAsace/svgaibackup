import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI SVG generator",
      features: [
        "5 SVG generations per day",
        "Basic style customization",
        "Standard resolution exports",
        "SVG and PNG downloads",
        "Community support",
      ],
      cta: "Start Creating Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "For designers and creative professionals",
      features: [
        "Unlimited AI SVG generations",
        "Advanced style controls",
        "High-resolution exports",
        "All file formats (SVG, PNG, JSX)",
        "Remove background",
        "Priority support",
        "Save generation history",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      description: "For design teams and agencies",
      features: [
        "Everything in Pro",
        "5 team members",
        "Team workspace",
        "Shared asset library",
        "Brand kit integration",
        "API access",
        "Dedicated support",
        "Admin controls",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 text-[#FF7043]">
            Pricing Plans
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Flexible Pricing for Our AI SVG Generator
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the right text to SVG AI plan for your creative needs, from casual use to professional design teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border flex flex-col ${
                plan.highlighted ? "border-[#0084FF] shadow-lg" : "border-gray-200/80 hover:shadow-md transition-shadow duration-300"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-[#0084FF] text-gray-900 text-center py-2 text-sm font-medium">Most Popular</div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm flex-grow">{plan.description}</p>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90 transition-opacity"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  }`}
                >
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
