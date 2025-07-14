# Loading States Implementation Guide

## Overview

This guide explains how to use the comprehensive loading states system implemented in the SVG AI application to prevent layout shift and improve perceived performance.

## Core Components

### 1. Loading Component Library (`/components/ui/loading/index.tsx`)

The loading library provides various skeleton and loading components:

- **Spinner**: Animated loading spinner with size variants
- **LoadingOverlay**: Full-screen or container overlay with spinner
- **ProgressBar**: Visual progress indicator
- **Shimmer**: Shimmer effect for skeleton screens
- **Skeletons**: Pre-built skeletons for common UI patterns

### 2. Error Boundaries (`/components/ui/error-boundary.tsx`)

Error boundaries catch JavaScript errors and display fallback UI:

```tsx
import { ErrorBoundary, DefaultErrorFallback } from "@/components/ui/error-boundary"

<ErrorBoundary fallback={DefaultErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

### 3. Route Loading (`/components/route-loading.tsx`)

Automatic progress bar for route transitions, included in the main layout.

## Usage Examples

### Converter Pages

```tsx
import { ConverterWithLoading } from "@/components/converters/converter-with-loading"
import YourConverter from "./your-converter"

export default function ConverterPage() {
  return (
    <ConverterWithLoading>
      <YourConverter />
    </ConverterWithLoading>
  )
}
```

### Gallery Pages

```tsx
import { GalleryWithLoading } from "@/components/gallery/gallery-with-loading"
import YourGallery from "./your-gallery"

export default function GalleryPage() {
  return (
    <GalleryWithLoading itemCount={20}>
      <YourGallery />
    </GalleryWithLoading>
  )
}
```

### Blog/Learn Pages

```tsx
import { BlogWithLoading } from "@/components/blog/blog-with-loading"

export default function BlogPost() {
  return (
    <BlogWithLoading variant="post">
      <YourBlogContent />
    </BlogWithLoading>
  )
}
```

### Images with Loading States

```tsx
import { LoadingImage } from "@/components/ui/loading-image"

<LoadingImage
  src="/your-image.jpg"
  alt="Description"
  width={600}
  height={400}
  aspectRatio="video"
/>
```

### Forms with Optimistic Updates

```tsx
import { OptimisticForm } from "@/components/ui/optimistic-form"

<OptimisticForm
  onSubmit={async (data) => {
    // Handle submission
  }}
  optimisticUpdate={() => {
    // Update UI immediately
  }}
  loadingMessage="Saving changes..."
>
  {/* Form fields */}
</OptimisticForm>
```

### Lazy Loading Heavy Components

```tsx
import { LazyLoad } from "@/components/ui/lazy-load"
import { Skeleton } from "@/components/ui/skeleton"

<LazyLoad
  fallback={<Skeleton className="h-96" />}
  rootMargin="200px"
>
  <HeavyComponent />
</LazyLoad>
```

### Using Loading Context

```tsx
import { useLoading } from "@/components/providers/loading-provider"

function YourComponent() {
  const { showLoading, hideLoading } = useLoading()
  
  const handleAction = async () => {
    showLoading("Processing...")
    try {
      await someAsyncOperation()
    } finally {
      hideLoading()
    }
  }
}
```

## Next.js App Router Loading States

Create `loading.tsx` files in your app directories:

```tsx
// app/your-route/loading.tsx
import { YourCustomSkeleton } from "@/components/ui/loading"

export default function Loading() {
  return <YourCustomSkeleton />
}
```

## Performance Best Practices

1. **Match Skeleton to Content**: Ensure loading skeletons match the dimensions of actual content to prevent layout shift

2. **Use Suspense Boundaries**: Wrap async components with Suspense for granular loading states

3. **Implement Progressive Enhancement**: Load critical content first, then enhance with additional features

4. **Preload Critical Resources**: Use the preload utilities for fonts, images, and scripts

5. **Cache with Service Worker**: Leverage the service worker for offline support and faster loads

## Measuring Impact

Monitor Core Web Vitals to measure the impact:

- **LCP (Largest Contentful Paint)**: Should improve with proper loading states
- **CLS (Cumulative Layout Shift)**: Should be near zero with skeleton screens
- **FID (First Input Delay)**: Should remain low with optimistic updates

## Customization

Create custom skeletons for specific components:

```tsx
export function CustomSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  )
}
```

## Troubleshooting

1. **Hydration Errors**: Use dynamic imports with `ssr: false` for client-only components
2. **Flash of Loading State**: Adjust `rootMargin` and `threshold` for lazy loading
3. **Service Worker Issues**: Clear cache and re-register if updates aren't appearing

## Future Enhancements

- Implement view transitions API when available
- Add skeleton screen generator based on component structure
- Create loading state analytics to optimize thresholds