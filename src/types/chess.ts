export interface ChessPlayer {
  username: string;
  player_id: number;
  title?: string;
  status: string;
  name?: string;
  avatar?: string;
  location?: string;
  country?: string;
  joined: number;
  last_online: number;
  followers: number;
  is_streamer: boolean;
  verified: boolean;
  league?: string;
  url: string;
}

export interface RatingRecord {
  win: number;
  loss: number;
  draw: number;
}

export interface RatingDetail {
  last?: {
    rating: number;
    date: number;
    rd: number;
  };
  best?: {
    rating: number;
    date: number;
    game: string;
  };
  record?: RatingRecord;
}

export interface PlayerStats {
  chess_rapid?: RatingDetail;
  chess_blitz?: RatingDetail;
  chess_bullet?: RatingDetail;
  chess_daily?: RatingDetail;
  tactics?: {
    highest?: { rating: number; date: number };
    lowest?: { rating: number; date: number };
  };
  puzzle_rush?: {
    best?: { total_attempts: number; score: number };
  };
}

export interface ChessGamePlayer {
  rating: number;
  result: string;
  username: string;
  avatar?: string;
  uuid?: string;
}

export interface ChessGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: 'rapid' | 'blitz' | 'bullet' | 'daily';
  rules: string;
  white: ChessGamePlayer;
  black: ChessGamePlayer;
  eco?: string;
  openingName?: string;
}

export interface OpeningNode {
  id: string;
  name: string;
  eco: string;
  moves: string;
  color: 'white' | 'black';
  gamesCount: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  children?: OpeningNode[];
}

export interface RatingMilestone {
  rating: number;
  date: string;
  label: string;
  format: string;
}
