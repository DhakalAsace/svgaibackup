import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import SvgToPngConverter from "./svg-to-png-converter"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("svg-to-png")!
const currentUrl = "https://svgai.org/convert/svg-to-png"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function SvgToPngPage() {
  return (
    <ConverterPageTemplate
      title={converterConfig.metaTitle}
      description={converterConfig.metaDescription}
      keywords={converterConfig.keywords}
      converterConfig={converterConfig}
        converterType={{
          from: "svg",
          to: "png",
          fromFull: "SVG",
          toFull: "PNG"
        }}
        heroTitle="SVG to PNG Converter"
        heroSubtitle="Convert scalable vector graphics to high-quality PNG images instantly. Free, secure, and works entirely in your browser."
        converterComponent={<SvgToPngConverter />}
        features={[
          {
            title: "High-Quality Conversion",
            description: "Preserve the quality of your SVG graphics with adjustable DPI settings up to 600 DPI for print-quality output"
          },
          {
            title: "Custom Dimensions",
            description: "Set custom width and height for your PNG output, or maintain the original SVG dimensions with aspect ratio lock"
          },
          {
            title: "Transparent Background",
            description: "Export PNG files with transparent backgrounds to maintain design flexibility in your projects"
          },
          {
            title: "Browser-Based Processing",
            description: "All conversion happens locally in your browser - your files never leave your device for maximum privacy"
          },
          {
            title: "No Watermarks",
            description: "Get clean PNG files without any watermarks or branding - perfect for professional use"
          }
        ]}
        howItWorksSteps={[
          {
            title: "Upload SVG File",
            description: "Drag and drop your SVG file or click to browse. Files are processed locally for instant conversion."
          },
          {
            title: "Customize Settings",
            description: "Adjust dimensions, DPI, quality, and background color to match your specific needs."
          },
          {
            title: "Download PNG",
            description: "Click convert and download your high-quality PNG file instantly. No signup or fees required."
          }
        ]}
        faqs={[
          {
            question: "What is the difference between SVG and PNG?",
            answer: "SVG (Scalable Vector Graphics) is a vector format that uses mathematical formulas to create images, making them infinitely scalable without quality loss. PNG (Portable Network Graphics) is a raster format that uses pixels, making it ideal for photographs and complex images but with fixed dimensions."
          },
          {
            question: "When should I convert SVG to PNG?",
            answer: "Convert SVG to PNG when you need compatibility with software that doesn't support SVG, when uploading to platforms that require raster images, or when you need a specific pixel dimension for web or print use."
          },
          {
            question: "What DPI should I use for my conversion?",
            answer: "For web use, 72-96 DPI is sufficient. For print materials, use 300 DPI or higher. For high-quality prints or professional work, 600 DPI provides the best results."
          },
          {
            question: "Can I convert animated SVGs to PNG?",
            answer: "This converter captures the static state of your SVG. For animated SVGs, the PNG will show the initial frame. For animated outputs, consider our SVG to GIF converter."
          },
          {
            question: "What's the maximum file size supported?",
            answer: "Our converter supports SVG files up to 50MB. For larger files, consider optimizing your SVG first using our SVG optimizer tool."
          },
          {
            question: "Will text in my SVG be preserved?",
            answer: "Yes, all text in your SVG will be rendered in the PNG output. Make sure your SVG uses standard fonts or has fonts embedded for best results."
          },
          {
            question: "Is the conversion quality as good as desktop software?",
            answer: "Yes, our converter uses professional-grade algorithms that match or exceed the quality of most desktop applications, with the added benefit of being free and requiring no installation."
          }
        ]}
        relatedConverters={[
          {
            title: "PNG to SVG Converter",
            href: "/convert/png-to-svg",
            description: "Convert raster PNG images back to scalable vector graphics"
          },
          {
            title: "SVG to JPG Converter",
            href: "/convert/svg-to-jpg",
            description: "Convert SVG files to JPEG format for photographs and web images"
          },
          {
            title: "SVG to PDF Converter",
            href: "/convert/svg-to-pdf",
            description: "Convert SVG graphics to PDF documents for printing and sharing"
          },
          {
            title: "SVG to WebP Converter",
            href: "/convert/svg-to-webp",
            description: "Convert SVG to modern WebP format for better web performance"
          },
          {
            title: "SVG to ICO Converter",
            href: "/convert/svg-to-ico",
            description: "Create favicon ICO files from your SVG graphics"
          },
          {
            title: "SVG Optimizer",
            href: "/tools/svg-optimizer",
            description: "Optimize and compress SVG files before conversion"
          }
        ]}
        additionalSections={
          <>
            {/* SEO Content Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-[#4E342E] mb-6">
                  Complete Guide to SVG to PNG Conversion
                </h2>
                
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>
                    Converting SVG to PNG is one of the most common image format conversions needed by designers, 
                    developers, and content creators. While SVG files offer infinite scalability and small file sizes 
                    for simple graphics, PNG format provides universal compatibility and is ideal for complex images 
                    with transparency.
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                    Why Convert SVG to PNG?
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Universal Compatibility:</strong> PNG is supported by virtually all image viewers, editors, and web browsers</li>
                    <li><strong>Social Media:</strong> Most social platforms require raster images like PNG for uploads</li>
                    <li><strong>Email Signatures:</strong> PNG images display correctly in all email clients</li>
                    <li><strong>Legacy Software:</strong> Older applications often don't support SVG format</li>
                    <li><strong>Fixed Dimensions:</strong> When you need images at specific pixel dimensions</li>
                  </ul>
                  
                  <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                    Best Practices for SVG to PNG Conversion
                  </h3>
                  <p>
                    To get the best results when converting SVG to PNG, consider these important factors:
                  </p>
                  
                  <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                    1. Choose the Right DPI
                  </h4>
                  <p>
                    DPI (dots per inch) determines the resolution of your PNG output. For web use, 72-96 DPI is 
                    standard. For print materials, use 300 DPI or higher. Our converter supports up to 600 DPI 
                    for professional print quality.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                    2. Set Appropriate Dimensions
                  </h4>
                  <p>
                    Unlike SVG files that scale infinitely, PNG files have fixed dimensions. Consider your intended 
                    use: social media posts often require specific sizes (1080x1080 for Instagram, 1200x630 for 
                    Facebook), while web graphics should be optimized for fast loading.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                    3. Background Transparency
                  </h4>
                  <p>
                    PNG supports transparency, making it ideal for logos and graphics that need to work on various 
                    backgrounds. Our converter preserves transparency by default, but you can add a solid background 
                    color if needed.
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                    Common Use Cases
                  </h3>
                  
                  <div className="bg-gray-50 p-6 rounded-lg my-6">
                    <h4 className="font-semibold text-[#4E342E] mb-3">Web Development</h4>
                    <p>
                      Convert SVG icons to PNG for better compatibility with older browsers or when creating 
                      favicon sets that require multiple formats.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg my-6">
                    <h4 className="font-semibold text-[#4E342E] mb-3">Print Design</h4>
                    <p>
                      Export SVG logos and graphics to high-resolution PNG files for business cards, brochures, 
                      and other print materials where vector format isn't supported.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg my-6">
                    <h4 className="font-semibold text-[#4E342E] mb-3">Digital Marketing</h4>
                    <p>
                      Create PNG versions of SVG graphics for email campaigns, social media posts, and digital 
                      advertisements that require raster images.
                    </p>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                    Technical Details
                  </h3>
                  <p>
                    Our SVG to PNG converter uses advanced rendering algorithms to ensure accurate conversion:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Preserves all SVG elements including paths, shapes, text, and gradients</li>
                    <li>Maintains color accuracy with full RGB color space support</li>
                    <li>Handles complex SVG features like masks, filters, and patterns</li>
                    <li>Optimizes PNG output for smaller file sizes without quality loss</li>
                  </ul>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                    <h4 className="font-semibold text-[#4E342E] mb-2">Pro Tip: Consistent Quality</h4>
                    <p>
                      Our converter remembers your settings between conversions, 
                      making it easy to maintain consistent output quality across all your graphics.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        }
      />
  )
}