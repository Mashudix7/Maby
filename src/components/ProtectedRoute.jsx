import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, coupleId, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1a1517]">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-rose-400 animate-pulse">favorite</span>
          <p className="mt-4 font-serif italic text-on-surface-variant dark:text-zinc-400">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!coupleId) {
    return <Navigate to="/couple-setup" replace />;
  }

  return children;
}
