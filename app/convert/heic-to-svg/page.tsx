import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import HeicToSvgSpecific from "@/components/converters/heic-to-svg-specific"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"

const converterConfig = getConverterBySlug("heic-to-svg")!
const currentUrl = "https://svgai.org/convert/heic-to-svg"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function HeicToSvgConverterPage() {
  const converterConfig = getConverterBySlug('heic-to-svg')!
  
  return (
    <ConverterPageTemplate
      title="HEIC to SVG Converter - iOS Photo Format"
      description="Convert HEIC photos from iPhone and iPad to SVG vector format. Free online tool with advanced vectorization for Apple's high-efficiency image format."
      keywords={["heic to svg", "heic converter", "heif to svg", "iphone photo converter", "ios image to vector"]}
      converterConfig={converterConfig}
      converterType={{
        from: "heic",
        to: "svg",
        fromFull: "HEIC",
        toFull: "SVG"
      }}
      heroTitle="HEIC to SVG Converter"
      heroSubtitle="Transform Apple HEIC/HEIF photos into scalable vector graphics. Perfect for converting iPhone and iPad photos for web use and design projects."
      converterComponent={<HeicToSvgSpecific />}
      features={[
        {
          title: "iOS Photo Support",
          description: "Full support for Apple's HEIC/HEIF format used by iPhone and iPad cameras"
        },
        {
          title: "Browser-Based Conversion",
          description: "Convert HEIC files directly in your browser using advanced JavaScript libraries"
        },
        {
          title: "Quality Preservation",
          description: "Maintains image quality during conversion with adjustable JPEG quality settings"
        },
        {
          title: "Advanced Vectorization",
          description: "Uses potrace algorithm to create high-quality vector paths from your photos"
        },
        {
          title: "Customizable Output",
          description: "Adjust threshold, optimization, and color settings for perfect vector results"
        },
        {
          title: "Privacy First",
          description: "All processing happens locally - your photos never leave your device"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Select HEIC File",
          description: "Choose your HEIC/HEIF photo from iPhone or iPad. Files are processed locally."
        },
        {
          title: "Configure Settings",
          description: "Adjust vectorization settings like threshold and quality for optimal results."
        },
        {
          title: "Download SVG",
          description: "Get your converted SVG file instantly. Perfect for logos and simple graphics."
        }
      ]}
      faqs={[
        {
          question: "What is HEIC format?",
          answer: "HEIC (High Efficiency Image Container) is Apple's default photo format for iOS 11 and later. It provides better compression than JPEG while maintaining quality, but has limited support outside Apple devices."
        },
        {
          question: "Which browsers support HEIC conversion?",
          answer: "Our HEIC to SVG converter works best in modern browsers like Chrome, Firefox, Safari, and Edge. The conversion uses JavaScript libraries that provide cross-browser compatibility."
        },
        {
          question: "Is HEIC to SVG conversion suitable for photos?",
          answer: "SVG works best for simple graphics with clear shapes and limited colors. Complex photos may result in very large SVG files. For photos, consider converting to PNG or JPG instead."
        },
        {
          question: "How is HEIC converted to SVG?",
          answer: "The converter first decodes the HEIC file to a bitmap format, then applies vectorization algorithms to trace the image and create SVG paths. This works best with logos and simple graphics."
        },
        {
          question: "Can I convert multiple HEIC files?",
          answer: "Our converter processes one file at a time to ensure optimal quality and browser performance. You can convert files sequentially as needed."
        }
      ]}
      relatedConverters={[
        {
          title: "SVG to HEIC Converter",
          href: "/convert/svg-to-heic",
          description: "Convert SVG files to HEIC format"
        },
        {
          title: "PNG to SVG Converter",
          href: "/convert/png-to-svg",
          description: "Convert PNG images to vector format"
        },
        {
          title: "JPG to SVG Converter",
          href: "/convert/jpg-to-svg",
          description: "Convert JPEG photos to SVG"
        }
      ]}
    />
  )
}