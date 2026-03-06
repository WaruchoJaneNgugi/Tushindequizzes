import React from 'react';
import type{ GameResult, LevelConfig, PointsState } from '../types/game.types';

interface GameResultScreenProps {
  result: GameResult;
  config: LevelConfig;
  points: PointsState;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

const GameResultScreen: React.FC<GameResultScreenProps> = ({
  result,
  config,
  points,
  onPlayAgain,
  onBackToLobby,
}) => {
  const isWin = result.type === 'player_win';
  const isDraw = result.type === 'draw';
  // const isLoss = result.type === 'computer_win';

  const title = isWin ? 'Victory!' : isDraw ? 'Draw' : 'Defeat';
  const titleColor = isWin ? '#4ade80' : isDraw ? '#facc15' : '#f87171';
  const symbol = isWin ? '♔' : isDraw ? '⚖' : '♚';

  const pointsColor =
    result.pointsChange > 0 ? '#4ade80' : result.pointsChange < 0 ? '#f87171' : '#facc15';

  const pointsLabel =
    result.pointsChange > 0
      ? `+${result.pointsChange}`
      : result.pointsChange < 0
      ? `${result.pointsChange}`
      : '±0';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 30% 20%, #1a0e00 0%, #0a0a0f 60%, #050508 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: 440,
        }}
      >
        {/* Symbol */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
            filter: `drop-shadow(0 0 20px ${titleColor}40)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          {symbol}
        </div>

        {/* Title */}
        <h1
          style={{
            // fontFamily: 'Cinzel, serif',
            fontSize: 56,
            fontWeight: 900,
            color: titleColor,
            margin: '0 0 8px',
            letterSpacing: '0.1em',
            textShadow: `0 0 40px ${titleColor}40`,
          }}
        >
          {title}
        </h1>

        {/* Reason */}
        <p
          style={{
            color: '#8a6840',
            // fontFamily: 'Cinzel, serif',
            fontSize: 14,
            letterSpacing: '0.15em',
            marginBottom: 40,
            fontStyle: 'italic',
          }}
        >
          {result.reason}
        </p>

        {/* Points Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1208 0%, #0f0b06 100%)',
            border: '1px solid #3a2810',
            borderRadius: 12,
            padding: '24px 40px',
            marginBottom: 32,
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: pointsColor,
                // fontFamily: 'Cinzel, serif',
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {pointsLabel}
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
              Points {result.pointsChange >= 0 ? 'Earned' : 'Lost'}
            </div>
          </div>

          <div style={{ width: 1, height: 48, background: '#2a1a08' }} />

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: points.balance <= 4 ? '#f87171' : '#d4a820',
                // fontFamily: 'Cinzel, serif',
                fontSize: 36,
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
              New Balance
            </div>
          </div>
        </div>

        {/* Level info */}
        <div
          style={{
            color: '#5a4030',
            // fontFamily: 'Crimson Pro, serif',
            fontSize: 13,
            marginBottom: 36,
            fontStyle: 'italic',
          }}
        >
          Played on{' '}
          <span style={{ color: config.color }}>{config.label}</span> difficulty
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={onPlayAgain}
            style={{
              background: config.gradient,
              border: `1px solid ${config.color}50`,
              borderRadius: 8,
              color: '#fff',
              // fontFamily: 'Cinzel, serif',
              fontSize: 12,
              letterSpacing: '0.15em',
              padding: '12px 28px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)')
            }
          >
            Play Again
          </button>
          <button
            onClick={onBackToLobby}
            style={{
              background: 'transparent',
              border: '1px solid #3a2810',
              borderRadius: 8,
              color: '#8a6840',
              // fontFamily: 'Cinzel, serif',
              fontSize: 12,
              letterSpacing: '0.15em',
              padding: '12px 28px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#8a6840';
              (e.currentTarget as HTMLButtonElement).style.color = '#d4a820';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a2810';
              (e.currentTarget as HTMLButtonElement).style.color = '#8a6840';
            }}
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultScreen;
