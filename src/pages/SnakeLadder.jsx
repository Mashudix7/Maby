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
  const [seenChallenges, setSeenChallenges] = useState([]);
  const [winner, setWinner] = useState(null);
  const [round, setRound] = useState(1);
  const [boardConfig, setBoardConfig] = useState({
    ladders: LADDERS,
    snakes: SNAKES,
    challengeTiles: CHALLENGE_TILES
  });

  useEffect(() => {
    const generateRandomBoard = () => {
      const occupied = new Set([1, BOARD_SIZE]);
      const newLadders = {};
      const newSnakes = {};
      const newChallenges = [];

      // Generate 5 Ladders
      for (let i = 0; i < 5; i++) {
        let start, end;
        do {
          start = Math.floor(Math.random() * (BOARD_SIZE - 10)) + 2;
          end = start + Math.floor(Math.random() * 10) + 5;
        } while (occupied.has(start) || occupied.has(end) || end >= BOARD_SIZE);
        newLadders[start] = end;
        occupied.add(start);
        occupied.add(end);
      }

      // Generate 5 Snakes
      for (let i = 0; i < 5; i++) {
        let start, end;
        do {
          start = Math.floor(Math.random() * (BOARD_SIZE - 5)) + 10;
          end = start - (Math.floor(Math.random() * 8) + 5);
        } while (occupied.has(start) || occupied.has(end) || end <= 1);
        newSnakes[start] = end;
        occupied.add(start);
        occupied.add(end);
      }

      // Generate ~16 Challenges
      for (let i = 0; i < 16; i++) {
        let tile;
        do {
          tile = Math.floor(Math.random() * (BOARD_SIZE - 2)) + 2;
        } while (occupied.has(tile) || newChallenges.includes(tile));
        newChallenges.push(tile);
      }

      setBoardConfig({
        ladders: newLadders,
        snakes: newSnakes,
        challengeTiles: newChallenges
      });
    };

    generateRandomBoard();
  }, []);

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
      // Reset if all seen
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
      await new Promise(r => setTimeout(r, 400));
    }

    let finalPos = targetPos;

    if (boardConfig.ladders[targetPos]) {
      await new Promise(r => setTimeout(r, 1000));
      finalPos = boardConfig.ladders[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    } else if (boardConfig.snakes[targetPos]) {
      await new Promise(r => setTimeout(r, 1000));
      finalPos = boardConfig.snakes[targetPos];
      setPositions(prev => ({ ...prev, [player]: finalPos }));
    }

    if (finalPos === BOARD_SIZE) {
      setWinner(player);
    } else if (boardConfig.challengeTiles.includes(finalPos)) {
      const challenge = getUnseenChallenge();
      setActiveChallenge(challenge);
    } else {
      if (player === 2) setRound(prev => prev + 1);
      setCurrentPlayer(player === 1 ? 2 : 1);
    }
    
    setIsMoving(false);
  }, [positions, getUnseenChallenge, boardConfig]);

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
    if (currentPlayer === 2) setRound(prev => prev + 1);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
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
             <p className="text-sm font-serif text-primary">#{round}</p>
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
                  boardConfig.challengeTiles.includes(cellNum) 
                    ? 'bg-rose-500/20 border-rose-500/20 text-rose-600' 
                    : boardConfig.ladders[cellNum] 
                      ? 'bg-indigo-500/20 border-indigo-500/20 text-indigo-600'
                      : boardConfig.snakes[cellNum]
                        ? 'bg-orange-500/20 border-orange-500/20 text-orange-600'
                        : cellNum === BOARD_SIZE
                          ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10'
                          : 'bg-white/60 dark:bg-white/10 border-transparent text-outline-variant/40'
                }`}
              >
                {/* Cell Number - Top Left */}
                <span className={`absolute top-1 left-1.5 text-[8px] font-bold ${cellNum === BOARD_SIZE ? 'text-white' : 'opacity-30'}`}>{cellNum}</span>
                
                {/* Target Info - Bottom Right */}
                {(boardConfig.ladders[cellNum] || boardConfig.snakes[cellNum]) && (
                  <span className="absolute bottom-1 right-1.5 text-[6px] font-bold opacity-60">
                    TO {boardConfig.ladders[cellNum] || boardConfig.snakes[cellNum]}
                  </span>
                )}

                {/* Main Icons - CENTERED */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {boardConfig.ladders[cellNum] && <span className="material-symbols-outlined text-2xl opacity-60">north_east</span>}
                  {boardConfig.snakes[cellNum] && <span className="material-symbols-outlined text-2xl opacity-60">south_west</span>}
                  {boardConfig.challengeTiles.includes(cellNum) && <span className="material-symbols-outlined text-2xl opacity-60">favorite</span>}
                  {cellNum === BOARD_SIZE && <span className="material-symbols-outlined text-2xl animate-bounce">flag</span>}
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
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-rose-500">favorite</span>
              </div>
              <h3 className="font-serif text-2xl text-primary dark:text-[#ede0df] mb-4">Love Challenge!</h3>
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
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-none"
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
