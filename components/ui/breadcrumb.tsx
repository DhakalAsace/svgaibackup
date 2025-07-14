import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal, Home } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

// Converter-specific types and components
export interface ConverterBreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface ConverterBreadcrumbProps {
  items: ConverterBreadcrumbItem[]
  className?: string
}

// Converter breadcrumb component with schema markup
export function ConverterBreadcrumb({ items, className }: ConverterBreadcrumbProps) {
  // Generate schema.org BreadcrumbList structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://svgai.org${item.href}` })
    }))
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      {/* Breadcrumb navigation */}
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbPage className="flex items-center">
                    {index === 0 && <Home className="h-4 w-4 mr-1" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || "#"} className="flex items-center hover:text-[#FF7043]">
                      {index === 0 && <Home className="h-4 w-4 mr-1" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}

// Helper function to generate breadcrumbs for converter pages
export function getConverterBreadcrumbs(
  fromFormat: string,
  toFormat: string,
  converterTitle: string
): ConverterBreadcrumbItem[] {
  const category = getConverterCategory(fromFormat, toFormat)
  
  return [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Tools", 
      href: "/convert"
    },
    {
      label: category.name,
      href: category.href
    },
    {
      label: converterTitle,
      current: true
    }
  ]
}

// Category mapping for converters
export function getConverterCategory(fromFormat: string, toFormat: string) {
  const format = fromFormat.toLowerCase()
  const toFmt = toFormat.toLowerCase()
  
  // Image formats
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'heic', 'avif', 'ico', 'image'].includes(format) ||
      ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'heic', 'avif', 'ico', 'image'].includes(toFmt)) {
    return {
      name: "Image Converters",
      href: "/convert?category=image"
    }
  }
  
  // Vector formats (prioritize SVG)
  if (format === 'svg' || toFmt === 'svg' || ['eps', 'ai'].includes(format) || ['eps', 'ai'].includes(toFmt)) {
    return {
      name: "Vector Converters", 
      href: "/convert?category=vector"
    }
  }
  
  // CAD formats
  if (['dxf', 'stl'].includes(format) || ['dxf', 'stl'].includes(toFmt)) {
    return {
      name: "CAD Converters",
      href: "/convert?category=cad"
    }
  }
  
  // Document formats
  if (['pdf'].includes(format) || ['pdf'].includes(toFmt)) {
    return {
      name: "Document Converters",
      href: "/convert?category=document"
    }
  }
  
  // Web formats
  if (['html'].includes(format) || ['html'].includes(toFmt)) {
    return {
      name: "Web Converters",
      href: "/convert?category=web"
    }
  }
  
  // Font formats
  if (['ttf'].includes(format) || ['ttf'].includes(toFmt)) {
    return {
      name: "Font Converters",
      href: "/convert?category=font"
    }
  }
  
  // Windows formats
  if (['emf', 'wmf'].includes(format) || ['emf', 'wmf'].includes(toFmt)) {
    return {
      name: "Windows Formats",
      href: "/convert?category=windows"
    }
  }
  
  // Video formats (premium tools)
  if (['mp4'].includes(toFmt) && format === 'svg') {
    return {
      name: "Video Converters",
      href: "/convert?category=video"
    }
  }
  
  // Universal converters
  if (['multiple', 'svg converter'].includes(format.toLowerCase())) {
    return {
      name: "Universal Converters",
      href: "/convert?category=universal"
    }
  }
  
  // Default fallback
  return {
    name: "File Converters",
    href: "/convert"
  }
}
