import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FactsAboutUs = lazy(() => import('./pages/FactsAboutUs'));
const StolenMoments = lazy(() => import('./pages/StolenMoments'));
const MomentDetail = lazy(() => import('./pages/MomentDetail'));
const AddMoment = lazy(() => import('./pages/AddMoment'));
const WishesAffirmations = lazy(() => import('./pages/WishesAffirmations'));
const DateIdeas = lazy(() => import('./pages/DateIdeas'));
const RelationshipJourney = lazy(() => import('./pages/RelationshipJourney'));
const PrivateNotes = lazy(() => import('./pages/PrivateNotes'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

function RouteChangeListener() {
  const location = useLocation();
  useEffect(() => {
    nprogress.start();
    const timer = setTimeout(() => nprogress.done(), 300);
    return () => clearTimeout(timer);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
        <BrowserRouter>
          <RouteChangeListener />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />


              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/fakta" element={<ProtectedRoute><FactsAboutUs /></ProtectedRoute>} />
              <Route path="/momen" element={<ProtectedRoute><StolenMoments /></ProtectedRoute>} />
              <Route path="/momen/baru" element={<ProtectedRoute><AddMoment /></ProtectedRoute>} />
              <Route path="/momen/:id" element={<ProtectedRoute><MomentDetail /></ProtectedRoute>} />
              <Route path="/harapan" element={<ProtectedRoute><WishesAffirmations /></ProtectedRoute>} />
              <Route path="/ide-kencan" element={<ProtectedRoute><DateIdeas /></ProtectedRoute>} />
              <Route path="/perjalanan" element={<ProtectedRoute><RelationshipJourney /></ProtectedRoute>} />
              <Route path="/rahasia" element={<ProtectedRoute><PrivateNotes /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </LanguageProvider>
);
}
