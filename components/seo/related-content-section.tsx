import Link from 'next/link'
import { ArrowRight, FileCode, Image, BookOpen, Wrench } from 'lucide-react'
import { getMixedRelatedContent } from '@/lib/seo/related-content'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RelatedContentSectionProps {
  currentType: 'converter' | 'gallery' | 'learn' | 'tool'
  currentSlug: string
  keywords: string[]
  title?: string
  className?: string
}

export function RelatedContentSection({
  currentType,
  currentSlug,
  keywords,
  title = 'Related Resources',
  className = '',
}: RelatedContentSectionProps) {
  const relatedContent = getMixedRelatedContent({
    currentType,
    currentSlug,
    keywords,
    limit: 8,
  })

  if (relatedContent.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'converter':
        return <FileCode className="h-5 w-5" />
      case 'gallery':
        return <Image className="h-5 w-5" aria-label="Gallery icon" />
      case 'learn':
        return <BookOpen className="h-5 w-5" />
      case 'tool':
        return <Wrench className="h-5 w-5" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'converter':
        return 'Converter'
      case 'gallery':
        return 'Gallery'
      case 'learn':
        return 'Guide'
      case 'tool':
        return 'Tool'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'converter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'gallery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'learn':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'tool':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return ''
    }
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedContent.map((item, index) => (
            <Link key={index} href={item.url} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] group-hover:border-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getIcon(item.type)}
                      <Badge variant="secondary" className={getTypeColor(item.type)}>
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                  {item.searchVolume && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Popular resource
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SEO-friendly internal linking section */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Explore More SVG Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Popular Converters</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/convert/png-to-svg" className="text-muted-foreground hover:text-primary">
                    PNG to SVG Converter
                  </Link>
                </li>
                <li>
                  <Link href="/convert/svg-to-png" className="text-muted-foreground hover:text-primary">
                    SVG to PNG Converter
                  </Link>
                </li>
                <li>
                  <Link href="/convert/jpg-to-svg" className="text-muted-foreground hover:text-primary">
                    JPG to SVG Converter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Free Tools</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/tools/svg-editor" className="text-muted-foreground hover:text-primary">
                    SVG Editor Online
                  </Link>
                </li>
                <li>
                  <Link href="/tools/svg-optimizer" className="text-muted-foreground hover:text-primary">
                    SVG Optimizer
                  </Link>
                </li>
                <li>
                  <Link href="/animate" className="text-muted-foreground hover:text-primary">
                    SVG Animation Tool
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}