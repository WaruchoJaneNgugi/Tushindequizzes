import React from 'react';
import {type Difficulty, DIFFICULTY_CONFIG } from '../types/chess.ts';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelect: (d: Difficulty) => void;
  playerPoints: number;
  onStartGame: () => void;
}

const difficultyColors: Record<Difficulty, { bg: string; border: string; glow: string }> = {
  easy:   { bg: 'linear-gradient(135deg, #1a5c2a, #27ae60)', border: '#2ecc71', glow: '#27ae6044' },
  medium: { bg: 'linear-gradient(135deg, #1a3a5c, #2980b9)', border: '#3498db', glow: '#3498db44' },
  hard:   { bg: 'linear-gradient(135deg, #5c3a1a, #d4880e)', border: '#f39c12', glow: '#f39c1244' },
  expert: { bg: 'linear-gradient(135deg, #4a1a1a, #c0392b)', border: '#e74c3c', glow: '#e74c3c44' },
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onSelect,
  playerPoints,
  onStartGame,
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const selectedConfig = DIFFICULTY_CONFIG[selectedDifficulty];
  const canAfford = playerPoints > selectedConfig.cost;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <p style={{ color: '#b8a898', fontSize: '13px', margin: 0 }}>
          Select difficulty level · Cost deducted before play · Win to earn rewards
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {difficulties.map(diff => {
          const config = DIFFICULTY_CONFIG[diff];
          const colors = difficultyColors[diff];
          const isSelected = diff === selectedDifficulty;
          const affordable = playerPoints > config.cost;

          return (
            <button
              key={diff}
              onClick={() => onSelect(diff)}
              style={{
                background: isSelected ? colors.bg : 'rgba(255,255,255,0.04)',
                border: `2px solid ${isSelected ? colors.border : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px',
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: isSelected ? `0 0 20px ${colors.glow}` : 'none',
                opacity: affordable ? 1 : 0.5,
              }}
            >
              <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {config.label}
              </div>
              <div style={{ fontSize: '12px', color: '#b8a898', marginBottom: '8px' }}>
                {config.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#e74c3c' }}>−{config.cost} pts</span>
                <span style={{ color: '#2ecc71' }}>+{config.reward} pts</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        onClick={onStartGame}
        disabled={!canAfford}
        style={{
          background: canAfford
            ? 'linear-gradient(135deg, #8B6914, #c9a227)'
            : 'rgba(255,255,255,0.05)',
          border: canAfford ? '2px solid #c9a227' : '2px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '16px',
          cursor: canAfford ? 'pointer' : 'not-allowed',
          color: canAfford ? '#fff' : '#666',
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '1px',
          transition: 'all 0.2s',
          boxShadow: canAfford ? '0 0 30px rgba(201,162,39,0.3)' : 'none',
        }}
      >
        {canAfford
          ? `⚔️ Start Game · Pay ${selectedConfig.cost} pts`
          : `❌ Need more than ${selectedConfig.cost} points`}
      </button>

      {!canAfford && (
        <p style={{ textAlign: 'center', color: '#e74c3c', fontSize: '13px', margin: 0 }}>
          You need more than {selectedConfig.cost} points to play {selectedDifficulty}. Choose a lower difficulty or earn points by winning.
        </p>
      )}
    </div>
  );
};

