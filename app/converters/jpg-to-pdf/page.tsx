import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JPG to PDF instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jpg to pdf', 'jpg to pdf converter', 'convert jpg to pdf', 'jpg2pdf', 'free jpg to pdf'],
  openGraph: {
    title: 'JPG to PDF Converter - Free Online Tool',
    description: 'Convert JPG files to PDF format instantly. Free, fast, and secure online converter.',
  }
}

export default function JPGtoPDFPage() {
  return (
    <ConverterPage
      fromFormat="jpg"
      toFormat="pdf"
      title="JPG to PDF Converter"
      monthlySearches={5400}
    />
  )
}
