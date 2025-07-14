"use client"

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface RelatedTool {
  title: string
  description: string
  href: string
}

interface RelatedConvertersProps {
  relatedTools: RelatedTool[]
}

export default function RelatedConverters({ relatedTools }: RelatedConvertersProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Related Converters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {relatedTools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer min-h-[120px]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    {tool.title}
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}