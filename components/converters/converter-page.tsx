'use client'

import { getConverterBySlug } from '@/app/convert/converter-config'
import ConverterInterface from '@/components/converter-interface'

interface ConverterPageProps {
  fromFormat: string
  toFormat: string
  title: string
  monthlySearches?: number
}

export default function ConverterPage({ fromFormat, toFormat, title, monthlySearches }: ConverterPageProps) {
  const slug = `${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`
  const converterConfig = getConverterBySlug(slug)
  
  if (!converterConfig) {
    return <div>Converter not found</div>
  }

  const publicConfig = {
    id: converterConfig.id,
    urlSlug: converterConfig.urlSlug,
    fromFormat: converterConfig.fromFormat,
    toFormat: converterConfig.toFormat,
    title: converterConfig.title,
    metaTitle: converterConfig.metaTitle,
    metaDescription: converterConfig.metaDescription,
    keywords: converterConfig.keywords,
    priority: converterConfig.priority,
    routeType: converterConfig.routeType,
    isSupported: converterConfig.isSupported
  }

  return (
    <ConverterInterface config={publicConfig} />
  )
}