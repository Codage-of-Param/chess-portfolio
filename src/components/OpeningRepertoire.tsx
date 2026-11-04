import React, { useState } from 'react';
import { OpeningNode } from '../types/chess';
import { BookOpen, GitBranch, ArrowRight, X } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

interface OpeningRepertoireProps {
  openings: OpeningNode[];
  totalGames: number;
}

export const OpeningRepertoire: React.FC<OpeningRepertoireProps> = ({ openings, totalGames }) => {
  const [filterColor, setFilterColor] = useState<'all' | 'white' | 'black'>('all');
  const [selectedOpening, setSelectedOpening] = useState<OpeningNode | null>(null);

  const displayedOpenings = openings.filter((item) => {
    if (filterColor === 'all') return true;
    return item.color === filterColor;
  });

  return (
    <section
      id="openings"
      className="py-20 border-y relative overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Background motif */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#81b64c]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
              <GitBranch className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Param&apos;s Tactical Blueprint</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              The Opening Repertoire Vault
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <p
              className="text-base max-w-2xl font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Param&apos;s opening weapons and defense systems mapped across 3,420+ rated battles. 
              Explore win ratios and lines prepared as White and Black.
            </p>
          </AnimatedSection>

          {/* Color Filter Tabs */}
          <AnimatedSection animation="fadeUp" delay={300}>
            <div
              className="flex items-center p-1.5 rounded-2xl border mt-4"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                onClick={() => setFilterColor('all')}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all press-scale cursor-pointer"
                style={{
                  backgroundColor: filterColor === 'all' ? 'var(--bg-card)' : 'transparent',
                  color: filterColor === 'all' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: filterColor === 'all' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                All Openings
              </button>
              <button
                onClick={() => setFilterColor('white')}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all press-scale cursor-pointer"
                style={{
                  backgroundColor: filterColor === 'white' ? 'var(--bg-card)' : 'transparent',
                  color: filterColor === 'white' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: filterColor === 'white' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-400" />
                <span>As White</span>
              </button>
              <button
                onClick={() => setFilterColor('black')}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all press-scale cursor-pointer"
                style={{
                  backgroundColor: filterColor === 'black' ? 'var(--bg-card)' : 'transparent',
                  color: filterColor === 'black' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: filterColor === 'black' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-600" />
                <span>As Black</span>
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Tree Root Summary Badge */}
        <AnimatedSection animation="scaleUp" delay={350}>
          <div className="flex flex-col items-center mb-10">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 shadow-xs hover-lift transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs" style={{ backgroundColor: 'var(--accent-green)' }}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Repertoire Base</span>
                <span className="text-base font-black" style={{ color: 'var(--text-primary)' }}>{totalGames.toLocaleString()} Recorded Battles</span>
              </div>
            </div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-[#81b64c]/60 to-transparent" />
          </div>
        </AnimatedSection>

        {/* Repertoire Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedOpenings.map((node, index) => {
            const isWhite = node.color === 'white';

            return (
              <AnimatedSection
                key={node.id}
                animation="fadeUp"
                delay={200 + index * 100}
              >
                <div
                  onClick={() => setSelectedOpening(node)}
                  className="group relative rounded-3xl border p-6 shadow-xs hover-lift hover-glow-border transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            isWhite ? 'bg-white border-2 border-zinc-500' : 'bg-zinc-900 border border-zinc-600'
                          }`}
                          title={isWhite ? 'Played as White' : 'Played as Black'}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {isWhite ? 'White Line' : 'Black Response'}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-xs font-black hover-shine" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                        {node.eco}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-black mb-1.5 group-hover:text-[#81b64c] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {node.name}
                    </h3>

                    {/* Move Sequence */}
                    <p
                      className="text-xs font-mono mb-4 p-2 rounded-xl"
                      style={{
                        backgroundColor: 'var(--bg-card-sub)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {node.moves}
                    </p>

                    {/* Multi-segment Win / Draw / Loss Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-emerald-500 font-extrabold">{node.winRate}% Win</span>
                        <span style={{ color: 'var(--text-muted)' }}>{node.drawRate}% Draw</span>
                        <span className="text-rose-500">{node.lossRate}% Loss</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-300 dark:bg-zinc-800">
                        <div
                          style={{ width: `${node.winRate}%` }}
                          className="bg-[#81b64c] h-full transition-all duration-700"
                        />
                        <div
                          style={{ width: `${node.drawRate}%` }}
                          className="bg-zinc-400 dark:bg-zinc-600 h-full transition-all duration-700"
                        />
                        <div
                          style={{ width: `${node.lossRate}%` }}
                          className="bg-rose-500 h-full transition-all duration-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Count & Rate Badges */}
                  <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <span className="font-semibold">{node.gamesCount} games analyzed</span>
                    <div className="flex items-center gap-1 font-extrabold group-hover:translate-x-1.5 transition-transform" style={{ color: 'var(--accent-green)' }}>
                      <span>Explore Line</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Modal for selected opening */}
        {selectedOpening && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border animate-in zoom-in-95 duration-200"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                    {selectedOpening.eco}
                  </span>
                  <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{selectedOpening.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedOpening(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className="p-3 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-card-sub)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                    Param&apos;s Preferred Line
                  </span>
                  <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedOpening.moves}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase block">Wins</span>
                    <span className="text-xl font-black text-emerald-500">{selectedOpening.wins}</span>
                    <span className="text-[10px] font-semibold text-emerald-400 block">({selectedOpening.winRate}%)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-500/10 border border-zinc-500/30 text-center">
                    <span className="text-[10px] font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>Draws</span>
                    <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{selectedOpening.draws}</span>
                    <span className="text-[10px] font-semibold block" style={{ color: 'var(--text-muted)' }}>({selectedOpening.drawRate}%)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                    <span className="text-[10px] font-bold text-rose-500 uppercase block">Losses</span>
                    <span className="text-xl font-black text-rose-500">{selectedOpening.losses}</span>
                    <span className="text-[10px] font-semibold text-rose-400 block">({selectedOpening.lossRate}%)</span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  This opening represents one of Param&apos;s core systems. Tested across {selectedOpening.gamesCount} competitive encounters, achieving an impressive {selectedOpening.winRate}% win rate.
                </p>

                <div className="pt-2">
                  <a
                    href={`https://www.chess.com/openings/${selectedOpening.name.replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl text-white font-extrabold text-xs text-center block shadow-xs transition-all hover-lift hover-shine press-scale"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                  >
                    Explore Opening on Chess.com Explorer
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
