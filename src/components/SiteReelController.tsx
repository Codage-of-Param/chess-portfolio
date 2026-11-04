import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chessAudio } from '../utils/chessAudio';
import {
  Film,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Eye,
  X,
} from 'lucide-react';

interface SiteReelControllerProps {
  onOpenVideoModal: () => void;
  isDark?: boolean;
}

interface MenuScene {
  id: string;
  name: string;
  sceneNum: string;
  timecode: string;
  tagline: string;
  durationMs: number;
}

const MENU_SCENES: MenuScene[] = [
  {
    id: 'home',
    name: 'Home & Identity',
    sceneNum: 'SCENE 01/07',
    timecode: '00:00:15',
    tagline: 'Param Chotaliya (@Pa_ra-m) • Legend League & 3D Knight',
    durationMs: 7000,
  },
  {
    id: 'story',
    name: '3D Story Quest',
    sceneNum: 'SCENE 02/07',
    timecode: '00:00:45',
    tagline: 'The Grandmaster Quest • 5 Acts of Chess Evolution',
    durationMs: 7500,
  },
  {
    id: 'rating',
    name: 'Rating Ascent',
    sceneNum: 'SCENE 03/07',
    timecode: '00:01:15',
    tagline: '1,152 Rapid Peak • 1,223 Daily • 880 Blitz • 785 Bullet',
    durationMs: 7000,
  },
  {
    id: 'replay',
    name: 'Arena Replay Engine',
    sceneNum: 'SCENE 04/07',
    timecode: '00:01:45',
    tagline: 'Live PGN Match Engine • 95.7% Decisive Finishes',
    durationMs: 7000,
  },
  {
    id: 'openings',
    name: 'Repertoire Vault',
    sceneNum: 'SCENE 05/07',
    timecode: '00:02:15',
    tagline: 'Italian Game 54.8% W • Sicilian Defense & Central Control',
    durationMs: 7000,
  },
  {
    id: 'stats',
    name: 'Live Stats & DNA Radar',
    sceneNum: 'SCENE 06/07',
    timecode: '00:02:45',
    tagline: 'Dynamic Tactical Attacker • 91% Intuition • 88% Attack',
    durationMs: 7500,
  },
  {
    id: 'connect',
    name: 'Connect & Challenge',
    sceneNum: 'SCENE 07/07',
    timecode: '00:03:15',
    tagline: 'Send a Live Rapid or Blitz Challenge on Chess.com',
    durationMs: 6500,
  },
];

export const SiteReelController: React.FC<SiteReelControllerProps> = ({
  onOpenVideoModal,
  isDark = true,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isDockMinimized, setIsDockMinimized] = useState(false);

  // Scrollspy to detect which menu section is currently active
  useEffect(() => {
    const handleScroll = () => {
      if (isTourActive) return; // Don't override while automated tour is active
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = MENU_SCENES.length - 1; i >= 0; i--) {
        const el = document.getElementById(MENU_SCENES[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSceneIdx(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTourActive]);

  // Jump to specific scene
  const scrollToScene = useCallback((idx: number) => {
    const targetIdx = (idx + MENU_SCENES.length) % MENU_SCENES.length;
    setCurrentSceneIdx(targetIdx);
    setTourProgress(0);

    const target = MENU_SCENES[targetIdx];
    const el = document.getElementById(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      chessAudio.playPieceMove();
    }
  }, []);

  const nextScene = useCallback(() => {
    scrollToScene(currentSceneIdx + 1);
  }, [currentSceneIdx, scrollToScene]);

  const prevScene = useCallback(() => {
    scrollToScene(currentSceneIdx - 1);
  }, [currentSceneIdx, scrollToScene]);

  // Automated Tour loop
  useEffect(() => {
    if (!isTourActive) return;

    const currentScene = MENU_SCENES[currentSceneIdx];
    const duration = currentScene.durationMs;
    const intervalTime = 100;

    const interval = setInterval(() => {
      setTourProgress((prev) => {
        if (prev >= 100) {
          nextScene();
          return 0;
        }
        return prev + (intervalTime / duration) * 100;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isTourActive, currentSceneIdx, nextScene]);

  const toggleTour = () => {
    if (!isTourActive) {
      chessAudio.playChapterWhoosh();
      scrollToScene(currentSceneIdx);
    }
    setIsTourActive(!isTourActive);
  };

  const currentScene = MENU_SCENES[currentSceneIdx];

  return (
    <>
      {/* Optional Cinema Mode: 2.39:1 Letterbox Bars */}
      {isCinemaMode && (
        <>
          <div className="fixed top-0 left-0 right-0 h-10 sm:h-14 bg-black z-40 pointer-events-none flex items-center justify-between px-6 text-[11px] font-mono tracking-widest text-[#81b64c]">
            <span>● REC [24 FPS RAW]</span>
            <span>CHESS.COM • PARAM CHOTALIYA</span>
            <span>{currentScene.timecode}</span>
          </div>
          <div className="fixed bottom-0 left-0 right-0 h-10 sm:h-14 bg-black z-40 pointer-events-none flex items-center justify-between px-6 text-[11px] font-mono text-zinc-500">
            <span>2.39:1 ANAMORPHIC CINE REEL</span>
            <span>{currentScene.sceneNum}</span>
          </div>
        </>
      )}

      {/* Floating Reel Dock Controller at Bottom Center */}
      <aside
        aria-label="Interactive Reel Tour Controller"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl transition-all duration-300"
      >
        <div
          className="rounded-3xl border shadow-2xl backdrop-blur-2xl p-3 sm:p-4 relative overflow-hidden"
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Subtle green ambient rim glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#81b64c] to-transparent opacity-80" />

          {/* Collapsed Mini Bar */}
          {isDockMinimized ? (
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#81b64c]">
                  Reel Mode: {currentScene.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTour}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-[#81b64c] cursor-pointer"
                >
                  {isTourActive ? 'Pause Tour' : 'Resume Tour'}
                </button>
                <button
                  onClick={() => setIsDockMinimized(false)}
                  className="px-2 py-1 rounded-lg border text-xs font-bold cursor-pointer"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Expand
                </button>
              </div>
            </div>
          ) : (
            /* Full Interactive Reel Dock */
            <div className="space-y-3">
              {/* Top Row: Scene Stamp, Title, Video Modal Trigger */}
              <div className="flex items-center justify-between gap-2">
                {/* Scene Indicator */}
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-black uppercase tracking-wider shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
                    <span>REC</span>
                  </div>

                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#81b64c] shrink-0">
                    {currentScene.sceneNum}
                  </span>

                  <span className="text-xs sm:text-sm font-black truncate" style={{ color: 'var(--text-primary)' }}>
                    {currentScene.name}
                  </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsCinemaMode(!isCinemaMode)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isCinemaMode ? 'bg-[#81b64c] text-white' : 'hover:scale-105'
                    }`}
                    style={{
                      borderColor: 'var(--border-color)',
                      color: isCinemaMode ? '#ffffff' : 'var(--text-secondary)',
                      backgroundColor: isCinemaMode ? 'var(--accent-green)' : 'var(--bg-card)',
                    }}
                    title={isCinemaMode ? 'Exit Cinema Frame' : 'Toggle Cinema Frame'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onOpenVideoModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                    title="Launch Full 1080p Remotion Video Reel"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Watch Full Reel</span>
                  </button>

                  <button
                    onClick={() => setIsDockMinimized(true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                    title="Minimize Dock"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Tagline Subtitle */}
              <p className="text-[11px] sm:text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {currentScene.tagline}
              </p>

              {/* 7-Menu Timeline Scrubber */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-7 gap-1">
                  {MENU_SCENES.map((scene, idx) => {
                    const isSelected = currentSceneIdx === idx;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => scrollToScene(idx)}
                        className={`py-1 rounded-md text-center text-[10px] font-black transition-all cursor-pointer border relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#81b64c] text-white border-[#81b64c] scale-105 shadow-xs'
                            : 'opacity-60 hover:opacity-100 hover:border-[#81b64c]/40'
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-green)' : 'var(--bg-card-sub)',
                          borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-color)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        }}
                        title={`Jump to ${scene.name}`}
                      >
                        <span className="block truncate">{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Smooth Progress Bar */}
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card-sub)' }}
                >
                  <div
                    className="h-full bg-[#81b64c] transition-all duration-100 ease-linear"
                    style={{
                      width: isTourActive
                        ? `${tourProgress}%`
                        : `${((currentSceneIdx + 1) / MENU_SCENES.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Playback Controls Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevScene}
                    className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    title="Previous Scene"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleTour}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: isTourActive ? '#ef4444' : 'var(--accent-green)' }}
                    title={isTourActive ? 'Pause Auto Reel Tour' : 'Start Auto Reel Tour'}
                  >
                    {isTourActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause Tour</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Auto Reel Tour</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={nextScene}
                    className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    title="Next Scene"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>{currentScene.timecode}</span>
                  <span>•</span>
                  <span>Scene {currentSceneIdx + 1} of 7</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SiteReelController;

