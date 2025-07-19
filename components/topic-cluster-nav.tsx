"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Layers,
  FileImage,
  Palette,
  Printer,
  Globe,
  Smartphone
} from 'lucide-react'
import { topicClustersEnhanced, getTopicClusterConverters } from '@/lib/internal-linking'
import { cn } from '@/lib/utils'

interface TopicClusterNavProps {
  currentCluster?: string
  variant?: 'default' | 'compact' | 'sidebar'
  className?: string
}

const clusterIcons = {
  'vector-conversion': FileImage,
  'raster-conversion': FileImage,
  'professional-formats': Printer,
  'animation-cluster': Palette,
  'web-optimization': Globe,
  'print-ready': Printer,
  'social-media': Smartphone,
  'design-workflow': Palette,
  'mobile-first': Smartphone
}

export function TopicClusterNav({ 
  currentCluster,
  variant = 'default',
  className
}: TopicClusterNavProps) {
  const clusters = Object.entries(topicClustersEnhanced)
    .filter(([_, cluster]) => 'hubUrl' in cluster && cluster.hubUrl)
    .map(([key, cluster]) => {
      const fullCluster = cluster as typeof topicClustersEnhanced['vector-conversion']
      return {
        id: key,
        ...fullCluster,
        converters: getTopicClusterConverters(key as any).slice(0, 6),
        Icon: clusterIcons[key as keyof typeof clusterIcons] || Layers
      }
    })

  if (variant === 'sidebar') {
    return (
      <Card className={cn("sticky top-24", className)}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Converter Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            {clusters.map((cluster) => {
              const Icon = cluster.Icon
              const isActive = currentCluster === cluster.id
              
              return (
                <Link
                  key={cluster.id}
                  href={cluster.hubUrl}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{cluster.name}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {cluster.converters.length} tools
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )
            })}
          </nav>
          
          <div className="mt-6 pt-6 border-t">
            <Link href="/convert">
              <Button variant="outline" className="w-full">
                View All Converters
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {clusters.map((cluster) => {
          const Icon = cluster.Icon
          const isActive = currentCluster === cluster.id
          
          return (
            <Link
              key={cluster.id}
              href={cluster.hubUrl}
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {cluster.name}
            </Link>
          )
        })}
      </div>
    )
  }

  // Default variant - full grid
  return (
    <div className={cn("space-y-8", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
        <p className="text-muted-foreground">
          Find the perfect converter for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => {
          const Icon = cluster.Icon
          const isActive = currentCluster === cluster.id
          
          return (
            <Card 
              key={cluster.id}
              className={cn(
                "hover:shadow-lg transition-all",
                isActive && "ring-2 ring-primary"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Icon className="w-5 h-5 mr-2 text-primary" />
                  {cluster.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {cluster.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {cluster.converters.slice(0, 3).map((converter) => (
                    <Link
                      key={converter.id}
                      href={`/convert/${converter.urlSlug}`}
                      className="block text-sm hover:text-primary transition-colors"
                    >
                      • {converter.fromFormat} to {converter.toFormat}
                    </Link>
                  ))}
                  {cluster.converters.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{cluster.converters.length - 3} more tools
                    </p>
                  )}
                </div>

                <Link 
                  href={cluster.hubUrl}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                >
                  View all {cluster.name.toLowerCase()}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Related Clusters */}
      {currentCluster && topicClustersEnhanced[currentCluster as keyof typeof topicClustersEnhanced] && 
       'relatedClusters' in topicClustersEnhanced[currentCluster as keyof typeof topicClustersEnhanced] && (
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Related Categories</h3>
          <div className="flex flex-wrap gap-3">
            {(topicClustersEnhanced[currentCluster as keyof typeof topicClustersEnhanced] as any).relatedClusters?.map((relatedId: string) => {
              const related = topicClustersEnhanced[relatedId as keyof typeof topicClustersEnhanced]
              if (!related || !('hubUrl' in related) || !related.hubUrl) return null
              
              const RelatedIcon = clusterIcons[relatedId as keyof typeof clusterIcons] || Layers
              
              return (
                <Link
                  key={relatedId}
                  href={(related as any).hubUrl}
                  className="inline-flex items-center px-4 py-2 bg-background rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <RelatedIcon className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">{(related as any).name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Breadcrumb navigation for topic cluster pages
export function TopicClusterBreadcrumb({ 
  clusterId,
  className 
}: { 
  clusterId: string
  className?: string 
}) {
  const cluster = topicClustersEnhanced[clusterId as keyof typeof topicClustersEnhanced]
  if (!cluster) return null

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      <Link href="/" className="text-muted-foreground hover:text-primary">
        Home
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link href="/convert" className="text-muted-foreground hover:text-primary">
        Converters
      </Link>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium">{(cluster as any).name}</span>
    </nav>
  )
}