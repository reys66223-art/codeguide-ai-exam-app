export function CreateExamFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Code Skeleton */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        <div className="flex items-center space-x-4">
          <div className="font-mono text-2xl bg-muted px-4 py-2 rounded w-32 h-10 animate-pulse" />
        </div>
      </div>

      {/* Basic Information Skeleton */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-80 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-56 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-24 w-full bg-muted animate-pulse rounded" />
          <div className="h-3 w-64 bg-muted animate-pulse rounded" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-72 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-20 w-full bg-muted animate-pulse rounded" />
            <div className="h-20 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Advanced Settings Skeleton */}
        <div className="space-y-4 pt-4 border-t">
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
          <div className="rounded-lg border bg-muted p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-44 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-between pt-6 border-t">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="flex space-x-2">
            <div className="h-10 w-20 bg-muted animate-pulse rounded" />
            <div className="h-10 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}