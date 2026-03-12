import React from 'react';
import { type Board, type Difficulty, ROWS, COLS, LEVEL_CONFIGS } from '../types/game.types';
import { isWinningCell } from '../utils/gameLogic';
import Cell from './Cell.tsx';

interface GameBoardProps {
  board: Board;
  currentTurn: 'player' | 'computer';
  winningCells: [number, number][];
  hoverCol: number | null;
  isAIThinking: boolean;
  lastDropCol: number | null;
  selectedDifficulty: Difficulty | null;
  points: number;
  onColumnClick: (col: number) => void;
  onColumnHover: (col: number | null) => void;
  onMenu: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board, currentTurn, winningCells, hoverCol, isAIThinking,
  lastDropCol, selectedDifficulty, points, onColumnClick, onColumnHover, onMenu,
}) => {
  const diff    = selectedDifficulty ? LEVEL_CONFIGS[selectedDifficulty] : null;
  const canPlay = currentTurn === 'player' && !isAIThinking;

  return (
    <div className="gb-screen">

      {/* ── Top bar ── */}
      <div className="gb-topbar">
        <button className="gb-back-btn" onClick={onMenu}>← MENU</button>
        <div className="gb-center">
          {diff && (
            <span className="gb-diff-badge" style={{
              color: diff.color,
              borderColor: diff.color,
              boxShadow: `0 0 12px ${diff.glowColor}`,
            }}>
              {diff.icon} {diff.name}
            </span>
          )}
          <span className={`gb-turn-label ${canPlay ? 'gb-turn-you' : 'gb-turn-ai'}`}>
            {isAIThinking ? '🤖 AI thinking…' : canPlay ? '🎯 Your turn' : '⏳ Waiting…'}
          </span>
        </div>
        <div className="gb-pts-badge">
          <span className="gb-pts-icon">◈</span>
          <span className="gb-pts-val">{points}</span>
        </div>
      </div>

      {/* ── Drop arrows ── */}
      <div className="gb-arrows" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: COLS }, (_, c) => (
          <div key={c} className="gb-arrow"
            style={{ color: hoverCol === c && canPlay ? '#00e5ff' : 'transparent' }}>
            ▼
          </div>
        ))}
      </div>

      {/* ── 3-D Board ── */}
      <div className="gb-perspective">
        <div className="gb-board">
          {diff && <div className="gb-top-stripe" style={{ background: diff.color }} />}

          <div
            className="gb-grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            onMouseLeave={() => onColumnHover(null)}
          >
            {Array.from({ length: COLS }, (_, col) => (
              <div
                key={col}
                className={`gb-col${canPlay && board[0][col] === null ? ' gb-col-hover' : ''}`}
                onClick={() => onColumnClick(col)}
                onMouseEnter={() => onColumnHover(col)}
                style={{
                  background: hoverCol === col && canPlay
                    ? 'rgba(0,200,255,0.05)' : 'transparent',
                }}
              >
                {Array.from({ length: ROWS }, (_, row) => {
                  const value    = board[row][col];
                  const winning  = isWinningCell(row, col, winningCells);
                  const preview  = hoverCol === col && canPlay && value === null
                    && (row === ROWS - 1 || board[row + 1]?.[col] !== null);
                  const dropping = lastDropCol === col && row === 0;
                  return (
                    <Cell key={`${row}-${col}`}
                      value={value} row={row} col={col}
                      isWinning={winning}
                      isHoverPreview={!!preview}
                      isDropping={dropping}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      {diff && (
        <div className="gb-footer">
          {isAIThinking && <div className="ai-dots"><span/><span/><span/></div>}
          <span className="gb-footer-txt">
            {diff.icon} {diff.name} · BET {diff.cost} · WIN {diff.reward} PTS
          </span>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
