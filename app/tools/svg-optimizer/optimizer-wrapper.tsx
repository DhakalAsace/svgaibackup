'use client'

import dynamic from 'next/dynamic'

const SVGOptimizerComponent = dynamic(() => import('./svg-optimizer-component-enhanced'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/30 rounded-lg p-8 text-center">
      <div className="animate-pulse">Loading optimizer...</div>
    </div>
  ),
})

export default function OptimizerWrapper() {
  return <SVGOptimizerComponent />
}