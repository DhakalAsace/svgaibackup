"use client"

import { Download, FileText, Code, Package, Palette, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Resource {
  id: string
  title: string
  description: string
  type: "pdf" | "svg" | "code" | "template" | "cheatsheet"
  size: string
  downloadUrl: string
  category: string
  popular?: boolean
}

interface DownloadableResourcesProps {
  resources: Resource[]
  title?: string
  description?: string
}

const iconMap = {
  pdf: FileText,
  svg: Package,
  code: Code,
  template: Palette,
  cheatsheet: BookOpen
}

const typeColors = {
  pdf: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  svg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  code: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  template: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cheatsheet: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
}

export function DownloadableResources({
  resources,
  title = "Free SVG Resources",
  description = "Download these helpful resources to enhance your SVG skills"
}: DownloadableResourcesProps) {
  const handleDownload = (resource: Resource) => {
    // Track download event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'download', {
        event_category: 'resources',
        event_label: resource.title,
        value: resource.type
      })
    }
    
    // Open download link
    window.open(resource.downloadUrl, '_blank')
  }

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryResources.map((resource) => {
              const Icon = iconMap[resource.type]
              
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={typeColors[resource.type]}>
                          {resource.type.toUpperCase()}
                        </Badge>
                        {resource.popular && (
                          <Badge variant="default">Popular</Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Size: {resource.size}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Want More Resources?</CardTitle>
          <CardDescription>
            Get access to premium SVG templates and advanced tutorials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild>
              <a href="/ai-icon-generator">
                Create Custom SVGs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/learn">
                Browse All Tutorials
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Example resources data structure
export const sampleResources: Resource[] = [
  {
    id: "svg-cheatsheet",
    title: "SVG Syntax Cheatsheet",
    description: "Quick reference for all SVG elements and attributes",
    type: "pdf",
    size: "245 KB",
    downloadUrl: "/downloads/svg-cheatsheet.pdf",
    category: "reference",
    popular: true
  },
  {
    id: "icon-starter-pack",
    title: "100 Basic SVG Icons",
    description: "Essential icon collection for web projects",
    type: "svg",
    size: "1.2 MB",
    downloadUrl: "/downloads/icon-starter-pack.zip",
    category: "templates",
    popular: true
  },
  {
    id: "svg-animation-examples",
    title: "SVG Animation Code Examples",
    description: "20+ ready-to-use animation snippets",
    type: "code",
    size: "89 KB",
    downloadUrl: "/downloads/svg-animations.zip",
    category: "code examples"
  },
  {
    id: "logo-templates",
    title: "SVG Logo Templates",
    description: "10 customizable logo designs",
    type: "template",
    size: "456 KB",
    downloadUrl: "/downloads/logo-templates.zip",
    category: "templates"
  },
  {
    id: "path-commands-guide",
    title: "SVG Path Commands Guide",
    description: "Master the SVG path element",
    type: "cheatsheet",
    size: "178 KB",
    downloadUrl: "/downloads/path-commands.pdf",
    category: "reference"
  },
  {
    id: "optimization-toolkit",
    title: "SVG Optimization Scripts",
    description: "Batch optimization tools and scripts",
    type: "code",
    size: "234 KB",
    downloadUrl: "/downloads/optimization-toolkit.zip",
    category: "tools"
  }
]