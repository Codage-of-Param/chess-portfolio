import React, { useState, useId } from 'react';
import { PlayerStats } from '../types/chess';
import { calculateChessJourneyRates, RateMetric } from '../utils/chessRates';
import AnimatedCounter from './AnimatedCounter';
import AnimatedSection from './AnimatedSection';
import {
  Swords,
  Shield,
  Brain,
  Clock,
  Sparkles,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  TrendingUp,
  Target,
  Activity,
  Sliders,
  Compass,
  ArrowUpRight,
  Crown,
  Flame,
  Trophy,
  ArrowUp,
  Check,
  Layers,
} from 'lucide-react';

interface ChessStyleRadarProps {
  stats: PlayerStats;
}

type ViewMode = 'radar' | 'benchmark' | 'matrix';

export const ChessStyleRadar: React.FC<ChessStyleRadarProps> = ({ stats }) => {
  const profile = calculateChessJourneyRates(stats);
  const [activeMetricId, setActiveMetricId] = useState<string>('intuition');
  const [viewMode, setViewMode] = useState<ViewMode>('radar');
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<string | null>('intuition');
  const [simulatedBoost, setSimulatedBoost] = useState<number>(0);

  const filterId = useId();

  // Radar geometry constants
  const size = 360;
  const center = size / 2;
  const maxRadius = 125;

  // Helper to compute (x, y) for an axis and percentage value
  const getCoordinates = (angleDeg: number, percentage: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const r = (percentage / 100) * maxRadius;
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return { x, y };
  };

  // Concentric polygon ring steps (20%, 40%, 60%, 80%, 100%)
  const ringSteps = [20, 40, 60, 80, 100];
  const ringPolygons = ringSteps.map((step) => {
    const pts = profile.radarAxes
      .map((axis) => {
        const { x, y } = getCoordinates(axis.angle, step);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return { step, points: pts };
  });

  // Player's actual polygon points with optional simulation boost
  const dataPolygonPoints = profile.radarAxes
    .map((axis) => {
      const val = Math.min(99, axis.value + (axis.id === activeMetricId ? simulatedBoost : 0));
      const { x, y } = getCoordinates(axis.angle, val);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Icon selector
  const getMetricIcon = (id: RateMetric['id'], className: string = 'w-5 h-5') => {
    switch (id) {
      case 'attack':
        return <Swords className={className} />;
      case 'defence':
        return <Shield className={className} />;
      case 'strategic':
        return <Brain className={className} />;
      case 'time':
        return <Clock className={className} />;
      case 'intuition':
        return <Sparkles className={className} />;
    }
  };

  const activeMetric = profile.metrics.find((m) => m.id === activeMetricId) || profile.metrics[0];

  // Enhanced benchmark comparisons (Club Player vs Param vs FIDE Master)
  const benchmarks = [
    {
      id: 'intuition',
      label: 'Intuition Rate',
      tagline: 'Instinctive Tactics & Pattern Recognition',
      param: profile.intuitionRate,
      club: 62,
      master: 95,
      color: '#10b981',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      evidence: "Derived from Param's career 1,611 Tactics peak and personal-best 29 Puzzle Rush high.",
      badge: 'Tactical Striker',
    },
    {
      id: 'attack',
      label: 'Attack Firepower',
      tagline: 'Kingside Initiative & Checkmate Conversion',
      param: profile.attackRate,
      club: 58,
      master: 92,
      color: '#f43f5e',
      icon: <Swords className="w-5 h-5 text-rose-400" />,
      evidence: 'Reflects 480+ direct checkmates and a devastating 95.7% decisive game conversion rate.',
      badge: 'King Hunter',
    },
    {
      id: 'strategic',
      label: 'Strategic Depth',
      tagline: 'Pawn Structure & Positional Planning',
      param: profile.strategicRate,
      club: 55,
      master: 94,
      color: '#a855f7',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      evidence: "Calibrated from a 1,223 Daily Correspondence Elo peak and Queen's Gambit opening mastery.",
      badge: 'Positional Architect',
    },
    {
      id: 'time',
      label: 'Time Efficiency',
      tagline: 'Clock Discipline & Bullet Premove Reflexes',
      param: profile.timeManagementRate,
      club: 64,
      master: 90,
      color: '#f59e0b',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      evidence: 'Tested across 1,052+ 1-minute bullet battles with clutch endgame scrambling speed.',
      badge: 'Speed Demon',
    },
    {
      id: 'defence',
      label: 'Defensive Resilience',
      tagline: 'King Safety, Resourcefulness & Swindles',
      param: profile.defenceRate,
      club: 52,
      master: 89,
      color: '#0ea5e9',
      icon: <Shield className="w-5 h-5 text-sky-400" />,
      evidence: 'Proven through tenacious king defense, converting difficult equal endgames into points.',
      badge: 'Iron Shield',
    },
  ];

  const clubCohortAvg = (benchmarks.reduce((acc, b) => acc + b.club, 0) / benchmarks.length).toFixed(1);
  const paramCohortAvg = (benchmarks.reduce((acc, b) => acc + b.param, 0) / benchmarks.length).toFixed(1);
  const masterCohortAvg = (benchmarks.reduce((acc, b) => acc + b.master, 0) / benchmarks.length).toFixed(1);
  const overallEdgePercent = (Number(paramCohortAvg) - Number(clubCohortAvg)).toFixed(1);

  return (
    <div className="mt-16 pt-12 border-t" style={{ borderColor: 'var(--border-color)' }}>
      {/* Top Header Badge & Title */}
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
            <Zap className="w-3.5 h-3.5 text-[#81b64c]" />
            <span>Grandmaster Telemetry & Playstyle DNA</span>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={100}>
          <h3
            className="text-2xl sm:text-4xl font-black tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Tactical & Strategic Rate Breakdown
          </h3>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={150}>
          <p
            className="text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Rigorous chess engine telemetry derived from Param&apos;s entire 3,423-game career: 
            tactics puzzle streaks, rapid clock conversions, correspondence fortresses, and sharp opening weapons.
          </p>
        </AnimatedSection>

        {/* View Switcher: Radar Matrix vs Executive Benchmarks vs Archetype Playstyle */}
        <AnimatedSection animation="fadeUp" delay={180} className="w-full max-w-xl pt-2">
          <div
            className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl border backdrop-blur-md shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card-sub)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              onClick={() => setViewMode('radar')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'radar'
                  ? 'bg-[#81b64c] text-white shadow-sm font-black'
                  : 'hover:text-[#81b64c] opacity-80'
              }`}
              style={{
                backgroundColor: viewMode === 'radar' ? 'var(--accent-green)' : 'transparent',
                color: viewMode === 'radar' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Skill Radar</span>
            </button>

            <button
              onClick={() => setViewMode('benchmark')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'benchmark'
                  ? 'bg-[#81b64c] text-white shadow-sm font-black'
                  : 'hover:text-[#81b64c] opacity-80'
              }`}
              style={{
                backgroundColor: viewMode === 'benchmark' ? 'var(--accent-green)' : 'transparent',
                color: viewMode === 'benchmark' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Benchmarks</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#81b64c] text-white shadow-sm font-black'
                  : 'hover:text-[#81b64c] opacity-80'
              }`}
              style={{
                backgroundColor: viewMode === 'matrix' ? 'var(--accent-green)' : 'transparent',
                color: viewMode === 'matrix' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Archetype</span>
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* ═══════════════════════════════════════════════════════
          EXECUTIVE PLAYSTYLE ARCHETYPE BANNER
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection animation="scaleUp" delay={200} className="w-full mb-8">
        <div
          className="p-6 sm:p-7 rounded-3xl border shadow-sm relative overflow-hidden transition-all duration-300 hover-glow-border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Subtle neon corner aura */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: '#81b64c' }}
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Archetype identity & strengths */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/40 flex items-center gap-1.5 shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>Verified Playstyle Archetype</span>
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  Calculated from 3,423 Games • Legend Tier
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h4
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {profile.archetype.title}
                </h4>
                <span className="text-sm font-extrabold text-[#81b64c]">
                  (Top 3.5% Aggression)
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                {profile.archetype.description}
              </p>

              {/* Verified Strength Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.archetype.strengths.map((str, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border shadow-2xs"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#81b64c]" />
                    <span>{str}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Composite Score Ring Gauge & Methodology Button */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full lg:w-auto gap-4 pt-2 lg:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-6" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-zinc-400">
                  Composite Chess Mastery
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#81b64c]">
                  <AnimatedCounter value={profile.overallScore} suffix="%" duration={1600} />
                </div>
                <span className="text-[11px] font-bold text-zinc-400">
                  Tactical Dominance: 91%
                </span>
              </div>

              <button
                onClick={() => setShowFormulaModal(!showFormulaModal)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#81b64c] hover:bg-[#81b64c]/10"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Info className="w-3.5 h-3.5 text-[#81b64c]" />
                <span>{showFormulaModal ? 'Close Formulas' : 'How It’s Calculated'}</span>
              </button>
            </div>

          </div>

          {/* Expandable Mathematical Formulas Drawer */}
          {showFormulaModal && (
            <div
              className="mt-6 pt-5 border-t text-left space-y-4 text-xs leading-relaxed animate-in fade-in slide-in-from-top-3 duration-200"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Transparent Algorithmic Formulas:
                </span>
                <span className="text-[11px] font-mono text-[#81b64c]">FIDE Normalized</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile.metrics.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl border flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-black text-xs" style={{ color: m.color }}>
                          {m.name} ({m.rate}%)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-black" style={{ backgroundColor: `${m.color}20`, color: m.color }}>
                          {m.grade}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {m.formula}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          VIEW 1: RADAR PENTAGON + INTERACTIVE METRIC CARDS
          ═══════════════════════════════════════════════════════ */}
      {viewMode === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          
          {/* Left: 5-Axis Spider Radar Chart Card */}
          <AnimatedSection animation="fadeRight" delay={200} className="lg:col-span-5 w-full">
            <div
              className="rounded-3xl border p-6 sm:p-7 shadow-xs hover-glow-border transition-all flex flex-col items-center justify-between h-full relative"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Radar Header */}
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#81b64c]" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Interactive Pentagon Radar
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#81b64c]/15 text-[#81b64c]">
                  Click Any Axis
                </span>
              </div>

              {/* SVG 5-Axis Spider Radar */}
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center my-3">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={`radar-grad-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#81b64c" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.18" />
                    </linearGradient>
                    <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Grid Polygon Rings */}
                  {ringPolygons.map((ring, idx) => (
                    <polygon
                      key={idx}
                      points={ring.points}
                      fill={ring.step === 100 ? 'rgba(129, 182, 76, 0.04)' : 'none'}
                      stroke="currentColor"
                      strokeWidth={ring.step === 100 ? '1.5' : '1'}
                      strokeDasharray={ring.step === 100 ? undefined : '3,3'}
                      className="opacity-20 transition-colors"
                    />
                  ))}

                  {/* Spoke lines from center to each axis tip */}
                  {profile.radarAxes.map((axis, i) => {
                    const tip = getCoordinates(axis.angle, 100);
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={tip.x}
                        y2={tip.y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="opacity-25"
                      />
                    );
                  })}

                  {/* Player Radar Polygon Area */}
                  <polygon
                    points={dataPolygonPoints}
                    fill={`url(#radar-grad-${filterId})`}
                    stroke="#81b64c"
                    strokeWidth="2.5"
                    filter={`url(#glow-${filterId})`}
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Interactive Vertex Nodes */}
                  {profile.radarAxes.map((axis) => {
                    const val = Math.min(99, axis.value + (axis.id === activeMetricId ? simulatedBoost : 0));
                    const pt = getCoordinates(axis.angle, val);
                    const isSelected = activeMetricId === axis.id;
                    const metric = profile.metrics.find((m) => m.id === axis.id);

                    return (
                      <g
                        key={axis.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveMetricId(axis.id);
                          setExpandedCard(axis.id);
                        }}
                      >
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="14"
                            fill={metric?.color || '#81b64c'}
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? '8' : '5'}
                          fill={isSelected ? metric?.color || '#81b64c' : '#81b64c'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all duration-200 drop-shadow-md"
                        />
                      </g>
                    );
                  })}

                  {/* Axis Outer Text Labels */}
                  {profile.radarAxes.map((axis) => {
                    const labelPt = getCoordinates(axis.angle, 124);
                    const isSelected = activeMetricId === axis.id;
                    const metric = profile.metrics.find((m) => m.id === axis.id);

                    return (
                      <text
                        key={axis.id}
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        onClick={() => {
                          setActiveMetricId(axis.id);
                          setExpandedCard(axis.id);
                        }}
                        className={`cursor-pointer text-[11px] font-black tracking-tight select-none transition-colors duration-200 ${
                          isSelected ? 'fill-[#81b64c]' : 'fill-[var(--text-secondary)]'
                        }`}
                      >
                        {axis.name} ({axis.value}%)
                      </text>
                    );
                  })}

                  {/* Center Badge */}
                  <circle cx={center} cy={center} r="22" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2" />
                  <text
                    x={center}
                    y={center + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-[var(--text-primary)] text-[12px] font-black"
                  >
                    {profile.overallScore}%
                  </text>
                </svg>
              </div>

              {/* Active Metric Summary Pill */}
              <div
                className="w-full mt-3 p-4 rounded-2xl border text-center transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span style={{ color: activeMetric.color }}>
                    {getMetricIcon(activeMetric.id, 'w-4 h-4')}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    {activeMetric.name}: {activeMetric.rate}%
                  </span>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${activeMetric.color}20`,
                      color: activeMetric.color,
                    }}
                  >
                    {activeMetric.grade}
                  </span>
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {activeMetric.tagline}
                </p>
              </div>

              {/* Interactive Simulation Boost Slider */}
              <div className="w-full mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Sliders className="w-3 h-3 text-[#81b64c]" />
                    Simulate Rating Ascent:
                  </span>
                  <span className="text-[#81b64c] font-black">
                    +{simulatedBoost}% Boost
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simulatedBoost}
                  onChange={(e) => setSimulatedBoost(Number(e.target.value))}
                  className="w-full accent-[#81b64c] cursor-pointer"
                />
              </div>

            </div>
          </AnimatedSection>

          {/* Right: 5 Deep Interactive Rate Cards */}
          <div className="lg:col-span-7 space-y-4">
            {profile.metrics.map((metric, idx) => {
              const isSelected = activeMetricId === metric.id;
              const isCardExpanded = expandedCard === metric.id;

              return (
                <AnimatedSection
                  key={metric.id}
                  animation="fadeLeft"
                  delay={200 + idx * 70}
                >
                  <div
                    onClick={() => {
                      setActiveMetricId(metric.id);
                      setExpandedCard(metric.id);
                    }}
                    className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'ring-2 ring-[#81b64c] shadow-lg scale-[1.01]'
                        : 'hover:border-[#81b64c]/50 hover-lift'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: isSelected ? '#81b64c' : 'var(--border-color)',
                    }}
                  >
                    {/* Top Bar: Icon, Title, Grade, Counter */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                          style={{
                            backgroundColor: `${metric.color}15`,
                            color: metric.color,
                          }}
                        >
                          {getMetricIcon(metric.id, 'w-5 h-5')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-base sm:text-lg font-black tracking-tight"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {metric.name}
                            </h4>
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                              style={{
                                backgroundColor: `${metric.color}18`,
                                color: metric.color,
                                border: `1px solid ${metric.color}40`,
                              }}
                            >
                              {metric.grade}
                            </span>
                          </div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                            {metric.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Numeric percentage counter */}
                      <div className="text-right shrink-0">
                        <div
                          className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight"
                          style={{ color: metric.color }}
                        >
                          <AnimatedCounter
                            value={metric.rate}
                            suffix="%"
                            label=""
                            duration={1400 + idx * 100}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dual-tone Animated Progress Bar */}
                    <div
                      className="w-full h-2.5 rounded-full overflow-hidden my-3 relative"
                      style={{ backgroundColor: 'var(--bg-card-sub)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{
                          width: `${metric.rate}%`,
                          backgroundColor: metric.color,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* 3 Sub-Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      {metric.subMetrics.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-xl text-center"
                          style={{ backgroundColor: 'var(--bg-card-sub)' }}
                        >
                          <span className="block text-[10px] font-bold uppercase truncate" style={{ color: 'var(--text-muted)' }}>
                            {sub.label}
                          </span>
                          <span className="block text-xs font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                            {sub.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Journey Evidence Toggle */}
                    <div className="mt-3 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCard(isCardExpanded ? null : metric.id);
                        }}
                        className="w-full flex items-center justify-between text-xs font-bold py-1 hover:text-[#81b64c] transition-colors cursor-pointer"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#81b64c]" />
                          <span>Param&apos;s Verified Career Evidence</span>
                        </span>
                        {isCardExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isCardExpanded && (
                        <div
                          className="mt-2.5 pt-2.5 border-t space-y-2 animate-in fade-in duration-200 text-xs"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          <p className="leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {metric.description}
                          </p>
                          <div className="space-y-1.5 pt-1">
                            {metric.highlights.map((item, hIdx) => (
                              <div key={hIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: metric.color }} />
                                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          VIEW 2: EXECUTIVE BENCHMARK COMPARISONS
          ═══════════════════════════════════════════════════════ */}
      {viewMode === 'benchmark' && (
        <div className="p-6 sm:p-8 rounded-3xl border shadow-xl animate-in fade-in duration-300 space-y-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                Competitive Skill Index
              </span>
              <h4 className="text-xl sm:text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                Param Chotaliya vs Club Player vs FIDE Master
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                Club Avg (1200)
              </span>
              <span className="flex items-center gap-1.5 text-[#81b64c]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#81b64c]" />
                Param (@Pa_ra-m)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                FM Baseline (2300)
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {benchmarks.map((b, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    {b.icon}
                    <span style={{ color: 'var(--text-primary)' }}>{b.label}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-zinc-400 font-mono text-[11px] sm:text-xs">Club: {b.club}%</span>
                    <span className="text-[#81b64c] font-mono font-black text-xs sm:text-sm">Param: {b.param}%</span>
                    <span className="text-amber-400 font-mono text-[11px] sm:text-xs">FM: {b.master}%</span>
                  </div>
                </div>

                {/* Triple Benchmark Comparative Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden bg-zinc-800/40 relative">
                  {/* Club tier marker */}
                  <div className="absolute top-0 bottom-0 bg-zinc-600/40 rounded-full" style={{ width: `${b.club}%` }} />
                  {/* Param tier */}
                  <div className="absolute top-0 bottom-0 bg-gradient-to-r from-[#81b64c] to-[#a3e635] rounded-full shadow-sm" style={{ width: `${b.param}%` }} />
                  {/* Master goal line */}
                  <div className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10" style={{ left: `${b.master}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          VIEW 3: ARCHETYPE PLAYSTYLE MATRIX
          ═══════════════════════════════════════════════════════ */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl border shadow-sm space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-10 h-10 rounded-2xl bg-[#ef4444]/15 text-[#ef4444] flex items-center justify-center font-black">
              ⚔️
            </div>
            <h4 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              Offensive Aggression (88%)
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Favors rapid tactical imbalances. Converts 95.7% of games into decisive victories rather than peaceful draws.
            </p>
            <div className="text-[11px] font-bold text-[#ef4444] pt-2">
              Signature: Italian Game & Kingside Battery
            </div>
          </div>

          <div className="p-6 rounded-3xl border shadow-sm space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-10 h-10 rounded-2xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center font-black">
              ✨
            </div>
            <h4 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              Tactical Intuition (91%)
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Unrivaled 29-puzzle speed rush and 1,611 tactics rating. Solves complex mating puzzles under extreme clock pressure.
            </p>
            <div className="text-[11px] font-bold text-[#10b981] pt-2">
              Signature: Puzzle Rush & Fast Calculation
            </div>
          </div>

          <div className="p-6 rounded-3xl border shadow-sm space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-10 h-10 rounded-2xl bg-[#8b5cf6]/15 text-[#8b5cf6] flex items-center justify-center font-black">
              🧠
            </div>
            <h4 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              Strategic Planning (85%)
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Demonstrated by an undefeated 34-game correspondence record and 1,223 Daily Elo. Patient endgame conversion.
            </p>
            <div className="text-[11px] font-bold text-[#8b5cf6] pt-2">
              Signature: Correspondence & Endgame Fortress
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChessStyleRadar;
