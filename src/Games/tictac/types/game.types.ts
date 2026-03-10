// ─── Cell & Board ───────────────────────────────────────────────────────────
export type CellValue = 'X' | 'O' | null;
export type Player = 'X' | 'O';

// ─── Levels ─────────────────────────────────────────────────────────────────
export type GameLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface LevelConfig {
  id: GameLevel;
  label: string;
  wager: number;       // points deducted to enter
  reward: number;      // points earned on win
  drawRefund: boolean; // wager refunded on draw
  aiDepth: number;     // minimax depth
  aiRandomness: number;// 0–1 chance of random move
  color: string;       // primary accent hex
  glowColor: string;   // css shadow colour
  description: string;
  stars: number;       // 1–4 difficulty stars
}

// ─── Game ────────────────────────────────────────────────────────────────────
export type GameStatus = 'menu' | 'playing' | 'won' | 'lost' | 'draw';

export interface GameState {
  board: CellValue[];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  level: GameLevel | null;
  isAIThinking: boolean;
  moveCount: number;
}

// ─── Points ──────────────────────────────────────────────────────────────────
export type TransactionType = 'initial' | 'wager' | 'reward' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  level: GameLevel | null;
  timestamp: number;
}

export interface PointsState {
  balance: number;
  transactions: Transaction[];
}

// ─── Canvas ──────────────────────────────────────────────────────────────────
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: 'circle' | 'star';
}

export interface StarField {
  x: number;
  y: number;
  size: number;
  twinkle: number;
  speed: number;
}

export interface CellAnimation {
  index: number;
  scale: number;
  opacity: number;
  rotation: number;
  targetScale: number;
}
