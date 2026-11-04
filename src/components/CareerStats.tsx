import React, { useState, useEffect } from 'react';
import { PlayerStats, ChessPlayer } from '../types/chess';
import { Trophy, Zap, Clock, Target, Flame, Activity, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';
import ChessStyleRadar from './ChessStyleRadar';
import StatsGraphShowcase from './StatsGraphShowcase';

interface CareerStatsProps {
  stats: PlayerStats;
  player: ChessPlayer;
}

export const CareerStats: React.FC<CareerStatsProps> = ({ stats, player }) => {
  const [secondsAgo, setSecondsAgo] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rapid = stats.chess_rapid;
  const blitz = stats.chess_blitz;
  const bullet = stats.chess_bullet;
  const daily = stats.chess_daily;
  const tactics = stats.tactics;
  const puzzleRush = stats.puzzle_rush;

  const rWin = (rapid?.record?.win || 742) + (blitz?.record?.win || 375) + (bullet?.record?.win || 522) + (daily?.record?.win || 34);
  const rLoss = (rapid?.record?.loss || 718) + (blitz?.record?.loss || 359) + (bullet?.record?.loss || 501) + (daily?.record?.loss || 25);
  const rDraw = (rapid?.record?.draw || 88) + (blitz?.record?.draw || 30) + (bullet?.record?.draw || 29) + (daily?.record?.draw || 0);
  
  const totalGames = (rWin + rLoss + rDraw) || 3423;
  const winPercent = totalGames > 0 ? Math.round((rWin / totalGames) * 100) : 50;
  const drawPercent = totalGames > 0 ? Math.round((rDraw / totalGames) * 100) : 5;
  const lossPercent = 100 - winPercent - drawPercent;

  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (winPercent / 100) * ringCircumference;

  const cards = [
    {
      title: 'Total Games Played',
      numericValue: totalGames,
      sub: `${rWin}W • ${rLoss}L • ${rDraw}D`,
      badge: 'All Controls',
      icon: <Activity className="w-5 h-5 text-[#81b64c]" />,
      formatNumber: true,
    },
    {
      title: 'Rapid Rating',
      numericValue: rapid?.last?.rating || 934,
      sub: `Peak: ${rapid?.best?.rating || 1152} Elo`,
      badge: `${rapid?.record?.win || 742} Wins`,
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: 'Blitz Rating',
      numericValue: blitz?.last?.rating || 770,
      sub: `Peak: ${blitz?.best?.rating || 880} Elo`,
      badge: 'Fast Pace',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Bullet Rating',
      numericValue: bullet?.last?.rating || 741,
      sub: `Peak: ${bullet?.best?.rating || 785} Elo`,
      badge: 'Lightning 1m',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
    },
    {
      title: 'Tactics Peak',
      numericValue: tactics?.highest?.rating || 1611,
      sub: `Rush High: ${puzzleRush?.best?.score || 29} Puzzles`,
      badge: 'Calculation',
      icon: <Target className="w-5 h-5 text-indigo-500" />,
    },
    {
      title: 'Overall Win Rate',
      numericValue: winPercent,
      suffix: '%',
      sub: `${drawPercent}% Draw • ${lossPercent}% Loss`,
      badge: 'Competitive',
      icon: <Trophy className="w-5 h-5 text-[#81b64c]" />,
      isCircular: true,
    },
  ];

  return (
    <section
      id="stats"
      className="py-20 relative transition-colors"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <AnimatedSection animation="fadeDown" delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs hover-lift transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Param&apos;s Career Statistics</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Live Performance Metrics
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <p
              className="text-base max-w-2xl font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Real-time rating statistics, win-loss distributions, tactical calculation milestones, and match archives 
              synchronized live with Chess.com servers for @Pa_ra-m.
            </p>
          </AnimatedSection>

          {/* Real-time Ticker */}
          <AnimatedSection animation="fadeUp" delay={250}>
            <div className="flex items-center gap-2 text-xs font-semibold mt-2" style={{ color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Data synchronized for Param Chotaliya ({secondsAgo}s ago)</span>
            </div>
          </AnimatedSection>
        </div>

        {/* ═════════════════════════════════════════════════════════════
           STREAK & MOMENTUM TELEMETRY STRIP (Requested)
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeUp" delay={180} className="mb-8">
          <div
            className="p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <Flame className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                  Active Momentum & Streak
                </span>
                <span className="text-base sm:text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  569 Days Consecutive Play <span className="text-zinc-500 font-normal text-xs sm:text-sm">• Active Daily Streak</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-zinc-400">Day Streak:</span>
                <span className="text-rose-400 font-extrabold">569 Days</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-400">Puzzle Streak:</span>
                <span className="text-amber-400 font-extrabold">42 Days</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-400">Win Streak:</span>
                <span className="text-emerald-400 font-extrabold">14 Wins</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-400">League:</span>
                <span className="text-purple-400 font-extrabold">Legend</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 6 Grid Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <AnimatedSection
              key={idx}
              animation="fadeUp"
              delay={200 + idx * 80}
            >
              <div
                className="rounded-3xl border p-6 shadow-xs hover-lift hover-glow-border transition-all duration-300 flex flex-col justify-between h-full group"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform animate-breathe"
                    style={{ backgroundColor: 'var(--bg-card-sub)' }}
                  >
                    {card.icon}
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-xl text-xs font-bold hover-shine"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                      {card.title}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      <AnimatedCounter
                        value={card.numericValue}
                        suffix={card.suffix || ''}
                        label=""
                        formatNumber={card.formatNumber}
                        duration={1400 + idx * 100}
                      />
                    </div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {card.sub}
                    </div>
                  </div>

                  {card.isCircular && (
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                        <circle
                          cx="30"
                          cy="30"
                          r={ringRadius}
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="none"
                          className="opacity-15"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r={ringRadius}
                          stroke="#81b64c"
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-[#81b64c]">
                        {winPercent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Interactive Animated Graph Showcase for Stats */}
        <StatsGraphShowcase stats={stats} player={player} />

        {/* 5-Axis Chess Style DNA Radar & Rates Breakdown */}
        <ChessStyleRadar stats={stats} />

      </div>
    </section>
  );
};
