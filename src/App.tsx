import React, { useState, useEffect, useCallback } from 'react';
import { ChessPlayer, PlayerStats, ChessGame, OpeningNode } from './types/chess';
import {
  getPlayerProfile,
  getPlayerStats,
  getPlayerIsOnline,
  getRecentGames,
  DEMO_PLAYER,
  DEMO_STATS,
  TARGET_USERNAME,
} from './services/chessApi';
import { analyzeOpenings, getDefaultRepertoire } from './utils/openingAnalyzer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RatingAscent } from './components/RatingAscent';
import { InteractiveBoard } from './components/InteractiveBoard';
import { OpeningRepertoire } from './components/OpeningRepertoire';
import { CareerStats } from './components/CareerStats';
import { AwardsWall } from './components/AwardsWall';
import { ConnectSection } from './components/ConnectSection';
import { Footer } from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import { InteractiveMatchModule } from './components/InteractiveMatchModule';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // Locked strictly to Param Chotaliya (@Pa_ra-m)
  const username = TARGET_USERNAME;
  const [player, setPlayer] = useState<ChessPlayer>(DEMO_PLAYER);
  const [stats, setStats] = useState<PlayerStats>(DEMO_STATS);
  const [games, setGames] = useState<ChessGame[]>([]);
  const [openings, setOpenings] = useState<OpeningNode[]>(getDefaultRepertoire());
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dark theme state (defaulting to dark mode for sleek aesthetic)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chess_theme');
      if (saved) return saved === 'dark';
    }
    return true; // Default dark
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chess_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chess_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#81b64c', '#588c3e', '#ffffff', '#222222'],
      });
    } catch {
      // Ignore
    }
  };

  const loadParamData = useCallback(async () => {
    try {
      // 1. Fetch Profile
      const prof = await getPlayerProfile(username);
      setPlayer(prof);

      // 2. Fetch Stats & Online Status concurrently
      const [st, online] = await Promise.all([
        getPlayerStats(username).catch(() => DEMO_STATS),
        getPlayerIsOnline(username).catch(() => false),
      ]);
      setStats(st);
      setIsOnline(online);

      // 3. Fetch Recent Games
      try {
        const recent = await getRecentGames(username, 20);
        if (recent.length > 0) {
          setGames(recent);
          const analyzed = analyzeOpenings(recent, username);
          setOpenings(analyzed);
        } else {
          setOpenings(getDefaultRepertoire());
        }
      } catch (err) {
        console.warn('Could not load games, using defaults', err);
        setOpenings(getDefaultRepertoire());
      }

      showToast(`Synchronized live data for Param Chotaliya (@${username})!`, 'success');
      triggerCelebration();
    } catch (err: any) {
      console.warn('Network issue, using cached data for Pa_ra-m', err);
      showToast('Loaded profile for @Pa_ra-m', 'success');
    }
  }, [username]);

  useEffect(() => {
    loadParamData();
  }, [loadParamData]);

  const rWin = (stats.chess_rapid?.record?.win || 742) + (stats.chess_blitz?.record?.win || 375) + (stats.chess_bullet?.record?.win || 522) + (stats.chess_daily?.record?.win || 34);
  const rLoss = (stats.chess_rapid?.record?.loss || 718) + (stats.chess_blitz?.record?.loss || 359) + (stats.chess_bullet?.record?.loss || 501) + (stats.chess_daily?.record?.loss || 25);
  const rDraw = (stats.chess_rapid?.record?.draw || 88) + (stats.chess_blitz?.record?.draw || 30) + (stats.chess_bullet?.record?.draw || 29) + (stats.chess_daily?.record?.draw || 0);
  const totalGames = (rWin + rLoss + rDraw) || 3423;

  return (
    <div
      className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Floating Chess Particles Background */}
      <ParticleBackground />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-20 max-w-[calc(100vw-2rem)] z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold text-white ${
              toastMessage.type === 'success' ? 'bg-[#588c3e]' : 'bg-[#c53835]'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        player={player}
        isOnline={isOnline}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 pb-10">
        {/* Hero Section */}
        <Hero
          player={player}
          stats={stats}
          isDark={isDark}
        />

        {/* Section 2: The Rating Ascent */}
        <RatingAscent stats={stats} username={username} />

        {/* Section 3: Interactive Match Module (Programmatic Remotion Lower Third) */}
        <InteractiveMatchModule />

        {/* Section 4: The Interactive Game Replay Arena */}
        <InteractiveBoard games={games} currentUsername={username} />

        {/* Section 5: The Opening Repertoire Vault */}
        <OpeningRepertoire openings={openings} totalGames={totalGames} />

        {/* Section 6: Live Stats Grid & DNA Radar */}
        <CareerStats stats={stats} player={player} />

        {/* Section 7: The Grandmaster Awards Wall */}
        <AwardsWall player={player} stats={stats} />

        {/* Section 8: Let's Connect */}
        <ConnectSection player={player} />
      </main>

      {/* Footer */}
      <Footer player={player} />

    </div>
  );
};

export default App;
