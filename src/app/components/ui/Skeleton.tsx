export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-800 ${className}`}
    />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  )
}
