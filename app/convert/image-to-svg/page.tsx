import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import ImageToSvgConverter from "@/components/converters/image-to-svg-converter"
import { getConverterBySlug } from "@/app/convert/converter-config"

export const metadata: Metadata = {
  title: "Convert Image to SVG - Free Online Tool | SVG AI",
  description: "Convert any image format (PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF) to SVG instantly with our free online converter. High-quality vectorization using advanced tracing algorithms. No signup required.",
  keywords: ["convert image to svg", "image to svg", "image to svg converter", "png to svg", "jpg to svg", "webp to svg", "gif to svg", "bmp to svg", "image vectorizer", "free image to svg"],
  openGraph: {
    title: "Convert Image to SVG - Free Online Tool",
    description: "Convert any image format to scalable vector graphics (SVG) instantly. Supports PNG, JPG, WebP, GIF, BMP, TIFF and more. Free, no signup required.",
    type: "website",
    url: "https://svgai.org/convert/image-to-svg",
    images: [
      {
        url: "https://svgai.org/og-image-image-to-svg.png",
        width: 1200,
        height: 630,
        alt: "Image to SVG Converter"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image to SVG - Free Online Tool",
    description: "Convert any image format to scalable vector graphics instantly. Supports all popular formats. Free, no signup required.",
    images: ["https://svgai.org/og-image-image-to-svg.png"]
  },
  alternates: {
    canonical: "https://svgai.org/convert/image-to-svg"
  }
}

export default function ImageToSvgConverterPage() {
  const converterConfig = getConverterBySlug('image-to-svg')!
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image to SVG Converter",
    "description": "Convert any image format (PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF) to SVG format online for free",
    "url": "https://svgai.org/convert/image-to-svg",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "permissions": "browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Universal image format support",
      "Advanced vectorization algorithms", 
      "Client-side processing",
      "No file size limits",
      "Customizable settings",
      "Privacy protected"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ConverterPageTemplate
      title="Convert Image to SVG - Free Online Tool"
      description="Convert any image format to SVG instantly with our free online converter. Supports PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF and more. High-quality vectorization using advanced tracing algorithms."
      keywords={["convert image to svg", "image to svg", "image to svg converter", "png to svg", "jpg to svg", "image vectorizer"]}
      converterConfig={converterConfig}
      converterType={{
        from: "image",
        to: "svg",
        fromFull: "Image",
        toFull: "SVG"
      }}
      heroTitle="Universal Image to SVG Converter"
      heroSubtitle="Transform any image format into scalable vector graphics with our free online converter. Supports PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF and more."
      converterComponent={<ImageToSvgConverter />}
      features={[
        {
          title: "Universal Format Support",
          description: "Convert from any popular image format including PNG, JPG, JPEG, WebP, GIF, BMP, TIFF, ICO, and AVIF to SVG"
        },
        {
          title: "Advanced Vectorization Engine",
          description: "Uses state-of-the-art tracing algorithms to convert raster images into high-quality vector graphics with precise paths"
        },
        {
          title: "Smart Format Detection",
          description: "Automatically detects your image format and applies the optimal conversion strategy for best results"
        },
        {
          title: "Customizable Conversion Settings",
          description: "Fine-tune threshold, color levels, and optimization settings to achieve perfect vectorization for your specific image type"
        },
        {
          title: "Preserve Image Quality",
          description: "Intelligent conversion process maintains visual fidelity while creating clean, scalable vector paths"
        },
        {
          title: "Perfect for All Use Cases",
          description: "Ideal for logos, icons, illustrations, simple graphics, and any image that needs to scale infinitely without quality loss"
        },
        {
          title: "Batch Processing Ready",
          description: "Convert multiple images from different formats to SVG at once, perfect for large design projects"
        },
        {
          title: "100% Client-Side Processing",
          description: "All conversion happens locally in your browser - your images never leave your device, ensuring complete privacy"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload Any Image Format",
          description: "Select or drag-drop your image file. Supports PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF up to 50MB."
        },
        {
          title: "Auto-Detection & Settings",
          description: "Our tool automatically detects your image format and suggests optimal settings. Customize threshold, colors, and optimization as needed."
        },
        {
          title: "Convert & Download SVG",
          description: "Click convert and download your new scalable SVG file instantly. No waiting, registration, or file size limits."
        }
      ]}
      faqs={[
        {
          question: "What image formats can I convert to SVG?",
          answer: "Our converter supports all popular image formats including PNG, JPG/JPEG, WebP, GIF, BMP, TIFF, ICO, and AVIF. The tool automatically detects your format and applies the best conversion method for optimal results."
        },
        {
          question: "How does image to SVG conversion work?",
          answer: "Our converter uses advanced tracing algorithms to analyze your raster image and create vector paths that represent the shapes and colors. This process converts pixel-based images into mathematical descriptions, making them infinitely scalable without quality loss."
        },
        {
          question: "What types of images work best for SVG conversion?",
          answer: "Simple images with clear shapes, solid colors, and defined edges convert best to SVG. This includes logos, icons, simple illustrations, text, and graphics with limited color palettes. Complex photographs may result in very large SVG files with many paths."
        },
        {
          question: "Will my converted SVG file be smaller than the original image?",
          answer: "For simple graphics with few colors, SVG files are often significantly smaller. However, complex images may result in larger SVG files due to the many vector paths needed. The main benefit is infinite scalability, not just file size."
        },
        {
          question: "Can I edit the SVG after conversion?",
          answer: "Absolutely! SVG files are fully editable in vector graphics software like Adobe Illustrator, Inkscape, Figma, or even with a text editor since SVG is XML-based. You can modify colors, shapes, paths, and add new elements after conversion."
        },
        {
          question: "Is transparency preserved during conversion?",
          answer: "Yes, our converter preserves transparency from your original images. Transparent areas in PNG, WebP, GIF, and other formats that support transparency will remain transparent in the resulting SVG file."
        },
        {
          question: "What's the difference between this and format-specific converters?",
          answer: "This universal converter automatically detects your image format and routes it to the appropriate conversion engine. It's convenient for mixed-format workflows, while our format-specific converters (like PNG to SVG) offer the same quality with format-tailored interfaces."
        },
        {
          question: "Can I convert animated images like GIFs?",
          answer: "Yes, you can convert GIF files, but the result will be a static SVG of the first frame. For animated SVGs, you'll need to use our SVG animation tools after conversion or consider our GIF to animated SVG converter for motion preservation."
        },
        {
          question: "Are there any file size limits?",
          answer: "You can convert images up to 50MB in size. For optimal performance and results, we recommend images under 10MB. Very large or complex images may take longer to process and result in large SVG files."
        },
        {
          question: "How can I optimize my SVG after conversion?",
          answer: "Our converter includes built-in optimization, but you can further optimize using our SVG optimizer tool, adjust the optimization level in conversion settings, or manually edit the SVG code to remove unnecessary elements."
        }
      ]}
      relatedConverters={[
        {
          title: "PNG to SVG Converter",
          href: "/convert/png-to-svg",
          description: "Dedicated PNG to SVG conversion with optimized settings"
        },
        {
          title: "JPG to SVG Converter", 
          href: "/convert/jpg-to-svg",
          description: "Convert JPEG images to vector format"
        },
        {
          title: "WebP to SVG Converter",
          href: "/convert/webp-to-svg", 
          description: "Convert modern WebP images to scalable SVG"
        },
        {
          title: "SVG to PNG Converter",
          href: "/convert/svg-to-png",
          description: "Convert SVG files back to PNG raster format"
        },
        {
          title: "SVG Converter",
          href: "/convert/svg-converter",
          description: "Universal SVG conversion tool for multiple formats"
        },
        {
          title: "GIF to SVG Converter",
          href: "/convert/gif-to-svg",
          description: "Convert animated GIFs to static SVG format"
        }
      ]}
    />
    </>
  )
}