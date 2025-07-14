import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import SvgToTiffSpecific from "@/components/converters/svg-to-tiff-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("svg-to-tiff")!
const currentUrl = "https://svgai.org/convert/svg-to-tiff"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function SvgToTiffConverterPage() {
  const converterConfig = getConverterBySlug('svg-to-tiff')!
  
  return (
    <ConverterPageTemplate
      title="SVG to TIFF Converter - Free Online Tool"
      description="Convert SVG files to TIFF format with professional quality. Features high DPI support, multiple compression options, and advanced rasterization settings."
      keywords={["svg to tiff", "svg to tiff converter", "convert svg to tiff", "svg rasterizer", "professional printing"]}
      converterConfig={converterConfig}
      converterType={{
        from: "svg",
        to: "tiff",
        fromFull: "SVG",
        toFull: "TIFF"
      }}
      heroTitle="SVG to TIFF Converter"
      heroSubtitle="Convert scalable vector graphics to TIFF format for professional printing and archival. High DPI support with multiple compression options."
      converterComponent={<SvgToTiffSpecific />}
      features={[
        {
          title: "High DPI Support",
          description: "Export at up to 600 DPI for professional printing and archival quality"
        },
        {
          title: "Multiple Compressions",
          description: "Choose from LZW, Deflate, JPEG, or uncompressed TIFF output formats"
        },
        {
          title: "Professional Quality",
          description: "Perfect for prepress, professional printing, and high-quality archival"
        },
        {
          title: "Bit Depth Control",
          description: "Select from 1-bit to 8-bit color depth based on your requirements"
        },
        {
          title: "Predictor Options",
          description: "Advanced compression settings with horizontal and float predictors"
        },
        {
          title: "Instant Conversion",
          description: "Fast browser-based conversion with no server uploads required"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload SVG File",
          description: "Select or drag-drop your SVG file into the converter interface."
        },
        {
          title: "Configure Settings",
          description: "Set DPI, compression method, bit depth, and other output parameters."
        },
        {
          title: "Download TIFF",
          description: "Click convert and download your high-quality TIFF file instantly."
        }
      ]}
      faqs={[
        {
          question: "What DPI should I use for printing?",
          answer: "For professional printing, use 300 DPI or higher. For screen display, 72-150 DPI is sufficient. For high-quality archival or large format printing, consider 600 DPI."
        },
        {
          question: "Which compression method should I choose?",
          answer: "LZW and Deflate provide lossless compression with good file size reduction. JPEG compression is lossy but creates smaller files. Choose 'None' for maximum compatibility but larger file sizes."
        },
        {
          question: "What is a predictor in TIFF compression?",
          answer: "Predictors improve compression efficiency for LZW and Deflate methods. 'Horizontal' predictor works well for most images, while 'Float' is optimized for floating-point data."
        },
        {
          question: "Can I convert SVG files efficiently?",
          answer: "The converter processes one file at a time for optimal quality control. You can convert files sequentially with your preferred settings."
        },
        {
          question: "What's the difference in bit depths?",
          answer: "1-bit creates black and white images, 4-bit supports 16 colors, and 8-bit supports 256 colors or grayscale. Higher bit depth means better color accuracy but larger file sizes."
        }
      ]}
      relatedConverters={[
        {
          title: "TIFF to SVG Converter",
          href: "/convert/tiff-to-svg",
          description: "Convert TIFF images back to SVG format"
        },
        {
          title: "SVG to PNG Converter",
          href: "/convert/svg-to-png",
          description: "Convert SVG to PNG with transparency"
        },
        {
          title: "SVG to PDF Converter",
          href: "/convert/svg-to-pdf",
          description: "Convert SVG to PDF for documents"
        }
      ]}
      additionalSections={
        <>
          {/* SEO Content Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-[#4E342E] mb-6">
                Professional Guide to SVG to TIFF Conversion
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  TIFF (Tagged Image File Format) is the gold standard for professional printing, 
                  archival storage, and high-quality image reproduction. Converting SVG to TIFF 
                  transforms scalable vector graphics into a format trusted by print professionals, 
                  photographers, and archival institutions worldwide.
                </p>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Why Choose TIFF for Professional Work?
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Lossless Quality:</strong> TIFF preserves every detail without compression artifacts</li>
                  <li><strong>Professional Standard:</strong> Industry-standard format for prepress and commercial printing</li>
                  <li><strong>Archival Quality:</strong> Long-term stability for preservation and documentation</li>
                  <li><strong>Metadata Support:</strong> Extensive metadata storage for professional workflows</li>
                  <li><strong>Color Management:</strong> Accurate color reproduction with ICC profile support</li>
                  <li><strong>High Bit Depth:</strong> Support for 16-bit per channel for maximum color accuracy</li>
                </ul>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Understanding TIFF Compression Options
                </h3>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  Lossless Compression Methods
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>LZW Compression:</strong> Efficient lossless compression, good for images with repeating patterns</li>
                  <li><strong>ZIP/Deflate:</strong> Modern compression algorithm with excellent compression ratios</li>
                  <li><strong>PackBits:</strong> Simple compression, widely compatible but less efficient</li>
                  <li><strong>Uncompressed:</strong> Maximum compatibility and fastest access, but largest file sizes</li>
                </ul>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  Lossy Compression for Specific Uses
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>JPEG Compression:</strong> Smaller files for archival of photographic content</li>
                  <li><strong>Quality Control:</strong> Adjustable quality levels from 1-100</li>
                  <li><strong>Use Cases:</strong> When file size is critical and slight quality loss is acceptable</li>
                </ul>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
                  <h4 className="font-semibold text-[#4E342E] mb-2">Archival Best Practice</h4>
                  <p>
                    For long-term archival storage, use uncompressed TIFF at 300-600 DPI with 
                    embedded ICC color profiles. This ensures maximum compatibility and quality 
                    preservation for decades to come.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Use Cases Section */}
          <section className="py-16 bg-[#FAFAFA]">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Professional Applications for SVG to TIFF Conversion
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                From commercial printing to digital archiving, TIFF delivers professional results
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Commercial Printing</h3>
                  <p className="text-gray-600 mb-4">Professional prepress workflows require TIFF format for offset and digital printing operations.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Magazine and book publishing</li>
                    <li>• Large format printing</li>
                    <li>• Packaging and label design</li>
                    <li>• Marketing materials</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Digital Archiving</h3>
                  <p className="text-gray-600 mb-4">Museums, libraries, and institutions use TIFF for long-term preservation of digital assets.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Museum collections</li>
                    <li>• Historical documents</li>
                    <li>• Corporate archives</li>
                    <li>• Legal documentation</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Professional Photography</h3>
                  <p className="text-gray-600 mb-4">Photographers use TIFF for high-quality image storage and post-processing workflows.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• RAW file processing</li>
                    <li>• Print preparation</li>
                    <li>• Client deliverables</li>
                    <li>• Stock photography</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Medical Imaging</h3>
                  <p className="text-gray-600 mb-4">Healthcare systems rely on TIFF for medical image storage and DICOM compatibility.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• DICOM image conversion</li>
                    <li>• Medical documentation</li>
                    <li>• Research imaging</li>
                    <li>• Telemedicine</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Scientific Research</h3>
                  <p className="text-gray-600 mb-4">Research institutions require TIFF for accurate data visualization and publication.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Scientific publications</li>
                    <li>• Microscopy imaging</li>
                    <li>• Data visualization</li>
                    <li>• Grant documentation</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Design Agencies</h3>
                  <p className="text-gray-600 mb-4">Creative agencies use TIFF for client deliverables and cross-platform compatibility.</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Client presentations</li>
                    <li>• Brand asset libraries</li>
                    <li>• Cross-platform projects</li>
                    <li>• Print production</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Specifications Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
                Advanced TIFF Specifications and Optimization
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Professional-grade conversion settings for every workflow
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">Resolution Guidelines</h3>
                  <p className="text-gray-600 mb-4">
                    Choose the optimal resolution based on your output requirements:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>72-96 DPI:</strong> Screen display and web use
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>150 DPI:</strong> Draft printing and proofing
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>300 DPI:</strong> Standard print quality for magazines and brochures
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>600 DPI:</strong> High-quality printing and archival storage
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#4E342E]">Color Management</h3>
                  <p className="text-gray-600 mb-4">
                    Ensure accurate color reproduction across devices and media:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>sRGB Profile:</strong> Standard for web and screen display
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>Adobe RGB:</strong> Wider gamut for professional photography
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>ProPhoto RGB:</strong> Maximum color space for editing
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF7043] mr-2 font-bold">•</span>
                      <div>
                        <strong>CMYK Profiles:</strong> For offset printing workflows
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 my-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">File Size Optimization Strategies</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Maximum Quality:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Uncompressed TIFF</li>
                      <li>• 16-bit color depth</li>
                      <li>• Embedded ICC profiles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Balanced Approach:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• LZW or ZIP compression</li>
                      <li>• 8-bit color depth</li>
                      <li>• Standard ICC profiles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Space Efficient:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• JPEG compression</li>
                      <li>• Lower bit depths</li>
                      <li>• Reduced metadata</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-6 my-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E342E] mb-3">Workflow Integration Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Naming Convention:</strong> Use descriptive filenames with version numbers</li>
                  <li>• <strong>Metadata Preservation:</strong> Include creator, copyright, and description information</li>
                  <li>• <strong>Version Control:</strong> Maintain both compressed and uncompressed versions</li>
                  <li>• <strong>Backup Strategy:</strong> Store archival TIFFs in multiple locations</li>
                  <li>• <strong>Quality Control:</strong> Verify color accuracy on calibrated displays</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      }
    />
  )
}