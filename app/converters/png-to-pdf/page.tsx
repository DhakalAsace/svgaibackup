import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PNG to PDF Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PNG to PDF instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['png to pdf', 'png to pdf converter', 'convert png to pdf', 'png2pdf', 'free png to pdf'],
  openGraph: {
    title: 'PNG to PDF Converter - Free Online Tool',
    description: 'Convert PNG files to PDF format instantly. Free, fast, and secure online converter.',
  }
}

export default function PNGtoPDFPage() {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="pdf"
      title="PNG to PDF Converter"
      monthlySearches={3650}
    />
  )
}
