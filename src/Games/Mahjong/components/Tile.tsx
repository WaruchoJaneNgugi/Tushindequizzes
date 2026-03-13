// Change to:
import type { BoardTile } from '../types';
import { cn } from '../lib/utils';
import { motion, useIsPresent } from 'motion/react';
import { TileFace } from './TileFace';
import { useState } from 'react';

interface TileProps {
  key?: string | number;
  tile: BoardTile;
  isSelectable: boolean;
  isSelected: boolean;
  isHinted: boolean;
  onClick: () => void;
  centerX?: number;
  centerY?: number;
}

export const Tile = ({ tile, isSelectable, isSelected, isHinted, onClick, centerX, centerY }: TileProps) => {
  // Base dimensions. We'll scale the board container to fit the screen.
  const TILE_W = 84;
  const TILE_H = 84;
  
  // Calculate position.
  // tile.x and tile.y are in half-tile units.
  const zOffsetX = 0;
  const zOffsetY = -tile.z * 4;
  const left = tile.x * (TILE_W / 2) + zOffsetX;
  const top = tile.y * (TILE_H / 2) + zOffsetY;
  
  // Z-index needs to be carefully calculated so tiles overlap correctly.
  const zIndex = tile.z * 10000 + tile.y * 100 + tile.x;

  const [exitAnimation] = useState(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 200;
    
    const particles = Array.from({ length: 16 }).map(() => {
      const pAngle = Math.random() * Math.PI * 2;
      const pDist = 80 + Math.random() * 160;
      return {
        x: Math.cos(pAngle) * pDist,
        y: Math.sin(pAngle) * pDist,
        size: 6 + Math.random() * 12,
        color: ['bg-amber-400', 'bg-emerald-500', 'bg-white', 'bg-stone-300', 'bg-yellow-400'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 720,
        shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'
      };
    });

    return {
      randomX: Math.cos(angle) * distance,
      randomY: Math.sin(angle) * distance,
      randomRotate1: (Math.random() - 0.5) * 90,
      randomRotate2: (Math.random() - 0.5) * 720,
      particles
    };
  });

  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        left: left, 
        top: top, 
        x: isSelected ? -4 : 0,
        y: isSelected ? -4 : 0, 
      }}
      exit={{ 
        left: [left, centerX !== undefined ? centerX - TILE_W / 2 : left, centerX !== undefined ? centerX - TILE_W / 2 + exitAnimation.randomX : left], 
        top: [top, centerY !== undefined ? centerY - TILE_H / 2 : top, centerY !== undefined ? centerY - TILE_H / 2 + exitAnimation.randomY : top], 
        opacity: [1, 1, 0], 
        transition: { duration: 0.7, times: [0, 0.35, 1], ease: ["easeIn", "easeOut"] }
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{
        position: 'absolute',
        zIndex: isSelected || !isPresent ? 9999 : zIndex,
        width: TILE_W,
        height: TILE_H,
        pointerEvents: isSelectable && isPresent ? 'auto' : 'none'
      }}
      className={cn(
        "mahjong-tile-wrapper",
        !isSelectable && "disabled"
      )}
      onClick={isSelectable && isPresent ? onClick : undefined}
    >
      <motion.div
        initial={{ scale: 0.8, filter: "brightness(1) blur(0px)" }}
        animate={{ scale: isSelected ? 1.05 : 1, rotate: 0, filter: "brightness(1) blur(0px)" }}
        exit={{ 
          scale: [1, 1.4, 0], 
          rotate: [0, exitAnimation.randomRotate1, exitAnimation.randomRotate2],
          filter: ["brightness(1) blur(0px)", "brightness(2) blur(0px)", "brightness(1) blur(8px)"],
          transition: { duration: 0.7, times: [0, 0.35, 1], ease: ["easeIn", "easeOut"] }
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full h-full relative"
      >
        {/* 3D Base (Green/Blue back) */}
      <div 
        className={cn(
          "mahjong-tile-base",
          isSelected ? "selected" : "normal",
          !isSelectable && "disabled"
        )}
      />
      
      {/* Tile Face (White) */}
      <div 
        className={cn(
          "mahjong-tile-face",
          isSelected ? "selected" : "normal",
          !isSelectable && "disabled",
          isHinted && !isSelected && "hinted"
        )}
      >
        <div className={cn("mahjong-tile-content", !isSelectable && "disabled")}>
          <TileFace type={tile.type} />
        </div>
        
        {/* Subtle highlight for selectable tiles */}
        {isSelectable && !isSelected && (
          <div className="mahjong-tile-hover" />
        )}

        {/* Crack / Flash Effect on Match */}
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ 
            opacity: [0, 0, 1, 0],
            scale: [1, 1, 1.2, 1.5],
            transition: { duration: 0.7, times: [0, 0.34, 0.35, 1] }
          }}
          className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-white rounded-xl mix-blend-overlay" />
          <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900/70 drop-shadow-sm">
            <path d="M48 0 L52 25 L40 45 L60 65 L45 85 L50 100 L55 100 L50 85 L65 65 L45 45 L57 25 L53 0 Z" fill="currentColor" />
            <path d="M0 48 L25 52 L45 40 L65 60 L85 45 L100 50 L100 55 L85 50 L65 65 L45 45 L25 57 L0 53 Z" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
      </motion.div>

      {/* Particles */}
      {!isPresent && exitAnimation.particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute top-1/2 left-1/2 ${p.shape} ${p.color} shadow-md z-[10000]`}
          style={{ width: p.size, height: p.size, marginTop: -p.size/2, marginLeft: -p.size/2, pointerEvents: 'none' }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          exit={{
            opacity: [0, 0, 1, 0],
            x: [0, 0, 0, p.x],
            y: [0, 0, 0, p.y],
            scale: [0, 0, 1.5, Math.random() * 0.5],
            rotate: [0, 0, 0, p.rotation],
            transition: { duration: 0.8, times: [0, 0.34, 0.35, 1], ease: ["linear", "linear", "easeOut"] }
          }}
        />
      ))}
    </motion.div>
  );
};
