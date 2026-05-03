import { useState, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { TRUTH_OR_DARE_DATA } from '../data/truthOrDare';
import GlassCard from '../components/ui/GlassCard';

export default function TruthOrDare() {
  const [mode, setMode] = useState('online'); // 'online' or 'offline'
  const [currentTask, setCurrentTask] = useState(null);

  const handlePick = useCallback((type) => {
    const options = TRUTH_OR_DARE_DATA[mode][type];
    const randomIndex = Math.floor(Math.random() * options.length);
    const task = options[randomIndex];
    
    setCurrentTask({
      type,
      mode,
      text: task
    });
  }, [mode]);

  return (
    <MainLayout activePage="/games">
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-20 pt-4 px-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl md:text-5xl text-primary dark:text-rose-300 italic">Truth or Dare</h1>
          <p className="text-on-surface-variant dark:text-zinc-400 font-serif italic text-sm">
            Siap buat makin jujur atau makin berani? ✨
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white/50 dark:bg-white/5 p-1.5 rounded-2xl border border-primary/10 flex gap-1 shadow-sm">
            <button
              onClick={() => setMode('online')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                mode === 'online' 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'text-on-surface-variant dark:text-zinc-500 hover:text-primary'
              }`}
            >
              🌐 Online
            </button>
            <button
              onClick={() => setMode('offline')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                mode === 'offline' 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'text-on-surface-variant dark:text-zinc-500 hover:text-primary'
              }`}
            >
              👫 Offline
            </button>
          </div>
        </div>

        {/* Main Selection */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <button
            onClick={() => handlePick('truth')}
            className="group relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-900" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative h-full flex flex-col items-center justify-center text-white gap-2">
              <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:rotate-12 transition-transform">question_mark</span>
              <span className="font-serif text-2xl md:text-3xl font-bold italic">Truth</span>
            </div>
          </button>

          <button
            onClick={() => handlePick('dare')}
            className="group relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-primary dark:from-rose-600 dark:to-rose-900" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative h-full flex flex-col items-center justify-center text-white gap-2">
              <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:-rotate-12 transition-transform">bolt</span>
              <span className="font-serif text-2xl md:text-3xl font-bold italic">Dare</span>
            </div>
          </button>
        </div>

        {/* Result Card */}
        {currentTask && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <GlassCard className={`p-8 md:p-12 text-center relative overflow-hidden border-2 ${
              currentTask.type === 'truth' ? 'border-blue-500/20' : 'border-rose-500/20'
            }`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${
                currentTask.type === 'truth' ? 'bg-blue-500' : 'bg-rose-500'
              }`} />
              
              <div className="flex justify-center mb-6">
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${
                  currentTask.type === 'truth' ? 'bg-blue-500' : 'bg-rose-500'
                }`}>
                  {currentTask.type}
                </span>
              </div>

              <h2 className="font-serif text-xl md:text-3xl text-on-surface dark:text-[#ede0df] leading-relaxed mb-8">
                &quot;{currentTask.text}&quot;
              </h2>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handlePick(currentTask.type)}
                  className="px-10 py-3 bg-primary text-on-primary rounded-full font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Ganti Pertanyaan
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
