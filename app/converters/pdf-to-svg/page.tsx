import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PDF to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PDF to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['pdf to svg', 'pdf to svg converter', 'convert pdf to svg', 'pdf2svg', 'free pdf to svg'],
  openGraph: {
    title: 'PDF to SVG Converter - Free Online Tool',
    description: 'Convert PDF files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function PDFtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="pdf"
      toFormat="svg"
      title="PDF to SVG Converter"
      monthlySearches={4400}
    />
  )
}
