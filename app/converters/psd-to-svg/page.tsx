import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PSD to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PSD to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['psd to svg', 'psd to svg converter', 'convert psd to svg', 'psd2svg', 'free psd to svg'],
  openGraph: {
    title: 'PSD to SVG Converter - Free Online Tool',
    description: 'Convert PSD files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function PSDtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="psd"
      toFormat="svg"
      title="PSD to SVG Converter"
      monthlySearches={480}
    />
  )
}
