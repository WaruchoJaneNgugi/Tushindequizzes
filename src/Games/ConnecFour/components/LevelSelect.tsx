import React from 'react';
import {type Difficulty, LEVEL_CONFIGS,type LevelConfig } from '../types/game.types';

interface LevelSelectProps {
  points: number;
  onSelectLevel: (difficulty: Difficulty) => void;
  onBack: () => void;
  canAfford: (cost: number) => boolean;
}

const LevelCard: React.FC<{
  config: LevelConfig;
  affordable: boolean;
  onSelect: () => void;
}> = ({ config, affordable, onSelect }) => {
  const locked = !affordable;

  return (
    <div
      className={`ls-card ${locked ? 'ls-card-locked' : 'ls-card-active'}`}
      style={{
        borderColor: locked ? '#1e1e2e' : config.color,
        background:  locked
          ? 'rgba(12,12,22,0.85)'
          : `linear-gradient(150deg, ${config.darkColor} 0%, #08090f 100%)`,
        boxShadow: locked ? 'none'
          : `inset 0 0 40px ${config.glowColor}, 0 0 18px ${config.glowColor}`,
      }}
    >
      {/* ── Header: icon + name + stars ── */}
      <div className="ls-header-row">
        <span className="ls-icon">{config.icon}</span>
        <span className="ls-name" style={{ color: locked ? '#2a2a3a' : config.color }}>
          {config.name}
        </span>
        <div className="ls-stars">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} style={{
              color: i < config.stars
                ? (locked ? '#2a2a3a' : config.color)
                : '#141420',
              fontSize: '1rem',
            }}>★</span>
          ))}
        </div>
      </div>

      {/* ── Description ── */}
      <p className="ls-desc">{config.description}</p>

      {/* ── Wager / Win pill ── */}
      <div className="ls-wager-pill">
        <div className="ls-wager-half">
          <span className="ls-wager-label">WAGER</span>
          <span className="ls-wager-amount" style={{ color: locked ? '#2a2a3a' : '#ff4466' }}>
            -{config.cost} pts
          </span>
        </div>
        <div className="ls-wager-divider" />
        <div className="ls-wager-half">
          <span className="ls-wager-label">WIN</span>
          <span className="ls-wager-amount" style={{ color: locked ? '#2a2a3a' : '#00ff88' }}>
            +{config.reward} pts
          </span>
        </div>
      </div>

      {/* ── CTA button or locked message ── */}
      {locked ? (
        <div className="ls-locked-msg">
          🔒 Need &gt; {config.cost} pts to enter
        </div>
      ) : (
        <button
          className="ls-enter-btn"
          onClick={onSelect}
          style={{ borderColor: config.color, color: config.color }}
        >
          ENTER ARENA
          <span className="ls-enter-arrow">→</span>
        </button>
      )}
    </div>
  );
};

const LevelSelect: React.FC<LevelSelectProps> = ({
  points, onSelectLevel, onBack, canAfford,
}) => {
  const levels = Object.values(LEVEL_CONFIGS) as LevelConfig[];

  return (
    <div className="ls-screen">

      {/* ── Balance banner ── */}
      <div className="ls-balance-banner">
        <span className="ls-bal-label">BALANCE</span>
        <span className="ls-bal-value">{points}</span>
        <span className="ls-bal-pts">pts</span>
      </div>

      {/* ── Section title ── */}
      <p className="ls-section-title">CHOOSE YOUR DIFFICULTY — PLACE YOUR WAGER</p>

      {/* ── Scrollable card list ── */}
      <div className="ls-scroll-area">
        {levels.map(cfg => (
          <LevelCard
            key={cfg.id}
            config={cfg}
            affordable={canAfford(cfg.cost)}
            onSelect={() => onSelectLevel(cfg.id)}
          />
        ))}
      </div>

      {/* ── Back ── */}
      <button className="ls-back-btn" onClick={onBack}>← BACK TO MENU</button>
    </div>
  );
};

export default LevelSelect;
