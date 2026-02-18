import React from 'react';
import {type GameStatus, type Difficulty, DIFFICULTY_CONFIG } from '../types/chess.ts';

interface GameOverModalProps {
  status: GameStatus;
  playerWon: boolean;
  difficulty: Difficulty;
  pointsEarned: number;
  pointsLost: number;
  onPlayAgain: () => void;
  onChangeLevel: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  playerWon,
  difficulty,
  pointsEarned,
  pointsLost,
  onPlayAgain,
  onChangeLevel,
}) => {
  const config = DIFFICULTY_CONFIG[difficulty];

  const title = playerWon
    ? '🏆 Victory!'
    : status === 'stalemate'
    ? '🤝 Stalemate'
    : '💀 Defeated';

  const subtitle = playerWon
    ? `You beat the ${config.label} AI!`
    : status === 'stalemate'
    ? 'The game ended in a draw.'
    : `The ${config.label} AI wins.`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1a1209, #2a1f0a)',
        border: `2px solid ${playerWon ? '#c9a227' : '#e74c3c'}`,
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '380px',
        width: '90%',
        textAlign: 'center',
        boxShadow: `0 0 60px ${playerWon ? 'rgba(201,162,39,0.4)' : 'rgba(231,76,60,0.4)'}`,
        animation: 'slideIn 0.3s ease',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>{title}</div>
        <div style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '22px',
          color: '#fff',
          marginBottom: '8px',
          fontWeight: 700,
        }}>
          {subtitle}
        </div>

        {/* Points summary */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          margin: '20px 0',
        }}>
          <div style={{ color: '#b8a898', fontSize: '13px', marginBottom: '8px' }}>Point Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <div style={{ color: '#e74c3c', fontSize: '18px', fontWeight: 700 }}>−{pointsLost}</div>
              <div style={{ color: '#888', fontSize: '11px' }}>Entry cost</div>
            </div>
            <div style={{ color: '#555', fontSize: '24px' }}>→</div>
            <div>
              {playerWon ? (
                <>
                  <div style={{ color: '#2ecc71', fontSize: '18px', fontWeight: 700 }}>+{pointsEarned}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>Won!</div>
                </>
              ) : (
                <>
                  <div style={{ color: '#666', fontSize: '18px', fontWeight: 700 }}>+0</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>No reward</div>
                </>
              )}
            </div>
            <div style={{ color: '#555', fontSize: '24px' }}>→</div>
            <div>
              <div style={{
                color: playerWon ? '#c9a227' : '#e74c3c',
                fontSize: '18px',
                fontWeight: 700,
              }}>
                {playerWon ? `net +${pointsEarned - pointsLost}` : `net −${pointsLost}`}
              </div>
              <div style={{ color: '#888', fontSize: '11px' }}>Net</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #8B6914, #c9a227)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              color: '#fff',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Play Again
          </button>
          <button
            onClick={onChangeLevel}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '14px',
              color: '#fff',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Change Level
          </button>
        </div>
      </div>
    </div>
  );
};

