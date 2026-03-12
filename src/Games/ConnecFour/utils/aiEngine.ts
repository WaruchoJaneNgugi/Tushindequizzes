import {type Board, ROWS, COLS, type Difficulty} from '../types/game.types';
import { checkWinner, dropPiece, getAvailableCols } from './gameLogic.ts';
import { type CellValue } from '../types/game.types';

type Piece = 'player' | 'computer';

const scoreWindow = (window: CellValue[], piece: Piece): number => {
  const opp: Piece = piece === 'computer' ? 'player' : 'computer';
  const mine   = window.filter(c => c === piece).length;
  const empty  = window.filter(c => c === null).length;
  const theirs = window.filter(c => c === opp).length;
  if (mine === 4)                  return  1000;
  if (mine === 3 && empty === 1)   return    10;
  if (mine === 2 && empty === 2)   return     3;
  if (theirs === 3 && empty === 1) return   -80;
  if (theirs === 2 && empty === 2) return    -3;
  return 0;
};

const scoreBoard = (board: Board, piece: Piece): number => {
  let score = 0;
  const center = Math.floor(COLS / 2);
  for (let r = 0; r < ROWS; r++) {
    if (board[r][center] === piece) score += 4;
    if (center > 0 && board[r][center - 1] === piece) score += 2;
    if (center < COLS - 1 && board[r][center + 1] === piece) score += 2;
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], piece);
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], piece);
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], piece);
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 3; c < COLS; c++)
      score += scoreWindow([board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]], piece);
  return score;
};

const minimax = (
  board: Board, depth: number, alpha: number, beta: number, maximizing: boolean
): [number | null, number] => {
  const { winner } = checkWinner(board);
  if (winner === 'computer') return [null,  100000 + depth];
  if (winner === 'player')   return [null, -100000 - depth];
  const available = getAvailableCols(board);
  if (available.length === 0 || depth === 0) return [null, scoreBoard(board, 'computer')];
  const center = Math.floor(COLS / 2);
  const ordered = [...available].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  if (maximizing) {
    let bestScore = -Infinity, bestCol = ordered[0];
    for (const col of ordered) {
      const res = dropPiece(board, col, 'computer');
      if (!res) continue;
      const [, score] = minimax(res.board, depth - 1, alpha, beta, false);
      if (score > bestScore) { bestScore = score; bestCol = col; }
      alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    }
    return [bestCol, bestScore];
  } else {
    let bestScore = Infinity, bestCol = ordered[0];
    for (const col of ordered) {
      const res = dropPiece(board, col, 'player');
      if (!res) continue;
      const [, score] = minimax(res.board, depth - 1, alpha, beta, true);
      if (score < bestScore) { bestScore = score; bestCol = col; }
      beta = Math.min(beta, score);
      if (alpha >= beta) break;
    }
    return [bestCol, bestScore];
  }
};

export const getAIMove = (board: Board, difficulty: Difficulty): number => {
  const available = getAvailableCols(board);
  if (available.length === 0) return -1;
  const random = () => available[Math.floor(Math.random() * available.length)];
  switch (difficulty) {
    case 'easy':   return Math.random() < 0.8 ? random() : (minimax(board, 2, -Infinity, Infinity, true)[0] ?? random());
    case 'medium': return Math.random() < 0.3 ? random() : (minimax(board, 4, -Infinity, Infinity, true)[0] ?? random());
    case 'hard':   return minimax(board, 6, -Infinity, Infinity, true)[0] ?? random();
    case 'expert': return minimax(board, 8, -Infinity, Infinity, true)[0] ?? random();
  }
};
