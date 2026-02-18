import React from 'react';
import {type Square as SquareType, type Position} from '../types/chess.ts';
import {PIECE_SYMBOLS} from '../utils/boardUtils';

interface ChessSquareProps {
    square: SquareType;
    position: Position;
    isSelected: boolean;
    isValidMove: boolean;
    isLastMove: boolean;
    isInCheck: boolean;
    onClick: (pos: Position) => void;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
                                                            square,
                                                            position,
                                                            isSelected,
                                                            isValidMove,
                                                            isLastMove,
                                                            isInCheck,
                                                            onClick,
                                                        }) => {
    const {row, col} = position;
    const isLight = (row + col) % 2 === 0;

    let bg = isLight
        ? 'hsl(35, 40%, 78%)'
        : 'hsl(25, 35%, 42%)';

    if (isSelected) bg = '#f6f669';
    else if (isLastMove) bg = isLight ? '#cdd16e' : '#aaa23a';
    else if (isInCheck) bg = '#e74c3c';

    const pieceSymbol = square ? PIECE_SYMBOLS[square.type][square.color] : '';
    const isWhitePiece = square?.color === 'white';

    return (
        <div
            className="chess-square"
            style={{
                backgroundColor: bg,
                cursor: square || isValidMove ? 'pointer' : 'default',
                userSelect: 'none',

            }}
            onClick={() => onClick(position)}

        >
            {/* Valid move indicator */}
            {isValidMove && (
                <div style={{
                    position: 'absolute',
                    width: square ? '90%' : '33%',
                    height: square ? '90%' : '33%',
                    borderRadius: '50%',
                    backgroundColor: square
                        ? 'rgba(0,0,0,0.35)'
                        : 'rgba(0,0,0,0.2)',
                    border: square ? '3px solid rgba(0,0,0,0.35)' : 'none',
                    zIndex: 1,
                }}/>
            )}

            {/* Piece */}
            {square && (
                <span style={{
                    fontSize: 'clamp(20px, 5.5vw, 52px)',
                    lineHeight: 1,
                    zIndex: 2,
                    filter: isWhitePiece
                        ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                        : 'drop-shadow(0 1px 2px rgba(255,255,255,0.2))',
                    color: isWhitePiece ? '#fff' : '#1a1a1a',
                    WebkitTextStroke: isWhitePiece ? '1px #888' : '0.5px #888',
                }}>
          {pieceSymbol}
        </span>
            )}

            {/* Rank/File labels */}
            {col === 0 && (
                <span style={{
                    position: 'absolute',
                    top: 2,
                    left: 3,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isLight ? 'hsl(25, 35%, 42%)' : 'hsl(35, 40%, 78%)',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif',
                }}>
          {8 - row}
        </span>
            )}
            {row === 7 && (
                <span style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 3,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isLight ? 'hsl(25, 35%, 42%)' : 'hsl(35, 40%, 78%)',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif',
                }}>
          {String.fromCharCode(97 + col)}
        </span>
            )}
        </div>
    );
};

