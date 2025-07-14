import { StatsSkeleton, TableSkeleton } from "@/components/ui/loading"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Stats */}
      <StatsSkeleton count={4} />
      
      {/* Recent Activity */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  )
}