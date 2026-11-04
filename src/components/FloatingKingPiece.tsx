import React from 'react';

interface FloatingKingPieceProps {
  className?: string;
  size?: number;
}

export const FloatingKingPiece: React.FC<FloatingKingPieceProps> = ({
  className = '',
  size = 360,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-700 ${className}`}
      style={{ width: size, height: size * 1.35 }}
    >
      {/* Soft Ambient Ground Shadow */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/25 rounded-[100%] blur-xl animate-pulse"
        style={{ transformOrigin: 'center' }}
      />

      {/* Realistic 3D Gloss Black King SVG */}
      <svg
        viewBox="0 0 300 420"
        className="w-full h-full drop-shadow-2xl animate-float"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Dark Body Gradient */}
          <linearGradient id="kingBodyGrad" x1="20%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#3d4044" />
            <stop offset="25%" stopColor="#25272a" />
            <stop offset="60%" stopColor="#141517" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>

          {/* Gloss Specular Highlight Gradient */}
          <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Rim Light Gradient (Subtle Green Reflection from Chessboard!) */}
          <linearGradient id="rimLight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#97c96a" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#7fa650" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Base Rim Gradient */}
          <radialGradient id="baseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#45484c" />
            <stop offset="80%" stopColor="#121314" />
            <stop offset="100%" stopColor="#080809" />
          </radialGradient>
        </defs>

        {/* 1. Base Pedestal Ring */}
        <ellipse cx="150" cy="385" rx="96" ry="24" fill="url(#kingBodyGrad)" />
        <ellipse cx="150" cy="383" rx="92" ry="20" fill="none" stroke="url(#glossHighlight)" strokeWidth="3" />
        <ellipse cx="150" cy="385" rx="96" ry="24" fill="url(#rimLight)" />

        {/* 2. Lower Tier Tier 1 */}
        <path
          d="M 64 380 C 64 345, 95 330, 110 320 L 190 320 C 205 330, 236 345, 236 380 Z"
          fill="url(#kingBodyGrad)"
        />
        <path
          d="M 68 375 C 68 348, 98 335, 112 323"
          stroke="url(#glossHighlight)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3. Mid Collar Ring */}
        <ellipse cx="150" cy="318" rx="44" ry="10" fill="url(#kingBodyGrad)" />
        <ellipse cx="150" cy="318" rx="42" ry="9" fill="none" stroke="url(#glossHighlight)" strokeWidth="2.5" />

        {/* 4. Slender Waist / Body Stem */}
        <path
          d="M 112 316 C 118 250, 122 220, 108 175 L 192 175 C 178 220, 182 250, 188 316 Z"
          fill="url(#kingBodyGrad)"
        />
        {/* Longitudinal Gloss Shine */}
        <path
          d="M 120 310 C 125 255, 128 225, 118 180"
          stroke="url(#glossHighlight)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        {/* Soft Right Rim Light */}
        <path
          d="M 182 310 C 177 255, 174 225, 184 180"
          stroke="url(#rimLight)"
          strokeWidth="4"
          fill="none"
        />

        {/* 5. Upper Neck Ring */}
        <ellipse cx="150" cy="174" rx="48" ry="11" fill="url(#kingBodyGrad)" />
        <ellipse cx="150" cy="174" rx="46" ry="10" fill="none" stroke="url(#glossHighlight)" strokeWidth="2.5" />

        {/* 6. Crown Bell Base */}
        <path
          d="M 104 170 C 95 125, 92 110, 84 90 L 216 90 C 208 110, 205 125, 196 170 Z"
          fill="url(#kingBodyGrad)"
        />
        <path
          d="M 98 160 C 92 125, 90 115, 87 95"
          stroke="url(#glossHighlight)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Crown Rim Lip */}
        <ellipse cx="150" cy="90" rx="66" ry="14" fill="url(#kingBodyGrad)" />
        <ellipse cx="150" cy="89" rx="64" ry="13" fill="none" stroke="url(#glossHighlight)" strokeWidth="3" />

        {/* Crown Petals / Battlements */}
        <path
          d="M 88 88 C 96 68, 110 65, 122 75 C 132 60, 168 60, 178 75 C 190 65, 204 68, 212 88 Z"
          fill="url(#kingBodyGrad)"
        />

        {/* Crown Finial Knob */}
        <ellipse cx="150" cy="62" rx="16" ry="10" fill="url(#kingBodyGrad)" />
        <ellipse cx="147" cy="60" rx="12" ry="7" fill="none" stroke="url(#glossHighlight)" strokeWidth="2" />

        {/* 7. Regal Maltese Cross */}
        <path
          d="M 144 24 L 156 24 L 156 36 L 168 36 L 168 46 L 156 46 L 156 58 L 144 58 L 144 46 L 132 46 L 132 36 L 144 36 Z"
          fill="url(#kingBodyGrad)"
        />
        <path
          d="M 146 26 L 154 26 L 154 38 L 166 38 L 166 44 L 154 44 L 154 56 L 146 56 L 146 44 L 134 44 L 134 38 L 146 38 Z"
          fill="none"
          stroke="url(#glossHighlight)"
          strokeWidth="1.5"
        />

        {/* Central Brilliant Gem Accent on Cross */}
        <circle cx="150" cy="41" r="3.5" fill="#7fa650" className="animate-glow" />
      </svg>
    </div>
  );
};
