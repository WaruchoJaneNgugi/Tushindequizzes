// ─────────────────────────────────────────────────────────
// hooks/useAI.ts
// AI engine: Minimax search with Alpha-Beta pruning
// ─────────────────────────────────────────────────────────

import { useCallback } from 'react'
import { type Board, type Move } from '../types/checkers.types'
import {
  allMovesFor,
  jumpsFrom,
  applyMove,
  getWinner,
} from './boardLogic'

// ── Static board evaluation (Black = maximising player) ───

function evalBoard(board: Board): number {
  let score = 0
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p) continue
      const base    = p.king ? 3 : 1
      const center  = (3 - Math.abs(c - 3.5)) * 0.05
      const advance = p.type === 'black' ? r * 0.04 : (7 - r) * 0.04
      const val     = base + center + advance
      score += p.type === 'black' ? val : -val
    }
  return score
}

// ── Minimax with Alpha-Beta pruning ───────────────────────

function minimax(
  board:    Board,
  depth:    number,
  alpha:    number,
  beta:     number,
  isMax:    boolean,
  chainPos: [number, number] | null,
): number {
  const w = getWinner(board)
  if (w === 'black') return  10000 + depth   // AI wins  — sooner is better
  if (w === 'red')   return -10000 - depth   // Player wins
  if (depth === 0)   return evalBoard(board)

  let moves: Move[]
  if (chainPos) {
    moves = jumpsFrom(board, chainPos[0], chainPos[1])
    // Chain exhausted — switch sides and continue search
    if (moves.length === 0)
      return minimax(board, depth - 1, alpha, beta, !isMax, null)
  } else {
    moves = allMovesFor(board, isMax ? 'black' : 'red')
    if (moves.length === 0) return isMax ? -10000 : 10000
  }

  if (isMax) {
    let best = -Infinity
    for (const m of moves) {
      const nb     = applyMove(board, m)
      const chains = m.cap ? jumpsFrom(nb, m.to[0], m.to[1]) : []
      const val    = chains.length
        ? minimax(nb, depth,     alpha, beta, true,  m.to)
        : minimax(nb, depth - 1, alpha, beta, false, null)
      if (val > best) best = val
      if (best > alpha) alpha = best
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const m of moves) {
      const nb     = applyMove(board, m)
      const chains = m.cap ? jumpsFrom(nb, m.to[0], m.to[1]) : []
      const val    = chains.length
        ? minimax(nb, depth,     alpha, beta, false, m.to)
        : minimax(nb, depth - 1, alpha, beta, true,  null)
      if (val < best) best = val
      if (best < beta) beta = best
      if (beta <= alpha) break
    }
    return best
  }
}

// ── Pick the best move for Black ──────────────────────────

function pickBestMove(board: Board, depth: number): Move | null {
  const moves = allMovesFor(board, 'black')
  if (!moves.length) return null

  // Easy: random move, but always take a capture if available
  if (depth === 1) {
    const caps = moves.filter(m => m.cap)
    const pool = caps.length ? caps : moves
    return pool[Math.floor(Math.random() * pool.length)]
  }

  let best: Move | null = null
  let bestVal = -Infinity

  for (const m of moves) {
    const nb     = applyMove(board, m)
    const chains = m.cap ? jumpsFrom(nb, m.to[0], m.to[1]) : []
    const val    = chains.length
      ? minimax(nb, depth,     -Infinity, Infinity, true,  m.to)
      : minimax(nb, depth - 1, -Infinity, Infinity, false, null)
    if (val > bestVal) { bestVal = val; best = m }
  }
  return best
}

// ── Execute a full AI turn (including chain-jumps) ────────

export function executeAITurn(
  board: Board,
  depth: number,
): { board: Board; moved: boolean } {
  const first = pickBestMove(board, depth)
  if (!first) return { board, moved: false }

  let cur = applyMove(board, first)

  // Auto-chain any further compulsory jumps
  if (first.cap) {
    let [tr, tc] = first.to
    let chains   = jumpsFrom(cur, tr, tc)
    while (chains.length) {
      const next = depth === 1
        ? chains[Math.floor(Math.random() * chains.length)]
        : chains[0]           // deeper searches will have picked the best path already
      cur        = applyMove(cur, next);
      [tr, tc]   = next.to
      chains     = jumpsFrom(cur, tr, tc)
    }
  }

  return { board: cur, moved: true }
}

// ── React hook wrapper ────────────────────────────────────

export function useAI() {
  const runAITurn = useCallback(
    (board: Board, depth: number) => executeAITurn(board, depth),
    [],
  )
  return { runAITurn }
}
