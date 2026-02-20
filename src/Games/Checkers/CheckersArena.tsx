// ─────────────────────────────────────────────────────────
// CheckersArena.tsx
// Root UI component — composes all screens
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react'
import { useCheckers, LEVELS } from './hooks/useCheckers'
import { type Difficulty, type GameResult, type LevelConfig } from './types/checkers.types'
import { type Board } from './types/checkers.types'
import "./assets/checkers.css"

// ── Responsive helper ─────────────────────────────────────

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [matches, query])

    return matches
}

// ── MenuScreen ────────────────────────────────────────────

interface MenuScreenProps {
    points:  number
    onStart: (lvl: Difficulty) => void
}

function LevelCard({
                       lvlKey, lvl, canPlay, onClick, isMobile,
                   }: {
    lvlKey:  Difficulty
    lvl:     LevelConfig
    canPlay: boolean
    onClick: (k: Difficulty) => void
    isMobile: boolean
}) {
    const [hov, setHov] = useState(false)

    const borderClass = `border-${lvlKey} ${canPlay ? 'playable' : 'not-playable'}`
    const nameClass = `level-name ${lvlKey} ${isMobile ? 'mobile' : ''}`
    const dividerClass = `level-divider ${lvlKey}`

    return (
        <div
            onClick={() => canPlay && onClick(lvlKey)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onTouchStart={() => isMobile && setHov(true)}
            onTouchEnd={() => isMobile && setHov(false)}
            className={`level-card ${borderClass} ${isMobile ? 'mobile' : ''} ${!canPlay ? 'not-playable' : ''}`}
            style={{
                borderColor: canPlay && hov ? `${lvl.color}aa` : undefined,
                transform: hov && canPlay && !isMobile ? 'translateY(-3px)' : 'none',
                boxShadow: hov && canPlay && !isMobile ? `0 8px 30px ${lvl.color}22` : 'none',
            }}
        >
            <div className={nameClass} style={{ color: lvl.color }}>
                {lvl.label}
            </div>
            <div className={dividerClass} style={{ background: `linear-gradient(90deg,transparent,${lvl.color}44,transparent)` }} />
            <div className={`level-wager ${isMobile ? 'mobile' : ''}`}>
                Wager: <span>{lvl.cost} pt{lvl.cost > 1 ? 's' : ''}</span>
            </div>
            <div className={`level-reward ${isMobile ? 'mobile' : ''}`}>
                Win: <span>+{lvl.reward} pts</span>
            </div>
            {!canPlay && (
                <div className={`level-requirement ${isMobile ? 'mobile' : ''}`}>
                    Need &gt;{lvl.cost} pts
                </div>
            )}
        </div>
    )
}

function MenuScreen({ points, onStart }: MenuScreenProps) {
    const isMobile = useMediaQuery('(max-width: 600px)')

    return (
        <div className="checkers-container">
            <div className="ambient-glow" />

            <div className="premium-badge">
                PREMIUM CHECKERS
            </div>

            <h1 className={`title-main ${isMobile ? 'mobile' : ''}`}>
                ♟ ARENA
            </h1>

            <div className={`subtitle ${isMobile ? 'mobile' : ''}`}>
                WAGER · PLAY · CONQUER
            </div>

            {/* Balance card */}
            <div className={`balance-card ${isMobile ? 'mobile' : ''}`}>
                <div className={`balance-label ${isMobile ? 'mobile' : ''}`}>
                    YOUR BALANCE
                </div>
                <div className={`balance-value ${isMobile ? 'mobile' : ''}`}>
                    {points}
                </div>
                <div className={`balance-unit ${isMobile ? 'mobile' : ''}`}>POINTS</div>
            </div>

            {/* Level grid */}
            <div className={`level-grid`}>
                {(Object.entries(LEVELS) as [Difficulty, LevelConfig][]).map(([k, lvl]) => (
                    <LevelCard
                        key={k}
                        lvlKey={k}
                        lvl={lvl}
                        canPlay={points > lvl.cost}
                        onClick={onStart}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            <div className={`footer-note ${isMobile ? 'mobile' : ''}`}>
                YOU = <span className="red">● RED</span>
                &nbsp;·&nbsp;
                AI = <span className="black">● BLACK</span>
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
    const isMobile = useMediaQuery('(max-width: 600px)')
    const won    = result === 'win'
    const newBal = won ? points + levelConfig.reward : points

    return (
        <div className={`checkers-container result-${won ? 'win' : 'lose'} result-center`}>
            <div className={`result-icon ${isMobile ? 'mobile' : ''}`}>{won ? '♔' : '✕'}</div>
            <div className={`result-title ${isMobile ? 'mobile' : ''} ${won ? 'win' : 'lose'}`}>
                {won ? 'VICTORY' : 'DEFEATED'}
            </div>
            <div className={`result-message ${isMobile ? 'mobile' : ''} ${won ? 'win' : 'lose'}`}>
                {won ? `+${levelConfig.reward} POINTS EARNED` : `${levelConfig.cost} POINTS LOST`}
            </div>
            <div className={`balance-result-card ${isMobile ? 'mobile' : ''}`}>
                <div className={`balance-result-label ${isMobile ? 'mobile' : ''}`}>NEW BALANCE</div>
                <div className={`balance-result-value ${isMobile ? 'mobile' : ''}`}>
                    {newBal}
                </div>
            </div>
            <button
                onClick={onReturn}
                className={`return-button ${isMobile ? 'mobile' : ''}`}
            >
                RETURN TO MENU
            </button>
        </div>
    )
}

// ── Canvas Board ────────────────────────────────────────────

interface CanvasBoardProps {
    board:       Board
    selected:    [number, number] | null
    destSet:     Set<string>
    onCellClick: (r: number, c: number) => void
    isMobile:    boolean
    thinking:    boolean
    turn:        'red' | 'black'
    chainPiece:  [number, number] | null
}

function CanvasBoard({
                         board,
                         selected,
                         destSet,
                         onCellClick,
                         isMobile,
                         thinking,
                         chainPiece
                     }: CanvasBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [boardSize, setBoardSize] = useState(0)
    const [cellSize, setCellSize] = useState(isMobile ? 40 : 56)

    // Calculate board dimensions and cell size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth
                const maxSize = isMobile ? Math.min(320, containerWidth) : Math.min(448, containerWidth)
                setBoardSize(maxSize)
                setCellSize(maxSize / 8)
            }
        }

        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [isMobile])

    // Handle canvas clicks
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        const col = Math.floor(x / cellSize)
        const row = Math.floor(y / cellSize)

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            onCellClick(row, col)
        }
    }

    // Draw board and pieces
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || boardSize === 0) return

        canvas.width = boardSize
        canvas.height = boardSize

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Enable anti-aliasing for smoother rendering
        ctx.imageSmoothingEnabled = true

        // Draw board squares
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const x = c * cellSize
                const y = r * cellSize
                const isDark = (r + c) % 2 === 1
                const isSelected = selected && selected[0] === r && selected[1] === c

                // Draw square background
                if (isDark) {
                    ctx.fillStyle = isSelected ? '#402c0a' : '#402c0a'
                } else {
                    ctx.fillStyle = '#c8a87a'
                }
                ctx.fillRect(x, y, cellSize, cellSize)

                // Draw selection border
                if (isSelected) {
                    ctx.strokeStyle = '#f5c842'
                    ctx.lineWidth = 3
                    ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3)
                }

                // Draw move destination dot
                if (destSet.has(`${r}-${c}`) && !board[r][c]) {
                    ctx.beginPath()
                    ctx.arc(
                        x + cellSize / 2,
                        y + cellSize / 2,
                        cellSize * 0.15,
                        0,
                        Math.PI * 2
                    )
                    ctx.fillStyle = 'rgba(245, 200, 66, 0.4)'
                    ctx.fill()
                    ctx.strokeStyle = 'rgba(245, 200, 66, 0.7)'
                    ctx.lineWidth = 2
                    ctx.stroke()
                }
            }
        }

        // Draw pieces
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c]
                if (!piece) continue

                const x = c * cellSize + cellSize / 2
                const y = r * cellSize + cellSize / 2
                const radius = cellSize * 0.35
                const isSelected = selected && selected[0] === r && selected[1] === c
                const isChainPiece = chainPiece && chainPiece[0] === r && chainPiece[1] === c

                // Draw piece shadow
                ctx.beginPath()
                ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
                ctx.fill()

                // Draw piece gradient
                const gradient = ctx.createRadialGradient(
                    x - radius * 0.2,
                    y - radius * 0.2,
                    radius * 0.2,
                    x,
                    y,
                    radius * 1.2
                )

                if (piece.type === 'red') {
                    gradient.addColorStop(0, '#ff8a80')
                    gradient.addColorStop(1, '#c62828')
                } else {
                    gradient.addColorStop(0, '#616161')
                    gradient.addColorStop(1, '#121212')
                }

                ctx.beginPath()
                ctx.arc(x, y, radius, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                // Draw piece border
                ctx.strokeStyle = isSelected || isChainPiece ? '#f5c842' : (piece.type === 'red' ? '#e53935' : '#212121')
                ctx.lineWidth = isSelected || isChainPiece ? 4 : 2
                ctx.stroke()

                // Draw king symbol
                if (piece.king) {
                    ctx.font = `bold ${cellSize * 0.25}px "Cinzel", "Palatino Linotype", Georgia, serif`
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText('♛', x, y)
                }

                // Draw glow for chain piece
                if (isChainPiece) {
                    ctx.shadowColor = '#f5c842'
                    ctx.shadowBlur = 15
                    ctx.beginPath()
                    ctx.arc(x, y, radius + 2, 0, Math.PI * 2)
                    ctx.strokeStyle = '#f5c842'
                    ctx.lineWidth = 2
                    ctx.stroke()
                    ctx.shadowBlur = 0
                }
            }
        }

    }, [board, selected, destSet, boardSize, cellSize, chainPiece])

    return (
        <div
            ref={containerRef}
            className="canvas-container"
        >
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                width={800}
                height={800}
                className="game-canvas"
            />
            {thinking && (
                <div className={`thinking-overlay ${isMobile ? 'mobile' : ''}`}>
                    AI THINKING...
                </div>
            )}
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
    onReturnToMenu: () => void
}

function GameScreen({
                        board, selected, destSet, turn, thinking, chainPiece,
                        points, levelConfig, onCellClick,
                        onReturnToMenu
                    }: GameScreenProps) {
    const isMobile = useMediaQuery('(max-width: 600px)')

    const headers = [
        { label: 'LEVEL',   value: isMobile ? levelConfig.label.slice(0, 3) : levelConfig.label, color: levelConfig.color },
        { label: 'BALANCE', value: isMobile ? `${points}` : `${points} pts`, color: '#f5c842' },
        { label: 'TURN',    value: thinking ? '⟳' : turn === 'red' ? 'YOU' : 'AI', color: turn === 'red' ? '#ff6b6b' : '#aaa' },
    ]

    return (
        <div className="checkers-container">
            {/* Header stats */}
            <button
                onClick={onReturnToMenu}
                className={`back-button ${isMobile ? 'mobile' : ''}`}
                disabled={thinking}
            >
                ← BACK TO LEVELS
            </button>
            <div className={`game-header ${isMobile ? 'mobile' : ''}`}>
                {headers.map((h, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <div className={`header-divider ${isMobile ? 'mobile' : ''}`} />}
                        <div className="header-item">
                            <div className={`header-label ${isMobile ? 'mobile' : ''}`}>{h.label}</div>
                            <div className={`header-value ${isMobile ? 'mobile' : ''}`} style={{ color: h.color }}>{h.value}</div>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <CanvasBoard
                board={board}
                selected={selected}
                destSet={destSet}
                onCellClick={onCellClick}
                isMobile={isMobile}
                thinking={thinking}
                turn={turn}
                chainPiece={chainPiece}
            />

            <div className="game-footer-container">
                <div className={`game-footer ${isMobile ? 'mobile' : ''}`}>
                    {thinking
                        ? 'AI IS THINKING…'
                        : chainPiece
                            ? 'CONTINUE JUMPING WITH SAME PIECE'
                            : isMobile
                                ? 'TAP RED · TAP GOLD DOT'
                                : 'SELECT A RED PIECE · CLICK A GOLD DOT TO MOVE'}
                </div>


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
            onReturnToMenu={returnToMenu}
        />
    )
}