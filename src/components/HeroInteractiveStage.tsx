import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { playMoveSound } from '../services/soundEffects';
import {
  FlipHorizontal,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  Swords,
  Shield,
} from 'lucide-react';

interface HeroInteractiveStageProps {
  isDark?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  className?: string;
}

// Param's signature Queen's Gambit into tactical attack sequence
const SIGNATURE_TACTIC_MOVES = [
  { san: 'd4', from: 'd2', to: 'd4', evalScore: '+0.2', desc: "Param's 1.d4 Queen's Pawn" },
  { san: 'Nf6', from: 'g8', to: 'f6', evalScore: '+0.2', desc: 'Indian Defense response' },
  { san: 'c4', from: 'c2', to: 'c4', evalScore: '+0.4', desc: "Queen's Gambit: White controls the flank" },
  { san: 'e6', from: 'e7', to: 'e6', evalScore: '+0.3', desc: 'Black reinforces the center' },
  { san: 'Nc3', from: 'b1', to: 'c3', evalScore: '+0.6', desc: 'Classical knight development' },
  { san: 'd5', from: 'd7', to: 'd5', evalScore: '+0.5', desc: "Queen's Gambit Declined main line" },
  { san: 'Bg5', from: 'c1', to: 'g5', evalScore: '+1.4', desc: "Param's aggressive bishop pin!", tag: 'BRILLIANT !!' },
  { san: 'Be7', from: 'f8', to: 'e7', evalScore: '+1.3', desc: 'Black attempts to unpin' },
  { san: 'e3', from: 'e2', to: 'e3', evalScore: '+1.6', desc: 'Solidifying the pawn chain' },
  { san: 'O-O', from: 'e8', to: 'g8', evalScore: '+1.5', desc: 'King castled to safety' },
  { san: 'Nf3', from: 'g1', to: 'f3', evalScore: '+1.9', desc: 'Param completes king-side development' },
  { san: 'h6', from: 'h7', to: 'h6', evalScore: '+1.8', desc: 'Challenging the bishop' },
  { san: 'h4!', from: 'h2', to: 'h4', evalScore: '+3.2', desc: "Fisher-style knight sacrifice trap!", tag: 'GREAT MOVE !' },
];

export const HeroInteractiveStage: React.FC<HeroInteractiveStageProps> = ({
  isDark = true,
  soundEnabled = true,
  onToggleSound,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'piece' | 'board'>('piece');

  /* ─────────────────────────────────────────────────────────
   * 1. 3D Piece Studio States
   * ───────────────────────────────────────────────────────── */
  const [isMirrored, setIsMirrored] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isPieceHovered, setIsPieceHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltY = ((x - centerX) / centerX) * 7;
    const tiltX = -((y - centerY) / centerY) * 6;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handlePieceClick = () => {
    if (soundEnabled) {
      playMoveSound('move');
    }
    setIsMirrored((prev) => !prev);
  };

  const pieceSrc = isDark
    ? isMirrored
      ? '/assets/knight_white.png'
      : '/assets/knight_white_right.png'
    : isMirrored
    ? '/assets/knight_black.png'
    : '/assets/knight_black_right.png';

  /* ─────────────────────────────────────────────────────────
   * 2. Interactive Tactical Mini-Board States
   * ───────────────────────────────────────────────────────── */
  const [chessInstance, setChessInstance] = useState<Chess>(() => new Chess());
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [lastMoveSquares, setLastMoveSquares] = useState<{ from?: string; to?: string }>({});
  const autoPlayTimerRef = useRef<any>(null);

  // Play a move in the sequence
  const goToStep = useCallback(
    (targetIndex: number) => {
      const freshChess = new Chess();
      let lastMove: { from?: string; to?: string } = {};

      const clamped = Math.max(-1, Math.min(targetIndex, SIGNATURE_TACTIC_MOVES.length - 1));

      for (let i = 0; i <= clamped; i++) {
        const mv = SIGNATURE_TACTIC_MOVES[i];
        try {
          const res = freshChess.move(mv.san);
          if (res) {
            lastMove = { from: res.from, to: res.to };
          }
        } catch {
          // Ignore parse errors
        }
      }

      setChessInstance(freshChess);
      setStepIndex(clamped);
      setLastMoveSquares(lastMove);

      if (soundEnabled && clamped >= 0) {
        const curMove = SIGNATURE_TACTIC_MOVES[clamped];
        if (curMove?.san.includes('#')) {
          playMoveSound('check');
        } else if (curMove?.san.includes('+') || curMove?.tag) {
          playMoveSound('capture');
        } else {
          playMoveSound('move');
        }
      }
    },
    [soundEnabled],
  );

  const nextMove = useCallback(() => {
    if (stepIndex < SIGNATURE_TACTIC_MOVES.length - 1) {
      goToStep(stepIndex + 1);
    } else {
      setIsAutoPlaying(false);
    }
  }, [stepIndex, goToStep]);

  const prevMove = useCallback(() => {
    if (stepIndex >= 0) {
      goToStep(stepIndex - 1);
    }
  }, [stepIndex, goToStep]);

  const resetBoard = useCallback(() => {
    setIsAutoPlaying(false);
    goToStep(-1);
  }, [goToStep]);

  // Auto-play loop
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setStepIndex((cur) => {
          if (cur < SIGNATURE_TACTIC_MOVES.length - 1) {
            goToStep(cur + 1);
            return cur + 1;
          } else {
            setIsAutoPlaying(false);
            return cur;
          }
        });
      }, 1500);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, goToStep]);

  // Current engine evaluation calculation
  const currentMoveInfo = stepIndex >= 0 ? SIGNATURE_TACTIC_MOVES[stepIndex] : null;
  const evalScoreText = currentMoveInfo?.evalScore || '+0.2';
  // Eval bar percentage: +0.0 = 50%, +3.0 = 85%, +M3 = 98%
  const evalBarPercent = stepIndex < 0 ? 52 : Math.min(95, 52 + (stepIndex + 1) * 3.5);

  const boardArray = chessInstance.board();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{
        width: '100%',
        maxWidth: 440,
        minHeight: 520,
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
         MODE SWITCHER TABS (Minimalist Pill Header)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full flex items-center justify-between mb-3 px-2 z-30">
        <div
          className="inline-flex items-center p-1 rounded-full border shadow-xs backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <button
            onClick={() => setActiveTab('piece')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'piece'
                ? 'bg-[#81b64c] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Piece Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'board'
                ? 'bg-[#81b64c] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Tactical Engine</span>
          </button>
        </div>

        {/* Audio Sound FX Toggle */}
        {onToggleSound && (
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-bold transition-colors cursor-pointer text-zinc-400 hover:text-white"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
            title={soundEnabled ? 'Mute Wooden Piece Sounds' : 'Enable Wooden Piece Sounds'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#81b64c]" />
                <span className="hidden sm:inline">SFX</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         PANEL 1: 3D PIECE STUDIO
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'piece' && (
        <div
          onMouseEnter={() => setIsPieceHovered(true)}
          onMouseLeave={() => {
            setIsPieceHovered(false);
            setTilt({ x: 0, y: 0 });
          }}
          className="relative w-full h-[460px] flex flex-col items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
            perspective: 1200,
          }}
        >
          {/* Ambient Studio Lighting Aura */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-20">
            {isDark ? (
              <>
                <div className="w-80 h-80 rounded-full bg-[#81b64c]/20 blur-3xl animate-pedestal-glow" />
                <div className="absolute w-64 h-64 rounded-full bg-emerald-500/15 blur-2xl -translate-y-6" />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 65%, rgba(129, 182, 76, 0.4) 0%, transparent 65%)',
                  }}
                />
              </>
            ) : (
              <>
                <div className="w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-pedestal-glow" />
                <div className="absolute w-64 h-64 rounded-full bg-amber-200/30 blur-2xl -translate-y-4" />
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 65%, rgba(217, 182, 138, 0.5) 0%, transparent 65%)',
                  }}
                />
              </>
            )}
          </div>

          {/* Ambient Motes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div
              className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full animate-ping opacity-60"
              style={{ backgroundColor: isDark ? '#81b64c' : '#d4a373' }}
            />
            <div
              className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full animate-pulse opacity-45"
              style={{ backgroundColor: isDark ? '#93cb58' : '#e6be8a' }}
            />
            <div
              className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full animate-bounce opacity-40"
              style={{ backgroundColor: isDark ? '#81b64c' : '#cca36e' }}
            />
          </div>

          {/* The Knight Piece with Levitation & Clickable Interaction */}
          <div
            onClick={handlePieceClick}
            className="relative z-10 animate-knight-hover flex items-center justify-center cursor-pointer transition-transform duration-300 group"
            style={{
              transformStyle: 'preserve-3d',
              transform: isPieceHovered ? 'scale(1.04)' : 'scale(1)',
            }}
            title="Click to flip orientation with wooden piece sound"
          >
            {/* Studio Cutout Piece */}
            <img
              src={pieceSrc}
              alt="Param's Knight"
              draggable={false}
              className="w-64 h-auto max-h-[380px] object-contain drop-shadow-2xl transition-all duration-300"
              style={{
                filter: isDark
                  ? 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 25px rgba(129, 182, 76, 0.25))'
                  : 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 15px rgba(180, 140, 100, 0.18))',
              }}
            />

            {/* Specular Light Gleam Sweep */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
              style={{ mixBlendMode: 'overlay' }}
            >
              <div
                className="w-full h-full animate-gleam-sweep opacity-70"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.8) 55%, transparent 80%)',
                }}
              />
            </div>
          </div>

          {/* Ground Contact Shadow */}
          <div className="relative -mt-6 z-0 flex items-center justify-center">
            <div
              className="w-48 h-10 rounded-full animate-shadow-pulse pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.45) 55%, transparent 75%)'
                  : 'radial-gradient(ellipse at center, rgba(40, 25, 15, 0.55) 0%, rgba(60, 40, 25, 0.25) 55%, transparent 75%)',
              }}
            />
          </div>

          {/* Circular Pedestal Dais */}
          <div className="relative mt-2 z-0 flex flex-col items-center pointer-events-none">
            <div
              className="w-60 max-w-[85vw] h-8 rounded-full border shadow-lg flex items-center justify-center relative overflow-hidden transition-colors"
              style={{
                backgroundColor: isDark ? '#1a1d17' : '#faf9f6',
                borderColor: isDark ? 'rgba(129, 182, 76, 0.4)' : 'rgba(217, 182, 138, 0.5)',
                boxShadow: isDark
                  ? '0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.05), 0 0 16px rgba(129, 182, 76, 0.2)'
                  : '0 8px 20px -4px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 0 12px rgba(217, 182, 138, 0.3)',
              }}
            >
              <div
                className="w-52 max-w-[75vw] h-5 rounded-full border opacity-50"
                style={{ borderColor: isDark ? '#81b64c' : '#cca36e' }}
              />
            </div>
            <div
              className="w-72 max-w-[92vw] h-3 -mt-2 rounded-full border -z-10 opacity-80"
              style={{
                backgroundColor: isDark ? '#131510' : '#ece7de',
                borderColor: isDark ? '#262d20' : '#dcd2c4',
              }}
            />
          </div>

          {/* Discreet Flip Button */}
          <div
            className="absolute bottom-1 z-30 flex items-center p-1 rounded-full border shadow-md backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              onClick={handlePieceClick}
              className="p-1.5 rounded-full hover:bg-[#81b64c]/20 hover:text-[#81b64c] transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Mirror orientation"
              title="Flip piece orientation"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         PANEL 2: INTERACTIVE TACTICAL ENGINE MINI-BOARD
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'board' && (
        <div
          className="w-full rounded-2xl border p-4 shadow-xl backdrop-blur-md flex flex-col gap-3 animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Header Bar: Tactic Name + Engine Eval Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Queen's Gambit Attack
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 text-[11px] font-mono">
              <Bot className="w-3 h-3 text-[#81b64c]" />
              <span className="text-zinc-400">Eval:</span>
              <span className="font-bold text-[#81b64c]">{evalScoreText}</span>
            </div>
          </div>

          {/* Board + Evaluation Bar Container */}
          <div className="flex items-stretch gap-2.5">
            {/* Live Vertical Stockfish Eval Bar */}
            <div className="w-2.5 rounded-full bg-zinc-800 overflow-hidden flex flex-col-reverse border border-zinc-700 relative">
              <div
                className="w-full bg-[#81b64c] transition-all duration-500 ease-out"
                style={{ height: `${evalBarPercent}%` }}
              />
            </div>

            {/* 8x8 Chessboard Grid */}
            <div
              className="flex-1 aspect-square rounded-xl overflow-hidden border grid grid-cols-8 grid-rows-8 shadow-inner relative"
              style={{
                borderColor: 'var(--border-color)',
              }}
            >
              {boardArray.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isLight = (rIdx + cIdx) % 2 === 0;
                  const squareName = `${String.fromCharCode(97 + cIdx)}${8 - rIdx}`;
                  const isLastMove =
                    lastMoveSquares.from === squareName || lastMoveSquares.to === squareName;

                  return (
                    <div
                      key={squareName}
                      className="relative flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isLastMove
                          ? isLight
                            ? 'rgba(129, 182, 76, 0.45)'
                            : 'rgba(129, 182, 76, 0.65)'
                          : isLight
                          ? '#eeeed2'
                          : '#769656',
                      }}
                    >
                      {/* Piece Icon */}
                      {cell && (
                        <img
                          src={`/assets/pieces/bases/${cell.color}${cell.type.toLowerCase()}.png`}
                          alt={`${cell.color} ${cell.type}`}
                          draggable={false}
                          className="w-[82%] h-[82%] object-contain select-none pointer-events-none drop-shadow-xs"
                        />
                      )}

                      {/* Rank & File corner notation */}
                      {cIdx === 0 && (
                        <span
                          className="absolute top-0.5 left-0.5 text-[8px] font-bold leading-none pointer-events-none select-none"
                          style={{
                            color: isLight ? '#769656' : '#eeeed2',
                          }}
                        >
                          {8 - rIdx}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span
                          className="absolute bottom-0.5 right-0.5 text-[8px] font-bold leading-none pointer-events-none select-none"
                          style={{
                            color: isLight ? '#769656' : '#eeeed2',
                          }}
                        >
                          {String.fromCharCode(97 + cIdx)}
                        </span>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Move Description & Tag Pill */}
          <div
            className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
            style={{
              backgroundColor: 'var(--bg-card-sub)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono font-bold text-[#81b64c]">
                {stepIndex >= 0 ? `${stepIndex + 1}. ${currentMoveInfo?.san}` : 'Start'}
              </span>
              <span className="text-zinc-400 truncate">
                {currentMoveInfo?.desc || "Press 'Play Move' to step through Param's tactic"}
              </span>
            </div>

            {currentMoveInfo?.tag && (
              <span className="px-2 py-0.5 rounded-full bg-[#81b64c] text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs animate-bounce">
                {currentMoveInfo.tag}
              </span>
            )}
          </div>

          {/* Playback Controls Strip */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={resetBoard}
                className="p-2 rounded-xl border hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
                title="Reset to Starting Position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={prevMove}
                disabled={stepIndex < 0}
                className="p-2 rounded-xl border hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
                title="Previous Move"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={nextMove}
                disabled={stepIndex >= SIGNATURE_TACTIC_MOVES.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#81b64c] hover:bg-[#93cb58] text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                title="Play Next Move"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isAutoPlaying
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'hover:bg-zinc-800 text-zinc-300'
                }`}
                style={{ borderColor: isAutoPlaying ? undefined : 'var(--border-color)' }}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

