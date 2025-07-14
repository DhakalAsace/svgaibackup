import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import SvgToBmpSpecific from "@/components/converters/svg-to-bmp-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("svg-to-bmp")!
const currentUrl = "https://svgai.org/convert/svg-to-bmp"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function SvgToBmpConverterPage() {
  const converterConfig = getConverterBySlug('svg-to-bmp')!
  
  return (
    <ConverterPageTemplate
      title="SVG to BMP Converter - Bitmap Format"
      description="Convert SVG vector graphics to BMP bitmap format. Create Windows-compatible bitmap images with customizable bit depth and dimensions."
      keywords={["svg to bmp", "svg to bitmap", "vector to bmp", "svg to windows bitmap", "bmp converter"]}
      converterConfig={converterConfig}
      converterType={{
        from: "svg",
        to: "bmp",
        fromFull: "SVG",
        toFull: "BMP"
      }}
      heroTitle="SVG to BMP Converter"
      heroSubtitle="Transform SVG vector graphics into BMP bitmap format. Perfect for Windows applications and legacy software compatibility."
      converterComponent={<SvgToBmpSpecific />}
      features={[
        {
          title: "Multiple Bit Depths",
          description: "Choose between 24-bit RGB or 32-bit RGBA color depths for your BMP files"
        },
        {
          title: "Custom Dimensions",
          description: "Set specific width and height or maintain original SVG dimensions"
        },
        {
          title: "DPI Control",
          description: "Adjust dots per inch from 72 to 600 DPI for screen or print use"
        },
        {
          title: "Background Color",
          description: "Set custom background color for transparent SVG elements"
        },
        {
          title: "Client-Side Processing",
          description: "Fast conversion directly in your browser without server uploads"
        },
        {
          title: "Preserve Quality",
          description: "Maintains image quality during vector to raster conversion"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload SVG File",
          description: "Select your SVG vector graphic. All standard SVG features are supported."
        },
        {
          title: "Configure Settings",
          description: "Choose bit depth, dimensions, DPI, and background color options."
        },
        {
          title: "Download BMP",
          description: "Get your converted BMP file instantly with proper Windows bitmap headers."
        }
      ]}
      faqs={[
        {
          question: "What is BMP format?",
          answer: "BMP (Bitmap) is a raster graphics image file format used to store bitmap digital images. It's commonly used in Windows applications and supports various color depths."
        },
        {
          question: "What's the difference between 24-bit and 32-bit BMP?",
          answer: "24-bit BMP stores RGB color data (8 bits each for red, green, and blue). 32-bit BMP includes an additional 8-bit alpha channel for transparency, though not all applications support BMP transparency."
        },
        {
          question: "Why convert SVG to BMP?",
          answer: "BMP format is required by some legacy Windows applications, embedded systems, or specific software that doesn't support modern formats. It's also useful for pixel-perfect raster representations."
        },
        {
          question: "What DPI should I use?",
          answer: "Use 96 DPI for standard screen display, 150-300 DPI for printing, and 600 DPI for high-quality print applications. Higher DPI results in larger file sizes."
        },
        {
          question: "Are BMP files compressed?",
          answer: "This converter creates uncompressed BMP files for maximum compatibility. BMP files are typically larger than compressed formats like PNG or JPEG."
        }
      ]}
      relatedConverters={[
        {
          title: "BMP to SVG Converter",
          href: "/convert/bmp-to-svg",
          description: "Convert BMP bitmaps to vector format"
        },
        {
          title: "SVG to PNG Converter",
          href: "/convert/svg-to-png",
          description: "Convert SVG to PNG with transparency"
        },
        {
          title: "SVG to TIFF Converter",
          href: "/convert/svg-to-tiff",
          description: "Convert SVG to TIFF format"
        }
      ]}
      additionalSections={
        <>
          {/* SEO Content Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-[#4E342E] mb-6">
                Complete Guide to SVG to BMP Conversion
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Converting SVG to BMP format bridges the gap between modern scalable vector graphics 
                  and legacy bitmap systems. While BMP is an older format, it remains essential for 
                  Windows applications, embedded systems, and specific software that requires 
                  uncompressed raster images.
                </p>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Why Convert SVG to BMP?
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Legacy Software Support:</strong> Many older Windows applications only accept BMP format</li>
                  <li><strong>Embedded Systems:</strong> Simple bitmap format is ideal for resource-constrained devices</li>
                  <li><strong>Uncompressed Quality:</strong> BMP provides pixel-perfect representation without compression artifacts</li>
                  <li><strong>Windows Compatibility:</strong> Native format for Windows systems and applications</li>
                  <li><strong>Simple File Structure:</strong> Easy to parse and display in basic graphics systems</li>
                </ul>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Understanding BMP Format Options
                </h3>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  Bit Depth Selection
                </h4>
                <p>
                  Choose the right color depth for your specific needs:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>24-bit RGB:</strong> Standard color mode with 16.7 million colors, no transparency</li>
                  <li><strong>32-bit RGBA:</strong> Includes alpha channel for transparency, though not widely supported</li>
                  <li><strong>8-bit Indexed:</strong> 256 colors, smaller file size, suitable for simple graphics</li>
                  <li><strong>1-bit Monochrome:</strong> Black and white only, smallest file size</li>
                </ul>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  DPI and Resolution Settings
                </h4>
                <p>
                  Proper DPI selection ensures your BMP displays correctly across different systems:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>96 DPI:</strong> Standard Windows display resolution for screen viewing</li>
                  <li><strong>72 DPI:</strong> Web standard, smaller file sizes</li>
                  <li><strong>150-300 DPI:</strong> Print quality for documents and materials</li>
                  <li><strong>600 DPI:</strong> High-quality printing and professional output</li>
                </ul>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                  <h4 className="font-semibold text-[#4E342E] mb-2">Pro Tip: File Size Management</h4>
                  <p>
                    BMP files are uncompressed and can become very large. A 1000x1000 pixel 24-bit BMP 
                    will be approximately 3MB. Consider your file size requirements when setting dimensions 
                    and bit depth.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="py-16 bg-[#FAFAFA]">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Common Use Cases for SVG to BMP Conversion
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                From legacy system integration to embedded device graphics
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Legacy Windows Applications</h3>
                  <p className="text-gray-600 mb-4">Convert modern SVG graphics for use in older Windows software that only supports BMP format.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Industrial control software</li>
                    <li>• Legacy database systems</li>
                    <li>• Older CAD applications</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Embedded Systems</h3>
                  <p className="text-gray-600 mb-4">Simple bitmap format is perfect for microcontrollers and embedded displays with limited processing power.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• IoT device interfaces</li>
                    <li>• Industrial displays</li>
                    <li>• Automotive systems</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Game Development</h3>
                  <p className="text-gray-600 mb-4">Convert vector graphics to bitmap sprites for retro game engines or simple game frameworks.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Pixel art creation</li>
                    <li>• Retro game assets</li>
                    <li>• Simple game engines</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Scientific Applications</h3>
                  <p className="text-gray-600 mb-4">Research software often requires uncompressed image data for accurate analysis and processing.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Image analysis software</li>
                    <li>• Medical imaging systems</li>
                    <li>• Laboratory equipment</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Archival Storage</h3>
                  <p className="text-gray-600 mb-4">BMP's simple structure makes it ideal for long-term archival of graphics in uncompressed format.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Digital preservation</li>
                    <li>• Archive systems</li>
                    <li>• Backup formats</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Print Preparation</h3>
                  <p className="text-gray-600 mb-4">Some printing systems require BMP format for specific workflows or compatibility requirements.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Industrial printers</li>
                    <li>• Label printing systems</li>
                    <li>• Sign making equipment</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Technical Specifications and Best Practices
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Understanding BMP format specifications for optimal results
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">BMP Format Structure</h3>
                  <p className="text-gray-600 mb-4">
                    BMP files consist of four main sections that define the image data and metadata:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>File Header:</strong> Contains file signature, size, and data offset
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Info Header:</strong> Image dimensions, bit depth, and compression info
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Color Palette:</strong> Optional palette for indexed color modes
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Pixel Data:</strong> Raw image data stored bottom-to-top, left-to-right
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">Conversion Process</h3>
                  <p className="text-gray-600 mb-4">
                    Our converter handles the technical details of SVG rasterization and BMP encoding:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>SVG Parsing:</strong> Renders vector elements to canvas
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Rasterization:</strong> Converts vector data to pixel grid
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Color Processing:</strong> Applies bit depth and background settings
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>BMP Encoding:</strong> Writes proper BMP headers and pixel data
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-6 my-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">Quality Optimization Tips</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">For Sharp Graphics:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use high DPI (300+ for print)</li>
                      <li>• Choose appropriate bit depth</li>
                      <li>• Avoid anti-aliasing for pixel art</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For File Size Control:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use lower bit depths when possible</li>
                      <li>• Optimize dimensions for intended use</li>
                      <li>• Consider indexed color for simple graphics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    />
  )
}