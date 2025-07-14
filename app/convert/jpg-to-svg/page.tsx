import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import JpgToSvgConverter from "./jpg-to-svg-converter"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("jpg-to-svg")!
const currentUrl = "https://svgai.org/convert/jpg-to-svg"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

// Structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JPG to SVG Converter",
  "description": "Free online tool to convert JPG/JPEG images to SVG vector format",
  "url": "https://svgai.org/convert/jpg-to-svg",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Convert JPG to SVG",
    "Advanced vectorization options",
    "Color and monochrome output",
    "Client-side processing",
    "No file upload required"
  ]
}

export default function JpgToSvgPage() {
  const converterConfig = getConverterBySlug('jpg-to-svg')!
  
  const features = [
    {
      title: "Advanced Vectorization",
      description: "Powerful tracing algorithms convert raster JPG images into clean, scalable SVG paths with customizable detail levels"
    },
    {
      title: "Color & Monochrome Support",
      description: "Choose between full-color posterized output or crisp monochrome vectors for logos and line art"
    },
    {
      title: "Privacy-First Processing",
      description: "All conversion happens locally in your browser - your images never leave your device"
    },
    {
      title: "Customizable Output",
      description: "Fine-tune threshold, optimization level, and color depth for perfect vectorization results"
    },
    {
      title: "Professional Quality",
      description: "Industry-standard Potrace algorithm ensures high-quality vector output suitable for print and web"
    }
  ]

  const howItWorksSteps = [
    {
      title: "Upload JPG/JPEG File",
      description: "Drag and drop or select your JPG image. Files are processed locally for maximum privacy."
    },
    {
      title: "Adjust Settings",
      description: "Choose color mode, adjust threshold, and set optimization level for your specific needs."
    },
    {
      title: "Download SVG",
      description: "Get your vectorized SVG file instantly. Use it anywhere - from websites to print designs."
    }
  ]

  const faqs = [
    {
      question: "How does JPG to SVG conversion work?",
      answer: "Our converter uses advanced tracing algorithms to analyze your JPG image and convert it into vector paths. The process identifies edges and shapes in your raster image and creates corresponding SVG paths, resulting in a scalable vector graphic that maintains quality at any size."
    },
    {
      question: "What's the difference between color and monochrome output?",
      answer: "Monochrome output creates a single-color SVG (typically black on transparent), ideal for logos and simple graphics. Color output uses posterization to create multiple color layers, preserving more of the original image's appearance but resulting in a larger file size."
    },
    {
      question: "Can I convert photographs to SVG?",
      answer: "Yes, but results vary depending on the image. Simple images with clear edges and limited colors work best. Complex photographs may require adjustment of threshold and color settings. For best results with photos, consider using the color mode with lower posterization levels."
    },
    {
      question: "What are the optimal settings for logo conversion?",
      answer: "For logos, use monochrome mode with a threshold around 128 (adjust based on your logo). Set optimization to high (8-10) for cleaner paths. If your logo has multiple colors, use color mode with 2-4 color levels for best results."
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, we support JPG files up to 100MB. Larger files may cause performance issues since all processing happens in your browser. For optimal performance, we recommend keeping files under 10MB."
    },
    {
      question: "Can I use the converted SVG files commercially?",
      answer: "Yes, you retain all rights to your converted files. Our tool simply processes your images - we don't claim any ownership. Use your SVG files in any personal or commercial project without restrictions."
    },
    {
      question: "Why is my SVG file larger than the original JPG?",
      answer: "SVG files can be larger than JPGs when converting complex images because they store path data instead of pixels. For simpler images or when using higher optimization settings, SVG files are often smaller. The benefit is infinite scalability without quality loss."
    },
    {
      question: "Can I edit the SVG after conversion?",
      answer: "Absolutely! SVG files can be edited in vector graphics software like Adobe Illustrator, Inkscape, or even directly in code. You can modify colors, adjust paths, add elements, or integrate the SVG into your designs."
    }
  ]

  const relatedConverters = [
    {
      title: "PNG to SVG Converter",
      href: "/convert/png-to-svg",
      description: "Convert PNG images with transparency to scalable vector graphics"
    },
    {
      title: "SVG to PNG Converter",
      href: "/convert/svg-to-png",
      description: "Convert SVG vectors back to PNG format with custom dimensions"
    },
    {
      title: "WebP to SVG Converter",
      href: "/convert/webp-to-svg",
      description: "Transform modern WebP images into editable SVG vectors"
    },
    {
      title: "BMP to SVG Converter",
      href: "/convert/bmp-to-svg",
      description: "Convert bitmap images to scalable vector format"
    },
    {
      title: "GIF to SVG Converter",
      href: "/convert/gif-to-svg",
      description: "Turn GIF images into vector graphics (first frame)"
    },
    {
      title: "SVG to JPG Converter",
      href: "/convert/svg-to-jpg",
      description: "Export SVG vectors as JPG images with quality control"
    }
  ]

  const additionalSections = (
    <>
      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
            Perfect for Every Design Need
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            From logo vectorization to artistic effects, our JPG to SVG converter handles it all
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Logo Vectorization</h3>
              <p className="text-gray-600">Convert JPG logos to SVG for infinite scalability on business cards, billboards, and websites without quality loss.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Web Graphics</h3>
              <p className="text-gray-600">Transform JPG images into lightweight SVGs for faster loading times and crisp display on retina screens.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Print Design</h3>
              <p className="text-gray-600">Create resolution-independent graphics perfect for print materials at any size without pixelation.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Icon Creation</h3>
              <p className="text-gray-600">Convert JPG icons to SVG format for use in apps and websites with perfect clarity at all sizes.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">Artistic Effects</h3>
              <p className="text-gray-600">Use posterization to create unique artistic interpretations of photographs and complex images.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#4E342E]">CAD & Technical</h3>
              <p className="text-gray-600">Convert technical drawings and diagrams from JPG to editable vector format for CAD applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">
            Advanced Conversion Technology
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Powered by industry-standard algorithms for professional results
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#4E342E]">Potrace Algorithm</h3>
              <p className="text-gray-600 mb-4">
                Our converter uses the renowned Potrace algorithm, the same technology used in professional design software. It intelligently traces bitmap images to create smooth, optimized vector paths.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Adaptive corner detection for sharp edges
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Curve optimization for smaller file sizes
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Turnpolicy options for different tracing styles
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#4E342E]">Image Pre-Processing</h3>
              <p className="text-gray-600 mb-4">
                Before vectorization, we apply advanced image processing to ensure optimal results. This includes automatic adjustments that can be fine-tuned to your needs.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Contrast and brightness optimization
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Optional sharpening for clearer edges
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7043] mr-2">•</span>
                  Color quantization for posterization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ConverterPageTemplate
        title="JPG to SVG Converter"
        description="Convert JPG/JPEG images to scalable vector graphics online"
        keywords={[
          "jpg to svg",
          "jpeg to svg",
          "jpg to svg converter",
          "jpeg to vector",
          "image to svg",
          "jpg svg converter",
          "convert jpg to svg online",
          "free jpg to svg",
          "jpg to svg online",
          "jpeg to svg converter free"
        ]}
        converterConfig={converterConfig}
        converterType={{
          from: "jpg",
          to: "svg",
          fromFull: "JPG/JPEG",
          toFull: "SVG"
        }}
        heroTitle="JPG to SVG Converter"
        heroSubtitle="Transform your JPG and JPEG images into scalable vector graphics with advanced tracing technology. Free, fast, and completely secure."
        converterComponent={<JpgToSvgConverter />}
        features={features}
        howItWorksSteps={howItWorksSteps}
        faqs={faqs}
        relatedConverters={relatedConverters}
        additionalSections={additionalSections}
      />
    </>
  )
}