import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'ICO to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert ICO to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['ico to png', 'ico to png converter', 'convert ico to png', 'ico2png', 'free ico to png'],
  openGraph: {
    title: 'ICO to PNG Converter - Free Online Tool',
    description: 'Convert ICO files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function ICOtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="ico"
      toFormat="png"
      title="ICO to PNG Converter"
      monthlySearches={14800}
    />
  )
}
