// ─────────────────────────────────────────────────────────
// CheckersArena.tsx
// Root UI component — composes all screens
// ─────────────────────────────────────────────────────────

import React, { type CSSProperties, useState } from 'react'
import { useCheckers, LEVELS } from './hooks/useCheckers'
import { type Difficulty, type GameResult, type LevelConfig } from './types/checkers.types'
import { type Board } from './types/checkers.types'

// ── Shared tokens ─────────────────────────────────────────

const GOLD = 'linear-gradient(180deg,#f5c842,#c9922a)'

const BASE: CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(160deg,#0a0a0f 0%,#0d0f1c 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '"Cinzel","Palatino Linotype",Georgia,serif',
  color: 'white',
  padding: 20,
  boxSizing: 'border-box',
}

// ── MenuScreen ────────────────────────────────────────────

interface MenuScreenProps {
  points:  number
  onStart: (lvl: Difficulty) => void
}

function LevelCard({
  lvlKey, lvl, canPlay, onClick,
}: {
  lvlKey:  Difficulty
  lvl:     LevelConfig
  canPlay: boolean
  onClick: (k: Difficulty) => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => canPlay && onClick(lvlKey)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'linear-gradient(135deg,rgba(10,10,20,.95),rgba(15,15,30,.9))',
        border: `1px solid ${canPlay ? (hov ? lvl.color + 'aa' : lvl.color + '55') : '#1a1a2a'}`,
        borderRadius: 12,
        padding: '22px 20px',
        cursor: canPlay ? 'pointer' : 'not-allowed',
        textAlign: 'center',
        opacity: canPlay ? 1 : 0.45,
        transform: hov && canPlay ? 'translateY(-3px)' : 'none',
        boxShadow: hov && canPlay ? `0 8px 30px ${lvl.color}22` : 'none',
        transition: 'all .25s',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: lvl.color, marginBottom: 8 }}>
        {lvl.label}
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${lvl.color}44,transparent)`, marginBottom: 10 }} />
      <div style={{ fontSize: 12, color: '#6a6a7a', marginBottom: 4 }}>
        Wager: <span style={{ color: '#ccc', fontWeight: 600 }}>{lvl.cost} pt{lvl.cost > 1 ? 's' : ''}</span>
      </div>
      <div style={{ fontSize: 12, color: '#6a6a7a' }}>
        Win: <span style={{ color: '#f5c842', fontWeight: 700 }}>+{lvl.reward} pts</span>
      </div>
      {!canPlay && (
        <div style={{ fontSize: 10, color: '#444', marginTop: 8 }}>Need &gt;{lvl.cost} pts</div>
      )}
    </div>
  )
}

function MenuScreen({ points, onStart }: MenuScreenProps) {
  return (
    <div style={{ ...BASE, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'radial-gradient(circle at 20% 30%,rgba(180,130,30,.06) 0%,transparent 50%),' +
          'radial-gradient(circle at 80% 70%,rgba(180,130,30,.06) 0%,transparent 50%)',
      }} />

      <div style={{ fontSize: 13, letterSpacing: 8, color: '#8b7340', marginBottom: 12 }}>
        PREMIUM CHECKERS
      </div>

      <h1 style={{
        fontSize: 52, margin: '0 0 6px', fontWeight: 700, letterSpacing: 3,
        background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        ♟ ARENA
      </h1>

      <div style={{ fontSize: 13, color: '#5a5a6a', letterSpacing: 2, marginBottom: 48 }}>
        WAGER · PLAY · CONQUER
      </div>

      {/* Balance card */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(245,200,66,.12),rgba(201,146,42,.06))',
        border: '1px solid rgba(245,200,66,.3)',
        borderRadius: 16, padding: '20px 60px', marginBottom: 48,
        textAlign: 'center', boxShadow: '0 0 40px rgba(245,200,66,.08)',
      }}>
        <div style={{ fontSize: 11, color: '#8b7340', letterSpacing: 4, marginBottom: 8 }}>
          YOUR BALANCE
        </div>
        <div style={{
          fontSize: 54, fontWeight: 700,
          background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {points}
        </div>
        <div style={{ fontSize: 11, color: '#5a5a6a', letterSpacing: 2 }}>POINTS</div>
      </div>

      {/* Level grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 440, marginBottom: 32 }}>
        {(Object.entries(LEVELS) as [Difficulty, LevelConfig][]).map(([k, lvl]) => (
          <LevelCard key={k} lvlKey={k} lvl={lvl} canPlay={points > lvl.cost} onClick={onStart} />
        ))}
      </div>

      <div style={{ fontSize: 11, color: '#333', letterSpacing: 2 }}>
        YOU = <span style={{ color: '#e05555' }}>● RED</span>
        &nbsp;·&nbsp;
        AI = <span style={{ color: '#888' }}>● BLACK</span>
      </div>
    </div>
  )
}

// ── ResultScreen ──────────────────────────────────────────

interface ResultScreenProps {
  result:      Exclude<GameResult, null>
  points:      number
  levelConfig: LevelConfig
  onReturn:    () => void
}

function ResultScreen({ result, points, levelConfig, onReturn }: ResultScreenProps) {
  const won    = result === 'win'
  const newBal = won ? points + levelConfig.reward : points
  return (
    <div style={{
      ...BASE,
      background: `linear-gradient(160deg,#0a0a0f,${won ? '#0d1a0d' : '#1a0a0d'} 50%,#0a0a0f)`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 96, marginBottom: 8, lineHeight: 1 }}>{won ? '♔' : '✕'}</div>
      <div style={{
        fontSize: 44, fontWeight: 700, marginBottom: 8,
        background: won ? GOLD : 'linear-gradient(180deg,#ef4444,#991b1b)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {won ? 'VICTORY' : 'DEFEATED'}
      </div>
      <div style={{ fontSize: 14, color: won ? '#4ade80' : '#f87171', letterSpacing: 3, marginBottom: 48 }}>
        {won ? `+${levelConfig.reward} POINTS EARNED` : `${levelConfig.cost} POINTS LOST`}
      </div>
      <div style={{
        background: 'rgba(245,200,66,.08)', border: '1px solid rgba(245,200,66,.2)',
        borderRadius: 12, padding: '16px 48px', marginBottom: 40,
      }}>
        <div style={{ fontSize: 11, color: '#8b7340', letterSpacing: 4 }}>NEW BALANCE</div>
        <div style={{
          fontSize: 48, fontWeight: 700,
          background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {newBal}
        </div>
      </div>
      <button
        onClick={onReturn}
        style={{
          background: GOLD, color: '#0a0a0f', border: 'none',
          padding: '14px 48px', borderRadius: 8, fontSize: 15,
          fontWeight: 700, cursor: 'pointer', letterSpacing: 3,
          fontFamily: '"Cinzel",Georgia,serif',
          boxShadow: '0 4px 20px rgba(245,200,66,.3)',
        }}
      >
        RETURN TO MENU
      </button>
    </div>
  )
}

// ── BoardGrid ─────────────────────────────────────────────

interface BoardGridProps {
  board:       Board
  selected:    [number, number] | null
  destSet:     Set<string>
  onCellClick: (r: number, c: number) => void
}

function BoardGrid({ board, selected, destSet, onCellClick }: BoardGridProps) {
  return (
    <div style={{
      border: '3px solid #2a1e08', borderRadius: 6, overflow: 'hidden',
      boxShadow: '0 0 60px rgba(0,0,0,.8),0 0 0 1px rgba(245,200,66,.1)',
      display: 'inline-block',
    }}>
      {board.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((_cell, c) => {
            const isDark = (r + c) % 2 === 1
            const p      = board[r][c]
            const isSel  = selected ? selected[0] === r && selected[1] === c : false
            const isDest = destSet.has(`${r}-${c}`)
            return (
              <div
                key={c}
                onClick={() => isDark && onCellClick(r, c)}
                style={{
                  width: 56, height: 56,
                  background: isDark ? (isSel ? '#402c0a' : '#402c0a') : '#c8a87a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isDark ? 'pointer' : 'default',
                  border: isSel ? '2px solid #f5c842' : '2px solid transparent',
                  boxSizing: 'border-box',
                }}
              >
                {/* Move destination dot */}
                {isDest && !p && (
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'rgba(245,200,66,.4)',
                    border: '2px solid rgba(245,200,66,.7)',
                  }} />
                )}
                {/* Piece */}
                {p && (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: p.type === 'red'
                      ? 'radial-gradient(circle at 38% 32%,#ff8a80,#c62828)'
                      : 'radial-gradient(circle at 38% 32%,#616161,#121212)',
                    border: `3px solid ${isSel ? '#f5c842' : p.type === 'red' ? '#e53935' : '#212121'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `2px 4px 10px rgba(0,0,0,.6)${isSel ? ',0 0 12px rgba(245,200,66,.5)' : ''}`,
                    fontSize: 18, color: 'rgba(255,255,255,.85)', fontWeight: 700,
                  }}>
                    {p.king ? '♛' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── GameScreen ────────────────────────────────────────────

interface GameScreenProps {
  board:       Board
  selected:    [number, number] | null
  destSet:     Set<string>
  turn:        'red' | 'black'
  thinking:    boolean
  chainPiece:  [number, number] | null
  points:      number
  redCount:    number
  blackCount:  number
  levelConfig: LevelConfig
  onCellClick: (r: number, c: number) => void
}

function GameScreen({
  board, selected, destSet, turn, thinking, chainPiece,
  points, redCount, blackCount, levelConfig, onCellClick,
}: GameScreenProps) {
  const headers = [
    { label: 'LEVEL',   value: levelConfig.label,                                         color: levelConfig.color },
    { label: 'BALANCE', value: `${points} pts`,                                            color: '#f5c842' },
    { label: 'TURN',    value: thinking ? '⟳ AI' : turn === 'red' ? 'YOUR TURN' : 'AI…', color: turn === 'red' ? '#ff6b6b' : '#aaa' },
  ]

  return (
    <div style={BASE}>
      {/* Header stats */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 20, alignItems: 'center' }}>
        {headers.map((h, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: 36, background: '#1a1a2a' }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>{h.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: h.color }}>{h.value}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Piece counts */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 14, fontSize: 12, color: '#555' }}>
        <span>● Red: <b style={{ color: '#e05555' }}>{redCount}</b></span>
        <span>● Black: <b style={{ color: '#888' }}>{blackCount}</b></span>
        {chainPiece && <span style={{ color: '#f5c842' }}>⚡ Multi-jump!</span>}
      </div>

      <BoardGrid board={board} selected={selected} destSet={destSet} onCellClick={onCellClick} />

      <div style={{ marginTop: 16, fontSize: 11, color: '#444', letterSpacing: 2 }}>
        {thinking
          ? 'AI IS THINKING…'
          : chainPiece
          ? 'CONTINUE JUMPING WITH SAME PIECE'
          : 'SELECT A RED PIECE · CLICK A GOLD DOT TO MOVE'}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────

export default function CheckersArena() {
  const {
    screen, points, board, turn, selected,
    chainPiece, thinking, result,
    redCount, blackCount, lvlConfig, destSet,
    handleCellClick, startGame, returnToMenu,
  } = useCheckers()

  if (screen === 'menu')
    return <MenuScreen points={points} onStart={startGame} />

  if (screen === 'result' && result && lvlConfig)
    return (
      <ResultScreen
        result={result as Exclude<GameResult, null>}
        points={points}
        levelConfig={lvlConfig}
        onReturn={returnToMenu}
      />
    )

  if (!lvlConfig) return null

  return (
    <GameScreen
      board={board}
      selected={selected}
      destSet={destSet}
      turn={turn}
      thinking={thinking}
      chainPiece={chainPiece}
      points={points}
      redCount={redCount}
      blackCount={blackCount}
      levelConfig={lvlConfig}
      onCellClick={handleCellClick}
    />
  )
}
