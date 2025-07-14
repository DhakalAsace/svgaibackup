import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to DXF Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to DXF instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to dxf', 'svg to dxf converter', 'convert svg to dxf', 'svg2dxf', 'free svg to dxf'],
  openGraph: {
    title: 'SVG to DXF Converter - Free Online Tool',
    description: 'Convert SVG files to DXF format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoDXFPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="dxf"
      title="SVG to DXF Converter"
      monthlySearches={880}
    />
  )
}
