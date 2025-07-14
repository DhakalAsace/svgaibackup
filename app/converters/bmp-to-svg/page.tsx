import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'BMP to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert BMP to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['bmp to svg', 'bmp to svg converter', 'convert bmp to svg', 'bmp2svg', 'free bmp to svg'],
  openGraph: {
    title: 'BMP to SVG Converter - Free Online Tool',
    description: 'Convert BMP files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function BMPtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="bmp"
      toFormat="svg"
      title="BMP to SVG Converter"
      monthlySearches={1300}
    />
  )
}
