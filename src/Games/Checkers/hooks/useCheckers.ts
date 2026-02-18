// ─────────────────────────────────────────────────────────
// hooks/useCheckers.ts
// Master game-state hook — owns all state and game logic
// ─────────────────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react'
import { type Board, type Difficulty, type GameResult, type LevelMap, type Screen } from '../types/checkers.types'
import {
  initBoard,
  movesFromCell,
  jumpsFrom,
  applyMove,
  getWinner,
  countPieces,
} from './boardLogic'
import { executeAITurn } from './useAI'

// ── Level configuration ───────────────────────────────────

export const LEVELS: LevelMap = {
  easy:   { label: 'Easy',   cost: 1, reward: 2, depth: 1, color: '#4ade80' },
  medium: { label: 'Medium', cost: 2, reward: 4, depth: 3, color: '#fb923c' },
  hard:   { label: 'Hard',   cost: 3, reward: 6, depth: 5, color: '#f87171' },
  expert: { label: 'Expert', cost: 4, reward: 8, depth: 7, color: '#c084fc' },
}

export const INITIAL_POINTS = 20

// ── Hook ──────────────────────────────────────────────────

export function useCheckers() {
  const [screen,    setScreen]   = useState<Screen>('menu')
  const [points,    setPoints]   = useState(INITIAL_POINTS)
  const [level,     setLevel]    = useState<Difficulty | null>(null)
  const [board,     setBoard]    = useState<Board>(initBoard)
  const [turn,      setTurn]     = useState<'red' | 'black'>('red')
  const [selected,  setSelected] = useState<[number, number] | null>(null)
  const [highlights,setHL]       = useState<{ to: [number, number]; cap: [number,number]|null; from:[number,number] }[]>([])
  const [chainPiece,setChain]    = useState<[number, number] | null>(null)
  const [thinking,  setThinking] = useState(false)
  const [result,    setResult]   = useState<GameResult>(null)

  // Refs so the AI setTimeout closure always sees fresh values
  // without those values needing to appear in the effect's dep array
  const boardRef = useRef(board)
  const levelRef = useRef(level)
  const aiLocked = useRef(false)    // prevents double-scheduling
  boardRef.current = board
  levelRef.current = level

  // ── AI turn ─────────────────────────────────────────────
  // Deliberately depends only on [turn, screen].
  //
  // WHY: including `thinking` in deps was the original bug — when the
  // effect called setThinking(true), React re-ran the effect and its
  // cleanup fired, cancelling the setTimeout before the AI could move.
  // Using a ref-based lock (aiLocked) prevents double-scheduling safely.
  useEffect(() => {
    if (screen !== 'game' || turn !== 'black') return
    if (aiLocked.current) return
    aiLocked.current = true
    setThinking(true)

    const lvl   = LEVELS[levelRef.current!]
    const delay = lvl.depth >= 7 ? 1400 : lvl.depth >= 5 ? 900 : 500

    const tid = setTimeout(() => {
      const { board: nb, moved } = executeAITurn(boardRef.current, lvl.depth)
      aiLocked.current = false
      setThinking(false)

      if (!moved) {
        setResult('win')
        setScreen('result')
        return
      }

      setBoard(nb)
      const w = getWinner(nb)
      if (w) {
        setResult(w === 'red' ? 'win' : 'lose')
        setScreen('result')
      } else {
        setTurn('red')
      }
    }, delay)

    return () => clearTimeout(tid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, screen])

  // ── Player click handler ─────────────────────────────────

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (turn !== 'red' || screen !== 'game' || thinking) return

      const piece = board[r][c]

      // Try to land on a highlighted destination
      if (selected) {
        const move = highlights.find(m => m.to[0] === r && m.to[1] === c)
        if (move) {
          const nb = applyMove(board, move)
          setBoard(nb)
          setSelected(null)
          setHL([])

          if (move.cap) {
            const chains = jumpsFrom(nb, move.to[0], move.to[1])
            if (chains.length) {
              // Forced multi-jump — lock piece in place
              setSelected(move.to)
              setHL(chains)
              setChain(move.to)
              return
            }
          }

          setChain(null)
          const w = getWinner(nb)
          if (w) {
            setResult(w === 'red' ? 'win' : 'lose')
            setScreen('result')
          } else {
            setTurn('black')
          }
          return
        }
      }

      // Select a red piece (only if not mid-chain)
      if (piece && piece.type === 'red' && !chainPiece) {
        setSelected([r, c])
        setHL(movesFromCell(board, r, c))
      } else if (!chainPiece) {
        setSelected(null)
        setHL([])
      }
    },
    [turn, screen, thinking, board, selected, highlights, chainPiece],
  )

  // ── Start a new game ─────────────────────────────────────

  const startGame = useCallback(
    (lvlKey: Difficulty) => {
      const lvl = LEVELS[lvlKey]
      if (points <= lvl.cost) return          // insufficient balance
      aiLocked.current = false
      setLevel(lvlKey)
      setPoints(p => p - lvl.cost)
      setBoard(initBoard())
      setTurn('red')
      setSelected(null)
      setHL([])
      setChain(null)
      setResult(null)
      setThinking(false)
      setScreen('game')
    },
    [points],
  )

  // ── Return to main menu ──────────────────────────────────

  const returnToMenu = useCallback(() => {
    if (result === 'win' && level)
      setPoints(p => p + LEVELS[level].reward)
    aiLocked.current = false
    setScreen('menu')
    setLevel(null)
  }, [result, level])

  // ── Derived values ───────────────────────────────────────

  const destSet    = new Set(highlights.map(m => `${m.to[0]}-${m.to[1]}`))
  const lvlConfig  = level ? LEVELS[level] : null
  const redCount   = countPieces(board, 'red')
  const blackCount = countPieces(board, 'black')

  return {
    // State
    screen, points, level, board, turn,
    selected, chainPiece, thinking, result,
    redCount, blackCount, lvlConfig, destSet,
    // Actions
    handleCellClick, startGame, returnToMenu,
    // Constants (exposed for UI)
    LEVELS, INITIAL_POINTS,
  }
}
