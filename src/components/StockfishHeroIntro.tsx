import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, Play, RotateCcw, X, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StockfishHeroIntroProps {
  onComplete?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const STOCKFISH_LINES = [
  'Stockfish 16.1 AVX2 (Param Neural Network Engine v2.4)',
  'uci',
  'id name Stockfish 16.1-x86_64-modern',
  'id author The Stockfish Developers (forked by @Pa_ra-m)',
  'option name Threads type spin default 8 min 1 max 512',
  'option name Hash type spin default 2048 min 1 max 33554432',
  'uciok',
  'ucinewgame',
  'position startpos moves e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 d2d3 f8c5',
  'go depth 28',
  'info depth 10 seldepth 14 multipv 1 score cp 35 nodes 24810 nps 820120 time 30 pv e2e4 e7e5',
  'info depth 18 seldepth 22 multipv 1 score cp 145 nodes 849021 nps 1420911 time 598 pv e2e4 c7c5 g1f3 d7d6',
  'info depth 24 seldepth 30 multipv 1 score cp 480 nodes 3120980 nps 2109420 time 1480 pv d1h5 g7g6 h5e5 e8f7',
  'info depth 28 seldepth 36 multipv 1 score mate 3 nodes 8941029 nps 2840120 time 2140 pv d1h5+ g7g6 h5e5+ e8f7 e5e6#',
  'bestmove d1h5 ponder g7g6',
];

export const StockfishHeroIntro: React.FC<StockfishHeroIntroProps> = ({
  onComplete,
  isOpen,
  onClose,
}) => {
  const [phase, setPhase] = useState<'terminal' | 'slam' | 'settled'>('terminal');
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [evalHeight, setEvalHeight] = useState(50); // 50% neutral -> 98% in White's favor
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Phase 1: Terminal typing animation
  useEffect(() => {
    if (!isOpen) return;
    setPhase('terminal');
    setTypedLines([]);
    setEvalHeight(50);

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < STOCKFISH_LINES.length) {
        setTypedLines((prev) => [...prev, STOCKFISH_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Snap away into MATE IN 3 slam
        setTimeout(() => {
          setPhase('slam');
          setTimeout(() => {
            setEvalHeight(98);
            try {
              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#81b64c', '#588c3e', '#ffffff', '#00f0ff'],
              });
            } catch {}
          }, 350);

          setTimeout(() => {
            setPhase('settled');
          }, 2400);
        }, 400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [typedLines]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(10, 11, 8, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Background ambient engine grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#81b64c 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Close / Skip Button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 transition-colors cursor-pointer"
        >
          <span>Skip to Portfolio</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center">

        {/* ═══════════════════════════════════════════════════════
            PHASE 1: RAW STOCKFISH ENGINE OUTPUT TERMINAL
            ═══════════════════════════════════════════════════════ */}
        {phase === 'terminal' && (
          <div className="w-full rounded-3xl border border-[#81b64c]/40 bg-[#12140f] shadow-2xl p-6 sm:p-8 font-mono text-xs sm:text-sm text-emerald-400 overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 text-zinc-400 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-zinc-300">stockfish-engine-daemon — fish@param-chess</span>
              </div>
              <div className="flex items-center gap-2 text-[#81b64c]">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span>EVALUATING POSITION (DEPTH 28)...</span>
              </div>
            </div>

            {/* Terminal Code Streams */}
            <div className="h-[360px] overflow-y-auto space-y-1.5 pr-2 font-mono text-zinc-300">
              {typedLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#81b64c] select-none">$</span>
                  <span
                    className={
                      line.includes('mate 3')
                        ? 'text-amber-400 font-extrabold bg-amber-400/10 px-1 rounded'
                        : line.includes('score cp')
                        ? 'text-emerald-400'
                        : line.includes('bestmove')
                        ? 'text-[#00f0ff] font-extrabold'
                        : 'text-zinc-300'
                    }
                  >
                    {line}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
              <span className="inline-block w-2.5 h-4 bg-[#81b64c] animate-pulse ml-1" />
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Nodes: ~8,941,029 • Threads: 8 • Hash: 2048 MB</span>
              <span className="text-[#81b64c] animate-pulse">Computing critical sacrifice...</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            PHASE 2 & 3: KINETIC TITLE CARD SLAM & EVAL BAR SWING
            ═══════════════════════════════════════════════════════ */}
        {(phase === 'slam' || phase === 'settled') && (
          <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-90 duration-300">
            
            {/* Top Engine Snapped Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#81b64c] bg-[#81b64c]/20 text-[#81b64c] text-xs font-black tracking-widest uppercase shadow-lg shadow-[#81b64c]/20">
              <Zap className="w-4 h-4 fill-current animate-bounce" />
              <span>STOCKFISH 16.1 FORCED SEQUENCE LOCKED</span>
            </div>

            {/* Massive Kinetic Slam Title Card */}
            <div className="relative text-center">
              {/* Radial glow explosion behind text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-[#81b64c]/30 via-emerald-500/30 to-[#a3e635]/20 rounded-full blur-3xl pointer-events-none" />

              <h1 className="text-7xl sm:text-9xl md:text-[140px] font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] scale-100 animate-in slide-in-from-top-12 duration-300">
                MATE <span className="text-[#81b64c]">IN 3</span>
              </h1>

              <p className="text-base sm:text-xl font-bold tracking-wide text-zinc-300 mt-4 max-w-xl mx-auto">
                Stockfish evaluation confirms a flawless forced tactical mating net.
                Sacrifice on h7 opens unstoppable queen infiltration!
              </p>
            </div>

            {/* Dramatic Evaluation Bar Swinging Sharply in White's Favor */}
            <div className="w-full max-w-2xl bg-[#1b1c18] border-2 border-[#81b64c] rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase">
                <span className="text-[#81b64c] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#81b64c] animate-ping" />
                  WHITE EVALUATION: +M3
                </span>
                <span className="text-zinc-400">BLACK: RESIGNED</span>
              </div>

              {/* Horizontal Bar with Sharp Swing */}
              <div className="w-full h-8 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 relative p-1">
                <div
                  className="h-full rounded-xl bg-gradient-to-r from-[#81b64c] via-[#a3e635] to-[#81b64c] transition-all duration-1000 ease-out flex items-center justify-end pr-3 shadow-lg shadow-[#81b64c]/50"
                  style={{
                    width: `${evalHeight}%`,
                  }}
                >
                  <span className="text-black font-black text-xs tracking-wider">
                    +M3 (100%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 pt-1">
                <span>0.0 Neutral</span>
                <span>Calculated 8,941,029 positions</span>
                <span className="text-[#81b64c] font-black">+M3 Decisive Win</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-base font-extrabold shadow-lg shadow-[#81b64c]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#81b64c] hover:bg-[#6e9443]"
              >
                <span>Explore Param&apos;s Portfolio</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setPhase('terminal');
                  setTypedLines([]);
                  setEvalHeight(50);
                }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-zinc-700 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 text-sm font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Engine Output</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default StockfishHeroIntro;

