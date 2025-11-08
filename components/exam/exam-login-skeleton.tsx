export function ExamLoginSkeleton() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-32 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-40 bg-muted animate-pulse rounded" />
          </div>

          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="h-3 w-32 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-3 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}