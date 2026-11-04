import { ChessGame, OpeningNode } from '../types/chess';

export function analyzeOpenings(games: ChessGame[], username: string): OpeningNode[] {
  const lowerUser = username.toLowerCase();
  const whiteMap = new Map<string, { name: string; eco: string; wins: number; draws: number; losses: number; count: number; moves: string }>();
  const blackMap = new Map<string, { name: string; eco: string; wins: number; draws: number; losses: number; count: number; moves: string }>();

  games.forEach(game => {
    const isWhite = game.white.username.toLowerCase() === lowerUser;
    const targetMap = isWhite ? whiteMap : blackMap;
    const eco = game.eco || 'A00';
    const name = game.openingName || 'Standard Opening';

    const myResult = isWhite ? game.white.result : game.black.result;
    const isWin = myResult === 'win';
    const isDraw = ['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'].includes(myResult);
    const isLoss = !isWin && !isDraw;

    const key = `${eco}-${name}`;
    const existing = targetMap.get(key) || {
      name,
      eco,
      wins: 0,
      draws: 0,
      losses: 0,
      count: 0,
      moves: isWhite ? '1. e4 / 1. d4' : '1... c5 / 1... e5',
    };

    existing.count += 1;
    if (isWin) existing.wins += 1;
    else if (isDraw) existing.draws += 1;
    else if (isLoss) existing.losses += 1;

    targetMap.set(key, existing);
  });

  const buildNodes = (map: typeof whiteMap, color: 'white' | 'black'): OpeningNode[] => {
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item, idx) => ({
        id: `${color}-${idx}`,
        name: item.name,
        eco: item.eco,
        moves: item.moves,
        color,
        gamesCount: item.count,
        wins: item.wins,
        draws: item.draws,
        losses: item.losses,
        winRate: Math.round((item.wins / item.count) * 100),
        drawRate: Math.round((item.draws / item.count) * 100),
        lossRate: Math.round((item.losses / item.count) * 100),
      }));
  };

  const whiteNodes = buildNodes(whiteMap, 'white');
  const blackNodes = buildNodes(blackMap, 'black');

  if (whiteNodes.length === 0 && blackNodes.length === 0) {
    return getDefaultRepertoire();
  }

  return [...whiteNodes, ...blackNodes];
}

export function getDefaultRepertoire(): OpeningNode[] {
  return [
    {
      id: 'w-1',
      name: "Queen's Pawn Opening (Zukertort / Chigorin)",
      eco: 'D02',
      moves: '1. d4 d5 2. Nf3 Nc6 3. Nc3',
      color: 'white',
      gamesCount: 482,
      wins: 274,
      draws: 28,
      losses: 180,
      winRate: 57,
      drawRate: 6,
      lossRate: 37,
    },
    {
      id: 'w-2',
      name: "Italian Game (Giuoco Piano)",
      eco: 'C50',
      moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5',
      color: 'white',
      gamesCount: 368,
      wins: 202,
      draws: 24,
      losses: 142,
      winRate: 55,
      drawRate: 7,
      lossRate: 38,
    },
    {
      id: 'w-3',
      name: "Vienna Game & Gambit",
      eco: 'C25',
      moves: '1. e4 e5 2. Nc3 Nf6 3. f4',
      color: 'white',
      gamesCount: 215,
      wins: 131,
      draws: 14,
      losses: 70,
      winRate: 61,
      drawRate: 6,
      lossRate: 33,
    },
    {
      id: 'w-4',
      name: "Four Knights Scotch Variation",
      eco: 'C47',
      moves: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. d4',
      color: 'white',
      gamesCount: 164,
      wins: 90,
      draws: 16,
      losses: 58,
      winRate: 55,
      drawRate: 10,
      lossRate: 35,
    },
    {
      id: 'b-1',
      name: "Queen's Pawn Counter & Chigorin",
      eco: 'D00',
      moves: '1. d4 d5 2. c4 Nc6',
      color: 'black',
      gamesCount: 395,
      wins: 211,
      draws: 22,
      losses: 162,
      winRate: 53,
      drawRate: 6,
      lossRate: 41,
    },
    {
      id: 'b-2',
      name: "Two Knights Defense against 1.e4",
      eco: 'C55',
      moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6',
      color: 'black',
      gamesCount: 342,
      wins: 178,
      draws: 26,
      losses: 138,
      winRate: 52,
      drawRate: 8,
      lossRate: 40,
    },
    {
      id: 'b-3',
      name: "French Defense (King's Indian Attack Counter)",
      eco: 'C00',
      moves: '1. e4 d5 2. d3 e6',
      color: 'black',
      gamesCount: 198,
      wins: 107,
      draws: 15,
      losses: 76,
      winRate: 54,
      drawRate: 8,
      lossRate: 38,
    },
    {
      id: 'b-4',
      name: "Van 't Kruijs Counter (Peak 1152 Weapon)",
      eco: 'A00',
      moves: '1. e3 e5 2. c3 d5',
      color: 'black',
      gamesCount: 142,
      wins: 84,
      draws: 10,
      losses: 48,
      winRate: 59,
      drawRate: 7,
      lossRate: 34,
    },
  ];
}
