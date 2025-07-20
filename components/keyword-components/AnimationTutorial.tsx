"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Play,
  Pause,
  RotateCw,
  Copy,
  Check,
  Code,
  Clock,
  Zap,
  Info,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Monitor,
  Smartphone,
  Globe
} from "lucide-react"
import Link from "next/link"

// Animation interfaces
interface AnimationProperty {
  name: string
  value: string | number
  unit?: string
  description: string
}

interface AnimationExample {
  id: string
  name: string
  category: string
  svg: string
  css: string
  description: string
  properties: AnimationProperty[]
  browserSupport: {
    chrome: string
    firefox: string
    safari: string
    edge: string
  }
}

// Example animations
const ANIMATION_EXAMPLES: AnimationExample[] = [
  {
    id: "rotate-icon",
    name: "Rotating Icon",
    category: "basic",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100">
  <path id="gear" d="M50 20 L60 30 L60 40 L50 50 L40 40 L40 30 Z" 
        fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
</svg>`,
    css: `#gear {
  animation: rotate 2s linear infinite;
  transform-origin: center;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    description: "A simple continuous rotation animation perfect for loading spinners or interactive elements.",
    properties: [
      { name: "duration", value: 2, unit: "s", description: "How long one rotation takes" },
      { name: "timing-function", value: "linear", description: "Constant speed throughout" },
      { name: "iteration-count", value: "infinite", description: "Loops forever" }
    ],
    browserSupport: {
      chrome: "4+",
      firefox: "5+",
      safari: "4+",
      edge: "12+"
    }
  },
  {
    id: "pulse-heart",
    name: "Pulsing Heart",
    category: "emphasis",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100">
  <path id="heart" d="M50 80 C20 60, 20 30, 50 50 C80 30, 80 60, 50 80 Z" 
        fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
</svg>`,
    css: `#heart {
  animation: pulse 1.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}`,
    description: "A heartbeat effect that draws attention to important elements or CTAs.",
    properties: [
      { name: "duration", value: 1.5, unit: "s", description: "Complete pulse cycle time" },
      { name: "timing-function", value: "ease-in-out", description: "Smooth acceleration and deceleration" },
      { name: "transform", value: "scale", description: "Scales up and down from center" }
    ],
    browserSupport: {
      chrome: "4+",
      firefox: "5+",
      safari: "4+",
      edge: "12+"
    }
  },
  {
    id: "draw-path",
    name: "Drawing Path",
    category: "path",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100">
  <path id="line" d="M10 50 Q50 10 90 50 T170 50" 
        fill="none" stroke="#10B981" strokeWidth="3"
        strokeDasharray="200" strokeDashoffset="200"/>
</svg>`,
    css: `#line {
  animation: draw 3s ease-out forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}`,
    description: "Animates the drawing of an SVG path, great for signatures or revealing illustrations.",
    properties: [
      { name: "stroke-dasharray", value: 200, description: "Total length of the path" },
      { name: "stroke-dashoffset", value: 200, description: "Initial offset hides the path" },
      { name: "fill-mode", value: "forwards", description: "Keeps final state after animation" }
    ],
    browserSupport: {
      chrome: "4+",
      firefox: "5+",
      safari: "4+",
      edge: "12+"
    }
  },
  {
    id: "morph-shape",
    name: "Shape Morphing",
    category: "advanced",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100">
  <path id="morph" d="M25 50 Q50 25 75 50 T125 50" 
        fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2">
    <animate attributeName="d" 
             values="M25 50 Q50 25 75 50 T125 50;
                     M25 50 Q50 75 75 50 T125 50;
                     M25 50 Q50 25 75 50 T125 50"
             dur="2s" repeatCount="indefinite"/>
  </path>
</svg>`,
    css: `/* SMIL animation is used for morphing */
/* CSS can control other properties */
#morph {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}`,
    description: "Uses SMIL animation to morph between different path shapes smoothly.",
    properties: [
      { name: "attributeName", value: "d", description: "The path data to animate" },
      { name: "dur", value: "2s", description: "Duration of one morph cycle" },
      { name: "repeatCount", value: "indefinite", description: "Loops continuously" }
    ],
    browserSupport: {
      chrome: "4+",
      firefox: "4+",
      safari: "5+",
      edge: "12+"
    }
  }
]

// Easing options
const EASING_OPTIONS = [
  { value: "linear", label: "Linear", description: "Constant speed" },
  { value: "ease", label: "Ease", description: "Default easing" },
  { value: "ease-in", label: "Ease In", description: "Slow start" },
  { value: "ease-out", label: "Ease Out", description: "Slow end" },
  { value: "ease-in-out", label: "Ease In-Out", description: "Slow start and end" },
  { value: "cubic-bezier(0.68,-0.55,0.265,1.55)", label: "Bounce", description: "Bouncy effect" }
]

export interface AnimationTutorialProps {}

export default function AnimationTutorial({}: AnimationTutorialProps = {}) {
  const [selectedExample, setSelectedExample] = useState(ANIMATION_EXAMPLES[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [duration, setDuration] = useState(2)
  const [easing, setEasing] = useState("ease-out")
  const [customCSS, setCustomCSS] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("examples")
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Update custom CSS when example changes
  useEffect(() => {
    setCustomCSS(selectedExample.css)
  }, [selectedExample])

  // Copy code to clipboard
  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard"
    })
  }

  // Generate complete code
  const generateCompleteCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
${customCSS}
  </style>
</head>
<body>
${selectedExample.svg}
</body>
</html>`
  }

  // Restart animation
  const restartAnimation = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  return (
    <div className="w-full space-y-6">
      {/* HowTo Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create SVG Animations",
            "description": "Learn how to create stunning SVG animations with CSS and JavaScript",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Choose Animation Type",
                "text": "Select from basic transforms, path animations, or advanced morphing"
              },
              {
                "@type": "HowToStep",
                "name": "Configure Properties",
                "text": "Adjust duration, easing, and other animation properties"
              },
              {
                "@type": "HowToStep",
                "name": "Preview and Test",
                "text": "See your animation in action and test across browsers"
              },
              {
                "@type": "HowToStep",
                "name": "Export Code",
                "text": "Copy the generated code or export to use in your project"
              }
            ]
          })
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Interactive SVG Animation Tutorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            {/* Examples Tab */}
            <TabsContent value="examples" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <><Pause className="mr-1 h-3 w-3" /> Pause</>
                        ) : (
                          <><Play className="mr-1 h-3 w-3" /> Play</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={restartAnimation}
                      >
                        <RotateCw className="mr-1 h-3 w-3" /> Restart
                      </Button>
                    </div>
                  </div>

                  <div 
                    ref={svgContainerRef}
                    className="bg-gray-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center"
                  >
                    <div className={isPlaying ? "" : "animation-paused"}>
                      <style dangerouslySetInnerHTML={{ __html: customCSS }} />
                      <div dangerouslySetInnerHTML={{ __html: selectedExample.svg }} />
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {selectedExample.description}
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Example Selector */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Choose Example</h3>
                  <div className="space-y-2">
                    {ANIMATION_EXAMPLES.map((example) => (
                      <Card
                        key={example.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedExample.id === example.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedExample(example)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{example.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {example.category}
                            </p>
                          </div>
                          <Badge variant="secondary">{example.category}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link href="/animate" className="inline-flex items-center text-primary hover:underline">
                      Try our full animation tool
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Animation Timeline</h3>
                
                <div className="space-y-6">
                  {/* Duration Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Duration</Label>
                      <span className="text-sm text-gray-500">{duration}s</span>
                    </div>
                    <Slider
                      value={[duration]}
                      onValueChange={(value) => setDuration(value[0])}
                      min={0.1}
                      max={5}
                      step={0.1}
                    />
                  </div>

                  {/* Easing Control */}
                  <div className="space-y-2">
                    <Label>Easing Function</Label>
                    <Select value={easing} onValueChange={setEasing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EASING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeline Visualization */}
                  <div className="space-y-2">
                    <Label>Timeline Visualization</Label>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="relative h-12 bg-white rounded">
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary/20 rounded transition-all"
                          style={{ 
                            width: "100%",
                            animation: `timeline ${duration}s ${easing} infinite`
                          }}
                        />
                        <div className="absolute top-0 left-0 h-full flex items-center px-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keyframes Visualization */}
                  <div className="space-y-2">
                    <Label>Keyframes</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-2 mb-1">0%</div>
                        <div className="text-xs text-gray-600">Start</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-primary/20 rounded p-2 mb-1">50%</div>
                        <div className="text-xs text-gray-600">Middle</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-2 mb-1">100%</div>
                        <div className="text-xs text-gray-600">End</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Animation Properties</h3>
                
                {/* Current Example Properties */}
                <div className="space-y-4">
                  <h4 className="font-medium">Current Animation Properties</h4>
                  <div className="grid gap-3">
                    {selectedExample.properties.map((prop, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <code className="text-sm font-mono">{prop.name}</code>
                            <p className="text-sm text-gray-600 mt-1">{prop.description}</p>
                          </div>
                          <Badge variant="outline">
                            {prop.value}{prop.unit || ""}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* CSS Editor */}
                <div className="space-y-2">
                  <Label>Custom CSS</Label>
                  <Textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="font-mono text-sm min-h-[200px]"
                    placeholder="/* Add your custom CSS here */"
                  />
                  <p className="text-sm text-gray-600">
                    Edit the CSS above to customize the animation
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Code Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Generated Code</h3>
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generateCompleteCode()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode(generateCompleteCode())}
                    >
                      {copied ? (
                        <><Check className="mr-1 h-3 w-3" /> Copied!</>
                      ) : (
                        <><Copy className="mr-1 h-3 w-3" /> Copy</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Browser Compatibility */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Browser Compatibility</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      {Object.entries(selectedExample.browserSupport).map(([browser, version]) => (
                        <div key={browser} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {browser === "chrome" && <Globe className="h-4 w-4" />}
                            {browser === "firefox" && <Globe className="h-4 w-4" />}
                            {browser === "safari" && <Monitor className="h-4 w-4" />}
                            {browser === "edge" && <Globe className="h-4 w-4" />}
                            <span className="capitalize">{browser}</span>
                          </div>
                          <Badge variant="secondary">{version}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Performance Tip:</strong> Use CSS animations instead of JavaScript 
                      when possible for better performance. GPU acceleration is automatically 
                      applied to transform and opacity properties.
                    </AlertDescription>
                  </Alert>

                  <Card className="p-4 border-primary bg-primary/5">
                    <h4 className="font-medium mb-2">Need Advanced Features?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Export your animations as video files with our premium tools
                    </p>
                    <Link href="/pricing?feature=video-export">
                      <Button className="w-full">
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade for Video Export
                      </Button>
                    </Link>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes timeline {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animation-paused * {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  )
}