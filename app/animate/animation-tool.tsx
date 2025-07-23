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
import { createClientComponentClient } from "@/lib/supabase"
// Animation preset type
interface AnimationPreset {
  name: string
  category: string
  keyframes: string
  animation: string
  setup?: string
}
// Animation presets
const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
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
  };
  // Update animation property
  const updateAnimation = (id: string, property: keyof AnimationElement, value: any) => {
    setAnimations(animations.map(anim => 
      anim.id === id ? { ...anim, [property]: value } : anim
    ))
  };
  // Remove animation
  const removeAnimation = (id: string) => {
    setAnimations(animations.filter(anim => anim.id !== id))
  };
  // Generate CSS code
  const generateCSS = () => {
    let css = ""
    const usedPresets = new Set<string>()
    animations.forEach(anim => {
      if (anim.preset && ANIMATION_PRESETS[anim.preset]) {
        usedPresets.add(anim.preset)
      }
    })
    // Add keyframes
    usedPresets.forEach(preset => {
      const presetData = ANIMATION_PRESETS[preset]
      if (presetData.keyframes) {
        css += presetData.keyframes + "\n\n"
      }
    })
    // Add animations
    animations.forEach(anim => {
      const preset = ANIMATION_PRESETS[anim.preset]
      css += `${anim.selector} {\n`
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
  };
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
  };
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
  };
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
  };
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
  };
  return (
    <div id="tool" className="py-8">
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-0">
          {/* Compact Step Indicator */}
          <div className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${activeTab === 'upload' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activeTab === 'upload' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  1
                </div>
                <span className="hidden sm:inline">Upload</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-2 ${activeTab === 'preview' ? 'text-primary font-semibold' : svgCode ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activeTab === 'preview' ? 'bg-primary text-white' : svgCode ? 'bg-muted' : 'bg-muted/50'}`}>
                  2
                </div>
                <span className="hidden sm:inline">Animate</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-2 ${activeTab === 'export' ? 'text-primary font-semibold' : animations.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activeTab === 'export' ? 'bg-primary text-white' : animations.length > 0 ? 'bg-muted' : 'bg-muted/50'}`}>
                  3
                </div>
                <span className="hidden sm:inline">Export</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
              <TabsList className="hidden">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="preview">Animate</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              {/* Upload Tab */}
              <TabsContent value="upload" className="mt-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold mb-2">Upload Your SVG</h3>
                    <p className="text-muted-foreground">Choose a file or paste your SVG code below</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* File Upload */}
                    <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".svg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="font-medium mb-1">Upload File</h4>
                      <p className="text-sm text-muted-foreground">Click to browse SVG files</p>
                    </Card>
                    {/* Code Paste */}
                    <Card className="p-6 text-center">
                      <Code className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="font-medium mb-1">Paste Code</h4>
                      <p className="text-sm text-muted-foreground">Enter SVG code below</p>
                    </Card>
                  </div>
                  {/* Code Input */}
                  <div>
                    <Textarea
                      placeholder="<svg>...</svg>"
                      value={svgCode}
                      onChange={(e) => setSvgCode(e.target.value)}
                      className="font-mono text-sm min-h-[200px] resize-none"
                    />
                  </div>
                  {svgCode && (
                    <Button 
                      onClick={() => setActiveTab("preview")}
                      className="w-full"
                      size="lg"
                    >
                      Continue to Animation Editor
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TabsContent>
              {/* Preview & Animate Tab */}
              <TabsContent value="preview" className="mt-6">
                <div className="space-y-6">
                  {/* Consolidated Preview Section */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="max-w-4xl mx-auto">
                      {/* Preview Controls */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Preview</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={isPlaying ? "default" : "outline"}
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsPlaying(false)
                              setTimeout(() => setIsPlaying(true), 100)
                            }}
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <div className="ml-4 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Zoom:</span>
                            <Slider
                              value={[previewScale]}
                              onValueChange={(value) => setPreviewScale(value[0])}
                              min={0.5}
                              max={2}
                              step={0.1}
                              className="w-24"
                            />
                            <span className="text-sm w-10">{Math.round(previewScale * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      {/* SVG Preview */}
                      <div 
                        ref={svgContainerRef}
                        className="bg-background rounded-lg border p-8 min-h-[300px] flex items-center justify-center overflow-hidden"
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
                    </div>
                  </div>
                  {/* Animation Controls */}
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold mb-4">Add Animations</h3>
                    {/* Quick Start - Element Selection */}
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <Label className="text-base">Select Element to Animate</Label>
                          <p className="text-sm text-muted-foreground mt-1">Choose which part of your SVG to animate</p>
                          <Select value={selectedElement} onValueChange={setSelectedElement}>
                            <SelectTrigger className="mt-3">
                              <SelectValue placeholder="Choose an element" />
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
                        </div>
                        {selectedElement && (
                          <Button onClick={addAnimation} size="lg" className="mt-6">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Add Animation
                          </Button>
                        )}
                      </div>
                    </Card>
                    {/* Animation Timeline */}
                    {animations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Animation Timeline</h4>
                        <div className="space-y-3">
                          {animations.map((anim) => (
                            <Card key={anim.id} className="p-4">
                              <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="info">{anim.selector}</Badge>
                                    <Badge variant="info" className="text-xs">
                                      {anim.preset && ANIMATION_PRESETS[anim.preset] ? ANIMATION_PRESETS[anim.preset].name : 'Custom'}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => removeAnimation(anim.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                {/* Compact Controls Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {/* Animation Type */}
                                  <div>
                                    <Label className="text-xs">Animation</Label>
                                    <Select
                                      value={anim.preset}
                                      onValueChange={(value) => updateAnimation(anim.id, "preset", value)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
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
                                  {/* Duration */}
                                  <div>
                                    <Label className="text-xs">Duration</Label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={anim.duration}
                                        onChange={(e) => updateAnimation(anim.id, "duration", parseFloat(e.target.value))}
                                        className="w-full h-8 px-2 text-sm border rounded"
                                        min="0.1"
                                        step="0.1"
                                      />
                                      <span className="text-xs text-muted-foreground">s</span>
                                    </div>
                                  </div>
                                  {/* Delay */}
                                  <div>
                                    <Label className="text-xs">Delay</Label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={anim.delay}
                                        onChange={(e) => updateAnimation(anim.id, "delay", parseFloat(e.target.value))}
                                        className="w-full h-8 px-2 text-sm border rounded"
                                        min="0"
                                        step="0.1"
                                      />
                                      <span className="text-xs text-muted-foreground">s</span>
                                    </div>
                                  </div>
                                  {/* Easing */}
                                  <div>
                                    <Label className="text-xs">Easing</Label>
                                    <Select
                                      value={anim.easing}
                                      onValueChange={(value) => updateAnimation(anim.id, "easing", value)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
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
                                </div>
                                {/* Advanced Options - Collapsed by default */}
                                <div className="flex gap-3">
                                  <Select
                                    value={anim.iterationCount}
                                    onValueChange={(value) => updateAnimation(anim.id, "iterationCount", value)}
                                  >
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">Play once</SelectItem>
                                      <SelectItem value="2">Play twice</SelectItem>
                                      <SelectItem value="3">Play 3 times</SelectItem>
                                      <SelectItem value="infinite">Loop forever</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={anim.direction}
                                    onValueChange={(value) => updateAnimation(anim.id, "direction", value)}
                                  >
                                    <SelectTrigger className="h-8 text-sm">
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
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Continue button to Export */}
                    {animations.length > 0 && (
                      <div className="mt-6 text-center">
                        <Button
                          onClick={() => setActiveTab("export")}
                          size="lg"
                          className="min-w-[200px]"
                        >
                          Continue to Export
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              {/* Export Tab */}
              <TabsContent value="export" className="mt-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold mb-2">Export Your Animation</h3>
                    <p className="text-muted-foreground">Download your animated SVG or upgrade for video export</p>
                  </div>
                  {/* Export Options Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Free SVG Export */}
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Code className="w-8 h-8 text-primary" />
                          <div>
                            <h4 className="font-semibold text-lg">Animated SVG</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Export as SVG with embedded CSS animations
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Button onClick={exportSVG} className="w-full" size="lg">
                            <Download className="mr-2 h-4 w-4" />
                            Download SVG
                          </Button>
                          <Button onClick={copyToClipboard} variant="outline" className="w-full">
                            {copied ? (
                              <><Check className="mr-2 h-4 w-4" /> Copied!</>
                            ) : (
                              <><Copy className="mr-2 h-4 w-4" /> Copy Code</>
                            )}
                          </Button>
                        </div>
                        <Badge variant="success" className="text-xs">Free • Unlimited exports</Badge>
                      </div>
                    </Card>
                    {/* Premium Video Export */}
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Video className="w-8 h-8 text-primary" />
                          <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                              Video Export
                              <Badge variant="warning">Premium</Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Convert to MP4, WebM, or GIF format
                            </p>
                          </div>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            HD & 4K resolution
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Custom frame rates
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Transparent backgrounds
                          </li>
                        </ul>
                        <Button 
                          onClick={handleVideoExport} 
                          className="w-full"
                          size="lg"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Upgrade for Video Export
                        </Button>
                      </div>
                    </Card>
                  </div>
                  {/* Pro Tip */}
                  <Alert className="mt-6">
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro tip:</strong> Use "infinite" iteration count for looping animations that will be converted to video.
                    </AlertDescription>
                  </Alert>
                  {/* Code Preview Toggle */}
                  {showCode && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Generated Code</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowCode(false)}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generateAnimatedSVG()}</code>
                      </pre>
                    </div>
                  )}
                  {!showCode && (
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => setShowCode(true)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Generated Code
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}