import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ChessBroadcastLowerThird, ChessBroadcastLowerThirdProps } from '../remotion/ChessBroadcastLowerThird';
import AnimatedSection from './AnimatedSection';
import { Tv, Sliders, Sparkles, RefreshCw, Zap, Shield, Swords, Flame, Info } from 'lucide-react';

export const InteractiveMatchModule: React.FC = () => {
  const [formData, setFormData] = useState<ChessBroadcastLowerThirdProps>({
    whitePlayer: 'Ajith_chandolu',
    whiteElo: 1149,
    blackPlayer: 'Pa_ra-m',
    blackElo: 1152,
    moveNotation: '19... Nc2+!',
    moveEvaluation: 'brilliant',
    accuracyPercent: 96.8,
    whiteClock: '09:03',
    blackClock: '09:02',
    evalScore: '-9.4',
    tournamentTitle: 'CHESS.COM LIVE RAPID • PEAK 1152 MASTERPIECE',
    dayStreak: 569,
  });

  const loadPreset = (presetType: 'peak' | 'mate' | 'daily') => {
    if (presetType === 'peak') {
      setFormData({
        whitePlayer: 'Ajith_chandolu',
        whiteElo: 1149,
        blackPlayer: 'Pa_ra-m',
        blackElo: 1152,
        moveNotation: '19... Nc2+!',
        moveEvaluation: 'brilliant',
        accuracyPercent: 96.8,
        whiteClock: '09:03',
        blackClock: '09:02',
        evalScore: '-9.4',
        tournamentTitle: 'CHESS.COM LIVE RAPID • PEAK 1152 MASTERPIECE',
        dayStreak: 569,
      });
    } else if (presetType === 'mate') {
      setFormData({
        whitePlayer: 'Pa_ra-m',
        whiteElo: 1144,
        blackPlayer: 'trumpisit',
        blackElo: 1148,
        moveNotation: '44. Qa4#',
        moveEvaluation: 'checkmate',
        accuracyPercent: 94.2,
        whiteClock: '03:33',
        blackClock: '03:27',
        evalScore: '#M1',
        tournamentTitle: 'LIVE RAPID ARENA • 44-MOVE MATE VICTORY',
        dayStreak: 569,
      });
    } else {
      setFormData({
        whitePlayer: 'SonuDon1993',
        whiteElo: 1090,
        blackPlayer: 'Pa_ra-m',
        blackElo: 1223,
        moveNotation: '16... Qf2#',
        moveEvaluation: 'checkmate',
        accuracyPercent: 97.5,
        whiteClock: '05:26',
        blackClock: '00:24',
        evalScore: '#M1',
        tournamentTitle: 'DAILY TOURNAMENT • 1223 PEAK CHECKMATE',
        dayStreak: 569,
      });
    }
  };

  return (
    <section
      id="match-module"
      className="py-20 border-t relative overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#81b64c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
              <Tv className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Programmatic Remotion Video Engine</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Interactive Match Module
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <p
              className="text-base max-w-2xl font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              A live broadcast graphics studio built with <strong>Remotion</strong>. Edit grandmaster names, 
              live clocks, notations, and <strong>day streaks</strong> on the left, and watch the TV-style 
              lower-third banner render at 60 FPS in real time with zero manual video editing.
            </p>
          </AnimatedSection>
        </div>

        {/* Side-by-Side Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Input Control Panel */}
          <AnimatedSection animation="fadeRight" delay={200} className="lg:col-span-5 w-full">
            <div
              className="rounded-3xl border p-6 sm:p-7 shadow-sm space-y-5 hover-glow-border transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Header & Preset Switchers */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#81b64c]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    Match Controls
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => loadPreset('peak')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#81b64c]/15 text-[#81b64c] hover:bg-[#81b64c]/25 transition-colors cursor-pointer"
                  >
                    Peak 1152 Win
                  </button>
                  <button
                    onClick={() => loadPreset('mate')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    44. Qa4# Mate
                  </button>
                  <button
                    onClick={() => loadPreset('daily')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    1223 Daily Win
                  </button>
                </div>
              </div>

              {/* Overall Day Streak Telemetry Strip */}
              <div
                className="p-3.5 rounded-2xl border flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card-sub)',
                  borderColor: 'rgba(239, 68, 68, 0.28)',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block truncate">
                      Chess.com Overall Day Streak
                    </span>
                    <span className="text-xs font-black truncate block" style={{ color: 'var(--text-primary)' }}>
                      569 Consecutive Days Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={formData.dayStreak ?? 569}
                    onChange={(e) => setFormData({ ...formData, dayStreak: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg border text-xs font-mono font-bold text-center text-rose-400 focus:outline-none focus:border-rose-500"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                    title="Edit Day Streak to preview live in broadcast banner"
                  />
                  <span className="text-[10px] font-bold text-zinc-500">days</span>
                </div>
              </div>

              {/* White Player Form Group */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-2 h-2 rounded-full bg-white border border-zinc-400" />
                  White Player & Elo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formData.whitePlayer}
                    onChange={(e) => setFormData({ ...formData, whitePlayer: e.target.value })}
                    placeholder="White Player"
                    className="col-span-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#81b64c]"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <input
                    type="number"
                    value={formData.whiteElo}
                    onChange={(e) => setFormData({ ...formData, whiteElo: Number(e.target.value) })}
                    placeholder="ELO"
                    className="px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#81b64c]"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Black Player Form Group */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600" />
                  Black Player & Elo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formData.blackPlayer}
                    onChange={(e) => setFormData({ ...formData, blackPlayer: e.target.value })}
                    placeholder="Black Player"
                    className="col-span-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#81b64c]"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <input
                    type="number"
                    value={formData.blackElo}
                    onChange={(e) => setFormData({ ...formData, blackElo: Number(e.target.value) })}
                    placeholder="ELO"
                    className="px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#81b64c]"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Move Notation & Move Evaluation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Move Notation
                  </label>
                  <input
                    type="text"
                    value={formData.moveNotation}
                    onChange={(e) => setFormData({ ...formData, moveNotation: e.target.value })}
                    placeholder="e.g. 19... Nc2+!"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-black focus:outline-none focus:border-[#81b64c]"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Evaluation Type
                  </label>
                  <select
                    value={formData.moveEvaluation}
                    onChange={(e: any) => setFormData({ ...formData, moveEvaluation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#81b64c] cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="checkmate">Checkmate (#)</option>
                    <option value="brilliant">Brilliant Move (!!)</option>
                    <option value="great">Great Move (!)</option>
                    <option value="best">Best Move (★)</option>
                    <option value="blunder">Blunder (??)</option>
                  </select>
                </div>
              </div>

              {/* Clocks & Engine Score */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold uppercase tracking-wider block truncate" style={{ color: 'var(--text-muted)' }}>
                    White Clock
                  </label>
                  <input
                    type="text"
                    value={formData.whiteClock}
                    onChange={(e) => setFormData({ ...formData, whiteClock: e.target.value })}
                    placeholder="09:03"
                    className="w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none min-w-0"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold uppercase tracking-wider block truncate" style={{ color: 'var(--text-muted)' }}>
                    Black Clock
                  </label>
                  <input
                    type="text"
                    value={formData.blackClock}
                    onChange={(e) => setFormData({ ...formData, blackClock: e.target.value })}
                    placeholder="09:02"
                    className="w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none min-w-0"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold uppercase tracking-wider block truncate" style={{ color: 'var(--text-muted)' }}>
                    Eval Score
                  </label>
                  <input
                    type="text"
                    value={formData.evalScore}
                    onChange={(e) => setFormData({ ...formData, evalScore: e.target.value })}
                    placeholder="-9.4"
                    className="w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold text-[#81b64c] focus:outline-none min-w-0"
                    style={{
                      backgroundColor: 'var(--bg-card-sub)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Accuracy Percentage Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span style={{ color: 'var(--text-secondary)' }}>Move Accuracy</span>
                  <span className="text-[#81b64c] font-black">{formData.accuracyPercent}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.1"
                  value={formData.accuracyPercent}
                  onChange={(e) => setFormData({ ...formData, accuracyPercent: parseFloat(e.target.value) })}
                  className="w-full accent-[#81b64c] cursor-pointer"
                />
              </div>

            </div>
          </AnimatedSection>

          {/* RIGHT: Live Remotion Player Rendering */}
          <AnimatedSection animation="fadeLeft" delay={300} className="lg:col-span-7 w-full">
            <div
              className="rounded-3xl border shadow-xl p-4 sm:p-6 backdrop-blur-xl flex flex-col space-y-4 hover-glow-border transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Top Banner on Player */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#81b64c]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Real-Time Remotion Reactive Canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>569-DAY STREAK</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#81b64c]/20 text-[#81b64c] text-[10px] font-black tracking-wider">
                    60 FPS • REMOTION
                  </span>
                </div>
              </div>

              {/* Remotion Player Container */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-[#181914] shadow-2xl relative">
                <Player
                  component={ChessBroadcastLowerThird}
                  inputProps={formData}
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

              {/* Informative Subtext */}
              <div className="p-3 px-4 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: 'var(--bg-card-sub)', borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Typing in any field updates the video composition dynamically without manual keyframes.
                </span>
                <span className="font-mono text-[11px] text-[#81b64c] font-black">
                  1920x1080 Full HD
                </span>
              </div>
            </div>
          </AnimatedSection>

        </div>

      </div>
    </section>
  );
};

export default InteractiveMatchModule;
