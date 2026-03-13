import { useEffect, useRef } from 'react';

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    interface SeaweedStrand {
      x: number;
      baseHeight: number;
      segments: number;
      color: string;
      phase: number;
      swaySpeed: number;
      swayAmount: number;
      thickness: number;
    }

    let seaweeds: SeaweedStrand[] = [];

    const generateSeaweeds = (width: number, height: number) => {
      seaweeds = [];
      const numSeaweeds = Math.floor(width / 60); // One seaweed cluster every ~60px
      for (let i = 0; i < numSeaweeds; i++) {
        // Group them in small clusters
        const clusterX = Math.random() * width;
        const strandsInCluster = 1 + Math.floor(Math.random() * 3);

        for (let j = 0; j < strandsInCluster; j++) {
          seaweeds.push({
            x: clusterX + (Math.random() * 40 - 20),
            baseHeight: height * 0.15 + Math.random() * height * 0.35, // 15% to 50% of screen height
            segments: 12 + Math.floor(Math.random() * 8),
            color: `rgba(${10 + Math.random() * 30}, ${80 + Math.random() * 60}, ${40 + Math.random() * 40}, 0.7)`,
            phase: Math.random() * Math.PI * 2,
            swaySpeed: 0.8 + Math.random() * 1.2,
            swayAmount: 20 + Math.random() * 30,
            thickness: 4 + Math.random() * 5
          });
        }
      }
    };

    // Create an offscreen canvas for the sand texture to improve performance
    const sandCanvas = document.createElement('canvas');
    const sandCtx = sandCanvas.getContext('2d', { willReadFrequently: true });

    const generateSandTexture = (width: number, height: number) => {
      if (!sandCtx || width === 0 || height === 0) return;
      sandCanvas.width = width;
      sandCanvas.height = height;

      // Base sand gradient
      const sandGradient = sandCtx.createLinearGradient(0, 0, 0, height);
      sandGradient.addColorStop(0, '#9e855c'); // Darker wet sand
      sandGradient.addColorStop(1, '#d4c098'); // Lighter dry sand
      sandCtx.fillStyle = sandGradient;
      sandCtx.fillRect(0, 0, width, height);

      // Add noise for sand grains
      const imageData = sandCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 25; // Noise intensity
        data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
        // Alpha remains 255
      }
      sandCtx.putImageData(imageData, 0, 0);

      // Add some scattered small stones/shells
      for (let i = 0; i < (width * height) / 1500; i++) {
        sandCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(80,60,40,0.4)';
        sandCtx.beginPath();
        sandCtx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        sandCtx.fill();
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateSandTexture(canvas.width, canvas.height);
      generateSeaweeds(canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // 1. Draw Sand Background from offscreen canvas
      if (sandCanvas.width > 0 && sandCanvas.height > 0) {
        ctx.drawImage(sandCanvas, 0, 0);
      }

      // 1.5 Draw Seaweeds
      seaweeds.forEach(weed => {
        let currentX = weed.x;
        let currentY = canvas.height;
        const segmentHeight = weed.baseHeight / weed.segments;

        for (let i = 1; i <= weed.segments; i++) {
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);

          const heightFactor = i / weed.segments;
          // Complex sway: primary sway + secondary ripple
          const sway = Math.sin(time * weed.swaySpeed + weed.phase - heightFactor * 3) * weed.swayAmount * heightFactor
              + Math.cos(time * weed.swaySpeed * 2 + weed.phase) * 8 * heightFactor;

          const nextX = weed.x + sway;
          const nextY = canvas.height - (i * segmentHeight);

          const cpX = currentX + (nextX - currentX) / 2;
          const cpY = currentY - segmentHeight / 2;

          ctx.quadraticCurveTo(cpX, cpY, nextX, nextY);

          ctx.lineWidth = Math.max(0.5, weed.thickness * (1 - heightFactor * 0.8)); // Taper towards top
          ctx.lineCap = 'round';
          ctx.strokeStyle = weed.color;
          ctx.stroke();

          // Add small leaves occasionally
          if (i % 2 === 0 && i < weed.segments) {
            ctx.beginPath();
            ctx.moveTo(nextX, nextY);
            const leafDir = i % 4 === 0 ? 1 : -1;
            const leafSize = 8 + (weed.thickness * 1.5);
            const leafX = nextX + leafDir * leafSize;
            const leafY = nextY - leafSize * 0.5 + Math.sin(time * weed.swaySpeed * 1.5 + weed.phase + i) * 4;

            ctx.quadraticCurveTo(nextX + leafDir * (leafSize * 0.5), nextY + 2, leafX, leafY);
            ctx.lineWidth = Math.max(0.5, weed.thickness * 0.4 * (1 - heightFactor * 0.5));
            ctx.stroke();
          }

          currentX = nextX;
          currentY = nextY;
        }
      });

      // 2. Draw Water Waves (coming from the top)
      const drawWave = (
          yOffset: number,
          amplitude: number,
          frequency: number,
          speed: number,
          color: string,
          opacity: number,
          hasFoam: boolean = false
      ) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);

        // Calculate the wave path
        const points: {x: number, y: number}[] = [];
        const step = 10; // Smaller step for smoother curves
        for (let x = 0; x <= canvas.width + step; x += step) {
          // Complex noise by combining multiple sine waves
          const noise1 = Math.sin(x * frequency * 2.1 + time * speed * 1.3) * (amplitude * 0.3);
          const noise2 = Math.sin(x * frequency * 3.7 - time * speed * 0.8) * (amplitude * 0.15);
          const y = Math.sin(x * frequency + time * speed) * amplitude + noise1 + noise2;
          const finalY = yOffset + y;
          points.push({ x, y: finalY });
          ctx.lineTo(x, finalY);
        }

        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();

        // Fill water
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Draw foam at the edge
        if (hasFoam) {
          ctx.globalAlpha = opacity * 1.2; // Foam is slightly more opaque than the water

          // Draw bubbly foam using overlapping circles
          for (let i = 0; i < points.length - 1; i++) {
            const p = points[i];
            // Only draw foam bubbles occasionally to look organic
            if (i % 2 === 0) {
              const bubbleSize = 2 + Math.sin(i * 0.5 + time * 2) * 2.5;
              const bubbleOffset = Math.cos(i * 0.3 + time) * 4;

              ctx.beginPath();
              ctx.arc(p.x, p.y + bubbleOffset, Math.max(0.1, bubbleSize), 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
              ctx.fill();
            }
          }

          // Secondary foam wash (fading out behind the main edge)
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y - 15);
          for (let i = 1; i < points.length; i++) {
            const p = points[i];
            const washOffset = Math.sin(i * 0.2 + time * 1.5) * 8;
            ctx.lineTo(p.x, p.y - 15 + washOffset);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
      };

      // Deep water (top)
      drawWave(canvas.height * 0.1, 20, 0.001, 0.8, '#002b44', 0.95);
      // Mid-deep water
      drawWave(canvas.height * 0.25, 30, 0.0015, 1.0, '#004c6d', 0.85);
      // Mid water
      drawWave(canvas.height * 0.45, 45, 0.002, 1.2, '#007196', 0.75);
      // Shallow water
      drawWave(canvas.height * 0.65, 55, 0.0022, 1.4, '#0098c3', 0.6, true);
      // Very shallow water / foam wash
      drawWave(canvas.height * 0.85, 65, 0.0025, 1.6, '#48cae4', 0.4, true);

      // Add animated caustics (light reflections on the ocean floor)
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.15;
      for (let y = 0; y < canvas.height * 0.9; y += 50) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
          const causticY = y + Math.sin(x * 0.02 + time * 1.5 + y) * 15;
          if (x === 0) ctx.moveTo(x, causticY);
          else ctx.lineTo(x, causticY);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 + Math.sin(time * 2 + y) * 1.5;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      time += 0.012;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
      <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
  );
}
