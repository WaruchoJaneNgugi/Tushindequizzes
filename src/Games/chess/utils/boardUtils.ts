import { type Board, type ChessPiece, type PieceColor, type PieceType, type Position } from '../types/chess.ts';

export const INITIAL_BOARD_SETUP: Array<{ type: PieceType; color: PieceColor; row: number; col: number }> = [
  // Black pieces
  { type: 'rook', color: 'black', row: 0, col: 0 },
  { type: 'knight', color: 'black', row: 0, col: 1 },
  { type: 'bishop', color: 'black', row: 0, col: 2 },
  { type: 'queen', color: 'black', row: 0, col: 3 },
  { type: 'king', color: 'black', row: 0, col: 4 },
  { type: 'bishop', color: 'black', row: 0, col: 5 },
  { type: 'knight', color: 'black', row: 0, col: 6 },
  { type: 'rook', color: 'black', row: 0, col: 7 },
  ...Array.from({ length: 8 }, (_, i) => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor, row: 1, col: i })),
  // White pieces
  { type: 'rook', color: 'white', row: 7, col: 0 },
  { type: 'knight', color: 'white', row: 7, col: 1 },
  { type: 'bishop', color: 'white', row: 7, col: 2 },
  { type: 'queen', color: 'white', row: 7, col: 3 },
  { type: 'king', color: 'white', row: 7, col: 4 },
  { type: 'bishop', color: 'white', row: 7, col: 5 },
  { type: 'knight', color: 'white', row: 7, col: 6 },
  { type: 'rook', color: 'white', row: 7, col: 7 },
  ...Array.from({ length: 8 }, (_, i) => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor, row: 6, col: i })),
];

let pieceIdCounter = 0;
export const createPiece = (type: PieceType, color: PieceColor): ChessPiece => ({
  id: `${color}-${type}-${++pieceIdCounter}`,
  type,
  color,
  hasMoved: false,
});

export const createInitialBoard = (): Board => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  INITIAL_BOARD_SETUP.forEach(({ type, color, row, col }) => {
    board[row][col] = createPiece(type, color);
  });
  return board;
};

export const cloneBoard = (board: Board): Board =>
    board.map(row => row.map(square => (square ? { ...square } : null)));

export const isInBounds = (row: number, col: number): boolean =>
    row >= 0 && row < 8 && col >= 0 && col < 8;

export const posEquals = (a: Position, b: Position): boolean =>
    a.row === b.row && a.col === b.col;

export const opponent = (color: PieceColor): PieceColor =>
    color === 'white' ? 'black' : 'white';

export const findKing = (board: Board, color: PieceColor): Position | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'king' && p.color === color) return { row: r, col: c };
    }
  }
  return null;
};

// Helper function that doesn't depend on getRawMoves to avoid circular dependency
const isSquareAttackedByPiece = (
    board: Board,
    pos: Position,
    piece: ChessPiece,
    piecePos: Position
): boolean => {
  const { row: r, col: c } = piecePos;
  const { row: targetRow, col: targetCol } = pos;

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      // Pawns capture diagonally
      return (r + direction === targetRow) && (c - 1 === targetCol || c + 1 === targetCol);
    }
    case 'knight': {
      const dr = Math.abs(r - targetRow);
      const dc = Math.abs(c - targetCol);
      return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    }
    case 'bishop': {
      if (Math.abs(r - targetRow) !== Math.abs(c - targetCol)) return false;
      // Check if path is clear
      const stepRow = r < targetRow ? 1 : -1;
      const stepCol = c < targetCol ? 1 : -1;
      let checkRow = r + stepRow;
      let checkCol = c + stepCol;
      while (checkRow !== targetRow || checkCol !== targetCol) {
        if (board[checkRow][checkCol]) return false;
        checkRow += stepRow;
        checkCol += stepCol;
      }
      return true;
    }
    case 'rook': {
      if (r !== targetRow && c !== targetCol) return false;
      if (r === targetRow) {
        const stepCol = c < targetCol ? 1 : -1;
        for (let col = c + stepCol; col !== targetCol; col += stepCol) {
          if (board[r][col]) return false;
        }
      } else {
        const stepRow = r < targetRow ? 1 : -1;
        for (let row = r + stepRow; row !== targetRow; row += stepRow) {
          if (board[row][c]) return false;
        }
      }
      return true;
    }
    case 'queen': {
      // Queen combines rook and bishop movement
      if (r === targetRow || c === targetCol) {
        // Rook-like movement
        if (r === targetRow) {
          const stepCol = c < targetCol ? 1 : -1;
          for (let col = c + stepCol; col !== targetCol; col += stepCol) {
            if (board[r][col]) return false;
          }
        } else {
          const stepRow = r < targetRow ? 1 : -1;
          for (let row = r + stepRow; row !== targetRow; row += stepRow) {
            if (board[row][c]) return false;
          }
        }
        return true;
      } else if (Math.abs(r - targetRow) === Math.abs(c - targetCol)) {
        // Bishop-like movement
        const stepRow = r < targetRow ? 1 : -1;
        const stepCol = c < targetCol ? 1 : -1;
        let checkRow = r + stepRow;
        let checkCol = c + stepCol;
        while (checkRow !== targetRow || checkCol !== targetCol) {
          if (board[checkRow][checkCol]) return false;
          checkRow += stepRow;
          checkCol += stepCol;
        }
        return true;
      }
      return false;
    }
    case 'king': {
      return Math.abs(r - targetRow) <= 1 && Math.abs(c - targetCol) <= 1;
    }
    default:
      return false;
  }
};

export const isSquareAttacked = (
    board: Board,
    pos: Position,
    byColor: PieceColor
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === byColor) {
        if (isSquareAttackedByPiece(board, pos, p, { row: r, col: c })) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos, opponent(color));
};

/** Raw moves ignoring check */
export const getRawMoves = (
    board: Board,
    pos: Position,
    enPassantTarget: Position | null
): Position[] => {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col, color, type } = { ...pos, ...piece };

  const addIfValid = (r: number, c: number, mustCapture = false, canCapture = true) => {
    if (!isInBounds(r, c)) return false;
    const target = board[r][c];
    if (target && target.color === color) return false;
    if (mustCapture && !target) return false;
    if (!canCapture && target) return false;
    moves.push({ row: r, col: c });
    return !target;
  };

  const slide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc;
    while (isInBounds(r, c)) {
      const t = board[r][c];
      if (t) {
        if (t.color !== color) moves.push({ row: r, col: c });
        break;
      }
      moves.push({ row: r, col: c });
      r += dr; c += dc;
    }
  };

  switch (type) {
    case 'pawn': {
      const dir = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      addIfValid(row + dir, col, false, false);
      if (row === startRow && !board[row + dir][col]) addIfValid(row + dir * 2, col, false, false);
      addIfValid(row + dir, col - 1, true);
      addIfValid(row + dir, col + 1, true);
      // En passant
      if (enPassantTarget) {
        if (row + dir === enPassantTarget.row &&
            (col - 1 === enPassantTarget.col || col + 1 === enPassantTarget.col)) {
          moves.push({ row: row + dir, col: enPassantTarget.col });
        }
      }
      break;
    }
    case 'knight':
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
      break;
    case 'bishop':
      [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc));
      break;
    case 'rook':
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
      break;
    case 'queen':
      [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
      break;
    case 'king': {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));

      // Castling - use the new isSquareAttacked implementation
      const piece2 = board[row][col];
      if (piece2 && !piece2.hasMoved && !isSquareAttacked(board, { row, col }, opponent(color))) {
        // Kingside
        const kRook = board[row][7];
        if (kRook && !kRook.hasMoved && !board[row][5] && !board[row][6] &&
            !isSquareAttacked(board, { row, col: 5 }, opponent(color))) {
          moves.push({ row, col: 6 });
        }
        // Queenside
        const qRook = board[row][0];
        if (qRook && !qRook.hasMoved && !board[row][1] && !board[row][2] && !board[row][3] &&
            !isSquareAttacked(board, { row, col: 3 }, opponent(color))) {
          moves.push({ row, col: 2 });
        }
      }
      break;
    }
  }
  return moves;
};

export const getLegalMoves = (
    board: Board,
    pos: Position,
    enPassantTarget: Position | null
): Position[] => {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];
  const raw = getRawMoves(board, pos, enPassantTarget);
  return raw.filter(to => {
    const newBoard = cloneBoard(board);
    applyMoveToBoard(newBoard, pos, to, piece);
    return !isInCheck(newBoard, piece.color);
  });
};

export const applyMoveToBoard = (
    board: Board,
    from: Position,
    to: Position,
    piece: ChessPiece
): void => {
  const moving = { ...piece, hasMoved: true };
  board[to.row][to.col] = moving;
  board[from.row][from.col] = null;

  // En passant capture
  if (piece.type === 'pawn' && from.col !== to.col && !board[to.row][to.col]) {
    board[from.row][to.col] = null;
  }

  // Castling rook
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    if (to.col === 6) {
      board[from.row][5] = { ...board[from.row][7]!, hasMoved: true };
      board[from.row][7] = null;
    } else {
      board[from.row][3] = { ...board[from.row][0]!, hasMoved: true };
      board[from.row][0] = null;
    }
  }

  // Pawn promotion (auto-queen)
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    board[to.row][to.col] = { ...moving, type: 'queen' };
  }
};

export const hasAnyLegalMoves = (
    board: Board,
    color: PieceColor,
    enPassantTarget: Position | null
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        if (getLegalMoves(board, { row: r, col: c }, enPassantTarget).length > 0) return true;
      }
    }
  }
  return false;
};
// white pieces
import WhiteKing from "../assets/chessPieces/white/king.png"
import WhiteQueen from "../assets/chessPieces/white/queen.png"
import whiteBishop from "../assets/chessPieces/white/bishop.png"
import whiteKnight from "../assets/chessPieces/white/knight.png"
import whiteRook from "../assets/chessPieces/white/rook.png"
import whitePawn from "../assets/chessPieces/white/pawn.png"

// black pieces
import BlackKing from "../assets/chessPieces/black/king.png"
import BlackQueen from "../assets/chessPieces/black/queen.png"
import BlackBishop from "../assets/chessPieces/black/bishop.png"
import BlackKnight from "../assets/chessPieces/black/knight.png"
import BlackRook from "../assets/chessPieces/black/rook.png"
import BlackPawn from "../assets/chessPieces/black/pawn.png"


export const PIECE_SYMBOLS: Record<PieceType, Record<PieceColor, string>> = {
  king:   { white: WhiteKing, black: BlackKing },
  queen:  { white:WhiteQueen, black: BlackQueen },
  rook:   { white: whiteRook, black: BlackRook },
  bishop: { white: whiteBishop, black: BlackBishop },
  knight: { white: whiteKnight, black: BlackKnight },
  pawn:   { white: whitePawn, black: BlackPawn },
};