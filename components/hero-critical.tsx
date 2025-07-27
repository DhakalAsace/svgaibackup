// Critical hero component for faster initial render
export function HeroCritical() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-16 lg:py-24 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight text-gray-900">
            AI SVG Generator: Effortless Text to SVG Conversion
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Create stunning vector graphics from simple text descriptions.
            Perfect for logos, icons, and illustrations.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-lg max-w-md mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}