
export const Difficulty = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface DifficultyConfig {
  gridSize: number; // Base width/columns
  wordCount: number;
  directions: Direction[];
  minWordLength: number;
  maxWordLength: number;
}

export interface Direction {
  dr: number;
  dc: number;
}

export interface Position {
  r: number;
  c: number;
}

export interface PlacedWord {
  word: string;
  start: Position;
  end: Position;
  found: boolean;
  cells: Position[];
  part: number; // 1 for first quest, 2 for second quest, 3 for third
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface GameState {
  grid: string[][];
  rows: number;
  cols: number;
  placedWords: PlacedWord[];
  difficulty: Difficulty;
  subLevel: number; // 1, 2, or 3
  category: Category;
  score: number;
  hintsUsed: number;
  status: 'IDLE' | 'PLAYING' | 'WON' | 'LOST';
}
