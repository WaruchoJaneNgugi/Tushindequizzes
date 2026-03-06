import React from 'react';
import type{ PieceColor, PieceType } from '../types/chess.types';
import ChessPiece from './ChessPiece';

interface PromotionModalProps {
  color: PieceColor;
  onChoose: (piece: PieceType) => void;
}

const PROMOTION_PIECES: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onChoose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg, #1a1208 0%, #0d0a05 100%)',
          border: '1px solid #8a6020',
          borderRadius: 12,
          padding: '32px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(200,150,0,0.1)',
        }}
      >
        <p
          style={{
            color: '#d4a820',
            // fontFamily: 'Cinzel, serif',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.12em',
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          Choose Promotion
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {PROMOTION_PIECES.map(pieceType => (
            <button
              key={pieceType}
              onClick={() => onChoose(pieceType)}
              style={{
                width: 72,
                height: 72,
                background: 'rgba(200,150,0,0.1)',
                border: '1px solid #8a6020',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,150,0,0.25)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#d4a820';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,150,0,0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#8a6020';
              }}
            >
              <ChessPiece piece={{ type: pieceType, color }} size={48} />
              <span
                style={{
                  color: '#9a7a40',
                  // fontFamily: 'Cinzel, serif',
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {pieceType}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
