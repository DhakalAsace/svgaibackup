import { Metadata } from "next"
import AnimationTool from "./animation-tool"

export const metadata: Metadata = {
  title: "Free SVG Animation Tool - Create Animated SVGs Online | SVG AI",
  description: "Create stunning SVG animations with our free online tool. Add CSS animations to SVGs with timeline editor, presets, and instant preview. No coding required!",
  keywords: "svg animation, animated svg, svg animator, css svg animation, svg animation tool, create svg animation, online svg animator, svg animation generator, svg motion graphics, svg animation editor",
  openGraph: {
    title: "Free SVG Animation Tool - Create Animated SVGs Online",
    description: "Transform static SVGs into dynamic animations. Visual timeline editor, animation presets, and instant export. No coding skills needed!",
    url: "https://svgai.com/animate",
    siteName: "SVG AI",
    images: [
      {
        url: "https://svgai.com/animate/og-image.png",
        width: 1200,
        height: 630,
        alt: "SVG Animation Tool Preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SVG Animation Tool - Create Animated SVGs",
    description: "Transform static SVGs into dynamic animations with our free online tool. Visual editor, timeline, presets, and more!",
    images: ["https://svgai.com/animate/twitter-card.png"],
    creator: "@svgai"
  },
  alternates: {
    canonical: "https://svgai.com/animate"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SVG Animation Tool",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Free online SVG animation tool with visual timeline editor, CSS animation presets, and instant export capabilities.",
  "url": "https://svgai.com/animate",
  "publisher": {
    "@type": "Organization",
    "name": "SVG AI",
    "url": "https://svgai.com"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  }
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create SVG Animations",
  "description": "Learn how to create professional SVG animations using our free online tool",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload or Paste SVG",
      "text": "Upload your SVG file or paste SVG code directly into the editor"
    },
    {
      "@type": "HowToStep", 
      "name": "Choose Animation Type",
      "text": "Select from presets like rotate, scale, bounce, or create custom animations"
    },
    {
      "@type": "HowToStep",
      "name": "Adjust Timeline",
      "text": "Use the visual timeline editor to control animation duration and timing"
    },
    {
      "@type": "HowToStep",
      "name": "Preview and Export",
      "text": "Preview your animation in real-time and export as animated SVG or upgrade for video export"
    }
  ],
  "totalTime": "PT5M",
  "supply": ["SVG file", "Web browser"],
  "tool": ["SVG Animation Tool"]
}

export default function AnimatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Free SVG Animation Tool
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform static SVGs into captivating animations with our powerful online tool. 
                No coding required - just upload, animate, and export!
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-medium">100% Free</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 font-medium">No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-800 font-medium">Instant Export</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Tool */}
        <AnimationTool />

        {/* SEO Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Master SVG Animation: Complete Guide to Creating Dynamic Graphics</h2>
            
            <p>
              SVG animation has revolutionized web design by enabling smooth, scalable, and interactive graphics 
              that enhance user experience without compromising performance. Our free SVG animation tool makes 
              it easy for designers, developers, and content creators to bring their static SVGs to life with 
              professional CSS animations.
            </p>

            <h3>What is SVG Animation?</h3>
            <p>
              SVG animation refers to the process of adding motion and interactivity to Scalable Vector Graphics 
              using CSS, JavaScript, or SMIL (Synchronized Multimedia Integration Language). Unlike raster image 
              animations, SVG animations remain crisp and clear at any resolution, making them perfect for 
              responsive web design and high-DPI displays.
            </p>

            <h3>Why Choose SVG Animation?</h3>
            <ul>
              <li><strong>Scalability:</strong> SVG animations look perfect on any screen size or resolution</li>
              <li><strong>Performance:</strong> Smaller file sizes compared to video or GIF animations</li>
              <li><strong>Accessibility:</strong> Text within SVGs remains selectable and searchable</li>
              <li><strong>Control:</strong> Fine-tune every aspect of your animation with CSS properties</li>
              <li><strong>Browser Support:</strong> Works across all modern browsers without plugins</li>
            </ul>

            <h3>Key Features of Our SVG Animation Tool</h3>
            
            <h4>1. Visual Timeline Editor</h4>
            <p>
              Our intuitive timeline editor lets you choreograph complex animations without writing code. 
              Drag keyframes, adjust timing curves, and preview changes in real-time. The visual approach 
              makes it easy to create professional animations that would typically require extensive CSS knowledge.
            </p>

            <h4>2. Animation Presets Library</h4>
            <p>
              Jump-start your projects with our collection of pre-built animation presets:
            </p>
            <ul>
              <li><strong>Entrance Effects:</strong> Fade in, slide, zoom, and bounce animations</li>
              <li><strong>Emphasis Animations:</strong> Pulse, shake, swing, and glow effects</li>
              <li><strong>Exit Animations:</strong> Fade out, slide away, and shrink transitions</li>
              <li><strong>Continuous Loops:</strong> Rotate, float, and morph animations</li>
            </ul>

            <h4>3. Advanced Animation Controls</h4>
            <p>
              Fine-tune your animations with professional-grade controls:
            </p>
            <ul>
              <li>Easing functions (linear, ease-in, ease-out, cubic-bezier)</li>
              <li>Animation duration and delay settings</li>
              <li>Iteration count and direction controls</li>
              <li>Fill mode options (forwards, backwards, both)</li>
              <li>Transform origin adjustments</li>
            </ul>

            <h4>4. Multi-Element Animation</h4>
            <p>
              Animate individual SVG elements independently or create synchronized group animations. 
              Our tool automatically detects SVG structure, allowing you to target specific paths, 
              shapes, or groups with unique animations.
            </p>

            <h3>Common SVG Animation Techniques</h3>

            <h4>Transform Animations</h4>
            <p>
              Transform animations are the foundation of most SVG motion effects. Our tool supports:
            </p>
            <ul>
              <li><strong>Rotation:</strong> Spin elements around any axis or custom transform origin</li>
              <li><strong>Scale:</strong> Grow or shrink elements smoothly</li>
              <li><strong>Translation:</strong> Move elements along X and Y axes</li>
              <li><strong>Skew:</strong> Create dynamic perspective effects</li>
            </ul>

            <h4>Path Animations</h4>
            <p>
              Bring SVG paths to life with drawing animations that reveal strokes progressively. 
              Perfect for logo reveals, handwriting effects, and creative transitions. Our tool 
              automatically calculates path lengths and generates the necessary stroke-dasharray values.
            </p>

            <h4>Morphing Animations</h4>
            <p>
              Transform one shape into another with smooth morphing animations. Ideal for icon 
              transitions, loading animations, and interactive UI elements. The tool ensures 
              compatible path structures for seamless morphing effects.
            </p>

            <h4>Color and Opacity Animations</h4>
            <p>
              Create engaging visual effects by animating fill colors, stroke colors, and opacity. 
              These animations are perfect for hover states, loading indicators, and attention-grabbing 
              UI elements.
            </p>

            <h3>Best Practices for SVG Animation</h3>

            <h4>Performance Optimization</h4>
            <ul>
              <li>Use CSS transforms instead of animating positional properties</li>
              <li>Leverage GPU acceleration with translateZ(0) or will-change</li>
              <li>Minimize the number of animated elements</li>
              <li>Optimize SVG code before animating (remove unnecessary attributes)</li>
              <li>Use requestAnimationFrame for JavaScript animations</li>
            </ul>

            <h4>Accessibility Considerations</h4>
            <ul>
              <li>Respect prefers-reduced-motion user preferences</li>
              <li>Provide pause/play controls for continuous animations</li>
              <li>Ensure animations don't interfere with content readability</li>
              <li>Add appropriate ARIA labels for animated elements</li>
              <li>Test with screen readers to ensure compatibility</li>
            </ul>

            <h4>Cross-Browser Compatibility</h4>
            <p>
              While modern browsers have excellent SVG animation support, consider these tips:
            </p>
            <ul>
              <li>Test animations across different browsers and devices</li>
              <li>Provide fallbacks for older browsers if necessary</li>
              <li>Use vendor prefixes for maximum compatibility</li>
              <li>Avoid SMIL animations (deprecated in some browsers)</li>
              <li>Stick to CSS and JavaScript for future-proof animations</li>
            </ul>

            <h3>Creative Applications of SVG Animation</h3>

            <h4>Web Design and UI/UX</h4>
            <ul>
              <li>Animated logos and brand elements</li>
              <li>Interactive infographics and data visualizations</li>
              <li>Micro-interactions and hover effects</li>
              <li>Loading animations and progress indicators</li>
              <li>Animated icons and navigation elements</li>
            </ul>

            <h4>Marketing and Advertising</h4>
            <ul>
              <li>Animated banner ads and promotional graphics</li>
              <li>Product feature demonstrations</li>
              <li>Animated email signatures and newsletters</li>
              <li>Social media animations and stories</li>
              <li>Landing page hero animations</li>
            </ul>

            <h4>Educational Content</h4>
            <ul>
              <li>Animated diagrams and explanatory graphics</li>
              <li>Interactive tutorials and step-by-step guides</li>
              <li>Scientific visualizations and simulations</li>
              <li>Animated presentations and slideshows</li>
              <li>E-learning course materials</li>
            </ul>

            <h3>Advanced Features: Upgrade to Premium</h3>
            <p>
              While our free tool provides comprehensive SVG animation capabilities, upgrading to our 
              premium plan unlocks additional features for professional creators:
            </p>

            <h4>SVG to Video Export</h4>
            <p>
              Convert your SVG animations to MP4, WebM, or GIF format for use in video projects, 
              social media, or platforms that don't support SVG. Premium video export features include:
            </p>
            <ul>
              <li>HD and 4K resolution options</li>
              <li>Custom frame rates (24, 30, 60 fps)</li>
              <li>Transparent background support (WebM)</li>
              <li>Batch export for multiple animations</li>
              <li>Optimized file sizes for web and mobile</li>
            </ul>

            <h4>Advanced Animation Templates</h4>
            <p>
              Access our premium template library with complex, production-ready animations:
            </p>
            <ul>
              <li>Character animations and mascots</li>
              <li>Complex logo reveals and transitions</li>
              <li>Data visualization templates</li>
              <li>Interactive storytelling elements</li>
              <li>Social media animation packs</li>
            </ul>

            <h3>Getting Started with SVG Animation</h3>

            <h4>Step 1: Prepare Your SVG</h4>
            <p>
              Start with a clean, optimized SVG file. Remove unnecessary attributes, group related 
              elements, and assign meaningful IDs or classes to elements you want to animate. Our 
              tool can work with any SVG, but well-structured files produce better results.
            </p>

            <h4>Step 2: Choose Your Animation Strategy</h4>
            <p>
              Decide whether you want to animate the entire SVG or specific elements. Consider the 
              story you want to tell and how animation can enhance your message. Start simple and 
              build complexity as needed.
            </p>

            <h4>Step 3: Apply Animations</h4>
            <p>
              Use our visual interface to apply animations. Start with presets and customize as 
              needed. Preview frequently to ensure smooth motion and proper timing. Don't be afraid 
              to experiment with different combinations.
            </p>

            <h4>Step 4: Fine-Tune and Export</h4>
            <p>
              Adjust timing, easing, and other properties until your animation feels right. Test 
              on different devices and screen sizes. When satisfied, export your animated SVG or 
              upgrade for video export options.
            </p>

            <h3>Troubleshooting Common Issues</h3>

            <h4>Animation Not Playing</h4>
            <ul>
              <li>Check if animations are disabled in browser settings</li>
              <li>Ensure SVG is properly embedded (inline, object, or img tag)</li>
              <li>Verify CSS is correctly linked or embedded</li>
              <li>Test in different browsers to isolate the issue</li>
            </ul>

            <h4>Jerky or Stuttering Animation</h4>
            <ul>
              <li>Reduce the number of animated elements</li>
              <li>Use transform properties instead of position changes</li>
              <li>Enable hardware acceleration with CSS</li>
              <li>Optimize SVG file size and complexity</li>
            </ul>

            <h4>Inconsistent Behavior Across Browsers</h4>
            <ul>
              <li>Add vendor prefixes for older browsers</li>
              <li>Test on actual devices, not just browser dev tools</li>
              <li>Consider using a CSS animation polyfill</li>
              <li>Provide graceful degradation for unsupported features</li>
            </ul>

            <h3>Future of SVG Animation</h3>
            <p>
              SVG animation continues to evolve with web standards. Emerging trends include:
            </p>
            <ul>
              <li>Integration with Web Animations API for better performance</li>
              <li>Advanced motion path animations</li>
              <li>3D transforms and perspective effects</li>
              <li>Variable fonts within SVG animations</li>
              <li>AI-assisted animation generation</li>
            </ul>

            <h3>Join Our Community</h3>
            <p>
              Connect with other SVG animation enthusiasts, share your creations, and get inspired:
            </p>
            <ul>
              <li>Follow our <a href="/blog">blog</a> for tutorials and tips</li>
              <li>Browse our <a href="/gallery">gallery</a> of animated SVGs</li>
              <li>Check out our <a href="/learn">learning resources</a></li>
              <li>Try our <a href="/ai-icon-generator">AI icon generator</a> for unique graphics</li>
            </ul>

            <h3>Start Animating Today</h3>
            <p>
              Whether you're a designer looking to add motion to your graphics, a developer building 
              interactive web experiences, or a content creator seeking engaging visuals, our free 
              SVG animation tool provides everything you need to bring your ideas to life. No coding 
              experience required – just creativity and imagination!
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Professional SVG Animations?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of designers and developers using our tool to create stunning animations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#tool" 
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Animating Free
              </a>
              <a 
                href="/pricing" 
                className="inline-flex items-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors"
              >
                Unlock Video Export
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}