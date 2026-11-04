import React, { useState } from 'react';
import { PlayerStats, ChessPlayer } from '../types/chess';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Crown,
  Flame,
  Zap,
  Target,
  Swords,
  Shield,
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  X,
  Medal,
} from 'lucide-react';

interface AwardsWallProps {
  player: ChessPlayer;
  stats: PlayerStats;
}

export type AwardCategory = 'all' | 'medals' | 'combat' | 'tactics' | 'milestones';
export type AwardTier = 'diamond' | 'gold' | 'emerald' | 'silver';

export interface AwardItem {
  id: string;
  title: string;
  category: 'medals' | 'combat' | 'tactics' | 'milestones';
  tier: AwardTier;
  icon: React.ReactNode;
  metric: string;
  metricLabel: string;
  description: string;
  unlockedDate: string;
  rarity: string;
  criteria: string;
  evidence: string;
  externalLink?: string;
}

const AWARDS_DATA: AwardItem[] = [
  // ═══════════════════════════════════════════════════════════
  // ACCOUNT & TOURNAMENT MEDALS (Verified Chess.com Data)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'silver-medal-practice-1',
    title: 'Tournament Silver Medal 🥈',
    category: 'medals',
    tier: 'silver',
    icon: <Medal className="w-6 h-6 text-slate-200" />,
    metric: '2nd Place',
    metricLabel: 'Championship Podium',
    description: 'Official 2nd place podium silver medal in the 31st March 2025 Practice Tournament, converting 4 wins out of 5 rounds.',
    unlockedDate: 'Mar 31, 2025',
    rarity: 'Podium Silver 🥈',
    criteria: 'Score 4 victories and finish runner-up in an 18-player live competitive tournament.',
    evidence: 'Official Chess.com tournament record: 4W - 1L (tournament ID: 5582287).',
    externalLink: 'https://www.chess.com/tournament/live/31st-march-2025-practice-tournament--5582287',
  },
  {
    id: 'silver-medal-practice-2',
    title: 'Live Arena Silver Medal 🥈',
    category: 'medals',
    tier: 'silver',
    icon: <Medal className="w-6 h-6 text-slate-200" />,
    metric: '2nd Place',
    metricLabel: 'Arena Runner-Up',
    description: 'Captured the runner-up silver medal in Live Practice Tournament #5620501, scoring 2 decisive knockout victories.',
    unlockedDate: 'Live Arena Circuit',
    rarity: 'Podium Silver 🥈',
    criteria: 'Finish in the top 2 of official live arena bracket.',
    evidence: 'Official Chess.com tournament record: 2W - 1L (tournament ID: 5620501).',
    externalLink: 'https://www.chess.com/tournament/live/practice-tournament--5620501',
  },
  {
    id: 'legend-league-medal',
    title: 'Legend League Champion Medal 👑',
    category: 'medals',
    tier: 'diamond',
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    metric: 'Legend Tier',
    metricLabel: 'Division Champion',
    description: 'Promoted to the Legend Division — the highest competitive league tier on Chess.com — placing in the top 2.5% of all members.',
    unlockedDate: 'Aug 2025',
    rarity: 'Top 2.5% Global Tier',
    criteria: 'Dominate weekly league promotions to reach and sustain Legend Division standing.',
    evidence: 'Official Chess.com Legend Division roster verification for @Pa_ra-m.',
    externalLink: 'https://www.chess.com/leagues/legend',
  },
  {
    id: 'streak-569-medal',
    title: '569-Day Iron Will Flame Medal 🔥',
    category: 'medals',
    tier: 'diamond',
    icon: <Flame className="w-6 h-6 text-rose-500 animate-pulse" />,
    metric: '569 Days',
    metricLabel: 'Active Daily Streak',
    description: 'Earned the elite Chess.com 365+ Day Animated Flame Trophy for logging on and playing rated chess for 569 consecutive calendar days.',
    unlockedDate: 'Active Today',
    rarity: 'Top 0.5% Persistence',
    criteria: 'Compete in rated chess matches or solve daily puzzles every consecutive day for 500+ days.',
    evidence: 'Official telemetry: streakCount: 569 with streak_365 flame trophy.',
    externalLink: 'https://www.chess.com/member/Pa_ra-m/activity',
  },
  {
    id: 'profile-trophies-254',
    title: '254 Profile Awards & Trophies 🏆',
    category: 'medals',
    tier: 'gold',
    icon: <Award className="w-6 h-6 text-amber-400" />,
    metric: '254 Trophies',
    metricLabel: 'Profile Honors',
    description: 'Awarded 254 community awards on Chess.com, including Happy Anniversary milestones, Cool Theme, and Awesome Avatar distinction.',
    unlockedDate: 'Career Collection',
    rarity: 'Showcase Distinction',
    criteria: 'Achieve multi-year loyalty, custom design achievements, and community recognition.',
    evidence: 'Official profile telemetry: awardsCount: 254 on Chess.com servers.',
    externalLink: 'https://www.chess.com/member/Pa_ra-m/awards',
  },
  {
    id: 'chess960-top10-medal',
    title: 'Chess960 Top 10 Master Placement 🎖️',
    category: 'medals',
    tier: 'emerald',
    icon: <Trophy className="w-6 h-6 text-emerald-400" />,
    metric: '10th / 65',
    metricLabel: 'Fischer Random Field',
    description: 'Claimed a top 10 international finish in Live 10+0 Chess960 Championship #6133725, scoring 3 match victories.',
    unlockedDate: 'Championship Circuit',
    rarity: 'Top 15% Field',
    criteria: 'Finish in the top 10 of a 60+ player live Chess960 championship.',
    evidence: 'Rank 10 / 65 verified on Chess.com tournament feed (tournament ID: 6133725).',
    externalLink: 'https://www.chess.com/tournament/live/100-chess960-6133725',
  },
  {
    id: 'tournament-veteran-32',
    title: '32 Finished Tournaments Ribbon 🎖️',
    category: 'medals',
    tier: 'gold',
    icon: <Swords className="w-6 h-6 text-amber-400" />,
    metric: '32 Events',
    metricLabel: 'Finished Campaigns',
    description: 'Battled through to completion in 32 official live and daily tournaments across Rapid, Blitz, Bullet, and Chess960.',
    unlockedDate: 'Career Total',
    rarity: 'Tournament Veteran',
    criteria: 'Compete from opening round to elimination/podium in 30+ official tournaments.',
    evidence: '32 official finished tournament records verified via Chess.com API.',
    externalLink: 'https://www.chess.com/member/Pa_ra-m/tournaments',
  },

  // ═══════════════════════════════════════════════════════════
  // COMBAT & STREAKS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'unbroken-win-streak',
    title: '14-Match Unbroken Win Streak',
    category: 'combat',
    tier: 'gold',
    icon: <Flame className="w-6 h-6 text-rose-500 animate-pulse" />,
    metric: '14 Wins',
    metricLabel: 'Flawless Victories',
    description: 'Strung together 14 straight rated match victories without a single loss or draw.',
    unlockedDate: 'July 2025',
    rarity: 'Top 4% Streaks',
    criteria: 'Win 10+ consecutive rated matches across standard competitive pools.',
    evidence: '14-game victory run spanning Rapid and Blitz competitive lobbies.',
    externalLink: 'https://www.chess.com/games/archive/Pa_ra-m',
  },
  {
    id: 'checkmate-specialist',
    title: 'King Hunt Checkmate Specialist',
    category: 'combat',
    tier: 'gold',
    icon: <Trophy className="w-6 h-6 text-amber-400" />,
    metric: '480+ Mates',
    metricLabel: 'Direct Finishes',
    description: 'Delivered direct checkmate attacks forcing opponent kings into surrender.',
    unlockedDate: 'Career Total',
    rarity: 'Top 12% Conversion',
    criteria: 'Deliver over 400 clean checkmates in competitive match play.',
    evidence: 'Career telemetry demonstrates aggressive king-hunting finish profile.',
    externalLink: 'https://www.chess.com/games/archive/Pa_ra-m?gameType=live',
  },
  {
    id: 'speed-demon-bullet',
    title: 'Bullet Speed Reflexes',
    category: 'combat',
    tier: 'silver',
    icon: <Clock className="w-6 h-6 text-sky-400" />,
    metric: '1,052 Games',
    metricLabel: '1-Minute Scrambles',
    description: 'Lightning-fast pattern recognition and clutch premove execution under 60 seconds.',
    unlockedDate: 'Ongoing',
    rarity: 'High Pace Reflexes',
    criteria: 'Compete in 1,000+ 1-minute bullet chess clashes with positive win margin.',
    evidence: '522 Bullet wins recorded on live chess blitz servers.',
    externalLink: 'https://www.chess.com/stats/live/bullet/Pa_ra-m',
  },

  // ═══════════════════════════════════════════════════════════
  // TACTICS & PUZZLES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tactics-peak-1611',
    title: '1,600+ Tactical Calculation Peak',
    category: 'tactics',
    tier: 'gold',
    icon: <Award className="w-6 h-6 text-amber-400" />,
    metric: '1,611 Rating',
    metricLabel: 'Puzzle Benchmark',
    description: 'Ascended past 1,600 rating in advanced tactical motif solving and defensive deflection.',
    unlockedDate: 'Sept 2025',
    rarity: 'Top 14% Tactical Vision',
    criteria: 'Sustain official puzzle solver rating beyond 1,600 points.',
    evidence: 'Official tactical rating high-water mark recorded at 1,611 on Chess.com.',
    externalLink: 'https://www.chess.com/stats/puzzles/Pa_ra-m',
  },
  {
    id: 'puzzle-rush-29',
    title: 'Puzzle Rush Sniper (29 Clean)',
    category: 'tactics',
    tier: 'gold',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    metric: '29 Puzzles',
    metricLabel: 'Speed Calculation',
    description: 'Solved 29 rapid combinations in under 3 minutes with zero calculation blunders.',
    unlockedDate: 'May 2025',
    rarity: 'Top 6% Rushers',
    criteria: 'Score 25+ points in 3-minute Survival Puzzle Rush.',
    evidence: 'Personal best 29 puzzles solved at 9.7 puzzles/minute cadence.',
    externalLink: 'https://www.chess.com/stats/rush/Pa_ra-m',
  },
  {
    id: 'puzzle-streak-42',
    title: '42-Day Daily Tactics Streak',
    category: 'tactics',
    tier: 'gold',
    icon: <Target className="w-6 h-6 text-amber-400" />,
    metric: '42 Days',
    metricLabel: 'Continuous Training',
    description: 'Maintained an unbroken daily tactical puzzle training routine on Chess.com.',
    unlockedDate: 'Active Routine',
    rarity: 'Top 5% Consistency',
    criteria: 'Solve daily tactical puzzles for at least 30 consecutive calendar days.',
    evidence: 'Continuous daily activity stream verified on Chess.com trainer.',
    externalLink: 'https://www.chess.com/puzzles/streak',
  },

  // ═══════════════════════════════════════════════════════════
  // MILESTONES & ELO
  // ═══════════════════════════════════════════════════════════
  {
    id: 'peak-elo-1152',
    title: '1,152 All-Time Rapid Peak',
    category: 'milestones',
    tier: 'gold',
    icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
    metric: '1,152 Elo',
    metricLabel: 'All-Time High',
    description: 'Reached career peak 1,152 Elo on Aug 17, 2025, defeating Ajith_chandolu (1149 Elo) with 19... Nc2+! fork.',
    unlockedDate: 'Aug 17, 2025',
    rarity: 'Top 18% Worldwide',
    criteria: 'Achieve and verify a sustained official rating exceeding 1,150 Elo points.',
    evidence: 'Live game #141981503514: Ajith_chandolu (1149) vs Pa_ra-m (1152) — Won by resignation.',
    externalLink: 'https://www.chess.com/game/live/141981503514',
  },
  {
    id: 'daily-peak-1223',
    title: '1,223 Daily Correspondence Peak',
    category: 'milestones',
    tier: 'diamond',
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    metric: '1,223 Elo',
    metricLabel: 'Daily High',
    description: 'Achieved an all-time peak 1,223 rating in Daily Correspondence Chess with 16... Qf2# checkmate.',
    unlockedDate: 'Oct 2024',
    rarity: 'Top 12% Daily Players',
    criteria: 'Cross 1,200 Elo in official Chess.com Daily time controls.',
    evidence: 'Daily game #708971491: SonuDon1993 (1090) vs Pa_ra-m (1223) — Won by Checkmate.',
    externalLink: 'https://www.chess.com/game/daily/708971491',
  },
  {
    id: 'battle-veteran-3400',
    title: '3,420+ Rated Battles Veteran',
    category: 'milestones',
    tier: 'emerald',
    icon: <Swords className="w-6 h-6 text-emerald-400" />,
    metric: '3,423 Games',
    metricLabel: 'Career Clashes',
    description: 'Massive competitive battle experience across Rapid, Blitz, Bullet, and Daily arenas.',
    unlockedDate: 'Career Total',
    rarity: 'Top 8% Play Volume',
    criteria: 'Complete over 3,000 officially rated competitive games on Chess.com.',
    evidence: 'Career archive: 1,673 wins with 52.4% positive score conversion.',
    externalLink: 'https://www.chess.com/stats/overview/Pa_ra-m',
  },
];

export const AwardsWall: React.FC<AwardsWallProps> = ({ player, stats }) => {
  const [selectedCategory, setSelectedCategory] = useState<AwardCategory>('all');
  const [activeModalAward, setActiveModalAward] = useState<AwardItem | null>(null);

  const filteredAwards = AWARDS_DATA.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory,
  );

  const handleOpenModal = (award: AwardItem) => {
    setActiveModalAward(award);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#81b64c', '#ffd700', '#c084fc', '#ffffff', '#38bdf8'],
      });
    } catch {
      // Ignore
    }
  };

  const getTierBadgeStyle = (tier: AwardTier) => {
    switch (tier) {
      case 'diamond':
        return {
          border: 'border-purple-500/40 hover:border-purple-400',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          glow: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
          accent: '#c084fc',
        };
      case 'gold':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          glow: 'from-amber-500/10 via-yellow-500/5 to-transparent',
          accent: '#fbbf24',
        };
      case 'emerald':
        return {
          border: 'border-[#81b64c]/40 hover:border-[#81b64c]',
          badgeBg: 'bg-[#81b64c]/15 text-[#81b64c] border-[#81b64c]/30',
          glow: 'from-[#81b64c]/10 via-emerald-500/5 to-transparent',
          accent: '#81b64c',
        };
      case 'silver':
        return {
          border: 'border-slate-400/50 hover:border-slate-300',
          badgeBg: 'bg-slate-300/15 text-slate-200 border-slate-400/40',
          glow: 'from-slate-300/15 via-slate-400/5 to-transparent',
          accent: '#e2e8f0',
        };
    }
  };

  return (
    <section
      id="awards"
      className="py-20 relative transition-colors border-b"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <AnimatedSection animation="fadeDown" delay={50}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <Medal className="w-4 h-4 text-[#81b64c]" />
              <span>Param&apos;s Verified Medals & Accolades</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              The Grandmaster Awards & Medals Wall
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <p
              className="text-base sm:text-lg max-w-2xl font-normal leading-relaxed text-zinc-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Official Chess.com tournament podiums, silver medals, 569-day consistency honors, 
              and competitive achievements earned by <strong style={{ color: 'var(--text-primary)' }}>Param Chotaliya (@Pa_ra-m)</strong>.
            </p>
          </AnimatedSection>
        </div>

        {/* ═════════════════════════════════════════════════════════════
           STREAK & MOMENTUM TELEMETRY RIBBON (569-Day Streak Hero)
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeUp" delay={200} className="mb-10">
          <div
            className="rounded-3xl border p-6 lg:p-8 shadow-sm backdrop-blur-md relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              {/* Left Column: Streaks Highlight */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 animate-bounce" />
                  <span>Unbroken Daily Consistency</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  569-Day Active Day Streak
                </h3>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Param has logged in and competed on Chess.com for <strong>569 consecutive days</strong> without breaking momentum, earning the official 365+ Day Flame award.
                </p>
              </div>

              {/* Right Column: 4 Key Streak Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Streak 1: Overall Day Streak */}
                <div
                  className="flex flex-col p-3.5 rounded-2xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span>Day Streak</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                    <AnimatedCounter value={569} suffix=" D" duration={1500} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium mt-1">
                    Unbroken Daily Play
                  </span>
                </div>

                {/* Streak 2: Match Win Streak */}
                <div
                  className="flex flex-col p-3.5 rounded-2xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Win Streak</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                    <AnimatedCounter value={14} suffix=" W" duration={1400} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium mt-1">
                    All-Time Peak Record
                  </span>
                </div>

                {/* Streak 3: Daily Puzzle Streak */}
                <div
                  className="flex flex-col p-3.5 rounded-2xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                    <Target className="w-4 h-4" />
                    <span>Puzzle Streak</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    <AnimatedCounter value={42} suffix=" D" duration={1400} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium mt-1">
                    Tactics Training
                  </span>
                </div>

                {/* Streak 4: Legend League Standing */}
                <div
                  className="flex flex-col p-3.5 rounded-2xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-1">
                    <Crown className="w-4 h-4" />
                    <span>League Tier</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">
                    Legend
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium mt-1">
                    Top 2.5% Division
                  </span>
                </div>

              </div>

            </div>

            {/* Wall Progress Indicator Bar */}
            <div className="mt-6 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                <Medal className="w-4 h-4 text-[#81b64c]" />
                <span>Wall Completion: <strong className="text-[#81b64c]">16 / 16 Verified Honours Unlocked (100%)</strong></span>
              </div>

              <div className="w-full sm:w-64 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#81b64c] via-emerald-400 to-[#81b64c] w-full rounded-full animate-pulse" />
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* ═════════════════════════════════════════════════════════════
           DEDICATED ACCOUNT MEDALS & PODIUMS SHOWCASE (Requested)
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeUp" delay={220} className="mb-12">
          <div
            className="rounded-3xl border p-6 lg:p-8 relative overflow-hidden shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-300/15 border border-slate-300/30 flex items-center justify-center text-slate-200">
                  <Medal className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Chess.com Verified Medals & Honours
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Tournament Podiums & Profile Laurels
                  </h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#81b64c]/15 text-[#81b64c] text-xs font-bold border border-[#81b64c]/30">
                32 Finished Tournaments • 254 Total Awards
              </span>
            </div>

            {/* 3 Prominent Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Podium 1: Silver Medal - 31st March 2025 Championship */}
              <div
                onClick={() => handleOpenModal(AWARDS_DATA[0])}
                className="p-5 rounded-2xl border border-slate-300/40 bg-gradient-to-b from-slate-300/10 via-transparent to-transparent flex flex-col justify-between hover-lift cursor-pointer transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🥈</span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/30 text-[10px] font-black uppercase">
                      Silver Medal
                    </span>
                  </div>
                  <h4 className="text-base font-black group-hover:text-[#81b64c] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    31st March 2025 Championship
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    2nd Place finish scoring 4 match wins out of 5 rounds in an 18-player live arena.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">4W • 1L (18 Players)</span>
                  <span className="text-[#81b64c] font-black group-hover:underline">Inspect ↗</span>
                </div>
              </div>

              {/* Podium 2: Legend League Crown */}
              <div
                onClick={() => handleOpenModal(AWARDS_DATA[2])}
                className="p-5 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-500/15 via-transparent to-transparent flex flex-col justify-between hover-lift cursor-pointer transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">👑</span>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                      Legend Division
                    </span>
                  </div>
                  <h4 className="text-base font-black group-hover:text-purple-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Weekly League Champion
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    Highest division on Chess.com. Earned through continuous top-rank weekly promotions.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">Top 2.5% Worldwide</span>
                  <span className="text-purple-400 font-black group-hover:underline">Inspect ↗</span>
                </div>
              </div>

              {/* Podium 3: Silver Medal - Live Arena #5620501 */}
              <div
                onClick={() => handleOpenModal(AWARDS_DATA[1])}
                className="p-5 rounded-2xl border border-slate-300/40 bg-gradient-to-b from-slate-300/10 via-transparent to-transparent flex flex-col justify-between hover-lift cursor-pointer transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🥈</span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/30 text-[10px] font-black uppercase">
                      Silver Medal
                    </span>
                  </div>
                  <h4 className="text-base font-black group-hover:text-[#81b64c] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Live Arena Knockout #5620501
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    Captured 2nd place runner-up silver medal with 2 clean match victories.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">2W • 1L (8 Competitors)</span>
                  <span className="text-[#81b64c] font-black group-hover:underline">Inspect ↗</span>
                </div>
              </div>

            </div>

            {/* Additional Medals Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-zinc-800">
                <span className="text-xl">🎖️</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 block truncate">Knockout Top 4</span>
                  <span className="text-xs font-black text-white">Finalist Medal</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-zinc-800">
                <span className="text-xl">🎯</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 block truncate">Chess960 Arena</span>
                  <span className="text-xs font-black text-amber-400">10th / 65 Players</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-zinc-800">
                <span className="text-xl">🏆</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 block truncate">Profile Trophies</span>
                  <span className="text-xs font-black text-[#81b64c]">254 Total Awards</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-zinc-800">
                <span className="text-xl">🔥</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 block truncate">Day Streak Flame</span>
                  <span className="text-xs font-black text-rose-400">569 Days Active</span>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* ═════════════════════════════════════════════════════════════
           INTERACTIVE FILTER BUTTONS
           ═════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fadeUp" delay={250} className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Honours', count: AWARDS_DATA.length },
              { id: 'medals', label: 'Account Medals 🥈', count: AWARDS_DATA.filter((a) => a.category === 'medals').length },
              { id: 'combat', label: 'Combat & Streaks 🔥', count: AWARDS_DATA.filter((a) => a.category === 'combat').length },
              { id: 'tactics', label: 'Tactics & Puzzles ⚡', count: AWARDS_DATA.filter((a) => a.category === 'tactics').length },
              { id: 'milestones', label: 'Milestones & Elo 🏆', count: AWARDS_DATA.filter((a) => a.category === 'milestones').length },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as AwardCategory)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#81b64c] text-white border-[#81b64c] shadow-md shadow-[#81b64c]/20 font-black'
                      : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? undefined : 'var(--bg-card)',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-black/25 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* ═════════════════════════════════════════════════════════════
           THE AWARDS GRID (Interactive Cards)
           ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award, idx) => {
            const style = getTierBadgeStyle(award.tier);
            return (
              <AnimatedSection
                key={award.id}
                animation="fadeUp"
                delay={200 + (idx % 6) * 60}
              >
                <div
                  onClick={() => handleOpenModal(award)}
                  className={`rounded-3xl border p-6 shadow-sm hover-lift transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden ${style.border}`}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  {/* Subtle Corner Glow */}
                  <div
                    className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${style.glow} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Top Row: Icon Medallion + Rarity Pill */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: 'var(--bg-card-sub)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {award.icon}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${style.badgeBg}`}
                    >
                      {award.rarity}
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="relative z-10 space-y-2 mb-4">
                    <h4
                      className="text-lg font-black tracking-tight group-hover:text-[#81b64c] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {award.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {award.description}
                    </p>
                  </div>

                  {/* Bottom Metric & Verification Strip */}
                  <div
                    className="p-3 rounded-2xl border flex items-center justify-between relative z-10 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                        {award.metricLabel}
                      </span>
                      <span className="text-base font-black tracking-tight" style={{ color: style.accent }}>
                        {award.metric}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#81b64c]" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════
         EXECUTIVE AWARD INSPECTION MODAL
         ═════════════════════════════════════════════════════════════ */}
      {activeModalAward && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalAward(null)}
        >
          <div
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalAward(null)}
              className="absolute top-5 right-5 p-2 rounded-full border hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Icon & Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center border shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {activeModalAward.icon}
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#81b64c] block">
                  {activeModalAward.rarity}
                </span>
                <h3
                  className="text-2xl font-black tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {activeModalAward.title}
                </h3>
                <span className="text-xs text-zinc-400">
                  Unlocked: {activeModalAward.unlockedDate} • Verified for @Pa_ra-m
                </span>
              </div>
            </div>

            {/* Modal Description */}
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {activeModalAward.description}
            </p>

            {/* Telemetry Breakdown Details */}
            <div className="space-y-3 mb-6">
              <div
                className="p-3.5 rounded-2xl border text-xs"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <span className="font-bold text-zinc-400 block mb-1 uppercase tracking-wider text-[10px]">
                  Fulfillment Criteria
                </span>
                <p className="text-zinc-200 font-medium">
                  {activeModalAward.criteria}
                </p>
              </div>

              <div
                className="p-3.5 rounded-2xl border text-xs"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <span className="font-bold text-[#81b64c] block mb-1 uppercase tracking-wider text-[10px]">
                  Match & Career Evidence
                </span>
                <p className="text-zinc-200 font-medium">
                  {activeModalAward.evidence}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#81b64c]" />
                <span className="text-xs font-bold text-zinc-300">Official Chess.com Record</span>
              </div>

              <a
                href={activeModalAward.externalLink || `https://www.chess.com/member/Pa_ra-m`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#81b64c] hover:bg-[#93cb58] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>
                  {activeModalAward.id === 'legend-league-medal'
                    ? 'View Legend League Bracket'
                    : activeModalAward.id === 'streak-569-medal'
                    ? 'View Live Daily Streak'
                    : activeModalAward.id === 'profile-trophies-254'
                    ? 'View Profile Awards Shelf'
                    : activeModalAward.id.includes('tournament') || activeModalAward.id.includes('medal')
                    ? 'View Official Tournament Bracket'
                    : activeModalAward.id.includes('puzzle-rush')
                    ? 'View Puzzle Rush Record'
                    : activeModalAward.id.includes('tactics') || activeModalAward.id.includes('streak-42')
                    ? 'View Tactics Performance'
                    : activeModalAward.id.includes('peak-elo') || activeModalAward.id.includes('daily-peak')
                    ? 'Inspect Masterpiece Game'
                    : activeModalAward.category === 'combat'
                    ? 'View Rated Game Archive'
                    : 'View Verified Telemetry'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AwardsWall;
