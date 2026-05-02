import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';


const navItems = [
  { to: '/', label: 'Beranda', icon: 'home' },
  { to: '/momen', label: 'Momen', icon: 'auto_awesome_motion' },
  { to: '/peta', label: 'Peta', icon: 'explore' },
  { to: '/harapan', label: 'Harapan', icon: 'favorite' },
  { to: '/fakta', label: 'Profil', icon: 'person' },
];

export default function Navbar({ activePage = '/' }) {
  const { isDark, toggleTheme } = useTheme();


  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-lg">
      <div className="glass-panel rounded-2xl border border-white/30 dark:border-white/10 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-xl md:text-2xl font-serif italic text-rose-400 dark:text-rose-300 hover:text-rose-500 transition-colors shrink-0">
          Maby
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center font-serif italic text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`transition-colors duration-300 ${
                activePage === item.to
                  ? 'text-rose-600 dark:text-rose-300 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-rose-400 dark:text-rose-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-300 shrink-0"
            aria-label="Toggle tema"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}
