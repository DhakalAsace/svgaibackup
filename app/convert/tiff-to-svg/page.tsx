import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import TiffToSvgSpecific from "@/components/converters/tiff-to-svg-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("tiff-to-svg")!
const currentUrl = "https://svgai.org/convert/tiff-to-svg"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function TiffToSvgConverterPage() {
  const converterConfig = getConverterBySlug('tiff-to-svg')!
  
  return (
    <ConverterPageTemplate
      title="TIFF to SVG Converter - Free Online Tool"
      description="Convert TIFF images to SVG format online for free. High-quality vectorization with support for multi-page TIFF files and various compression formats."
      keywords={["tiff to svg", "tiff to svg converter", "convert tiff to svg", "tiff to vector", "multi-page tiff"]}
      converterConfig={converterConfig}
      converterType={{
        from: "tiff",
        to: "svg",
        fromFull: "TIFF",
        toFull: "SVG"
      }}
      heroTitle="TIFF to SVG Converter"
      heroSubtitle="Transform TIFF images into scalable vector graphics with our free online converter. Supports multi-page TIFF files and various compression formats."
      converterComponent={<TiffToSvgSpecific />}
      features={[
        {
          title: "Multi-Page Support",
          description: "Convert specific pages from multi-page TIFF files with easy page selection controls"
        },
        {
          title: "Professional Quality",
          description: "High-quality vectorization perfect for professional printing and archival purposes"
        },
        {
          title: "Compression Support",
          description: "Handles various TIFF compression formats including LZW, PackBits, and more"
        },
        {
          title: "Advanced Controls",
          description: "Fine-tune threshold, optimization, and turn policy for perfect vectorization results"
        },
        {
          title: "Color & Monochrome",
          description: "Support for both color and black & white TIFF to SVG conversion"
        },
        {
          title: "Browser-Based",
          description: "All conversion happens locally in your browser - your files remain private"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload TIFF File",
          description: "Select or drag-drop your TIFF file. Multi-page TIFFs are fully supported."
        },
        {
          title: "Select Page & Settings",
          description: "Choose which page to convert and adjust vectorization parameters as needed."
        },
        {
          title: "Convert & Download",
          description: "Click convert and download your SVG file instantly. No waiting or registration."
        }
      ]}
      faqs={[
        {
          question: "Can I convert multi-page TIFF files?",
          answer: "Yes! Our converter supports multi-page TIFF files. You can select which page you want to convert using the page number input. Pages are indexed starting from 0."
        },
        {
          question: "What TIFF compression formats are supported?",
          answer: "We support all major TIFF compression formats including uncompressed, LZW, PackBits, JPEG, and ZIP compression. The converter automatically detects and handles the compression format."
        },
        {
          question: "How does TIFF to SVG conversion work?",
          answer: "The converter first decodes your TIFF file, then uses advanced tracing algorithms to analyze the raster image and create vector paths. This process converts pixel-based images into scalable mathematical descriptions of shapes."
        },
        {
          question: "What's the maximum file size supported?",
          answer: "You can convert TIFF files up to 50MB in size. This is sufficient for most high-resolution TIFF images and multi-page documents."
        },
        {
          question: "Is the quality preserved during conversion?",
          answer: "The converter uses intelligent vectorization to maintain visual quality. Simple graphics convert perfectly, while complex photographic images are traced to create artistic vector representations."
        }
      ]}
      relatedConverters={[
        {
          title: "SVG to TIFF Converter",
          href: "/convert/svg-to-tiff",
          description: "Convert SVG files to TIFF format"
        },
        {
          title: "PNG to SVG Converter",
          href: "/convert/png-to-svg",
          description: "Convert PNG images to vector format"
        },
        {
          title: "Image to SVG Converter",
          href: "/convert/image-to-svg",
          description: "Convert any image format to SVG"
        }
      ]}
      additionalSections={
        <>
          {/* SEO Content Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-[#4E342E] mb-6">
                Complete Guide to TIFF to SVG Conversion
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Converting TIFF files to SVG format transforms professional-grade raster images 
                  into scalable vector graphics, perfect for web deployment, digital editing, and 
                  cross-platform compatibility. This process bridges the gap between archival-quality 
                  TIFF images and modern web-ready vector graphics.
                </p>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Why Convert TIFF to SVG?
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Web Optimization:</strong> Transform high-resolution TIFFs into lightweight, scalable graphics</li>
                  <li><strong>Infinite Scalability:</strong> Convert fixed-resolution images to infinitely scalable vectors</li>
                  <li><strong>File Size Reduction:</strong> Often achieve dramatic file size reductions for simple graphics</li>
                  <li><strong>Modern Format:</strong> Move from legacy TIFF to contemporary web standards</li>
                  <li><strong>Editability:</strong> Convert raster graphics to editable vector format for design work</li>
                  <li><strong>Cross-Platform Support:</strong> Better compatibility across browsers and devices</li>
                </ul>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  TIFF Format Compatibility
                </h3>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  Supported TIFF Variations
                </h4>
                <p>
                  Our converter handles all major TIFF format specifications:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Baseline TIFF:</strong> Standard uncompressed TIFF files</li>
                  <li><strong>LZW Compressed:</strong> Losslessly compressed TIFF files</li>
                  <li><strong>PackBits:</strong> Simple compression algorithm support</li>
                  <li><strong>ZIP/Deflate:</strong> Modern compression standards</li>
                  <li><strong>JPEG in TIFF:</strong> TIFF files with JPEG compression</li>
                  <li><strong>Multi-page TIFF:</strong> Document and presentation files</li>
                </ul>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  Color Space Handling
                </h4>
                <p>
                  Professional TIFF files often use specialized color spaces that require careful conversion:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>RGB Color:</strong> Standard 24-bit and 48-bit RGB images</li>
                  <li><strong>CMYK Images:</strong> Print-ready color separated images</li>
                  <li><strong>Grayscale:</strong> 8-bit and 16-bit monochrome images</li>
                  <li><strong>Indexed Color:</strong> Palette-based color images</li>
                  <li><strong>LAB Color:</strong> Device-independent color space</li>
                </ul>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                  <h4 className="font-semibold text-[#4E342E] mb-2">Multi-Page TIFF Processing</h4>
                  <p>
                    When working with multi-page TIFF files (common in document scanning and 
                    presentations), our converter allows you to select specific pages for 
                    conversion. This is particularly useful for extracting diagrams, charts, 
                    or specific graphics from larger documents.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Conversion Scenarios Section */}
          <section className="py-16 bg-[#FAFAFA]">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Common TIFF to SVG Conversion Scenarios
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                From professional archives to web deployment, discover when TIFF to SVG conversion adds value
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Digital Archive Modernization</h3>
                  <p className="text-gray-600 mb-4">Museums and libraries converting archival TIFF images to web-ready SVG format for online collections.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Historical document digitization</li>
                    <li>• Museum collection databases</li>
                    <li>• Digital humanities projects</li>
                    <li>• Online exhibition platforms</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Technical Documentation</h3>
                  <p className="text-gray-600 mb-4">Converting scanned technical drawings and diagrams from TIFF to editable SVG format.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Engineering blueprints</li>
                    <li>• Scientific diagrams</li>
                    <li>• Process flowcharts</li>
                    <li>• CAD drawing conversion</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Logo Digitization</h3>
                  <p className="text-gray-600 mb-4">Transform scanned or archived logos from TIFF format to scalable SVG for modern branding.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Brand archive digitization</li>
                    <li>• Historical logo reproduction</li>
                    <li>• Corporate identity systems</li>
                    <li>• Trademark documentation</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Scientific Publications</h3>
                  <p className="text-gray-600 mb-4">Convert high-resolution TIFF figures and charts to web-optimized SVG for online journals.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Research data visualization</li>
                    <li>• Academic publication graphics</li>
                    <li>• Conference presentation materials</li>
                    <li>• Online journal submissions</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Web Content Migration</h3>
                  <p className="text-gray-600 mb-4">Optimize websites by converting heavy TIFF images to lightweight, scalable SVG graphics.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Website performance optimization</li>
                    <li>• Mobile-responsive graphics</li>
                    <li>• E-commerce product diagrams</li>
                    <li>• Educational content graphics</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Design System Creation</h3>
                  <p className="text-gray-600 mb-4">Build modern design systems by converting legacy TIFF assets to flexible SVG components.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Icon library development</li>
                    <li>• Component design systems</li>
                    <li>• Brand guideline updates</li>
                    <li>• UI/UX asset migration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Process Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Advanced Vectorization Technology
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Understanding the technical process behind professional TIFF to SVG conversion
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">Image Processing Pipeline</h3>
                  <p className="text-gray-600 mb-4">
                    Our conversion process handles TIFF files through multiple optimization stages:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>TIFF Decoding:</strong> Handles all compression formats and color spaces
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Color Space Conversion:</strong> Converts CMYK, LAB, and other spaces to RGB
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Image Enhancement:</strong> Optimizes contrast and clarity for better tracing
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Vectorization:</strong> Uses Potrace algorithm for precise path generation
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">Quality Optimization</h3>
                  <p className="text-gray-600 mb-4">
                    Multiple parameters ensure optimal conversion results for different TIFF types:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Adaptive Thresholding:</strong> Automatically adjusts for optimal edge detection
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Multi-color Support:</strong> Handles both monochrome and full-color conversion
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Path Optimization:</strong> Reduces file size while maintaining visual quality
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Metadata Preservation:</strong> Retains important image information when possible
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 my-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">Conversion Best Practices</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">For Simple Graphics:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use monochrome mode for line art</li>
                      <li>• Higher threshold for cleaner edges</li>
                      <li>• Maximum optimization for smaller files</li>
                      <li>• Consider manual cleanup for perfection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For Complex Images:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use color mode with posterization</li>
                      <li>• Lower threshold to preserve detail</li>
                      <li>• Moderate optimization to maintain quality</li>
                      <li>• Preview before final conversion</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-6 my-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">File Size Considerations</h3>
                <p className="text-gray-600 mb-3">
                  TIFF to SVG conversion can dramatically reduce file sizes for simple graphics, but complex 
                  images may result in large SVG files. Consider these factors:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Simple Line Art:</strong> Can see 90%+ file size reduction</li>
                  <li>• <strong>Logos and Icons:</strong> Often 70-80% smaller as SVG</li>
                  <li>• <strong>Complex Graphics:</strong> May be larger as SVG due to path complexity</li>
                  <li>• <strong>Photographic Content:</strong> Better suited for raster formats like PNG or WebP</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      }
    />
  )
}