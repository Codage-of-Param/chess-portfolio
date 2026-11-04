import React, { useState } from 'react';
import { ChessPlayer } from '../types/chess';
import { FloatingKingPiece } from './FloatingKingPiece';
import { Swords, ExternalLink, ShieldCheck, Play, Sparkles, Check } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

interface ConnectSectionProps {
  player: ChessPlayer;
}

export const ConnectSection: React.FC<ConnectSectionProps> = ({ player }) => {
  const [challengeTriggered, setChallengeTriggered] = useState(false);

  const handleChallengeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setChallengeTriggered(true);
    setTimeout(() => {
      window.open(`https://www.chess.com/play/online/new?opponent=Pa_ra-m`, '_blank');
      setChallengeTriggered(false);
    }, 600);
  };

  return (
    <section
      id="connect"
      className="py-24 border-t relative overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Decorative gradient glow */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-t from-[#81b64c]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Floating King Accent */}
        <div className="hidden lg:block absolute -top-16 right-12 pointer-events-none z-10">
          <AnimatedSection animation="scaleUp" delay={300}>
            <FloatingKingPiece size={240} className="hover:scale-105 transition-transform" />
          </AnimatedSection>
        </div>

        <div className="max-w-3xl space-y-6">
          <AnimatedSection animation="fadeDown" delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider hover-lift transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <Swords className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>Challenge Param Chotaliya</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <h2
              className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Let&apos;s Connect
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <p
              className="text-base sm:text-lg font-normal leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Ready to test your tactical mettle across the board? Challenge Param to a 10-minute Rapid or 3-minute Blitz 
              match on Chess.com, inspect post-game analysis, or connect directly.
            </p>
          </AnimatedSection>

          {/* Connect Action Button with Micro-interaction */}
          <AnimatedSection animation="fadeUp" delay={300}>
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={`https://www.chess.com/member/Pa_ra-m`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-white text-sm sm:text-base font-extrabold shadow-lg shadow-[#81b64c]/30 transition-all hover-lift hover-shine press-scale"
                style={{ backgroundColor: 'var(--accent-green)' }}
              >
                <span>Connect on Chess.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleChallengeClick}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border text-sm sm:text-base font-bold transition-all hover-lift press-scale shadow-xs cursor-pointer"
                style={{
                  backgroundColor: challengeTriggered ? '#81b64c' : 'var(--bg-card)',
                  borderColor: challengeTriggered ? '#81b64c' : 'var(--border-color)',
                  color: challengeTriggered ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {challengeTriggered ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Launching Challenge...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4 text-[#81b64c]" />
                    <span>Challenge Param</span>
                  </>
                )}
              </button>
            </div>
          </AnimatedSection>

        </div>

        {/* Feature Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          
          <AnimatedSection animation="fadeUp" delay={400}>
            <a
              href="https://www.chess.com/play/online/new?opponent=Pa_ra-m"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl border shadow-xs hover-lift hover-glow-border transition-all h-full block group cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold animate-breathe"
                  style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}
                >
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-[#81b64c] transition-colors flex items-center gap-1">
                  <span>Direct Match</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-lg font-black mb-1 group-hover:text-[#81b64c] transition-colors" style={{ color: 'var(--text-primary)' }}>
                Open to Play
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Friendly rapid games, opening experimentation, and community blitz matches welcomed.
              </p>
            </a>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={500}>
            <a
              href="https://www.chess.com/analysis"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl border shadow-xs hover-lift hover-glow-border transition-all h-full block group cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold animate-breathe"
                  style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-[#81b64c] transition-colors flex items-center gap-1">
                  <span>Engine Review</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-lg font-black mb-1 group-hover:text-[#81b64c] transition-colors" style={{ color: 'var(--text-primary)' }}>
                Game Review
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Post-game engine analysis and precision evaluation on Chess.com Game Review.
              </p>
            </a>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={600}>
            <a
              href="https://www.chess.com/legal/fair-play"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl border shadow-xs hover-lift hover-glow-border transition-all h-full block group cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold animate-breathe"
                  style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-[#81b64c] transition-colors flex items-center gap-1">
                  <span>Fair Play</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-lg font-black mb-1 group-hover:text-[#81b64c] transition-colors" style={{ color: 'var(--text-primary)' }}>
                Fair Play & Respect
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Committed to sporting integrity, cordial chess respect, and steady skill growth.
              </p>
            </a>
          </AnimatedSection>

        </div>

      </div>
    </section>
  );
};
