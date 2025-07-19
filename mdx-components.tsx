import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { MdxP } from '@/components/mdx-custom-components';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// Export the components directly for server components
export const mdxComponentsMap: MDXComponents = {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-4 mb-2">{children}</h4>,
    p: MdxP,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http')
      if (isExternal) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
      }
      return <Link href={href || '/'} className="text-primary hover:underline">{children}</Link>
    },
    img: ({ src, alt }) => {
      // Use dynamic import to avoid server component directly using client component
      const MdxImage = dynamic(() => import('@/components/mdx/mdx-provider').then(mod => mod.MdxImage))
      return <MdxImage src={src} alt={alt} />
    },
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
        {children}
      </td>
    ),
    ul: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
    li: ({ children }) => <li className="mt-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded-md text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto my-6 shadow-lg border border-slate-700" {...props}>
        <code className="text-white bg-transparent p-0 rounded-none text-sm font-mono block">
          {children}
        </code>
      </pre>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-primary">
        {children}
      </strong>
    ),
  }

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponentsMap,
    ...components,
  }
}
