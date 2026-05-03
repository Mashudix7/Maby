export default function WishCard({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-surface-container-lowest/80 dark:bg-white/5 rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-sm translate-z-0',
    featured: 'col-span-1 md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-white/10 rounded-[32px] p-8 md:p-10 border border-white/60 dark:border-white/10 shadow-md relative overflow-hidden translate-z-0',
    image: 'col-span-1 md:col-span-2 bg-white/70 dark:bg-white/5 rounded-[24px] p-4 border border-white/50 dark:border-white/10 shadow-sm translate-z-0',
    tinted: 'bg-primary-container/30 dark:bg-primary-container/10 rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-sm translate-z-0',
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </div>
  );
}
