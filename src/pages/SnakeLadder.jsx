import { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BOARD_SIZE, GRID_DIM, BOARD_LAYOUTS, CHALLENGES } from '../data/snakeLadder';

export default function SnakeLadder() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [positions, setPositions] = useState({ 1: 0, 2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [seenChallenges, setSeenChallenges] = useState([]);
  const [winner, setWinner] = useState(null);
  const [round, setRound] = useState(1);

  const playSound = useCallback((type) => {
    const sounds = {
      dice: 'https://assets.mixkit.co/sfx/preview/mixkit-dice-roll-pile-of-dice-561.mp3',
      move: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3',
      ladder: 'https://assets.mixkit.co/sfx/preview/mixkit-climb-descend-fast-whoosh-1481.mp3',
      snake: 'https://assets.mixkit.co/sfx/preview/mixkit-falling-on-metal-roof-2556.mp3',
      challenge: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-2820.mp3',
      win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked", e));
  }, []);
  
  // Use layout based on round
  const currentLayout = useMemo(() => {
    const layoutIndex = (round - 1) % BOARD_LAYOUTS.length;
    return BOARD_LAYOUTS[layoutIndex];
  }, [round]);

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

  const getUnseenChallenge = useCallback(() => {
    const available = CHALLENGES.filter(c => !seenChallenges.includes(c.id));
    if (available.length === 0) {
      setSeenChallenges([]);
      return CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    }
    const picked = available[Math.floor(Math.random() * available.length)];
    setSeenChallenges(prev => [...prev, picked.id]);
    return picked;
  }, [seenChallenges]);

  const movePlayer = useCallback(async (player, steps) => {
    setIsMoving(true);
    let currentPos = positions[player];
    let targetPos = Math.min(currentPos + steps, BOARD_SIZE);

    for (let i = currentPos + 1; i <= targetPos; i++) {
      setPositions(prev => ({ ...prev, [player]: i }));
      playSound('move');
      await new Promise(r => setTimeout(r, 400));
    }

    let finalPos = targetPos;

    if (currentLayout.ladders[targetPos]) {
      await new Promise(r => setTimeout(r, 800));
      playSound('ladder');
      finalPos = currentLayout.ladders[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    } else if (currentLayout.snakes[targetPos]) {
      await new Promise(r => setTimeout(r, 800));
      playSound('snake');
      finalPos = currentLayout.snakes[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    }

    if (finalPos === BOARD_SIZE) {
      playSound('win');
      setWinner(player);
    } else if (currentLayout.challengeTiles.includes(finalPos)) {
      playSound('challenge');
      const challenge = getUnseenChallenge();
      setActiveChallenge({ ...challenge, player });
    } else {
      setCurrentPlayer(player === 1 ? 2 : 1);
    }
    
    setIsMoving(false);
  }, [positions, getUnseenChallenge, currentLayout, playSound]);

  const rollDice = () => {
    if (isRolling || isMoving || activeChallenge || winner) return;
    setIsRolling(true);
    playSound('dice');
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

  const handleRestart = () => {
    setRound(prev => prev + 1);
    setPositions({ 1: 0, 2: 0 });
    setWinner(null);
    setCurrentPlayer(1);
    setDiceResult(null);
  };

  return (
    <MainLayout activePage="/games">
      <div className="max-w-lg mx-auto pb-10 px-4">
        <div className="text-center mb-4">
          <h1 className="font-serif text-3xl text-primary dark:text-[#ede0df] italic mb-1">Love Snake & Ladder</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline opacity-60">Adventure Together</p>
        </div>

        {/* Status Indicator Above Board */}
        <div className="grid grid-cols-3 gap-2 mb-4">
           <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-2 text-center border border-primary/5">
             <p className="text-[8px] font-bold uppercase text-outline mb-0.5">Round</p>
             <p className="text-sm font-serif text-primary font-bold">LEVEL {round}</p>
           </div>
           <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-2 text-center border border-primary/5">
             <p className="text-[8px] font-bold uppercase text-outline mb-0.5">{player1Info.name}</p>
             <p className="text-sm font-serif text-red-500">Pos: {positions[1]}</p>
           </div>
           <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-2 text-center border border-primary/5">
             <p className="text-[8px] font-bold uppercase text-outline mb-0.5">{player2Info.name}</p>
             <p className="text-sm font-serif text-blue-600">Pos: {positions[2]}</p>
           </div>
        </div>

        {/* Board */}
        <div className="aspect-square w-full grid grid-cols-6 gap-1 bg-white/30 dark:bg-white/5 rounded-[2.5rem] p-2 border border-primary/5 overflow-hidden mb-6 relative">
          {boardCells.map((row) => 
            row.map((cellNum) => (
              <div 
                key={cellNum}
                className={`relative flex flex-col items-center justify-center rounded-2xl transition-all border ${
                  currentLayout.challengeTiles.includes(cellNum) 
                    ? 'bg-rose-500/20 border-rose-500/20 text-rose-600' 
                    : currentLayout.ladders[cellNum] 
                      ? 'bg-indigo-500/20 border-indigo-500/20 text-indigo-600'
                      : currentLayout.snakes[cellNum]
                        ? 'bg-orange-500/20 border-orange-500/20 text-orange-600'
                        : cellNum === BOARD_SIZE
                          ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10'
                          : cellNum === 1
                            ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-600 font-bold'
                            : 'bg-white/60 dark:bg-white/10 border-transparent text-outline-variant/40'
                }`}
              >
                {/* Cell Number - Top Left */}
                <span className={`absolute top-1 left-1.5 text-[8px] font-bold ${cellNum === BOARD_SIZE ? 'text-white' : 'opacity-30'}`}>{cellNum}</span>
                
                {/* Target Info - Bottom Right */}
                {(currentLayout.ladders[cellNum] || currentLayout.snakes[cellNum]) && (
                  <span className="absolute bottom-1 right-1.5 text-[6px] font-bold opacity-60">
                    TO {currentLayout.ladders[cellNum] || currentLayout.snakes[cellNum]}
                  </span>
                )}

                {/* Main Icons - CENTERED */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {currentLayout.ladders[cellNum] && <span className="material-symbols-outlined text-2xl opacity-60">north_east</span>}
                  {currentLayout.snakes[cellNum] && <span className="material-symbols-outlined text-2xl opacity-60">south_west</span>}
                  {currentLayout.challengeTiles.includes(cellNum) && <span className="material-symbols-outlined text-2xl opacity-60">favorite</span>}
                  {cellNum === BOARD_SIZE && <span className="material-symbols-outlined text-2xl animate-bounce">flag</span>}
                  {cellNum === 1 && <span className="material-symbols-outlined text-2xl opacity-60">play_circle</span>}
                </div>
                
                {/* Players - CENTERED (On top of icons) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex -space-x-4">
                    {positions[1] === cellNum && (
                      <div className={`w-8 h-8 rounded-full border-[3px] border-red-500 bg-white overflow-hidden z-20 transition-all duration-300 animate-bounce shadow-sm`}>
                        <img src={player1Info.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    {positions[2] === cellNum && (
                      <div className={`w-8 h-8 rounded-full border-[3px] border-blue-600 bg-white overflow-hidden z-20 transition-all duration-300 animate-bounce shadow-sm`}>
                        <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-10">
            {/* Player 1 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 1 ? 'scale-110' : 'opacity-30 grayscale'}`}>
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-[3px] ${currentPlayer === 1 ? 'border-red-500' : 'border-transparent'}`}>
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
                 {currentPlayer === 1 ? `Giliran ${player1Info.name}` : `Giliran ${player2Info.name}`}
               </span>
            </div>

            {/* Player 2 Stats */}
            <div className={`flex flex-col items-center gap-2 transition-all ${currentPlayer === 2 ? 'scale-110' : 'opacity-30 grayscale'}`}>
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-[3px] ${currentPlayer === 2 ? 'border-blue-600' : 'border-transparent'}`}>
                <img src={player2Info.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{player2Info.name}</span>
            </div>
          </div>
        </div>

        {/* Challenge Modal */}
        {activeChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1517] rounded-3xl p-8 text-center border border-white/10 shadow-none">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className={`w-full h-full rounded-full border-4 overflow-hidden ${activeChallenge.player === 1 ? 'border-red-500' : 'border-blue-600'}`}>
                  <img src={activeChallenge.player === 1 ? player1Info.avatar : player2Info.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-[#1a1517] rounded-full flex items-center justify-center border-2 border-rose-500">
                  <span className="material-symbols-outlined text-sm text-rose-500">favorite</span>
                </div>
              </div>
              
              <h3 className="font-serif text-sm text-rose-500 font-bold uppercase tracking-widest mb-2">Love Challenge!</h3>
              <p className="text-sm font-bold text-outline-variant mb-6 uppercase tracking-widest">
                UNTUK: <span className={activeChallenge.player === 1 ? 'text-red-500' : 'text-blue-600'}>{activeChallenge.player === 1 ? player1Info.name : player2Info.name}</span>
              </p>
              
              <p className="text-on-surface dark:text-[#ede0df] mb-8 leading-relaxed italic text-xl">
                "{activeChallenge.text}"
              </p>
              <button 
                onClick={completeChallenge}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-none"
              >
                Sudah Dilakukan 💗
              </button>
            </div>
          </div>
        )}

        {/* Win Modal */}
        {winner && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1517] rounded-3xl p-8 text-center border border-white/20 shadow-none">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="font-serif text-3xl text-primary dark:text-[#ede0df] mb-2">We Finished!</h3>
              <p className="text-on-surface-variant dark:text-zinc-400 mb-8 font-serif italic">
                {winner === 1 ? player1Info.name : player2Info.name} mencapai garis finish duluan, tapi kalian berdua pemenangnya!
              </p>
              <button 
                onClick={handleRestart}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-none"
              >
                Main Level Berikutnya 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
