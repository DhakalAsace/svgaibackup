"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { 
  Upload, 
  Download, 
  Play, 
  Pause, 
  RotateCw, 
  Zap, 
  Code, 
  Copy, 
  Check,
  Video,
  Sparkles,
  Clock,
  Move,
  Scale,
  RotateCcw,
  Eye,
  EyeOff,
  Layers,
  ChevronRight,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Animation presets
const ANIMATION_PRESETS = {
  // Entrance animations
  "fade-in": {
    name: "Fade In",
    category: "entrance",
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }`,
    animation: "fadeIn 1s ease-out forwards"
  },
  "slide-in-left": {
    name: "Slide In Left",
    category: "entrance",
    keyframes: `
      @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }`,
    animation: "slideInLeft 0.5s ease-out forwards"
  },
  "slide-in-right": {
    name: "Slide In Right",
    category: "entrance",
    keyframes: `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }`,
    animation: "slideInRight 0.5s ease-out forwards"
  },
  "zoom-in": {
    name: "Zoom In",
    category: "entrance",
    keyframes: `
      @keyframes zoomIn {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }`,
    animation: "zoomIn 0.5s ease-out forwards"
  },
  "bounce-in": {
    name: "Bounce In",
    category: "entrance",
    keyframes: `
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }`,
    animation: "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
  },
  
  // Emphasis animations
  "pulse": {
    name: "Pulse",
    category: "emphasis",
    keyframes: `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }`,
    animation: "pulse 2s ease-in-out infinite"
  },
  "shake": {
    name: "Shake",
    category: "emphasis",
    keyframes: `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }`,
    animation: "shake 0.5s ease-in-out"
  },
  "swing": {
    name: "Swing",
    category: "emphasis",
    keyframes: `
      @keyframes swing {
        20% { transform: rotate(15deg); }
        40% { transform: rotate(-10deg); }
        60% { transform: rotate(5deg); }
        80% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }`,
    animation: "swing 1s ease-in-out"
  },
  "glow": {
    name: "Glow",
    category: "emphasis",
    keyframes: `
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5)); }
        50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)); }
      }`,
    animation: "glow 2s ease-in-out infinite"
  },
  
  // Continuous animations
  "rotate": {
    name: "Rotate",
    category: "continuous",
    keyframes: `
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }`,
    animation: "rotate 2s linear infinite"
  },
  "float": {
    name: "Float",
    category: "continuous",
    keyframes: `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }`,
    animation: "float 3s ease-in-out infinite"
  },
  "morph": {
    name: "Morph",
    category: "continuous",
    keyframes: `
      @keyframes morph {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(90deg); }
        50% { transform: scale(0.9) rotate(180deg); }
        75% { transform: scale(1.05) rotate(270deg); }
      }`,
    animation: "morph 4s ease-in-out infinite"
  },
  
  // Path animations
  "draw": {
    name: "Draw Path",
    category: "path",
    keyframes: `
      @keyframes draw {
        from { stroke-dashoffset: 1000; }
        to { stroke-dashoffset: 0; }
      }`,
    animation: "draw 2s ease-out forwards",
    setup: "stroke-dasharray: 1000; stroke-dashoffset: 1000;"
  },
  "dash": {
    name: "Dashed Line",
    category: "path",
    keyframes: `
      @keyframes dash {
        to { stroke-dashoffset: -10; }
      }`,
    animation: "dash 0.5s linear infinite",
    setup: "stroke-dasharray: 5, 5;"
  }
}

// Easing functions
const EASING_FUNCTIONS = {
  "linear": "linear",
  "ease": "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  "elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
}

interface AnimationElement {
  id: string
  selector: string
  preset: string
  duration: number
  delay: number
  easing: string
  iterationCount: string
  direction: string
  fillMode: string
  customAnimation?: string
}

export default function AnimationTool() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [svgCode, setSvgCode] = useState("")
  const [svgElements, setSvgElements] = useState<string[]>([])
  const [animations, setAnimations] = useState<AnimationElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [previewScale, setPreviewScale] = useState(1)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse SVG elements when code changes
  useEffect(() => {
    if (!svgCode) return

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgCode, "image/svg+xml")
      const elements: string[] = []

      // Get all animatable elements
      const animatableElements = doc.querySelectorAll("path, circle, rect, ellipse, line, polyline, polygon, text, g")
      animatableElements.forEach((el, index) => {
        const id = el.id || `element-${index}`
        if (!el.id) {
          el.setAttribute("id", id)
        }
        elements.push(`#${id}`)
      })

      setSvgElements(elements)
      
      // Update SVG code with IDs
      const serializer = new XMLSerializer()
      const updatedSvg = serializer.serializeToString(doc.documentElement)
      if (updatedSvg !== svgCode) {
        setSvgCode(updatedSvg)
      }
    } catch (error) {
      console.error("Error parsing SVG:", error)
    }
  }, [svgCode])

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgCode(content)
      setActiveTab("preview")
    }
    reader.readAsText(file)
  }

  // Add animation to element
  const addAnimation = () => {
    if (!selectedElement) return

    const newAnimation: AnimationElement = {
      id: `anim-${Date.now()}`,
      selector: selectedElement,
      preset: "fade-in",
      duration: 1,
      delay: 0,
      easing: "ease-out",
      iterationCount: "1",
      direction: "normal",
      fillMode: "forwards"
    }

    setAnimations([...animations, newAnimation])
  }

  // Update animation property
  const updateAnimation = (id: string, property: keyof AnimationElement, value: any) => {
    setAnimations(animations.map(anim => 
      anim.id === id ? { ...anim, [property]: value } : anim
    ))
  }

  // Remove animation
  const removeAnimation = (id: string) => {
    setAnimations(animations.filter(anim => anim.id !== id))
  }

  // Generate CSS code
  const generateCSS = () => {
    let css = ""
    const usedPresets = new Set<string>()

    animations.forEach(anim => {
      if (anim.preset && ANIMATION_PRESETS[anim.preset as keyof typeof ANIMATION_PRESETS]) {
        usedPresets.add(anim.preset)
      }
    })

    // Add keyframes
    usedPresets.forEach(preset => {
      const presetData = ANIMATION_PRESETS[preset as keyof typeof ANIMATION_PRESETS]
      if (presetData.keyframes) {
        css += presetData.keyframes + "\n\n"
      }
    })

    // Add animations
    animations.forEach(anim => {
      const preset = ANIMATION_PRESETS[anim.preset as keyof typeof ANIMATION_PRESETS]
      
      css += `${anim.selector} {\n`
      
      if (preset?.setup) {
        css += `  ${preset.setup}\n`
      }
      
      if (anim.customAnimation) {
        css += `  animation: ${anim.customAnimation};\n`
      } else {
        const animName = preset?.animation.split(" ")[0] || anim.preset
        css += `  animation-name: ${animName};\n`
        css += `  animation-duration: ${anim.duration}s;\n`
        css += `  animation-delay: ${anim.delay}s;\n`
        css += `  animation-timing-function: ${anim.easing};\n`
        css += `  animation-iteration-count: ${anim.iterationCount};\n`
        css += `  animation-direction: ${anim.direction};\n`
        css += `  animation-fill-mode: ${anim.fillMode};\n`
      }
      
      css += `}\n\n`
    })

    return css
  }

  // Generate animated SVG
  const generateAnimatedSVG = () => {
    const css = generateCSS()
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode, "image/svg+xml")
    
    // Add style element
    const styleElement = doc.createElementNS("http://www.w3.org/2000/svg", "style")
    styleElement.textContent = css
    doc.documentElement.insertBefore(styleElement, doc.documentElement.firstChild)
    
    const serializer = new XMLSerializer()
    return serializer.serializeToString(doc.documentElement)
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    const animatedSVG = generateAnimatedSVG()
    await navigator.clipboard.writeText(animatedSVG)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Animated SVG code copied to clipboard"
    })
  }

  // Export animated SVG
  const exportSVG = () => {
    const animatedSVG = generateAnimatedSVG()
    const blob = new Blob([animatedSVG], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "animated.svg"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Video export (premium feature)
  const handleVideoExport = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login?returnUrl=/animate&feature=video-export")
      return
    }

    // Check if user has premium subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single()

    if (!profile || profile.subscription_tier === "free") {
      router.push("/pricing?feature=video-export")
      return
    }

    // Implement video export functionality
    toast({
      title: "Video Export",
      description: "Video export feature coming soon for premium users!"
    })
  }

  return (
    <section id="tool" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="w-6 h-6" />
              SVG Animation Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload SVG</TabsTrigger>
                <TabsTrigger value="preview" disabled={!svgCode}>Preview & Animate</TabsTrigger>
                <TabsTrigger value="export" disabled={animations.length === 0}>Export</TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="svg-upload">Upload SVG File</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".svg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="svg-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose SVG File
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="svg-code">Paste SVG Code</Label>
                    <Textarea
                      id="svg-code"
                      placeholder="<svg>...</svg>"
                      value={svgCode}
                      onChange={(e) => setSvgCode(e.target.value)}
                      className="mt-2 font-mono text-sm min-h-[200px]"
                    />
                  </div>

                  {svgCode && (
                    <Button 
                      onClick={() => setActiveTab("preview")}
                      className="w-full"
                    >
                      Continue to Animation Editor
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Preview & Animate Tab */}
              <TabsContent value="preview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Preview Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Preview</h3>
                      <div className="flex items-center gap-2">
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
                          onClick={() => {
                            setIsPlaying(false)
                            setTimeout(() => setIsPlaying(true), 100)
                          }}
                        >
                          <RotateCw className="mr-1 h-3 w-3" /> Restart
                        </Button>
                      </div>
                    </div>

                    <div 
                      ref={svgContainerRef}
                      className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center overflow-hidden"
                    >
                      {svgCode && (
                        <div
                          className={isPlaying ? "" : "animation-paused"}
                          style={{ transform: `scale(${previewScale})` }}
                          dangerouslySetInnerHTML={{ 
                            __html: `<style>${generateCSS()}</style>${svgCode}` 
                          }}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Label>Zoom:</Label>
                      <Slider
                        value={[previewScale]}
                        onValueChange={(value) => setPreviewScale(value[0])}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 w-12">{Math.round(previewScale * 100)}%</span>
                    </div>
                  </div>

                  {/* Animation Controls */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Animation Timeline</h3>

                    {/* Element Selector */}
                    <div className="space-y-2">
                      <Label>Select Element</Label>
                      <Select value={selectedElement} onValueChange={setSelectedElement}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an element to animate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="svg">Entire SVG</SelectItem>
                          {svgElements.map((element) => (
                            <SelectItem key={element} value={element}>
                              {element}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedElement && (
                        <Button onClick={addAnimation} className="w-full">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Add Animation
                        </Button>
                      )}
                    </div>

                    {/* Animation List */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {animations.map((anim) => (
                        <Card key={anim.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{anim.selector}</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeAnimation(anim.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-3">
                            <div>
                              <Label>Animation Preset</Label>
                              <Select
                                value={anim.preset}
                                onValueChange={(value) => updateAnimation(anim.id, "preset", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="custom">Custom</SelectItem>
                                  {Object.entries(ANIMATION_PRESETS).map(([key, preset]) => (
                                    <SelectItem key={key} value={key}>
                                      {preset.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Duration (s)</Label>
                                <input
                                  type="number"
                                  value={anim.duration}
                                  onChange={(e) => updateAnimation(anim.id, "duration", parseFloat(e.target.value))}
                                  className="w-full px-3 py-2 border rounded-md"
                                  min="0.1"
                                  step="0.1"
                                />
                              </div>
                              <div>
                                <Label>Delay (s)</Label>
                                <input
                                  type="number"
                                  value={anim.delay}
                                  onChange={(e) => updateAnimation(anim.id, "delay", parseFloat(e.target.value))}
                                  className="w-full px-3 py-2 border rounded-md"
                                  min="0"
                                  step="0.1"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Easing</Label>
                              <Select
                                value={anim.easing}
                                onValueChange={(value) => updateAnimation(anim.id, "easing", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(EASING_FUNCTIONS).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                      {key}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Repeat</Label>
                                <Select
                                  value={anim.iterationCount}
                                  onValueChange={(value) => updateAnimation(anim.id, "iterationCount", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Once</SelectItem>
                                    <SelectItem value="2">Twice</SelectItem>
                                    <SelectItem value="3">3 times</SelectItem>
                                    <SelectItem value="infinite">Infinite</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Direction</Label>
                                <Select
                                  value={anim.direction}
                                  onValueChange={(value) => updateAnimation(anim.id, "direction", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="reverse">Reverse</SelectItem>
                                    <SelectItem value="alternate">Alternate</SelectItem>
                                    <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Code Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Generated Code</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCode(!showCode)}
                      >
                        {showCode ? (
                          <><EyeOff className="mr-1 h-3 w-3" /> Hide Code</>
                        ) : (
                          <><Eye className="mr-1 h-3 w-3" /> Show Code</>
                        )}
                      </Button>
                    </div>

                    {showCode && (
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{generateAnimatedSVG()}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <><Check className="mr-1 h-3 w-3" /> Copied!</>
                          ) : (
                            <><Copy className="mr-1 h-3 w-3" /> Copy</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Export Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Options</h3>

                    <Card className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Code className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">Animated SVG</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Export as a standalone SVG file with embedded CSS animations
                          </p>
                        </div>
                      </div>
                      <Button onClick={exportSVG} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download SVG
                      </Button>
                    </Card>

                    <Card className="p-4 space-y-3 border-indigo-200 bg-indigo-50">
                      <div className="flex items-start gap-3">
                        <Video className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center gap-2">
                            Video Export
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Premium</Badge>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Convert your animation to MP4, WebM, or GIF format
                          </p>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• HD & 4K resolution</li>
                            <li>• Custom frame rates</li>
                            <li>• Transparent backgrounds</li>
                          </ul>
                        </div>
                      </div>
                      <Button 
                        onClick={handleVideoExport} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade for Video Export
                      </Button>
                    </Card>

                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pro Tip:</strong> Test your animations across different browsers 
                        to ensure compatibility. Modern browsers have excellent SVG animation support!
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <style jsx global>{`
          .animation-paused * {
            animation-play-state: paused !important;
          }
        `}</style>
      </div>
    </section>
  )
}