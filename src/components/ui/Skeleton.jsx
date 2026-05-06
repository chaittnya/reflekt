import { cn } from '../../utils/cn';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gray-200 dark:bg-white/10',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}
