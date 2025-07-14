import { ReactNode } from "react"

export interface ConverterPageTemplateProps {
  // Meta information
  title: string
  description: string
  keywords: string[]
  converterType: {
    from: string
    to: string
    fromFull: string
    toFull: string
  }
  
  // Hero section
  heroTitle: string
  heroSubtitle: string
  converterComponent: ReactNode
  
  // Features
  features?: Array<{
    title: string
    description: string
  }>
  
  // How it works
  howItWorksSteps?: Array<{
    title: string
    description: string
  }>
  
  // FAQ
  faqs?: Array<{
    question: string
    answer: string | ReactNode
  }>
  
  // Related converters
  relatedConverters?: Array<{
    title: string
    href: string
    description: string
  }>
  
  // Additional sections
  additionalSections?: ReactNode
}

export interface ConverterMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalPath: string
  ogImage?: string
}

export interface ConverterFeature {
  title: string
  description: string
  icon?: ReactNode
}

export interface ConverterStep {
  title: string
  description: string
  icon?: ReactNode
}

export interface ConverterFAQ {
  question: string
  answer: string | ReactNode
}

export interface RelatedConverter {
  title: string
  href: string
  description: string
  from: string
  to: string
}