import { Zap, Download, Palette, Code, Layers, Share2, Lock, Sparkles, Play } from "lucide-react"
import Link from "next/link"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  isNew?: boolean
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: <Zap className="h-6 w-6 text-[#0084FF]" />,
      title: "Instant SVG Generation",
      description:
        "Our AI SVG generator transforms text descriptions into professional vector graphics in seconds with advanced AI technology.",
    },
    {
      icon: <Play className="h-6 w-6 text-[#0084FF]" />,
      title: "Free SVG Animation Tool",
      description:
        "Transform static SVGs into dynamic animations with our visual editor. No coding required!",
      link: "/animate",
      linkText: "Try Animation Tool",
      isNew: true,
    },
    {
      icon: <Download className="h-6 w-6 text-[#0084FF]" />,
      title: "Multiple Export Options",
      description:
        "Download your creations in SVG, PNG, or as React JSX components with a single click for immediate use.",
    },
    {
      icon: <Palette className="h-6 w-6 text-[#0084FF]" />,
      title: "Customizable Styles",
      description:
        "Fine-tune colors, sizes, and styles to match your brand or project requirements with intuitive controls.",
    },
    {
      icon: <Code className="h-6 w-6 text-[#0084FF]" />,
      title: "Optimized SVG Code",
      description: "Get clean, production-ready SVG code that's optimized for web performance and scalability.",
    },
    {
      icon: <Layers className="h-6 w-6 text-[#0084FF]" />,
      title: "Design Variations",
      description:
        "Generate multiple versions of your idea to explore different design directions with our text to SVG AI.",
    },
    {
      icon: <Share2 className="h-6 w-6 text-[#0084FF]" />,
      title: "Easy Sharing",
      description:
        "Share your SVG creations directly or save them to your collection for future projects and collaboration.",
    },
    {
      icon: <Lock className="h-6 w-6 text-[#0084FF]" />,
      title: "Free AI SVG Generator",
      description:
        "Start creating immediately with our free tier - no account needed for basic usage of our SVG generator AI.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#0084FF]" />,
      title: "AI-Powered Precision",
      description:
        "Our AI SVG generator understands your text descriptions to create precise, beautiful vector graphics with remarkable accuracy.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 text-[#FF7043]">
            Core Features
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Powerful Features of Our Text to SVG AI Generator
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Leverage our advanced AI SVG generator to effortlessly turn text descriptions into high-quality vector graphics. Perfect for logos, icons, and illustrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col relative"
            >
              {feature.isNew && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
              <div className="rounded-full bg-[#0084FF]/10 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#2D3436] mb-2">{feature.title}</h3>
              <p className="text-[#2D3436]/70 flex-grow">{feature.description}</p>
              {feature.link && (
                <Link
                  href={feature.link}
                  className="mt-4 inline-flex items-center text-[#0084FF] hover:text-[#0066CC] font-medium text-sm"
                >
                  {feature.linkText}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
