export default function WishCard({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-surface-container-lowest/60 backdrop-blur-lg rounded-[24px] p-8 border border-white/40 shadow-[0_15px_35px_rgba(113,88,91,0.04)]',
    featured: 'col-span-1 md:col-span-2 lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-[32px] p-10 border border-white/60 shadow-[0_20px_40px_rgba(113,88,91,0.08)] relative overflow-hidden',
    image: 'col-span-1 md:col-span-2 bg-white/50 backdrop-blur-xl rounded-[24px] p-4 border border-white/50 shadow-[0_20px_40px_rgba(113,88,91,0.06)]',
    tinted: 'bg-primary-container/20 backdrop-blur-lg rounded-[24px] p-8 border border-white/40 shadow-[0_15px_35px_rgba(113,88,91,0.04)]',
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </div>
  );
}
