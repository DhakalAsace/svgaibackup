import { CardSkeleton } from "@/components/ui/loading"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} hasImage />
        ))}
      </div>
    </div>
  )
}