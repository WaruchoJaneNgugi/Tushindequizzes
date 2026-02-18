// ─────────────────────────────────────────────────────────
// hooks/boardLogic.ts
// Pure functions for checkers board state — no React deps
// ─────────────────────────────────────────────────────────

import { type Board, type Cell, type Move, type PieceColor } from '../types/checkers.types'

// ── Initialisation ────────────────────────────────────────

export function initBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null) as Cell[])
  let id = 0
  // Black occupies rows 0-2 on dark squares (top of board)
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = { id: id++, type: 'black', king: false }
  // Red occupies rows 5-7 on dark squares (bottom of board — player)
  for (let r = 5; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = { id: id++, type: 'red', king: false }
  return b
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)))
}

// ── Direction helpers ─────────────────────────────────────

function getDirs(board: Board, r: number, c: number): [number, number][] {
  const p = board[r][c]
  if (!p) return []
  if (p.king) return [[-1,-1],[-1,1],[1,-1],[1,1]]
  return p.type === 'red' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]]
}

// ── Jump moves ────────────────────────────────────────────

export function jumpsFrom(board: Board, r: number, c: number): Move[] {
  const p = board[r][c]
  if (!p) return []
  const result: Move[] = []
  for (const [dr, dc] of getDirs(board, r, c)) {
    const mr = r + dr,     mc = c + dc
    const lr = r + 2 * dr, lc = c + 2 * dc
    if (lr < 0 || lr >= 8 || lc < 0 || lc >= 8) continue
    const mid = board[mr]?.[mc]
    if (!mid || mid.type === p.type || board[lr][lc] !== null) continue
    result.push({ from: [r, c], to: [lr, lc], cap: [mr, mc] })
  }
  return result
}

// ── Simple (non-jump) moves ───────────────────────────────

export function simpleFrom(board: Board, r: number, c: number): Move[] {
  const p = board[r][c]
  if (!p) return []
  const result: Move[] = []
  for (const [dr, dc] of getDirs(board, r, c)) {
    const nr = r + dr, nc = c + dc
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === null)
      result.push({ from: [r, c], to: [nr, nc], cap: null })
  }
  return result
}

// ── All moves for a player (forced-capture rule applied) ──

export function allMovesFor(board: Board, type: PieceColor): Move[] {
  const jumps: Move[] = [], simple: Move[] = []
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.type !== type) continue
      jumps.push(...jumpsFrom(board, r, c))
      simple.push(...simpleFrom(board, r, c))
    }
  return jumps.length > 0 ? jumps : simple
}

// ── Moves from a specific cell (respects forced-capture) ──

export function movesFromCell(board: Board, r: number, c: number): Move[] {
  const p = board[r][c]
  if (!p) return []
  const all = allMovesFor(board, p.type)
  return all.some(m => m.cap) ? jumpsFrom(board, r, c) : simpleFrom(board, r, c)
}

// ── Apply a move, returning a new board ───────────────────

export function applyMove(board: Board, move: Move): Board {
  const nb = cloneBoard(board)
  const [fr, fc] = move.from
  const [tr, tc] = move.to
  const piece = { ...nb[fr][fc]! }
  nb[fr][fc] = null
  if (move.cap) nb[move.cap[0]][move.cap[1]] = null
  // Promote to king
  if ((piece.type === 'red' && tr === 0) || (piece.type === 'black' && tr === 7))
    piece.king = true
  nb[tr][tc] = piece
  return nb
}

// ── Piece counting ────────────────────────────────────────

export function countPieces(board: Board, type: PieceColor): number {
  let n = 0
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.type === type) n++
  return n
}

// ── Win detection ─────────────────────────────────────────

export function getWinner(board: Board): PieceColor | null {
  if (countPieces(board, 'red')   === 0 || allMovesFor(board, 'red').length   === 0) return 'black'
  if (countPieces(board, 'black') === 0 || allMovesFor(board, 'black').length === 0) return 'red'
  return null
}
