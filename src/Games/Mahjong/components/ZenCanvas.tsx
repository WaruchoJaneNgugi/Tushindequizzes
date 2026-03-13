import React, { useEffect, useRef, useState } from 'react';
import type { BoardTile, Stage } from '../types';
import { getSymbolTexture, getTileShadow, getTileFace, TILE_W, TILE_H, TILE_DEPTH } from '../game/canvasRenderer';

interface BoardProps {
  stage: Stage;
  tiles: BoardTile[];
  selectableTiles: BoardTile[];
  selectedTileId: string | null;
  hintedTiles: [string, string] | null;
  onTileClick: (tile: BoardTile) => void;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation: number;
  vr: number;
  type: 'spark' | 'dust' | 'flash';

  constructor(x: number, y: number, type: 'spark' | 'dust' | 'flash' = 'spark') {
    this.x = x;
    this.y = y;
    this.type = type;

    if (type === 'flash') {
      this.vx = 0;
      this.vy = 0;
      this.size = 60 + Math.random() * 40;
      this.maxLife = 0.15 + Math.random() * 0.1;
      this.life = this.maxLife;
      this.color = '#ffffff';
      this.rotation = Math.random() * Math.PI * 2;
      this.vr = (Math.random() - 0.5) * 2;
    } else if (type === 'spark') {
      const angle = Math.random() * Math.PI * 2;
      const speed = 300 + Math.random() * 400;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 100;
      this.size = 2 + Math.random() * 3;
      this.maxLife = 0.3 + Math.random() * 0.3;
      this.life = this.maxLife;
      this.rotation = Math.atan2(this.vy, this.vx);
      this.vr = 0;
      const colors = ['#ffffff', '#fef08a', '#fde047', '#fbbf24'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    } else {
      // dust
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = 4 + Math.random() * 8;
      this.maxLife = 0.4 + Math.random() * 0.3;
      this.life = this.maxLife;
      this.rotation = Math.random() * Math.PI * 2;
      this.vr = (Math.random() - 0.5) * 4;
      const colors = ['#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
  }

  update(dt: number) {
    if (this.type === 'spark') {
      this.vy += 1500 * dt; // Gravity
      this.vx *= Math.pow(0.05, dt); // Drag
      this.vy *= Math.pow(0.2, dt);
      // Update rotation to match velocity
      if (Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10) {
        this.rotation = Math.atan2(this.vy, this.vx);
      }
    } else if (this.type === 'dust') {
      this.vy -= 150 * dt; // Float up
      this.vx *= Math.pow(0.001, dt); // High drag
      this.vy *= Math.pow(0.001, dt);
      this.rotation += this.vr * dt;
    } else if (this.type === 'flash') {
      this.rotation += this.vr * dt;
      this.size += 300 * dt; // Expand
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }
}

class RenderTile {
  id: string;
  tile: BoardTile;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  scale: number = 0;
  targetScale: number = 1;
  opacity: number = 0;
  targetOpacity: number = 1;
  isSelected: boolean = false;
  isSelectable: boolean = false;
  isHinted: boolean = false;
  isRemoving: boolean = false;
  hintPulse: number = 0;
  pop: number = 0;
  targetPop: number = 0;
  removeProgress: number = 0;
  crackOpacity: number = 0;

  startX: number = 0;
  startY: number = 0;

  popVelocity: number = 0;
  scaleVelocity: number = 0;

  constructor(tile: BoardTile, x: number, y: number) {
    this.id = tile.id;
    this.tile = tile;
    this.x = x;
    this.y = y;
    this.z = tile.z;
    this.targetX = x;
    this.targetY = y;
  }

  startRemove(targetX: number, targetY: number) {
    this.isRemoving = true;
    this.startX = this.x;
    this.startY = this.y;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  update(dt: number) {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    if (this.isRemoving) {
      this.removeProgress += dt * 1.0; // 1.0s duration (slowed down from 0.66s)

      if (this.removeProgress < 0.35) {
        // Phase 1: Fly to center
        const t = this.removeProgress / 0.35;
        // Cubic ease in for a "smash" effect
        const easeT = t * t * t;
        this.x = lerp(this.startX, this.targetX, easeT);
        this.y = lerp(this.startY, this.targetY, easeT);
        this.scale = lerp(this.scale, 1.1, dt * 5);
        this.crackOpacity = 0;
      } else if (this.removeProgress < 0.65) {
        // Phase 2: Impact bounce and show crack (0.3s duration)
        const bounceT = (this.removeProgress - 0.35) / 0.3;
        // Sharp recoil, slower return
        const bounceAmount = Math.sin(bounceT * Math.PI) * 12;
        const dx = this.startX - this.targetX;
        const dy = this.startY - this.targetY;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        this.x = this.targetX + (dx/dist) * bounceAmount;
        this.y = this.targetY + (dy/dist) * bounceAmount;

        // Fade in crack quickly, hold it
        this.crackOpacity = Math.min(1, (this.removeProgress - 0.35) * 15);
        this.scale = 1.1;
      } else {
        // Phase 3: Fall and fade
        this.crackOpacity = 1; // Keep crack visible while falling
        this.y += dt * 400; // Fall down
        this.scale = lerp(this.scale, 0.8, dt * 10);
        this.opacity = lerp(this.opacity, 0, dt * 10);
      }
    } else {
      const speed = 15 * dt;
      this.x = lerp(this.x, this.targetX, speed);
      this.y = lerp(this.y, this.targetY, speed);
      this.opacity = lerp(this.opacity, this.targetOpacity, speed);

      // Spring physics for pop
      const popForce = (this.targetPop - this.pop) * 300;
      this.popVelocity += popForce * dt;
      this.popVelocity *= Math.pow(0.001, dt); // Damping
      this.pop += this.popVelocity * dt;

      // Spring physics for scale
      const scaleForce = (this.targetScale - this.scale) * 300;
      this.scaleVelocity += scaleForce * dt;
      this.scaleVelocity *= Math.pow(0.001, dt);
      this.scale += this.scaleVelocity * dt;
    }

    if (this.isHinted) {
      this.hintPulse += dt * 3;
    } else {
      this.hintPulse = 0;
    }
  }
}

class ScoreText {
  x: number;
  y: number;
  score: number;
  life: number = 1;
  scale: number = 0.5;
  opacity: number = 0;

  constructor(x: number, y: number, score: number) {
    this.x = x;
    this.y = y;
    this.score = score;
  }

  update(dt: number) {
    this.life -= dt * 0.8; // 1.25s duration
    this.y -= dt * 80;

    if (this.life > 0.85) {
      // Fade in and scale up
      const t = (1 - this.life) / 0.15;
      this.opacity = t;
      this.scale = 0.5 + 0.7 * t;
    } else if (this.life > 0.2) {
      // Hold
      this.opacity = 1;
      this.scale = 1.2 - 0.2 * ((0.85 - this.life) / 0.65);
    } else {
      // Fade out
      this.opacity = this.life / 0.2;
      this.scale = 1;
    }
  }
}

export const ZenCanvas = ({ stage, tiles, selectableTiles, selectedTileId, hintedTiles, onTileClick }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTilesRef = useRef<Map<string, RenderTile>>(new Map());
  const particlesRef = useRef<Particle[]>([]);
  const scoresRef = useRef<ScoreText[]>([]);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Calculate board bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  stage.positions.forEach(pos => {
    const x = pos.x * (TILE_W / 2);
    const y = pos.y * (TILE_H / 2) - pos.z * TILE_DEPTH;
    if (x < minX) minX = x;
    if (x + TILE_W > maxX) maxX = x + TILE_W;
    if (y < minY) minY = y;
    if (y + TILE_H > maxY) maxY = y + TILE_H;
  });

  // Calculate solid bounds (including 10px 3D extrusion)
  const solidMinX = minX;
  const solidMaxX = maxX + 10;
  const solidMinY = minY;
  const solidMaxY = maxY + 10;

  // Shadows extend further right and down.
  // To keep the board visually centered, we symmetrically pad all sides.
  // Shadow extends ~20px beyond extrusion on the right, and ~25px beyond extrusion on the bottom.
  const visualMinX = solidMinX - 20;
  const visualMaxX = solidMaxX + 20;
  const visualMinY = solidMinY - 25;
  const visualMaxY = solidMaxY + 25;

  const boardWidth = visualMaxX - visualMinX;
  const boardHeight = visualMaxY - visualMinY;
  const centerX = visualMinX + boardWidth / 2;
  const centerY = visualMinY + boardHeight / 2;

  // Handle resize and scaling
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) return;

      // Set canvas internal resolution to match display size for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = containerWidth * dpr;
      canvasRef.current.height = containerHeight * dpr;

      const padding = window.innerWidth < 768 ? 8 : 24;
      const scaleX = (containerWidth - padding * 2) / boardWidth;
      const scaleY = (containerHeight - padding * 2) / boardHeight;

      const calculatedScale = Math.min(scaleX, scaleY, 4); // Max scale 4
      setScale(calculatedScale);

      const newOffset = {
        x: containerWidth / 2 - centerX * calculatedScale,
        y: containerHeight / 2 - centerY * calculatedScale
      };
      setOffset(newOffset);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [boardWidth, boardHeight, centerX, centerY]);

  const prevTilesLength = useRef(tiles.length);

  // Sync React state to RenderTiles
  useEffect(() => {
    const currentMap = renderTilesRef.current;
    const newIds = new Set(tiles.map(t => t.id));

    if (tiles.length < prevTilesLength.current) {
      const score = stage.pointsPerMatch;
      // Wait for the tiles to fly to center (0.35s) before showing score
      setTimeout(() => {
        scoresRef.current.push(new ScoreText(centerX, centerY, score));
      }, 350);
    }
    prevTilesLength.current = tiles.length;

    // Add new or update existing
    tiles.forEach(tile => {
      const targetX = tile.x * (TILE_W / 2);
      const targetY = tile.y * (TILE_H / 2) - tile.z * TILE_DEPTH;

      let rt = currentMap.get(tile.id);
      if (!rt) {
        rt = new RenderTile(tile, targetX, targetY);
        currentMap.set(tile.id, rt);
      }

      if (!rt.isRemoving) {
        rt.targetX = targetX;
        rt.targetY = targetY;
        rt.z = tile.z;
        rt.isSelectable = selectableTiles.some(t => t.id === tile.id);
        rt.isSelected = selectedTileId === tile.id;
        rt.isHinted = hintedTiles?.includes(tile.id) ?? false;

        if (rt.isSelected) {
          rt.targetPop = 12;
          rt.targetScale = 1.05;
        } else {
          rt.targetPop = 0;
          rt.targetScale = 1;
        }
      }
    });

    // Mark removed tiles for animation
    const removedTiles = (Array.from(currentMap.values()) as RenderTile[]).filter(rt => !newIds.has(rt.id) && !rt.isRemoving);
    if (removedTiles.length === 2) {
      // Sort by X to consistently put one on left, one on right
      removedTiles.sort((a, b) => a.x - b.x);
      const [leftTile, rightTile] = removedTiles;

      const meetX = centerX - TILE_W / 2;
      const meetY = centerY - TILE_H / 2;

      // Offset by half tile width so they collide side-by-side
      leftTile.startRemove(meetX - TILE_W * 0.4, meetY);
      rightTile.startRemove(meetX + TILE_W * 0.4, meetY);
      leftTile.z = 9999;
      rightTile.z = 9999;
    } else {
      removedTiles.forEach(rt => {
        rt.startRemove(centerX - TILE_W / 2, centerY - TILE_H / 2);
        rt.z = 9999;
      });
    }
  }, [tiles, selectableTiles, selectedTileId, hintedTiles, centerX, centerY]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create crack path once
    const crackPath1 = new Path2D("M48 0 L52 25 L40 45 L60 65 L45 85 L50 100 L55 100 L50 85 L65 65 L45 45 L57 25 L53 0 Z");
    const crackPath2 = new Path2D("M0 48 L25 52 L45 40 L65 60 L85 45 L100 50 L100 55 L85 50 L65 65 L45 45 L25 57 L0 53 Z");

    const render = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1); // Cap dt at 100ms
      lastTimeRef.current = time;

      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      // Sort tiles by logical coordinates (Z, then Y, then X) for correct isometric overlap
      const sortedTiles = (Array.from(renderTilesRef.current.values()) as RenderTile[]).sort((a, b) => {
        if (a.z !== b.z) return a.z - b.z;
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });

      // Update and Draw Tiles
      sortedTiles.forEach((rt: RenderTile) => {
        rt.update(dt);

        if (rt.isRemoving && rt.removeProgress >= 0.35 && rt.opacity > 0) {
          // Spawn particles exactly on impact
          if (rt.removeProgress - dt * 1.0 < 0.35) {
            // 1 Flash
            particlesRef.current.push(new Particle(rt.targetX + TILE_W/2, rt.targetY + TILE_H/2, 'flash'));
            // 4 Sparks
            for (let i = 0; i < 4; i++) {
              particlesRef.current.push(new Particle(rt.targetX + TILE_W/2, rt.targetY + TILE_H/2, 'spark'));
            }
            // 2 Dust particles
            for (let i = 0; i < 2; i++) {
              particlesRef.current.push(new Particle(rt.targetX + TILE_W/2, rt.targetY + TILE_H/2, 'dust'));
            }
          }
        }

        if (rt.opacity <= 0.01 && rt.isRemoving) {
          renderTilesRef.current.delete(rt.id);
          return;
        }

        // Draw Shadow
        const shadowCanvas = getTileShadow();
        ctx.save();
        ctx.translate(rt.x + TILE_W/2, rt.y + TILE_H/2);
        ctx.scale(rt.scale, rt.scale);
        ctx.translate(-TILE_W/2, -TILE_H/2);
        ctx.globalAlpha = rt.opacity * (1 - Math.min(rt.pop * 0.05, 0.5));
        ctx.drawImage(shadowCanvas, rt.pop * 0.3, rt.pop * 0.3);
        ctx.restore();

        // Draw Tile (Face + Extrusion)
        ctx.save();
        ctx.translate(rt.x + TILE_W/2 - rt.pop, rt.y + TILE_H/2 - rt.pop);
        ctx.scale(rt.scale, rt.scale);
        ctx.translate(-TILE_W/2, -TILE_H/2);
        ctx.globalAlpha = rt.opacity;

        const faceCanvas = getTileFace(rt.isSelectable, rt.isSelected, rt.isHinted);
        ctx.drawImage(faceCanvas, 0, 0);

        // Draw Symbol
        const symbolCanvas = getSymbolTexture(rt.tile.type);
        ctx.globalAlpha = rt.isSelectable ? rt.opacity : rt.opacity * 0.55;
        ctx.drawImage(symbolCanvas, 0, 0, TILE_W, TILE_H);

        // Draw Hint Pulse
        if (rt.isHinted) {
          ctx.globalAlpha = (Math.sin(rt.hintPulse) + 1) * 0.25 * rt.opacity;
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.roundRect(0, 0, TILE_W, TILE_H, 12);
          ctx.fill();
        }

        // Draw Crack Effect
        if (rt.crackOpacity > 0) {
          ctx.globalAlpha = rt.crackOpacity;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.roundRect(0, 0, TILE_W, TILE_H, 12);
          ctx.fill();

          ctx.save();
          // Scale crack path to fit tile
          ctx.scale(TILE_W / 100, TILE_H / 100);
          ctx.fillStyle = 'rgba(28, 25, 23, 0.7)'; // stone-900/70
          ctx.fill(crackPath1);
          ctx.fill(crackPath2);
          ctx.restore();
        }

        ctx.restore();
      });

      // Update and Draw Particles
      ctx.globalCompositeOperation = 'screen'; // Make sparks glow
      particlesRef.current = particlesRef.current.filter(p => {
        p.update(dt);
        if (p.life <= 0) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const lifeRatio = Math.max(0, p.life / p.maxLife);

        if (p.type === 'flash') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size / 2);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${lifeRatio})`);
          gradient.addColorStop(0.4, `rgba(110, 231, 183, ${lifeRatio * 0.8})`); // emerald-300
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)'); // emerald-500
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'spark') {
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const stretch = Math.max(1, speed / 60);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = lifeRatio;

          ctx.beginPath();
          // Draw a stretched pill shape
          ctx.ellipse(0, 0, (p.size * stretch) / 2, p.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = lifeRatio * 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });
      ctx.globalCompositeOperation = 'source-over'; // Reset

      // Update and Draw Scores
      scoresRef.current = scoresRef.current.filter(s => {
        s.update(dt);
        if (s.life <= 0) return false;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(s.scale, s.scale);
        ctx.globalAlpha = s.opacity;

        ctx.font = '900 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Stroke
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.strokeText(`+${s.score}`, 0, 0);

        // Fill
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#10b981'; // emerald-500
        ctx.fillText(`+${s.score}`, 0, 0);

        ctx.restore();
        return true;
      });

      ctx.restore();
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [scale, offset]);

  // Handle Clicks
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse coordinates to board space
    const boardX = (mouseX - offset.x) / scale;
    const boardY = (mouseY - offset.y) / scale;

    // Find clicked tile (iterate in reverse to hit top-most tiles first)
    const sortedTiles = (Array.from(renderTilesRef.current.values()) as RenderTile[]).sort((a, b) => {
      if (a.z !== b.z) return a.z - b.z;
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    for (let i = sortedTiles.length - 1; i >= 0; i--) {
      const rt: RenderTile = sortedTiles[i];
      if (rt.isRemoving) continue;

      const hitX = rt.x - rt.pop;
      const hitY = rt.y - rt.pop;

      // Allow clicking the face and the extrusion (+10px)
      if (boardX >= hitX && boardX <= hitX + TILE_W + 10 &&
          boardY >= hitY && boardY <= hitY + TILE_H + 10) {

        if (rt.isSelectable) {
          onTileClick(rt.tile);
        }
        break; // Only click the top-most tile
      }
    }
  };

  return (
      <div ref={containerRef} className="mahjong-board-container">
        <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        />
      </div>
  );
};
