import { redirect } from 'next/navigation'

// Redirect SVG to MP4 converter to the premium SVG to Video tool
export default function SVGToMP4Page() {
  redirect('/tools/svg-to-video')
}