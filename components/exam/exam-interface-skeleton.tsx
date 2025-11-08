export function ExamInterfaceSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-2 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 space-y-6">
              <div className="space-y-4">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-8 w-8 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>

              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Question Card Skeleton */}
              <div className="bg-white rounded-lg border p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                    ))}
                  </div>

                  {/* Multiple Choice Options Skeleton */}
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-10 w-20 bg-muted animate-pulse rounded" />
                <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}