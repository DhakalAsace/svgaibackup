import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'ICO to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert ICO to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['ico to svg', 'ico to svg converter', 'convert ico to svg', 'ico2svg', 'free ico to svg'],
  openGraph: {
    title: 'ICO to SVG Converter - Free Online Tool',
    description: 'Convert ICO files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function ICOtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="ico"
      toFormat="svg"
      title="ICO to SVG Converter"
      monthlySearches={1000}
    />
  )
}
