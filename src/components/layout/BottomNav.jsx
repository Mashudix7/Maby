import { Link } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Beranda', icon: 'home' },
  { to: '/momen', label: 'Momen', icon: 'auto_awesome_motion' },
  { to: '/harapan', label: 'Harapan', icon: 'favorite' },
  { to: '/fakta', label: 'Profil', icon: 'person' },
];

export default function BottomNav({ activePage = '/' }) {
  return (
    <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-50 glass-panel backdrop-blur-xl bg-white/70 dark:bg-[#1a1517]/70 w-[calc(100%-2rem)] max-w-sm rounded-2xl px-2 py-2 shadow-[0_20px_40px_rgba(248,215,218,0.2)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = activePage === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-rose-600 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-900/30'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-rose-400 active:scale-95'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className={`font-serif text-[10px] italic mt-0.5 ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
