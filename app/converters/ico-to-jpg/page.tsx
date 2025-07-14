import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'ICO to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert ICO to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['ico to jpg', 'ico to jpg converter', 'convert ico to jpg', 'ico2jpg', 'free ico to jpg'],
  openGraph: {
    title: 'ICO to JPG Converter - Free Online Tool',
    description: 'Convert ICO files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function ICOtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="ico"
      toFormat="jpg"
      title="ICO to JPG Converter"
      monthlySearches={590}
    />
  )
}
