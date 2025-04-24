'use client'

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Link from 'next/link'
import Image from 'next/image'
import { BlogHeaderImage } from '@/components/client-wrappers'
import { cn } from '@/lib/utils'

// Client component for MDX image rendering with format detection
export function MdxImage({ src, alt }: { src?: string, alt?: string }) {
  if (!src) return null;
  
  // Detect if this is an SVG image
  const isSvg = src.toLowerCase().endsWith('.svg');
  
  return (
    <div className="my-8">
      {isSvg ? (
        <BlogHeaderImage
          src={src}
          alt={alt || ''}
          className="rounded-lg"
        />
      ) : (
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg"
        />
      )}
    </div>
  );
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("mt-10 scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("mt-8 scroll-m-20 text-3xl font-semibold tracking-tight", className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("mt-6 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-gray-900",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-gray-100 p-4 dark:bg-gray-900",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={cn("font-medium underline underline-offset-4", className)} {...props} />
      )
    }
    return (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    )
  }
}

export function MDXComponents({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
