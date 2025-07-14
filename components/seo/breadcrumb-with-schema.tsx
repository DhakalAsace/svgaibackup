'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { generateBreadcrumbSchema } from '@/lib/seo/dynamic-metadata'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbItemType {
  name: string
  url?: string
}

interface BreadcrumbWithSchemaProps {
  items: BreadcrumbItemType[]
  className?: string
}

export function BreadcrumbWithSchema({ items, className }: BreadcrumbWithSchemaProps) {
  // Generate schema data
  const schemaItems = [
    { name: 'Home', url: 'https://svgai.org' },
    ...items.map((item) => ({
      name: item.name,
      url: item.url || '#',
    })),
  ]
  
  const schema = generateBreadcrumbSchema(schemaItems)

  return (
    <>
      {/* Inject schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Visual breadcrumb */}
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1 hover:text-primary">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                
                <BreadcrumbItem>
                  {isLast || !item.url ? (
                    <BreadcrumbPage className="font-medium">
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.url} className="hover:text-primary">
                        {item.name}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}