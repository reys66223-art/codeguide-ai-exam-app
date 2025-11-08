export function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Exam Selector */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-1">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-28 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              <div className="h-3 w-28 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-2 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-80 bg-muted animate-pulse rounded" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {[...Array(8)].map((_, i) => (
                      <th key={i} className="text-left p-2">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                        <div className="h-1 w-full bg-muted animate-pulse rounded mt-1" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                        <div className="h-1 w-full bg-muted animate-pulse rounded mt-1" />
                      </td>
                      <td className="p-2">
                        <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="p-2">
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="p-2">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Feedback Analysis */}
        <div className="bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-80 bg-muted animate-pulse rounded" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-2 w-full bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-3">
                  <div className="h-20 w-full bg-muted animate-pulse rounded" />
                  <div className="h-20 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mx-auto mb-2" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}