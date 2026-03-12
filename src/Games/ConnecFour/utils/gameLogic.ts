import { type Board, type CellValue, type WinResult, ROWS, COLS } from '../types/game.types';

export const createEmptyBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array<CellValue>(COLS).fill(null));

export const getDropRow = (board: Board, col: number): number => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) return row;
  }
  return -1;
};

export const dropPiece = (
  board: Board,
  col: number,
  player: 'player' | 'computer'
): { board: Board; row: number } | null => {
  const row = getDropRow(board, col);
  if (row === -1) return null;
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return { board: newBoard, row };
};

export const checkWinner = (board: Board): WinResult => {
  const directions: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell) continue;
      for (const [dr, dc] of directions) {
        const cells: [number, number][] = [[r, c]];
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== cell) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return { winner: cell, cells };
      }
    }
  }
  return { winner: null, cells: [] };
};

export const isDraw = (board: Board): boolean =>
  board[0].every(cell => cell !== null);

export const getAvailableCols = (board: Board): number[] =>
  Array.from({ length: COLS }, (_, i) => i).filter(col => board[0][col] === null);

export const isWinningCell = (
  row: number, col: number, winningCells: [number, number][]
): boolean => winningCells.some(([r, c]) => r === row && c === col);
