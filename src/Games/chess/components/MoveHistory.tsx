import React, { useEffect, useRef } from 'react';
import { type Move } from '../types/chess.ts';
import { PIECE_SYMBOLS } from '../utils/boardUtils';

interface MoveHistoryProps {
  moves: Move[];
}

const colLetter = (col: number) => String.fromCharCode(97 + col);
const rowNum = (row: number) => 8 - row;

const formatMove = (move: Move): string => {
  const piece = move.piece.type !== 'pawn'
    ? PIECE_SYMBOLS[move.piece.type][move.piece.color]
    : '';
  const capture = move.captured || move.isEnPassant ? 'x' : '';
  const fromFile = move.piece.type === 'pawn' && capture ? colLetter(move.from.col) : '';
  const to = `${colLetter(move.to.col)}${rowNum(move.to.row)}`;
  if (move.isCastle) {
    return move.to.col === 6 ? 'O-O' : 'O-O-O';
  }
  return `${piece}${fromFile}${capture}${to}`;
};

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves.length]);

  const pairs: Array<[Move, Move | undefined]> = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '12px',
      maxHeight: '200px',
      overflowY: 'auto',
    }}>
      <div style={{ color: '#b8a898', fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Move History
      </div>
      {pairs.length === 0 ? (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '10px' }}>
          No moves yet
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2px 8px' }}>
          {pairs.map(([white, black], idx) => (
            <React.Fragment key={idx}>
              <span style={{ color: '#555', fontSize: '12px', paddingTop: '2px' }}>{idx + 1}.</span>
              <span style={{ color: '#e8dcc8', fontSize: '13px', fontFamily: 'monospace', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                {formatMove(white)}
              </span>
              <span style={{ color: '#aaa', fontSize: '13px', fontFamily: 'monospace', padding: '2px 6px' }}>
                {black ? formatMove(black) : ''}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MoveHistory;
