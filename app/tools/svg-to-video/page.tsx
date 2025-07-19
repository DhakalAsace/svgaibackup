import { Metadata } from 'next'
import SVGToVideoPageClient from './svg-to-video-page-client'

export const metadata: Metadata = {
  title: 'SVG to MP4 Converter - AI Video Generator | Convert SVG to Video | SVG AI',
  description: 'Convert SVG to MP4 video with AI. Transform static SVG files to MP4 animations. Create 5-second HD videos from SVG designs. Free SVG to video converter online.',
  keywords: 'svg to mp4, svg to video, svg to mp4 converter, convert svg to mp4, svg to video converter, svg animation to mp4, svg to mp4 online, ai svg to video, svg to mp4 ai',
  openGraph: {
    title: 'SVG to MP4 Converter - AI-Powered Video Generation',
    description: 'Convert SVG to MP4 video format. Transform static SVGs into dynamic MP4 videos with AI.',
    type: 'website',
    url: 'https://svgai.org/tools/svg-to-video',
  },
  alternates: {
    canonical: 'https://svgai.org/tools/svg-to-video',
  },
}

export default function SVGToVideoPage() {
  return <SVGToVideoPageClient />
}