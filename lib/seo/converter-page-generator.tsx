import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import { getConverterBySlug, ConverterConfig } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "./structured-data"
import { ReactNode } from "react"

interface ConverterPageConfig {
  urlSlug: string
  converterComponent: ReactNode
  heroTitle?: string
  heroSubtitle?: string
  features?: Array<{
    title: string
    description: string
  }>
  howItWorksSteps?: Array<{
    title: string
    description: string
  }>
  faqs?: Array<{
    question: string
    answer: string | ReactNode
  }>
  relatedConverters?: Array<{
    title: string
    href: string
    description: string
  }>
  additionalSections?: ReactNode
}

export function generateConverterPageMetadata(urlSlug: string): Metadata {
  const converterConfig = getConverterBySlug(urlSlug)
  if (!converterConfig) {
    throw new Error(`Converter config not found for slug: ${urlSlug}`)
  }
  
  const currentUrl = `https://svgai.org/convert/${urlSlug}`
  return generateConverterMetadata(converterConfig, currentUrl)
}

export function createConverterPage(config: ConverterPageConfig) {
  const converterConfig = getConverterBySlug(config.urlSlug)
  if (!converterConfig) {
    throw new Error(`Converter config not found for slug: ${config.urlSlug}`)
  }

  const defaultHeroTitle = `${converterConfig.fromFormat} to ${converterConfig.toFormat} Converter`
  const defaultHeroSubtitle = `Convert ${converterConfig.fromFormat} files to ${converterConfig.toFormat} format online for free. High-quality conversion with no signup required.`

  const defaultHowItWorksSteps = [
    {
      title: `Upload ${converterConfig.fromFormat} File`,
      description: `Select or drag-drop your ${converterConfig.fromFormat} file into the converter. All processing happens locally in your browser.`
    },
    {
      title: "Convert Instantly",
      description: "Our tool instantly converts your file using advanced algorithms for optimal quality and compatibility."
    },
    {
      title: `Download ${converterConfig.toFormat}`,
      description: `Get your converted ${converterConfig.toFormat} file immediately. Use it anywhere with no restrictions.`
    }
  ]

  const defaultFAQs = [
    {
      question: `How does ${converterConfig.fromFormat} to ${converterConfig.toFormat} conversion work?`,
      answer: `Our converter uses advanced algorithms to transform your ${converterConfig.fromFormat} files into ${converterConfig.toFormat} format while maintaining quality and compatibility.`
    },
    {
      question: "Is this converter really free?",
      answer: "Yes, our converter is 100% free with no hidden costs, signup requirements, or usage limits. You can convert as many files as you need."
    },
    {
      question: "Are my files secure?",
      answer: "Absolutely. All conversion happens directly in your browser - your files never leave your device or get uploaded to any server. This ensures complete privacy and security."
    },
    {
      question: "What file sizes are supported?",
      answer: "Our converter can handle files up to 100MB. For larger files, we recommend using desktop software for optimal performance."
    },
    {
      question: "Can I use converted files commercially?",
      answer: "Yes, you retain full rights to your converted files. Use them in any personal or commercial project without restrictions."
    }
  ]

  return function ConverterPage() {
    return (
      <ConverterPageTemplate
        title={converterConfig.metaTitle}
        description={converterConfig.metaDescription}
        keywords={converterConfig.keywords}
        converterConfig={converterConfig}
        converterType={{
          from: converterConfig.fromFormat.toLowerCase(),
          to: converterConfig.toFormat.toLowerCase(),
          fromFull: converterConfig.fromFormat,
          toFull: converterConfig.toFormat
        }}
        heroTitle={config.heroTitle || defaultHeroTitle}
        heroSubtitle={config.heroSubtitle || defaultHeroSubtitle}
        converterComponent={config.converterComponent}
        features={config.features}
        howItWorksSteps={config.howItWorksSteps || defaultHowItWorksSteps}
        faqs={config.faqs || defaultFAQs}
        relatedConverters={config.relatedConverters || generateRelatedConverters(converterConfig.urlSlug)}
        additionalSections={config.additionalSections}
      />
    )
  }
}

// Helper function to generate related converters based on current converter
export function generateRelatedConverters(currentSlug: string, count: number = 3): Array<{
  title: string
  href: string
  description: string
}> {
  const currentConfig = getConverterBySlug(currentSlug)
  if (!currentConfig) return []

  // Get converters with same format (but different direction) or related formats
  const allConfigs = [
    getConverterBySlug(`${currentConfig.toFormat.toLowerCase()}-to-${currentConfig.fromFormat.toLowerCase()}`),
    getConverterBySlug("svg-converter"),
    getConverterBySlug("image-to-svg"),
    getConverterBySlug("png-to-svg"),
    getConverterBySlug("svg-to-png"),
    getConverterBySlug("jpg-to-svg"),
    getConverterBySlug("svg-to-jpg")
  ].filter(config => config && config.urlSlug !== currentSlug) as ConverterConfig[]

  return allConfigs.slice(0, count).map(config => ({
    title: config.title,
    href: `/convert/${config.urlSlug}`,
    description: `Convert ${config.fromFormat} files to ${config.toFormat} format`
  }))
}