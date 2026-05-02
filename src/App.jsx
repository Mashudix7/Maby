import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import FactsAboutUs from './pages/FactsAboutUs';
import StolenMoments from './pages/StolenMoments';
import MomentDetail from './pages/MomentDetail';
import AddMoment from './pages/AddMoment';
import WishesAffirmations from './pages/WishesAffirmations';
import InteractiveMap from './pages/InteractiveMap';
import DateIdeas from './pages/DateIdeas';
import RelationshipJourney from './pages/RelationshipJourney';

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
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <RouteChangeListener />
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
            <Route path="/peta" element={<ProtectedRoute><InteractiveMap /></ProtectedRoute>} />
            <Route path="/ide-kencan" element={<ProtectedRoute><DateIdeas /></ProtectedRoute>} />
            <Route path="/perjalanan" element={<ProtectedRoute><RelationshipJourney /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
