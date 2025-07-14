import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JFIF to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JFIF to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jfif to jpg', 'jfif to jpg converter', 'convert jfif to jpg', 'jfif2jpg', 'free jfif to jpg'],
  openGraph: {
    title: 'JFIF to JPG Converter - Free Online Tool',
    description: 'Convert JFIF files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function JFIFtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="jfif"
      toFormat="jpg"
      title="JFIF to JPG Converter"
      monthlySearches={170}
    />
  )
}
