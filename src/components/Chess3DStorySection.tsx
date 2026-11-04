import React, { useState, useEffect, useCallback, useRef } from 'react';
import Chess3DStoryCanvas from './Chess3DStoryCanvas';
import { chessAudio } from '../utils/chessAudio';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Trophy,
  Zap,
  Target,
  Clock,
  Rotate3d,
  Compass,
} from 'lucide-react';
import AnimatedSection from './AnimatedSection';

interface StoryChapter {
  id: number;
  act: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  milestones: { label: string; value: string }[];
  accentColor: string;
  badge: string;
  cameraPerspective: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 0,
    act: 'ACT I',
    tag: 'THE SPARK • 2023',
    title: 'The First Move on the Board',
    subtitle: 'Entering Chess.com & Discovering 1.e4',
    description:
      'In spring 2023, Param (@Pa_ra-m) made his opening debut. From standard pawn pushes, he embraced the romantic Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4), developing the noble Knight and laying the foundation for an aggressive attacking career.',
    milestones: [
      { label: 'Debut Date', value: 'April 2023' },
      { label: 'Opening Core', value: 'Italian 1.e4' },
      { label: 'Career Launch', value: 'First 500 Matches' },
    ],
    accentColor: '#81b64c',
    badge: 'Offensive Opening Initialized',
    cameraPerspective: 'Low 3/4 Perspective • Knight Leaps to f3',
  },
  {
    id: 1,
    act: 'ACT II',
    tag: 'TACTICS • SHARPNESS',
    title: 'The Tactical Awakening',
    subtitle: '1,611 Peak & 29 Puzzle Rush Speed Record',
    description:
      'Tactical calculation became second nature. Solving 29 consecutive puzzles in under 3 minutes placed Param in the top 5% of speed puzzle solvers worldwide. Knight forks, double attacks, and discovered checks became deadly weapons.',
    milestones: [
      { label: 'Tactics Peak', value: '1,611 Elo' },
      { label: 'Puzzle Rush Best', value: '29 Puzzles' },
      { label: 'Decisive Finishes', value: '95.7% (4.3% Draws)' },
    ],
    accentColor: '#ef4444',
    badge: 'Tactical Laser Diagonals Active',
    cameraPerspective: 'Overhead 45° Action Tilt • Center Fork',
  },
  {
    id: 2,
    act: 'ACT III',
    tag: 'SPEED • REFLEXES',
    title: 'Lightning in the Dark',
    subtitle: '1,052 Bullet Speed Battles & 880 Blitz Peak',
    description:
      'Transitioning into the frantic realm of 60-second Bullet and 3-minute Blitz. Under the relentless ticking of the clock, instinct superseded deliberate calculation. Flagging resistance was forged across more than 1,800 speed matches.',
    milestones: [
      { label: 'Bullet Matches', value: '1,052 Games' },
      { label: 'Blitz Elo Peak', value: '880 Peak' },
      { label: 'Bullet 1m Peak', value: '785 Elo' },
    ],
    accentColor: '#a855f7',
    badge: 'Sub-Second Instinct Engaged',
    cameraPerspective: 'High-Speed Orbit Camera • Rapid Tempo',
  },
  {
    id: 3,
    act: 'ACT IV',
    tag: 'STRATEGY • MASTERY',
    title: 'The Strategic Ascent',
    subtitle: '1,152 Rapid Peak & 1,223 Correspondence Elo',
    description:
      'Scaling the competitive ladder with positional maturity. Daily chess demanded deep multi-day calculation, yielding an undefeated 34-win record. In 10-minute Rapid, resilient black defenses and endgame conversions elevated Param to 1,152 peak.',
    milestones: [
      { label: 'Rapid Peak', value: '1,152 Elo' },
      { label: 'Daily Peak', value: '1,223 Elo' },
      { label: 'Daily Win Record', value: '34 Wins • 0 Draws' },
    ],
    accentColor: '#f59e0b',
    badge: 'Endgame Fortress Secured',
    cameraPerspective: 'Sweeping Panoramic Crane • Golden King',
  },
  {
    id: 4,
    act: 'ACT V',
    tag: 'LEGEND • MASTER DNA',
    title: 'The Legend League & Master DNA',
    subtitle: 'Dynamic Tactical Attacker • 3,423+ Battles',
    description:
      'With over 3,423 career games and the coveted Legend League achievement, Param’s chess DNA stands tall: 91% Intuition, 88% Attack rate, and 85% composite mastery. The board remains set as the quest toward the next rating summit continues.',
    milestones: [
      { label: 'Total Career Games', value: '3,423+' },
      { label: 'League Status', value: 'Legend League' },
      { label: 'Playstyle DNA', value: 'Dynamic Tactical Attacker' },
    ],
    accentColor: '#10b981',
    badge: 'Journey Ongoing • Next Summit Ahead',
    cameraPerspective: 'Epic Majestic Wide • Celestial Aura',
  },
];

interface Chess3DStorySectionProps {
  isDark?: boolean;
}

export const Chess3DStorySection: React.FC<Chess3DStorySectionProps> = ({ isDark = true }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  const durationPerChapter = 8000; // 8 seconds per act
  const stepInterval = 100;

  // Sound trigger on chapter change
  const triggerChapterSound = useCallback((chIndex: number) => {
    switch (chIndex) {
      case 0:
        chessAudio.playPieceMove();
        break;
      case 1:
        chessAudio.playTacticalPulse();
        break;
      case 2:
        chessAudio.playClockTick();
        break;
      case 3:
        chessAudio.playPieceMove();
        break;
      case 4:
        chessAudio.playTriumphChime();
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#81b64c', '#f59e0b', '#ffffff', '#10b981'],
          });
        } catch {}
        break;
      default:
        chessAudio.playChapterWhoosh();
    }
  }, []);

  const goToChapter = useCallback(
    (index: number) => {
      const target = (index + CHAPTERS.length) % CHAPTERS.length;
      setCurrentChapter(target);
      setProgress(0);
      triggerChapterSound(target);
    },
    [triggerChapterSound]
  );

  const nextChapter = useCallback(() => {
    goToChapter(currentChapter + 1);
  }, [currentChapter, goToChapter]);

  const prevChapter = useCallback(() => {
    goToChapter(currentChapter - 1);
  }, [currentChapter, goToChapter]);

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextChapter();
          return 0;
        }
        return prev + (stepInterval / durationPerChapter) * 100;
      });
    }, stepInterval);

    return () => clearInterval(interval);
  }, [isPlaying, nextChapter]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSound = () => {
    chessAudio.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      chessAudio.playPieceMove();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard controls (Space for play/pause, Left/Right for chapter scrub)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === ' ' && isFullscreen) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' && isFullscreen) {
        e.preventDefault();
        nextChapter();
      } else if (e.key === 'ArrowLeft' && isFullscreen) {
        e.preventDefault();
        prevChapter();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextChapter, prevChapter]);

  const activeChapter = CHAPTERS[currentChapter];

  return (
    <section
      id="story"
      ref={storyContainerRef}
      className={`relative transition-all duration-500 overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#090b0e] text-white flex flex-col justify-between p-4 sm:p-8'
          : 'py-20 border-t border-b'
      }`}
      style={{
        backgroundColor: isFullscreen ? '#090b0e' : 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
          style={{ backgroundColor: activeChapter.accentColor }}
        />
        <div className="absolute inset-0 bg-radial from-transparent to-black/20" />
      </div>

      <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        
        {/* Section Header */}
        {!isFullscreen && (
          <div className="flex flex-col items-center text-center space-y-3 mb-10">
            <AnimatedSection animation="fadeDown" delay={50}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider shadow-xs hover-lift transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Rotate3d className="w-3.5 h-3.5 text-[#81b64c] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Interactive 3D Journey</span>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={100}>
              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                The Grandmaster Quest
              </h2>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={150}>
              <p
                className="text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Explore Param&apos;s chess evolution in full 3D motion. Travel through the 5 defining acts:
                from his opening 1.e4 moves to tactical awakening, bullet storm, and the Legend League.
              </p>
            </AnimatedSection>
          </div>
        )}

        {/* 3D Story Theater Container */}
        <div
          className={`rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-500 flex flex-col ${
            isFullscreen ? 'flex-1 my-2 border-white/10' : 'min-h-[640px] lg:min-h-[720px]'
          }`}
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Top Control Bar inside Theater */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b z-20 backdrop-blur-md"
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.8)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Left: Act & Chapter indicator */}
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-xs"
                style={{ backgroundColor: activeChapter.accentColor }}
              >
                {activeChapter.act}
              </span>
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {activeChapter.tag}
              </span>
            </div>

            {/* Right: Audio & Theater Fullscreen Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: isMuted ? 'var(--text-muted)' : activeChapter.accentColor,
                }}
                title={isMuted ? 'Unmute 3D Audio' : 'Mute 3D Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                title={isFullscreen ? 'Exit Theater Mode' : 'Enter 3D Theater Mode'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Visual Arena: 3D Canvas + Overlay Narrative */}
          <div className="relative flex-1 flex flex-col lg:flex-row items-stretch justify-between overflow-hidden">
            
            {/* The 3D Three.js WebGL Canvas */}
            <div className="w-full lg:w-7/12 relative flex-1 min-h-[380px] lg:min-h-[500px]">
              <Chess3DStoryCanvas currentChapter={currentChapter} isDark={isDark} />

              {/* 3D Interaction Hint Badge */}
              <div
                className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[11px] font-bold border opacity-80"
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Compass className="w-3.5 h-3.5 text-[#81b64c]" />
                <span>Drag to rotate board • Auto camera synced</span>
              </div>

              {/* Camera Perspective Pill */}
              <div
                className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] font-black uppercase tracking-wider border opacity-75"
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
                  borderColor: 'var(--border-color)',
                  color: activeChapter.accentColor,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeChapter.accentColor }} />
                <span>{activeChapter.cameraPerspective}</span>
              </div>
            </div>

            {/* Right: Narrative Story Panel */}
            <div
              className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between z-10 border-t lg:border-t-0 lg:border-l backdrop-blur-md"
              style={{
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.55)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Narrative Content */}
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 key={activeChapter.id}">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: `${activeChapter.accentColor}20`,
                      color: activeChapter.accentColor,
                      border: `1px solid ${activeChapter.accentColor}40`,
                    }}
                  >
                    {activeChapter.badge}
                  </span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {activeChapter.title}
                </h3>

                <h4
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: activeChapter.accentColor }}
                >
                  {activeChapter.subtitle}
                </h4>

                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeChapter.description}
                </p>

                {/* Milestone Stat Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {activeChapter.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border transition-all hover:scale-105"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        {m.label}
                      </span>
                      <span className="block text-xs font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapter Timeline Scrubber & Navigation Controls */}
              <div className="mt-8 pt-5 border-t space-y-4" style={{ borderColor: 'var(--border-color)' }}>
                {/* 5 Chapter Selector Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {CHAPTERS.map((ch, idx) => {
                    const isCurrent = currentChapter === idx;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => goToChapter(idx)}
                        className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border relative overflow-hidden ${
                          isCurrent
                            ? 'ring-2 ring-offset-1 font-black scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isCurrent ? `${ch.accentColor}25` : 'var(--bg-card)',
                          borderColor: isCurrent ? ch.accentColor : 'var(--border-color)',
                          color: isCurrent ? ch.accentColor : 'var(--text-secondary)',
                        }}
                      >
                        <span className="block text-[10px] font-black uppercase">
                          0{idx + 1}
                        </span>
                        {/* Progress fill on active button */}
                        {isCurrent && isPlaying && (
                          <div
                            className="absolute bottom-0 left-0 h-1 bg-current transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Media Controls: Prev, Play/Pause, Next */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevChapter}
                      className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      title="Previous Chapter"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: activeChapter.accentColor }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={nextChapter}
                      className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      title="Next Chapter"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                    Chapter {currentChapter + 1} of {CHAPTERS.length}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Chess3DStorySection;

