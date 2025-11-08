export function ExamListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Card Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-[150px] bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1">
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </div>

        {/* Grid View Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                <div className="flex space-x-2">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 w-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-9 w-full bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}