import React, { useState, useEffect } from 'react';
import { ChessPlayer } from '../types/chess';
import { ExternalLink, ChevronUp } from 'lucide-react';
import { useInView } from '../hooks/useAnimations';
import AnimatedSection from './AnimatedSection';
import ChessKnightIcon from './ChessKnightIcon';

interface FooterProps {
  player: ChessPlayer;
}

export const Footer: React.FC<FooterProps> = ({ player }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { ref: footerRef, isInView: footerVisible } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer
        ref={footerRef}
        className="bg-[#121411] text-white pt-16 pb-12 border-t border-[#262a22] relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-t from-[#81b64c]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/3 w-[300px] h-[300px] bg-[#81b64c]/5 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">

            {/* Brand info */}
            <AnimatedSection animation="fadeRight" delay={0} className="md:col-span-6 space-y-4">
              <a href="#home" className="flex items-center gap-3 group w-fit">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#81b64c] to-[#588c3e] flex items-center justify-center shadow-md shadow-[#81b64c]/20 group-hover:scale-110 transition-transform duration-300 p-1.5 overflow-hidden">
                  <ChessKnightIcon className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 font-black text-xl tracking-tight text-white">
                    <span>Param</span>
                    <span className="text-[#81b64c]">.chess</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 -mt-1">
                    @Pa_ra-m Official Portfolio
                  </span>
                </div>
              </a>

              <p className="text-sm text-zinc-400 max-w-sm font-medium leading-relaxed">
                Real-time portfolio showcasing Param Chotaliya&apos;s rated stats, interactive game replay, and tactical opening repertoire powered by the Chess.com Public API.
              </p>

              <div className="pt-2 text-sm font-bold text-[#81b64c] italic">
                &ldquo;Strategy today. Stronger tomorrow.&rdquo;
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection animation="fadeUp" delay={150} className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Navigation</h4>
              <ul className="space-y-2 text-sm text-zinc-300">
                {[
                  { href: '#home', label: 'Overview' },
                  { href: '#rating', label: 'The Rating Ascent' },
                  { href: '#replay', label: 'Game Replay Arena' },
                  { href: '#openings', label: 'Opening Repertoire' },
                  { href: '#stats', label: 'Live Stats' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 h-0.5 bg-[#81b64c] group-hover:w-3 transition-all duration-300 rounded-full" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Chess.com Links */}
            <AnimatedSection animation="fadeLeft" delay={300} className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Chess.com Links</h4>
              <ul className="space-y-2 text-sm text-zinc-300">
                {[
                  { href: 'https://www.chess.com/member/Pa_ra-m', label: "Param's Profile" },
                  { href: 'https://www.chess.com/play/online/new?opponent=Pa_ra-m', label: 'Challenge Param' },
                  { href: 'https://www.chess.com/play/online', label: 'Play on Chess.com' },
                  { href: 'https://www.chess.com/puzzles', label: 'Daily Puzzles' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 hover:text-[#81b64c] transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1 group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          {/* Animated divider */}
          <div className="relative h-px my-0 overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#81b64c]/50 to-transparent transition-transform duration-1000 ${
                footerVisible ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>

          {/* Bottom Credits */}
          <AnimatedSection animation="fadeUp" delay={400}>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c] animate-glow" />
                <span>Param Chotaliya (@Pa_ra-m) • Built with React & Chess.com Public API</span>
              </div>
              <div>© {new Date().getFullYear()} Pa_ra-m Chess Portfolio. All rights reserved.</div>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white shadow-lg shadow-[#81b64c]/25 flex items-center justify-center transition-all duration-500 press-scale cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
        style={{ backgroundColor: 'var(--accent-green)' }}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </>
  );
};
