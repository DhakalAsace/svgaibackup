'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Copy, RefreshCw, Upload, FileCode } from 'lucide-react'
import { toast } from 'sonner'

const DEFAULT_SVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Try editing this SVG! -->
  <circle cx="100" cy="100" r="80" fill="#3b82f6" opacity="0.8"/>
  <rect x="60" y="60" width="80" height="80" fill="#10b981" opacity="0.6"/>
  <polygon points="100,40 140,120 60,120" fill="#f59e0b" opacity="0.7"/>
</svg>`

export default function SVGEditorComponent() {
  const [svgCode, setSvgCode] = useState(DEFAULT_SVG)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Validate SVG
  useEffect(() => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgCode, 'image/svg+xml')
      const errorNode = doc.querySelector('parsererror')
      
      if (errorNode) {
        setError('Invalid SVG: ' + errorNode.textContent)
      } else {
        setError(null)
      }
    } catch (e) {
      setError('Error parsing SVG')
    }
  }, [svgCode])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgCode(content)
      toast.success('SVG file loaded')
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited-svg.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('SVG downloaded')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgCode)
      toast.success('Copied to clipboard')
    } catch (e) {
      toast.error('Failed to copy')
    }
  }

  const handleReset = () => {
    setSvgCode(DEFAULT_SVG)
    toast.success('Reset to default')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add tab support
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newCode = svgCode.substring(0, start) + '  ' + svgCode.substring(end)
      setSvgCode(newCode)
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              SVG Code Editor
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono text-sm min-h-[500px] resize-none"
              placeholder="Paste your SVG code here..."
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-2 left-2 right-2 bg-destructive/10 text-destructive text-xs p-2 rounded">
                {error}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download SVG
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
            {error ? (
              <div className="text-muted-foreground text-center">
                <p className="text-lg mb-2">Invalid SVG</p>
                <p className="text-sm">Fix the errors to see preview</p>
              </div>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            )}
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Quick Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use Tab key for indentation</li>
              <li>• Ctrl/Cmd + A to select all</li>
              <li>• Changes appear instantly</li>
              <li>• Upload SVG files with the Upload button</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}