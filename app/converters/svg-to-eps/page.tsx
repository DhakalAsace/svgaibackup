import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to EPS Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to EPS instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to eps', 'svg to eps converter', 'convert svg to eps', 'svg2eps', 'free svg to eps'],
  openGraph: {
    title: 'SVG to EPS Converter - Free Online Tool',
    description: 'Convert SVG files to EPS format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoEPSPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="eps"
      title="SVG to EPS Converter"
      monthlySearches={1600}
    />
  )
}
