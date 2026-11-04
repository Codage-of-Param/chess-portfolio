import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats } from '../types/chess';
import { TrendingUp, Award, Play, RotateCcw, Repeat, Sparkles, Zap, Check } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';

interface RatingAscentProps {
  stats: PlayerStats;
  username: string;
}

export const RatingAscent: React.FC<RatingAscentProps> = ({ stats, username }) => {
  const [selectedFormat, setSelectedFormat] = useState<'rapid' | 'blitz' | 'bullet' | 'daily'>('rapid');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isLooping, setIsLooping] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const loopTimeoutRef = useRef<any>(null);
  const isLoopingRef = useRef(false);
  isLoopingRef.current = isLooping;

  const rapidRecord = stats.chess_rapid?.record;
  const blitzRecord = stats.chess_blitz?.record;
  const bulletRecord = stats.chess_bullet?.record;
  const dailyRecord = stats.chess_daily?.record;

  const totalGames =
    (rapidRecord ? rapidRecord.win + rapidRecord.loss + rapidRecord.draw : 0) +
    (blitzRecord ? blitzRecord.win + blitzRecord.loss + blitzRecord.draw : 0) +
    (bulletRecord ? bulletRecord.win + bulletRecord.loss + bulletRecord.draw : 0) +
    (dailyRecord ? dailyRecord.win + dailyRecord.loss + dailyRecord.draw : 0) || 3423;

  const currentDetail =
    selectedFormat === 'rapid'
      ? stats.chess_rapid
      : selectedFormat === 'blitz'
      ? stats.chess_blitz
      : selectedFormat === 'bullet'
      ? stats.chess_bullet
      : stats.chess_daily;

  const currentRating =
    currentDetail?.last?.rating ||
    (selectedFormat === 'rapid' ? 934 : selectedFormat === 'blitz' ? 770 : selectedFormat === 'bullet' ? 741 : 1011);
  const bestRating =
    currentDetail?.best?.rating ||
    (selectedFormat === 'rapid' ? 1152 : selectedFormat === 'blitz' ? 880 : selectedFormat === 'bullet' ? 785 : 1223);
  const bestDate = currentDetail?.best?.date
    ? new Date(currentDetail.best.date * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2025';

  // Exact historical ratings extracted from @Pa_ra-m's Chess.com archives
  const REAL_RATING_CURVES = {
    rapid: [
      { label: 'Apr 2023', rating: 447, milestone: '447 Start', desc: 'First rated rapid battle logged on Chess.com' },
      { label: 'Dec 2023', rating: 383, milestone: null, desc: 'Early learning curve & rapid tactical practice' },
      { label: 'May 2024', rating: 424, milestone: null, desc: 'Opening repertoire development in Italian Game' },
      { label: 'Oct 2024', rating: 729, milestone: '729', desc: 'Breakthrough 700+ benchmark shattered' },
      { label: 'Mar 2025', rating: 834, milestone: '834', desc: 'Rapid 10-minute climb crossing 800+ tier' },
      { label: 'Aug 2025', rating: 1152, milestone: '1152 Peak', desc: 'All-time career pinnacle rating (Aug 17, 2025 vs Ajith_chandolu)!' },
      { label: 'Jan 2026', rating: 984, milestone: null, desc: 'High-tier competitive resilience against 1000+ players' },
      { label: 'Current', rating: currentDetail?.last?.rating || 934, milestone: `${currentDetail?.last?.rating || 934} Live`, desc: `Currently active at ${currentDetail?.last?.rating || 934} Elo across 1,548+ rapid games` },
    ],
    blitz: [
      { label: 'Dec 2023', rating: 147, milestone: '147 Start', desc: 'First blitz scramble logged on Chess.com' },
      { label: 'May 2024', rating: 256, milestone: null, desc: 'Speed calculation & 3-minute reflexes training' },
      { label: 'Oct 2024', rating: 385, milestone: null, desc: 'Clock management & sharp tactical awareness' },
      { label: 'Mar 2025', rating: 537, milestone: '537', desc: 'Crossing 500+ Blitz benchmark' },
      { label: 'Aug 2025', rating: 746, milestone: '746', desc: '700+ Blitz tier breakthrough' },
      { label: 'Oct 2025', rating: 880, milestone: '880 Peak', desc: 'All-time career Blitz peak of 880 Elo!' },
      { label: 'Jan 2026', rating: 812, milestone: null, desc: 'Consistent 800+ blitz performance' },
      { label: 'Current', rating: currentDetail?.last?.rating || 770, milestone: `${currentDetail?.last?.rating || 770} Live`, desc: `Active at ${currentDetail?.last?.rating || 770} Elo across 764+ blitz battles` },
    ],
    bullet: [
      { label: 'Apr 2023', rating: 460, milestone: '460 Start', desc: 'Initial 1-minute bullet lightning matches' },
      { label: 'May 2024', rating: 495, milestone: null, desc: 'Instinctive pre-moving & speed calibration' },
      { label: 'Oct 2024', rating: 539, milestone: null, desc: 'Overcoming 500+ bullet threshold' },
      { label: 'Mar 2025', rating: 759, milestone: '759', desc: 'Aggressive 750+ bullet milestone crossed' },
      { label: 'Aug 2025', rating: 785, milestone: '785 Peak', desc: 'All-time career Bullet peak of 785 Elo!' },
      { label: 'Jan 2026', rating: 762, milestone: null, desc: 'Sub-second speed resilience against high-rated opponents' },
      { label: 'Current', rating: currentDetail?.last?.rating || 741, milestone: `${currentDetail?.last?.rating || 741} Live`, desc: `Active at ${currentDetail?.last?.rating || 741} Elo across 1,052+ bullet games` },
    ],
    daily: [
      { label: 'Apr 2023', rating: 800, milestone: '800 Start', desc: 'Initial multi-day correspondence challenges' },
      { label: 'May 2024', rating: 950, milestone: '950', desc: 'Deep candidate move calculation' },
      { label: 'Oct 2024', rating: 1223, milestone: '1223 Peak', desc: 'All-time career Daily pinnacle of 1223 Elo (vs SonuDon1993)!' },
      { label: 'Jan 2026', rating: 1080, milestone: null, desc: 'Tournament daily match defense' },
      { label: 'Current', rating: currentDetail?.last?.rating || 1011, milestone: `${currentDetail?.last?.rating || 1011} Live`, desc: `Active at ${currentDetail?.last?.rating || 1011} Elo across 59 correspondence games` },
    ],
  };

  const chartData = REAL_RATING_CURVES[selectedFormat];
  const startRating = chartData[0].rating;

  const svgWidth = 860;
  const svgHeight = 340;
  const paddingX = 60;
  const paddingY = 40;

  const minVal = Math.floor((startRating - 80) / 100) * 100;
  const maxVal = Math.ceil((bestRating + 80) / 100) * 100;

  const getX = (index: number) => paddingX + (index / (chartData.length - 1)) * (svgWidth - 2 * paddingX);
  const getY = (val: number) => svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 2 * paddingY);

  const pathD = chartData.reduce((acc, point, index) => {
    const x = getX(index);
    const y = getY(point.rating);
    if (index === 0) return `M ${x} ${y}`;

    const prevX = getX(index - 1);
    const prevY = getY(chartData[index - 1].rating);
    const cp1x = prevX + (x - prevX) / 2;
    const cp1y = prevY;
    const cp2x = prevX + (x - prevX) / 2;
    const cp2y = y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
  }, '');

  const firstX = getX(0);
  const lastX = getX(chartData.length - 1);
  const bottomY = svgHeight - paddingY;
  const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // Start-to-end continuous or one-shot line drawing animation
  const runStartToEndAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

    setProgress(0);

    const startTime = performance.now();
    const duration = 2000; // 2 seconds smooth start-to-end line sweep

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth cubic-bezier ease out
      const ease = 1 - Math.pow(1 - t, 3);
      setProgress(ease);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        setProgress(1);
        if (isLoopingRef.current) {
          loopTimeoutRef.current = setTimeout(() => {
            runStartToEndAnimation();
          }, 1600);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(frame);
  }, []);

  // Trigger on mount and format change
  useEffect(() => {
    const timer = setTimeout(() => {
      runStartToEndAnimation();
    }, 120);
    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [selectedFormat, runStartToEndAnimation]);

  // IntersectionObserver: trigger when scrolled into view
  useEffect(() => {
    const node = chartContainerRef.current;
    if (!node) return;

    let hasTriggeredInView = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredInView) {
          hasTriggeredInView = true;
          runStartToEndAnimation();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [runStartToEndAnimation]);

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    isLoopingRef.current = next;
    if (next && progress >= 1) {
      runStartToEndAnimation();
    }
  };

  const peakIndex = chartData.findIndex((p) => p.rating === bestRating);
  const peakX = getX(peakIndex >= 0 ? peakIndex : 6);
  const peakY = getY(bestRating);

  const liveIndex = chartData.length - 1;
  const liveX = getX(liveIndex);
  const liveY = getY(currentRating);

  // Active clip width: reveals area and curve exactly up to current progress
  const clipWidth = firstX + progress * (lastX - firstX + 2);

  const activeHighlightedPoint = hoveredPoint || (activeStep !== null ? chartData[activeStep] : null);

  return (
    <section
      id="rating"
      className="py-20 border-y relative overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#81b64c]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <AnimatedSection animation="fadeDown" delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider hover-lift transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Param&apos;s Elo Progression</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              The Rating Ascent
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <p
              className="text-base max-w-2xl font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Tracking Param&apos;s competitive rating progression since joining in April 2023. 
              Explore rating peaks, tactical breakthroughs, and time-control evolutions.
            </p>
          </AnimatedSection>
        </div>

        {/* Top Metric Bar, Animation Controls & Format Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          
          {/* Key Metric Snapshot */}
          <AnimatedSection animation="fadeLeft" delay={300} className="w-full lg:w-auto">
            <div
              className="flex items-center gap-6 p-4 px-6 rounded-2xl border shadow-xs hover-glow-border transition-all w-full sm:w-auto"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Total Rated Games
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                    <AnimatedCounter value={totalGames} label="" formatNumber duration={1500} />
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                    RATED
                  </span>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Current {selectedFormat.toUpperCase()} Elo: <strong>{currentRating}</strong>
                </span>
              </div>

              <div className="h-10 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  All-Time Peak
                </span>
                <span className="text-2xl font-black text-[#81b64c] flex items-center gap-1">
                  <AnimatedCounter value={bestRating} label="" duration={1200} />
                </span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{bestDate}</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Action Toolbar: Line Start-to-End Controls & Format Switcher */}
          <AnimatedSection animation="fadeRight" delay={300} className="w-full lg:w-auto flex flex-wrap items-center justify-start lg:justify-end gap-3">
            
            {/* Start to End Animation Controls */}
            <div
              className="flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Replay Line Drawing Animation (Start to End) */}
              <button
                onClick={runStartToEndAnimation}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#81b64c] hover:bg-[#81b64c]/10"
                title="Watch line draw smoothly from Start to End"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${progress > 0 && progress < 1 ? 'animate-spin' : ''}`} />
                <span>Draw Line</span>
              </button>

              {/* Loop Animation Toggle */}
              <button
                onClick={toggleLoop}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all press-scale cursor-pointer ${
                  isLooping
                    ? 'bg-[#81b64c] text-white shadow-sm'
                    : 'text-[#81b64c] hover:bg-[#81b64c]/10'
                }`}
                title={isLooping ? 'Continuous loop active' : 'Click to enable continuous drawing loop'}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{isLooping ? 'Looping' : 'Loop'}</span>
              </button>
            </div>

            {/* Time Control Format Switcher */}
            <div
              className="flex items-center p-1.5 rounded-2xl border shadow-2xs overflow-x-auto max-w-full"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              {(['rapid', 'blitz', 'bullet', 'daily'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all press-scale cursor-pointer shrink-0"
                  style={{
                    backgroundColor: selectedFormat === fmt ? 'var(--bg-card)' : 'transparent',
                    color: selectedFormat === fmt ? 'var(--accent-green)' : 'var(--text-secondary)',
                    boxShadow: selectedFormat === fmt ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>

          </AnimatedSection>

        </div>

        {/* Animated Chart Canvas Container */}
        <AnimatedSection animation="scaleUp" delay={400}>
          <div
            ref={chartContainerRef}
            className="relative rounded-3xl border p-4 sm:p-8 shadow-sm overflow-hidden hover-glow-border transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Top Right Milestone Badge */}
            <div
              className="absolute top-6 right-8 hidden md:flex items-center gap-3 p-3 px-4 rounded-2xl border shadow-xs animate-breathe"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#81b64c]" style={{ backgroundColor: 'var(--accent-green-bg)' }}>
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Peak Milestone
                </span>
                <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                  {bestRating} Elo Peak
                </span>
              </div>
            </div>

            {/* Live Line Draw Progress Tracker */}
            {progress < 1 && progress > 0 && (
              <div className="mb-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold mb-1 text-[#81b64c]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Tracing Rating Curve: {Math.round(progress * 100)}%
                  </span>
                  <span className="font-mono text-[11px] opacity-75">
                    Apr 2023 → Current
                  </span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-card-sub)' }}>
                  <div
                    className="h-full bg-gradient-to-r from-[#81b64c] via-[#a3e635] to-[#81b64c] transition-all duration-75 rounded-full"
                    style={{
                      width: `${progress * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* SVG Chart with Start-to-End Line Animation */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto min-w-0 select-none block"
              >
                <defs>
                  {/* Subtle Glow Filter */}
                  <filter id="ascentGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient Area Fill */}
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81b64c" stopOpacity="0.45" />
                    <stop offset="55%" stopColor="#81b64c" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#81b64c" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Clip Path to reveal area in sync with the line tip */}
                  <clipPath id="graphDrawClip">
                    <rect
                      x="0"
                      y="0"
                      width={Math.max(firstX, clipWidth + 2)}
                      height={svgHeight}
                    />
                  </clipPath>
                </defs>

                {/* Grid Lines */}
                {[minVal, Math.round((minVal + maxVal) / 2), maxVal].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                        className="opacity-15"
                      />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="11"
                        fontWeight="600"
                        fill="currentColor"
                        className="opacity-50"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area: Sweeps smoothly from Start to End */}
                <path
                  d={areaD}
                  fill="url(#chartGradient)"
                  clipPath="url(#graphDrawClip)"
                  style={{
                    opacity: progress > 0.02 ? 1 : 0,
                    transition: 'opacity 300ms ease',
                  }}
                />

                {/* Active Guide Line on Hover or Active Milestone */}
                {activeHighlightedPoint && (
                  <line
                    x1={getX(chartData.findIndex((p) => p.label === activeHighlightedPoint.label))}
                    y1={paddingY}
                    x2={getX(chartData.findIndex((p) => p.label === activeHighlightedPoint.label))}
                    y2={bottomY}
                    stroke="#81b64c"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                )}

                {/* The Curved Line: Draws in real time from start to end */}
                <path
                  ref={pathRef}
                  d={pathD}
                  fill="none"
                  stroke="#81b64c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1000"
                  style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: (1 - progress) * 1000,
                  }}
                />

                {/* Milestone Data Points & Callout Pills */}
                {chartData.map((d, i) => {
                  const x = getX(i);
                  const y = getY(d.rating);
                  const isHovered = hoveredPoint?.label === d.label;
                  const isActive = activeStep === i;
                  const isPeak = d.rating === bestRating;

                  return (
                    <g
                      key={d.label}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(d)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        setActiveStep(i);
                        setHoveredPoint(d);
                      }}
                    >
                      {/* Large invisible hit area */}
                      <circle cx={x} cy={y} r="22" fill="transparent" />

                      {/* Milestone Box for Key Points */}
                      {d.milestone && (
                        <g transform={`translate(${x}, ${y - 32})`}>
                          <rect
                            x="-38"
                            y="-14"
                            width="76"
                            height="24"
                            rx="8"
                            fill={isPeak || isActive ? '#81b64c' : 'var(--bg-card-sub)'}
                            stroke={isPeak || isActive ? '#81b64c' : 'var(--border-color)'}
                            strokeWidth="1.5"
                            filter="drop-shadow(0 2px 6px rgba(0,0,0,0.12))"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="800"
                            fill={isPeak || isActive ? '#ffffff' : 'var(--text-primary)'}
                          >
                            {d.milestone}
                          </text>
                          <polygon
                            points="-4,10 4,10 0,14"
                            fill={isPeak || isActive ? '#81b64c' : 'var(--bg-card-sub)'}
                          />
                        </g>
                      )}

                      {/* Clean Point Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isPeak ? '7' : '4.5'}
                        fill={isPeak ? '#ffffff' : '#81b64c'}
                        stroke={isPeak ? '#81b64c' : '#ffffff'}
                        strokeWidth={isPeak ? '3' : '2'}
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          transform: isHovered || isActive ? 'scale(1.3)' : 'scale(1)',
                          transition: 'transform 150ms ease',
                        }}
                      />

                      {/* X-Axis Month Label */}
                      <text
                        x={x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={isHovered || isActive ? '800' : '600'}
                        fill={isHovered || isActive ? '#81b64c' : 'currentColor'}
                        className={isHovered || isActive ? 'opacity-100' : 'opacity-60'}
                        style={{ transition: 'all 150ms ease' }}
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interactive Milestone Detail Card */}
            {activeHighlightedPoint && (
              <div
                className="mt-4 p-4 px-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'rgba(129, 182, 76, 0.4)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#81b64c]/20 text-[#81b64c] flex items-center justify-center font-black">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {activeHighlightedPoint.label}
                      </span>
                      {activeHighlightedPoint.milestone && (
                        <span className="px-2 py-0.5 rounded-md text-[#81b64c] font-black text-[10px]" style={{ backgroundColor: 'var(--accent-green-bg)' }}>
                          {activeHighlightedPoint.milestone}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {activeHighlightedPoint.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:border-l sm:pl-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Recorded Elo</span>
                    <span className="text-base font-black text-[#81b64c]">
                      {activeHighlightedPoint.rating}
                    </span>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Delta</span>
                    <span className={`text-xs font-extrabold ${activeHighlightedPoint.rating >= startRating ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {activeHighlightedPoint.rating >= startRating ? `+${activeHighlightedPoint.rating - startRating}` : activeHighlightedPoint.rating - startRating} Elo
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </AnimatedSection>

      </div>
    </section>
  );
};

export default RatingAscent;
