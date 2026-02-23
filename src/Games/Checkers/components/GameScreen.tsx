// ── GameScreen ────────────────────────────────────────────

import {useMediaQuery} from "../hooks/useMediaquery.ts";
import {CanvasBoard} from "./CanvasBoard.tsx";
import type {LevelConfig} from "../types/checkers.types.ts";
import type {Board} from "../types/checkers.types.ts";
import React from "react";

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

export const GameScreen=({
                        board, selected, destSet, turn, thinking, chainPiece,
                        points, levelConfig, onCellClick,
                        onReturnToMenu
                    }: GameScreenProps)=> {
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