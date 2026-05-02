export default function WishCard({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-surface-container-lowest/60 dark:bg-white/5 backdrop-blur-lg rounded-[24px] p-8 border border-white/40 dark:border-white/10 shadow-[0_15px_35px_rgba(113,88,91,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]',
    featured: 'col-span-1 md:col-span-2 lg:col-span-2 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-[32px] p-10 border border-white/60 dark:border-white/10 shadow-[0_20px_40px_rgba(113,88,91,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden',
    image: 'col-span-1 md:col-span-2 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[24px] p-4 border border-white/50 dark:border-white/10 shadow-[0_20px_40px_rgba(113,88,91,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)]',
    tinted: 'bg-primary-container/20 dark:bg-primary-container/10 backdrop-blur-lg rounded-[24px] p-8 border border-white/40 dark:border-white/10 shadow-[0_15px_35px_rgba(113,88,91,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]',
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </div>
  );
}
