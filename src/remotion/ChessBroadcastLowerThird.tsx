import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from 'remotion';

export interface ChessBroadcastLowerThirdProps {
  whitePlayer?: string;
  whiteElo?: number | string;
  blackPlayer?: string;
  blackElo?: number | string;
  moveNotation?: string;
  moveEvaluation?: 'brilliant' | 'great' | 'best' | 'blunder' | 'checkmate';
  accuracyPercent?: number;
  whiteClock?: string;
  blackClock?: string;
  evalScore?: string;
  tournamentTitle?: string;
  dayStreak?: number;
}

export const ChessBroadcastLowerThird: React.FC<ChessBroadcastLowerThirdProps> = ({
  whitePlayer = 'Pa_ra-m',
  whiteElo = 1152,
  blackPlayer = 'Ajith_chandolu',
  blackElo = 1149,
  moveNotation = '19... Nc2+!',
  moveEvaluation = 'brilliant',
  accuracyPercent = 96.8,
  whiteClock = '09:03',
  blackClock = '09:02',
  evalScore = '-9.4',
  tournamentTitle = 'CHESS.COM GRAND ARENA • LIVE BROADCAST',
  dayStreak = 569,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring animation for the lower third panel
  const panelSlide = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const panelTranslateY = interpolate(panelSlide, [0, 1], [220, 0]);
  const panelOpacity = interpolate(panelSlide, [0, 1], [0, 1]);

  // Staggered spring for move notation badge
  const moveBadgeScale = spring({
    frame: frame - 12,
    fps,
    config: { damping: 8, stiffness: 140 },
  });

  // Staggered spring for evaluation bar swing
  const evalSwing = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Evaluation styling
  const evalConfig = {
    brilliant: { label: 'BRILLIANT MOVE !!', color: '#00f0ff', bg: 'rgba(0, 240, 255, 0.15)', icon: '!!' },
    great: { label: 'GREAT MOVE !', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: '!' },
    best: { label: 'BEST MOVE ★', color: '#81b64c', bg: 'rgba(129, 182, 76, 0.15)', icon: '★' },
    checkmate: { label: 'CHECKMATE #', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', icon: '#' },
    blunder: { label: 'BLUNDER ??', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', icon: '??' },
  }[moveEvaluation] || { label: 'CHECKMATE #', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', icon: '#' };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#181914',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 40px 48px 40px',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Chess Watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 85%, rgba(129, 182, 76, 0.18) 0%, rgba(24, 25, 20, 0.98) 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Broadcast Lower Third Banner */}
      <div
        style={{
          width: '100%',
          maxWidth: 1600,
          transform: `translateY(${panelTranslateY}px)`,
          opacity: panelOpacity,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 28,
          backgroundColor: '#262421',
          border: '2px solid rgba(129, 182, 76, 0.4)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(129, 182, 76, 0.2)',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Top Header Strip: Tournament Title & Live Accuracy Meter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            padding: '12px 28px',
            backgroundColor: '#1b1a17',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: '0.14em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              {tournamentTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 'auto' }}>
            {dayStreak ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                }}
              >
                <span style={{ fontSize: 13 }}>🔥</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#f87171', letterSpacing: '0.04em' }}>
                  {dayStreak} DAYS
                </span>
              </div>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                MOVE ACCURACY:
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#81b64c',
                  backgroundColor: 'rgba(129, 182, 76, 0.15)',
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                {accuracyPercent}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>
                EVAL:
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#ffffff',
                  backgroundColor: '#81b64c',
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                {evalScore}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Main Content: White Player vs Black Player + Center Move Callout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 36px',
            gap: 24,
          }}
        >
          {/* WHITE PLAYER (Left) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                backgroundColor: '#ffffff',
                border: '2px solid #81b64c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              ♔
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {whitePlayer}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(129, 182, 76, 0.2)',
                    color: '#81b64c',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  WHITE
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#81b64c' }}>
                  {whiteElo} ELO
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#e5e7eb',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontFamily: 'monospace',
                  }}
                >
                  ⏱ {whiteClock}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: ANIMATED MOVE BADGE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${Math.max(0, moveBadgeScale)})`,
              padding: '0 16px',
            }}
          >
            {/* Move classification pill */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: evalConfig.color,
                backgroundColor: evalConfig.bg,
                border: `1px solid ${evalConfig.color}`,
                padding: '3px 12px',
                borderRadius: 9999,
                letterSpacing: '0.1em',
                marginBottom: 6,
                boxShadow: `0 0 16px ${evalConfig.color}40`,
              }}
            >
              {evalConfig.label}
            </span>

            {/* Move text (e.g. Qxh7#) */}
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textShadow: `0 0 24px ${evalConfig.color}80`,
              }}
            >
              {moveNotation}
            </span>
          </div>

          {/* BLACK PLAYER (Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 20,
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#d1d5db',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  BLACK
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {blackPlayer}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#e5e7eb',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontFamily: 'monospace',
                  }}
                >
                  ⏱ {blackClock}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>
                  {blackElo} ELO
                </span>
              </div>
            </div>

            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                backgroundColor: '#181914',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              ♚
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Animated Dynamic Evaluation Bar */}
        <div
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#181914',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(10, 50 + (evalSwing * 45)))}%`,
              background: 'linear-gradient(90deg, #81b64c 0%, #a3e635 100%)',
              boxShadow: '0 0 16px #81b64c',
              transition: 'width 200ms ease',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ChessBroadcastLowerThird;

