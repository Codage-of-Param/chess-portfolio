import React, { useState, useEffect } from 'react';
import { ChessPlayer } from '../types/chess';
import { ExternalLink, Menu, X, Sun, Moon } from 'lucide-react';
import ChessKnightIcon from './ChessKnightIcon';

interface NavbarProps {
  player: ChessPlayer;
  isOnline: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  isOnline,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section scrollspy
  useEffect(() => {
    const sections = ['home', 'rating', 'match-module', 'replay', 'openings', 'stats', 'awards', 'connect'];
    const handleObserver = () => {
      const scrollPos = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleObserver, { passive: true });
    return () => window.removeEventListener('scroll', handleObserver);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'rating', label: 'Ascent' },
    { id: 'match-module', label: 'Match Module' },
    { id: 'replay', label: 'Arena' },
    { id: 'openings', label: 'Repertoire' },
    { id: 'stats', label: 'Stats' },
    { id: 'awards', label: 'Awards' },
    { id: 'connect', label: 'Connect' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
          isScrolled ? 'shadow-md' : 'shadow-none'
        }`}
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--border-color)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Param Identity */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="Pa_ra-m Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#81b64c] to-[#588c3e] flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform duration-200 p-1 overflow-hidden">
              <ChessKnightIcon className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Pa_ra-m
              </span>
              <span className="text-xs font-bold text-[#81b64c]">.chess</span>
              <span
                className={`w-2 h-2 rounded-full ml-1 ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                }`}
                title={isOnline ? 'Param is Online on Chess.com' : 'Offline'}
              />
            </div>
          </a>

          {/* Desktop Navigation Links (Minimalist Pills) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border"
            style={{
              backgroundColor: 'var(--bg-card-sub)',
              borderColor: 'var(--border-color)',
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                    color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2">
            
            {/* Theme Switcher Toggle (Compact Minimalist) */}
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Dark/Light Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Profile Link Button */}
            <a
              href="https://www.chess.com/member/Pa_ra-m"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-95 active:scale-95 shadow-xs"
              style={{ backgroundColor: 'var(--accent-green)' }}
            >
              <span>Chess.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Toggle Button (Shown on tablets and phones) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation (Visible on tablets and phones) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 top-16 animate-in fade-in duration-200"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Mini Status */}
            <div
              className="flex items-center justify-between p-3 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-card-sub)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-9 h-9 rounded-xl object-cover border"
                  style={{ borderColor: 'var(--border-color)' }}
                />
                <div>
                  <div className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    Param Chotaliya
                  </div>
                  <div className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                    <span>@{player.username} • {isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              
              <span className="text-[10px] px-2 py-0.5 rounded-md font-black bg-[#81b64c]/20 text-[#81b64c]">
                LEGEND
              </span>
            </div>

            {/* Mobile Navigation List */}
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-green-bg)' : 'var(--bg-card-sub)',
                      color: isActive ? 'var(--accent-green)' : 'var(--text-primary)',
                      border: isActive ? '1px solid rgba(129, 182, 76, 0.4)' : '1px solid transparent',
                    }}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#81b64c]" />}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Bottom Action: Chess.com Link */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://www.chess.com/member/Pa_ra-m"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs"
                style={{ backgroundColor: 'var(--accent-green)' }}
              >
                <span>View Param on Chess.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
