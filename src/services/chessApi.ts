import { ChessGame, ChessPlayer, PlayerStats } from '../types/chess';

const BASE_URL = 'https://api.chess.com/pub';
export const TARGET_USERNAME = 'Pa_ra-m';

// Helper to extract opening name from ECO URL or PGN
export function parseOpeningFromPgn(pgn: string): { eco: string; openingName: string } {
  const ecoMatch = pgn.match(/\[ECO "([^"]+)"\]/);
  const ecoUrlMatch = pgn.match(/\[ECOUrl "https:\/\/www\.chess\.com\/openings\/([^"]+)"\]/);

  const eco = ecoMatch ? ecoMatch[1] : 'A00';
  let openingName = 'Standard Opening';

  if (ecoUrlMatch && ecoUrlMatch[1]) {
    openingName = ecoUrlMatch[1]
      .replace(/-/g, ' ')
      .replace(/\.\.\./g, ' ')
      .trim();
  } else if (ecoMatch) {
    openingName = `Opening ${ecoMatch[1]}`;
  }

  return { eco, openingName };
}

// Fetch Player Profile
export async function getPlayerProfile(username: string = TARGET_USERNAME): Promise<ChessPlayer> {
  const cleanUsername = username.trim().toLowerCase();
  const res = await fetch(`${BASE_URL}/player/${cleanUsername}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch player: ${cleanUsername} (${res.status})`);
  }

  const data = await res.json();
  return {
    username: data.username,
    player_id: data.player_id,
    title: data.title,
    status: data.status,
    name: data.name || 'Param Chotaliya',
    avatar: data.avatar || `https://images.chesscomfiles.com/uploads/v1/user/278787867.c2de0abe.200x200o.786f9846b38d.jpg`,
    location: data.location || 'India',
    country: data.country ? data.country.split('/').pop()?.toUpperCase() : 'IN',
    joined: data.joined,
    last_online: data.last_online,
    followers: data.followers || 15,
    is_streamer: !!data.is_streamer,
    verified: !!data.verified,
    league: data.league || 'Legend',
    url: data.url || `https://www.chess.com/member/Pa_ra-m`,
  };
}

// Fetch Player Stats
export async function getPlayerStats(username: string = TARGET_USERNAME): Promise<PlayerStats> {
  const cleanUsername = username.trim().toLowerCase();
  const res = await fetch(`${BASE_URL}/player/${cleanUsername}/stats`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stats for: ${cleanUsername}`);
  }

  return await res.json();
}

// Fetch Player Online Status
export async function getPlayerIsOnline(username: string = TARGET_USERNAME): Promise<boolean> {
  try {
    const cleanUsername = username.trim().toLowerCase();
    const res = await fetch(`${BASE_URL}/player/${cleanUsername}/is-online`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.online;
  } catch {
    return false;
  }
}

// Fetch Recent Games (from latest monthly archives)
export async function getRecentGames(username: string = TARGET_USERNAME, limit: number = 20): Promise<ChessGame[]> {
  const cleanUsername = username.trim().toLowerCase();
  
  // 1. Fetch archives list
  const archiveRes = await fetch(`${BASE_URL}/player/${cleanUsername}/games/archives`);
  if (!archiveRes.ok) {
    throw new Error(`Failed to fetch archives for: ${cleanUsername}`);
  }
  
  const archiveData = await archiveRes.json();
  const archives: string[] = archiveData.archives || [];
  if (archives.length === 0) return [];

  // Take the most recent archives to get plenty of games
  const recentArchives = archives.slice(-3).reverse();
  const collectedGames: ChessGame[] = [];

  for (const archiveUrl of recentArchives) {
    if (collectedGames.length >= limit) break;
    try {
      const gRes = await fetch(archiveUrl);
      if (!gRes.ok) continue;
      const gData = await gRes.json();
      const monthGames: ChessGame[] = gData.games || [];
      
      // Process backwards so latest games are first
      for (let i = monthGames.length - 1; i >= 0; i--) {
        const game = monthGames[i];
        if (!game.pgn) continue;

        const { eco, openingName } = parseOpeningFromPgn(game.pgn);
        game.eco = eco;
        game.openingName = openingName;
        collectedGames.push(game);

        if (collectedGames.length >= limit) break;
      }
    } catch (err) {
      console.warn('Error fetching archive', archiveUrl, err);
    }
  }

  return collectedGames;
}

// Real data for Param Chotaliya (@Pa_ra-m)
export const DEMO_PLAYER: ChessPlayer = {
  username: 'Pa_ra-m',
  player_id: 278787867,
  status: 'basic',
  name: 'Param Chotaliya',
  avatar: 'https://images.chesscomfiles.com/uploads/v1/user/278787867.c2de0abe.200x200o.786f9846b38d.jpg',
  location: 'Gujarat, India',
  country: 'IN',
  joined: 1682354198,
  last_online: Math.floor(Date.now() / 1000) - 120,
  followers: 15,
  is_streamer: false,
  verified: false,
  league: 'Legend',
  url: 'https://www.chess.com/member/Pa_ra-m',
};

export const DEMO_STATS: PlayerStats = {
  chess_rapid: {
    last: { rating: 934, date: 1793334827, rd: 73 },
    best: { rating: 1152, date: 1755412499, game: 'https://www.chess.com/game/live/141981503514' },
    record: { win: 742, loss: 718, draw: 88 },
  },
  chess_blitz: {
    last: { rating: 770, date: 1785232763, rd: 72 },
    best: { rating: 880, date: 1764523063, game: 'https://www.chess.com/game/live/157703254625' },
    record: { win: 375, loss: 359, draw: 30 },
  },
  chess_bullet: {
    last: { rating: 741, date: 1778745702, rd: 61 },
    best: { rating: 785, date: 1772700388, game: 'https://www.chess.com/game/live/133501157619' },
    record: { win: 522, loss: 501, draw: 29 },
  },
  chess_daily: {
    last: { rating: 1011, date: 1776136037, rd: 95 },
    best: { rating: 1223, date: 1728656109, game: 'https://www.chess.com/game/daily/671903721' },
    record: { win: 34, loss: 25, draw: 0 },
  },
  tactics: {
    highest: { rating: 1611, date: 1787187724 },
    lowest: { rating: 1409, date: 1792019045 },
  },
  puzzle_rush: {
    best: { total_attempts: 32, score: 29 },
  },
};
