import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessGame } from '../types/chess';
import { playMoveSound } from '../services/soundEffects';
import AnimatedSection from './AnimatedSection';
import { KineticMatchupModal } from './KineticMatchupModal';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Swords,
  Clock,
  Sparkles,
  Bot,
  Undo2,
  Gamepad2,
  Tv,
} from 'lucide-react';

interface InteractiveBoardProps {
  games: ChessGame[];
  currentUsername: string;
}

import REAL_PARAM_GAMES_DATA from '../data/param_real_games.json';

const REAL_PARAM_GAMES: ChessGame[] = REAL_PARAM_GAMES_DATA.map((g: any) => ({
  url: g.url,
  pgn: g.pgn,
  time_control: g.time_control,
  end_time: g.end_time,
  rated: g.rated,
  fen: g.fen,
  time_class: g.time_class,
  rules: g.rules,
  white: {
    username: g.white.username,
    rating: g.white.rating,
    result: g.white.result,
    avatar: g.white.username.toLowerCase() === 'pa_ra-m' ? 'https://images.chesscomfiles.com/uploads/v1/user/278787867.c2de0abe.200x200o.786f9846b38d.jpg' : undefined,
  },
  black: {
    username: g.black.username,
    rating: g.black.rating,
    result: g.black.result,
    avatar: g.black.username.toLowerCase() === 'pa_ra-m' ? 'https://images.chesscomfiles.com/uploads/v1/user/278787867.c2de0abe.200x200o.786f9846b38d.jpg' : undefined,
  },
  eco: typeof g.eco === 'string' && g.eco.startsWith('http') ? g.eco.split('/').pop()?.replace(/-/g, ' ') || 'A00' : (g.eco || 'A00'),
  openingName: typeof g.eco === 'string' && g.eco.startsWith('http') ? g.eco.split('/').pop()?.replace(/-/g, ' ') || 'Chess Opening' : 'Chess Opening',
}));

// Default to Param's all-time peak 1152 victory against Ajith_chandolu
const DEFAULT_PARAM_GAME: ChessGame = REAL_PARAM_GAMES[2] || REAL_PARAM_GAMES[0];


interface ChessPieceRendererProps {
  piece: { type: string; color: 'w' | 'b' };
  isMoved?: boolean;
  isSelected?: boolean;
  theme?: string;
}

const ChessPieceRenderer: React.FC<ChessPieceRendererProps> = ({
  piece,
  isMoved,
  isSelected,
  theme = 'bases',
}) => {
  const isWhite = piece.color === 'w';
  const pieceCode = `${piece.color}${piece.type.toLowerCase()}`;
  const pieceImgSrc = `/assets/pieces/${theme}/${pieceCode}.png`;

  return (
    <div
      className={`w-full h-full flex items-center justify-center select-none transform transition-transform duration-150 ${
        isSelected
          ? 'scale-115 -translate-y-1 z-20'
          : 'hover:scale-108 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
      } ${isMoved ? 'animate-piece-drop' : ''}`}
    >
      <img
        src={pieceImgSrc}
        alt={`${isWhite ? 'White' : 'Black'} ${piece.type}`}
        draggable={false}
        className="w-[88%] h-[88%] object-contain pointer-events-none select-none transition-all duration-150"
        style={{
          filter: isWhite
            ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.32))'
            : 'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 1px rgba(255,255,255,0.7))',
        }}
      />
    </div>
  );
};

export const InteractiveBoard: React.FC<InteractiveBoardProps> = ({ games, currentUsername }) => {
  const gameList = games.length > 0 ? games : REAL_PARAM_GAMES;
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const activeGame = gameList[selectedGameIndex] || DEFAULT_PARAM_GAME;

  // Board engine & game replay states
  const [chessInstance, setChessInstance] = useState<Chess>(() => new Chess());
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
  const [boardFlipped, setBoardFlipped] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // High Interactivity & Free Play States
  const [boardMode, setBoardMode] = useState<'replay' | 'freeplay'>('replay');
  const [pieceTheme, setPieceTheme] = useState<'bases' | 'neo' | 'classic'>('bases');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<{ to: string; captured?: string }[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const [matchupModalOpen, setMatchupModalOpen] = useState(false);

  const movesContainerRef = useRef<HTMLDivElement>(null);
  const playTimerRef = useRef<any>(null);

  // Initialize game from PGN
  useEffect(() => {
    try {
      const chess = new Chess();
      if (activeGame.pgn) {
        chess.loadPgn(activeGame.pgn);
      }
      const history = chess.history({ verbose: true });
      setMoveHistory(history);

      const freshChess = new Chess();
      setChessInstance(freshChess);
      setCurrentMoveIndex(-1);
      setIsPlaying(false);
      setSelectedSquare(null);
      setLegalMoves([]);
      setBoardMode('replay');

      if (activeGame.black.username.toLowerCase() === currentUsername.toLowerCase()) {
        setBoardFlipped(true);
      } else {
        setBoardFlipped(false);
      }
    } catch (err) {
      console.warn('Could not load PGN', err);
    }
  }, [selectedGameIndex, activeGame, currentUsername]);

  const goToMove = (index: number) => {
    const freshChess = new Chess();
    for (let i = 0; i <= index; i++) {
      if (moveHistory[i]) {
        freshChess.move(moveHistory[i].san);
      }
    }
    setChessInstance(freshChess);
    setCurrentMoveIndex(index);
    setSelectedSquare(null);
    setLegalMoves([]);

    if (soundEnabled && index >= 0) {
      const lastMove = moveHistory[index];
      if (freshChess.inCheck()) {
        playMoveSound('check');
      } else if (lastMove?.captured) {
        playMoveSound('capture');
      } else {
        playMoveSound('move');
      }
    }
  };

  const stepForward = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      goToMove(currentMoveIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const stepBackward = () => {
    if (currentMoveIndex > -1) {
      goToMove(currentMoveIndex - 1);
    }
  };

  const goToStart = () => {
    setIsPlaying(false);
    goToMove(-1);
  };

  const goToEnd = () => {
    setIsPlaying(false);
    goToMove(moveHistory.length - 1);
  };

  // Autoplay loop
  useEffect(() => {
    if (isPlaying && boardMode === 'replay') {
      playTimerRef.current = setInterval(() => {
        setCurrentMoveIndex((prev) => {
          if (prev < moveHistory.length - 1) {
            const nextIdx = prev + 1;
            const freshChess = new Chess();
            for (let i = 0; i <= nextIdx; i++) {
              if (moveHistory[i]) {
                freshChess.move(moveHistory[i].san);
              }
            }
            setChessInstance(freshChess);
            if (soundEnabled) {
              const mv = moveHistory[nextIdx];
              if (freshChess.inCheck()) playMoveSound('check');
              else if (mv?.captured) playMoveSound('capture');
              else playMoveSound('move');
            }
            return nextIdx;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 950);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, moveHistory, soundEnabled, boardMode]);

  // Auto-scroll moves container
  useEffect(() => {
    if (movesContainerRef.current && currentMoveIndex >= 0) {
      const activeEl = movesContainerRef.current.querySelector(
        `[data-move-index="${currentMoveIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentMoveIndex]);

  // INTERACTIVE CLICK & MOVE ENGINE
  const handleSquareClick = (squareCoord: Square) => {
    const squarePiece = chessInstance.get(squareCoord);

    // If already selected and clicking a valid destination
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === squareCoord);

      if (isLegal) {
        // Execute the move
        makeInteractiveMove(selectedSquare, squareCoord);
        return;
      }

      // If clicking another piece of current turn's color, switch selection
      if (squarePiece && squarePiece.color === chessInstance.turn()) {
        selectPiece(squareCoord);
        return;
      }

      // Deselect if clicking anywhere else
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // No piece currently selected: select if piece exists and matches turn (or in freeplay)
    if (squarePiece) {
      selectPiece(squareCoord);
    }
  };

  const selectPiece = (squareCoord: Square) => {
    setSelectedSquare(squareCoord);
    try {
      const moves = chessInstance.moves({ square: squareCoord, verbose: true });
      setLegalMoves(moves.map((m) => ({ to: m.to, captured: m.captured })));
    } catch {
      setLegalMoves([]);
    }
  };

  const makeInteractiveMove = (from: Square, to: Square) => {
    try {
      const moveResult = chessInstance.move({ from, to, promotion: 'q' });
      if (!moveResult) return;

      // Switch to freeplay mode automatically so user can continue exploring
      setBoardMode('freeplay');
      setSelectedSquare(null);
      setLegalMoves([]);

      // Play Sound
      if (soundEnabled) {
        if (chessInstance.inCheck()) playMoveSound('check');
        else if (moveResult.captured) playMoveSound('capture');
        else playMoveSound('move');
      }

      // Append interactive move to history
      const newHistory = [...moveHistory.slice(0, currentMoveIndex + 1), moveResult];
      setMoveHistory(newHistory);
      setCurrentMoveIndex(newHistory.length - 1);
    } catch (err) {
      console.warn('Illegal move', err);
    }
  };

  // Bot Countermove Generator (Play against Param's Board!)
  const handleBotMove = () => {
    if (chessInstance.isGameOver()) return;
    const moves = chessInstance.moves({ verbose: true });
    if (moves.length === 0) return;

    // Pick a good move (prefers captures / checks, else random)
    const tacticalMoves = moves.filter((m) => m.captured || chessInstance.inCheck());
    const chosen = tacticalMoves.length > 0
      ? tacticalMoves[Math.floor(Math.random() * tacticalMoves.length)]
      : moves[Math.floor(Math.random() * moves.length)];

    makeInteractiveMove(chosen.from, chosen.to);
  };

  // Undo Last Interactive Move
  const handleUndo = () => {
    if (currentMoveIndex < 0) return;
    stepBackward();
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, squareCoord: Square) => {
    const piece = chessInstance.get(squareCoord);
    if (!piece) return;
    setDraggedSquare(squareCoord);
    selectPiece(squareCoord);
    e.dataTransfer.setData('text/plain', squareCoord);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (!draggedSquare) return;
    const isLegal = legalMoves.some((m) => m.to === targetSquare);
    if (isLegal) {
      makeInteractiveMove(draggedSquare, targetSquare);
    }
    setDraggedSquare(null);
  };

  const ranks = boardFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = boardFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const lastMove = currentMoveIndex >= 0 ? moveHistory[currentMoveIndex] : null;
  const isCheck = chessInstance.inCheck();
  const currentTurn = chessInstance.turn();

  return (
    <section
      id="replay"
      className="py-20 relative transition-colors"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <AnimatedSection animation="fadeDown" delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs hover-lift transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <Swords className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Param&apos;s Interactive Replay & Play Arena</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Interactive Game Replay & Analysis
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <p
              className="text-base max-w-2xl font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Click or drag any piece to play legal moves, explore variations, test tactics against a bot, 
              or step through Param&apos;s real tournament matches.
            </p>
          </AnimatedSection>

          {/* Interactive Mode Tabs (Replay vs Free Play) */}
          <AnimatedSection animation="fadeUp" delay={250}>
            <div
              className="flex items-center p-1.5 rounded-2xl border mt-3 shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                onClick={() => setBoardMode('replay')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: boardMode === 'replay' ? 'var(--bg-card)' : 'transparent',
                  color: boardMode === 'replay' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: boardMode === 'replay' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Tv className="w-4 h-4" />
                <span>Archive Replay</span>
              </button>

              <button
                onClick={() => setBoardMode('freeplay')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: boardMode === 'freeplay' ? 'var(--bg-card)' : 'transparent',
                  color: boardMode === 'freeplay' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: boardMode === 'freeplay' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Interactive Free Play & Tactics</span>
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Game Selector Bar */}
        <AnimatedSection animation="fadeDown" delay={280}>
          <div
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border shadow-xs mb-8 hover-glow-border transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Tournament Match
                </span>
                <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Match #{selectedGameIndex + 1}: vs {activeGame.white.username === 'Pa_ra-m' ? activeGame.black.username : activeGame.white.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMatchupModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#81b64c] hover:bg-[#81b64c]/10 border border-[#81b64c]/40"
                title="Watch Chess.com Kinetic Matchup Clash"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Kinetic Match Card</span>
              </button>

              <span className="text-xs font-bold hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
                Select Match:
              </span>
              <select
                value={selectedGameIndex}
                onChange={(e) => setSelectedGameIndex(Number(e.target.value))}
                aria-label="Select Match"
                className="px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {gameList.map((g, idx) => (
                  <option key={idx} value={idx}>
                    #{idx + 1} - vs {g.white.username.toLowerCase() === currentUsername.toLowerCase() ? g.black.username : g.white.username} ({g.time_class || 'game'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AnimatedSection>

        {/* 3-Column Arena Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Move History Table & Controls (Order 2 on mobile, Order 1 on desktop) */}
          <AnimatedSection animation="fadeLeft" delay={300} className="order-2 lg:order-1 lg:col-span-3 w-full">
            <div
              className="rounded-3xl border p-5 shadow-sm flex flex-col h-[320px] sm:h-[420px] lg:h-[580px] hover-glow-border transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    Notation List
                  </span>
                  <span className="text-[11px] font-medium truncate max-w-[150px]" style={{ color: 'var(--text-muted)' }}>
                    {activeGame.openingName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-extrabold" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                  {activeGame.eco}
                </span>
              </div>

              {/* Status Banner */}
              <div
                className="flex items-center justify-between text-[11px] font-bold p-2 px-3 rounded-xl mb-2"
                style={{ backgroundColor: 'var(--bg-card-sub)', color: 'var(--text-secondary)' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${currentTurn === 'w' ? 'bg-white border border-zinc-400' : 'bg-zinc-900'}`} />
                  <span>{currentTurn === 'w' ? 'White to move' : 'Black to move'}</span>
                </div>
                {isCheck && (
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase animate-pulse">
                    CHECK!
                  </span>
                )}
              </div>

              {/* Scrollable Move History */}
              <div
                ref={movesContainerRef}
                className="flex-1 overflow-y-auto pr-1 space-y-1 text-xs font-mono"
              >
                {moveHistory.length === 0 ? (
                  <div className="text-center py-12 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Click any piece to start playing moves!
                  </div>
                ) : (
                  Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, rowIdx) => {
                    const whiteIdx = rowIdx * 2;
                    const blackIdx = rowIdx * 2 + 1;
                    const whiteMove = moveHistory[whiteIdx];
                    const blackMove = moveHistory[blackIdx];

                    return (
                      <div
                        key={rowIdx}
                        className="grid grid-cols-12 gap-1 py-1 px-2 rounded-lg items-center transition-colors"
                      >
                        <span className="col-span-3 font-semibold text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {rowIdx + 1}.
                        </span>
                        
                        <button
                          onClick={() => goToMove(whiteIdx)}
                          data-move-index={whiteIdx}
                          className={`col-span-4 text-left py-1 px-1.5 rounded-md transition-all font-bold cursor-pointer ${
                            currentMoveIndex === whiteIdx
                              ? 'bg-[#81b64c] text-white shadow-xs scale-105'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          style={{
                            color: currentMoveIndex === whiteIdx ? '#ffffff' : 'var(--text-primary)',
                          }}
                        >
                          {whiteMove ? whiteMove.san : ''}
                        </button>

                        {blackMove ? (
                          <button
                            onClick={() => goToMove(blackIdx)}
                            data-move-index={blackIdx}
                            className={`col-span-4 text-left py-1 px-1.5 rounded-md transition-all font-bold cursor-pointer ${
                              currentMoveIndex === blackIdx
                                ? 'bg-[#81b64c] text-white shadow-xs scale-105'
                                : 'hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                            style={{
                              color: currentMoveIndex === blackIdx ? '#ffffff' : 'var(--text-primary)',
                            }}
                          >
                            {blackMove.san}
                          </button>
                        ) : (
                          <span className="col-span-4" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Buttons: Freeplay Bot & Undo */}
              <div className="pt-2 pb-1 border-t flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={handleBotMove}
                  className="flex-1 py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all hover-lift press-scale cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  title="Make an instant bot countermove"
                >
                  <Bot className="w-3.5 h-3.5 text-[#81b64c]" />
                  <span>Bot Move</span>
                </button>

                <button
                  onClick={handleUndo}
                  disabled={currentMoveIndex < 0}
                  className="p-2 rounded-xl border text-[11px] font-bold disabled:opacity-30 transition-all hover-lift press-scale cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  title="Undo last move"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Controls Bar */}
              <div className="pt-2 flex items-center justify-between gap-1">
                <button
                  onClick={goToStart}
                  disabled={currentMoveIndex <= -1}
                  className="p-2 rounded-xl disabled:opacity-30 transition-all press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  title="First move"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={stepBackward}
                  disabled={currentMoveIndex <= -1}
                  className="p-2 rounded-xl disabled:opacity-30 transition-all press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  title="Previous move"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-xs transition-all press-scale hover-shine cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                      : 'bg-[#81b64c] hover:bg-[#6f9444] text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
                </button>

                <button
                  onClick={stepForward}
                  disabled={currentMoveIndex >= moveHistory.length - 1}
                  className="p-2 rounded-xl disabled:opacity-30 transition-all press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  title="Next move"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={goToEnd}
                  disabled={currentMoveIndex >= moveHistory.length - 1}
                  className="p-2 rounded-xl disabled:opacity-30 transition-all press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  title="Last move"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* CENTER COLUMN: The Interactive Chessboard (Order 1 on mobile, Order 2 on desktop) */}
          <AnimatedSection animation="fadeUp" delay={200} className="order-1 lg:order-2 lg:col-span-6 w-full flex flex-col items-center">
            
            {/* Top Opponent Bar */}
            <div className="w-full max-w-[500px] flex items-center justify-between pb-2 px-1 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-xs ${boardFlipped ? 'bg-white border border-zinc-400' : 'bg-black'}`} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {boardFlipped ? activeGame.white.username : activeGame.black.username}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  ({boardFlipped ? activeGame.white.rating : activeGame.black.rating})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Piece Theme Switcher */}
                <div
                  className="flex items-center gap-1 p-0.5 rounded-lg border shadow-2xs"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <button
                    onClick={() => setPieceTheme('bases')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer ${
                      pieceTheme === 'bases'
                        ? 'bg-[#81b64c] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      color: pieceTheme === 'bases' ? '#ffffff' : 'var(--text-secondary)',
                    }}
                    title="Exact piece set from the screenshot"
                  >
                    Bases
                  </button>
                  <button
                    onClick={() => setPieceTheme('neo')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer ${
                      pieceTheme === 'neo'
                        ? 'bg-[#81b64c] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      color: pieceTheme === 'neo' ? '#ffffff' : 'var(--text-secondary)',
                    }}
                    title="Chess.com Neo piece set"
                  >
                    Neo
                  </button>
                  <button
                    onClick={() => setPieceTheme('classic')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer ${
                      pieceTheme === 'classic'
                        ? 'bg-[#81b64c] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      color: pieceTheme === 'classic' ? '#ffffff' : 'var(--text-secondary)',
                    }}
                    title="Staunton Classic piece set"
                  >
                    Classic
                  </button>
                </div>

                <button
                  onClick={() => setBoardFlipped(!boardFlipped)}
                  className="p-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Flip board orientation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Flip</span>
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg transition-all press-scale hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Toggle move sounds"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#81b64c]" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
                </button>
              </div>
            </div>

            {/* Chessboard Box */}
            <div
              className={`w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 transition-all duration-300 bg-[#252822] select-none ${
                isPlaying ? 'border-[#81b64c] shadow-[#81b64c]/20' : 'border-[#2e3328]'
              }`}
            >
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {ranks.map((rankNum, rIdx) => {
                  return files.map((fileChar, fIdx) => {
                    const squareCoord = `${fileChar}${rankNum}` as Square;
                    const isLightSquare = (fIdx + rIdx) % 2 === 0;
                    const baseSquareColor = isLightSquare ? '#eceecc' : '#739552';

                    // Selection & Legal move states
                    const isSelected = selectedSquare === squareCoord;
                    const isLegalTarget = legalMoves.some((m) => m.to === squareCoord);
                    const targetMove = legalMoves.find((m) => m.to === squareCoord);
                    const isCaptureTarget = isLegalTarget && targetMove?.captured;

                    // Last move highlight
                    const isLastMoveSquare =
                      lastMove && (lastMove.from === squareCoord || lastMove.to === squareCoord);

                    const fileIndex = fileChar.charCodeAt(0) - 'a'.charCodeAt(0);
                    const rankIndex = 8 - rankNum;
                    const piece = chessInstance.board()[rankIndex][fileIndex];
                    const isDestination = lastMove && lastMove.to === squareCoord;
                    const isKingInCheck = isCheck && piece && piece.type === 'k' && piece.color === currentTurn;

                    return (
                      <div
                        key={squareCoord}
                        onClick={() => handleSquareClick(squareCoord)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, squareCoord)}
                        draggable={!!piece}
                        onDragStart={(e) => handleDragStart(e, squareCoord)}
                        className={`relative flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          isSelected ? 'ring-4 ring-[#81b64c] z-10' : ''
                        } ${isKingInCheck ? 'bg-rose-500/70 animate-pulse' : ''}`}
                        style={{
                          backgroundColor: isSelected
                            ? '#b9ca43'
                            : isLastMoveSquare
                            ? isLightSquare
                              ? '#f5f682'
                              : '#b9ca43'
                            : baseSquareColor,
                        }}
                      >
                        {/* Chess Piece Rendering */}
                        {piece && (
                          <ChessPieceRenderer
                            piece={piece}
                            isMoved={isDestination}
                            isSelected={isSelected}
                            theme={pieceTheme}
                          />
                        )}

                        {/* Legal Move Dot for Empty Squares */}
                        {isLegalTarget && !piece && (
                          <div className="absolute w-4 h-4 rounded-full bg-black/25 dark:bg-black/35 pointer-events-none transform scale-90 animate-pulse" />
                        )}

                        {/* Legal Move Target Ring for Captures */}
                        {isCaptureTarget && (
                          <div className="absolute inset-1 rounded-full border-4 border-rose-500/70 dark:border-rose-400/80 pointer-events-none animate-ping" />
                        )}

                        {/* Coordinate Labels */}
                        {rIdx === 7 && (
                          <span
                            className="absolute bottom-0.5 right-1 text-[10px] font-black select-none leading-none pointer-events-none"
                            style={{ color: isLightSquare ? '#739552' : '#eceecc' }}
                          >
                            {fileChar}
                          </span>
                        )}
                        {fIdx === 0 && (
                          <span
                            className="absolute top-0.5 left-1 text-[10px] font-black select-none leading-none pointer-events-none"
                            style={{ color: isLightSquare ? '#739552' : '#eceecc' }}
                          >
                            {rankNum}
                          </span>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>

            {/* Bottom Player Bar */}
            <div className="w-full max-w-[500px] flex items-center justify-between pt-2 px-1 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-xs ${boardFlipped ? 'bg-black' : 'bg-white border border-zinc-400'}`} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {boardFlipped ? activeGame.black.username : activeGame.white.username}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  ({boardFlipped ? activeGame.black.rating : activeGame.white.rating})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(Number(activeGame.time_control) / 60) || 10} min ({activeGame.time_class})
                </span>
              </div>
            </div>

          </AnimatedSection>

          {/* RIGHT COLUMN: Match Details Card & Interactive Help (Order 3) */}
          <AnimatedSection animation="fadeRight" delay={300} className="order-3 lg:order-3 lg:col-span-3 w-full">
            <div
              className="rounded-3xl border p-6 shadow-sm flex flex-col space-y-6 hover-glow-border transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Match Summary
                </span>
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                  {activeGame.time_class}
                </span>
              </div>

              {/* Players Comparison */}
              <div className="space-y-4">
                
                {/* White Player */}
                <div
                  className="flex items-center justify-between p-3 rounded-2xl border hover-lift transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center font-bold text-sm shadow-2xs">
                      ♔
                    </div>
                    <div>
                      <span className="text-sm font-extrabold block leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {activeGame.white.username}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        Elo {activeGame.white.rating}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                    activeGame.white.result === 'win'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {activeGame.white.result.toUpperCase()}
                  </span>
                </div>

                {/* Black Player */}
                <div
                  className="flex items-center justify-between p-3 rounded-2xl border hover-lift transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                      ♚
                    </div>
                    <div>
                      <span className="text-sm font-extrabold block leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {activeGame.black.username}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        Elo {activeGame.black.rating}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                    activeGame.black.result === 'win'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {activeGame.black.result.toUpperCase()}
                  </span>
                </div>

              </div>

              {/* Opening & ECO Info */}
              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Opening System
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                    {activeGame.openingName}
                  </span>
                  <span className="text-xs font-bold text-[#81b64c]">
                    [{activeGame.eco}]
                  </span>
                </div>
              </div>

              {/* View on Chess.com Link */}
              <a
                href={activeGame.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl text-white font-extrabold text-xs text-center flex items-center justify-center gap-2 shadow-xs transition-all hover-lift hover-shine press-scale"
                style={{ backgroundColor: 'var(--accent-green)' }}
              >
                <span>Analyze on Chess.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>
          </AnimatedSection>

        </div>

      </div>

      {/* Chess.com Kinetic Title Card Matchup Modal */}
      <KineticMatchupModal
        isOpen={matchupModalOpen}
        onClose={() => setMatchupModalOpen(false)}
        homeTeam={activeGame.white.username}
        awayTeam={activeGame.black.username}
        homeRating={activeGame.white.rating}
        awayRating={activeGame.black.rating}
        timeControl={`${activeGame.time_class?.toUpperCase() || 'RAPID'} BATTLE`}
      />
    </section>
  );
};
