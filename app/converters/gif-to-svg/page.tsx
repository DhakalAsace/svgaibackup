import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'GIF to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert GIF to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['gif to svg', 'gif to svg converter', 'convert gif to svg', 'gif2svg', 'free gif to svg'],
  openGraph: {
    title: 'GIF to SVG Converter - Free Online Tool',
    description: 'Convert GIF files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function GIFtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="gif"
      toFormat="svg"
      title="GIF to SVG Converter"
      monthlySearches={720}
    />
  )
}
