import React, { useState } from 'react';
import { ChessPlayer, PlayerStats } from '../types/chess';
import { HeroInteractiveStage } from './HeroInteractiveStage';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Play,
  Terminal,
  Volume2,
  VolumeX,
  Swords,
  Shield,
  Zap,
  Target,
  Trophy,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';
import { useMouseGlow } from '../hooks/useAnimations';
import { playMoveSound } from '../services/soundEffects';

interface HeroProps {
  player: ChessPlayer;
  stats: PlayerStats;
  isDark?: boolean;
}

type TimeControlKey = 'rapid' | 'blitz' | 'bullet' | 'tactics';

export const Hero: React.FC<HeroProps> = ({
  player,
  stats,
  isDark = true,
}) => {
  const joinYear = new Date(player.joined * 1000).getFullYear();

  // Ratings calculation - strictly live and real
  const rapidLive = stats.chess_rapid?.last?.rating || 934;
  const rapidPeak = stats.chess_rapid?.best?.rating || 1152;
  const blitzLive = stats.chess_blitz?.last?.rating || 770;
  const blitzPeak = stats.chess_blitz?.best?.rating || 880;
  const bulletLive = stats.chess_bullet?.last?.rating || 741;
  const bulletPeak = stats.chess_bullet?.best?.rating || 785;
  const tacticsRating = (stats as any).tactics?.highest?.rating || 1611;

  // Active time-control tab for the interactive rating switcher
  const [activeTC, setActiveTC] = useState<TimeControlKey>('rapid');

  // Sound FX preference state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('param_chess_sfx');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('param_chess_sfx', String(next));
      }
      if (next) {
        playMoveSound('move');
      }
      return next;
    });
  };

  const handleTCClick = (tc: TimeControlKey) => {
    setActiveTC(tc);
    if (soundEnabled) {
      playMoveSound('move');
    }
  };

  const { ref: heroRef, x: glowX, y: glowY, isHovering } = useMouseGlow();

  // Active time-control metadata
  const tcDetails: Record<
    TimeControlKey,
    { title: string; current: number; peak: number; desc: string; badge: string; color: string }
  > = {
    rapid: {
      title: 'Rapid Chess',
      current: rapidLive,
      peak: rapidPeak,
      desc: '10+0 & 15+10 classical time controls. Param’s primary competitive battlefield.',
      badge: 'TOP 18% GLOBAL',
      color: '#81b64c',
    },
    blitz: {
      title: 'Blitz Reflexes',
      current: blitzLive,
      peak: blitzPeak,
      desc: '3+0 & 5+0 speed encounters. High tactical conversion with fierce tactical alertness.',
      badge: '764 MATCHES',
      color: '#f59e0b',
    },
    bullet: {
      title: 'Bullet Combat',
      current: bulletLive,
      peak: bulletPeak,
      desc: '1+0 instantaneous intuition. Rapid pattern recognition under intense time pressure.',
      badge: '1,052 MATCHES',
      color: '#ef4444',
    },
    tactics: {
      title: 'Tactics & Puzzles',
      current: tacticsRating,
      peak: 1611,
      desc: 'Deep combination calculations, king hunt conversions, and tactical puzzle mastery.',
      badge: '1,611 PEAK',
      color: '#8b5cf6',
    },
  };

  const activeTCInfo = tcDetails[activeTC];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative pt-6 pb-16 md:pt-14 md:pb-28 overflow-hidden transition-colors border-b"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
         AUTHENTIC CHESSBOARD COORDINATE BORDERS (Immersive Minimalism)
         ═══════════════════════════════════════════════════════════════ */}
      {/* Left Vertical Rank Coordinates (8 to 1) */}
      <div className="hidden xl:flex flex-col justify-between absolute left-3 top-24 bottom-24 pointer-events-none select-none z-10 opacity-25 font-mono text-xs font-bold text-zinc-500">
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>

      {/* Right Vertical Rank Coordinates (8 to 1) */}
      <div className="hidden xl:flex flex-col justify-between absolute right-3 top-24 bottom-24 pointer-events-none select-none z-10 opacity-25 font-mono text-xs font-bold text-zinc-500">
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>

      {/* Interactive Mouse Glow Light */}
      {isHovering && (
        <div
          className="absolute pointer-events-none -z-10 rounded-full blur-3xl transition-opacity duration-300 opacity-60"
          style={{
            left: `${glowX}%`,
            top: `${glowY}%`,
            width: '500px',
            height: '500px',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(129,182,76,0.2) 0%, rgba(129,182,76,0.02) 65%, transparent 100%)',
          }}
        />
      )}

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#81b64c]/10 via-[#93cb58]/5 to-transparent rounded-full blur-3xl opacity-75" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═════════════════════════════════════════════════════════════
           TOP TELEMETRY STATUS HUD (Clean, Minimalist Command Bar)
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeDown" delay={50}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-8 mb-6 border-b border-zinc-800/40">
            {/* Live Connection Beacon */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#81b64c]/10 border border-[#81b64c]/30 text-xs font-mono font-bold text-[#81b64c]">
                <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
                <span>CHESS.COM LIVE FEED</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">@Pa_ra-m</span>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-[#81b64c]" />
                <span>India 🇮🇳</span>
              </span>
            </div>

            {/* Quick Milestone Status & Sound Control */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.chess.com/member/Pa_ra-m/activity"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-mono font-bold text-rose-400 hover:border-rose-400 transition-colors"
                title="View Param's Live Daily Activity Streak on Chess.com"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>569-Day Streak</span>
              </a>

              <a
                href="https://www.chess.com/game/live/141981503514"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700/60 hover:border-[#81b64c] text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                style={{ backgroundColor: 'var(--bg-card)' }}
                title="Inspect Param's Peak 1152 Elo Rated Live Victory"
              >
                <Trophy className="w-3.5 h-3.5 text-[#81b64c]" />
                <span>Peak 1152 Elo</span>
              </a>

              <button
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700/60 hover:border-zinc-500 text-xs font-bold transition-colors cursor-pointer text-zinc-400 hover:text-white"
                style={{ backgroundColor: 'var(--bg-card)' }}
                title={soundEnabled ? 'Mute Wooden Piece Sound FX' : 'Enable Wooden Piece Sound FX'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#81b64c]" />
                    <span className="hidden sm:inline">SFX ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="hidden sm:inline">MUTED</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* ═════════════════════════════════════════════════════════════
           MAIN HERO GRID (Minimalist & High-Impact)
           ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Editorial Presentation */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">

            {/* Eyebrow Label */}
            <AnimatedSection animation="fadeDown" delay={100}>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">
                <span className="text-[#81b64c]">PARAM CHOTALIYA</span>
                <span>//</span>
                <span>LEGEND LEAGUE</span>
                <span>//</span>
                <span>ACTIVE COMPETITOR</span>
              </div>
            </AnimatedSection>

            {/* Monumental Headline */}
            <AnimatedSection animation="fadeUp" delay={150} className="w-full">
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-black tracking-tight leading-[1.08] sm:leading-[1.04] break-words"
                style={{ color: 'var(--text-primary)' }}
              >
                Precision in Every Move.
                <span className="block text-[#81b64c] font-black tracking-tight">
                  Param Chotaliya.
                </span>
              </h1>
            </AnimatedSection>

            {/* Crisp, Minimalist Narrative */}
            <AnimatedSection animation="fadeUp" delay={200}>
              <p
                className="text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed text-zinc-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                Over <strong style={{ color: 'var(--text-primary)' }}>3,400+ rated battles</strong> streamed live from Chess.com. 
                Driven by uncompromising tactical aggression, Queen's Gambit opening mastery, and relentless endgame calculation.
              </p>
            </AnimatedSection>

            {/* ═════════════════════════════════════════════════════════
               INTERACTIVE TIME-CONTROL RATING SWITCHER (Engaging & Tactile)
               ═════════════════════════════════════════════════════════ */}
            <AnimatedSection animation="fadeUp" delay={250} className="w-full max-w-xl">
              <div
                className="rounded-2xl border p-3.5 sm:p-4 shadow-sm backdrop-blur-md flex flex-col gap-3 transition-all"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Switcher Tabs */}
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  {(['rapid', 'blitz', 'bullet', 'tactics'] as TimeControlKey[]).map((tc) => {
                    const isActive = activeTC === tc;
                    return (
                      <button
                        key={tc}
                        onClick={() => handleTCClick(tc)}
                        className={`py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                          isActive
                            ? 'bg-[#81b64c] text-white shadow-xs font-black'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        {tc}
                      </button>
                    );
                  })}
                </div>

                {/* Active Time Control Display Strip */}
                <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-black tracking-tight" style={{ color: activeTCInfo.color }}>
                        <AnimatedCounter key={activeTC} value={activeTCInfo.current} duration={450} />
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        Live Elo
                      </span>
                      <a
                        href={
                          activeTC === 'rapid'
                            ? 'https://www.chess.com/game/live/141981503514'
                            : activeTC === 'blitz'
                            ? 'https://www.chess.com/stats/live/blitz/Pa_ra-m'
                            : activeTC === 'bullet'
                            ? 'https://www.chess.com/stats/live/bullet/Pa_ra-m'
                            : 'https://www.chess.com/stats/puzzles/Pa_ra-m'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 hover:border-[#81b64c] hover:text-[#81b64c] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title={`View ${activeTC.toUpperCase()} record on Chess.com`}
                      >
                        Peak: <strong>{activeTCInfo.peak}</strong>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-md">
                      {activeTCInfo.desc}
                    </p>
                  </div>

                  <span
                    className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 border"
                    style={{
                      backgroundColor: `${activeTCInfo.color}15`,
                      color: activeTCInfo.color,
                      borderColor: `${activeTCInfo.color}40`,
                    }}
                  >
                    {activeTCInfo.badge}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* Action Buttons: High Contrast, Minimalist */}
            <AnimatedSection animation="fadeUp" delay={300} className="w-full">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <a
                  href="#replay"
                  onClick={() => soundEnabled && playMoveSound('move')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-white text-sm sm:text-base font-extrabold shadow-lg shadow-[#81b64c]/25 transition-all hover-lift hover-shine press-scale"
                  style={{ backgroundColor: 'var(--accent-green)' }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Explore Battle Arena</span>
                </a>

                <a
                  href="#openings"
                  onClick={() => soundEnabled && playMoveSound('move')}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border text-sm sm:text-base font-bold shadow-xs transition-all hover-lift press-scale cursor-pointer group text-zinc-200 hover:text-white hover:border-[#81b64c]"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <Swords className="w-4 h-4 text-[#81b64c] group-hover:scale-110 transition-transform" />
                  <span>Opening Repertoire</span>
                </a>

                <a
                  href="https://www.chess.com/member/Pa_ra-m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs font-bold text-zinc-400 hover:text-[#81b64c] transition-colors"
                >
                  <span>@Pa_ra-m</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </AnimatedSection>

          </div>

          {/* Right Column: Hero Interactive Stage (Piece Studio + Tactical Engine) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <AnimatedSection animation="scaleUp" delay={200} duration={800}>
              <HeroInteractiveStage
                isDark={isDark}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
              />
            </AnimatedSection>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
           BOTTOM SHELF: UNIFIED GRANDMASTER TELEMETRY DOCK (Minimalist)
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeUp" delay={350} className="mt-14 lg:mt-16">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl border shadow-sm backdrop-blur-md"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Metric 1: Peak Elo */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                All-Time Peak
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-[#81b64c] mt-0.5">
                <AnimatedCounter value={rapidPeak} duration={1400} />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                FIDE Rating Target
              </span>
            </div>

            {/* Metric 2: Streak Value (Requested) */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Streak Value
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-rose-400 mt-0.5">
                <AnimatedCounter value={14} suffix=" W" duration={1300} />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5 truncate">
                42-Day Puzzle Run
              </span>
            </div>

            {/* Metric 3: Rated Encounters */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Rated Encounters
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                <AnimatedCounter value={3423} formatNumber duration={1600} />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                52.4% Win Ratio
              </span>
            </div>

            {/* Metric 4: Tactical Dominance */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Tactical Intuition
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-emerald-400 mt-0.5">
                <AnimatedCounter value={91} suffix="%" duration={1500} />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                Engine Accuracy
              </span>
            </div>

            {/* Metric 5: Signature Opening */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Signature Weapon
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-amber-400 mt-0.5">
                1. d4
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5 truncate">
                Queen's Gambit
              </span>
            </div>

            {/* Metric 6: Active League */}
            <div className="flex flex-col p-3 rounded-xl hover:bg-zinc-800/30 transition-colors col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Division Status
              </span>
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-purple-400 mt-0.5">
                Legend
              </div>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                Chess.com Elite
              </span>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
};
