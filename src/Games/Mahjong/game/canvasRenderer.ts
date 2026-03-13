import type { TileType } from '../types';

export const TILE_W = 84;
export const TILE_H = 84;
export const TILE_DEPTH = 4;

const textureCache = new Map<string, HTMLCanvasElement>();

// Pre-render noise texture
function createNoiseTexture(opacity: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(200, 200);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255 * opacity;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
createNoiseTexture(0.15);
const noiseFace = createNoiseTexture(0.03);

export function getTileShadow(): HTMLCanvasElement {
  const key = 'shadow';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  // Add padding for shadows
  canvas.width = TILE_W + 40;
  canvas.height = TILE_H + 40;
  const ctx = canvas.getContext('2d')!;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 10;

  ctx.beginPath();
  ctx.roundRect(10, 10, TILE_W, TILE_H, 12);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();

  textureCache.set(key, canvas);
  return canvas;
}

export function getTileFace(isSelectable: boolean, isSelected: boolean, isHinted: boolean): HTMLCanvasElement {
  const key = `face-${isSelectable}-${isSelected}-${isHinted}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  // Add padding for 3D extrusion and shadows
  canvas.width = TILE_W + 20;
  canvas.height = TILE_H + 20;
  const ctx = canvas.getContext('2d')!;

  // 3D Extrusion (the layers of shadow)
  const drawExtrusion = (dx: number, dy: number, color: string) => {
    ctx.beginPath();
    ctx.roundRect(dx, dy, TILE_W, TILE_H, 12);
    ctx.fillStyle = color;
    ctx.fill();
  };

  // 10 layers of extrusion (Bamboo bottom, Ivory top)
  for (let i = 10; i >= 1; i--) {
    let color = '';
    if (isSelectable) {
      if (i > 5) {
        // Bamboo layers
        const greens = ['#064e3b', '#065f46', '#047857', '#059669', '#10b981'];
        color = greens[10 - i];
      } else {
        // Ivory layers
        const ivory = ['#a8a29e', '#d6d3d1', '#e7e5e4', '#f5f5f4', '#fafaf9'];
        color = ivory[5 - i];
      }
    } else {
      if (i > 5) {
        const darkGreens = ['#022c22', '#064e3b', '#065f46', '#047857', '#059669'];
        color = darkGreens[10 - i];
      } else {
        const darkIvory = ['#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4', '#f5f5f4'];
        color = darkIvory[5 - i];
      }
    }

    // Selected tint
    if (isSelected && i <= 5) {
      const selectedIvory = ['#d6d3d1', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'];
      color = selectedIvory[5 - i];
    }

    drawExtrusion(i, i, color);
  }

  // Main Face
  ctx.beginPath();
  ctx.roundRect(0, 0, TILE_W, TILE_H, 12);

  if (isHinted) {
    ctx.fillStyle = '#ecfdf5';
  } else if (isSelected) {
    ctx.fillStyle = '#fef3c7'; // amber-100
  } else if (isSelectable) {
    ctx.fillStyle = '#ffffff'; // pure white for active
  } else {
    ctx.fillStyle = '#d6d3d1'; // stone-300 for inactive (distinctly grey)
  }
  ctx.fill();

  // Face Gradient
  const grad = ctx.createLinearGradient(0, 0, TILE_W, TILE_H);
  if (isSelectable) {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.05)');
  } else {
    grad.addColorStop(0, 'rgba(0,0,0,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0.25)');
  }
  ctx.fillStyle = grad;
  ctx.fill();

  // Noise
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(noiseFace, 0, 0, TILE_W, TILE_H);
  ctx.globalCompositeOperation = 'source-over';

  // Inner Shadow / Highlights
  ctx.beginPath();
  ctx.roundRect(0, 0, TILE_W, TILE_H, 12);
  ctx.lineWidth = 2;
  ctx.strokeStyle = isSelectable ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)';
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(1, 1, TILE_W-2, TILE_H-2, 11);
  ctx.lineWidth = 2;
  ctx.strokeStyle = isSelectable ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)';
  ctx.stroke();

  // Border
  ctx.beginPath();
  ctx.roundRect(0, 0, TILE_W, TILE_H, 12);
  ctx.lineWidth = 1.5;
  if (isHinted) {
    ctx.strokeStyle = '#34d399';
  } else if (isSelected) {
    ctx.strokeStyle = '#fbbf24';
  } else if (isSelectable) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  } else {
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  }
  ctx.stroke();

  textureCache.set(key, canvas);
  return canvas;
}

export function getSymbolTexture(type: TileType): HTMLCanvasElement {
  const key = `${type.suit}-${type.value}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  // Use higher resolution for crisp rendering
  canvas.width = TILE_W * 2;
  canvas.height = TILE_H * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  // Default text settings
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = TILE_W / 2;
  const cy = TILE_H / 2;

  if (type.suit === 'circles') {
    drawCircles(ctx, type.value, cx, cy);
  } else if (type.suit === 'bamboos') {
    if (type.value === 1) {
      ctx.font = '48px sans-serif';
      ctx.fillText('🦚', cx, cy);
    } else {
      drawBamboos(ctx, type.value, cx, cy);
    }
  } else if (type.suit === 'characters') {
    const chars = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    ctx.font = 'bold 22px serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(chars[type.value - 1], cx, cy - 18);
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('萬', cx, cy + 12);
  } else if (type.suit === 'winds') {
    const winds = ['東', '南', '西', '北'];
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(winds[type.value - 1], cx, cy);
  } else if (type.suit === 'dragons') {
    ctx.font = 'bold 44px serif';
    if (type.value === 1) {
      ctx.fillStyle = '#dc2626';
      ctx.fillText('中', cx, cy);
    } else if (type.value === 2) {
      ctx.fillStyle = '#16a34a';
      ctx.fillText('發', cx, cy);
    } else if (type.value === 3) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 5;
      ctx.strokeRect(cx - 18, cy - 24, 36, 48);
    }
  } else if (type.suit === 'flowers') {
    const flowers = ['🌸', '🌺', '🌻', '🌹'];
    ctx.font = '44px sans-serif';
    ctx.fillText(flowers[type.value - 1], cx, cy);
  } else if (type.suit === 'seasons') {
    const seasons = ['🌱', '☀️', '🍂', '❄️'];
    ctx.font = '44px sans-serif';
    ctx.fillText(seasons[type.value - 1], cx, cy);
  }

  textureCache.set(key, canvas);
  return canvas;
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r: number = 9) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();
}

function drawCircles(ctx: CanvasRenderingContext2D, value: number, cx: number, cy: number) {
  const red = '#ef4444';
  const blue = '#3b82f6';
  const green = '#22c55e';

  const draw = (x: number, y: number, color: string, r?: number) => drawCircle(ctx, cx + x, cy + y, color, r);

  switch (value) {
    case 1:
      draw(0, 0, red, 28);
      draw(0, 0, 'white', 10);
      break;
    case 2:
      draw(0, -14, green); draw(0, 14, blue);
      break;
    case 3:
      draw(-18, -18, blue); draw(0, 0, red); draw(18, 18, green);
      break;
    case 4:
      draw(-14, -14, blue); draw(14, -14, green);
      draw(-14, 14, green); draw(14, 14, blue);
      break;
    case 5:
      draw(-18, -18, blue); draw(18, -18, green);
      draw(0, 0, red);
      draw(-18, 18, green); draw(18, 18, blue);
      break;
    case 6:
      draw(-14, -20, green); draw(14, -20, green);
      draw(-14, 0, red); draw(14, 0, red);
      draw(-14, 20, red); draw(14, 20, red);
      break;
    case 7:
      draw(-16, -22, green); draw(0, -12, green); draw(16, -2, green);
      draw(-14, 14, red); draw(14, 14, red);
      draw(-14, 28, red); draw(14, 28, red);
      break;
    case 8:
      for (let i = 0; i < 4; i++) {
        draw(-14, -27 + i * 18, blue);
        draw(14, -27 + i * 18, blue);
      }
      break;
    case 9:
      for (let i = 0; i < 3; i++) {
        draw(-18, -18 + i * 18, green);
        draw(0, -18 + i * 18, red);
        draw(18, -18 + i * 18, blue);
      }
      break;
  }
}

function drawBamboo(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - 5, y - 14, 10, 28, 3);
  ctx.fill();
}

function drawBamboos(ctx: CanvasRenderingContext2D, value: number, cx: number, cy: number) {
  const green = '#16a34a';
  const blue = '#2563eb';
  const red = '#dc2626';

  const draw = (x: number, y: number, color: string) => drawBamboo(ctx, cx + x, cy + y, color);

  switch (value) {
    case 2:
      draw(0, -16, blue); draw(0, 16, green);
      break;
    case 3:
      draw(0, -16, blue); draw(-12, 16, green); draw(12, 16, green);
      break;
    case 4:
      draw(-12, -16, blue); draw(12, -16, green);
      draw(-12, 16, green); draw(12, 16, blue);
      break;
    case 5:
      draw(-16, -16, green); draw(16, -16, blue);
      draw(0, 0, red);
      draw(-16, 16, blue); draw(16, 16, green);
      break;
    case 6:
      for (let i = 0; i < 3; i++) {
        draw(-16 + i * 16, -16, green);
        draw(-16 + i * 16, 16, green);
      }
      break;
    case 7:
      draw(0, -22, red);
      for (let i = 0; i < 3; i++) {
        draw(-16 + i * 16, 2, green);
        draw(-16 + i * 16, 24, green);
      }
      break;
    case 8:
      for (let i = 0; i < 4; i++) {
        draw(-24 + i * 16, -16, green);
        draw(-24 + i * 16, 16, blue);
      }
      break;
    case 9:
      for (let i = 0; i < 3; i++) {
        draw(-16 + i * 16, -22, red);
        draw(-16 + i * 16, 0, blue);
        draw(-16 + i * 16, 22, green);
      }
      break;
  }
}
