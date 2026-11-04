import React from 'react';
import { Terminal, Zap, Sparkles, Cpu } from 'lucide-react';

const NOTATION_CHUNKS = [
  '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
  '[STOCKFISH 16.1 AVX2 • DEPTH 32]',
  'EVAL: +4.82 (FORCED MATE IN 3)',
  '98.4% ENGINE ACCURACY',
  '18. Bxh7+!! BRILLIANT BISHOP SACRIFICE',
  '[REMOTION PROGRAMMATIC VIDEO API • 60 FPS]',
  '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6',
  '24. Qxh7# CHECKMATE (1-0)',
  'PARAM CHOTALIYA @Pa_ra-m • 3,423 RATED BATTLES',
  '[LIVE CHESS.COM PUBLIC API SYNCHRONIZED]',
  '21. Rd8+ DOMINATING OPEN FILE',
  'LEGEND LEAGUE ACHIEVED • 1152 ELO RAPID PEAK',
];

export const BackgroundNotationTicker: React.FC = () => {
  return (
    <aside
      aria-label="Live Chess Engine Notation Ticker"
      className="fixed bottom-0 left-0 right-0 z-30 h-8 flex items-center overflow-hidden border-t pointer-events-auto select-none backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(18, 20, 16, 0.94)',
        borderColor: 'rgba(129, 182, 76, 0.25)',
      }}
    >
      {/* Left Static Badge */}
      <div
        className="h-full px-3 shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#81b64c] border-r z-10"
        style={{
          backgroundColor: '#1b1d17',
          borderColor: 'rgba(129, 182, 76, 0.3)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c] animate-pulse" />
        <Terminal className="w-3 h-3" />
        <span className="hidden sm:inline">PGN / ENGINE FEED</span>
      </div>

      {/* Marquee Ticker Track (Infinite continuous scroll) */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="flex items-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused] text-[11px] font-mono font-bold text-zinc-300">
          {[...NOTATION_CHUNKS, ...NOTATION_CHUNKS].map((chunk, idx) => {
            const isHighlight =
              chunk.includes('MATE') ||
              chunk.includes('BRILLIANT') ||
              chunk.includes('CHECKMATE') ||
              chunk.includes('STOCKFISH') ||
              chunk.includes('REMOTION');

            return (
              <span key={idx} className="inline-flex items-center mx-3 gap-2">
                <span
                  className={
                    isHighlight
                      ? 'text-[#81b64c] font-black bg-[#81b64c]/10 px-2 py-0.5 rounded'
                      : 'text-zinc-300'
                  }
                >
                  {chunk}
                </span>
                <span className="text-zinc-600 font-bold">•</span>
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default BackgroundNotationTicker;

