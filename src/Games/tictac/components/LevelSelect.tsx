import React from 'react';
import type { GameLevel, LevelConfig } from '../types/game.types';
import { LEVEL_CONFIGS } from '../utils/gameLogic';

interface LevelSelectProps {
  balance: number;
  onSelectLevel: (level: GameLevel) => void;
}

const StarRating: React.FC<{ count: number; color: string }> = ({ count, color }) => (
  <div className="star-row">
    {Array.from({ length: 4 }).map((_, i) => (
      <span
        key={i}
        style={{ color: i < count ? color : 'rgba(255,255,255,0.15)', textShadow: i < count ? `0 0 8px ${color}` : 'none' }}
      >
        ★
      </span>
    ))}
  </div>
);

const LevelCard: React.FC<{
  config: LevelConfig;
  balance: number;
  onSelect: () => void;
}> = ({ config, balance, onSelect }) => {
  const canAfford = balance > config.wager;
  const [r, g, b] = [
    parseInt(config.color.slice(1, 3), 16),
    parseInt(config.color.slice(3, 5), 16),
    parseInt(config.color.slice(5, 7), 16),
  ];

  return (
    <button
      className={`level-card ${!canAfford ? 'level-card--locked' : ''}`}
      onClick={canAfford ? onSelect : undefined}
      style={{
        '--accent': config.color,
        '--accent-rgb': `${r},${g},${b}`,
        '--glow': config.glowColor,
      } as React.CSSProperties}
    >
      <div className="level-card__glow-border" />
      <div className="level-card__inner">
        <div className="level-card__header">
          <span className="level-card__label">{config.label}</span>
          <StarRating count={config.stars} color={config.color} />
        </div>
        <p className="level-card__desc">{config.description}</p>
        <div className="level-card__economy">
          <div className="economy-item">
            <span className="economy-label">WAGER</span>
            <span className="economy-value economy-value--wager">−{config.wager} pts</span>
          </div>
          <div className="economy-divider" />
          <div className="economy-item">
            <span className="economy-label">WIN</span>
            <span className="economy-value economy-value--win">+{config.reward} pts</span>
          </div>
        </div>
        {!canAfford && (
          <div className="level-card__locked-msg">
            <span>⚠</span> Need &gt;{config.wager} pts to enter
          </div>
        )}
        {canAfford && (
          <div className="level-card__enter">
            <span>ENTER ARENA</span>
            <span className="enter-arrow">→</span>
          </div>
        )}
      </div>
    </button>
  );
};

export const LevelSelect: React.FC<LevelSelectProps> = ({ balance, onSelectLevel }) => {
  const levels = Object.values(LEVEL_CONFIGS) as LevelConfig[];

  return (
    <div className="level-select">
      <div className="level-select__header">
        <div className="title-wrapper">
          <h1 className="game-title">
            <span className="title-x">X</span>
            <span className="title-dot"> · </span>
            <span className="title-ttt">TICTAC</span>
            <span className="title-dot"> · </span>
            <span className="title-o">O</span>
          </h1>
          <p className="game-subtitle">GALACTIC ARENA</p>
        </div>
        <div className="balance-display">
          <span className="balance-label">BALANCE</span>
          <span className="balance-value">{balance}</span>
          <span className="balance-unit">pts</span>
        </div>
      </div>

      <div className="level-select__prompt">Choose your difficulty — place your wager</div>

      <div className="level-grid">
        {levels.map((cfg) => (
          <LevelCard
            key={cfg.id}
            config={cfg}
            balance={balance}
            onSelect={() => onSelectLevel(cfg.id)}
          />
        ))}
      </div>

      <div className="level-select__footer">
        <span>Draw on Easy/Medium → wager refunded</span>
        <span className="footer-dot">•</span>
        <span>Draw on Hard/Expert → wager lost</span>
      </div>
    </div>
  );
};
