"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Terminal, 
  Monitor, 
  Smartphone, 
  ChevronRight,
  FileIcon,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Code2,
  Mouse,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

// TypeScript interfaces
export interface ConversionStep {
  id: number
  title: string
  description: string
  command?: string
  tip?: string
  warning?: string
}

export interface ConversionMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  steps: ConversionStep[]
  pros?: string[]
  cons?: string[]
}

export interface PlatformInstructions {
  windows?: ConversionStep[]
  mac?: ConversionStep[]
  linux?: ConversionStep[]
}

export interface TroubleshootingItem {
  issue: string
  solution: string
  code?: string
}

export interface ConversionGuideProps {
  // Basic configuration
  fromFormat: string
  toFormat: string
  title?: string
  description?: string
  
  // Prerequisites
  prerequisites?: string[]
  
  // Conversion methods
  methods?: ConversionMethod[]
  defaultMethod?: string
  
  // Platform-specific instructions
  platformInstructions?: PlatformInstructions
  
  // Troubleshooting
  commonIssues?: TroubleshootingItem[]
  
  // Before/After comparison
  showComparison?: boolean
  beforeExample?: {
    content: string
    filename: string
    size?: string
  }
  afterExample?: {
    content: string
    filename: string
    size?: string
  }
  
  // Downloads
  exampleFiles?: {
    label: string
    url: string
    filename: string
    size?: string
  }[]
  
  // Embedded converter component
  converterComponent?: React.ReactNode
  
  // SEO configuration
  schemaMarkup?: boolean
  headingLevel?: 'h2' | 'h3'
  
  // UI customization
  className?: string
}

// Default conversion methods if none provided
const getDefaultMethods = (fromFormat: string, toFormat: string): ConversionMethod[] => [
  {
    id: 'online',
    name: 'Online Tool',
    icon: <Mouse className="w-4 h-4" />,
    description: 'Use our free online converter - no installation required',
    steps: [
      {
        id: 1,
        title: 'Upload your file',
        description: `Click the upload button or drag and drop your ${fromFormat.toUpperCase()} file into the converter above.`
      },
      {
        id: 2,
        title: 'Configure settings',
        description: 'Adjust quality, dimensions, or other format-specific options as needed.'
      },
      {
        id: 3,
        title: 'Convert the file',
        description: `Click "Convert to ${toFormat.toUpperCase()}" and wait for the process to complete.`
      },
      {
        id: 4,
        title: 'Download result',
        description: `Download your converted ${toFormat.toUpperCase()} file to your device.`
      }
    ],
    pros: ['No installation required', 'Works on any device', 'Free to use'],
    cons: ['File size limits', 'Requires internet connection']
  },
  {
    id: 'command-line',
    name: 'Command Line',
    icon: <Terminal className="w-4 h-4" />,
    description: 'Use powerful command-line tools for batch processing',
    steps: [
      {
        id: 1,
        title: 'Install required tools',
        description: 'Install ImageMagick or a similar conversion tool for your operating system.',
        command: 'brew install imagemagick  # macOS\nsudo apt-get install imagemagick  # Ubuntu/Debian\nchoco install imagemagick  # Windows'
      },
      {
        id: 2,
        title: 'Navigate to file location',
        description: 'Open terminal and navigate to the directory containing your files.',
        command: 'cd /path/to/your/files'
      },
      {
        id: 3,
        title: 'Run conversion command',
        description: `Execute the conversion command for ${fromFormat} to ${toFormat}.`,
        command: `convert input.${fromFormat} output.${toFormat}`
      },
      {
        id: 4,
        title: 'Batch conversion (optional)',
        description: 'Convert files efficiently using command line tools.',
        command: `for file in *.${fromFormat}; do convert "$file" "\${file%.${fromFormat}}.${toFormat}"; done`
      }
    ],
    pros: ['Batch processing', 'Scriptable', 'No file size limits'],
    cons: ['Requires technical knowledge', 'Installation needed']
  },
  {
    id: 'software',
    name: 'Desktop Software',
    icon: <Monitor className="w-4 h-4" />,
    description: 'Use professional software for advanced features',
    steps: [
      {
        id: 1,
        title: 'Choose and install software',
        description: 'Download and install image editing software like GIMP, Photoshop, or Inkscape.',
        tip: 'GIMP and Inkscape are free, open-source alternatives'
      },
      {
        id: 2,
        title: 'Open your file',
        description: `Open your ${fromFormat.toUpperCase()} file in the software using File > Open.`
      },
      {
        id: 3,
        title: 'Export in new format',
        description: `Go to File > Export As (or Save As) and select ${toFormat.toUpperCase()} as the output format.`
      },
      {
        id: 4,
        title: 'Configure export settings',
        description: 'Adjust quality, compression, and other format-specific settings before saving.',
        tip: 'Higher quality settings result in larger file sizes'
      }
    ],
    pros: ['Advanced editing options', 'Preview before saving', 'Professional features'],
    cons: ['Software installation required', 'Learning curve']
  }
]

export default function ConversionGuide({
  fromFormat,
  toFormat,
  title,
  description,
  prerequisites = [],
  methods,
  defaultMethod = 'online',
  platformInstructions,
  commonIssues = [],
  showComparison = false,
  beforeExample,
  afterExample,
  exampleFiles = [],
  converterComponent,
  schemaMarkup = true,
  headingLevel = 'h2',
  className
}: ConversionGuideProps) {
  const [activeMethod, setActiveMethod] = useState(defaultMethod)
  const [activePlatform, setActivePlatform] = useState<'windows' | 'mac' | 'linux'>('windows')
  
  const Heading = headingLevel
  const conversionMethods = methods || getDefaultMethods(fromFormat, toFormat)
  
  // Generate HowTo schema markup
  const generateSchemaMarkup = () => {
    if (!schemaMarkup) return null
    
    const activeMethodData = conversionMethods.find(m => m.id === activeMethod)
    if (!activeMethodData) return null
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title || `How to Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}`,
      "description": description || `Step-by-step guide to convert ${fromFormat} files to ${toFormat} format`,
      "step": activeMethodData.steps.map((step, index) => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.description,
        "position": index + 1
      }))
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    )
  }
  
  return (
    <>
      {generateSchemaMarkup()}
      <div className={cn("space-y-8", className)}>
        {/* Header */}
        <div className="space-y-4">
          <Heading className="text-3xl font-bold tracking-tight">
            {title || `How to Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}`}
          </Heading>
          {description && (
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {/* Embedded Converter */}
        {converterComponent && (
          <div className="my-8">
            <Card>
              <CardHeader>
                <CardTitle>Try Our Free Converter</CardTitle>
                <CardDescription>
                  Convert your files instantly using our online tool
                </CardDescription>
              </CardHeader>
              <CardContent>
                {converterComponent}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Before You Begin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Conversion Methods */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Choose Your Method</h3>
          
          <Tabs value={activeMethod} onValueChange={setActiveMethod}>
            <TabsList className="grid w-full grid-cols-3">
              {conversionMethods.map((method) => (
                <TabsTrigger 
                  key={method.id} 
                  value={method.id}
                  className="flex items-center gap-2"
                >
                  {method.icon}
                  <span className="hidden sm:inline">{method.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {conversionMethods.map((method) => (
              <TabsContent key={method.id} value={method.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{method.name}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Steps */}
                    <div className="space-y-4">
                      {method.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            
                            {step.command && (
                              <div className="relative">
                                <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-sm overflow-x-auto">
                                  <code>{step.command}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute top-2 right-2"
                                  onClick={() => navigator.clipboard.writeText(step.command || '')}
                                >
                                  <Code2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            
                            {step.tip && (
                              <Alert>
                                <Lightbulb className="h-4 w-4" />
                                <AlertDescription>{step.tip}</AlertDescription>
                              </Alert>
                            )}
                            
                            {step.warning && (
                              <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{step.warning}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pros and Cons */}
                    {(method.pros || method.cons) && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        {method.pros && (
                          <div className="space-y-2">
                            <h5 className="font-semibold text-green-700 dark:text-green-400">Advantages</h5>
                            <ul className="space-y-1">
                              {method.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {method.cons && (
                          <div className="space-y-2">
                            <h5 className="font-semibold text-orange-700 dark:text-orange-400">Considerations</h5>
                            <ul className="space-y-1">
                              {method.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        {/* Platform-Specific Instructions */}
        {platformInstructions && (
          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Instructions</CardTitle>
              <CardDescription>
                Detailed steps for your operating system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activePlatform} onValueChange={(v) => setActivePlatform(v as any)}>
                <TabsList>
                  {platformInstructions.windows && (
                    <TabsTrigger value="windows">Windows</TabsTrigger>
                  )}
                  {platformInstructions.mac && (
                    <TabsTrigger value="mac">macOS</TabsTrigger>
                  )}
                  {platformInstructions.linux && (
                    <TabsTrigger value="linux">Linux</TabsTrigger>
                  )}
                </TabsList>
                
                {platformInstructions.windows && (
                  <TabsContent value="windows" className="space-y-4">
                    {platformInstructions.windows.map((step, index) => (
                      <div key={step.id} className="flex gap-4">
                        <Badge variant="secondary" className="flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.command && (
                            <pre className="bg-slate-900 text-slate-50 p-2 rounded text-sm">
                              <code>{step.command}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                )}
                
                {platformInstructions.mac && (
                  <TabsContent value="mac" className="space-y-4">
                    {platformInstructions.mac.map((step, index) => (
                      <div key={step.id} className="flex gap-4">
                        <Badge variant="secondary" className="flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.command && (
                            <pre className="bg-slate-900 text-slate-50 p-2 rounded text-sm">
                              <code>{step.command}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                )}
                
                {platformInstructions.linux && (
                  <TabsContent value="linux" className="space-y-4">
                    {platformInstructions.linux.map((step, index) => (
                      <div key={step.id} className="flex gap-4">
                        <Badge variant="secondary" className="flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.command && (
                            <pre className="bg-slate-900 text-slate-50 p-2 rounded text-sm">
                              <code>{step.command}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Before/After Comparison */}
        {showComparison && beforeExample && afterExample && (
          <Card>
            <CardHeader>
              <CardTitle>Before & After Comparison</CardTitle>
              <CardDescription>
                See the difference between {fromFormat.toUpperCase()} and {toFormat.toUpperCase()} formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Before ({fromFormat.toUpperCase()})</h4>
                    {beforeExample.size && (
                      <Badge variant="outline">{beforeExample.size}</Badge>
                    )}
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <FileIcon className="w-4 h-4" />
                      <span className="text-sm font-mono">{beforeExample.filename}</span>
                    </div>
                    <ScrollArea className="h-48">
                      <pre className="text-xs">
                        <code>{beforeExample.content}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">After ({toFormat.toUpperCase()})</h4>
                    {afterExample.size && (
                      <Badge variant="outline">{afterExample.size}</Badge>
                    )}
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <FileIcon className="w-4 h-4" />
                      <span className="text-sm font-mono">{afterExample.filename}</span>
                    </div>
                    <ScrollArea className="h-48">
                      <pre className="text-xs">
                        <code>{afterExample.content}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Troubleshooting */}
        {commonIssues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonIssues.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <details className="group">
                      <summary className="flex items-center gap-2 cursor-pointer list-none">
                        <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                        <span className="font-medium">{item.issue}</span>
                      </summary>
                      <div className="pl-6 pt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                        {item.code && (
                          <pre className="bg-slate-900 text-slate-50 p-2 rounded text-sm">
                            <code>{item.code}</code>
                          </pre>
                        )}
                      </div>
                    </details>
                    {index < commonIssues.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Example Files Download */}
        {exampleFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Download Example Files</CardTitle>
              <CardDescription>
                Practice with our sample files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {exampleFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileIcon className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.filename} {file.size && `• ${file.size}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Quick Action CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Ready to convert your {fromFormat.toUpperCase()} files?
              </h3>
              <p className="text-sm opacity-90">
                Use our free online converter for instant results
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Converting
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}