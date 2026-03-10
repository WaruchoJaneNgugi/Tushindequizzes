import { useCallback, useEffect, useRef } from 'react';
import type { CellValue, Particle, Player, StarField } from '../types/game.types';

interface CanvasConfig {
  board: CellValue[];
  winningLine: number[] | null;
  currentPlayer: 'X' | 'O';
  isAIThinking: boolean;
  status: string;
  winner: Player | null;
  playerColor: string;
  aiColor: string;
  onCellClick: (index: number) => void;
}

const TAU = Math.PI * 2;

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useCanvas3D = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const configRef = useRef<CanvasConfig | null>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<StarField[]>([]);
  const cellScalesRef = useRef<number[]>(Array(9).fill(1));
  const cellOpacityRef = useRef<number[]>(Array(9).fill(0));
  const hoveredCellRef = useRef<number>(-1);
  const winAnimRef = useRef<number>(0);
  // Store CSS display dimensions (not DPR-scaled)
  const displayWRef = useRef<number>(800);
  const displayHRef = useRef<number>(600);

  // Board geometry using CSS display dimensions
  const getBoardParams = useCallback(() => {
    const W = displayWRef.current;
    const H = displayHRef.current;
    const size = Math.min(W, H) * 0.60;
    const cx = W / 2;
    const cy = H / 2;
    const cellSize = size / 3;
    return { size, cx, cy, cellSize, W, H };
  }, []);

  const getCellCenter = useCallback(
    (index: number): [number, number] => {
      const { size, cx, cy, cellSize } = getBoardParams();
      const row = Math.floor(index / 3);
      const col = index % 3;
      const half = size / 2;
      const lx = -half + col * cellSize + cellSize / 2;
      const ly = -half + row * cellSize + cellSize / 2;
      // Perspective skew
      const px = cx + lx + ly * 0.06;
      const py = cy + ly * 0.88 + Math.abs(lx) * 0.04 + 20;
      return [px, py];
    },
    [getBoardParams]
  );

  const getCellFromPoint = useCallback(
    (mx: number, my: number): number => {
      let closest = -1;
      let minDist = Infinity;
      const { cellSize } = getBoardParams();
      for (let i = 0; i < 9; i++) {
        const [cx2, cy2] = getCellCenter(i);
        const d = Math.hypot(mx - cx2, my - cy2);
        if (d < minDist) { minDist = d; closest = i; }
      }
      return minDist < cellSize * 0.52 ? closest : -1;
    },
    [getBoardParams, getCellCenter]
  );

  const spawnParticles = useCallback(
    (x: number, y: number, color: string, count = 20) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * TAU + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 1,
          maxLife: 1,
          color,
          size: 2 + Math.random() * 4,
          shape: Math.random() > 0.5 ? 'star' : 'circle',
        });
      }
    },
    []
  );

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * TAU) / 5 - Math.PI / 2;
      const ia = a + Math.PI / 5;
      i === 0 ? ctx.moveTo(Math.cos(a) * size, Math.sin(a) * size) : ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
      ctx.lineTo(Math.cos(ia) * size * 0.4, Math.sin(ia) * size * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawGlowLine = (
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number,
    color: string, width: number, blur: number
  ) => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const cfg = configRef.current;
    if (!canvas || !cfg) { animRef.current = requestAnimationFrame(draw); return; }

    const ctx = canvas.getContext('2d');
    if (!ctx) { animRef.current = requestAnimationFrame(draw); return; }

    // Use CSS display dimensions for all geometry
    const W = displayWRef.current;
    const H = displayHRef.current;
    const dpr = window.devicePixelRatio || 1;

    const dt = Math.min((timestamp - timeRef.current) / 1000, 0.05);
    timeRef.current = timestamp;
    const t = timestamp / 1000;

    // Scale once per frame for DPR — draw everything in CSS pixel space
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Background ──────────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
    bgGrad.addColorStop(0, '#0c0c20');
    bgGrad.addColorStop(0.5, '#070714');
    bgGrad.addColorStop(1, '#02020a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Starfield ────────────────────────────────────────────────────
    if (starsRef.current.length < 100) {
      for (let i = starsRef.current.length; i < 100; i++) {
        starsRef.current.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: Math.random() * 1.6,
          twinkle: Math.random() * TAU,
          speed: 0.3 + Math.random() * 0.8,
        });
      }
    }
    for (const star of starsRef.current) {
      star.twinkle += dt * star.speed;
      const alpha = 0.25 + Math.abs(Math.sin(star.twinkle)) * 0.75;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Board geometry ───────────────────────────────────────────────
    const { size, cx, cy, cellSize } = getBoardParams();
    const half = size / 2;
    const SKEW = 0.06;

    const project = (lx: number, ly: number): [number, number] => [
      cx + lx + ly * SKEW,
      cy + ly * (1 - 0.12) + Math.abs(lx) * 0.04 + 20,
    ];

    // Board ambient glow
    const [pr, pg, pb] = hexToRgb(cfg.playerColor);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.7);
    glow.addColorStop(0, `rgba(${pr},${pg},${pb},0.04)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, size * 0.65, size * 0.2, 0, 0, TAU);
    ctx.fill();

    // Board floating animation
    const floatY = Math.sin(t * 0.55) * 7;
    ctx.save();
    ctx.translate(0, floatY);

    // ── Grid lines ───────────────────────────────────────────────────
    const gridColor = 'rgba(80,110,255,0.85)';
    const gridGlow = 'rgba(80,110,255,0.3)';

    for (let i = 1; i < 3; i++) {
      const offset = -half + (i / 3) * size;
      // Vertical lines
      const [vx1, vy1] = project(offset, -half);
      const [vx2, vy2] = project(offset, half);
      drawGlowLine(ctx, vx1, vy1, vx2, vy2, gridColor, 2, 16);
      drawGlowLine(ctx, vx1, vy1, vx2, vy2, gridGlow, 1, 4);
      // Horizontal lines
      const [hx1, hy1] = project(-half, offset);
      const [hx2, hy2] = project(half, offset);
      drawGlowLine(ctx, hx1, hy1, hx2, hy2, gridColor, 2, 16);
      drawGlowLine(ctx, hx1, hy1, hx2, hy2, gridGlow, 1, 4);
    }

    // Border
    const corners = [
      project(-half, -half), project(half, -half),
      project(half, half),   project(-half, half),
    ];
    ctx.save();
    ctx.shadowColor = 'rgba(100,130,255,0.9)';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = 'rgba(100,130,255,0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(corners[0][0], corners[0][1]);
    corners.forEach(([cx2, cy2]) => ctx.lineTo(cx2, cy2));
    ctx.closePath();
    ctx.stroke();
    // 3D bottom edge
    ctx.strokeStyle = 'rgba(60,80,200,0.4)';
    ctx.shadowBlur = 6;
    ctx.lineWidth = 1.5;
    const depth = 10;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(corners[i][0], corners[i][1] + depth);
      ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.stroke();
    }
    // Bottom edge line
    ctx.beginPath();
    ctx.moveTo(corners[2][0], corners[2][1] + depth);
    ctx.lineTo(corners[3][0], corners[3][1] + depth);
    ctx.stroke();
    ctx.restore();

    // ── Cells ────────────────────────────────────────────────────────
    const hovered = hoveredCellRef.current;
    for (let idx = 0; idx < 9; idx++) {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const lx = -half + col * cellSize + cellSize / 2;
      const ly = -half + row * cellSize + cellSize / 2;
      const [px, py] = project(lx, ly);

      const cell = cfg.board[idx];
      const isWinCell = cfg.winningLine?.includes(idx) ?? false;
      const isHovered = hovered === idx && !cell && cfg.status === 'playing' && cfg.currentPlayer === 'X';

      if (isHovered) {
        const hs = cellSize * 0.44;
        ctx.save();
        ctx.globalAlpha = 0.1 + Math.sin(t * 4) * 0.04;
        ctx.fillStyle = cfg.playerColor;
        ctx.shadowColor = cfg.playerColor;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.roundRect(px - hs, py - hs, hs * 2, hs * 2, 8);
        ctx.fill();
        ctx.restore();
      }

      if (!cell) continue;

      cellOpacityRef.current[idx] = lerp(cellOpacityRef.current[idx], 1, 0.14);
      cellScalesRef.current[idx] = lerp(cellScalesRef.current[idx], 1, 0.1);
      const isX = cell === 'X';
      const color = isX ? cfg.playerColor : cfg.aiColor;
      const [r, g, b] = hexToRgb(color);
      const cs = cellSize * 0.32 * cellScalesRef.current[idx];
      const alpha = cellOpacityRef.current[idx];
      const glowIntensity = isWinCell ? 44 + Math.sin(t * 6) * 12 : 24;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = glowIntensity;

      if (isX) {
        ctx.lineWidth = cs * 0.3;
        ctx.lineCap = 'round';
        // 3D extrusion layers
        for (let layer = 3; layer >= 0; layer--) {
          ctx.globalAlpha = alpha * (layer === 0 ? 1 : 0.12);
          ctx.strokeStyle = layer === 0 ? color : `rgba(${r},${g},${b},0.4)`;
          ctx.shadowBlur = layer === 0 ? glowIntensity : 4;
          const yOff = layer * 1.5;
          ctx.beginPath();
          ctx.moveTo(px - cs, py - cs + yOff);
          ctx.lineTo(px + cs, py + cs + yOff);
          ctx.moveTo(px + cs, py - cs + yOff);
          ctx.lineTo(px - cs, py + cs + yOff);
          ctx.stroke();
        }
      } else {
        ctx.lineWidth = cs * 0.24;
        for (let layer = 3; layer >= 0; layer--) {
          ctx.globalAlpha = alpha * (layer === 0 ? 1 : 0.12);
          ctx.strokeStyle = layer === 0 ? color : `rgba(${r},${g},${b},0.4)`;
          ctx.shadowBlur = layer === 0 ? glowIntensity : 4;
          ctx.beginPath();
          ctx.arc(px, py + layer * 1.5, cs, 0, TAU);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // ── Winning line ─────────────────────────────────────────────────
    if (cfg.winningLine && cfg.status !== 'playing') {
      winAnimRef.current = Math.min(winAnimRef.current + dt * 2.2, 1);
      const [a2,, c2] = cfg.winningLine;
      const colA = a2 % 3; const rowA = Math.floor(a2 / 3);
      const colC = c2 % 3; const rowC = Math.floor(c2 / 3);
      const [lax, lay] = project(-half + colA * cellSize + cellSize / 2, -half + rowA * cellSize + cellSize / 2);
      const [lcx, lcy] = project(-half + colC * cellSize + cellSize / 2, -half + rowC * cellSize + cellSize / 2);
      const prog = winAnimRef.current;
      const wc = cfg.winner === 'X' ? cfg.playerColor : cfg.aiColor;
      ctx.save();
      ctx.shadowColor = wc;
      ctx.shadowBlur = 36;
      ctx.strokeStyle = wc;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(lax, lay);
      ctx.lineTo(lerp(lax, lcx, prog), lerp(lay, lcy, prog));
      ctx.stroke();
      ctx.restore();
    } else {
      winAnimRef.current = 0;
    }

    // ── AI thinking dots ─────────────────────────────────────────────
    if (cfg.isAIThinking) {
      const [ar2, ag2, ab2] = hexToRgb(cfg.aiColor);
      for (let i = 0; i < 3; i++) {
        const dotY = Math.sin((t * 3 + i * 0.4) * TAU) * 6;
        const dotX = cx + (i - 1) * 18;
        const topY = cy - half - 44 + dotY;
        ctx.save();
        ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin((t * 3 + i * 0.4) * Math.PI));
        ctx.fillStyle = `rgb(${ar2},${ag2},${ab2})`;
        ctx.shadowColor = cfg.aiColor;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(dotX, topY, 5, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore(); // floatY translate

    // ── Particles ────────────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= dt * 1.3;
      const a = Math.max(0, p.life / p.maxLife);
      const [pr2, pg2, pb2] = hexToRgb(p.color);
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${pr2},${pg2},${pb2})`;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      if (p.shape === 'star') drawStar(ctx, p.x, p.y, p.size);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    animRef.current = requestAnimationFrame(draw);
  }, [getBoardParams, spawnParticles]);

  // ── Public API ──────────────────────────────────────────────────────
  const updateConfig = useCallback((cfg: CanvasConfig) => {
    configRef.current = cfg;
  }, []);

  const triggerCellAnim = useCallback((index: number, color: string) => {
    cellScalesRef.current[index] = 1.7;
    cellOpacityRef.current[index] = 0;
    const [x, y] = getCellCenter(index);
    spawnParticles(x, y, color, 14);
  }, [getCellCenter, spawnParticles]);

  const triggerWinBurst = useCallback((line: number[], color: string) => {
    for (const idx of line) {
      const [x, y] = getCellCenter(idx);
      spawnParticles(x, y, color, 26);
    }
  }, [getCellCenter, spawnParticles]);

  const setHoveredCell = useCallback((index: number) => {
    hoveredCellRef.current = index;
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const cfg = configRef.current;
    if (!canvas || !cfg) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const idx = getCellFromPoint(mx, my);
    if (idx !== -1) cfg.onCellClick(idx);
  }, [getCellFromPoint]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hoveredCellRef.current = getCellFromPoint(mx, my);
  }, [getCellFromPoint]);

  const reset = useCallback(() => {
    cellScalesRef.current = Array(9).fill(1);
    cellOpacityRef.current = Array(9).fill(0);
    particlesRef.current = [];
    winAnimRef.current = 0;
    starsRef.current = [];
  }, []);

  const startAnimation = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    timeRef.current = performance.now();
    animRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const stopAnimation = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  // ── Setup resize observer ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;
      // Store CSS dimensions for geometry
      displayWRef.current = cssW;
      displayHRef.current = cssH;
      // Set buffer to DPR size
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      // Reset star positions to new dimensions
      starsRef.current = [];
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    updateSize();

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);

  return {
    updateConfig,
    triggerCellAnim,
    triggerWinBurst,
    setHoveredCell,
    handleCanvasClick,
    handleCanvasMouseMove,
    reset,
  };
};
