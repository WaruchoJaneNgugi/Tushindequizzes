import React, { useEffect, useState } from 'react';
import { type GameResult, type Difficulty, LEVEL_CONFIGS } from '../types/game.types';

interface WinLoseModalProps {
  result: GameResult;
  difficulty: Difficulty | null;
  points: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const WinLoseModal: React.FC<WinLoseModalProps> = ({
  result, difficulty, points, onPlayAgain, onMenu,
}) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  if (!result) return null;

  const diff   = difficulty ? LEVEL_CONFIGS[difficulty] : null;
  const isWon  = result === 'won';
  const isDraw = result === 'draw';

  const cfg = isWon ? {
    headline: 'VICTORY!', sub: `+${diff?.reward ?? 0} POINTS EARNED`,
    emoji: '🏆', color: '#00ff88', glow: 'rgba(0,255,136,0.28)',
    bg: 'linear-gradient(135deg, #003322 0%, #001a12 100%)',
    particles: ['✨','🌟','⭐','💫','🎉'],
  } : isDraw ? {
    headline: 'DRAW!', sub: 'No points gained or lost',
    emoji: '🤝', color: '#aaaaff', glow: 'rgba(150,150,255,0.25)',
    bg: 'linear-gradient(135deg, #1a1a33 0%, #0d0d1a 100%)',
    particles: ['🤝','⚖️'],
  } : {
    headline: 'DEFEATED!', sub: diff ? `BET LOST · -${diff.cost} pts` : 'You lost',
    emoji: '💀', color: '#ff3355', glow: 'rgba(255,50,80,0.28)',
    bg: 'linear-gradient(135deg, #2a0011 0%, #150008 100%)',
    particles: ['💔','😵','🔴','💥'],
  };

  return (
    <div className="modal-overlay" style={{ opacity: show ? 1 : 0 }}>
      {/* Falling particles */}
      <div className="modal-particles" aria-hidden>
        {cfg.particles.map((p, i) => (
          <span key={i} className="modal-particle"
            style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.12}s`, fontSize: `${1.1 + (i % 3) * 0.4}rem` }}>
            {p}
          </span>
        ))}
      </div>

      <div
        className="modal-card"
        style={{
          background: cfg.bg,
          border: `2px solid ${cfg.color}`,
          boxShadow: `0 0 60px ${cfg.glow}, 0 0 120px ${cfg.glow}`,
          transform: show ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.88)',
        }}
      >
        <div className="modal-emoji">{cfg.emoji}</div>

        <h2 className="modal-headline" style={{ color: cfg.color, textShadow: `0 0 28px ${cfg.color}` }}>
          {cfg.headline}
        </h2>

        <p className="modal-sub">{cfg.sub}</p>

        <div className="modal-divider" style={{ background: cfg.color }} />

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="stat-label">BALANCE</span>
            <span className="stat-value" style={{ color: '#00e5ff' }}>◈ {points}</span>
          </div>
          {diff && (
            <>
              <div className="modal-stat">
                <span className="stat-label">LEVEL</span>
                <span className="stat-value" style={{ color: diff.color }}>{diff.name}</span>
              </div>
              <div className="modal-stat">
                <span className="stat-label">{isWon ? 'REWARD' : 'BET'}</span>
                <span className="stat-value" style={{ color: isWon ? '#00ff88' : '#ff3355' }}>
                  {isWon ? `+${diff.reward}` : `-${diff.cost}`}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn-primary"
            onClick={onPlayAgain}
            style={{
              background: `${cfg.color}18`,
              border: `1.5px solid ${cfg.color}`,
              color: cfg.color,
              boxShadow: `0 0 18px ${cfg.glow}`,
            }}
          >
            🎮 PLAY AGAIN
          </button>
          <button className="modal-btn-secondary" onClick={onMenu}>
            🏠 MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinLoseModal;
