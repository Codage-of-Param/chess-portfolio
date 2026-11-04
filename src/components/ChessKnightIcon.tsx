import React, { useState } from 'react';

interface ChessKnightIconProps {
  className?: string;
  size?: number | string;
}

export const ChessKnightIcon: React.FC<ChessKnightIconProps> = ({
  className = 'w-6 h-6',
}) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/assets/pieces/bases/wn.png"
        alt="Chess Knight Logo"
        onError={() => setImgError(true)}
        className={`${className} object-contain filter drop-shadow-sm group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300 select-none pointer-events-none`}
      />
    );
  }

  // Pure SVG Fallback
  return (
    <svg
      className={`${className} group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 45 45"
    >
      <g
        style={{
          fill: '#ffffff',
          stroke: '#1a2214',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      >
        <path
          d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
          fill="#ffffff"
        />
        <path
          d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,7.4 17.07,8.06 17.07,8.06 C 17.07,8.06 18.01,5.77 20,5 C 22.33,5.27 22,8.97 22,8.97 C 22,8.97 25.37,6.62 28.5,7.5 C 31.63,8.38 31,12 31,12 C 31,12 33.28,12.67 34,14.5 C 34.72,16.33 33.5,18 33.5,18 C 33.5,18 35.88,18.84 36,21 C 36.12,23.16 34.5,24.5 34.5,24.5 C 34.5,24.5 36.5,26.5 36,28.5 C 35.5,30.5 33,31.5 33,31.5 C 33,31.5 31.5,34 29,35 C 26.5,36 22,35.5 22,35.5"
          fill="#ffffff"
        />
        <circle cx="9.5" cy="25.5" r="1.3" fill="#1a2214" stroke="none" />
        <path
          d="M 14.5 15.5 C 14.5 16 15 16.5 15.5 16.5 C 16 16.5 16.5 16 16.5 15.5 C 16.5 15 16 14.5 15.5 14.5 C 15 14.5 14.5 15 14.5 15.5 Z"
          fill="#1a2214"
          stroke="none"
        />
      </g>
    </svg>
  );
};

export default ChessKnightIcon;

