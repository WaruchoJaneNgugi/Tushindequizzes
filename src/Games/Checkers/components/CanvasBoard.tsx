import React, {useEffect, useRef, useState} from "react";
import type {Board} from "../types/checkers.types.ts";

interface CanvasBoardProps {
    board:       Board
    selected:    [number, number] | null
    destSet:     Set<string>
    onCellClick: (r: number, c: number) => void
    isMobile:    boolean
    thinking:    boolean
    turn:        'red' | 'black'
    chainPiece:  [number, number] | null
    // New props for AI movement visualization
    aiMove?: {
        from: [number, number]
        to: [number, number]
    } | null
    lastMove?: {
        from: [number, number]
        to: [number, number]
        player: 'red' | 'black'
    } | null
}

export const CanvasBoard =({
                               board,
                               selected,
                               destSet,
                               onCellClick,
                               isMobile,
                               thinking,
                               chainPiece,
                               aiMove,
                               lastMove
                           }: CanvasBoardProps)=> {
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

                // Check if this square is part of AI's move
                const isAiFrom = aiMove && aiMove.from[0] === r && aiMove.from[1] === c
                const isAiTo = aiMove && aiMove.to[0] === r && aiMove.to[1] === c

                // Check if this square is part of last move
                const isLastFrom = lastMove && lastMove.from[0] === r && lastMove.from[1] === c
                const isLastTo = lastMove && lastMove.to[0] === r && lastMove.to[1] === c

                // Determine square highlight color
                let squareHighlight = null
                if (isAiFrom || (isLastFrom && lastMove?.player === 'black')) {
                    squareHighlight = 'ai-from' // Blue for AI start
                } else if (isAiTo || (isLastTo && lastMove?.player === 'black')) {
                    squareHighlight = 'ai-to' // Green for AI destination
                } else if (isLastFrom && lastMove?.player === 'red') {
                    squareHighlight = 'player-from' // Yellow for player start
                } else if (isLastTo && lastMove?.player === 'red') {
                    squareHighlight = 'player-to' // Orange for player destination
                }

                // Draw square background with highlighting
                if (isDark) {
                    if (squareHighlight === 'ai-from') {
                        ctx.fillStyle = '#1e4a6b' // Dark blue for AI start
                    } else if (squareHighlight === 'ai-to') {
                        ctx.fillStyle = '#1e6b3a' // Dark green for AI destination
                    } else if (squareHighlight === 'player-from') {
                        ctx.fillStyle = '#806b1e' // Dark gold for player start
                    } else if (squareHighlight === 'player-to') {
                        ctx.fillStyle = '#80451e' // Dark orange for player destination
                    } else {
                        ctx.fillStyle = isSelected ? '#402c0a' : '#e08942'
                    }
                } else {
                    if (squareHighlight === 'ai-from') {
                        ctx.fillStyle = '#3a7ca5' // Light blue for AI start
                    } else if (squareHighlight === 'ai-to') {
                        ctx.fillStyle = '#3aa55a' // Light green for AI destination
                    } else if (squareHighlight === 'player-from') {
                        ctx.fillStyle = '#c9a53a' // Light gold for player start
                    } else if (squareHighlight === 'player-to') {
                        ctx.fillStyle = '#c97c3a' // Light orange for player destination
                    } else {
                        ctx.fillStyle = '#fdcd9f'
                    }
                }
                ctx.fillRect(x, y, cellSize, cellSize)

                // Draw selection border (for current selected piece)
                if (isSelected) {
                    ctx.strokeStyle = '#f5c842'
                    ctx.lineWidth = 3
                    ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3)
                }

                // Draw highlight borders for AI move
                if (isAiFrom || isAiTo) {
                    ctx.strokeStyle = isAiFrom ? '#00a8ff' : '#00ff88'
                    ctx.lineWidth = 4
                    ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4)

                    // Add pulsing effect for AI move (optional)
                    if (aiMove && Date.now() % 1000 < 500) {
                        ctx.strokeStyle = 'white'
                        ctx.lineWidth = 2
                        ctx.strokeRect(x + 4, y + 4, cellSize - 8, cellSize - 8)
                    }
                }

                // Draw last move indicators
                if (isLastFrom || isLastTo) {
                    const indicatorColor = lastMove?.player === 'red' ? '#ff6b6b' : '#00a8ff'
                    ctx.beginPath()
                    ctx.arc(
                        x + (isLastFrom ? cellSize * 0.2 : cellSize * 0.8),
                        y + cellSize * 0.5,
                        cellSize * 0.1,
                        0,
                        Math.PI * 2
                    )
                    ctx.fillStyle = indicatorColor
                    ctx.fill()
                    ctx.strokeStyle = 'white'
                    ctx.lineWidth = 1
                    ctx.stroke()
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

                // Check if this piece is part of AI move
                const isAiFrom = aiMove && aiMove.from[0] === r && aiMove.from[1] === c
                const isAiTo = aiMove && aiMove.to[0] === r && aiMove.to[1] === c

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

                // Draw piece border with AI highlights
                if (isAiFrom) {
                    // AI piece being moved gets special border
                    ctx.strokeStyle = '#00a8ff'
                    ctx.lineWidth = 5

                    // Add pulsing effect
                    if (Date.now() % 800 < 400) {
                        ctx.shadowColor = '#00a8ff'
                        ctx.shadowBlur = 15
                    }
                } else if (isAiTo) {
                    // Destination piece (if any - for captures)
                    ctx.strokeStyle = '#ff4444'
                    ctx.lineWidth = 4
                } else {
                    ctx.strokeStyle = isSelected || isChainPiece ? '#f5c842' : (piece.type === 'red' ? '#e53935' : '#212121')
                    ctx.lineWidth = isSelected || isChainPiece ? 4 : 2
                }

                ctx.stroke()
                ctx.shadowBlur = 0 // Reset shadow

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

                // Add arrow for AI move direction (optional)
                if (isAiFrom && aiMove) {
                    const toX = aiMove.to[1] * cellSize + cellSize / 2
                    const toY = aiMove.to[0] * cellSize + cellSize / 2

                    // Draw arrow from AI piece to destination
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(toX, toY)
                    ctx.strokeStyle = '#00a8ff'
                    ctx.lineWidth = 3
                    ctx.setLineDash([5, 5])
                    ctx.stroke()

                    // Draw arrowhead
                    const angle = Math.atan2(toY - y, toX - x)
                    const arrowSize = cellSize * 0.15
                    ctx.beginPath()
                    ctx.moveTo(toX, toY)
                    ctx.lineTo(
                        toX - arrowSize * Math.cos(angle - 0.3),
                        toY - arrowSize * Math.sin(angle - 0.3)
                    )
                    ctx.lineTo(
                        toX - arrowSize * Math.cos(angle + 0.3),
                        toY - arrowSize * Math.sin(angle + 0.3)
                    )
                    ctx.closePath()
                    ctx.fillStyle = '#00a8ff'
                    ctx.fill()

                    ctx.setLineDash([]) // Reset dash pattern
                }
            }
        }

    }, [board, selected, destSet, boardSize, cellSize, chainPiece, aiMove, lastMove])

    return (
        <div
            ref={containerRef}
            className="canvas-container"
            style={{ position: 'relative' }}
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

            {/* Optional: Add AI move indicator text */}
            {aiMove && !thinking && (
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0, 168, 255, 0.9)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    zIndex: 10
                }}>
                    🤖 AI moved: {String.fromCharCode(97 + aiMove.from[1])}{8 - aiMove.from[0]} → {String.fromCharCode(97 + aiMove.to[1])}{8 - aiMove.to[0]}
                </div>
            )}
        </div>
    )
}