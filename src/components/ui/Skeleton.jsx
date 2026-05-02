/**
 * Reusable Skeleton loading component with pulse animation.
 * Provides consistent loading states across the app to prevent layout shift.
 */
export function Skeleton({ className = '', variant = 'text' }) {
  const baseClasses = 'animate-pulse bg-zinc-200/60 dark:bg-zinc-700/40 rounded-lg';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'rounded-full',
    image: 'aspect-[4/3] w-full rounded-xl',
    card: 'h-40 w-full rounded-2xl',
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || ''} ${className}`} />
  );
}

/**
 * Skeleton for a WishCard
 */
export function WishCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-5/6" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex items-center gap-2 mt-4">
        <Skeleton variant="circle" className="w-8 h-8" />
        <Skeleton variant="text" className="w-20 h-3" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a MomentCard in the grid
 */
export function MomentGridSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col gap-4">
      <Skeleton variant="image" />
      <Skeleton variant="text" className="w-24 h-3" />
      <Skeleton variant="title" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  );
}

export default Skeleton;
