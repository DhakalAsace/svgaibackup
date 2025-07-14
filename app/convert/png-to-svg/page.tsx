import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import PngToSvgSpecific from "@/components/converters/png-to-svg-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("png-to-svg")!
const currentUrl = "https://svgai.org/convert/png-to-svg"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function PngToSvgConverterPage() {
  return (
    <ConverterPageTemplate
      title={converterConfig.metaTitle}
      description={converterConfig.metaDescription}
      keywords={converterConfig.keywords}
      converterConfig={converterConfig}
      converterType={{
        from: "png",
        to: "svg",
        fromFull: "PNG",
        toFull: "SVG"
      }}
      heroTitle="PNG to SVG Converter"
      heroSubtitle="Transform raster PNG images into scalable vector graphics with our free online converter. Perfect for logos, icons, and illustrations."
      converterComponent={<PngToSvgSpecific />}
      features={[
        {
          title: "Advanced Vectorization",
          description: "Uses state-of-the-art tracing algorithms to convert your PNG images into high-quality vector graphics"
        },
        {
          title: "Customizable Settings",
          description: "Fine-tune threshold, optimization level, and color modes for perfect results every time"
        },
        {
          title: "Preserve Image Quality",
          description: "Our intelligent conversion process maintains the visual quality of your original PNG image"
        },
        {
          title: "Perfect for Logos",
          description: "Ideal for converting PNG logos into scalable SVG format for use at any size without quality loss"
        },
        {
          title: "No Upload Required",
          description: "All conversion happens locally in your browser - your files never leave your device"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload PNG Image",
          description: "Select or drag-drop your PNG file into the converter. Supports images up to 50MB."
        },
        {
          title: "Adjust Settings",
          description: "Fine-tune conversion parameters like threshold and optimization level for best results."
        },
        {
          title: "Convert & Download",
          description: "Click convert and download your new SVG file instantly. No waiting or sign-up required."
        }
      ]}
      faqs={[
        {
          question: "How does PNG to SVG conversion work?",
          answer: "Our converter uses advanced tracing algorithms to analyze your PNG image and create vector paths that represent the shapes and colors in your image. This process, called vectorization or tracing, converts pixel-based images into mathematical descriptions of shapes."
        },
        {
          question: "What types of PNG images convert best to SVG?",
          answer: "Simple images with clear shapes and limited colors convert best. This includes logos, icons, simple illustrations, and text. Photographs and complex images with gradients may not convert as well and might result in very large SVG files."
        },
        {
          question: "Will the SVG file be smaller than my PNG?",
          answer: "For simple graphics with few colors, SVG files are often smaller than PNGs. However, complex images may result in larger SVG files. The benefit of SVG is not just file size, but the ability to scale to any size without quality loss."
        },
        {
          question: "Can I edit the SVG after conversion?",
          answer: "Yes! SVG files can be edited in vector graphics software like Adobe Illustrator, Inkscape, or even with a text editor. You can modify colors, shapes, and paths after conversion."
        },
        {
          question: "Is PNG transparency preserved in the SVG?",
          answer: "Yes, our converter preserves transparency from your PNG images. Transparent areas in your PNG will remain transparent in the resulting SVG file."
        },
        {
          question: "What's the difference between PNG and SVG?",
          answer: "PNG is a raster format that uses pixels and has fixed dimensions, while SVG is a vector format that uses mathematical descriptions and scales infinitely without quality loss. SVG is ideal for logos and simple graphics."
        },
        {
          question: "What's the maximum file size supported?",
          answer: "Our converter supports PNG files up to 50MB. For larger files, consider optimizing your PNG first or breaking it into smaller sections."
        }
      ]}
      relatedConverters={[
        {
          title: "SVG to PNG Converter",
          href: "/convert/svg-to-png",
          description: "Convert scalable vector graphics back to PNG format with custom dimensions"
        },
        {
          title: "JPG to SVG Converter",
          href: "/convert/jpg-to-svg",
          description: "Transform JPEG images into scalable vector graphics"
        },
        {
          title: "Image to SVG Converter", 
          href: "/convert/image-to-svg",
          description: "Universal image converter supporting multiple input formats"
        },
        {
          title: "WebP to SVG Converter",
          href: "/convert/webp-to-svg", 
          description: "Convert modern WebP images to scalable vector format"
        },
        {
          title: "SVG to PDF Converter",
          href: "/convert/svg-to-pdf",
          description: "Export SVG graphics as PDF documents for printing"
        },
        {
          title: "SVG Optimizer",
          href: "/tools/svg-optimizer",
          description: "Optimize and compress SVG files for better performance"
        }
      ]}
      additionalSections={
        <>
          {/* SEO Content Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-[#4E342E] mb-6">
                Complete Guide to PNG to SVG Conversion
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Converting PNG to SVG is essential for creating scalable graphics that maintain perfect
                  quality at any size. Unlike PNG files that are pixel-based, SVG files use mathematical
                  descriptions to create infinitely scalable vector graphics.
                </p>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Why Convert PNG to SVG?
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Infinite Scalability:</strong> SVG graphics scale perfectly from favicon size to billboard size</li>
                  <li><strong>Smaller File Sizes:</strong> Simple graphics often result in smaller SVG files than PNG</li>
                  <li><strong>Web Performance:</strong> Faster loading times and better Core Web Vitals scores</li>
                  <li><strong>SEO Benefits:</strong> Text content in SVG is indexable by search engines</li>
                  <li><strong>Easy Editing:</strong> Modify colors, shapes, and text directly in code or design software</li>
                </ul>
                
                <h3 className="text-2xl font-semibold text-[#4E342E] mt-8 mb-4">
                  Best Practices for PNG to SVG Conversion
                </h3>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  1. Optimal Source Images
                </h4>
                <p>
                  Use high-resolution PNG files with clear, distinct shapes and limited colors. Images with
                  sharp edges and solid colors convert best to vector format.
                </p>
                
                <h4 className="text-xl font-semibold text-[#4E342E] mt-6 mb-3">
                  2. Conversion Settings
                </h4>
                <p>
                  Adjust threshold settings based on your image type. Higher thresholds work better for
                  simple graphics, while lower thresholds preserve more detail in complex images.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                  <h4 className="font-semibold text-[#4E342E] mb-2">Pro Tip: Logo Conversion</h4>
                  <p>
                    For logo conversion, start with a PNG that has transparent background and use
                    monochrome mode for single-color logos or color mode for multi-color designs.
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