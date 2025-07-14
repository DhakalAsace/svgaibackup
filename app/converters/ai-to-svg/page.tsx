import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'AI to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert AI to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['ai to svg', 'ai to svg converter', 'convert ai to svg', 'ai2svg', 'free ai to svg'],
  openGraph: {
    title: 'AI to SVG Converter - Free Online Tool',
    description: 'Convert AI files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function AItoSVGPage() {
  return (
    <ConverterPage
      fromFormat="ai"
      toFormat="svg"
      title="AI to SVG Converter"
      monthlySearches={2900}
    />
  )
}
