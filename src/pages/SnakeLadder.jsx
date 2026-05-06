import { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BOARD_SIZE, GRID_DIM, LADDERS, SNAKES, CHALLENGES, CHALLENGE_TILES } from '../data/snakeLadder';

export default function SnakeLadder() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [positions, setPositions] = useState({ 1: 0, 2: 0 }); // 0 is start
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [specialEffect, setSpecialEffect] = useState(null); // { type: 'ladder'|'snake', from: x, to: y }
  const [winner, setWinner] = useState(null);

  const isFeby = profile?.display_name?.includes('Feby');
  const player1Info = { name: isFeby ? 'Feby' : 'Mashudi', avatar: isFeby ? '/feby.jpg' : '/mashudi.jpg', color: 'bg-red-500' };
  const player2Info = { name: isFeby ? 'Mashudi' : 'Feby', avatar: isFeby ? '/mashudi.jpg' : '/feby.jpg', color: 'bg-blue-600' };

  // Generate board grid (snake pattern)
  const boardCells = useMemo(() => {
    const cells = [];
    for (let r = GRID_DIM - 1; r >= 0; r--) {
      const row = [];
      for (let c = 0; c < GRID_DIM; c++) {
        let cellNum;
        if (r % 2 === (GRID_DIM % 2 === 0 ? 1 : 0)) {
          cellNum = r * GRID_DIM + c + 1;
        } else {
          cellNum = r * GRID_DIM + (GRID_DIM - 1 - c) + 1;
        }
        row.push(cellNum);
      }
      cells.push(row);
    }
    return cells;
  }, []);

  const movePlayer = useCallback(async (player, steps) => {
    setIsMoving(true);
    let currentPos = positions[player];
    let nextPos = Math.min(currentPos + steps, BOARD_SIZE);

    for (let i = currentPos + 1; i <= nextPos; i++) {
      setPositions(prev => ({ ...prev, [player]: i }));
      await new Promise(r => setTimeout(r, 400));
    }

    if (LADDERS[nextPos]) {
      setSpecialEffect({ type: 'ladder', from: nextPos, to: LADDERS[nextPos] });
      await new Promise(r => setTimeout(r, 1200));
      setPositions(prev => ({ ...prev, [player]: LADDERS[nextPos] }));
      nextPos = LADDERS[nextPos];
      setSpecialEffect(null);
    } else if (SNAKES[nextPos]) {
      setSpecialEffect({ type: 'snake', from: nextPos, to: SNAKES[nextPos] });
      await new Promise(r => setTimeout(r, 1200));
      setPositions(prev => ({ ...prev, [player]: SNAKES[nextPos] }));
      nextPos = SNAKES[nextPos];
      setSpecialEffect(null);
    }

    if (nextPos === BOARD_SIZE) {
      setWinner(player);
      setIsMoving(false);
      return;
    }

    if (CHALLENGE_TILES.includes(nextPos)) {
      const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      setActiveChallenge(randomChallenge);
    } else {
      setCurrentPlayer(player === 1 ? 2 : 1);
    }
    
    setIsMoving(false);
  }, [positions]);

  const rollDice = () => {
    if (isRolling || isMoving || activeChallenge || winner) return;
    setIsRolling(true);
    setDiceResult(null);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setIsRolling(false);
      movePlayer(currentPlayer, result);
    }, 800);
  };

  const completeChallenge = () => {
    setActiveChallenge(null);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  return (
    <MainLayout activePage="/games">
      <div className="max-w-lg mx-auto pb-10 px-4">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl text-primary dark:text-rose-300 italic mb-2">Love Snake & Ladder</h1>
          <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-outline">
            <span className="flex items-center gap-1 text-rose-500"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Challenge</span>
            <span className="flex items-center gap-1 text-indigo-500"><span className="material-symbols-outlined text-[12px]">north_east</span> Ladder</span>
            <span className="flex items-center gap-1 text-orange-500"><span className="material-symbols-outlined text-[12px]">south_west</span> Snake</span>
          </div>
        </div>

        {/* Board */}
        <div className="aspect-square w-full grid grid-cols-6 gap-2 bg-white/30 dark:bg-white/5 rounded-[2rem] p-2 border border-primary/10 shadow-2xl overflow-hidden mb-8 relative">
          {boardCells.map((row) => 
            row.map((cellNum) => (
              <div 
                key={cellNum}
                className={`relative flex flex-col items-center justify-center rounded-xl transition-all border-2 ${
                  CHALLENGE_TILES.includes(cellNum) 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' 
                    : LADDERS[cellNum] 
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600'
                      : SNAKES[cellNum]
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-600'
                        : 'bg-white/50 dark:bg-white/5 border-transparent text-outline-variant/60'
                }`}
              >
                <span className="absolute top-1 left-1.5 text-[10px] font-bold">{cellNum}</span>
                
                {/* Special Indicators */}
                {LADDERS[cellNum] && (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="material-symbols-outlined text-lg">north_east</span>
                    <span className="text-[7px] font-bold">TO {LADDERS[cellNum]}</span>
                  </div>
                )}
                {SNAKES[cellNum] && (
                  <div className="flex flex-col items-center opacity-80">
                    <span className="material-symbols-outlined text-lg">south_west</span>
                    <span className="text-[7px] font-bold">TO {SNAKES[cellNum]}</span>
                  </div>
                )}
                {CHALLENGE_TILES.includes(cellNum) && (
                  <span className="material-symbols-outlined text-xl opacity-60">favorite</span>
                )}
                
                {/* Players container - Absolute centering */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex -space-x-2">
                    {positions[1] === cellNum && (
                      <div className={`w-7 h-7 rounded-full ${player1Info.color} border-2 border-white shadow-lg transform scale-110 z-20 transition-all duration-500 animate-bounce`} />
                    )}
                    {positions[2] === cellNum && (
                      <div className={`w-7 h-7 rounded-full ${player2Info.color} border-2 border-white shadow-lg transform scale-110 z-20 transition-all duration-500 animate-bounce`} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Start Point Marker */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-40">
            {positions[1] === 0 && <div className={`w-3 h-3 rounded-full ${player1Info.color}`} />}
            {positions[2] === 0 && <div className={`w-3 h-3 rounded-full ${player2Info.color}`} />}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-10">
            {/* Player 1 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 1 ? 'scale-110' : 'opacity-40 scale-90 grayscale'}`}>
              <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${currentPlayer === 1 ? 'border-red-500 shadow-lg' : 'border-transparent'}`}>
                <img src={player1Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player1Info.name}</span>
            </div>

            {/* Dice Section */}
            <div className="flex flex-col items-center gap-4">
               <button 
                onClick={rollDice}
                disabled={isRolling || isMoving || !!winner || !!activeChallenge}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${isRolling ? 'animate-spin' : 'hover:scale-105 active:scale-95'} ${winner ? 'bg-zinc-200' : 'bg-primary text-white shadow-xl'}`}
               >
                 {isRolling ? (
                   <span className="material-symbols-outlined text-4xl">casino</span>
                 ) : diceResult ? (
                   <span className="text-4xl font-serif">{diceResult}</span>
                 ) : (
                   <span className="material-symbols-outlined text-4xl">casino</span>
                 )}
               </button>
               <div className="flex flex-col items-center gap-1">
                 <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${currentPlayer === 1 ? 'text-red-500' : 'text-blue-600'}`}>
                   {currentPlayer === 1 ? `${player1Info.name}'s Turn` : `${player2Info.name}'s Turn`}
                 </span>
                 <div className="flex gap-1">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className={`w-1 h-1 rounded-full ${diceResult === i ? 'bg-primary' : 'bg-zinc-200'}`} />
                   ))}
                 </div>
               </div>
            </div>

            {/* Player 2 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 2 ? 'scale-110' : 'opacity-40 scale-90 grayscale'}`}>
              <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${currentPlayer === 2 ? 'border-blue-600 shadow-lg' : 'border-transparent'}`}>
                <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player2Info.name}</span>
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant dark:text-zinc-500 font-serif italic max-w-[200px]">
            {winner ? `Yay! ${winner === 1 ? player1Info.name : player2Info.name} wins! 🎉` : specialEffect ? (specialEffect.type === 'ladder' ? "Wohoo! Romantic boost! 🚀" : "Oops! Seseorang sedang ngambek nih 😆") : "Klik dadu untuk melangkah bersama."}
          </p>
        </div>

        {/* Legend / Guide */}
        <div className="mt-12 grid grid-cols-1 gap-4">
           <GlassCard className="p-4 border-primary/5">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Panduan Permainan</h4>
             <div className="space-y-3">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-rose-500 text-sm">favorite</span>
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-on-surface">Challenge Kotak Cinta</p>
                   <p className="text-[10px] text-on-surface-variant">Berhenti di sini untuk memicu tantangan romantis yang harus dilakukan bersama.</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-indigo-500 text-sm">north_east</span>
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-on-surface">Tangga Kasih Sayang</p>
                   <p className="text-[10px] text-on-surface-variant">Lompatan ke depan karena momen manis! Membantu kalian lebih cepat sampai finish.</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-orange-500 text-sm">south_west</span>
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-on-surface">Ular Ngambek</p>
                   <p className="text-[10px] text-on-surface-variant">Ups! Ada sedikit kesalahpahaman, harus turun ke kotak yang dituju. Tetap semangat!</p>
                 </div>
               </div>
             </div>
           </GlassCard>
        </div>

        {/* Challenge Modal */}
        {activeChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <GlassCard className="w-full max-w-sm p-8 text-center border-rose-500/20 shadow-2xl scale-in-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-rose-500 animate-pulse">favorite</span>
              </div>
              <h3 className="font-serif text-2xl text-primary dark:text-rose-300 mb-4">Love Challenge!</h3>
              <p className="text-on-surface dark:text-[#ede0df] mb-8 leading-relaxed italic">
                "{activeChallenge.text}"
              </p>
              <button 
                onClick={completeChallenge}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Sudah Dilakukan 💗
              </button>
            </GlassCard>
          </div>
        )}

        {/* Win Modal */}
        {winner && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-md animate-in zoom-in duration-500">
            <GlassCard className="w-full max-w-sm p-8 text-center border-primary/30 shadow-2xl">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="font-serif text-3xl text-primary dark:text-rose-300 mb-2">We Finished!</h3>
              <p className="text-on-surface-variant dark:text-zinc-400 mb-8 font-serif italic">
                {winner === 1 ? player1Info.name : player2Info.name} mencapai garis finish duluan, tapi kalian berdua pemenangnya hari ini!
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:brightness-110 transition-all"
              >
                Main Lagi 🔁
              </button>
            </GlassCard>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
