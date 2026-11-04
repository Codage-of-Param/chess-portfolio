import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from 'remotion';

interface ChessCareerVideoProps {
  username?: string;
  rapidPeak?: number;
  blitzPeak?: number;
  totalGames?: number;
  isDark?: boolean;
}

export const ChessCareerVideo: React.FC<ChessCareerVideoProps> = ({
  username = 'Pa_ra-m',
  rapidPeak = 1152,
  blitzPeak = 880,
  totalGames = 3423,
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Helper for scene spring entrance
  const getSceneSpring = (startFrame: number) => {
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 13, stiffness: 95 },
    });
  };

  // Helper for crossfade opacity
  const getSceneOpacity = (start: number, end: number, fadeLen = 15) => {
    return interpolate(
      frame,
      [start, start + fadeLen, end - fadeLen, end],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  // -------------------------------------------------------------
  // SCENE TIMINGS (7 Scenes covering all menus / 600 frames = 20s)
  // -------------------------------------------------------------
  // Scene 1: Home / Hero (0 - 90 / 0 - 3s)
  const s1Spring = getSceneSpring(0);
  const s1Opacity = getSceneOpacity(0, 90);

  // Scene 2: 3D Story & Origins (85 - 175 / 2.8 - 5.8s)
  const s2Spring = getSceneSpring(85);
  const s2Opacity = getSceneOpacity(85, 175);

  // Scene 3: The Rating Ascent (170 - 260 / 5.6 - 8.6s)
  const s3Spring = getSceneSpring(170);
  const s3Opacity = getSceneOpacity(170, 260);

  // Scene 4: Arena & Game Replay (255 - 345 / 8.5 - 11.5s)
  const s4Spring = getSceneSpring(255);
  const s4Opacity = getSceneOpacity(255, 345);

  // Scene 5: Opening Repertoire Vault (340 - 430 / 11.3 - 14.3s)
  const s5Spring = getSceneSpring(340);
  const s5Opacity = getSceneOpacity(340, 430);

  // Scene 6: Live Stats & Grandmaster DNA (425 - 515 / 14.1 - 17.1s)
  const s6Spring = getSceneSpring(425);
  const s6Opacity = getSceneOpacity(425, 515);

  // Scene 7: Connect & Challenge Grand Finale (510 - 600 / 17.0 - 20s)
  const s7Spring = getSceneSpring(510);
  const s7Opacity = interpolate(frame, [510, 525, 585, 600], [0, 1, 1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ambient pulsing glow
  const glowPulse = Math.sin((frame / fps) * 4) * 0.15 + 0.85;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0c0e0b',
        color: '#f5f6f4',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic Background Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(129, 182, 76, 0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          opacity: 0.65,
        }}
      />

      {/* Atmospheric Ambient Emerald Fog */}
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(129, 182, 76, 0.25) 0%, rgba(129, 182, 76, 0.05) 55%, transparent 75%)',
          transform: `scale(${glowPulse})`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Video HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: 35,
          left: 50,
          right: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 12px #ef4444',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '2px', color: '#ffffff' }}>
            PA_RA-M REEL • ALL MENUS COVERED
          </span>
        </div>

        {/* Global Reel Timeline Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#81b64c' }}>
            {Math.floor((frame / 600) * 100)}% COMPLETE
          </span>
          <div
            style={{
              width: 160,
              height: 6,
              borderRadius: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(frame / 600) * 100}%`,
                height: '100%',
                backgroundColor: '#81b64c',
              }}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 1: HOME / HERO (Param Identity & Knight)
          ═══════════════════════════════════════════════════════════ */}
      {frame < 95 && (
        <div
          style={{
            opacity: s1Opacity,
            transform: `scale(${s1Spring}) translateY(${(1 - s1Spring) * 30}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 60,
            zIndex: 10,
            width: '85%',
          }}
        >
          {/* Left Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 650 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 20px',
                borderRadius: 9999,
                background: '#192015',
                border: '2px solid rgba(129, 182, 76, 0.5)',
                boxShadow: '0 0 20px rgba(129, 182, 76, 0.3)',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '2px',
                color: '#81b64c',
                textTransform: 'uppercase',
                width: 'fit-content',
              }}
            >
              MENU 01 • HOME & IDENTITY
            </div>

            <h1 style={{ fontSize: 68, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.05, margin: 0 }}>
              PARAM CHOTALIYA
            </h1>

            <div style={{ fontSize: 30, fontWeight: 800, color: '#81b64c', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>@{username}</span>
              <span style={{ color: '#888' }}>•</span>
              <span style={{ color: '#ffffff' }}>Legend League</span>
              <span style={{ color: '#888' }}>•</span>
              <span style={{ color: '#ffffff' }}>3,423 Matches</span>
            </div>

            <p style={{ fontSize: 20, color: '#a0a898', lineHeight: 1.5, margin: 0 }}>
              Welcome to the official portfolio. Dynamic attacking chess, sub-second tactical intuition, and live rating ascents.
            </p>
          </div>

          {/* Right: Floating 3D Knight */}
          <div style={{ width: 280, height: 380, position: 'relative' }}>
            <img
              src="/assets/knight_white.png"
              alt="Knight"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8)) drop-shadow(0 0 35px rgba(129, 182, 76, 0.4))',
                transform: `rotate(${Math.sin(frame * 0.05) * 4}deg) translateY(${Math.sin(frame * 0.08) * 8}px)`,
              }}
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 2: 3D STORY & QUEST (Origins & 5 Acts)
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 85 && frame < 180 && (
        <div
          style={{
            opacity: s2Opacity,
            transform: `scale(${s2Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 24,
            zIndex: 10,
            width: '85%',
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              background: '#192015',
              border: '2px solid rgba(129, 182, 76, 0.5)',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#81b64c',
              textTransform: 'uppercase',
            }}
          >
            MENU 02 • 3D STORY QUEST
          </div>

          <h2 style={{ fontSize: 58, fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>
            The 5 Acts of Evolution
          </h2>

          <p style={{ fontSize: 22, color: '#a0a898', maxWidth: 750, margin: 0, lineHeight: 1.5 }}>
            From his first 1.e4 opening moves in spring 2023 to tactical awakening, bullet trials, and the Legend League summit.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, width: '100%', marginTop: 10 }}>
            {[
              { act: 'ACT I', label: '1.e4 Debut', color: '#81b64c' },
              { act: 'ACT II', label: '1611 Tactics', color: '#ef4444' },
              { act: 'ACT III', label: 'Bullet Storm', color: '#a855f7' },
              { act: 'ACT IV', label: '1152 Rapid', color: '#f59e0b' },
              { act: 'ACT V', label: 'Legend DNA', color: '#10b981' },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: '#161a14',
                  border: `2px solid ${step.color}50`,
                  borderRadius: 20,
                  padding: '20px 14px',
                  boxShadow: `0 8px 20px rgba(0,0,0,0.5)`,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 900, color: step.color }}>{step.act}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 6 }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 3: THE RATING ASCENT (Rapid, Blitz, Bullet, Daily)
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 170 && frame < 265 && (
        <div
          style={{
            opacity: s3Opacity,
            transform: `scale(${s3Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            width: '85%',
            maxWidth: 1050,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              background: '#192015',
              border: '2px solid rgba(129, 182, 76, 0.5)',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#81b64c',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            MENU 03 • RATING ASCENT
          </div>

          <h2 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 32px 0' }}>
            Live Performance Ascent
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, width: '100%' }}>
            {/* Rapid */}
            <div style={{ background: '#161913', border: '2px solid rgba(129, 182, 76, 0.4)', borderRadius: 24, padding: '24px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#81b64c' }}>RAPID PEAK</div>
              <div style={{ fontSize: 56, fontWeight: 900, marginTop: 6, color: '#ffffff' }}>
                {Math.round(interpolate(frame, [175, 215], [700, rapidPeak], { extrapolateRight: 'clamp' }))}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>742+ Career Wins</div>
            </div>

            {/* Daily */}
            <div style={{ background: '#161913', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: 24, padding: '24px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>DAILY PEAK</div>
              <div style={{ fontSize: 56, fontWeight: 900, marginTop: 6, color: '#ffffff' }}>
                {Math.round(interpolate(frame, [180, 220], [800, 1223], { extrapolateRight: 'clamp' }))}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>34-0 Win Record</div>
            </div>

            {/* Blitz */}
            <div style={{ background: '#161913', border: '2px solid rgba(245, 158, 11, 0.4)', borderRadius: 24, padding: '24px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#f59e0b' }}>BLITZ PEAK</div>
              <div style={{ fontSize: 56, fontWeight: 900, marginTop: 6, color: '#ffffff' }}>
                {Math.round(interpolate(frame, [185, 225], [500, blitzPeak], { extrapolateRight: 'clamp' }))}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>375+ Fast Pace Wins</div>
            </div>

            {/* Bullet */}
            <div style={{ background: '#161913', border: '2px solid rgba(239, 68, 68, 0.4)', borderRadius: 24, padding: '24px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#ef4444' }}>BULLET 1M</div>
              <div style={{ fontSize: 56, fontWeight: 900, marginTop: 6, color: '#ffffff' }}>
                {Math.round(interpolate(frame, [190, 230], [500, 785], { extrapolateRight: 'clamp' }))}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>1,052 Speed Battles</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 4: ARENA & REPLAY (Game Engine & Decisive Finishes)
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 255 && frame < 350 && (
        <div
          style={{
            opacity: s4Opacity,
            transform: `scale(${s4Spring})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 60,
            zIndex: 10,
            width: '85%',
          }}
        >
          {/* Left: Interactive Chess Board Mockup */}
          <div
            style={{
              width: 320,
              height: 320,
              borderRadius: 24,
              border: '3px solid #81b64c',
              boxShadow: '0 0 35px rgba(129, 182, 76, 0.35)',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridTemplateRows: 'repeat(8, 1fr)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {Array.from({ length: 64 }).map((_, idx) => {
              const r = Math.floor(idx / 8);
              const c = idx % 8;
              const isGreen = (r + c) % 2 === 1;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isGreen ? '#739552' : '#eceecc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              );
            })}
            {/* Animated Knight Piece on Board */}
            <div
              style={{
                position: 'absolute',
                left: '62.5%',
                top: '62.5%',
                width: 40,
                height: 40,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img src="/assets/pieces/bases/wn.png" alt="Knight" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Right: Text & Key Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
            <div
              style={{
                padding: '8px 18px',
                borderRadius: 9999,
                background: '#192015',
                border: '2px solid rgba(129, 182, 76, 0.5)',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '2px',
                color: '#81b64c',
                textTransform: 'uppercase',
                width: 'fit-content',
              }}
            >
              MENU 04 • ARENA REPLAY ENGINE
            </div>

            <h3 style={{ fontSize: 46, fontWeight: 900, margin: 0 }}>
              Live Game Replay & Analysis
            </h3>

            <p style={{ fontSize: 19, color: '#a0a898', lineHeight: 1.6, margin: 0 }}>
              Interactive move scrubber, eval bar, and tactical analysis directly connected to live Chess.com PGN archives.
            </p>

            <div
              style={{
                padding: '12px 20px',
                borderRadius: 16,
                background: '#192215',
                border: '1px solid rgba(129, 182, 76, 0.4)',
                fontSize: 16,
                fontWeight: 800,
                color: '#81b64c',
              }}
            >
              ⚡ 95.7% Decisive Game Finishes (Only 4.3% Draws)
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 5: OPENING REPERTOIRE (Italian & Sicilian)
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 340 && frame < 435 && (
        <div
          style={{
            opacity: s5Opacity,
            transform: `scale(${s5Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            width: '85%',
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              background: '#192015',
              border: '2px solid rgba(129, 182, 76, 0.5)',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#81b64c',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            MENU 05 • REPERTOIRE VAULT
          </div>

          <h2 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 32px 0' }}>
            Mastered Opening Repertoire
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, width: '100%' }}>
            {/* Italian */}
            <div style={{ background: '#161913', border: '2px solid rgba(129, 182, 76, 0.5)', borderRadius: 24, padding: '26px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#81b64c' }}>ECO C50 • PRIMARY WEAPON</div>
              <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8, color: '#ffffff' }}>Italian Game</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#81b64c', marginTop: 10 }}>54.8% W</div>
              <div style={{ fontSize: 14, color: '#a0a898', marginTop: 4 }}>Giuoco Piano Sharpness</div>
            </div>

            {/* Sicilian */}
            <div style={{ background: '#161913', border: '2px solid rgba(245, 158, 11, 0.5)', borderRadius: 24, padding: '26px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b' }}>ECO B00 • ASYMMETRIC COUNTER</div>
              <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8, color: '#ffffff' }}>Sicilian Defense</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#f59e0b', marginTop: 10 }}>51.2% W</div>
              <div style={{ fontSize: 14, color: '#a0a898', marginTop: 4 }}>Dynamic Counter-Punches</div>
            </div>

            {/* King Pawn */}
            <div style={{ background: '#161913', border: '2px solid rgba(59, 130, 246, 0.5)', borderRadius: 24, padding: '26px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#3b82f6' }}>ECO C20 • CENTRAL STRIKE</div>
              <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8, color: '#ffffff' }}>King&apos;s Pawn Game</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#3b82f6', marginTop: 10 }}>52.4% W</div>
              <div style={{ fontSize: 14, color: '#a0a898', marginTop: 4 }}>Rapid Piece Activation</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 6: LIVE STATS & GRANDMASTER DNA RADAR
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 425 && frame < 520 && (
        <div
          style={{
            opacity: s6Opacity,
            transform: `scale(${s6Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            width: '85%',
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              background: '#192015',
              border: '2px solid rgba(129, 182, 76, 0.5)',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#81b64c',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            MENU 06 • GRANDMASTER DNA RADAR
          </div>

          <h2 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 10px 0' }}>
            Dynamic Tactical Attacker (85%)
          </h2>

          <p style={{ fontSize: 18, color: '#a0a898', margin: '0 0 28px 0' }}>
            5-Vector composite calculated across Param&apos;s whole chess journey on Chess.com
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, width: '100%' }}>
            {[
              { name: 'Intuition', rate: 91, color: '#a855f7', detail: '29 Puzzle Rush' },
              { name: 'Attack', rate: 88, color: '#ef4444', detail: '1,673 Wins' },
              { name: 'Strategic', rate: 85, color: '#10b981', detail: '1,223 Daily' },
              { name: 'Time Mgmt', rate: 83, color: '#f59e0b', detail: '1,052 Bullet' },
              { name: 'Defence', rate: 80, color: '#3b82f6', detail: 'Endgame Grit' },
            ].map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: '#161913',
                  border: `2px solid ${m.color}60`,
                  borderRadius: 22,
                  padding: '20px 14px',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.name.toUpperCase()}</div>
                <div style={{ fontSize: 52, fontWeight: 900, color: '#ffffff', marginTop: 6 }}>{m.rate}%</div>
                <div style={{ fontSize: 12, color: '#a0a898', marginTop: 4 }}>{m.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SCENE 7: CONNECT & CHALLENGE GRAND FINALE
          ═══════════════════════════════════════════════════════════ */}
      {frame >= 510 && (
        <div
          style={{
            opacity: s7Opacity,
            transform: `scale(${s7Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              background: '#192015',
              border: '2px solid rgba(129, 182, 76, 0.5)',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '2px',
              color: '#81b64c',
              textTransform: 'uppercase',
            }}
          >
            MENU 07 • CONNECT & CHALLENGE
          </div>

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #81b64c 0%, #588c3e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(129, 182, 76, 0.6)',
              fontSize: 38,
            }}
          >
            ⚔️
          </div>

          <h2 style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
            Ready to Play Param?
          </h2>

          <p style={{ fontSize: 22, color: '#a0a898', maxWidth: 650, margin: 0 }}>
            Send a 10-minute Rapid or 3-minute Blitz challenge on Chess.com.
          </p>

          <div
            style={{
              padding: '18px 42px',
              borderRadius: 9999,
              background: '#81b64c',
              color: '#ffffff',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '1px',
              boxShadow: '0 12px 35px rgba(129, 182, 76, 0.45)',
              marginTop: 10,
            }}
          >
            chess.com/member/Pa_ra-m
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default ChessCareerVideo;
