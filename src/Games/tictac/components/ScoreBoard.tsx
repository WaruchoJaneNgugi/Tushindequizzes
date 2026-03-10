import React from 'react';
import type { GameLevel, Transaction } from '../types/game.types';
import { LEVEL_CONFIGS } from '../utils/gameLogic';

interface ScoreBoardProps {
  balance: number;
  level: GameLevel;
  currentPlayer: 'X' | 'O';
  isAIThinking: boolean;
  moveCount: number;
  transactions: Transaction[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  balance,
  level,
  currentPlayer,
  isAIThinking,
  moveCount,
  transactions,
}) => {
  const cfg = LEVEL_CONFIGS[level];
  const lastTxs = transactions.slice(-4).reverse();

  return (
    <div className="scoreboard">
      {/* Balance */}
      <div className="sb-balance">
        <span className="sb-balance-label">BALANCE</span>
        <span className="sb-balance-value">{balance}</span>
        <span className="sb-balance-unit">pts</span>
      </div>

      {/* Level badge */}
      <div
        className="sb-level"
        style={{ '--accent': cfg.color, '--glow': cfg.glowColor } as React.CSSProperties}
      >
        <span className="sb-level-label">LEVEL</span>
        <span className="sb-level-name">{cfg.label}</span>
      </div>

      {/* Turn indicator */}
      <div className="sb-turn">
        <div className={`turn-pill ${currentPlayer === 'X' ? 'turn-pill--x' : 'turn-pill--o'}`}>
          {isAIThinking ? (
            <span className="thinking-dots">
              <span>AI</span>
              <span className="dot d1">.</span>
              <span className="dot d2">.</span>
              <span className="dot d3">.</span>
            </span>
          ) : (
            <>
              <span className="turn-symbol">{currentPlayer}</span>
              <span className="turn-label">{currentPlayer === 'X' ? 'YOUR TURN' : "AI's TURN"}</span>
            </>
          )}
        </div>
        <div className="move-count">Move {moveCount + 1}</div>
      </div>

      {/* Wager info */}
      <div className="sb-wager">
        <div className="wager-row">
          <span className="wager-label">WAGER</span>
          <span className="wager-val wager-val--cost">−{cfg.wager}</span>
        </div>
        <div className="wager-row">
          <span className="wager-label">WIN EARNS</span>
          <span className="wager-val wager-val--earn">+{cfg.reward}</span>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="sb-history">
        <span className="sb-history-title">RECENT</span>
        <div className="history-list">
          {lastTxs.map((tx) => (
            <div key={tx.id} className={`history-item ${tx.amount > 0 ? 'hi--credit' : 'hi--debit'}`}>
              <span className="hi-type">{tx.type}</span>
              <span className="hi-amount">{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
