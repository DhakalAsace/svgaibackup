import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import SvgToHeicSpecific from "@/components/converters/svg-to-heic-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("svg-to-heic")!
const currentUrl = "https://svgai.org/convert/svg-to-heic"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function SvgToHeicConverterPage() {
  const converterConfig = getConverterBySlug('svg-to-heic')!
  
  return (
    <ConverterPageTemplate
      title="SVG to HEIC Converter - iOS Format"
      description="Convert SVG vector graphics to HEIC format for optimal use on iOS devices. Free online converter with customizable quality settings."
      keywords={["svg to heic", "svg to heif", "vector to heic", "svg to ios", "apple format converter"]}
      converterConfig={converterConfig}
      converterType={{
        from: "svg",
        to: "heic",
        fromFull: "SVG",
        toFull: "HEIC"
      }}
      heroTitle="SVG to HEIC Converter"
      heroSubtitle="Transform SVG vector graphics into Apple's HEIC format. Note: Due to browser limitations, this creates a high-quality JPEG that can be used as HEIC."
      converterComponent={<SvgToHeicSpecific />}
      features={[
        {
          title: "High-Quality Rasterization",
          description: "Converts SVG vectors to high-resolution raster images suitable for iOS devices"
        },
        {
          title: "Customizable Resolution",
          description: "Set custom dimensions and DPI for optimal quality on retina displays"
        },
        {
          title: "Background Options",
          description: "Choose background color or transparency for your converted images"
        },
        {
          title: "Quality Control",
          description: "Adjust compression quality from 50-100% for perfect file size balance"
        },
        {
          title: "Browser Compatible",
          description: "Works in all modern browsers, though outputs JPEG due to HEIC encoding limitations"
        },
        {
          title: "Instant Processing",
          description: "Fast conversion directly in your browser without server uploads"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload SVG File",
          description: "Select your SVG vector graphic. All common SVG features are supported."
        },
        {
          title: "Set Output Options",
          description: "Choose dimensions, quality, and background settings for the conversion."
        },
        {
          title: "Download Result",
          description: "Get your converted file instantly. Note: Outputs high-quality JPEG format."
        }
      ]}
      faqs={[
        {
          question: "Why does this output JPEG instead of HEIC?",
          answer: "Due to browser limitations, true HEIC encoding is not available in web browsers. This converter creates a high-quality JPEG that maintains excellent quality and can be renamed to .heic for compatibility with Apple devices."
        },
        {
          question: "Can I use the output on iOS devices?",
          answer: "Yes! While the output is technically JPEG format, iOS devices can display JPEG images perfectly. The high quality settings ensure your images look great on retina displays."
        },
        {
          question: "What SVG features are supported?",
          answer: "All standard SVG features including paths, shapes, text, gradients, and patterns are supported. Complex filters and animations are rendered as static images."
        },
        {
          question: "How do I get true HEIC files?",
          answer: "For true HEIC encoding, you would need to use native iOS apps or desktop software like Apple's Preview app or professional image editors that support HEIC export."
        },
        {
          question: "What's the best quality setting?",
          answer: "For most uses, 90-95% quality provides excellent results with reasonable file sizes. Use 100% for maximum quality when file size isn't a concern."
        }
      ]}
      relatedConverters={[
        {
          title: "HEIC to SVG Converter",
          href: "/convert/heic-to-svg",
          description: "Convert HEIC photos to vector format"
        },
        {
          title: "SVG to PNG Converter",
          href: "/convert/svg-to-png",
          description: "Convert SVG to PNG with transparency"
        },
        {
          title: "SVG to JPG Converter",
          href: "/convert/svg-to-jpg",
          description: "Convert SVG to JPEG format"
        }
      ]}
    />
  )
}