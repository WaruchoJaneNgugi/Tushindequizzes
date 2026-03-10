import React, { useEffect, useState } from 'react';
import type { GameLevel, GameStatus } from '../types/game.types';
import { LEVEL_CONFIGS } from '../utils/gameLogic';

interface GameOverlayProps {
  status: GameStatus;
  level: GameLevel;
  balance: number;
  reward: number;
  wager: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const STATUS_MESSAGES: Record<string, { headline: string; sub: string; emoji: string }> = {
  won: { headline: 'VICTORY!', sub: 'You outplayed the machine', emoji: '🏆' },
  lost: { headline: 'DEFEATED', sub: 'The AI wins this round', emoji: '💀' },
  draw: { headline: 'DRAW', sub: 'A perfect stalemate', emoji: '⚡' },
};

export const GameOverlay: React.FC<GameOverlayProps> = ({
  status,
  level,
  balance,
  reward,
  wager,
  onPlayAgain,
  onMenu,
}) => {
  const [visible, setVisible] = useState(false);
  const cfg = LEVEL_CONFIGS[level];
  const msg = STATUS_MESSAGES[status] ?? STATUS_MESSAGES.draw;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const pointDelta =
    status === 'won' ? reward : status === 'draw' && cfg.drawRefund ? 0 : -wager;

  return (
    <div className={`overlay ${visible ? 'overlay--visible' : ''}`}>
      <div
        className="overlay-card"
        style={{
          '--accent': status === 'won' ? '#ffd700' : status === 'draw' ? cfg.color : '#ff2266',
          '--glow': status === 'won' ? 'rgba(255,215,0,0.5)' : status === 'draw' ? cfg.glowColor : 'rgba(255,34,102,0.5)',
        } as React.CSSProperties}
      >
        <div className="overlay-glow-ring" />

        <div className="overlay-emoji">{msg.emoji}</div>
        <h2 className="overlay-headline">{msg.headline}</h2>
        <p className="overlay-sub">{msg.sub}</p>

        <div className="overlay-stats">
          <div className={`overlay-delta ${pointDelta > 0 ? 'delta--pos' : pointDelta < 0 ? 'delta--neg' : 'delta--zero'}`}>
            {pointDelta > 0 ? `+${pointDelta}` : pointDelta === 0 ? '±0' : pointDelta} pts
          </div>
          <div className="overlay-balance">
            Balance: <strong>{balance}</strong> pts
          </div>
        </div>

        <div className="overlay-actions">
          <button className="btn btn--primary" onClick={onPlayAgain}>
            PLAY AGAIN
          </button>
          <button className="btn btn--ghost" onClick={onMenu}>
            CHANGE LEVEL
          </button>
        </div>
      </div>
    </div>
  );
};
