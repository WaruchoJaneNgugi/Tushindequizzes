import React, { useState } from 'react';
import {type DifficultyLevel, LEVEL_CONFIGS, type PointsState } from '../types/game.types';

interface GameLobbyProps {
  points: PointsState;
  onStartGame: (level: DifficultyLevel) => void;
  onResetPoints: () => void;
}

const StatBox = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ color, fontSize: 22,  fontWeight: 700 }}>{value}</div>
    <div style={{ color: '#5a4030', fontSize: 10,  marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
  </div>
);

const GameLobby: React.FC<GameLobbyProps> = ({ points, onStartGame, onResetPoints }) => {
  const [hoveredLevel, setHoveredLevel] = useState<DifficultyLevel | null>(null);

  const levels = Object.values(LEVEL_CONFIGS);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 30% 20%, #1a0e00 0%, #0a0a0f 60%, #050508 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        // fontFamily: 'Crimson Pro, serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.5em',
            color: '#8a6020',
            // fontFamily: 'Cinzel, serif',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          ── ◆ ──
        </div>
        <h1
          style={{
            // fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(42px, 8vw, 72px)',
            fontWeight: 900,
            color: '#d4a820',
            letterSpacing: '0.15em',
            margin: 0,
            textShadow: '0 0 60px rgba(212,168,32,0.3), 0 4px 20px rgba(0,0,0,0.8)',
            background: 'linear-gradient(180deg, #f0c040 0%, #d4a820 40%, #a07010 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Chess
        </h1>
        <p
          style={{
            color: '#7a5a30',
            fontSize: 16,
            letterSpacing: '0.2em',
            marginTop: 8,
            // fontFamily: 'Cinzel, serif',
            fontStyle: 'italic',
          }}
        >
          Chess · Wager · Conquer
        </p>
      </div>

      {/* Points Dashboard */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #0f0b06 100%)',
          border: '1px solid #3a2810',
          borderRadius: 12,
          padding: '20px 40px',
          marginBottom: 40,
          display: 'flex',
          gap: 48,
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,150,0,0.1)',
          minWidth: 360,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: points.balance <= 8 ? '#f87171' : '#d4a820',
              fontSize: 38,
              // fontFamily: 'Cinzel, serif',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {points.balance}
          </div>
          <div
            style={{
              color: '#5a4030',
              fontSize: 10,
              // fontFamily: 'Crimson Pro, serif',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            Point Balance
          </div>
        </div>
        <div style={{ width: 1, height: 48, background: '#2a1a08' }} />
        <div style={{ display: 'flex', gap: 32 }}>
          <StatBox label="Wins" value={points.totalWins} color="#4ade80" />
          <StatBox label="Losses" value={points.totalLosses} color="#f87171" />
          <StatBox label="Draws" value={points.totalDraws} color="#facc15" />
        </div>
      </div>

      {/* Level Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 280px)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {levels.map(cfg => {
          const canPlay = points.balance > cfg.cost;
          const isHovered = hoveredLevel === cfg.level;

          return (
            <div
              key={cfg.level}
              onClick={() => canPlay && onStartGame(cfg.level)}
              onMouseEnter={() => setHoveredLevel(cfg.level)}
              onMouseLeave={() => setHoveredLevel(null)}
              style={{
                background: isHovered && canPlay
                  ? cfg.gradient.replace('135deg', '145deg')
                  : 'linear-gradient(135deg, #12100a 0%, #0a0905 100%)',
                border: `1px solid ${isHovered && canPlay ? cfg.color + '60' : '#2a1a08'}`,
                borderRadius: 12,
                padding: '24px',
                cursor: canPlay ? 'pointer' : 'not-allowed',
                opacity: canPlay ? 1 : 0.45,
                transition: 'all 0.2s ease',
                transform: isHovered && canPlay ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered && canPlay
                  ? `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${cfg.color}20`
                  : '0 4px 16px rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow corner */}
              {isHovered && canPlay && (
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${cfg.color}30, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div
                  style={{
                    color: cfg.color,
                    // fontFamily: 'Cinzel, serif',
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                  }}
                >
                  {cfg.label}
                </div>
                {!canPlay && (
                  <span style={{ fontSize: 10, color: '#f87171', letterSpacing: '0.1em' }}>
                    INSUFFICIENT POINTS
                  </span>
                )}
              </div>

              <p
                style={{
                  color: '#8a6840',
                  fontSize: 13,
                  lineHeight: 1.5,
                  marginBottom: 16,
                  fontStyle: 'italic',
                }}
              >
                {cfg.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <span style={{ color: '#5a4030', fontSize: 10, letterSpacing: '0.1em' }}>WAGER</span>
                      <div style={{ color: '#f87171', fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700 }}>
                        {cfg.cost} pts
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#5a4030', fontSize: 10, letterSpacing: '0.1em',  }}>WIN</span>
                      <div style={{ color: '#4ade80',  fontSize: 16, fontWeight: 700 }}>
                        +{cfg.reward} pts
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: `2px solid ${cfg.color}60`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cfg.color,
                    fontSize: 16,
                  }}
                >
                  ♟
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div
        style={{
          maxWidth: 560,
          textAlign: 'center',
          color: '#4a3520',
          fontSize: 13,
          lineHeight: 1.7,
          marginBottom: 24,
          fontStyle: 'italic',
        }}
      >
        Wager points to enter each level. Win = reclaim your wager + earn the reward.
        Draw = reclaim your wager. Lose = forfeit your wager. You need more points than the wager to play.
      </div>

      {/* Reset */}
      {points.balance < 2 && (
        <button
          onClick={onResetPoints}
          style={{
            background: 'rgba(200,150,0,0.1)',
            border: '1px solid rgba(200,150,0,0.3)',
            borderRadius: 8,
            color: '#d4a820',
            // fontFamily: 'Cinzel, serif',
            fontSize: 12,
            letterSpacing: '0.1em',
            padding: '10px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,150,0,0.2)')
          }
          onMouseLeave={e =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,150,0,0.1)')
          }
        >
          Reset Points to 20
        </button>
      )}
    </div>
  );
};

export default GameLobby;
