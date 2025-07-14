import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to PDF Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to PDF instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to pdf', 'svg to pdf converter', 'convert svg to pdf', 'svg2pdf', 'free svg to pdf'],
  openGraph: {
    title: 'SVG to PDF Converter - Free Online Tool',
    description: 'Convert SVG files to PDF format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoPDFPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="pdf"
      title="SVG to PDF Converter"
      monthlySearches={2220}
    />
  )
}
