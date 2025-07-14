// Preload critical resources to improve perceived performance
export function preloadResources() {
  // Define link type
  interface PreloadLink {
    href: string
    as: string
    type?: string
  }
  
  // Preload fonts
  const fontLinks: PreloadLink[] = [
    {
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",
      as: "style"
    }
  ]
  
  // Preload critical images
  const imageLinks: PreloadLink[] = [
    {
      href: "/favicon.svg",
      as: "image",
      type: "image/svg+xml"
    },
    {
      href: "/placeholder-image.svg",
      as: "image",
      type: "image/svg+xml"
    }
  ]
  
  // Preload critical scripts
  const scriptLinks: PreloadLink[] = [
    {
      href: "/_next/static/chunks/webpack.js",
      as: "script"
    }
  ]
  
  // Create link elements
  const allLinks: PreloadLink[] = [...fontLinks, ...imageLinks, ...scriptLinks]
  allLinks.forEach((linkData) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = linkData.href
    link.as = linkData.as
    if (linkData.type) {
      link.type = linkData.type
    }
    document.head.appendChild(link)
  })
}

// Prefetch routes for faster navigation
export function prefetchRoutes(routes: string[]) {
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    routes.forEach(route => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = route
      document.head.appendChild(link)
    })
  }
}

// Lazy load non-critical CSS
export function lazyLoadCSS(href: string) {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.media = "print"
  link.onload = function() {
    (this as HTMLLinkElement).media = "all"
  }
  document.head.appendChild(link)
}