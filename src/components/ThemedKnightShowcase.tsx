import React, { useState, useRef } from 'react';
import { FlipHorizontal } from 'lucide-react';

interface ThemedKnightShowcaseProps {
  className?: string;
  isDark?: boolean;
}

export const ThemedKnightShowcase: React.FC<ThemedKnightShowcaseProps> = ({
  className = '',
  isDark = true,
}) => {
  const [isMirrored, setIsMirrored] = useState(true); // Default true: facing left towards the hero text
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax 3D Tilt Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle tilt: max ±8 degrees
    const tiltY = ((x - centerX) / centerX) * 8;
    const tiltX = -((y - centerY) / centerY) * 7;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Determine piece image based on theme:
  // Dark theme -> White Knight
  // Light theme -> Black Knight
  const pieceSrc = isDark
    ? isMirrored
      ? '/assets/knight_white.png'
      : '/assets/knight_white_right.png'
    : isMirrored
    ? '/assets/knight_black.png'
    : '/assets/knight_black_right.png';

  const pieceAlt = isDark ? 'White Knight' : 'Black Knight';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{
        width: 380,
        minHeight: 480,
        perspective: 1200,
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
         THEMED MATCHING STUDIO ENVIRONMENT
         ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Atmospheric Glow Aura */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-20">
          {isDark ? (
            /* Dark Theme: Deep Emerald Volumetric Aura */
            <>
              <div className="w-80 h-80 rounded-full bg-[#81b64c]/20 blur-3xl animate-pedestal-glow" />
              <div className="absolute w-64 h-64 rounded-full bg-emerald-500/15 blur-2xl -translate-y-6" />
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 65%, rgba(129, 182, 76, 0.4) 0%, transparent 65%)',
                }}
              />
            </>
          ) : (
            /* Light Theme: Warm Studio Spotlight & Amber Glow */
            <>
              <div className="w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-pedestal-glow" />
              <div className="absolute w-64 h-64 rounded-full bg-amber-200/30 blur-2xl -translate-y-4" />
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 65%, rgba(217, 182, 138, 0.5) 0%, transparent 65%)',
                }}
              />
            </>
          )}
        </div>

        {/* Ambient Motes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: isDark ? '#81b64c' : '#d4a373' }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full animate-pulse opacity-45"
            style={{ backgroundColor: isDark ? '#93cb58' : '#e6be8a' }}
          />
          <div
            className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full animate-bounce opacity-40"
            style={{ backgroundColor: isDark ? '#81b64c' : '#cca36e' }}
          />
        </div>

        {/* The Knight with Continuous Levitation Motion */}
        <div
          className="relative z-10 animate-knight-hover flex items-center justify-center cursor-pointer transition-transform duration-300"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          {/* Studio Cutout Piece */}
          <img
            src={pieceSrc}
            alt={pieceAlt}
            draggable={false}
            className="w-64 h-auto max-h-[380px] object-contain drop-shadow-2xl transition-all duration-300"
            style={{
              filter: isDark
                ? 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 25px rgba(129, 182, 76, 0.25))'
                : 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 15px rgba(180, 140, 100, 0.18))',
            }}
          />

          {/* Specular Light Gleam Sweep Across the Lacquer Wood */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            style={{ mixBlendMode: 'overlay' }}
          >
            <div
              className="w-full h-full animate-gleam-sweep opacity-70"
              style={{
                background:
                  'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.8) 55%, transparent 80%)',
              }}
            />
          </div>
        </div>

        {/* Synchronized Dynamic Ground Contact Shadow */}
        <div className="relative -mt-6 z-0 flex items-center justify-center">
          <div
            className="w-48 h-10 rounded-full animate-shadow-pulse pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.45) 55%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(40, 25, 15, 0.55) 0%, rgba(60, 40, 25, 0.25) 55%, transparent 75%)',
            }}
          />
        </div>

        {/* Themed Circular Pedestal Dais */}
        <div className="relative mt-2 z-0 flex flex-col items-center pointer-events-none">
          {/* Top Tier Platform */}
          <div
            className="w-60 h-8 rounded-full border shadow-lg flex items-center justify-center relative overflow-hidden transition-colors"
            style={{
              backgroundColor: isDark ? '#1a1d17' : '#faf9f6',
              borderColor: isDark ? 'rgba(129, 182, 76, 0.4)' : 'rgba(217, 182, 138, 0.5)',
              boxShadow: isDark
                ? '0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.05), 0 0 16px rgba(129, 182, 76, 0.2)'
                : '0 8px 20px -4px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 0 12px rgba(217, 182, 138, 0.3)',
            }}
          >
            {/* Concentric Decorative Ring */}
            <div
              className="w-52 h-5 rounded-full border opacity-50"
              style={{
                borderColor: isDark ? '#81b64c' : '#cca36e',
              }}
            />
            {/* Subtle Glowing Center Accent */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, #81b64c 0%, transparent 70%)'
                  : 'radial-gradient(circle, #e6be8a 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Base Plinth Lower Step */}
          <div
            className="w-72 h-3 -mt-2 rounded-full border -z-10 opacity-80"
            style={{
              backgroundColor: isDark ? '#131510' : '#ece7de',
              borderColor: isDark ? '#262d20' : '#dcd2c4',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>
      </div>

      {/* Discreet Flip Button (Clean, Icon-Only, No Text Labels) */}
      <div
        className="absolute bottom-2 z-30 flex items-center p-1 rounded-full border shadow-md backdrop-blur-md opacity-35 hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <button
          onClick={() => setIsMirrored((prev) => !prev)}
          className="p-1.5 rounded-full hover:bg-[#81b64c]/20 hover:text-[#81b64c] transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Mirror orientation"
          title="Flip left/right"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
