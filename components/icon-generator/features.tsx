import { Check } from "lucide-react"

export default function IconFeatures() {
  const features = [
    {
      title: "Advanced AI Generation",
      description: "Our AI icon generator uses cutting-edge technology for exceptionally high-quality icons with clean, professional vector paths."
    },
    {
      title: "Multiple Icon Styles",
      description: "Choose from 11 different icon styles including outline, colored shapes, gradient, broken line, and more to perfectly match your design requirements."
    },
    {
      title: "Design System Compatible",
      description: "Create consistent icon sets that integrate seamlessly into design systems and component libraries with our AI icon maker."
    },
    {
      title: "Mobile & Web Optimization",
      description: "Generate icons specifically optimized for both mobile interfaces and web applications with appropriate sizing and detail levels."
    },
    {
      title: "Commercial Usage Rights",
      description: "Full commercial usage rights for all AI-generated icons - use them in apps, websites, marketing materials, and print media with confidence."
    },
    {
      title: "Professional SVG Format",
      description: "Our icon generator AI produces optimized SVG files with clean paths ready for implementation in any digital product or platform."
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="features">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-3">AI Icon Generator Features</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our professional AI icon generator delivers high-quality vector graphics with advanced features that help designers, developers, and businesses create perfect icons for any project.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}