import { useCurrentFrame, useVideoConfig, spring, Sequence, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';

interface KineticWordProps {
  word: string;
  delay: number;
  subtext?: string;
  rating?: string | number;
  piece?: 'white' | 'black';
  accentColor?: string;
}

const KineticWord: React.FC<KineticWordProps> = ({
  word,
  delay,
  subtext,
  rating,
  piece = 'white',
  accentColor = '#81b64c',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncy elastic spring entrance
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(scale, [0, 1], [60, 0]);

  const isWhite = piece === 'white';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${translateY}px) scale(${Math.max(0, scale)})`,
        opacity,
        zIndex: 10,
      }}
    >
      {/* Top Player Status Pill in Chess.com Theme */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 22px',
          borderRadius: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          marginBottom: 16,
          backdropFilter: 'blur(12px)',
        }}
      >
        <span style={{ fontSize: 28 }}>{isWhite ? '♘' : '♚'}</span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: isWhite ? '#81b64c' : '#f59e0b',
            textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {isWhite ? 'White • Param' : 'Black • Challenger'}
        </span>
        {rating && (
          <span
            style={{
              padding: '3px 12px',
              borderRadius: 8,
              backgroundColor: '#81b64c',
              color: '#ffffff',
              fontSize: 20,
              fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            {rating} Elo
          </span>
        )}
      </div>

      {/* Main Kinetic Player Name */}
      <h1
        style={{
          margin: 0,
          fontSize: 130,
          fontWeight: 900,
          color: isWhite ? '#ffffff' : '#f0f0f0',
          fontFamily: "'Plus Jakarta Sans', Impact, sans-serif",
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: isWhite
            ? '0 6px 30px rgba(0,0,0,0.7), 0 0 50px rgba(129, 182, 76, 0.45)'
            : '0 6px 30px rgba(0,0,0,0.8), 0 0 40px rgba(245, 158, 11, 0.35)',
        }}
      >
        {word}
      </h1>

      {subtext && (
        <p
          style={{
            margin: '12px 0 0 0',
            fontSize: 24,
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

export interface KineticTitleCardProps {
  homeTeam?: string; // Default to Param Chotaliya
  awayTeam?: string; // Default to Opponent
  homeRating?: number | string;
  awayRating?: number | string;
  timeControl?: string;
  eventTitle?: string;
}

export const KineticTitleCard: React.FC<KineticTitleCardProps> = ({
  homeTeam = 'Pa_ra-m',
  awayTeam = 'hindianajoness',
  homeRating = 1152,
  awayRating = 928,
  timeControl = '10 MIN • RAPID BATTLE',
  eventTitle = 'CHESS.COM LIVE ARENA CLASH',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // "VS" Clash Spring Animation at frame 10
  const vsScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, stiffness: 140 },
  });

  const vsOpacity = interpolate(frame - 10, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Expanding shockwave ripple ring behind VS
  const rippleScale = interpolate(frame - 10, [0, 30], [0.8, 3.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(frame - 10, [0, 25], [0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle camera breathing
  const cameraScale = interpolate(frame, [0, 120], [0.98, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        flex: 1,
        // Authentic Chess.com dark board background theme
        backgroundColor: '#262421',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${cameraScale})`,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* 1. Chess.com Radiant Ambient Light in Signature Green */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(129, 182, 76, 0.28) 0%, rgba(38, 36, 33, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Chessboard 8x8 Watermark Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(45deg, #ffffff 25%, transparent 25%),
            linear-gradient(-45deg, #ffffff 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ffffff 75%),
            linear-gradient(-45deg, transparent 75%, #ffffff 75%)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: '0 0, 0 60px, 60px -60px, -60px 0px',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Top Header Bar: Chess.com Branding & Time Control */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 32px',
          borderRadius: 9999,
          backgroundColor: 'rgba(18, 19, 16, 0.85)',
          border: '1.5px solid rgba(129, 182, 76, 0.4)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 20,
        }}
      >
        {/* Chess.com Green Pawn Brand Icon */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#81b64c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          ♟
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            {eventTitle}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#81b64c',
              letterSpacing: '0.1em',
            }}
          >
            {timeControl}
          </span>
        </div>
      </div>

      {/* 4. Away Team (Challenger / Black) */}
      <Sequence from={0} durationInFrames={120}>
        <KineticWord
          word={awayTeam}
          delay={0}
          subtext="Rated Opponent"
          rating={awayRating}
          piece="black"
          accentColor="#f59e0b"
        />
      </Sequence>

      {/* 5. Central "VS" Clash Badge in Chess.com Green */}
      <Sequence from={10} durationInFrames={110}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '28px 0',
            transform: `scale(${Math.max(0, vsScale)})`,
            opacity: vsOpacity,
            zIndex: 15,
          }}
        >
          {/* Shockwave expanding ring */}
          <div
            style={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: 9999,
              border: '4px solid #81b64c',
              transform: `scale(${rippleScale})`,
              opacity: rippleOpacity,
              pointerEvents: 'none',
            }}
          />

          {/* Core VS Diamond Shield */}
          <div
            style={{
              padding: '16px 36px',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #81b64c 0%, #588c3e 100%)',
              border: '3px solid #ffffff',
              boxShadow: '0 8px 32px rgba(129, 182, 76, 0.6), 0 0 60px rgba(129, 182, 76, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 36 }}>⚔️</span>
            <span
              style={{
                color: '#ffffff',
                fontSize: 64,
                fontWeight: 900,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                letterSpacing: '0.05em',
                lineHeight: 1,
              }}
            >
              VS
            </span>
          </div>
        </div>
      </Sequence>

      {/* 6. Home Team (Param / White) */}
      <Sequence from={20} durationInFrames={100}>
        <KineticWord
          word={homeTeam}
          delay={20}
          subtext="Param Chotaliya • India"
          rating={homeRating}
          piece="white"
          accentColor="#81b64c"
        />
      </Sequence>

      {/* 7. Bottom Chess.com Watermark Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: 0.7,
        }}
      >
        <span style={{ fontSize: 18, color: '#81b64c' }}>♔</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Chess.com Match Clash • Pa_ra-m Official
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default KineticTitleCard;

