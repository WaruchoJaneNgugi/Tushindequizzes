export type PieceColor = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  hasMoved: boolean;
}

export type Square = ChessPiece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  isEnPassant?: boolean;
  isCastle?: boolean;
}

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  label: string;
  cost: number;
  reward: number;
  depth: number;
  description: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'Easy', cost: 5, reward: 9, depth: 1, description: 'Random AI moves' },
  medium: { label: 'Medium', cost: 10, reward: 22, depth: 2, description: 'Basic strategy' },
  hard: { label: 'Hard', cost: 15, reward: 35, depth: 3, description: 'Advanced tactics' },
  expert: { label: 'Expert', cost: 25, reward: 65, depth: 4, description: 'Near-perfect play' },
};

export interface GameState {
  board: Board;
  currentTurn: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  capturedByWhite: ChessPiece[];
  capturedByBlack: ChessPiece[];
  status: GameStatus;
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  inCheck: boolean;
}

export interface PlayerStats {
  points: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
}
