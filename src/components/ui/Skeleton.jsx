export function Skeleton({ className = '', variant = 'rect' }) {
  const baseClasses = "skeleton animate-pulse bg-zinc-200 dark:bg-white/5";
  const variantClasses = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1140px] mx-auto flex flex-col gap-12 md:gap-20 animate-pulse">
      <div className="flex flex-col items-center text-center mt-[-0.5rem] px-4">
        <Skeleton className="w-32 h-4 mb-6" />
        <Skeleton className="w-64 h-12 mb-4" />
        <Skeleton className="w-48 h-6 mb-6" />
        <Skeleton className="w-full max-w-lg h-32" />
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <Skeleton className="md:col-span-8 h-[400px]" />
        <div className="md:col-span-4 flex flex-col gap-8">
          <Skeleton className="h-22" />
          <Skeleton className="h-22" />
          <Skeleton className="h-64" />
        </div>
      </section>
    </div>
  );
}

export function MomentGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  );
}

export function WishCardSkeleton() {
  return (
    <div className="p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-2" />
        </div>
      </div>
      <Skeleton className="w-full h-16" />
    </div>
  );
}
