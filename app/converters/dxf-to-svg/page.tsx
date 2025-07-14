import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'DXF to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert DXF to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['dxf to svg', 'dxf to svg converter', 'convert dxf to svg', 'dxf2svg', 'free dxf to svg'],
  openGraph: {
    title: 'DXF to SVG Converter - Free Online Tool',
    description: 'Convert DXF files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function DXFtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="dxf"
      toFormat="svg"
      title="DXF to SVG Converter"
      monthlySearches={390}
    />
  )
}
