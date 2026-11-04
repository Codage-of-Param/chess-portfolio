import { useEffect, useRef } from 'react';

const CHESS_PIECES = ['♟', '♞', '♝', '♜', '♛', '♚'];
const PARTICLE_COUNT_MIN = 20;
const PARTICLE_COUNT_MAX = 30;
const COLOR = '#7fa650';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  driftAmplitude: number;
  driftFrequency: number;
  phase: number;
  char: string;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 10 + Math.random() * 14,
    opacity: 0.03 + Math.random() * 0.05,
    speedY: -(0.15 + Math.random() * 0.35),
    driftAmplitude: 10 + Math.random() * 30,
    driftFrequency: 0.0003 + Math.random() * 0.0008,
    phase: Math.random() * Math.PI * 2,
    char: CHESS_PIECES[Math.floor(Math.random() * CHESS_PIECES.length)],
  };
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    const count =
      PARTICLE_COUNT_MIN +
      Math.floor(Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN + 1));

    const particles: Particle[] = Array.from({ length: count }, () =>
      createParticle(width, height),
    );

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        /* update position */
        p.y += p.speedY;
        const driftX = Math.sin(time * p.driftFrequency + p.phase) * p.driftAmplitude;

        /* wrap around edges */
        if (p.y + p.size < 0) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }

        const drawX = ((p.x + driftX) % (width + p.size * 2) + width + p.size * 2) % (width + p.size * 2) - p.size;

        /* draw */
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = COLOR;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, drawX, p.y);
        ctx.restore();
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
