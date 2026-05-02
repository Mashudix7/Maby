import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, coupleId, signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (user && coupleId) return <Navigate to="/" replace />;
  if (user && !coupleId) return <Navigate to="/couple-setup" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName || email.split('@')[0]);
        setSuccess('Akun berhasil dibuat! Silakan cek email untuk verifikasi, atau langsung login.');
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1a1517] px-4 transition-colors duration-300">
      {/* Ambient orbs */}
      <div className="fixed w-64 h-64 bg-primary-container rounded-full blur-[80px] opacity-30 top-20 left-10 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-secondary-container rounded-full blur-[80px] opacity-30 bottom-40 right-20 pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic text-rose-400 dark:text-rose-300 mb-2">Maby</h1>
          <p className="text-on-surface-variant dark:text-zinc-400 font-serif italic">
            Ruang digital untuk kenangan indah bersama 💕
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-6 text-center">
            {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akunmu'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-1">Nama kamu</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama panggilanmu..."
                  className="glass-input"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                className="glass-input"
              />
            </div>

            {error && (
              <div className="bg-error-container/50 text-on-error-container text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-tertiary-container/50 text-on-tertiary-container text-sm p-3 rounded-xl text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary py-4 rounded-full font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    {isSignUp ? 'person_add' : 'login'}
                  </span>
                  {isSignUp ? 'Daftar' : 'Masuk'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              className="text-sm text-on-surface-variant dark:text-zinc-400 hover:text-primary transition-colors"
            >
              {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
              <span className="font-semibold text-primary dark:text-rose-300">
                {isSignUp ? 'Masuk' : 'Daftar'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
