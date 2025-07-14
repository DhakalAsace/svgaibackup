import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PNG to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PNG to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['png to svg', 'png to svg converter', 'convert png to svg', 'png2svg', 'free png to svg'],
  openGraph: {
    title: 'PNG to SVG Converter - Free Online Tool',
    description: 'Convert PNG files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function PNGtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="svg"
      title="PNG to SVG Converter"
      monthlySearches={40500}
    />
  )
}
