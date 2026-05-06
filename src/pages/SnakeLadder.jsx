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
  const player1Info = { name: isFeby ? 'Feby' : 'Mashudi', avatar: isFeby ? '/feby.jpg' : '/mashudi.jpg', color: 'bg-rose-500' };
  const player2Info = { name: isFeby ? 'Mashudi' : 'Feby', avatar: isFeby ? '/mashudi.jpg' : '/feby.jpg', color: 'bg-indigo-500' };

  // Generate board grid (snake pattern)
  const boardCells = useMemo(() => {
    const cells = [];
    for (let r = GRID_DIM - 1; r >= 0; r--) {
      const row = [];
      for (let c = 0; c < GRID_DIM; c++) {
        // Calculate cell number based on snake pattern
        let cellNum;
        if (r % 2 === (GRID_DIM % 2 === 0 ? 1 : 0)) {
          // Even row (from bottom): left to right
          cellNum = r * GRID_DIM + c + 1;
        } else {
          // Odd row (from bottom): right to left
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

    // Animate step-by-step
    for (let i = currentPos + 1; i <= nextPos; i++) {
      setPositions(prev => ({ ...prev, [player]: i }));
      await new Promise(r => setTimeout(r, 300));
    }

    // Check for Snake or Ladder
    if (LADDERS[nextPos]) {
      setSpecialEffect({ type: 'ladder', from: nextPos, to: LADDERS[nextPos] });
      await new Promise(r => setTimeout(r, 1000));
      setPositions(prev => ({ ...prev, [player]: LADDERS[nextPos] }));
      nextPos = LADDERS[nextPos];
      setSpecialEffect(null);
    } else if (SNAKES[nextPos]) {
      setSpecialEffect({ type: 'snake', from: nextPos, to: SNAKES[nextPos] });
      await new Promise(r => setTimeout(r, 1000));
      setPositions(prev => ({ ...prev, [player]: SNAKES[nextPos] }));
      nextPos = SNAKES[nextPos];
      setSpecialEffect(null);
    }

    // Check for Win
    if (nextPos === BOARD_SIZE) {
      setWinner(player);
      setIsMoving(false);
      return;
    }

    // Check for Challenge
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
    
    // Animate dice
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
      <div className="max-w-lg mx-auto pb-10">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl text-primary dark:text-rose-300 italic mb-2">Love Snake & Ladder</h1>
          <p className="text-xs font-semibold text-outline tracking-widest uppercase">Bonding Time 💗</p>
        </div>

        {/* Board */}
        <div className="aspect-square w-full grid grid-cols-6 gap-1 bg-white/20 dark:bg-white/5 rounded-3xl p-1 border border-primary/10 shadow-xl overflow-hidden mb-8 relative">
          {boardCells.map((row, rIdx) => 
            row.map((cellNum) => (
              <div 
                key={cellNum}
                className={`relative flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors ${
                  CHALLENGE_TILES.includes(cellNum) 
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' 
                    : LADDERS[cellNum] 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-400'
                      : SNAKES[cellNum]
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-400'
                        : 'bg-white/40 dark:bg-white/5 text-outline-variant'
                }`}
              >
                {cellNum}
                {/* Special Icons */}
                {LADDERS[cellNum] && <span className="material-symbols-outlined absolute top-1 right-1 text-[10px]">north_east</span>}
                {SNAKES[cellNum] && <span className="material-symbols-outlined absolute bottom-1 left-1 text-[10px]">south_west</span>}
                {CHALLENGE_TILES.includes(cellNum) && <span className="material-symbols-outlined absolute text-[12px] opacity-40">favorite</span>}
                
                {/* Players */}
                <div className="absolute inset-0 flex items-center justify-center gap-0.5 pointer-events-none">
                  {positions[1] === cellNum && (
                    <div className={`w-4 h-4 rounded-full ${player1Info.color} border-2 border-white shadow-sm transition-all duration-300 z-10 animate-bounce`} />
                  )}
                  {positions[2] === cellNum && (
                    <div className={`w-4 h-4 rounded-full ${player2Info.color} border-2 border-white shadow-sm transition-all duration-300 z-10 animate-bounce`} />
                  )}
                </div>
              </div>
            ))
          )}

          {/* Start Point */}
          {(positions[1] === 0 || positions[2] === 0) && (
            <div className="absolute -bottom-4 left-0 w-full flex justify-center gap-4">
              {positions[1] === 0 && <div className={`w-5 h-5 rounded-full ${player1Info.color} border-2 border-white shadow-md animate-pulse`} />}
              {positions[2] === 0 && <div className={`w-5 h-5 rounded-full ${player2Info.color} border-2 border-white shadow-md animate-pulse`} />}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-10">
            {/* Player 1 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 1 ? 'scale-110' : 'opacity-40 scale-90 grayscale'}`}>
              <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${currentPlayer === 1 ? 'border-rose-500 shadow-lg' : 'border-transparent'}`}>
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
               <span className="text-[10px] font-bold text-primary dark:text-rose-400 uppercase tracking-[0.2em]">
                 {currentPlayer === 1 ? `${player1Info.name}'s Turn` : `${player2Info.name}'s Turn`}
               </span>
            </div>

            {/* Player 2 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 2 ? 'scale-110' : 'opacity-40 scale-90 grayscale'}`}>
              <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${currentPlayer === 2 ? 'border-indigo-500 shadow-lg' : 'border-transparent'}`}>
                <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player2Info.name}</span>
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant dark:text-zinc-500 font-serif italic max-w-[200px]">
            {winner ? `Yay! ${winner === 1 ? player1Info.name : player2Info.name} wins! 🎉` : specialEffect ? (specialEffect.type === 'ladder' ? "Wohoo! Romantic boost! 🚀" : "Oops! Seseorang sedang ngambek nih 😆") : "Klik dadu untuk melangkah bersama."}
          </p>
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
