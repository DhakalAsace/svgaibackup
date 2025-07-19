import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { FileImage, Code2, Palette, Zap, FileText, Code, Layers, Package, Terminal, ArrowRight, Video } from 'lucide-react'
import Link from 'next/link'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import React from 'react'

// Custom components for standard HTML elements
const Pre = ({ children, ...props }: any) => {
  return React.createElement('pre', {
    className: "overflow-x-auto p-4 bg-gray-900 text-gray-100 rounded-lg my-6",
    ...props
  }, children)
}

const InlineCode = ({ children, ...props }: any) => {
  return React.createElement('code', {
    className: "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono",
    ...props
  }, children)
}

// Define MDX components
const mdxComponents = {
  // Icons that might be used
  FileImage,
  Code2,
  Palette,
  Zap,
  FileText,
  Code,
  Layers,
  Package,
  Terminal,
  ArrowRight,
  Video,
  
  // UI Components
  Alert,
  Button,
  Link,
  
  // Override default HTML elements
  pre: Pre,
  code: InlineCode,
}

export async function compileMDXContent(content: string) {
  const { content: compiledContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ['subheading-anchor'],
                ariaLabel: 'Link to section',
              },
            },
          ],
        ],
      },
    },
  })

  return compiledContent
}