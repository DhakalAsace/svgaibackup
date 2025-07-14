import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"
import SvgToPdfSpecific from "@/components/converters/svg-to-pdf-specific"

const converterConfig = getConverterBySlug("svg-to-pdf")!
const currentUrl = "https://svgai.org/convert/svg-to-pdf"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

export default function SvgToPdfConverterPage() {
  const converterConfig = getConverterBySlug('svg-to-pdf')!
  
  return (
    <ConverterPageTemplate
      title="SVG to PDF Converter - Free Online Tool"
      description="Convert SVG to PDF while preserving vector quality. Perfect for printing, archiving & sharing. Free online tool with custom page sizes & orientation options."
      keywords={converterConfig.keywords}
      converterConfig={converterConfig}
      converterType={{
        from: "svg",
        to: "pdf",
        fromFull: "SVG",
        toFull: "PDF"
      }}
      heroTitle="SVG to PDF Converter"
      heroSubtitle="Convert scalable vector graphics to PDF documents with customizable page size and orientation. Preserve vector quality for professional printing."
      converterComponent={<SvgToPdfSpecific />}
      features={[
        {
          title: "Preserve Vector Quality",
          description: "Maintain the scalability and quality of your SVG graphics in PDF format"
        },
        {
          title: "Custom Page Sizes",
          description: "Choose from standard paper sizes (A4, Letter, Legal) or set custom dimensions"
        },
        {
          title: "Orientation Control",
          description: "Select portrait or landscape orientation for your PDF output"
        },
        {
          title: "High-Quality Export",
          description: "Generate print-ready PDFs with adjustable quality settings"
        },
        {
          title: "Instant Processing",
          description: "Fast client-side conversion with no server uploads required"
        },
        {
          title: "Secure & Private",
          description: "Your files never leave your browser - 100% private conversion"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload SVG File",
          description: "Select or drag and drop your SVG file into the converter"
        },
        {
          title: "Configure Settings",
          description: "Choose page size, orientation, and quality options"
        },
        {
          title: "Convert to PDF",
          description: "Click convert and get your PDF file instantly"
        },
        {
          title: "Download Result",
          description: "Save your converted PDF document to your device"
        }
      ]}
      faqs={[
        {
          question: "Is the SVG to PDF conversion free?",
          answer: "Yes, our SVG to PDF converter is completely free to use with no limits on the number of conversions."
        },
        {
          question: "Will my SVG graphics remain vector in the PDF?",
          answer: "Yes, the conversion process preserves the vector nature of your SVG graphics, ensuring they remain scalable and high-quality in the PDF format."
        },
        {
          question: "What page sizes are supported?",
          answer: "We support all standard paper sizes including A4, Letter, Legal, A3, A5, and more. You can also set custom dimensions."
        },
        {
          question: "Can I convert animated SVGs to PDF?",
          answer: "The converter will capture the static state of animated SVGs. For animated content, consider our SVG to Video converter."
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely! All conversions happen directly in your browser. Your files are never uploaded to our servers, ensuring complete privacy."
        }
      ]}
    />
  )
}