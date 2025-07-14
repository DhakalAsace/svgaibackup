import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to jpg', 'svg to jpg converter', 'convert svg to jpg', 'svg2jpg', 'free svg to jpg'],
  openGraph: {
    title: 'SVG to JPG Converter - Free Online Tool',
    description: 'Convert SVG files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="jpg"
      title="SVG to JPG Converter"
      monthlySearches={5400}
    />
  )
}
