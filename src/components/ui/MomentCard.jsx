import { Link } from 'react-router-dom';

export function MomentCardSkeleton() {
  return (
    <div className="w-[240px] md:w-[320px] bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-3 md:p-4 flex flex-col gap-3 shrink-0 border border-white/40 dark:border-white/5">
      <div className="relative h-[200px] rounded-xl overflow-hidden skeleton" />
      <div className="px-1 pb-1">
        <div className="h-3 w-20 skeleton rounded mb-2" />
        <div className="h-5 w-full skeleton rounded" />
      </div>
    </div>
  );
}

export default function MomentCard({ id, image, date, title, alt = '' }) {
  return (
    <Link
      to={`/momen/${id || '1'}`}
      className="w-[240px] md:w-[320px] bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-3 md:p-4 flex flex-col gap-3 shrink-0 group block border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="relative h-[200px] rounded-xl overflow-hidden">
        <img
          alt={alt || title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={image}
          loading="lazy"
          fetchpriority="low"
        />
      </div>
      <div className="px-1 pb-1">
        <span className="font-sans text-xs font-semibold tracking-wide text-outline dark:text-zinc-400 mb-1 block">
          {date}
        </span>
        <h4 className="font-serif italic text-base md:text-lg text-on-surface dark:text-[#ede0df] line-clamp-1">{title}</h4>
      </div>
    </Link>
  );
}
