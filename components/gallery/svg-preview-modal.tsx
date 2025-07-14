"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, FileImage, FileText, Sparkles, X, ExternalLink, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { GallerySVG, getSVGFullPath, getGallerySVGs } from "@/app/gallery/gallery-data"
import { useConverterAnalytics } from "@/hooks/use-analytics"
import { cn } from "@/lib/utils"
import LazySVG from "@/components/lazy-svg"

interface SVGPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  svg: GallerySVG
  theme: string
  relatedSVGs?: GallerySVG[]
}

export default function SVGPreviewModal({
  isOpen,
  onClose,
  svg,
  theme,
  relatedSVGs: providedRelatedSVGs
}: SVGPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [svgContent, setSvgContent] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const { trackDownload } = useConverterAnalytics(`gallery-${theme}`)

  // Get related SVGs if not provided
  const relatedSVGs = providedRelatedSVGs || getGallerySVGs(theme)
    .filter(s => s.filename !== svg.filename)
    .slice(0, 4)

  const svgPath = getSVGFullPath(theme, svg.filename)

  // Load SVG content
  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    setError(null)

    fetch(svgPath)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load SVG")
        return res.text()
      })
      .then(content => {
        setSvgContent(content)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [svgPath, isOpen])

  const handleDownloadSVG = () => {
    if (!svgContent) return

    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = svg.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Track download
    trackDownload(true)
    toast({
      title: "Downloaded!",
      description: `${svg.filename} has been downloaded successfully.`,
    })
  }

  const handleCopyCode = async () => {
    if (!svgContent) return

    try {
      await navigator.clipboard.writeText(svgContent)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
      toast({
        title: "Copied!",
        description: "SVG code copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">{svg.title}</DialogTitle>
                <DialogDescription className="mt-2">
                  {svg.description}
                </DialogDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {svg.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">SVG Code</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-6">
                  <div className="space-y-6">
                    {/* SVG Preview */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                      {isLoading ? (
                        <Skeleton className="w-64 h-64" />
                      ) : error ? (
                        <div className="text-center text-red-500">
                          <p>Failed to load SVG</p>
                          <p className="text-sm mt-2">{error}</p>
                        </div>
                      ) : (
                        <LazySVG
                          content={svgContent}
                          className="w-full max-w-md h-64 flex items-center justify-center"
                          priority
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        size="lg" 
                        onClick={handleDownloadSVG}
                        disabled={!svgContent}
                        className="w-full"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download SVG (Free)
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="default"
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Link href="/ai-icon-generator">
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Similar with AI
                        </Link>
                      </Button>
                    </div>

                    {/* Convert Options */}
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Convert to Other Formats</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href={`/convert/svg-to-png?file=${encodeURIComponent(svgPath)}`}>
                              <FileImage className="mr-2 h-4 w-4" />
                              Convert to PNG
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href={`/convert/svg-to-pdf?file=${encodeURIComponent(svgPath)}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              Convert to PDF
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href="/convert/svg-to-jpg">
                              <FileImage className="mr-2 h-4 w-4" />
                              Convert to JPG
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">SVG Source Code</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        disabled={!svgContent}
                      >
                        {copiedCode ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-[400px]">
                        <code className="text-sm">
                          {isLoading ? "Loading..." : error ? "Failed to load SVG code" : svgContent}
                        </code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Related SVGs */}
              {relatedSVGs.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold text-lg mb-4">Related SVGs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {relatedSVGs.map((relatedSvg, idx) => (
                      <Card 
                        key={idx}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => {
                          // Close current modal and open new one with related SVG
                          onClose()
                          // Parent component should handle opening new modal
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                            <div className="text-4xl">🎨</div>
                          </div>
                          <p className="text-sm font-medium truncate">{relatedSvg.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer CTA */}
          <div className="border-t bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Need a Custom Design?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create unique SVG icons and illustrations with our AI-powered generator
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/ai-icon-generator">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try AI Icon Generator
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}