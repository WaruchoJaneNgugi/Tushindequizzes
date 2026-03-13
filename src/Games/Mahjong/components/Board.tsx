import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import type { BoardTile, Stage } from '../types';
import { Tile } from './Tile';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

const MatchExplosion = ({ x, y, score }: { x: number, y: number, score: number, key?: string | number }) => {
  const [particles] = useState(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const distance = 40 + Math.random() * 60;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0.3 + Math.random() * 0.7,
        color: [
          'bg-amber-400',
          'bg-emerald-400',
          'bg-blue-400',
          'bg-rose-400',
          'bg-purple-400',
          'bg-yellow-400'
        ][Math.floor(Math.random() * 6)]
      };
    });
  });

  return (
      <div style={{ position: 'absolute', left: x, top: y, zIndex: 10000, pointerEvents: 'none' }}>
        {particles.map((p, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, p.x],
                  y: [0, p.y],
                  scale: [0, p.scale, 0],
                }}
                transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
                className={cn("mahjong-explosion-particle", p.color)}
            />
        ))}
        <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.2, 1, 1] }}
            transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.15, 0.8, 1], delay: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-emerald-500 drop-shadow-lg"
            style={{ WebkitTextStroke: '1.5px white', textShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
        >
          +{score}
        </motion.div>
      </div>
  );
};

interface BoardProps {
  stage: Stage;
  tiles: BoardTile[];
  selectableTiles: BoardTile[];
  selectedTileId: string | null;
  hintedTiles: [string, string] | null;
  onTileClick: (tile: BoardTile) => void;
}

export const Board = ({ stage, tiles, selectableTiles, selectedTileId, hintedTiles, onTileClick }: BoardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [explosions, setExplosions] = useState<{id: number, x: number, y: number, score: number}[]>([]);
  const prevTilesLength = useRef(tiles.length);
  const explosionIdCounter = useRef(0);

  const TILE_W = 84;
  const TILE_H = 84;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  stage.positions.forEach(pos => {
    const x = pos.x * (TILE_W / 2);
    const y = pos.y * (TILE_H / 2) - pos.z * 4;
    // Account for the visual center of the tile including its 3D shadow and selection scale
    // The shadow extends 8px to the right and bottom, and selection scales by 1.1 (approx 8px all around)
    if (x - 8 < minX) minX = x - 8;
    if (x + TILE_W + 16 > maxX) maxX = x + TILE_W + 16;
    if (y - 8 < minY) minY = y - 8;
    if (y + TILE_H + 16 > maxY) maxY = y + TILE_H + 16;
  });

  const boardWidth = maxX - minX;
  const boardHeight = maxY - minY;

  const centerX = minX + boardWidth / 2;
  const centerY = minY + boardHeight / 2;

  useEffect(() => {
    if (tiles.length < prevTilesLength.current) {
      // A match happened!
      const id = explosionIdCounter.current++;

      const score = stage.pointsPerMatch;

      setExplosions(prev => [...prev, { id, x: centerX, y: centerY, score }]);

      // Remove it after 1.5 seconds to allow score animation to finish
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== id));
      }, 1500);
    }
    prevTilesLength.current = tiles.length;
  }, [tiles.length, centerX, centerY, stage.difficulty]);

  // Calculate board bounds to center and scale it
  useLayoutEffect(() => {
    if (!containerRef.current || stage.positions.length === 0) return;

    const updateScale = () => {
      if (!containerRef.current || boardWidth === 0 || boardHeight === 0) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) return;

      // Add some padding so edge tiles have room to pop up
      const padding = window.innerWidth < 768 ? 24 : 40;
      const scaleX = (containerWidth - padding * 2) / boardWidth;
      const scaleY = (containerHeight - padding * 2) / boardHeight;

      // Use the smaller scale to fit both dimensions perfectly without scrolling
      const calculatedScale = Math.min(scaleX, scaleY, 5);

      setScale(calculatedScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [stage, boardWidth, boardHeight]);

  return (
      <div ref={containerRef} className="mahjong-board-container">
        <div
            className="mahjong-board-wrapper"
            style={{
              width: boardWidth * scale,
              height: boardHeight * scale,
            }}
        >
          <div
              className="mahjong-board-scaler"
              style={{
                width: boardWidth,
                height: boardHeight,
                transform: `scale(${scale})`,
              }}
          >
            {/* Offset tiles so they start at 0,0 within this container */}
            <div className="mahjong-board-offset" style={{ left: -minX, top: -minY }}>
              <AnimatePresence>
                {tiles.map(tile => (
                    <Tile
                        key={tile.id}
                        tile={tile}
                        isSelectable={selectableTiles.some(t => t.id === tile.id)}
                        isSelected={selectedTileId === tile.id}
                        isHinted={hintedTiles?.includes(tile.id) ?? false}
                        onClick={() => onTileClick(tile)}
                        centerX={centerX}
                        centerY={centerY}
                    />
                ))}
              </AnimatePresence>

              {/* Render Explosions */}
              {explosions.map(exp => (
                  <MatchExplosion key={exp.id} x={exp.x} y={exp.y} score={exp.score} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};
