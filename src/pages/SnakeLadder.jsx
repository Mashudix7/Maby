import { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BOARD_SIZE, GRID_DIM, LADDERS, SNAKES, CHALLENGES, CHALLENGE_TILES } from '../data/snakeLadder';

export default function SnakeLadder() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [positions, setPositions] = useState({ 1: 0, 2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [winner, setWinner] = useState(null);

  const isFeby = profile?.display_name?.includes('Feby');
  const player1Info = { 
    name: isFeby ? 'Feby' : 'Mashudi', 
    avatar: isFeby ? '/feby.jpg' : '/mashudi.jpg', 
    color: 'border-red-500', 
    bgColor: 'bg-red-500' 
  };
  const player2Info = { 
    name: isFeby ? 'Mashudi' : 'Feby', 
    avatar: isFeby ? '/mashudi.jpg' : '/feby.jpg', 
    color: 'border-blue-600', 
    bgColor: 'bg-blue-600' 
  };

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
    let targetPos = Math.min(currentPos + steps, BOARD_SIZE);

    // Step-by-step movement
    for (let i = currentPos + 1; i <= targetPos; i++) {
      setPositions(prev => ({ ...prev, [player]: i }));
      await new Promise(r => setTimeout(r, 400));
    }

    let finalPos = targetPos;

    // Check for Snake or Ladder jump
    if (LADDERS[targetPos]) {
      await new Promise(r => setTimeout(r, 800));
      finalPos = LADDERS[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    } else if (SNAKES[targetPos]) {
      await new Promise(r => setTimeout(r, 800));
      finalPos = SNAKES[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    }

    // Final checks
    if (finalPos === BOARD_SIZE) {
      setWinner(player);
    } else if (CHALLENGE_TILES.includes(finalPos)) {
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
          <h1 className="font-serif text-3xl text-primary dark:text-[#ede0df] italic mb-2">Love Snake & Ladder</h1>
          <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-outline">
            <span className="flex items-center gap-1 text-rose-500">Challenge</span>
            <span className="flex items-center gap-1 text-indigo-500">Ladder</span>
            <span className="flex items-center gap-1 text-orange-500">Snake</span>
          </div>
        </div>

        {/* Board */}
        <div className="aspect-square w-full grid grid-cols-6 gap-2 bg-white/30 dark:bg-white/5 rounded-[2rem] p-2 border border-primary/5 overflow-hidden mb-8 relative">
          {boardCells.map((row) => 
            row.map((cellNum) => (
              <div 
                key={cellNum}
                className={`relative flex flex-col items-center justify-center rounded-xl transition-all border ${
                  CHALLENGE_TILES.includes(cellNum) 
                    ? 'bg-rose-500/10 border-rose-500/10 text-rose-600' 
                    : LADDERS[cellNum] 
                      ? 'bg-indigo-500/10 border-indigo-500/10 text-indigo-600'
                      : SNAKES[cellNum]
                        ? 'bg-orange-500/10 border-orange-500/10 text-orange-600'
                        : 'bg-white/50 dark:bg-white/5 border-transparent text-outline-variant/60'
                }`}
              >
                <span className="absolute top-1 left-1.5 text-[10px] font-bold">{cellNum}</span>
                
                {LADDERS[cellNum] && <span className="material-symbols-outlined text-lg">north_east</span>}
                {SNAKES[cellNum] && <span className="material-symbols-outlined text-lg">south_west</span>}
                {CHALLENGE_TILES.includes(cellNum) && <span className="material-symbols-outlined text-xl opacity-60">favorite</span>}
                
                {/* Players */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex -space-x-3">
                    {positions[1] === cellNum && (
                      <div className={`w-8 h-8 rounded-full border-2 ${player1Info.color} bg-white overflow-hidden z-20 transition-all duration-300 animate-bounce`}>
                        <img src={player1Info.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    {positions[2] === cellNum && (
                      <div className={`w-8 h-8 rounded-full border-2 ${player2Info.color} bg-white overflow-hidden z-20 transition-all duration-300 animate-bounce`}>
                        <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Start Point Marker */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-40">
            {positions[1] === 0 && <div className={`w-2 h-2 rounded-full ${player1Info.bgColor}`} />}
            {positions[2] === 0 && <div className={`w-2 h-2 rounded-full ${player2Info.bgColor}`} />}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-12">
            {/* Player 1 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 1 ? 'scale-110' : 'opacity-40 grayscale'}`}>
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 ${currentPlayer === 1 ? player1Info.color : 'border-transparent'}`}>
                <img src={player1Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player1Info.name}</span>
            </div>

            {/* Dice Section */}
            <div className="flex flex-col items-center gap-4">
               <button 
                onClick={rollDice}
                disabled={isRolling || isMoving || !!winner || !!activeChallenge}
                className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all ${isRolling ? 'animate-spin' : 'hover:scale-105 active:scale-95'} ${winner ? 'bg-zinc-100' : 'bg-primary text-white'}`}
               >
                 {isRolling ? (
                   <span className="material-symbols-outlined text-4xl">casino</span>
                 ) : (
                   <span className="text-4xl font-serif">{diceResult || <span className="material-symbols-outlined text-4xl">casino</span>}</span>
                 )}
               </button>
               <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${currentPlayer === 1 ? 'text-red-500' : 'text-blue-600'}`}>
                 {currentPlayer === 1 ? `${player1Info.name}'s Turn` : `${player2Info.name}'s Turn`}
               </span>
            </div>

            {/* Player 2 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 2 ? 'scale-110' : 'opacity-40 grayscale'}`}>
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 ${currentPlayer === 2 ? player2Info.color : 'border-transparent'}`}>
                <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player2Info.name}</span>
            </div>
          </div>
          
          {winner && (
            <p className="text-center text-xs text-primary font-serif italic">
               Yay! {winner === 1 ? player1Info.name : player2Info.name} wins! 🎉
            </p>
          )}
        </div>

        {/* Challenge Modal - NO GLOW */}
        {activeChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1517] rounded-3xl p-8 text-center border border-primary/10">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-rose-500">favorite</span>
              </div>
              <h3 className="font-serif text-2xl text-primary dark:text-[#ede0df] mb-4">Love Challenge!</h3>
              <p className="text-on-surface dark:text-[#ede0df] mb-8 leading-relaxed italic">
                "{activeChallenge.text}"
              </p>
              <button 
                onClick={completeChallenge}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Sudah Dilakukan 💗
              </button>
            </div>
          </div>
        )}

        {/* Win Modal - NO GLOW */}
        {winner && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/10 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1517] rounded-3xl p-8 text-center border border-primary/20">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="font-serif text-3xl text-primary dark:text-[#ede0df] mb-2">We Finished!</h3>
              <p className="text-on-surface-variant dark:text-zinc-400 mb-8 font-serif italic">
                {winner === 1 ? player1Info.name : player2Info.name} mencapai garis finish duluan, tapi kalian berdua pemenangnya!
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all"
              >
                Main Lagi 🔁
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
