export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-3">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}
