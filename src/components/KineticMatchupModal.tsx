import React from 'react';
import { Player } from '@remotion/player';
import { KineticTitleCard } from '../remotion/KineticTitleCard';
import { X, Swords, Sparkles } from 'lucide-react';

interface KineticMatchupModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeTeam: string;
  awayTeam: string;
  homeRating?: number | string;
  awayRating?: number | string;
  timeControl?: string;
}

export const KineticMatchupModal: React.FC<KineticMatchupModalProps> = ({
  isOpen,
  onClose,
  homeTeam,
  awayTeam,
  homeRating = 1152,
  awayRating = 928,
  timeControl = '10 MIN • RAPID BATTLE',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl border border-[#81b64c]/30 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: '#262421' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-zinc-800 bg-[#1e1c1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#81b64c]/20 text-[#81b64c] flex items-center justify-center font-black">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                Chess.com Kinetic Matchup Card
                <span className="px-2 py-0.5 rounded-full bg-[#81b64c] text-white text-[10px] font-black">
                  REMOTION
                </span>
              </span>
              <span className="text-[11px] font-bold text-[#81b64c]">
                {homeTeam} vs {awayTeam} • {timeControl}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Kinetic Card Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Remotion Player Canvas */}
        <div className="w-full aspect-video bg-[#262421] relative flex items-center justify-center overflow-hidden">
          <Player
            component={KineticTitleCard}
            inputProps={{
              homeTeam,
              awayTeam,
              homeRating,
              awayRating,
              timeControl,
              eventTitle: 'CHESS.COM ARENA CLASH',
            }}
            durationInFrames={120}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
            autoPlay
            loop
          />
        </div>

        {/* Modal Footer Controls & Info */}
        <div className="p-4 px-6 border-t border-zinc-800 bg-[#1e1c1a] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#81b64c]" />
            <span>Interactive Remotion spring physics & kinetic typography rendered live in real-time.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KineticMatchupModal;

