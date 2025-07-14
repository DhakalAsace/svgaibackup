import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to AI Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to AI instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to ai', 'svg to ai converter', 'convert svg to ai', 'svg2ai', 'free svg to ai'],
  openGraph: {
    title: 'SVG to AI Converter - Free Online Tool',
    description: 'Convert SVG files to AI format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoAIPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="ai"
      title="SVG to AI Converter"
      monthlySearches={1900}
    />
  )
}
