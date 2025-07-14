'use client'

import dynamic from 'next/dynamic'

const SVGEditorComponent = dynamic(() => import('./svg-editor-component-enhanced'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/30 rounded-lg p-8 text-center">
      <div className="animate-pulse">Loading editor...</div>
    </div>
  ),
})

export default function EditorWrapper() {
  return <SVGEditorComponent />
}