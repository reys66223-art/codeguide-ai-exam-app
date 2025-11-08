export function StudentRegistrationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>

        {/* Student List Skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-28 bg-muted animate-pulse rounded" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="text-left p-2">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="p-2">
                      <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Import Skeleton */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-80 bg-muted animate-pulse rounded" />
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-72 bg-muted animate-pulse rounded" />
              <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 mx-auto bg-muted animate-pulse rounded" />
                <div className="h-3 w-64 mx-auto mt-2 bg-muted animate-pulse rounded" />
                <div className="h-10 w-32 mx-auto mt-4 bg-muted animate-pulse rounded" />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-3 w-80 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}