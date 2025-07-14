import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getConverterBySlug } from '../converter-config'

export async function generateMetadata(): Promise<Metadata> {
  const converter = getConverterBySlug('ico-to-svg')
  
  if (!converter) {
    return {
      title: 'Converter Not Found',
      description: 'The requested converter could not be found.',
    }
  }

  return {
    title: converter.metaTitle,
    description: converter.metaDescription,
    keywords: converter.keywords.join(', '),
    openGraph: {
      title: converter.metaTitle,
      description: converter.metaDescription,
      type: 'website',
      siteName: 'SVG AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: converter.metaTitle,
      description: converter.metaDescription,
    },
  }
}

export default function IcoToSvgPage() {
  const converter = getConverterBySlug('ico-to-svg')
  
  if (!converter || converter.routeType !== 'convert') {
    notFound()
  }

  // Import the wrapper component that handles caching
  const ConverterPageWrapper = dynamic(
    () => import('@/components/converter-page-wrapper'),
    { ssr: true }
  )

  return <ConverterPageWrapper config={converter} />
}

// Enable static generation for better performance
export const revalidate = 3600 // 1 hour