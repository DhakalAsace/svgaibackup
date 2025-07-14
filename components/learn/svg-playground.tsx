"use client"

import { useState, useEffect } from "react"
import { Play, RotateCcw, Copy, Check, Code2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface SVGPlaygroundProps {
  title?: string
  description?: string
  initialCode?: string
  examples?: {
    name: string
    code: string
    description?: string
  }[]
  height?: string
}

const defaultSVGCode = `<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- Try editing this code! -->
  <circle cx="100" cy="100" r="50" fill="#3b82f6" />
  <rect x="75" y="75" width="50" height="50" fill="#ef4444" opacity="0.7" />
  <text x="100" y="105" text-anchor="middle" fill="white" font-size="20">
    SVG
  </text>
</svg>`

export function SVGPlayground({
  title = "Interactive SVG Playground",
  description = "Edit SVG code in real-time and see instant results",
  initialCode = defaultSVGCode,
  examples = [],
  height = "400px"
}: SVGPlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")

  useEffect(() => {
    // Validate SVG code
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(code, 'image/svg+xml')
      const errorNode = doc.querySelector('parsererror')
      
      if (errorNode) {
        setError("Invalid SVG syntax")
      } else {
        setError(null)
      }
    } catch (e) {
      setError("Error parsing SVG")
    }
  }, [code])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "SVG code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setError(null)
  }

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode)
    setActiveTab("editor")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={!!error}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {examples.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="secondary"
                  onClick={() => loadExample(example.code)}
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "editor" | "preview")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">SVG Code</Label>
                    {error && <Badge variant="destructive">{error}</Badge>}
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm"
                    style={{ minHeight: height }}
                    placeholder="Enter SVG code here..."
                  />
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <PreviewPane code={code} error={error} height={height} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Side-by-Side */}
          <div className="hidden lg:block space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">SVG Code</Label>
              {error && <Badge variant="destructive">{error}</Badge>}
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm"
              style={{ minHeight: height }}
              placeholder="Enter SVG code here..."
            />
          </div>

          <div className="hidden lg:block">
            <PreviewPane code={code} error={error} height={height} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}. Please check your SVG syntax.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

// Preview Pane Component
function PreviewPane({ code, error, height }: { code: string; error: string | null; height: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Live Preview</Label>
      <div 
        className="border rounded-lg bg-white dark:bg-gray-950 p-4 flex items-center justify-center"
        style={{ minHeight: height }}
      >
        {!error ? (
          <div 
            dangerouslySetInnerHTML={{ __html: code }}
            className="svg-preview [&_svg]:max-w-full [&_svg]:h-auto"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Fix the syntax error to see preview</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Label component (imported from UI or defined here)
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      {children}
    </label>
  )
}

// Example playground configurations for different lessons
export const playgroundExamples = {
  basic: [
    {
      name: "Circle",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#3b82f6" />
</svg>`,
      description: "Basic circle shape"
    },
    {
      name: "Rectangle",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="50" y="50" width="100" height="100" fill="#10b981" rx="10" />
</svg>`,
      description: "Rectangle with rounded corners"
    },
    {
      name: "Path",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <path d="M 50 50 L 150 50 L 100 150 Z" fill="#f59e0b" />
</svg>`,
      description: "Triangle using path element"
    }
  ],
  animation: [
    {
      name: "Rotating Square",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="75" y="75" width="50" height="50" fill="#8b5cf6">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 100 100"
      to="360 100 100"
      dur="2s"
      repeatCount="indefinite" />
  </rect>
</svg>`,
      description: "Continuously rotating square"
    },
    {
      name: "Pulsing Circle",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" fill="#ef4444">
    <animate
      attributeName="r"
      values="30;50;30"
      dur="1.5s"
      repeatCount="indefinite" />
  </circle>
</svg>`,
      description: "Circle that pulses in size"
    },
    {
      name: "Color Transition",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <rect x="50" y="50" width="100" height="100" rx="10">
    <animate
      attributeName="fill"
      values="#3b82f6;#8b5cf6;#ec4899;#3b82f6"
      dur="3s"
      repeatCount="indefinite" />
  </rect>
</svg>`,
      description: "Rectangle with color animation"
    }
  ],
  advanced: [
    {
      name: "Gradient Fill",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
</svg>`,
      description: "Circle with gradient fill"
    },
    {
      name: "Text on Path",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <path id="curve" d="M 30 100 Q 100 30 170 100" />
  </defs>
  <text font-size="20" fill="#3b82f6">
    <textPath href="#curve">
      Curved SVG Text!
    </textPath>
  </text>
</svg>`,
      description: "Text following a curved path"
    },
    {
      name: "Filter Effects",
      code: `<svg width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
  </defs>
  <circle cx="100" cy="100" r="60" fill="#10b981" filter="url(#blur)" />
  <circle cx="100" cy="100" r="40" fill="#059669" />
</svg>`,
      description: "Blur filter effect"
    }
  ]
}