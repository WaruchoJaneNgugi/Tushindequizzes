import React from 'react';
import type { CellValue } from '../types/game.types';

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  isWinning: boolean;
  isHoverPreview: boolean;
  isDropping: boolean;
}

const Cell: React.FC<CellProps> = ({ value, isWinning, isHoverPreview, isDropping }) => {
  const hasPiece   = value !== null || isHoverPreview;
  const isPlayer   = value === 'player';
  const isComputer = value === 'computer';

  const pieceStyle = (): React.CSSProperties => {
    if (isHoverPreview && !value) return {
      background: 'radial-gradient(circle at 35% 30%, #a0ffff88, #00ccff55, #0066ff33)',
      boxShadow: '0 0 12px rgba(0,200,255,0.4)', opacity: 0.5,
    };
    if (isPlayer) return {
      background: 'radial-gradient(circle at 38% 28%, #ccffff, #00e5ff 35%, #00aaff 65%, #0055cc)',
      boxShadow: isWinning
        ? '0 0 28px #00ffff, 0 0 55px #00ccff, 0 0 80px #0080ff'
        : '0 0 14px rgba(0,200,255,0.9), 0 0 26px rgba(0,150,255,0.45)',
      animation: isWinning ? 'winPulse 0.8s ease-in-out infinite alternate' : undefined,
      transform: isWinning ? 'scale(1.08)' : undefined,
    };
    if (isComputer) return {
      background: 'radial-gradient(circle at 38% 28%, #ffaaaa, #ff5555 35%, #dd1111 65%, #880000)',
      boxShadow: isWinning
        ? '0 0 28px #ff4444, 0 0 55px #ff2222, 0 0 80px #cc0000'
        : '0 0 14px rgba(255,80,80,0.9), 0 0 26px rgba(220,0,0,0.45)',
      animation: isWinning ? 'winPulseRed 0.8s ease-in-out infinite alternate' : undefined,
      transform: isWinning ? 'scale(1.08)' : undefined,
    };
    return {};
  };

  return (
    <div style={{
      width: '100%', aspectRatio: '1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '5px',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: hasPiece ? 'transparent'
          : 'radial-gradient(circle at 40% 35%, #1a1f4a, #0a0d25 60%, #050710)',
        boxShadow: hasPiece ? 'none'
          : 'inset 0 4px 12px rgba(0,0,0,0.9), inset 0 -2px 6px rgba(0,0,50,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {hasPiece && (
          <div
            className={isDropping ? 'piece-drop' : ''}
            style={{
              width: '88%', height: '88%', borderRadius: '50%',
              position: 'relative', transition: 'transform 0.12s ease',
              ...pieceStyle(),
            }}
          >
            <div style={{
              position: 'absolute', top: '12%', left: '16%',
              width: '30%', height: '22%', borderRadius: '50%',
              background: 'rgba(255,255,255,0.44)', filter: 'blur(2px)',
              pointerEvents: 'none',
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Cell);
