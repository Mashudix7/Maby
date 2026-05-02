import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCouple, joinCouple } from '../services/coupleService';

export default function CoupleSetup() {
  const { user, coupleId, refreshCouple } = useAuth();
  const [mode, setMode] = useState(null); // null | 'create' | 'join'
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect if already has couple
  if (!user) return <Navigate to="/login" replace />;
  if (coupleId) return <Navigate to="/" replace />;

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const couple = await createCouple(user.id);
      setGeneratedCode(couple.invite_code);
      await refreshCouple();
    } catch (err) {
      setError(err.message || 'Gagal membuat pasangan');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await joinCouple(user.id, inviteCode);
      await refreshCouple();
    } catch (err) {
      setError(err.message || 'Gagal bergabung');
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1a1517] px-4 transition-colors duration-300">
      <div className="fixed w-64 h-64 bg-primary-container rounded-full blur-[80px] opacity-30 top-20 right-10 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-secondary-container rounded-full blur-[80px] opacity-30 bottom-20 left-10 pointer-events-none" />

      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic text-rose-400 dark:text-rose-300 mb-2">Maby</h1>
          <p className="text-on-surface-variant dark:text-zinc-400 font-serif italic">
            Hubungkan dirimu dengan pasanganmu 💗
          </p>
        </div>

        {/* If code was just generated, show success */}
        {generatedCode ? (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-rose-400 mb-4 block">celebration</span>
            <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-4">Pasangan Dibuat!</h2>
            <p className="text-on-surface-variant dark:text-zinc-400 mb-6">
              Bagikan kode ini ke pasanganmu agar dia bisa bergabung:
            </p>
            <div className="bg-surface-container-low dark:bg-white/5 rounded-2xl p-6 mb-6">
              <p className="text-3xl font-mono font-bold text-primary dark:text-rose-300 tracking-[0.3em]">
                {generatedCode.toUpperCase()}
              </p>
            </div>
            <button
              onClick={copyCode}
              className="ghost-btn mx-auto"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Tersalin!' : 'Salin Kode'}
            </button>
          </div>
        ) : !mode ? (
          /* Mode Selection */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('create')}
              className="glass-panel rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform group"
            >
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
              </div>
              <h3 className="font-serif text-xl text-on-surface dark:text-[#ede0df] mb-2">Buat Pasangan Baru</h3>
              <p className="text-sm text-on-surface-variant dark:text-zinc-400">
                Buat ruangan baru dan undang pasanganmu
              </p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="glass-panel rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-3xl">group_add</span>
              </div>
              <h3 className="font-serif text-xl text-on-surface dark:text-[#ede0df] mb-2">Gabung Pasangan</h3>
              <p className="text-sm text-on-surface-variant dark:text-zinc-400">
                Masukkan kode undangan dari pasanganmu
              </p>
            </button>
          </div>
        ) : mode === 'create' ? (
          /* Create Couple */
          <div className="glass-panel rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-4 block">favorite</span>
            <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-4">Buat Pasangan Baru</h2>
            <p className="text-on-surface-variant dark:text-zinc-400 mb-8">
              Kamu akan mendapatkan kode undangan yang bisa dibagikan ke pasanganmu.
            </p>
            {error && (
              <div className="bg-error-container/50 text-on-error-container text-sm p-3 rounded-xl mb-4">{error}</div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setMode(null); setError(''); }}
                className="ghost-btn"
              >
                Kembali
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    Buat Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Join Couple */
          <div className="glass-panel rounded-2xl p-8">
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-5xl text-secondary mb-4 block">group_add</span>
              <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-2">Gabung Pasangan</h2>
              <p className="text-on-surface-variant dark:text-zinc-400">
                Masukkan kode undangan dari pasanganmu
              </p>
            </div>
            <form onSubmit={handleJoin} className="space-y-6">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Masukkan kode undangan..."
                required
                className="glass-input text-center text-2xl font-mono tracking-[0.2em] uppercase"
              />
              {error && (
                <div className="bg-error-container/50 text-on-error-container text-sm p-3 rounded-xl text-center">{error}</div>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => { setMode(null); setError(''); }}
                  className="ghost-btn"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading || !inviteCode.trim()}
                  className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">link</span>
                      Gabung
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
