import { GalleryGridSkeleton } from "@/components/ui/loading"
import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryThemeLoading() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <section className="border-b bg-background/95 backdrop-blur">
        <div className="container px-4 py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <GalleryGridSkeleton count={20} />
        </div>
      </section>
    </div>
  )
}