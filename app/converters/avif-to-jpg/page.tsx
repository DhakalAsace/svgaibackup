import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'AVIF to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert AVIF to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['avif to jpg', 'avif to jpg converter', 'convert avif to jpg', 'avif2jpg', 'free avif to jpg'],
  openGraph: {
    title: 'AVIF to JPG Converter - Free Online Tool',
    description: 'Convert AVIF files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function AVIFtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="avif"
      toFormat="jpg"
      title="AVIF to JPG Converter"
      monthlySearches={170}
    />
  )
}
