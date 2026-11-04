import React, { useRef, useEffect, useState } from 'react';

interface Interactive3DKingProps {
  className?: string;
  isDark?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Polygon3D {
  points: Point3D[];
  color: string;
  normalZ?: number;
  avgZ?: number;
}

export const Interactive3DKing: React.FC<Interactive3DKingProps> = ({
  className = '',
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationY, setRotationY] = useState(0.2);
  const [rotationX, setRotationX] = useState(0.12);
  const [autoRotate, setAutoRotate] = useState(true);

  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0.12,
    rotY: 0.2,
  });

  const rotRef = useRef({ x: 0.12, y: 0.2, vx: 0, vy: 0.008 });
  const idleTimerRef = useRef<any>(null);

  // Generate 3D King Geometry (Blender-style Lathe Profile + Maltese Cross)
  const generateKingPolygons = (
    rotX: number,
    rotY: number,
    width: number,
    height: number,
    darkTheme: boolean
  ): { render: () => void } => {
    // 2D Lathe profile points (radius, yHeight) - King silhouette
    // Origin at base center, y goes upward
    const profile = [
      { r: 0.95, y: -2.2 }, // Base bottom
      { r: 0.92, y: -2.0 },
      { r: 0.82, y: -1.8 },
      { r: 0.70, y: -1.5 },
      { r: 0.52, y: -1.1 },
      { r: 0.38, y: -0.6 },
      { r: 0.34, y: 0.0 },  // Waist
      { r: 0.38, y: 0.5 },
      { r: 0.50, y: 0.9 },  // Collar
      { r: 0.44, y: 1.05 },
      { r: 0.58, y: 1.35 }, // Crown base
      { r: 0.68, y: 1.65 }, // Crown rim
      { r: 0.54, y: 1.78 }, // Inside cup
      { r: 0.18, y: 1.88 }, // Finial knob
    ];

    const segments = 24; // Radial segments
    const rings: Point3D[][] = [];

    // Create 3D rings by rotating profile around Y axis
    profile.forEach((pt) => {
      const ring: Point3D[] = [];
      for (let s = 0; s < segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        ring.push({
          x: pt.r * Math.cos(theta),
          y: pt.y,
          z: pt.r * Math.sin(theta),
        });
      }
      rings.push(ring);
    });

    const polygons: Polygon3D[] = [];

    // Base tone palette
    const baseR = darkTheme ? 28 : 240;
    const baseG = darkTheme ? 30 : 238;
    const baseB = darkTheme ? 26 : 228;

    // Connect rings into quads/triangles
    for (let r = 0; r < rings.length - 1; r++) {
      const ringA = rings[r];
      const ringB = rings[r + 1];

      for (let s = 0; s < segments; s++) {
        const nextS = (s + 1) % segments;
        const p1 = ringA[s];
        const p2 = ringA[nextS];
        const p3 = ringB[nextS];
        const p4 = ringB[s];

        polygons.push({
          points: [p1, p2, p3, p4],
          color: '', // computed during rotation/lighting
        });
      }
    }

    // Add Maltese Cross atop King finial
    const crossThickness = 0.08;
    const crossHeight = 0.55;
    const crossWidth = 0.38;
    const crossBaseY = 1.88;

    // Vertical crossbar
    const vCross = [
      { x: -crossThickness, y: crossBaseY, z: 0 },
      { x: crossThickness, y: crossBaseY, z: 0 },
      { x: crossThickness, y: crossBaseY + crossHeight, z: 0 },
      { x: -crossThickness, y: crossBaseY + crossHeight, z: 0 },
    ];
    // Horizontal crossbar
    const hCross = [
      { x: -crossWidth, y: crossBaseY + crossHeight * 0.55, z: 0 },
      { x: crossWidth, y: crossBaseY + crossHeight * 0.55, z: 0 },
      { x: crossWidth, y: crossBaseY + crossHeight * 0.75, z: 0 },
      { x: -crossWidth, y: crossBaseY + crossHeight * 0.75, z: 0 },
    ];

    polygons.push({ points: vCross, color: '#81b64c' });
    polygons.push({ points: hCross, color: '#81b64c' });

    // Rotation & Projection Function
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const fov = 400; // perspective distance
    const scale = Math.min(width, height) * 0.18;
    const centerX = width / 2;
    const centerY = height / 2 + 15;

    // Light direction (Top-Right-Front)
    const lightDir = { x: 0.55, y: 0.65, z: 0.52 };
    const lightLen = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
    const lx = lightDir.x / lightLen;
    const ly = lightDir.y / lightLen;
    const lz = lightDir.z / lightLen;

    return {
      render: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Ground shadow
        const shadowScaleY = 0.25;
        const shadowGrad = ctx.createRadialGradient(
          centerX,
          centerY + scale * 2.2,
          10,
          centerX,
          centerY + scale * 2.2,
          scale * 1.4
        );
        shadowGrad.addColorStop(0, darkTheme ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.save();
        ctx.scale(1, shadowScaleY);
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(centerX, (centerY + scale * 2.2) / shadowScaleY, scale * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Transform all polygons and compute Z-depth
        const transformedPolys = polygons.map((poly) => {
          const transformedPts = poly.points.map((p) => {
            // Rotate Y
            const x1 = p.x * cosY + p.z * sinY;
            const z1 = -p.x * sinY + p.z * cosY;

            // Rotate X
            const y2 = p.y * cosX - z1 * sinX;
            const z2 = p.y * sinX + z1 * cosX;

            // Perspective Projection
            const dist = 5.5 - z2;
            const projX = centerX + (x1 * fov) / dist;
            const projY = centerY - (y2 * fov) / dist;

            return { px: projX, py: projY, z: z2 };
          });

          // Compute average Z for depth sorting
          const avgZ = transformedPts.reduce((acc, pt) => acc + pt.z, 0) / transformedPts.length;

          // Surface normal calculation
          const vA = {
            x: transformedPts[1].px - transformedPts[0].px,
            y: transformedPts[1].py - transformedPts[0].py,
          };
          const vB = {
            x: transformedPts[2].px - transformedPts[0].px,
            y: transformedPts[2].py - transformedPts[0].py,
          };
          // 2D cross product for back-face culling
          const normalZ = vA.x * vB.y - vA.y * vB.x;

          // Lighting shading calculation
          let color = poly.color;
          if (!color) {
            // Diffuse shading with specular sheen
            const nx = poly.points[0].x;
            const nz = poly.points[0].z;
            const len = Math.sqrt(nx * nx + nz * nz) || 1;
            const unx = (nx / len) * cosY + (nz / len) * sinY;
            const unz = -(nx / len) * sinY + (nz / len) * cosY;
            const uny = 0.2;

            const dot = Math.max(0, unx * lx + uny * ly + unz * lz);
            const ambient = darkTheme ? 0.2 : 0.45;
            const diffuse = dot * 0.7;
            const brightness = Math.min(1.2, ambient + diffuse);

            // Subtle green rim light reflection
            const rim = Math.pow(1 - Math.abs(unz), 3) * 0.35;

            const r = Math.min(255, Math.round(baseR * brightness + rim * 129));
            const g = Math.min(255, Math.round(baseG * brightness + rim * 182));
            const b = Math.min(255, Math.round(baseB * brightness + rim * 76));

            color = `rgb(${r}, ${g}, ${b})`;
          }

          return {
            points: transformedPts,
            avgZ,
            normalZ,
            color,
          };
        });

        // Depth sort back to front (Painter's algorithm)
        transformedPolys.sort((a, b) => a.avgZ - b.avgZ);

        // Draw polygons
        transformedPolys.forEach((poly) => {
          if (poly.points.length < 3) return;
          // Back-face culling (only draw facing forward or cross)
          if (poly.normalZ < 0 && poly.color.startsWith('rgb')) return;

          ctx.beginPath();
          ctx.moveTo(poly.points[0].px, poly.points[0].py);
          for (let i = 1; i < poly.points.length; i++) {
            ctx.lineTo(poly.points[i].px, poly.points[i].py);
          }
          ctx.closePath();

          ctx.fillStyle = poly.color;
          ctx.fill();

          ctx.strokeStyle = darkTheme ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

        // Glowing center emerald gem on the cross
        const gemY = centerY - ((crossBaseY + crossHeight * 0.65) * fov) / 5.5;
        const gemRad = 4.5;
        ctx.beginPath();
        ctx.arc(centerX, gemY, gemRad, 0, Math.PI * 2);
        ctx.fillStyle = '#81b64c';
        ctx.shadowColor = '#81b64c';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      },
    };
  };

  // Animation Loop with Inertia & Orbit
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        if (autoRotate && !isDragging) {
          rotRef.current.y += rotRef.current.vy;
          // Gentle floating sine motion
          rotRef.current.x = 0.12 + Math.sin(Date.now() * 0.0018) * 0.04;
        }

        const engine = generateKingPolygons(
          rotRef.current.x,
          rotRef.current.y,
          canvas.width,
          canvas.height,
          isDark
        );
        engine.render();
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isDark, autoRotate, isDragging]);

  // Pointer Drag Handlers (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotRef.current.x,
      rotY: rotRef.current.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    rotRef.current.y = dragStartRef.current.rotY + dx * 0.015;
    rotRef.current.x = Math.max(-0.4, Math.min(0.4, dragStartRef.current.rotX + dy * 0.012));
    setRotationY(rotRef.current.y);
    setRotationX(rotRef.current.x);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Resume auto-rotation after 3.5s of inactivity
    idleTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 3500);
  };

  // Click spin surge effect
  const handleClick = () => {
    rotRef.current.vy = 0.045;
    setTimeout(() => {
      rotRef.current.vy = 0.008;
    }, 800);
  };

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center group ${className}`}
      style={{ width: 360, height: 440 }}
    >
      {/* 3D WebGL / Canvas Container */}
      <canvas
        ref={canvasRef}
        width={360}
        height={440}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
        title="Interactive 3D King: Click & Drag to Rotate 360°"
      />

      {/* Floating 3D Control Pill */}
      <div
        className="absolute bottom-2 flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold shadow-xs pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
        <span>3D King • Drag to Rotate 360°</span>
      </div>
    </div>
  );
};
