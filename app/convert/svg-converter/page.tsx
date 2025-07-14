import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SVG Converter - Universal Vector Conversion Tool | Convert to SVG Free',
  description: 'Convert any image format to SVG or from SVG with our comprehensive converter. Support for 40+ formats including PNG, JPG, PDF, AI, EPS, and more. Free, fast, and secure.',
  keywords: ['svg converter', 'convert to svg', 'vector converter', 'image to svg', 'svg conversion', 'free svg converter', 'online svg converter'],
  openGraph: {
    title: 'Universal SVG Converter - Convert Any Format to/from SVG',
    description: 'The most comprehensive SVG converter supporting 40+ formats. Convert images, documents, and graphics to scalable vectors or export SVG to any format.',
    type: 'website',
    siteName: 'SVG AI',
  },
}

const supportedFormats = {
  raster: ['PNG', 'JPG/JPEG', 'WebP', 'GIF', 'BMP', 'TIFF', 'ICO'],
  vector: ['AI', 'EPS', 'PDF', 'CDR', 'DXF', 'WMF', 'EMF'],
  document: ['DOCX', 'PPTX', 'ODG', 'VSD'],
  web: ['HTML', 'CSS', 'Base64', 'Data URI'],
}

const conversionMatrix = [
  { from: 'PNG', to: 'SVG', difficulty: 'Medium', method: 'Image Tracing', quality: 'Good' },
  { from: 'JPG', to: 'SVG', difficulty: 'Medium', method: 'Image Tracing', quality: 'Good' },
  { from: 'SVG', to: 'PNG', difficulty: 'Easy', method: 'Rasterization', quality: 'Excellent' },
  { from: 'SVG', to: 'PDF', difficulty: 'Easy', method: 'Direct Export', quality: 'Excellent' },
  { from: 'PDF', to: 'SVG', difficulty: 'Hard', method: 'Vector Extraction', quality: 'Variable' },
  { from: 'AI', to: 'SVG', difficulty: 'Easy', method: 'Direct Export', quality: 'Excellent' },
]

export default function SVGConverterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4E342E]">Universal SVG Converter</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Convert between SVG and 40+ formats with the most comprehensive vector conversion tool. 
          Free, fast, and works entirely in your browser for maximum privacy.
        </p>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/convert/png-to-svg"
            className="px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            PNG to SVG
          </Link>
          <Link 
            href="/convert/jpg-to-svg"
            className="px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            JPG to SVG
          </Link>
          <Link 
            href="/convert/svg-to-png"
            className="px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            SVG to PNG
          </Link>
          <Link 
            href="/convert/svg-to-pdf"
            className="px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            SVG to PDF
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-[#4E342E]">The Complete Guide to SVG Conversion</h2>
          <p>
            Scalable Vector Graphics (SVG) has become the gold standard for web graphics, logos, icons, and illustrations. 
            Unlike pixel-based formats that blur when scaled, SVG uses mathematical descriptions to create infinitely scalable graphics. 
            This comprehensive guide covers everything you need to know about converting to and from SVG format.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 my-8">
            <h3 className="mt-0 text-[#4E342E]">Why Choose SVG?</h3>
            <ul>
              <li><strong>Infinite Scalability:</strong> Perfect quality at any size, from favicon to billboard</li>
              <li><strong>Small File Sizes:</strong> Often smaller than raster equivalents, especially for simple graphics</li>
              <li><strong>SEO Friendly:</strong> Text content is indexable by search engines</li>
              <li><strong>Interactive & Animatable:</strong> Full CSS and JavaScript support</li>
              <li><strong>Accessible:</strong> Can include metadata and descriptions for screen readers</li>
            </ul>
          </div>
        </section>

        {/* Supported Formats */}
        <section className="mb-12">
          <h2 className="text-[#4E342E]">Supported Conversion Formats</h2>
          <p>
            Our universal SVG converter supports over 40 different file formats, organized into categories 
            for easy navigation. Whether you're converting from raster images, vector graphics, documents, 
            or web formats, we've got you covered.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Raster Images</h3>
              <ul className="space-y-2 text-sm">
                {supportedFormats.raster.map(format => (
                  <li key={format} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {format}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Vector Graphics</h3>
              <ul className="space-y-2 text-sm">
                {supportedFormats.vector.map(format => (
                  <li key={format} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {format}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Documents</h3>
              <ul className="space-y-2 text-sm">
                {supportedFormats.document.map(format => (
                  <li key={format} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {format}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Web Formats</h3>
              <ul className="space-y-2 text-sm">
                {supportedFormats.web.map(format => (
                  <li key={format} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {format}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Conversion Methods */}
        <section className="mb-12">
          <h2>Understanding Conversion Methods</h2>
          <p>
            Different conversion types require different approaches. Understanding these methods helps you 
            choose the right converter and settings for optimal results.
          </p>

          <h3>1. Raster to Vector Conversion (Image Tracing)</h3>
          <p>
            Converting pixel-based images like PNG or JPG to SVG involves sophisticated algorithms that 
            analyze pixels to detect shapes, edges, and color boundaries. This process, called image tracing 
            or vectorization, has several approaches:
          </p>
          
          <ul>
            <li>
              <strong>Automatic Tracing:</strong> AI-powered algorithms analyze your image and create vector paths. 
              Best for logos, simple graphics, and high-contrast images.
            </li>
            <li>
              <strong>Color Reduction:</strong> Simplifies complex images by reducing colors before tracing. 
              Essential for photographic content.
            </li>
            <li>
              <strong>Edge Detection:</strong> Focuses on finding and preserving sharp edges and boundaries. 
              Ideal for technical drawings and diagrams.
            </li>
            <li>
              <strong>Centerline Tracing:</strong> Creates single-line paths instead of filled shapes. 
              Perfect for line art and sketches.
            </li>
          </ul>

          <h3>2. Vector to Vector Conversion</h3>
          <p>
            Converting between vector formats (like AI to SVG or EPS to SVG) is generally more straightforward 
            as both formats use mathematical descriptions. Key considerations include:
          </p>
          
          <ul>
            <li>
              <strong>Feature Compatibility:</strong> Some advanced features may not translate perfectly between formats
            </li>
            <li>
              <strong>Font Handling:</strong> Text may need to be converted to outlines for compatibility
            </li>
            <li>
              <strong>Color Space:</strong> CMYK colors may need conversion to RGB for web use
            </li>
            <li>
              <strong>Effects & Filters:</strong> Complex effects might need simplification
            </li>
          </ul>

          <h3>3. Vector to Raster Conversion</h3>
          <p>
            Converting SVG to pixel-based formats like PNG or JPG is called rasterization. This process is 
            straightforward but requires careful attention to:
          </p>
          
          <ul>
            <li>
              <strong>Resolution:</strong> Choose appropriate pixel dimensions for your use case
            </li>
            <li>
              <strong>Anti-aliasing:</strong> Smooth edges to prevent jagged appearance
            </li>
            <li>
              <strong>Background:</strong> Decide between transparent or solid backgrounds
            </li>
            <li>
              <strong>Color Depth:</strong> Balance file size with color accuracy
            </li>
          </ul>
        </section>

        {/* Conversion Quality Matrix */}
        <section className="mb-12">
          <h2>Conversion Quality Guide</h2>
          <p>
            Not all conversions are created equal. This matrix helps you understand what to expect from 
            different conversion types and how to achieve the best results.
          </p>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left">From Format</th>
                  <th className="px-4 py-3 text-left">To Format</th>
                  <th className="px-4 py-3 text-left">Difficulty</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Expected Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {conversionMatrix.map((conversion, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{conversion.from}</td>
                    <td className="px-4 py-3">{conversion.to}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        conversion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                        conversion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                      }`}>
                        {conversion.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">{conversion.method}</td>
                    <td className="px-4 py-3">{conversion.quality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 my-8">
            <h3 className="mt-0">Pro Tips for Best Results</h3>
            <ul>
              <li>For logos and simple graphics, use high-contrast source images</li>
              <li>Clean up source images before conversion (remove backgrounds, increase contrast)</li>
              <li>Vector-to-vector conversions typically preserve quality best</li>
              <li>For complex images, consider manual tracing for professional results</li>
              <li>Always verify text conversion - you may need to convert fonts to outlines</li>
            </ul>
          </div>
        </section>


        {/* Format-Specific Guides */}
        <section className="mb-12">
          <h2>Format-Specific Conversion Guides</h2>
          <p>
            Each format has unique characteristics and considerations. Here's what you need to know for 
            successful conversions with popular formats.
          </p>

          <h3>PNG to SVG Conversion</h3>
          <p>
            PNG images are pixel-based with support for transparency. When converting to SVG:
          </p>
          <ul>
            <li>Best for: Logos, icons, simple graphics with clear edges</li>
            <li>Challenges: Complex gradients, photographic content</li>
            <li>Tips: Use high-resolution source files, simplify before converting</li>
            <li>Expected results: Good to excellent for appropriate content</li>
          </ul>

          <h3>JPG to SVG Conversion</h3>
          <p>
            JPEG format is optimized for photographs but challenging for vectorization:
          </p>
          <ul>
            <li>Best for: Simple illustrations, high-contrast images</li>
            <li>Challenges: Compression artifacts, continuous tone images</li>
            <li>Tips: Increase contrast, reduce colors, focus on silhouettes</li>
            <li>Expected results: Variable, best with preprocessing</li>
          </ul>

          <h3>PDF to SVG Conversion</h3>
          <p>
            PDFs can contain both vector and raster content:
          </p>
          <ul>
            <li>Best for: Vector PDFs from design software</li>
            <li>Challenges: Mixed content, embedded fonts, complex layouts</li>
            <li>Tips: Use PDFs exported from vector programs when possible</li>
            <li>Expected results: Excellent for vector PDFs, poor for scanned documents</li>
          </ul>

          <h3>AI/EPS to SVG Conversion</h3>
          <p>
            Adobe Illustrator and EPS files are already vector formats:
          </p>
          <ul>
            <li>Best for: Professional graphics, logos, illustrations</li>
            <li>Challenges: Proprietary features, effects, gradients</li>
            <li>Tips: Simplify complex effects before conversion</li>
            <li>Expected results: Excellent, minimal quality loss</li>
          </ul>
        </section>

        {/* Optimization Techniques */}
        <section className="mb-12">
          <h2>SVG Optimization Best Practices</h2>
          <p>
            After conversion, optimizing your SVG files ensures fast loading and efficient rendering. 
            Our converters include built-in optimization, but understanding the process helps you make 
            informed decisions.
          </p>

          <h3>Optimization Techniques</h3>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">File Size Reduction</h4>
              <ul className="space-y-2">
                <li>• Remove unnecessary metadata and comments</li>
                <li>• Minimize decimal precision in path data</li>
                <li>• Combine similar paths and shapes</li>
                <li>• Eliminate hidden or off-canvas elements</li>
                <li>• Compress path data syntax</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Performance Enhancement</h4>
              <ul className="space-y-2">
                <li>• Simplify complex paths without quality loss</li>
                <li>• Convert text to paths when fonts aren't needed</li>
                <li>• Optimize for GPU rendering</li>
                <li>• Remove duplicate gradients and patterns</li>
                <li>• Inline small referenced elements</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 my-8">
            <h3 className="mt-0">Optimization Results</h3>
            <p>
              Proper optimization typically achieves:
            </p>
            <ul>
              <li>• 50-80% file size reduction without quality loss</li>
              <li>• Faster page load times and rendering</li>
              <li>• Better compatibility across browsers</li>
              <li>• Improved accessibility with clean code</li>
              <li>• Easier maintenance and editing</li>
            </ul>
          </div>
        </section>

        {/* Workflow Integration */}
        <section className="mb-12">
          <h2>Integrating SVG Conversion into Your Workflow</h2>
          <p>
            Effective SVG conversion isn't just about the tools—it's about seamlessly integrating them 
            into your existing workflow for maximum efficiency.
          </p>

          <h3>Design Workflow Integration</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 my-8">
            <h4 className="text-lg font-semibold mb-3 mt-0">For Designers</h4>
            <ol className="space-y-3">
              <li>
                <strong>1. Asset Preparation:</strong> Organize and name files consistently before batch conversion
              </li>
              <li>
                <strong>2. Quality Check:</strong> Preview conversions before finalizing, especially for complex graphics
              </li>
              <li>
                <strong>3. Version Control:</strong> Maintain original files and document conversion settings
              </li>
              <li>
                <strong>4. Delivery Formats:</strong> Create multiple format exports for different use cases
              </li>
              <li>
                <strong>5. Documentation:</strong> Include usage guidelines with converted assets
              </li>
            </ol>
          </div>

          <h3>Development Workflow Integration</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 my-8">
            <h4 className="text-lg font-semibold mb-3 mt-0">For Developers</h4>
            <ol className="space-y-3">
              <li>
                <strong>1. Build Process:</strong> Automate conversions as part of asset pipeline
              </li>
              <li>
                <strong>2. Optimization:</strong> Include SVG optimization in build scripts
              </li>
              <li>
                <strong>3. Sprite Generation:</strong> Combine multiple SVGs for efficient delivery
              </li>
              <li>
                <strong>4. Fallback Strategy:</strong> Generate PNG fallbacks for older browsers
              </li>
              <li>
                <strong>5. Performance Monitoring:</strong> Track file sizes and load times
              </li>
            </ol>
          </div>

          <h3>Content Management Integration</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 my-8">
            <h4 className="text-lg font-semibold mb-3 mt-0">For Content Teams</h4>
            <ol className="space-y-3">
              <li>
                <strong>1. Upload Processing:</strong> Automatically convert uploaded images to SVG when appropriate
              </li>
              <li>
                <strong>2. Media Library:</strong> Organize vector and raster versions together
              </li>
              <li>
                <strong>3. Responsive Images:</strong> Use SVG for icons and simple graphics
              </li>
              <li>
                <strong>4. SEO Benefits:</strong> Leverage SVG's text content for better indexing
              </li>
              <li>
                <strong>5. Accessibility:</strong> Add proper titles and descriptions to SVG content
              </li>
            </ol>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2>Troubleshooting Common Conversion Issues</h2>
          <p>
            Even with the best converters, you may encounter challenges. Here's how to resolve the most 
            common issues and achieve optimal results.
          </p>

          <h3>Common Issues and Solutions</h3>
          
          <div className="space-y-6 my-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 mt-0">Poor Quality After Conversion</h4>
              <p className="text-sm mb-3"><strong>Symptoms:</strong> Jagged edges, lost details, incorrect colors</p>
              <p className="text-sm mb-3"><strong>Solutions:</strong></p>
              <ul className="text-sm space-y-1">
                <li>• Use higher resolution source images</li>
                <li>• Adjust tracing threshold settings</li>
                <li>• Try different conversion algorithms</li>
                <li>• Preprocess images to enhance contrast</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 mt-0">Large File Sizes</h4>
              <p className="text-sm mb-3"><strong>Symptoms:</strong> SVG files larger than expected, slow loading</p>
              <p className="text-sm mb-3"><strong>Solutions:</strong></p>
              <ul className="text-sm space-y-1">
                <li>• Enable optimization during conversion</li>
                <li>• Reduce path complexity settings</li>
                <li>• Remove unnecessary groups and layers</li>
                <li>• Consider simplifying the source image</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 mt-0">Missing Elements</h4>
              <p className="text-sm mb-3"><strong>Symptoms:</strong> Text, effects, or graphics not appearing</p>
              <p className="text-sm mb-3"><strong>Solutions:</strong></p>
              <ul className="text-sm space-y-1">
                <li>• Convert text to outlines before conversion</li>
                <li>• Flatten complex effects in source file</li>
                <li>• Check for unsupported features</li>
                <li>• Try alternative export settings</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 mt-0">Browser Compatibility Issues</h4>
              <p className="text-sm mb-3"><strong>Symptoms:</strong> SVGs not displaying correctly in certain browsers</p>
              <p className="text-sm mb-3"><strong>Solutions:</strong></p>
              <ul className="text-sm space-y-1">
                <li>• Use standard SVG features only</li>
                <li>• Test across multiple browsers</li>
                <li>• Provide PNG fallbacks when needed</li>
                <li>• Validate SVG code for errors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-12">
          <h2>Advanced Conversion Techniques</h2>
          <p>
            For professional results and complex projects, these advanced techniques help you get the most 
            out of SVG conversion.
          </p>

          <h3>Multi-Pass Conversion</h3>
          <p>
            Sometimes the best results come from multiple conversion steps:
          </p>
          <ol>
            <li><strong>Initial Conversion:</strong> Convert with balanced settings</li>
            <li><strong>Manual Cleanup:</strong> Edit in vector software to fix issues</li>
            <li><strong>Re-optimization:</strong> Export and optimize the cleaned version</li>
            <li><strong>Final Polish:</strong> Hand-tune code for specific needs</li>
          </ol>

          <h3>Hybrid Approaches</h3>
          <p>
            Combine different techniques for optimal results:
          </p>
          <ul>
            <li>
              <strong>Trace + Manual:</strong> Auto-trace main shapes, manually add fine details
            </li>
            <li>
              <strong>Vector + Raster:</strong> Embed raster images for complex areas within SVG
            </li>
            <li>
              <strong>Multiple Algorithms:</strong> Use different tracing methods for different image areas
            </li>
            <li>
              <strong>Progressive Enhancement:</strong> Start simple, add complexity as needed
            </li>
          </ul>

          <h3>Custom Preprocessing</h3>
          <p>
            Prepare images for better conversion results:
          </p>
          <ul>
            <li>
              <strong>Background Removal:</strong> Clean backgrounds convert better
            </li>
            <li>
              <strong>Contrast Enhancement:</strong> Sharper edges trace more accurately
            </li>
            <li>
              <strong>Color Reduction:</strong> Simplify palettes before conversion
            </li>
            <li>
              <strong>Noise Reduction:</strong> Remove artifacts that confuse tracers
            </li>
          </ul>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2>Real-World Use Cases</h2>
          <p>
            Understanding how others use SVG conversion helps you apply best practices to your own projects. 
            Here are common scenarios and recommended approaches.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">E-commerce Product Icons</h3>
              <p className="text-sm mb-3">
                Converting product photography to simplified vector icons for category pages and navigation.
              </p>
              <p className="text-sm"><strong>Approach:</strong> High contrast preprocessing → Silhouette extraction → Manual cleanup</p>
              <p className="text-sm"><strong>Result:</strong> Consistent, scalable product representations</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Logo Modernization</h3>
              <p className="text-sm mb-3">
                Converting legacy raster logos to modern, scalable SVG versions for responsive websites.
              </p>
              <p className="text-sm"><strong>Approach:</strong> High-res scan → Careful tracing → Color matching → Optimization</p>
              <p className="text-sm"><strong>Result:</strong> Future-proof brand assets</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Technical Documentation</h3>
              <p className="text-sm mb-3">
                Converting CAD drawings and technical diagrams for web-based documentation systems.
              </p>
              <p className="text-sm"><strong>Approach:</strong> Vector PDF export → SVG conversion → Layer preservation</p>
              <p className="text-sm"><strong>Result:</strong> Interactive, zoomable technical drawings</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 mt-0">Icon Library Migration</h3>
              <p className="text-sm mb-3">
                Converting entire icon sets from various formats to consistent SVG for design systems.
              </p>
              <p className="text-sm"><strong>Approach:</strong> Batch processing → Consistent settings → Automated optimization</p>
              <p className="text-sm"><strong>Result:</strong> Unified, maintainable icon system</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Convert Your Files?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Choose from our comprehensive collection of converters or try our AI-powered SVG generator 
              for creating original vector graphics from text descriptions.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/convert"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center"
              >
                Browse All Converters
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link 
                href="/ai-icon-generator"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors inline-flex items-center"
              >
                Try AI SVG Generator
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2>Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">Which converter should I use for my specific file type?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a converter based on your source format and desired output. For example, use "PNG to SVG" 
                if you have a PNG image you want to convert to scalable vector format. Our converter hub page 
                organizes all options by format for easy selection.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">What's the difference between vector and raster conversion?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vector formats (SVG, AI, EPS) use mathematical descriptions and scale infinitely. Raster formats 
                (PNG, JPG) use pixels and have fixed resolutions. Converting from raster to vector requires 
                tracing algorithms, while vector to raster is a simpler rendering process.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">Can I convert photographs to SVG?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                While technically possible, photographs don't convert well to SVG due to their complexity and 
                continuous tones. SVG works best for logos, icons, illustrations, and graphics with distinct 
                shapes and limited colors. For photos, consider stylized or simplified conversions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">How do I maintain quality during conversion?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start with the highest quality source files, use appropriate settings for your content type, 
                and consider the intended use. Vector-to-vector conversions typically maintain quality best. 
                For raster-to-vector, preprocessing and choosing the right tracing algorithm are key.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">Are the conversions really free?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! All our conversion tools are completely free with no hidden costs, watermarks, or 
                signup requirements. We monetize through our premium AI SVG generation service for users 
                who need custom vector graphics created from text descriptions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">Is my data secure during conversion?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely. All conversions happen directly in your browser using client-side JavaScript. 
                Your files never leave your device and aren't uploaded to our servers, ensuring complete 
                privacy and security of your data.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">What file size limits apply?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Most converters support files up to 10MB, which covers the vast majority of use cases. 
                For larger files or batch processing needs, consider breaking files into smaller chunks 
                or using our upcoming API service for programmatic access.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 mt-0">Can I use converted files commercially?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The conversion process doesn't change ownership or licensing of your content. You retain 
                all rights to your converted files just as you did with the originals. Our tools simply 
                facilitate the technical conversion between formats.
              </p>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="mb-12">
          <h2>Related Resources</h2>
          <p>
            Expand your knowledge and capabilities with these related guides and tools designed to help 
            you master SVG and vector graphics.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-8">
            <Link href="/learn/what-is-svg" className="block bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">What is SVG?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete guide to understanding Scalable Vector Graphics, their benefits, and use cases.
              </p>
            </Link>

            <Link href="/learn/svg-optimization" className="block bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">SVG Optimization Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn how to optimize SVG files for maximum performance and minimal file size.
              </p>
            </Link>

            <Link href="/tools/svg-editor" className="block bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">SVG Editor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Edit and fine-tune your converted SVG files with our free online editor.
              </p>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}