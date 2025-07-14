import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Zap, FileDown, Video, Palette, Image, FileType, FileCode } from "lucide-react"

interface Tool {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface ToolsYouMightLikeProps {
  theme: string
}

export function ToolsYouMightLike({ theme }: ToolsYouMightLikeProps) {
  // Dynamic tool recommendations based on theme
  const getRecommendedTools = (): Tool[] => {
    const baseTools: Tool[] = [
      {
        title: "SVG Editor",
        description: "Edit and customize any SVG with our free online editor",
        href: "/tools/svg-editor",
        icon: <Edit className="h-5 w-5" />
      },
      {
        title: "SVG Optimizer",
        description: "Reduce file size while maintaining quality",
        href: "/tools/svg-optimizer",
        icon: <Zap className="h-5 w-5" />
      },
      {
        title: "SVG to Video",
        description: "Create animated videos from static SVGs",
        href: "/tools/svg-to-video",
        icon: <Video className="h-5 w-5" />,
        badge: "Premium"
      }
    ]

    // Add theme-specific converter recommendations
    const converterTools: Tool[] = []
    
    if (theme.includes("icon") || theme.includes("svg-icons")) {
      converterTools.push({
        title: "SVG to PNG",
        description: "Convert SVG icons to PNG format",
        href: "/convert/svg-to-png",
        icon: <Image className="h-5 w-5" aria-label="SVG to PNG converter icon" />
      })
      converterTools.push({
        title: "PNG to SVG",
        description: "Convert raster images to scalable vectors",
        href: "/convert/png-to-svg",
        icon: <FileType className="h-5 w-5" />
      })
    }

    if (theme.includes("hello-kitty") || theme.includes("bluey") || theme.includes("anime")) {
      converterTools.push({
        title: "SVG to PDF",
        description: "Create printable PDFs from SVGs",
        href: "/convert/svg-to-pdf",
        icon: <FileCode className="h-5 w-5" />
      })
    }

    if (theme.includes("flower") || theme.includes("heart") || theme.includes("wedding")) {
      converterTools.push({
        title: "AI Icon Generator",
        description: "Create custom decorative designs",
        href: "/ai-icon-generator",
        icon: <Palette className="h-5 w-5" />,
        badge: "AI-Powered"
      })
    }

    // Return 4 most relevant tools
    return [...converterTools, ...baseTools].slice(0, 4)
  }

  const tools = getRecommendedTools()

  return (
    <section className="py-12">
      <h3 className="text-2xl font-bold mb-8 text-center">Tools You Might Like</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Card key={tool.href} className="group hover:shadow-lg transition-all hover:border-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {tool.icon}
                </div>
                {tool.badge && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h4 className="font-semibold mb-2">{tool.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <Link href={tool.href} className="block">
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  Try Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}