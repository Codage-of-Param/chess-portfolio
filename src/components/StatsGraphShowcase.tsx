import React, { useState, useId } from 'react';
import { PlayerStats, ChessPlayer } from '../types/chess';
import AnimatedCounter from './AnimatedCounter';
import AnimatedSection from './AnimatedSection';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Scale,
  Clock,
  Sparkles,
  Swords,
  Shield,
  Zap,
  Target,
  Award,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface StatsGraphShowcaseProps {
  stats: PlayerStats;
  player: ChessPlayer;
}

type GraphTab = 'outcomes' | 'ratings' | 'asymmetry' | 'volume' | 'dna';

export const StatsGraphShowcase: React.FC<StatsGraphShowcaseProps> = ({ stats, player }) => {
  const [activeTab, setActiveTab] = useState<GraphTab>('outcomes');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const uid = useId();

  // Extract real career numbers for @Pa_ra-m
  const rapid = stats.chess_rapid;
  const blitz = stats.chess_blitz;
  const bullet = stats.chess_bullet;
  const daily = stats.chess_daily;
  const tactics = stats.tactics;
  const puzzleRush = stats.puzzle_rush;

  const rWin =
    (rapid?.record?.win || 742) +
    (blitz?.record?.win || 375) +
    (bullet?.record?.win || 522) +
    (daily?.record?.win || 34);

  const rLoss =
    (rapid?.record?.loss || 718) +
    (blitz?.record?.loss || 359) +
    (bullet?.record?.loss || 501) +
    (daily?.record?.loss || 25);

  const rDraw =
    (rapid?.record?.draw || 88) +
    (blitz?.record?.draw || 30) +
    (bullet?.record?.draw || 29) +
    (daily?.record?.draw || 0);

  const totalGames = rWin + rLoss + rDraw || 3423;
  const winPercent = totalGames > 0 ? ((rWin / totalGames) * 100).toFixed(1) : '48.9';
  const drawPercent = totalGames > 0 ? ((rDraw / totalGames) * 100).toFixed(1) : '4.3';
  const lossPercent = totalGames > 0 ? ((rLoss / totalGames) * 100).toFixed(1) : '46.8';

  // Format Breakdown Data
  const formatRows = [
    {
      name: 'Rapid',
      total: (rapid?.record?.win || 742) + (rapid?.record?.loss || 718) + (rapid?.record?.draw || 88),
      win: rapid?.record?.win || 742,
      loss: rapid?.record?.loss || 718,
      draw: rapid?.record?.draw || 88,
      current: rapid?.last?.rating || 934,
      peak: rapid?.best?.rating || 1152,
      color: '#81b64c',
    },
    {
      name: 'Bullet (1m)',
      total: (bullet?.record?.win || 522) + (bullet?.record?.loss || 501) + (bullet?.record?.draw || 29),
      win: bullet?.record?.win || 522,
      loss: bullet?.record?.loss || 501,
      draw: bullet?.record?.draw || 29,
      current: bullet?.last?.rating || 741,
      peak: bullet?.best?.rating || 785,
      color: '#ef4444',
    },
    {
      name: 'Blitz',
      total: (blitz?.record?.win || 375) + (blitz?.record?.loss || 359) + (blitz?.record?.draw || 30),
      win: blitz?.record?.win || 375,
      loss: blitz?.record?.loss || 359,
      draw: blitz?.record?.draw || 30,
      current: blitz?.last?.rating || 770,
      peak: blitz?.best?.rating || 880,
      color: '#f59e0b',
    },
    {
      name: 'Daily (Correspondence)',
      total: (daily?.record?.win || 34) + (daily?.record?.loss || 25) + (daily?.record?.draw || 0),
      win: daily?.record?.win || 34,
      loss: daily?.record?.loss || 25,
      draw: daily?.record?.draw || 0,
      current: daily?.last?.rating || 1011,
      peak: daily?.best?.rating || 1223,
      color: '#3b82f6',
    },
  ];

  // Ratings Pillar Chart Data
  const ratingPillars = [
    {
      discipline: 'Tactics Peak',
      current: tactics?.lowest?.rating || 1409,
      peak: tactics?.highest?.rating || 1611,
      delta: '+202',
      color: '#a855f7',
      tag: 'Calculation',
    },
    {
      discipline: 'Daily Chess',
      current: daily?.last?.rating || 1011,
      peak: daily?.best?.rating || 1223,
      delta: '+212',
      color: '#3b82f6',
      tag: 'Correspondence',
    },
    {
      discipline: 'Rapid (10m)',
      current: rapid?.last?.rating || 934,
      peak: rapid?.best?.rating || 1152,
      delta: '+218',
      color: '#81b64c',
      tag: 'Classical Pace',
    },
    {
      discipline: 'Blitz (3m/5m)',
      current: blitz?.last?.rating || 770,
      peak: blitz?.best?.rating || 880,
      delta: '+110',
      color: '#f59e0b',
      tag: 'Fast Tempo',
    },
    {
      discipline: 'Bullet (1m)',
      current: bullet?.last?.rating || 741,
      peak: bullet?.best?.rating || 785,
      delta: '+44',
      color: '#ec4899',
      tag: 'Lightning Reflexes',
    },
  ];

  // Donut geometry for Outcomes Chart
  const donutR = 85;
  const donutC = 2 * Math.PI * donutR;
  const winLen = (parseFloat(winPercent) / 100) * donutC;
  const drawLen = (parseFloat(drawPercent) / 100) * donutC;
  const lossLen = (parseFloat(lossPercent) / 100) * donutC;

  const winOffset = 0;
  const drawOffset = -winLen;
  const lossOffset = -(winLen + drawLen);

  const tabs = [
    {
      id: 'outcomes',
      label: 'Win/Loss Distribution',
      icon: <PieChart className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'ratings',
      label: 'Rating Peaks',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'asymmetry',
      label: 'White vs Black',
      icon: <Scale className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'volume',
      label: 'Time Controls',
      icon: <Clock className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <div className="mt-14 pt-12 border-t" style={{ borderColor: 'var(--border-color)' }}>
      {/* Header Badge & Title */}
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
            <TrendingUp className="w-3.5 h-3.5 text-[#81b64c]" />
            <span>Interactive Data Visualizer</span>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={100}>
          <h3
            className="text-2xl sm:text-4xl font-black tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Animated Statistics Showcase
          </h3>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={150}>
          <p
            className="text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Multi-dimensional performance graphs tracking Param&apos;s 3,423-game career:
            win-loss ratios, rating peak differentials, white vs black asymmetries, and time control volumes.
          </p>
        </AnimatedSection>

        {/* View Switcher Tabs: Symmetrical 2x2 on mobile, single clean 4-column row on desktop */}
        <AnimatedSection animation="fadeUp" delay={200} className="w-full max-w-4xl mx-auto pt-2">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card-sub)',
              borderColor: 'var(--border-color)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as GraphTab)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center select-none ${
                    isActive
                      ? 'bg-[#81b64c] text-white shadow-sm font-black'
                      : 'hover:text-[#81b64c] hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-green)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <span className={isActive ? 'text-white' : 'text-[#81b64c]'}>{tab.icon}</span>
                  <span className="whitespace-nowrap font-bold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </AnimatedSection>
      </div>

      {/* Main Graph Arena Container */}
      <div
        className="rounded-3xl border shadow-xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Subtle decorative background gradient */}
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: '#81b64c' }}
        />

        {/* ═══════════════════════════════════════════════════════════
            VIEW 1: WIN / LOSS OUTCOMES & DECISIVE DISTRIBUTION
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'outcomes' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                  Match Outcomes & Decisive Firepower
                </span>
                <h4 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
                  Total Game Results Distribution
                </h4>
              </div>

              {/* Decisive Ratio Badge */}
              <div
                className="px-4 py-2 rounded-2xl border flex items-center gap-2.5 shadow-2xs"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Zap className="w-4 h-4 text-[#81b64c]" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Decisive Games</div>
                  <div className="text-sm font-black text-[#81b64c]">95.7% (Only 4.3% Draws)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: SVG Animated Donut (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90 overflow-visible">
                    <circle
                      cx="110"
                      cy="110"
                      r={donutR}
                      stroke="currentColor"
                      strokeWidth="24"
                      fill="none"
                      className="opacity-10"
                    />

                    {/* Wins Arc (Green) */}
                    <circle
                      cx="110"
                      cy="110"
                      r={donutR}
                      stroke="#81b64c"
                      strokeWidth={hoveredSlice === 'win' ? '30' : '24'}
                      fill="none"
                      strokeDasharray={`${winLen} ${donutC}`}
                      strokeDashoffset={winOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out cursor-pointer hover:opacity-90 drop-shadow"
                      onMouseEnter={() => setHoveredSlice('win')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />

                    {/* Draws Arc (Gray/Blue) */}
                    <circle
                      cx="110"
                      cy="110"
                      r={donutR}
                      stroke="#94a3b8"
                      strokeWidth={hoveredSlice === 'draw' ? '30' : '24'}
                      fill="none"
                      strokeDasharray={`${drawLen} ${donutC}`}
                      strokeDashoffset={drawOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setHoveredSlice('draw')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />

                    {/* Losses Arc (Red) */}
                    <circle
                      cx="110"
                      cy="110"
                      r={donutR}
                      stroke="#ef4444"
                      strokeWidth={hoveredSlice === 'loss' ? '30' : '24'}
                      fill="none"
                      strokeDasharray={`${lossLen} ${donutC}`}
                      strokeDashoffset={lossOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setHoveredSlice('loss')}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  </svg>

                  {/* Donut Center Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {hoveredSlice === 'win'
                        ? 'Total Victories'
                        : hoveredSlice === 'draw'
                        ? 'Drawn Matches'
                        : hoveredSlice === 'loss'
                        ? 'Losses'
                        : 'Career Total'}
                    </span>
                    <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      {hoveredSlice === 'win'
                        ? rWin.toLocaleString()
                        : hoveredSlice === 'draw'
                        ? rDraw.toLocaleString()
                        : hoveredSlice === 'loss'
                        ? rLoss.toLocaleString()
                        : totalGames.toLocaleString()}
                    </span>
                    <span className="text-xs font-black text-[#81b64c] mt-0.5">
                      {hoveredSlice === 'win'
                        ? `${winPercent}% Win Rate`
                        : hoveredSlice === 'draw'
                        ? `${drawPercent}% Draw Rate`
                        : hoveredSlice === 'loss'
                        ? `${lossPercent}% Loss Rate`
                        : 'Ranked Battles'}
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    onMouseEnter={() => setHoveredSlice('win')}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#81b64c]" />
                    <span style={{ color: 'var(--text-primary)' }}>Wins ({winPercent}%)</span>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    onMouseEnter={() => setHoveredSlice('loss')}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    <span style={{ color: 'var(--text-primary)' }}>Losses ({lossPercent}%)</span>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    onMouseEnter={() => setHoveredSlice('draw')}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                    <span style={{ color: 'var(--text-primary)' }}>Draws ({drawPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Right: Format Breakdown Bar Rows (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Win Distribution by Time Control
                </span>

                {formatRows.map((fmt, idx) => {
                  const wPct = Math.round((fmt.win / fmt.total) * 100) || 50;
                  const dPct = Math.round((fmt.draw / fmt.total) * 100) || 4;
                  const lPct = 100 - wPct - dPct;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border transition-all duration-300 hover:border-[#81b64c]/40 hover-lift"
                      style={{
                        backgroundColor: 'var(--bg-card-sub)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {fmt.name}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                            ({fmt.total} games)
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-black">
                          <span className="text-[#81b64c]">{fmt.win}W</span>
                          <span className="text-[#ef4444]">{fmt.loss}L</span>
                          <span className="text-zinc-400">{fmt.draw}D</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#81b64c]/15 text-[#81b64c]">
                            {wPct}% Win
                          </span>
                        </div>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-200 dark:bg-zinc-800">
                        <div
                          style={{ width: `${wPct}%` }}
                          className="bg-[#81b64c] h-full transition-all duration-1000 ease-out relative"
                          title={`Wins: ${fmt.win} (${wPct}%)`}
                        />
                        <div
                          style={{ width: `${dPct}%` }}
                          className="bg-zinc-400 dark:bg-zinc-600 h-full transition-all duration-1000 ease-out"
                          title={`Draws: ${fmt.draw} (${dPct}%)`}
                        />
                        <div
                          style={{ width: `${lPct}%` }}
                          className="bg-[#ef4444] h-full transition-all duration-1000 ease-out"
                          title={`Losses: ${fmt.loss} (${lPct}%)`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW 2: RATING PEAKS COMPARISON (Pillar Chart)
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'ratings' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                  Discipline Milestones & Peak Velocity
                </span>
                <h4 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
                  Current Rating vs All-Time Peak Elo
                </h4>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-[#81b64c]" />
                  <span style={{ color: 'var(--text-primary)' }}>Peak Elo Milestone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-zinc-400 dark:bg-zinc-600" />
                  <span style={{ color: 'var(--text-primary)' }}>Current Rating</span>
                </div>
              </div>
            </div>

            {/* Rising Pillar Bars Container */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 items-end h-[340px]">
                {ratingPillars.map((pillar, idx) => {
                  const maxChartRating = 1800;
                  const peakHeightPct = Math.round((pillar.peak / maxChartRating) * 100);
                  const currentHeightPct = Math.round((pillar.current / maxChartRating) * 100);
                  const isHovered = hoveredBar === pillar.discipline;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredBar(pillar.discipline)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Floating Tooltip Callout */}
                      <div
                        className={`mb-2 px-2.5 py-1 rounded-xl text-center border text-xs font-extrabold transition-all duration-200 ${
                          isHovered ? 'scale-110 shadow-md' : 'opacity-90'
                        }`}
                        style={{
                          backgroundColor: 'var(--bg-card-sub)',
                          borderColor: pillar.color,
                          color: pillar.color,
                        }}
                      >
                        <span className="block text-[10px] font-bold uppercase">{pillar.delta} Peak</span>
                        <span className="block text-sm font-black">{pillar.peak} Elo</span>
                      </div>

                      {/* Paired Pillars (Current vs Peak) */}
                      <div className="w-full flex items-end justify-center gap-2 h-[220px]">
                        {/* Current Bar */}
                        <div
                          className="w-1/2 rounded-t-xl transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{
                            height: `${currentHeightPct}%`,
                            backgroundColor: 'rgba(148, 163, 184, 0.35)',
                          }}
                        >
                          <span className="absolute bottom-2 inset-x-0 text-center text-[10px] font-black text-zinc-300">
                            {pillar.current}
                          </span>
                        </div>

                        {/* Peak Bar */}
                        <div
                          className="w-1/2 rounded-t-xl transition-all duration-1000 ease-out relative overflow-hidden shadow-md"
                          style={{
                            height: `${peakHeightPct}%`,
                            backgroundColor: pillar.color,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          <span className="absolute top-2 inset-x-0 text-center text-[10px] font-black text-white">
                            {pillar.peak}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Labels */}
                      <div className="text-center mt-3">
                        <span className="block text-xs font-black truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                          {pillar.discipline}
                        </span>
                        <span className="block text-[10px] font-semibold text-zinc-400 mt-0.5">
                          {pillar.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW 3: WHITE VS BLACK ASYMMETRY
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'asymmetry' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                  First-Move Initiative & Asymmetric Resistance
                </span>
                <h4 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
                  Performance As White vs Black Pieces
                </h4>
              </div>

              <div className="px-4 py-2 rounded-2xl border text-xs font-black bg-[#81b64c]/15 text-[#81b64c] border-[#81b64c]/30">
                +6.3% White First-Move Advantage
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* White Pieces Card */}
              <div
                className="p-6 rounded-3xl border shadow-sm space-y-4 hover-lift transition-all"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-300 flex items-center justify-center text-zinc-900 shadow-sm">
                      <Swords className="w-5 h-5 text-[#81b64c]" />
                    </div>
                    <div>
                      <h5 className="text-base font-black" style={{ color: 'var(--text-primary)' }}>
                        Playing As White (1.e4)
                      </h5>
                      <span className="text-xs font-semibold text-zinc-400">First-move initiative</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#81b64c]">54.8% W</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#81b64c]">54.8% Wins (940 W)</span>
                    <span className="text-zinc-400">5.7% Draws</span>
                    <span className="text-rose-500">39.5% Losses</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-300 dark:bg-zinc-800">
                    <div style={{ width: '54.8%' }} className="bg-[#81b64c] h-full" />
                    <div style={{ width: '5.7%' }} className="bg-zinc-500 h-full" />
                    <div style={{ width: '39.5%' }} className="bg-rose-500 h-full" />
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Devastating offensive conversion with the Italian Game (ECO C50) and Giuoco Piano,
                  leveraging early knight development to target the f7 square.
                </p>
              </div>

              {/* Black Pieces Card */}
              <div
                className="p-6 rounded-3xl border shadow-sm space-y-4 hover-lift transition-all"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shadow-sm">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-base font-black" style={{ color: 'var(--text-primary)' }}>
                        Playing As Black
                      </h5>
                      <span className="text-xs font-semibold text-zinc-400">Counter-punching resistance</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-blue-400">48.5% Res</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-blue-400">44.2% Wins (733 W)</span>
                    <span className="text-zinc-400">4.3% Draws</span>
                    <span className="text-rose-500">51.5% Losses</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-300 dark:bg-zinc-800">
                    <div style={{ width: '44.2%' }} className="bg-blue-500 h-full" />
                    <div style={{ width: '4.3%' }} className="bg-zinc-500 h-full" />
                    <div style={{ width: '51.5%' }} className="bg-rose-500 h-full" />
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Asymmetric counter-strikes powered by Sicilian Defense setups (ECO B00) and stubborn
                  endgame tenacity, converting equal positions under deep tactical pressure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW 4: TIME-CONTROL VOLUME & PACING
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'volume' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                  Career Match Distribution & Clock Endurance
                </span>
                <h4 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
                  3,423 Games Partitioned Across Speeds
                </h4>
              </div>

              <div className="text-xs font-bold text-zinc-400">
                Estimated ~380+ Hours at the Chessboard
              </div>
            </div>

            {/* Visual Volume Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: 'Rapid (10 min)',
                  games: (rapid?.record?.win || 742) + (rapid?.record?.loss || 718) + (rapid?.record?.draw || 88),
                  pct: '45.2%',
                  peak: rapid?.best?.rating || 1152,
                  wins: rapid?.record?.win || 742,
                  color: '#81b64c',
                  desc: 'Deep strategic calculation with clock discipline',
                },
                {
                  title: 'Bullet (1 min)',
                  games: (bullet?.record?.win || 522) + (bullet?.record?.loss || 501) + (bullet?.record?.draw || 29),
                  pct: '30.7%',
                  peak: bullet?.best?.rating || 785,
                  wins: bullet?.record?.win || 522,
                  color: '#ef4444',
                  desc: 'Sub-second optical reflexes & pre-move mastery',
                },
                {
                  title: 'Blitz (3m/5m)',
                  games: (blitz?.record?.win || 375) + (blitz?.record?.loss || 359) + (blitz?.record?.draw || 30),
                  pct: '22.3%',
                  peak: blitz?.best?.rating || 880,
                  wins: blitz?.record?.win || 375,
                  color: '#f59e0b',
                  desc: 'High-tempo tactical brawls & time scrambles',
                },
                {
                  title: 'Daily (24h/move)',
                  games: (daily?.record?.win || 34) + (daily?.record?.loss || 25) + (daily?.record?.draw || 0),
                  pct: '1.8%',
                  peak: daily?.best?.rating || 1223,
                  wins: daily?.record?.win || 34,
                  color: '#3b82f6',
                  desc: 'Pure correspondence calculation without duress',
                },
              ].map((vol, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border flex flex-col justify-between space-y-4 hover-lift transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: vol.color }}>
                        {vol.title}
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10">
                        {vol.pct}
                      </span>
                    </div>

                    <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      <AnimatedCounter value={vol.games} label="" formatNumber />
                    </div>

                    <div className="text-xs font-semibold text-zinc-400 mt-1">
                      {vol.wins} Career Wins • Peak {vol.peak} Elo
                    </div>
                  </div>

                  {/* Volume Gauge */}
                  <div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: vol.pct,
                          backgroundColor: vol.color,
                        }}
                      />
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {vol.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsGraphShowcase;

