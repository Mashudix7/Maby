import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import OfflineBanner from '../ui/OfflineBanner';

export default function MainLayout({ children, activePage, className = '', fab }) {
  const location = useLocation();
  // Memoize active page to prevent unnecessary re-renders of Navbar/BottomNav
  const currentPage = useMemo(
    () => activePage || '/' + (location.pathname.split('/')[1] || ''),
    [activePage, location.pathname]
  );

  return (
    <div className="min-h-screen bg-background dark:bg-[#1a1517] text-on-background dark:text-[#ede0df] transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background orbs - Optimized for performance */}
      <div className="fixed w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 dark:bg-rose-500/5 rounded-full blur-[40px] md:blur-[60px] top-[-10%] left-[-10%] pointer-events-none z-0 gpu-accel opacity-50" />
      <div className="fixed w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-secondary-container/20 dark:bg-purple-500/5 rounded-full blur-[40px] md:blur-[60px] bottom-[10%] right-[-5%] pointer-events-none z-0 gpu-accel opacity-50" />

      <OfflineBanner />
      <Navbar activePage={currentPage} />
      <main className={`pt-28 md:pt-36 pb-28 md:pb-20 px-4 md:px-6 relative z-10 page-transition ${className}`} style={{ paddingTop: 'calc(7rem + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(7rem + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>
      {fab}
      <BottomNav activePage={currentPage} />
    </div>
  );
}
