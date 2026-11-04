import React, { useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { ChessCareerVideo } from '../remotion/ChessCareerVideo';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  ExternalLink,
  Maximize2,
  Minimize2,
  Film,
  Download,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface RemotionVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  rapidPeak?: number;
  blitzPeak?: number;
  totalGames?: number;
  isDark?: boolean;
}

const REEL_MENUS = [
  { id: 'home', label: '01. Home', frame: 0, tag: 'Identity' },
  { id: 'story', label: '02. 3D Story', frame: 85, tag: '5 Acts' },
  { id: 'ascent', label: '03. Ascent', frame: 170, tag: 'Ratings' },
  { id: 'arena', label: '04. Arena', frame: 255, tag: 'Replay' },
  { id: 'openings', label: '05. Repertoire', frame: 340, tag: 'Openings' },
  { id: 'stats', label: '06. DNA Stats', frame: 425, tag: 'Radar' },
  { id: 'connect', label: '07. Connect', frame: 510, tag: 'Challenge' },
];

export const RemotionVideoModal: React.FC<RemotionVideoModalProps> = ({
  isOpen,
  onClose,
  username = 'Pa_ra-m',
  rapidPeak = 1152,
  blitzPeak = 880,
  totalGames = 3423,
  isDark = true,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [activeMenuIdx, setActiveMenuIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  if (!isOpen) return null;

  const handleJumpToMenu = (idx: number, frame: number) => {
    setActiveMenuIdx(idx);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      playerRef.current.play();
    }
  };

  const handleJumpToSiteSection = (sectionId: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setDownloadToast(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#81b64c', '#ffffff', '#f59e0b'],
      });
    } catch {}
    setTimeout(() => {
      setDownloadToast(false);
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        className={`relative w-full rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col transition-all duration-300 ${
          isFullscreen ? 'max-w-7xl h-[92vh]' : 'max-w-5xl'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Download Success Notification Toast */}
        {downloadToast && (
          <div className="absolute top-16 right-6 z-50 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#588c3e] text-white shadow-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Downloading Param&apos;s Career Reel (MP4, 4.3 MB)...</span>
            </div>
          </div>
        )}

        {/* Modal Top Bar */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b"
          style={{
            backgroundColor: 'var(--bg-card-sub)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#81b64c] to-[#588c3e] flex items-center justify-center text-white shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>Param Chotaliya: Complete Site Reel</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#81b64c]/20 text-[#81b64c]">
                  All 7 Menus
                </span>
              </div>
              <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                600 Frames • 30 FPS HD Remotion React Engine
              </div>
            </div>
          </div>

          {/* Right Header Actions: Download Button, Fullscreen, Close */}
          <div className="flex items-center gap-2">
            {/* Primary Download Button in Top Bar */}
            <a
              href="/assets/param_chess_career_reel.mp4"
              download="Param_Chotaliya_Chess_Career_Reel.mp4"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#81b64c] hover:bg-[#73a342]"
              title="Download Full Reel Video (1080p MP4)"
            >
              {isDownloaded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Reel</span>
                </>
              )}
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Player'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              aria-label="Close video modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Menu Chapter Navigation Ribbon */}
        <div
          className="flex items-center gap-1.5 px-4 py-2 border-b overflow-x-auto no-scrollbar backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <span className="text-[10px] font-black uppercase tracking-wider px-2 text-[#81b64c] shrink-0">
            Jump to Menu:
          </span>
          {REEL_MENUS.map((menu, idx) => {
            const isSelected = activeMenuIdx === idx;
            return (
              <button
                key={menu.id}
                onClick={() => handleJumpToMenu(idx, menu.frame)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#81b64c] text-white border-[#81b64c] shadow-xs'
                    : 'hover:border-[#81b64c]/50'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-green)' : 'var(--bg-card-sub)',
                  borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-color)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <span>{menu.label}</span>
                <span className="ml-1 opacity-70 text-[10px] font-normal">({menu.tag})</span>
              </button>
            );
          })}
        </div>

        {/* Remotion Player Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center flex-1 group">
          <Player
            ref={playerRef}
            component={ChessCareerVideo}
            durationInFrames={600}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{
              width: '100%',
              height: '100%',
            }}
            inputProps={{
              username,
              rapidPeak,
              blitzPeak,
              totalGames,
              isDark,
            }}
            controls
            autoPlay
            loop
          />

          {/* Quick Floating Download Badge on Video Top Right */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <a
              href="/assets/param_chess_career_reel.mp4"
              download="Param_Chotaliya_Chess_Career_Reel.mp4"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md bg-black/60 border border-white/20 hover:bg-[#81b64c] hover:border-[#81b64c] transition-all cursor-pointer shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save MP4</span>
            </a>
          </div>
        </div>

        {/* Modal Footer with Direct Section Links & Secondary Download Button */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t text-xs font-semibold"
          style={{
            backgroundColor: 'var(--bg-card-sub)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
            <span>Click any menu above to jump • MP4 format available</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Secondary Download Button in Footer */}
            <a
              href="/assets/param_chess_career_reel.mp4"
              download="Param_Chotaliya_Chess_Career_Reel.mp4"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Download Param's Chess Career Reel (MP4)"
            >
              <Download className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Download MP4 (4.3 MB)</span>
            </a>

            <button
              onClick={() => handleJumpToSiteSection(REEL_MENUS[activeMenuIdx].id)}
              className="text-xs font-bold text-[#81b64c] hover:underline cursor-pointer"
            >
              Jump to {REEL_MENUS[activeMenuIdx].label} on Page →
            </button>

            <a
              href="https://www.chess.com/member/Pa_ra-m"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold hover:text-[#81b64c] transition-colors"
            >
              <span>Challenge @{username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemotionVideoModal;
