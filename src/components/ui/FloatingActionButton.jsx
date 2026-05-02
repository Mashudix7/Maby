import { Link } from 'react-router-dom';

export default function FloatingActionButton({ to = '/momen/baru', icon = 'add', label = 'Tambah Momen' }) {
  return (
    <Link
      to={to}
      className="fixed bottom-28 md:bottom-12 right-6 md:right-12 glass-panel bg-primary text-on-primary rounded-full flex items-center justify-center gap-2 px-6 py-4 shadow-[0_10px_30px_rgba(113,88,91,0.3)] hover:scale-105 hover:bg-surface-tint transition-all duration-300 z-40 group"
    >
      <span className="material-symbols-outlined transition-transform group-hover:rotate-90 duration-300">
        {icon}
      </span>
      <span className="font-sans text-xs font-semibold tracking-wide">{label}</span>
    </Link>
  );
}
