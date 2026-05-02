import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = memo(function Navbar({ activePage = '/' }) {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: 'home' },
    { to: '/momen', label: t('nav.moments'), icon: 'auto_awesome_motion' },
    { to: '/harapan', label: t('nav.wishes'), icon: 'favorite' },
    { to: '/fakta', label: t('nav.profile'), icon: 'person' },
  ];

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-lg" style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
      <div className="glass-panel backdrop-blur-xl bg-white/70 dark:bg-[#1a1517]/70 rounded-2xl border border-white/30 dark:border-white/10 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-xl md:text-2xl font-serif italic text-rose-400 dark:text-rose-300 hover:text-rose-500 transition-colors shrink-0">
          <img src="/logo.jpg" alt="Maby Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm border border-white/50 dark:border-white/10" />
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
          <Link
            to="/photobooth"
            className="flex items-center gap-2 bg-gradient-to-r from-[#800000] to-[#4a0000] text-white px-4 py-2 rounded-full font-bold shadow-[0_4px_14px_rgba(128,0,0,0.39)] hover:scale-105 active:scale-95 transition-all not-italic"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            Photobooth
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-rose-400 dark:text-rose-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-300 shrink-0 font-sans font-bold text-[10px] md:text-xs"
            aria-label="Toggle language"
          >
            {language === 'id' ? 'ID' : 'EN'}
          </button>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-rose-400 dark:text-rose-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-300 shrink-0"
            aria-label="Toggle tema"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-rose-400 dark:text-rose-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-300 shrink-0"
            aria-label={t('common.logout')}
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
