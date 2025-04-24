import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Describe Your Vision",
      description: "Enter a detailed text description of the SVG graphic you want our AI SVG generator to create.",
    },
    {
      number: "02",
      title: "AI Generation",
      description:
        "Our text to SVG AI interprets your prompt and generates a unique vector graphic based on your description.",
    },
    {
      number: "03",
      title: "Customize & Refine",
      description: "Fine-tune the generated SVG's style, color, and details, or regenerate variations.",
    },
    {
      number: "04",
      title: "Export & Use",
      description: "Download the final SVG file or copy the optimized code for your project.",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 text-[#FF7043]">
            How It Works
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Generate SVGs from Text in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            See how easily our text to SVG AI turns your ideas into professional vector graphics, ready to use.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gray-300 border-t border-dashed border-gray-400 -translate-y-1/2 z-0" style={{ left: '12.5%', right: '12.5%' }}></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80 h-full flex flex-col flex-grow hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  {/* Use darker blue for better contrast on white background */}
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/10 text-lg font-bold text-blue-700">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm flex-grow">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="text-[#0084FF]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Powered by Advanced Text-to-SVG AI</h3>
              <p className="text-gray-600 mb-4">
                Our AI SVG generator uses state-of-the-art machine learning models trained on millions of vector
                graphics to understand your text descriptions and generate high-quality SVGs matching your intent.
              </p>
            </div>
            <div>
              <div className="aspect-[21/9] bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden border border-gray-200">
                {/* Professional-grade SVG illustrating Text-to-SVG AI technology - Larger & Branded */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 780 390" // Slightly reduced viewBox to scale content up
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  fontFamily="'Inter', system-ui, -apple-system, sans-serif" // Apply Brand Font
                >
                  <defs>
                    {/* Brand gradient definitions (Using existing vibrant colors) */}
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF7043" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#FFA726" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0084FF" stopOpacity="0.15" />
                    </linearGradient>
                    
                    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5722" />
                      <stop offset="100%" stopColor="#FF9800" />
                    </linearGradient>
                    
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0084FF" />
                      <stop offset="100%" stopColor="#00B0FF" />
                    </linearGradient>
                    
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF5722" />
                      <stop offset="50%" stopColor="#FF9800" />
                      <stop offset="100%" stopColor="#0084FF" />
                    </linearGradient>
                    
                    {/* Glow filters */}
                    <filter id="orangeGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" /> {/* Slightly larger glow */}
                      <feFlood floodColor="#FF5722" floodOpacity="0.5" result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="glow" />
                      <feComposite in="SourceGraphic" in2="glow" operator="over" />
                    </filter>
                    
                    <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" /> {/* Slightly larger glow */}
                      <feFlood floodColor="#0084FF" floodOpacity="0.5" result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="glow" />
                      <feComposite in="SourceGraphic" in2="glow" operator="over" />
                    </filter>
                    
                    {/* Drop shadow */}
                    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
                      <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.15" /> {/* Slightly stronger shadow */}
                    </filter>
                  </defs>
                  
                  {/* Background - more visible gradient */}
                  <rect width="780" height="390" fill="#F8FAFC" />
                  <rect width="780" height="390" fill="url(#bgGradient)" />
                  
                  {/* Decorative elements - slightly adjusted for new viewbox */}
                  <path d="M-10,270 C90,240 140,310 240,290 S340,240 440,250 S640,310 790,270" 
                        stroke="#FFA726" strokeOpacity="0.25" strokeWidth="40" fill="none" />
                  <path d="M-10,140 C110,170 190,110 290,130 S440,170 540,150 S690,110 790,140" 
                        stroke="#0084FF" strokeOpacity="0.2" strokeWidth="30" fill="none" />
                  
                  {/* Main Content Group - Scaled up and centered */}
                  <g transform="translate(-10, 5) scale(1.03)">
                    {/* Title Section - Adjusted for scale */}
                    <rect x="190" y="15" width="400" height="40" rx="20" fill="white" filter="url(#cardShadow)" />
                    <text x="390" y="42" fontSize="20" fontWeight="700" fill="#1F2937" textAnchor="middle">Text to SVG AI Conversion</text>
                    
                    {/* === TEXT DESCRIPTION PANEL === */}
                    <g className="text-panel">
                      {/* Panel container */}
                      <rect x="70" y="85" width="180" height="230" rx="12" fill="white" filter="url(#cardShadow)" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* Top bar */}
                      <rect x="70" y="85" width="180" height="38" rx="12" fill="url(#orangeGradient)" opacity="0.25" />
                      <circle cx="95" cy="104" r="7" fill="url(#orangeGradient)" />
                      <text x="160" y="110" fontSize="16" fontWeight="600" fill="#FF5722" textAnchor="middle">Text Input</text>
                      
                      {/* Text lines */}
                      <rect x="90" y="145" width="140" height="7" rx="3.5" fill="#6B7280" />
                      <rect x="90" y="165" width="110" height="7" rx="3.5" fill="#6B7280" />
                      <rect x="90" y="185" width="130" height="7" rx="3.5" fill="#6B7280" />
                      <rect x="90" y="205" width="90" height="7" rx="3.5" fill="#6B7280" />
                      <rect x="90" y="225" width="120" height="7" rx="3.5" fill="#6B7280" />
                      
                      {/* Cursor blink effect */}
                      <rect x="90" y="245" width="3" height="16" fill="#FF5722">
                        <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                      </rect>
                      
                      {/* Prompt example - Centered text */}
                      <rect x="85" y="275" width="150" height="30" rx="15" fill="#FF5722" fillOpacity="0.15" stroke="#FF5722" strokeOpacity="0.3" strokeWidth="1" />
                      <text x="160" y="295" fontSize="14" fontWeight="500" fill="#FF5722" textAnchor="middle">"Create a minimalist logo"</text>
                    </g>
                    
                    {/* === AI PROCESSING PANEL === */}
                    <g className="ai-panel">
                      {/* Panel container */}
                      <rect x="300" y="85" width="190" height="230" rx="12" fill="white" filter="url(#cardShadow)" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* Top bar */}
                      <rect x="300" y="85" width="190" height="38" rx="12" fill="url(#flowGradient)" opacity="0.25" />
                      <circle cx="325" cy="104" r="7" fill="url(#flowGradient)" />
                      <text x="395" y="110" fontSize="18" fontWeight="800" fill="#111" textAnchor="middle" stroke="#FFF" strokeWidth="1.5" paintOrder="stroke" style={{filter: 'drop-shadow(0 1px 3px #fff8)'}}>AI Neural Processing</text>
                      
                      {/* Background for neural net */}
                      <rect x="320" y="135" width="150" height="130" rx="8" fill="#F1F5F9" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* Nodes - Input Layer */}
                      <circle cx="340" cy="170" r="9" fill="url(#orangeGradient)" filter="url(#orangeGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0s" />
                      </circle>
                      <circle cx="340" cy="200" r="9" fill="url(#orangeGradient)" filter="url(#orangeGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.4s" />
                      </circle>
                      <circle cx="340" cy="230" r="9" fill="url(#orangeGradient)" filter="url(#orangeGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.8s" />
                      </circle>
                      
                      {/* Nodes - Hidden Layer */}
                      <circle cx="400" cy="160" r="9" fill="#FF9800" opacity="1">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.3s" />
                      </circle>
                      <circle cx="400" cy="200" r="9" fill="#FF9800" opacity="1">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.6s" />
                      </circle>
                      <circle cx="400" cy="240" r="9" fill="#FF9800" opacity="1">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.9s" />
                      </circle>
                      
                      {/* Nodes - Output Layer */}
                      <circle cx="460" cy="170" r="9" fill="url(#blueGradient)" filter="url(#blueGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="1.2s" />
                      </circle>
                      <circle cx="460" cy="230" r="9" fill="url(#blueGradient)" filter="url(#blueGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="1.6s" />
                      </circle>
                      
                      {/* Neural connections */}
                      <g opacity="0.5">
                        <path d="M340 170 L400 160" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 170 L400 200" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 200 L400 160" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 200 L400 200" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 200 L400 240" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 230 L400 200" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M340 230 L400 240" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M400 160 L460 170" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M400 200 L460 170" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M400 200 L460 230" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M400 240 L460 230" stroke="#94A3B8" strokeWidth="1.5" />
                      </g>
                      
                      {/* Active connections animation */}
                      <path d="M340 200 L400 200 L460 170" stroke="url(#flowGradient)" strokeWidth="3" strokeDasharray="5,3" opacity="1">
                        <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M340 200 L400 200 L460 230" stroke="url(#flowGradient)" strokeWidth="3" strokeDasharray="5,3" opacity="1">
                        <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
                      </path>
                      
                      {/* Label - Centered text */}
                      <rect x="335" y="280" width="130" height="26" rx="13" fill="#0084FF" fillOpacity="0.15" stroke="#0084FF" strokeOpacity="0.3" strokeWidth="1" />
                      <text x="400" y="297" fontSize="14" fontWeight="500" fill="#0084FF" textAnchor="middle">Neural Processing</text>
                    </g>
                    
                    {/* === SVG OUTPUT PANEL === */}
                    <g className="svg-panel">
                      {/* Panel container */}
                      <rect x="540" y="85" width="180" height="230" rx="12" fill="white" filter="url(#cardShadow)" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* Top bar */}
                      <rect x="540" y="85" width="180" height="38" rx="12" fill="url(#blueGradient)" opacity="0.25" />
                      <circle cx="565" cy="104" r="7" fill="url(#blueGradient)" />
                      <text x="630" y="110" fontSize="16" fontWeight="600" fill="#0084FF" textAnchor="middle">SVG Result</text>
                      
                      {/* SVG output preview */}
                      <rect x="565" y="135" width="130" height="130" rx="8" fill="#F8FAFC" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* SVG Minimalist Logo Example - Scaled up */}
                      <g transform="translate(630, 200) scale(1)">
                        <circle cx="0" cy="0" r="45" fill="#FFA726" fillOpacity="0.3" />
                        <path d="M-30 0 L0 -30 L30 0 L0 30 Z" fill="#FF5722" fillOpacity="0.6" strokeWidth="3" stroke="#FF5722" strokeOpacity="0.8" />
                        <circle cx="0" cy="0" r="12" fill="white" stroke="#0084FF" strokeWidth="2" />
                        <circle cx="0" cy="0" r="6" fill="#0084FF" fillOpacity="0.8">
                          <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
                        </circle>
                      </g>
                      
                      {/* SVG Code Example */}
                      <rect x="565" y="280" width="130" height="26" rx="4" fill="#F1F5F9" stroke="#E5E7EB" strokeWidth="1" />
                      <text x="630" y="297" fontFamily="monospace" fontSize="14" fill="#334155" textAnchor="middle">&lt;svg&gt;...&lt;/svg&gt;</text>
                    </g>
                    
                    {/* Connection Arrows - adjusted for scale */}
                    <g className="connection-arrows">
                      {/* Text to AI */}
                      <path d="M260 200 C280 200, 290 200, 295 200" stroke="url(#flowGradient)" strokeWidth="4" strokeLinecap="round" />
                      <path d="M295 200 L285 195 L285 205 Z" fill="url(#flowGradient)" />
                      
                      {/* AI to SVG */}
                      <path d="M500 200 C520 200, 530 200, 535 200" stroke="url(#flowGradient)" strokeWidth="4" strokeLinecap="round" />
                      <path d="M535 200 L525 195 L525 205 Z" fill="url(#flowGradient)" />
                    </g>
                    
                    {/* Process labels - Adjusted for scale */}
                    <g className="process-labels">
                      <text x="160" y="345" fontSize="17" fontWeight="600" fill="#333" textAnchor="middle">1. Describe</text>
                      <text x="395" y="345" fontSize="17" fontWeight="600" fill="#333" textAnchor="middle">2. AI Processes</text>
                      <text x="630" y="345" fontSize="17" fontWeight="600" fill="#333" textAnchor="middle">3. Generate SVG</text>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
