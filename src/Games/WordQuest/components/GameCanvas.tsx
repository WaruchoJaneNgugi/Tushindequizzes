
import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { GameState, Position, PlacedWord } from '../types';
import { COLORS, HIGHLIGHT_COLORS } from '../constants';
import { soundService } from '../services/soundService';

interface GameCanvasProps {
  gameState: GameState;
  onWordSelection: (start: Position, end: Position) => void;
  width: number;
  height: number;
  isMobile: boolean;
}

interface AnimationState {
  startTime: number;
  cells: Position[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onWordSelection, width, height, isMobile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const prevPlacedWords = useRef<PlacedWord[]>([]);
  const [activeAnimations, setActiveAnimations] = useState<AnimationState[]>([]);

  const [dragState, setDragState] = React.useState<{
    isDragging: boolean;
    start: Position | null;
    current: Position | null;
  }>({
    isDragging: false,
    start: null,
    current: null,
  });

  const { rows, cols } = gameState;
  const cellW = width / cols;
  const cellH = height / rows;

  useEffect(() => {
    const newlyFound = gameState.placedWords.filter(word => {
      const prev = prevPlacedWords.current.find(p => p.word === word.word && p.part === word.part);
      return word.found && (!prev || !prev.found);
    });

    if (newlyFound.length > 0) {
      const newAnims = newlyFound.map(word => ({
        startTime: performance.now(),
        cells: word.cells
      }));
      setActiveAnimations(prev => [...prev, ...newAnims]);
    }

    prevPlacedWords.current = gameState.placedWords;
  }, [gameState.placedWords]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      setActiveAnimations(prev => prev.filter(a => now - a.startTime < 600));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getGridPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Position => {
    const canvas = canvasRef.current;
    if (!canvas) return { r: 0, c: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent | React.MouseEvent).clientX;
      clientY = (e as MouseEvent | React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return {
      r: Math.floor(y / cellH),
      c: Math.floor(x / cellW)
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState.status !== 'PLAYING') return;
    if (e.type === 'touchstart') e.preventDefault();

    const pos = getGridPos(e);
    if (pos.r >= 0 && pos.r < rows && pos.c >= 0 && pos.c < cols) {
      soundService.playTick();
      setDragState({
        isDragging: true,
        start: pos,
        current: pos
      });
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.start || gameState.status !== 'PLAYING') return;
    if (e.type === 'touchmove') e.preventDefault();

    const pos = getGridPos(e);
    if (pos.r >= 0 && pos.r < rows && pos.c >= 0 && pos.c < cols) {
      if (!dragState.current || pos.r !== dragState.current.r || pos.c !== dragState.current.c) {
        soundService.playTick();
        setDragState(prev => ({ ...prev, current: pos }));
      }
    }
  };

  const handleEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e?.type === 'touchend') e.preventDefault();
    if (dragState.isDragging && dragState.start && dragState.current) {
      onWordSelection(dragState.start, dragState.current);
    }
    setDragState({
      isDragging: false,
      start: null,
      current: null
    });
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = COLORS.gridBg;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const isWon = gameState.status === 'WON';

    gameState.placedWords.forEach((pw, index) => {
      if (pw.found) {
        ctx.lineWidth = Math.min(cellW, cellH) * 0.75;
        const color = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
        ctx.strokeStyle = isWon ? 'rgba(74, 222, 128, 0.5)' : color;

        ctx.beginPath();
        ctx.moveTo(pw.start.c * cellW + cellW/2, pw.start.r * cellH + cellH/2);
        ctx.lineTo(pw.end.c * cellW + cellW/2, pw.end.r * cellH + cellH/2);
        ctx.stroke();
      }
    });

    if (dragState.isDragging && dragState.start && dragState.current) {
      ctx.strokeStyle = COLORS.highlight;
      ctx.lineWidth = Math.min(cellW, cellH) * 0.75;
      ctx.beginPath();
      ctx.moveTo(dragState.start.c * cellW + cellW/2, dragState.start.r * cellH + cellH/2);
      ctx.lineTo(dragState.current.c * cellW + cellW/2, dragState.current.r * cellH + cellH/2);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSizeMultiplier = isMobile ? 0.65 : 0.5;
    const baseFontSize = Math.min(cellW, cellH) * fontSizeMultiplier;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const centerX = c * cellW + cellW / 2;
        const centerY = r * cellH + cellH / 2;

        let scale = 1.0;
        for (const anim of activeAnimations) {
          const isCellInAnim = anim.cells.some(cell => cell.r === r && cell.c === c);
          if (isCellInAnim) {
            const elapsed = now - anim.startTime;
            if (elapsed < 600) {
              const t = elapsed / 600;
              scale = 1.0 + Math.sin(t * Math.PI) * 0.5;
            }
          }
        }

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);

        ctx.font = `bold ${baseFontSize}px Inter, sans-serif`;
        ctx.fillStyle = isWon ? '#4ade80' : COLORS.text;

        ctx.fillText(gameState.grid[r][c], 0, 0);
        ctx.restore();
      }
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, height);
      ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(width, i * cellH);
      ctx.stroke();
    }
  }, [gameState, dragState, cellW, cellH, rows, cols, width, height, activeAnimations, isMobile]);

  useEffect(() => {
    const render = () => {
      draw();
      animationFrameId.current = requestAnimationFrame(render);
    };
    animationFrameId.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [draw]);

  return (
      <div className="canvas-wrapper">
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={() => handleEnd()}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            style={{ display: 'block', touchAction: 'none' }}
        />
      </div>
  );
};

export default GameCanvas;
