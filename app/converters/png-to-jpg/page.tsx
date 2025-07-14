import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'PNG to JPG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert PNG to JPG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['png to jpg', 'png to jpg converter', 'convert png to jpg', 'png2jpg', 'free png to jpg'],
  openGraph: {
    title: 'PNG to JPG Converter - Free Online Tool',
    description: 'Convert PNG files to JPG format instantly. Free, fast, and secure online converter.',
  }
}

export default function PNGtoJPGPage() {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="jpg"
      title="PNG to JPG Converter"
      monthlySearches={9900}
    />
  )
}
