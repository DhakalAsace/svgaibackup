import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'WEBP to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert WEBP to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['webp to jpg', 'webp to jpg converter', 'convert webp to jpg', 'webp2jpg', 'free webp to jpg'],
  openGraph: {
    title: 'WEBP to JPG Converter - Free Online Tool',
    description: 'Convert WEBP files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function WEBPtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="webp"
      toFormat="jpg"
      title="WEBP to JPG Converter"
      monthlySearches={1000}
    />
  )
}
