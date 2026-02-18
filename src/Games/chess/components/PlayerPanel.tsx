import React from 'react';
import {type ChessPiece, type PieceColor, type PlayerStats, type Difficulty} from '../types/chess.ts';
import { PIECE_SYMBOLS } from '../utils/boardUtils';

interface PlayerPanelProps {
  color: PieceColor;
  label: string;
  capturedPieces: ChessPiece[];
  isActive: boolean;
  isAIThinking?: boolean;
  stats?: PlayerStats;
  difficulty?: Difficulty;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  color,
  label,
  capturedPieces,
  isActive,
  isAIThinking,
  stats,
  difficulty,
}) => {
  const pieceValue = (type: string) => {
    const vals: Record<string, number> = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 };
    return vals[type] || 0;
  };
  const totalValue = capturedPieces.reduce((sum, p) => sum + pieceValue(p.type), 0);

  return (
    <div style={{
      background: isActive ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isActive ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '10px',
      padding: '12px 16px',
      transition: 'all 0.3s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Color indicator */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: color === 'white' ? 'linear-gradient(135deg, #fff, #ccc)' : 'linear-gradient(135deg, #333, #111)',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}>
          {color === 'white' ? '♔' : '♚'}
        </div>
        <div>
          <div style={{ color: '#fff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '15px', fontWeight: 700 }}>
            {label}
            {isAIThinking && (
              <span style={{ color: '#c9a227', fontSize: '12px', marginLeft: '8px', animation: 'pulse 1s infinite' }}>
                thinking...
              </span>
            )}
          </div>
          {isActive && !isAIThinking && (
            <div style={{ color: '#c9a227', fontSize: '11px' }}>Your turn</div>
          )}
          {/* Captured pieces */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', marginTop: '4px', maxWidth: '200px' }}>
            {capturedPieces.map((p, i) => (
              <span key={i} style={{ fontSize: '14px', opacity: 0.85 }}>
                {PIECE_SYMBOLS[p.type][p.color]}
              </span>
            ))}
            {totalValue > 0 && (
              <span style={{ color: '#c9a227', fontSize: '11px', alignSelf: 'center', marginLeft: '4px' }}>
                +{totalValue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats panel (player only) */}
      {stats && difficulty && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #8B6914, #c9a227)',
            borderRadius: '8px',
            padding: '6px 12px',
            marginBottom: '4px',
          }}>
            <span style={{ color: '#fff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', fontWeight: 700 }}>
              {stats.points}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginLeft: '4px' }}>pts</span>
          </div>
          <div style={{ color: '#b8a898', fontSize: '11px' }}>
            W:{stats.wins} L:{stats.losses}
          </div>
        </div>
      )}
    </div>
  );
};

