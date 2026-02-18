import { type Board, type PieceColor, type Position, type PieceType } from '../types/chess.ts';
import {applyMoveToBoard, cloneBoard, getLegalMoves, isInCheck} from "./boardUtils.ts";

// Piece values
const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Position tables for piece-square evaluation (from white's perspective)
const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],
  [50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],
  [5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],
  [0,0,0,0,0,0,0,0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],
  [-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],
  [-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,0,0,0,0,0,0,-10],
  [-10,0,5,10,10,5,0,-10],
  [-10,5,5,10,10,5,5,-10],
  [-10,0,10,10,10,10,0,-10],
  [-10,10,10,10,10,10,10,-10],
  [-10,5,0,0,0,0,5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
  [0,0,0,0,0,0,0,0],
  [5,10,10,10,10,10,10,5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [0,0,0,5,5,0,0,0]
];

const QUEEN_TABLE = [
  [-20,-10,-10,-5,-5,-10,-10,-20],
  [-10,0,0,0,0,0,0,-10],
  [-10,0,5,5,5,5,0,-10],
  [-5,0,5,5,5,5,0,-5],
  [0,0,5,5,5,5,0,-5],
  [-10,5,5,5,5,5,0,-10],
  [-10,0,5,0,0,0,0,-10],
  [-20,-10,-10,-5,-5,-10,-10,-20]
];

const KING_TABLE_MIDDLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20,20,0,0,0,0,20,20],
  [20,30,10,0,0,10,30,20]
];

const getPieceSquareValue = (
  type: PieceType,
  color: PieceColor,
  row: number,
  col: number
): number => {
  const r = color === 'white' ? row : 7 - row;
  switch (type) {
    case 'pawn': return PAWN_TABLE[r][col];
    case 'knight': return KNIGHT_TABLE[r][col];
    case 'bishop': return BISHOP_TABLE[r][col];
    case 'rook': return ROOK_TABLE[r][col];
    case 'queen': return QUEEN_TABLE[r][col];
    case 'king': return KING_TABLE_MIDDLE[r][col];
  }
};

const evaluateBoard = (board: Board, color: PieceColor): number => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const value = PIECE_VALUES[p.type] + getPieceSquareValue(p.type, p.color, r, c);
      score += p.color === color ? value : -value;
    }
  }
  return score;
};

interface AIMove {
  from: Position;
  to: Position;
}

const getAllMoves = (board: Board, color: PieceColor, enPassant: Position | null): AIMove[] => {
  const moves: AIMove[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        const legal = getLegalMoves(board, { row: r, col: c }, enPassant);
        legal.forEach(to => moves.push({ from: { row: r, col: c }, to }));
      }
    }
  }
  return moves;
};

const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiColor: PieceColor,
  enPassant: Position | null
): number => {
  const currentColor: PieceColor = maximizing ? aiColor : (aiColor === 'white' ? 'black' : 'white');
  
  if (depth === 0) return evaluateBoard(board, aiColor);

  const moves = getAllMoves(board, currentColor, enPassant);
  if (moves.length === 0) {
    if (isInCheck(board, currentColor)) {
      return maximizing ? -99999 : 99999;
    }
    return 0; // stalemate
  }

  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const newBoard = cloneBoard(board);
      const piece = newBoard[move.from.row][move.from.col]!;
      applyMoveToBoard(newBoard, move.from, move.to, piece);
      const val = minimax(newBoard, depth - 1, alpha, beta, false, aiColor, null);
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const newBoard = cloneBoard(board);
      const piece = newBoard[move.from.row][move.from.col]!;
      applyMoveToBoard(newBoard, move.from, move.to, piece);
      const val = minimax(newBoard, depth - 1, alpha, beta, true, aiColor, null);
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
};

export const getBestMove = (
  board: Board,
  color: PieceColor,
  depth: number,
  enPassant: Position | null
): AIMove | null => {
  const moves = getAllMoves(board, color, enPassant);
  if (moves.length === 0) return null;

  if (depth === 1) {
    // Easy: random move
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove: AIMove | null = null;
  let bestVal = -Infinity;

  // Shuffle for variety
  const shuffled = [...moves].sort(() => Math.random() - 0.5);

  for (const move of shuffled) {
    const newBoard = cloneBoard(board);
    const piece = newBoard[move.from.row][move.from.col]!;
    applyMoveToBoard(newBoard, move.from, move.to, piece);
    const val = minimax(newBoard, depth - 1, -Infinity, Infinity, false, color, null);
    if (val > bestVal) {
      bestVal = val;
      bestMove = move;
    }
  }

  return bestMove;
};
