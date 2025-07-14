'use client'

import dynamic from 'next/dynamic'

const SVGToVideoComponent = dynamic(() => import('./svg-to-video-component'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/30 rounded-lg p-8 text-center">
      <div className="animate-pulse">Loading converter...</div>
    </div>
  ),
})

export default function VideoWrapper() {
  return <SVGToVideoComponent />
}