import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PNG to ICO Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PNG to ICO instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['png to ico', 'png to ico converter', 'convert png to ico', 'png2ico', 'free png to ico'],
  openGraph: {
    title: 'PNG to ICO Converter - Free Online Tool',
    description: 'Convert PNG files to ICO format instantly. Free, fast, and secure online converter.',
  }
}

export default function PNGtoICOPage() {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="ico"
      title="PNG to ICO Converter"
      monthlySearches={6600}
    />
  )
}
