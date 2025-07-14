import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JPG to ICO Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JPG to ICO instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jpg to ico', 'jpg to ico converter', 'convert jpg to ico', 'jpg2ico', 'free jpg to ico'],
  openGraph: {
    title: 'JPG to ICO Converter - Free Online Tool',
    description: 'Convert JPG files to ICO format instantly. Free, fast, and secure online converter.',
  }
}

export default function JPGtoICOPage() {
  return (
    <ConverterPage
      fromFormat="jpg"
      toFormat="ico"
      title="JPG to ICO Converter"
      monthlySearches={2220}
    />
  )
}
