// ChessPieceIcon.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChessKing,
    faChessQueen,
    faChessRook,
    faChessBishop,
    faChessKnight,
    faChessPawn,
} from '@fortawesome/free-solid-svg-icons';
import { type PieceType, type PieceColor } from '../types/chess';

interface ChessPieceIconProps {
    type: PieceType;
    color: PieceColor;
    size?: number;
}

export const ChessPieceIcon: React.FC<ChessPieceIconProps> = ({ type, color, size = 40 }) => {
    const getIcon = () => {
        switch (type) {
            case 'king': return faChessKing;
            case 'queen': return faChessQueen;
            case 'rook': return faChessRook;
            case 'bishop': return faChessBishop;
            case 'knight': return faChessKnight;
            case 'pawn': return faChessPawn;
            default: return faChessPawn;
        }
    };

    return (
        <FontAwesomeIcon
            icon={getIcon()}
            style={{
                color: color === 'white' ? '#ffffff' : '#1a1a1a',
                filter: color === 'white'
                    ? 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
                    : 'drop-shadow(2px 2px 2px rgba(255,255,255,0.3))',
                width: size,
                height: size,
            }}
        />
    );
};