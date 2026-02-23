import React, { useRef, useEffect, useState, useCallback } from 'react';
import { type Board, type Position, type Move } from '../types/chess.ts';
import { PIECE_SYMBOLS } from '../utils/boardUtils';

interface CanvasChessBoardProps {
    board: Board;
    selectedSquare: Position | null;
    validMoves: Position[];
    moveHistory: Move[];
    inCheck: boolean;
    currentTurn: 'white' | 'black';
    onSquareClick: (pos: Position) => void;
    size?: number; // Optional size prop, defaults to 800
}

export const ChessBoard: React.FC<CanvasChessBoardProps> = ({
                                                                board,
                                                                selectedSquare,
                                                                validMoves,
                                                                moveHistory,
                                                                inCheck,
                                                                currentTurn,
                                                                onSquareClick,
                                                                size = 800,
                                                            }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState(size);
    const [scale, setScale] = useState(1);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const lastMove = moveHistory[moveHistory.length - 1];

    // Load all piece images
    const pieceImages = useRef<Map<string, HTMLImageElement>>(new Map());

    // Preload all piece images
    useEffect(() => {
        const pieceTypes = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
        const colors = ['white', 'black'];
        let loadedCount = 0;
        const totalImages = pieceTypes.length * colors.length;

        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setImagesLoaded(true);
                // Redraw canvas once images are loaded
                if (canvasRef.current) {
                    drawBoard();
                }
            }
        };

        pieceTypes.forEach(pieceType => {
            colors.forEach(color => {
                const img = new Image();
                img.onload = checkAllLoaded;
                img.onerror = checkAllLoaded; // Count errors as loaded to avoid hanging
                img.src = PIECE_SYMBOLS[pieceType as keyof typeof PIECE_SYMBOLS][color as 'white' | 'black'];
                pieceImages.current.set(`${pieceType}-${color}`, img);
            });
        });
    }, []);

    // Handle responsive sizing
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const newSize = Math.min(containerWidth, size);
                setCanvasSize(newSize);
                setScale(newSize / size);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [size]);

    // Draw the board function
    const drawBoard = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const squareSize = canvasSize / 8;

        // Clear canvas
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const x = col * squareSize;
                const y = row * squareSize;

                // Determine square color
                const isLight = (row + col) % 2 === 0;
                let fillColor = isLight ? 'hsl(29,96%,81%)' : 'hsl(27,87%,56%)';

                // Check if this is the selected square
                if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                    fillColor = 'rgba(103,255,0,0.53)';
                }
                // Check if this is a last move square
                else if (lastMove && (
                    (lastMove.from.row === row && lastMove.from.col === col) ||
                    (lastMove.to.row === row && lastMove.to.col === col)
                )) {
                    fillColor = isLight ? 'rgba(103,255,0,0.53)' : 'rgba(103,255,0,0.33)';
                }
                // Check if this is the king in check
                else if (inCheck) {
                    // Draw piece if exists
                    const piece = board[row][col];
                    if (piece) {
                        const img = pieceImages.current.get(`${piece.type}-${piece.color}`);

                        if (img && img.complete && img.naturalHeight > 0) {
                            // Draw image with padding (90% of square size)
                            const padding = squareSize * 0.1;
                            const imgSize = squareSize - (padding * 2);

                            // Save context state
                            ctx.save();

                            // Add shadow based on piece color
                            if (piece.color === 'white') {
                                // Black shadow for white pieces
                                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                                ctx.shadowBlur = 4;
                                ctx.shadowOffsetX = 2;
                                ctx.shadowOffsetY = 2;
                            } else {
                                // White shadow for black pieces
                                ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                                ctx.shadowBlur = 4;
                                ctx.shadowOffsetX = 2;
                                ctx.shadowOffsetY = 2;
                            }

                            // Draw the image
                            ctx.drawImage(
                                img,
                                x + padding,
                                y + padding,
                                imgSize,
                                imgSize
                            );

                            // Restore context
                            ctx.restore();
                        } else {
                            // Fallback to text if image not loaded
                            const symbol = PIECE_SYMBOLS[piece.type][piece.color];
                            ctx.font = `bold ${squareSize * 0.7}px 'Arial', 'Segoe UI', 'Noto Sans', sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            if (piece.color === 'white') {
                                ctx.fillStyle = '#ffffff';
                                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                                ctx.shadowBlur = 4;
                                ctx.shadowOffsetX = 1;
                                ctx.shadowOffsetY = 1;
                            } else {
                                ctx.fillStyle = '#1a1a1a';
                                ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                                ctx.shadowBlur = 3;
                                ctx.shadowOffsetX = 1;
                                ctx.shadowOffsetY = 1;
                            }

                            ctx.fillText(symbol, x + squareSize/2, y + squareSize/2);

                            // Reset shadow
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    }
                }

                // Draw square
                ctx.fillStyle = fillColor;
                ctx.fillRect(x, y, squareSize, squareSize);

                // Draw valid move indicator
                const isValidMove = validMoves.some(m => m.row === row && m.col === col);
                if (isValidMove) {
                    const piece = board[row][col];
                    ctx.beginPath();
                    if (piece) {
                        // Capture indicator - ring around piece
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                        ctx.lineWidth = 4 * scale;
                        ctx.setLineDash([]);
                        ctx.arc(x + squareSize/2, y + squareSize/2, squareSize * 0.4, 0, 2 * Math.PI);
                        ctx.stroke();
                    } else {
                        // Empty square indicator - dot
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.beginPath();
                        ctx.arc(x + squareSize/2, y + squareSize/2, squareSize * 0.15, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }

                // Draw piece if exists
                const piece = board[row][col];
                if (piece) {
                    const img = pieceImages.current.get(`${piece.type}-${piece.color}`);

                    if (img && img.complete && img.naturalHeight > 0) {
                        // Draw image with padding (90% of square size)
                        const padding = squareSize * 0.1;
                        const imgSize = squareSize - (padding * 2);

                        // Save context state
                        ctx.save();

                        // Add subtle shadow
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                        ctx.shadowBlur = 4;
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;

                        // Draw the image
                        ctx.drawImage(
                            img,
                            x + padding,
                            y + padding,
                            imgSize,
                            imgSize
                        );

                        // Restore context
                        ctx.restore();
                    } else {
                        // Fallback to text if image not loaded
                        const symbol = PIECE_SYMBOLS[piece.type][piece.color];
                        ctx.font = `bold ${squareSize * 0.7}px 'Arial', 'Segoe UI', 'Noto Sans', sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        if (piece.color === 'white') {
                            ctx.fillStyle = '#ffffff';
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                            ctx.shadowBlur = 4;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                        } else {
                            ctx.fillStyle = '#1a1a1a';
                            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                            ctx.shadowBlur = 3;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                        }

                        ctx.fillText(symbol, x + squareSize/2, y + squareSize/2);

                        // Reset shadow
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    }
                }

                // Draw rank labels (left side)
                if (col === 0) {
                    ctx.font = `bold ${squareSize * 0.15}px 'Georgia', serif`;
                    ctx.fillStyle = isLight ? 'hsl(25, 35%, 42%)' : 'hsl(35, 40%, 78%)';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText((8 - row).toString(), x + 3, y + 3);
                }

                // Draw file labels (bottom)
                if (row === 7) {
                    ctx.font = `bold ${squareSize * 0.15}px 'Georgia', serif`;
                    ctx.fillStyle = isLight ? 'hsl(25, 35%, 42%)' : 'hsl(35, 40%, 78%)';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(String.fromCharCode(97 + col), x + squareSize - 3, y + squareSize - 3);
                }
            }
        }
    }, [board, selectedSquare, validMoves, lastMove, inCheck, currentTurn, canvasSize, scale]);

    // Draw the board whenever dependencies change
    useEffect(() => {
        if (imagesLoaded || canvasRef.current) {
            drawBoard();
        }
    }, [drawBoard, imagesLoaded]);

    // Handle clicks on canvas
    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Calculate click position relative to canvas
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const squareSize = canvas.width / 8;
        const col = Math.floor(x / squareSize);
        const row = Math.floor(y / squareSize);

        // Ensure within bounds
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            onSquareClick({ row, col });
        }
    }, [onSquareClick]);

    // Handle touch events for mobile
    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
        event.preventDefault(); // Prevent scrolling
        const canvas = canvasRef.current;
        if (!canvas || !event.touches[0]) return;

        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        const squareSize = canvas.width / 8;
        const col = Math.floor(x / squareSize);
        const row = Math.floor(y / squareSize);

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            onSquareClick({ row, col });
        }
    }, [onSquareClick]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                maxWidth: size,
                margin: '0 auto',
                aspectRatio: '1/1',
                position: 'relative'
            }}
        >
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onTouchStart={handleTouchStart}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    border: '3px solid #3d2b1f',
                    borderRadius: '4px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    touchAction: 'none', // Prevent browser handling of touch events
                }}
                width={canvasSize}
                height={canvasSize}
            />
        </div>
    );
};