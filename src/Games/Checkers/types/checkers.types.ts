// ─────────────────────────────────────────────────────────
// types/checkers.types.ts
// All shared TypeScript types for Checkers Arena
// ─────────────────────────────────────────────────────────

export type PieceColor = 'red' | 'black'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type Screen = 'menu' | 'game' | 'result'

export type GameResult = 'win' | 'lose' | null

// A single checker piece on the board
export interface Piece {
  id: number
  type: PieceColor
  king: boolean
}

// A board cell is either a Piece or empty
export type Cell = Piece | null

// The full 8×8 board
export type Board = Cell[][]

// Represents one legal move
export interface Move {
  from: [number, number]
  to:   [number, number]
  cap:  [number, number] | null   // position of captured piece, null for simple move
}

// Configuration for each difficulty level
export interface LevelConfig {
  label:  string
  cost:   number    // points wagered to enter
  reward: number    // points awarded on win
  depth:  number    // minimax search depth
  color:  string    // UI accent hex color
}

export type LevelMap = Record<Difficulty, LevelConfig>
