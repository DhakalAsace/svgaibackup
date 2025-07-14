import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'EPS to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert EPS to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['eps to svg', 'eps to svg converter', 'convert eps to svg', 'eps2svg', 'free eps to svg'],
  openGraph: {
    title: 'EPS to SVG Converter - Free Online Tool',
    description: 'Convert EPS files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function EPStoSVGPage() {
  return (
    <ConverterPage
      fromFormat="eps"
      toFormat="svg"
      title="EPS to SVG Converter"
      monthlySearches={3350}
    />
  )
}
