
import { Difficulty } from './types';
import type { DifficultyConfig, Category, Direction } from './types';

export const DIRECTIONS: Record<string, Direction> = {
  HORIZONTAL: { dr: 0, dc: 1 },
  VERTICAL: { dr: 1, dc: 0 },
  DIAGONAL_DOWN: { dr: 1, dc: 1 },
  DIAGONAL_UP: { dr: -1, dc: 1 },
  BACK_HORIZONTAL: { dr: 0, dc: -1 },
  BACK_VERTICAL: { dr: -1, dc: 0 },
  BACK_DIAGONAL_DOWN: { dr: -1, dc: -1 },
  BACK_DIAGONAL_UP: { dr: 1, dc: -1 },
};

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.BEGINNER]: {
    gridSize: 12,
    wordCount: 30,
    directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL],
    minWordLength: 3,
    maxWordLength: 7,
  },
  [Difficulty.INTERMEDIATE]: {
    gridSize: 15,
    wordCount: 50,
    directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL, DIRECTIONS.DIAGONAL_DOWN],
    minWordLength: 4,
    maxWordLength: 9,
  },
  [Difficulty.ADVANCED]: {
    gridSize: 20,
    wordCount: 80,
    directions: [
      DIRECTIONS.HORIZONTAL,
      DIRECTIONS.VERTICAL,
      DIRECTIONS.DIAGONAL_DOWN,
      DIRECTIONS.DIAGONAL_UP,
      DIRECTIONS.BACK_HORIZONTAL
    ],
    minWordLength: 4,
    maxWordLength: 11,
  },
  [Difficulty.EXPERT]: {
    gridSize: 26,
    wordCount: 120,
    directions: Object.values(DIRECTIONS),
    minWordLength: 4,
    maxWordLength: 14,
  }
};

export const CATEGORIES: Category[] = [
  { id: 'tv-shows', name: 'Series', icon: '📺', description: 'Legendary TV shows' },
  { id: 'sitcoms', name: 'Sitcoms', icon: '🎭', description: 'Comedy classics' },
  { id: 'celebrities', name: 'Stars', icon: '⭐', description: 'Iconic celebrities' },
  { id: 'history', name: 'History', icon: '📜', description: 'Historic empires' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Physics and Space' },
  { id: 'tech', name: 'Tech', icon: '💻', description: 'Coding & Silicon Valley' },
  { id: 'food', name: 'Food', icon: '🍕', description: 'Global Cuisine' }
];

export const COLORS = {
  bg: '#0f172a',
  gridBg: '#1e293b',
  accent: '#38bdf8',
  success: '#22c55e',
  highlight: 'rgba(56, 189, 248, 0.4)',
  foundHighlight: 'rgba(34, 197, 94, 0.4)',
  text: '#f8fafc',
  textSecondary: '#94a3b8'
};

export const HIGHLIGHT_COLORS = [
  'rgba(248, 113, 113, 0.5)', // Red
  'rgba(96, 165, 250, 0.5)',  // Blue
  'rgba(74, 222, 128, 0.5)',  // Green
  'rgba(251, 191, 36, 0.5)',  // Amber
  'rgba(192, 132, 252, 0.5)', // Purple
  'rgba(244, 114, 182, 0.5)', // Pink
  'rgba(45, 212, 191, 0.5)',  // Teal
  'rgba(251, 146, 60, 0.5)',  // Orange
  'rgba(148, 163, 184, 0.5)', // Slate/Grey
  'rgba(163, 230, 53, 0.5)',  // Lime
];
