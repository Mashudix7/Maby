import { Link } from 'react-router-dom';

export default function MomentCard({ id, image, date, title, alt = '' }) {
  return (
    <Link
      to={`/momen/${id || '1'}`}
      className="min-w-[280px] sm:min-w-[320px] glass-panel rounded-[2rem] p-4 flex flex-col gap-4 shrink-0 group block"
    >
      <div className="relative h-[200px] rounded-xl overflow-hidden">
        <img
          alt={alt || title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={image}
        />
      </div>
      <div className="px-2 pb-2">
        <span className="font-sans text-xs font-semibold tracking-wide text-outline mb-1 block">
          {date}
        </span>
        <h4 className="font-serif italic text-lg text-on-surface">{title}</h4>
      </div>
    </Link>
  );
}
