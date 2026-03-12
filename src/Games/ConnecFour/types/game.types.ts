export type CellValue = 'player' | 'computer' | null;
export type Board = CellValue[][];
export type GamePhase = 'menu' | 'levelSelect' | 'playing' | 'gameOver';
export type GameResult = 'won' | 'lost' | 'draw' | null;
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface LevelConfig {
  id: Difficulty;
  name: string;
  subtitle: string;
  cost: number;
  reward: number;
  aiDepth: number;
  description: string;
  color: string;
  darkColor: string;
  glowColor: string;
  icon: string;
  thinkMs: number;
  stars: number;
}

export interface WinResult {
  winner: CellValue;
  cells: [number, number][];
}

export const ROWS = 6;
export const COLS = 7;
export const INITIAL_POINTS = 20;

export const LEVEL_CONFIGS: Record<Difficulty, LevelConfig> = {
  easy: {
    id: 'easy',
    name: 'EASY',
    subtitle: 'Easy',
    cost: 1,
    reward: 2,
    aiDepth: 2,
    description: 'AI plays mostly random — perfect for beginners',
    color: '#00ff88',
    darkColor: '#002211',
    glowColor: 'rgba(0,255,136,0.5)',
    icon: '🌱',
    thinkMs: 400,
    stars: 1,
  },
  medium: {
    id: 'medium',
    name: 'MEDIUM',
    subtitle: 'Medium',
    cost: 2,
    reward: 4,
    aiDepth: 4,
    description: 'AI occasionally finds the smart move',
    color: '#00d4ff',
    darkColor: '#001522',
    glowColor: 'rgba(0,212,255,0.5)',
    icon: '⚡',
    thinkMs: 600,
    stars: 2,
  },
  hard: {
    id: 'hard',
    name: 'HARD',
    subtitle: 'Hard',
    cost: 3,
    reward: 6,
    aiDepth: 6,
    description: 'AI plays near-optimally — rare wins possible',
    color: '#ff8800',
    darkColor: '#221100',
    glowColor: 'rgba(255,136,0,0.5)',
    icon: '🔥',
    thinkMs: 800,
    stars: 3,
  },
  expert: {
    id: 'expert',
    name: 'EXPERT',
    subtitle: 'Expert',
    cost: 4,
    reward: 8,
    aiDepth: 8,
    description: 'Near-perfect AI — only legends survive',
    color: '#ff0055',
    darkColor: '#220011',
    glowColor: 'rgba(255,0,85,0.5)',
    icon: '💀',
    thinkMs: 1000,
    stars: 4,
  },
};
