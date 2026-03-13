export type Suit = 'characters' | 'bamboos' | 'circles' | 'winds' | 'dragons' | 'flowers' | 'seasons';

export interface TileType {
  suit: Suit;
  value: number;
  symbol: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Stage {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  pointsPerMatch: number;
  positions: Position[];
}

export interface BoardTile {
  id: string;
  type: TileType;
  x: number;
  y: number;
  z: number;
}

export interface GameState {
  stage: Stage;
  tiles: BoardTile[];
  selectedTileId: string | null;
  history: { t1: BoardTile; t2: BoardTile }[];
  score: number;
  initialScore: number;
  matches: number;
  startTime: number;
  isGameOver: boolean;
  isVictory: boolean;
}
