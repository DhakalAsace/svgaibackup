import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert HEIC to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['heic to jpg', 'heic to jpg converter', 'convert heic to jpg', 'heic2jpg', 'free heic to jpg'],
  openGraph: {
    title: 'HEIC to JPG Converter - Free Online Tool',
    description: 'Convert HEIC files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function HEICtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="heic"
      toFormat="jpg"
      title="HEIC to JPG Converter"
      monthlySearches={880}
    />
  )
}
