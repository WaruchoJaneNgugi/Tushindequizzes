import { useState, useRef } from 'react';
import '../../styles/WinnerMarquee.css';

export interface Winner {
  rank: number;
  name: string;
  game: string;
  score: string;
  avatar: string;
  color: string;
}

interface WinnerCardProps {
  winner: Winner;
}

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function WinnerCard({ winner }: WinnerCardProps) {
  const isTop3 = winner.rank <= 3;

  return (
    <div
      className="wm-card"
      style={{ '--wm-card-color': winner.color } as React.CSSProperties}
    >
      {/* Rank */}
      <div
        className="wm-rank"
        style={{ color: isTop3 ? winner.color : 'rgba(255,255,255,0.35)' }}
      >
        {isTop3 ? RANK_ICONS[winner.rank] : `#${winner.rank}`}
      </div>

      <div className="wm-divider" />

      {/* Avatar */}
      <div
        className="wm-avatar"
        style={{
          borderColor: winner.color,
          boxShadow: `0 0 10px ${winner.color}50`,
        }}
      >
        <span style={{ color: winner.color }}>{winner.avatar}</span>
        {isTop3 && (
          <div className="wm-avatar-ring" style={{ borderColor: winner.color }} />
        )}
      </div>

      {/* Name */}
      <span className="wm-name">{winner.name}</span>

      {/* Game pill */}
      <div
        className="wm-game-pill"
        style={{
          borderColor: `${winner.color}40`,
          background: `${winner.color}10`,
        }}
      >
        <span className="wm-game-dot" style={{ background: winner.color }} />
        <span className="wm-game-label">{winner.game}</span>
      </div>

      {/* Score */}
      <div className="wm-score" style={{ color: winner.color }}>
        <span className="wm-score-icon">⚡</span>
        <span>{winner.score}</span>
      </div>

      <div className="wm-sep">✦</div>
    </div>
  );
}

interface WinnerMarqueeProps {
  winners?: Winner[];
}

const DEFAULT_WINNERS: Winner[] = [
  { rank: 1, name: 'James', game: 'Chess',   score: '12,450', avatar: 'A', color: '#FFD700' },
  { rank: 2, name: 'Grace', game: 'Bible Quiz',     score: '11,820', avatar: 'N', color: '#00f5d4' },
  { rank: 3, name: 'Joyce', game: 'Checkers',   score: '10,990', avatar: 'K', color: '#ff3cac' },
  { rank: 4, name: 'Annet', game: 'Sudoku',  score: '9,730',  avatar: 'Z', color: '#a855f7' },
  { rank: 5, name: 'Kipkoech', game: 'Word Quest',    score: '9,210',  avatar: 'L', color: '#f97316' },
  { rank: 6, name: 'Daniel', game: 'Math Quiz',  score: '8,880',  avatar: 'M', color: '#22d3ee' },
  { rank: 7, name: 'Joseph',  game: 'Bible Quiz',      score: '8,450',  avatar: 'D', color: '#84cc16' },
  { rank: 8, name: 'Moraa', game: 'Chess',      score: '7,990',  avatar: 'S', color: '#fb7185' },
];

export default function WinnerMarquee({ winners = DEFAULT_WINNERS }: WinnerMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const doubled: Winner[] = [...winners, ...winners];

  return (
    <div className="wm-wrapper">
      {/* Header */}
      <div className="wm-header">
        <div className="wm-live">
          <div className="wm-live-dot" />
          Live
        </div>
        <div className="wm-header-line" />
        <span className="wm-header-title">Top Winners</span>
      </div>

      {/* Rail */}
      <div
        className="wm-rail"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="wm-fade-left" />
        <div
          ref={trackRef}
          className={`wm-track${isPaused ? ' paused' : ''}`}
        >
          {doubled.map((winner, i) => (
            <WinnerCard key={`${winner.rank}-${i}`} winner={winner} />
          ))}
        </div>
        <div className="wm-fade-right" />
      </div>

      {/* Footer */}
      <div className="wm-footer">
        <span className="wm-footer-count">
          <strong>{winners.length}</strong> players ranked today
        </span>
      </div>
    </div>
  );
}
