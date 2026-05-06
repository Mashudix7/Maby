import { useState, useCallback, useMemo, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { PREDICTION_QUESTIONS } from '../data/predictionGame';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { getGameHistory, saveSeenQuestion, resetGameHistory } from '../services/gameService';

export default function PredictionGame() {
  const { profile, coupleId } = useAuth();
  const [step, setStep] = useState('pickRole'); // pickRole, start, playerA, transition, playerB, result
  const [category, setCategory] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerA, setAnswerA] = useState(null);
  const [answerB, setAnswerB] = useState(null);
  const [score, setScore] = useState(0);
  const [seenIds, setSeenIds] = useState([]);
  
  // Roles
  const [roles, setRoles] = useState({
    answerer: null, // { name, avatar }
    predictor: null
  });

  const isFeby = profile?.display_name?.includes('Feby');
  const myInfo = { name: isFeby ? 'Feby Zahara' : 'Mashudi', avatar: isFeby ? '/feby.jpg' : '/mashudi.jpg' };
  const partnerInfo = { name: isFeby ? 'Mashudi' : 'Feby Zahara', avatar: isFeby ? '/mashudi.jpg' : '/feby.jpg' };

  useEffect(() => {
    if (coupleId) {
      getGameHistory(coupleId, 'prediction_game').then(setSeenIds);
    }
  }, [coupleId]);

  const filteredQuestions = useMemo(() => {
    const base = category === 'all' ? PREDICTION_QUESTIONS : PREDICTION_QUESTIONS.filter(q => q.category === category);
    return base.filter(q => !seenIds.includes(q.id));
  }, [category, seenIds]);

  const handlePickRole = (answerer, predictor) => {
    setRoles({ answerer, predictor });
    setStep('start');
  };

  const startNewRound = useCallback(async () => {
    let available = filteredQuestions;
    
    if (available.length === 0) {
      if (window.confirm("Semua pertanyaan di kategori ini sudah muncul. Reset riwayat?")) {
        await resetGameHistory(coupleId, 'prediction_game');
        setSeenIds([]);
        available = category === 'all' ? PREDICTION_QUESTIONS : PREDICTION_QUESTIONS.filter(q => q.category === category);
      } else {
        return;
      }
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const question = available[randomIndex];
    setCurrentQuestion(question);
    
    // Save to history
    if (coupleId) {
      saveSeenQuestion(coupleId, 'prediction_game', question.id);
      setSeenIds(prev => [...prev, question.id]);
    }

    setAnswerA(null);
    setAnswerB(null);
    setStep('playerA');
  }, [filteredQuestions, coupleId, category]);

  const handleAnswerA = (option) => {
    setAnswerA(option);
    setStep('transition');
  };

  const handleAnswerB = (option) => {
    setAnswerB(option);
    if (option === answerA) setScore(prev => prev + 1);
    setStep('result');
  };

  const resetGame = () => {
    setStep('pickRole');
    setAnswerA(null);
    setAnswerB(null);
    setScore(0);
  };

  return (
    <MainLayout activePage="/games">
      <div className="max-w-md mx-auto flex flex-col gap-8 pb-20 pt-4 px-4 min-h-[70vh] justify-center">
        
        {step === 'pickRole' && (
          <div className="animate-in fade-in zoom-in duration-500 space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="font-serif text-3xl text-on-surface dark:text-[#ede0df]">Pilih Peran</h1>
              <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic text-sm">
                Siapa yang mau menjawab & menebak?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handlePickRole(myInfo, partnerInfo)}
                className="p-5 glass-panel border border-indigo-500/20 rounded-2xl text-left flex items-center gap-4 group hover:border-indigo-500 transition-all"
              >
                <div className="flex -space-x-3">
                  <img src={myInfo.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt={myInfo.name} />
                  <img src={partnerInfo.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt={partnerInfo.name} />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Opsi 1</p>
                  <p className="text-sm text-on-surface dark:text-zinc-300">
                    <span className="font-bold text-primary">{myInfo.name.split(' ')[0]}</span> Menjawab <br/>
                    <span className="font-bold text-indigo-500">{partnerInfo.name.split(' ')[0]}</span> Menebak
                  </p>
                </div>
                <span className="material-symbols-outlined text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
              </button>

              <button
                onClick={() => handlePickRole(partnerInfo, myInfo)}
                className="p-5 glass-panel border border-indigo-500/20 rounded-2xl text-left flex items-center gap-4 group hover:border-indigo-500 transition-all"
              >
                <div className="flex -space-x-3">
                  <img src={partnerInfo.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt={partnerInfo.name} />
                  <img src={myInfo.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt={myInfo.name} />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Opsi 2</p>
                  <p className="text-sm text-on-surface dark:text-zinc-300">
                    <span className="font-bold text-primary">{partnerInfo.name.split(' ')[0]}</span> Menjawab <br/>
                    <span className="font-bold text-indigo-500">{myInfo.name.split(' ')[0]}</span> Menebak
                  </p>
                </div>
                <span className="material-symbols-outlined text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 'start' && (
          <div className="animate-in fade-in zoom-in duration-500 space-y-8 text-center">
            <div className="space-y-2">
              <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-lg rotate-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                <span className="material-symbols-outlined text-4xl relative z-10">psychology</span>
              </div>
              <h1 className="font-serif text-3xl text-on-surface dark:text-[#ede0df] italic">Prediction Game</h1>
              <p className="text-on-surface-variant dark:text-zinc-400 font-serif italic text-sm">
                Pilih kategori pertanyaan ✨
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['all', 'romantic', 'fun', 'deep', 'simple'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    category === cat 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'bg-white/50 dark:bg-white/5 text-on-surface-variant dark:text-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={startNewRound}
                className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
              >
                Mulai
              </button>
              <button
                onClick={() => setStep('pickRole')}
                className="text-xs text-indigo-500 font-bold uppercase tracking-widest hover:underline"
              >
                Ganti Peran
              </button>
            </div>
          </div>
        )}

        {step === 'playerA' && (
          <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <img src={roles.answerer.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" alt={roles.answerer.name} />
              <div className="space-y-1">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Giliran {roles.answerer.name.split(' ')[0]}
                </span>
                <h2 className="text-lg font-serif italic text-on-surface-variant dark:text-zinc-400">Jawab diam-diam ya..</h2>
              </div>
            </div>

            <GlassCard className="p-8 border-indigo-500/20 text-center space-y-6">
              <p className="text-xl font-serif text-on-surface dark:text-[#ede0df] leading-relaxed">
                {currentQuestion.text}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerA(opt)}
                    className="w-full py-4 px-6 rounded-xl border border-indigo-500/10 hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-on-surface dark:text-[#ede0df] transition-all font-sans font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {step === 'transition' && (
          <div className="animate-in fade-in zoom-in duration-500 text-center space-y-8">
            <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl animate-pulse relative overflow-hidden">
               <img src={roles.predictor.avatar} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={roles.predictor.name} />
               <div className="absolute inset-0 bg-purple-500/40 backdrop-blur-[1px]" />
               <span className="material-symbols-outlined text-5xl relative z-10">sync</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif italic text-on-surface dark:text-[#ede0df]">Selesai!</h2>
              <p className="text-on-surface-variant dark:text-zinc-400">Sekarang kasih HP-nya ke <span className="font-bold text-indigo-500">{roles.predictor.name.split(' ')[0]}</span></p>
            </div>
            <button
              onClick={() => setStep('playerB')}
              className="px-12 py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Lanjut
            </button>
          </div>
        )}

        {step === 'playerB' && (
          <div className="animate-in slide-in-from-right fade-in duration-500 space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <img src={roles.predictor.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" alt={roles.predictor.name} />
              <div className="space-y-1">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Giliran {roles.predictor.name.split(' ')[0]}
                </span>
                <h2 className="text-lg font-serif italic text-on-surface-variant dark:text-zinc-400">Tebak jawaban {roles.answerer.name.split(' ')[0]}!</h2>
              </div>
            </div>

            <GlassCard className="p-8 border-purple-500/20 text-center space-y-6">
              <p className="text-xl font-serif text-on-surface dark:text-[#ede0df] leading-relaxed">
                {currentQuestion.text}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerB(opt)}
                    className="w-full py-4 px-6 rounded-xl border border-purple-500/10 hover:border-purple-500/40 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-on-surface dark:text-[#ede0df] transition-all font-sans font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {step === 'result' && (
          <div className="animate-in zoom-in fade-in duration-500 space-y-8">
            <div className="text-center">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto shadow-xl mb-4 relative ${answerA === answerB ? 'bg-green-500' : 'bg-rose-400'}`}>
                  <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={roles.answerer.avatar} className="w-full h-full object-cover" alt="A" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={roles.predictor.avatar} className="w-full h-full object-cover" alt="B" />
                  </div>
                  <span className="material-symbols-outlined text-4xl">
                    {answerA === answerB ? 'celebration' : 'sentiment_dissatisfied'}
                  </span>
               </div>
               <h2 className="text-3xl font-serif italic text-on-surface dark:text-[#ede0df]">
                 {answerA === answerB ? 'Cocok Banget! ✨' : 'Yah, Beda.. 🥺'}
               </h2>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-indigo-500/10 flex items-center gap-4">
                <img src={roles.answerer.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20" alt="A" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Jawaban {roles.answerer.name.split(' ')[0]}</span>
                  <p className="text-base font-medium text-on-surface dark:text-zinc-300">{answerA}</p>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-purple-500/10 flex items-center gap-4">
                <img src={roles.predictor.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20" alt="B" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Tebakan {roles.predictor.name.split(' ')[0]}</span>
                  <p className="text-base font-medium text-on-surface dark:text-zinc-300">{answerB}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 py-4 bg-white/50 dark:bg-white/5 text-on-surface dark:text-zinc-400 border border-outline-variant/20 rounded-2xl font-bold transition-all text-xs"
              >
                Menu Utama
              </button>
              <button
                onClick={startNewRound}
                className="flex-[2] py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Lanjut Main
              </button>
            </div>
            
            <div className="text-center flex justify-between items-center px-4">
              <p className="text-xs font-serif italic text-outline dark:text-zinc-500">Total Match: {score}</p>
              <button
                onClick={() => setStep('pickRole')}
                className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest"
              >
                Tukar Peran
              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
