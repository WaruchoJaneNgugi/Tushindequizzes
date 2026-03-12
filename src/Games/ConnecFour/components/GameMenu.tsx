import React from 'react';

interface GameMenuProps {
  points: number;
  onPlay: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ points, onPlay }) => (
  <div className="menu-screen">
    <div className="menu-points-badge">
      <span className="mpb-label">BALANCE</span>
      <span className="mpb-value">{points}</span>
      <span className="mpb-pts">pts</span>
    </div>

    <div className="menu-logo">
      <div className="menu-orbs">
        {['#00e5ff', '#ff3355', '#00e5ff', '#ff3355'].map((c, i) => (
          <div key={i} className="menu-orb" style={{
            background: `radial-gradient(circle at 35% 30%, ${c}cc, ${c}55, ${c}22)`,
            boxShadow: `0 0 22px ${c}88`,
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
      <h1 className="menu-title">CONNECT FOUR</h1>
      <p className="menu-tagline">◈ BET · PLAY · DOMINATE ◈</p>
    </div>

    <div className="menu-features">
      {[
        { icon: '🎯', label: 'DROP PIECES', sub: 'Connect 4 in a row' },
        { icon: '🤖', label: 'VS COMPUTER', sub: '4 difficulty levels' },
        { icon: '◈',  label: 'EARN POINTS', sub: 'Bet & multiply' },
      ].map(f => (
        <div key={f.label} className="feature-card">
          <span className="feature-icon">{f.icon}</span>
          <span className="feature-label">{f.label}</span>
          <span className="feature-sub">{f.sub}</span>
        </div>
      ))}
    </div>

    <button className="btn-enter-arena" onClick={onPlay}>
      ▶ ENTER ARENA
    </button>

    <p className="menu-hint">
      You start with <strong style={{ color: '#00e5ff' }}>◈ {points}</strong> points
    </p>
  </div>
);

export default GameMenu;
