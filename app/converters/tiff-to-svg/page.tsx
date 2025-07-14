import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'TIFF to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert TIFF to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['tiff to svg', 'tiff to svg converter', 'convert tiff to svg', 'tiff2svg', 'free tiff to svg'],
  openGraph: {
    title: 'TIFF to SVG Converter - Free Online Tool',
    description: 'Convert TIFF files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function TIFFtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="tiff"
      toFormat="svg"
      title="TIFF to SVG Converter"
      monthlySearches={590}
    />
  )
}
