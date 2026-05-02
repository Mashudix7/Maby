import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, coupleId, signUp, signIn } = useAuth();
  const [name, setName] = useState('feby');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user && coupleId) return <Navigate to="/" replace />;
  if (user && !coupleId) return <Navigate to="/couple-setup" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Konversi nama menjadi email dummy untuk Supabase Auth
    const email = `${name}@maby.com`;
    const displayName = name === 'feby' ? 'Feby' : 'Mashudi';

    try {
      // Coba login
      await signIn(email, password);
    } catch (err) {
      if (err.message.includes('Invalid login credentials') || err.message.includes('Email not confirmed')) {
        try {
          // Jika gagal karena akun belum ada, buat otomatis lalu login
          await signUp(email, password, displayName);
          await signIn(email, password);
        } catch (signUpErr) {
          if (signUpErr.message.includes('User already registered')) {
            setError('Password yang kamu masukkan salah.');
          } else {
            setError(`Gagal daftar: ${signUpErr.message}`);
          }
        }
      } else {
        setError(`Gagal masuk: ${err.message}`);
      }
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
            Masuk ke Ruang Kita
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-1">Kamu siapa?</label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input cursor-pointer"
              >
                <option value="feby">Feby 🌸</option>
                <option value="mashudi">Mashudi 🗿</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ketik passwordmu..."
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary py-4 rounded-full font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md mt-4"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
