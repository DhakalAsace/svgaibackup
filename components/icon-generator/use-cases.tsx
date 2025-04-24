export default function IconUseCases() {
  const useCases = [
    {
      title: "App Design & Development",
      icon: "💻",
      description: "Our AI icon generator creates custom icon sets for mobile apps and web applications with consistent style and professional branding."
    },
    {
      title: "UI/UX Interface Elements",
      icon: "🖱️",
      description: "Generate beautiful UI/UX icons for buttons, navigation menus, and interface elements that enhance user experience and engagement."
    },
    {
      title: "Design Systems & Libraries",
      icon: "🎨",
      description: "Build robust design systems with scalable icon libraries created by our AI icon maker that maintain visual consistency across platforms."
    },
    {
      title: "Business Presentations",
      icon: "📊",
      description: "Enhance business slide decks and presentations with professional AI-generated icons that clearly illustrate concepts and data points."
    },
    {
      title: "Website & Brand Development",
      icon: "🌐",
      description: "Improve website visual communication with custom vector icons that reinforce your brand message and enhance user navigation."
    },
    {
      title: "Technical Documentation",
      icon: "📝",
      description: "Make technical documentation more accessible with AI-generated icons that help users understand complex processes and workflows."
    }
  ]

  return (
    <section className="py-16 bg-white" id="use-cases">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-3">How to Use Our AI Icon Generator</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our AI-generated SVG icons are perfect for various professional applications across digital products, marketing materials, and print media. Here's how designers and developers are using our icon generator:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">{useCase.title}</h3>
              <p className="text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}