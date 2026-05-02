import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function MainLayout({ children, activePage, className = '' }) {
  const location = useLocation();
  // Auto-detect active page from URL, with fallback to prop
  const currentPage = activePage || '/' + (location.pathname.split('/')[1] || '');

  return (
    <div className="min-h-screen bg-background dark:bg-[#1a1517] text-on-background dark:text-[#ede0df] transition-colors duration-300">
      <Navbar activePage={currentPage} />
      <main className={`pt-28 md:pt-36 pb-28 md:pb-20 px-4 md:px-6 ${className}`}>
        {children}
      </main>
      <BottomNav activePage={currentPage} />
    </div>
  );
}
