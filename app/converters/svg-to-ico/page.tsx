import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to ICO Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to ICO instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to ico', 'svg to ico converter', 'convert svg to ico', 'svg2ico', 'free svg to ico'],
  openGraph: {
    title: 'SVG to ICO Converter - Free Online Tool',
    description: 'Convert SVG files to ICO format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoICOPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="ico"
      title="SVG to ICO Converter"
      monthlySearches={770}
    />
  )
}
