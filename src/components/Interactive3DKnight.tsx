import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RotateCcw, FlipHorizontal, Sparkles } from 'lucide-react';

interface Interactive3DKnightProps {
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
  normal?: Point3D;
  color?: string;
  isEye?: boolean;
  isMane?: boolean;
  isNostril?: boolean;
  isMouth?: boolean;
}

export const Interactive3DKnight: React.FC<Interactive3DKnightProps> = ({
  className = '',
  isDark = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true); // Default true: facing left toward hero text
  const [autoRotate, setAutoRotate] = useState(true);

  // Rotation angles: initial view displays the proud Staunton knight profile tilted slightly toward viewer
  const rotRef = useRef({
    x: 0.12, // Slight downward tilt to see base & top of head
    y: 0.35, // 3/4 front-quarter angle
    vx: 0,
    vy: 0.007, // Auto-rotate drift
  });

  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0.12,
    rotY: 0.35,
  });

  const idleTimerRef = useRef<any>(null);

  // Build the complete 3D Staunton Knight mesh
  const meshData = useMemo(() => {
    const polygons: Polygon3D[] = [];

    // Helper to calculate face normal
    const calcNormal = (p1: Point3D, p2: Point3D, p3: Point3D): Point3D => {
      const ax = p2.x - p1.x;
      const ay = p2.y - p1.y;
      const az = p2.z - p1.z;
      const bx = p3.x - p1.x;
      const by = p3.y - p1.y;
      const bz = p3.z - p1.z;
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      return { x: nx / len, y: ny / len, z: nz / len };
    };

    // -------------------------------------------------------------
    // 1. Turned Pedestal Base (Revolved Lathe Solids with 28 Segments)
    // -------------------------------------------------------------
    const baseProfile = [
      { y: -2.35, r: 1.08 }, // Felt base bottom
      { y: -2.25, r: 1.06 }, // Lower ring step
      { y: -2.08, r: 0.96 }, // Deep concave flare
      { y: -1.82, r: 0.74 }, // Narrow waist
      { y: -1.66, r: 0.83 }, // Prominent carved torus bead (Staunton characteristic)
      { y: -1.50, r: 0.80 }, // Upper torus contour
      { y: -1.36, r: 0.64 }, // Neck groove
      { y: -1.24, r: 0.69 }, // Upper collar ring
      { y: -1.16, r: 0.62 }, // Flat deck junction where the horse sits
    ];

    const radialSegments = 28;
    const baseRings: Point3D[][] = [];

    baseProfile.forEach((pt) => {
      const ring: Point3D[] = [];
      for (let s = 0; s < radialSegments; s++) {
        const theta = (s / radialSegments) * Math.PI * 2;
        ring.push({
          x: pt.r * Math.cos(theta),
          y: pt.y,
          z: pt.r * Math.sin(theta),
        });
      }
      baseRings.push(ring);
    });

    for (let r = 0; r < baseRings.length - 1; r++) {
      const ringA = baseRings[r];
      const ringB = baseRings[r + 1];
      for (let s = 0; s < radialSegments; s++) {
        const nextS = (s + 1) % radialSegments;
        const p1 = ringA[s];
        const p2 = ringA[nextS];
        const p3 = ringB[nextS];
        const p4 = ringB[s];
        polygons.push({
          points: [p1, p2, p3, p4],
          normal: calcNormal(p1, p2, p3),
        });
      }
    }

    // Bottom felt disc
    const bottomPts: Point3D[] = [];
    for (let s = 0; s < radialSegments; s++) {
      bottomPts.push(baseRings[0][s]);
    }
    polygons.push({
      points: bottomPts,
      normal: { x: 0, y: -1, z: 0 },
    });

    // -------------------------------------------------------------
    // 2. Sculpted Horse Neck, Chest, Jaw & Head (Lofted Spline Ribs)
    // -------------------------------------------------------------
    // In mirror format:
    // Front (chest, nose, chin) faces towards -X
    // Back (mane crest) faces towards +X
    const bodySlices = [
      // y, xCenter, xFront, xBack, halfWidthZ, label
      { y: -1.16, cx: -0.02, xf: -0.56, xb: 0.54, wz: 0.40 }, // Base connection
      { y: -0.92, cx: -0.10, xf: -0.76, xb: 0.62, wz: 0.44 }, // Chest beginning swell
      { y: -0.66, cx: -0.16, xf: -0.98, xb: 0.68, wz: 0.46 }, // Max chest protrusion / breast
      { y: -0.40, cx: -0.14, xf: -0.92, xb: 0.66, wz: 0.43 }, // Lower neck taper
      { y: -0.14, cx: -0.08, xf: -0.74, xb: 0.58, wz: 0.38 }, // Mid neck arch
      { y: +0.12, cx: -0.02, xf: -0.58, xb: 0.46, wz: 0.34 }, // Throat entrance
      { y: +0.38, cx: +0.02, xf: -0.52, xb: 0.30, wz: 0.32 }, // Sub-mandibular jaw
      { y: +0.62, cx: -0.08, xf: -0.78, xb: 0.14, wz: 0.36 }, // Bulging cheek muscle
      { y: +0.86, cx: -0.22, xf: -0.96, xb: -0.06, wz: 0.32 }, // Eye & brow level
      { y: +1.08, cx: -0.32, xf: -1.12, xb: -0.22, wz: 0.24 }, // Upper snout / forelock
    ];

    const perimeterSteps = 16;
    const bodyRings: Point3D[][] = [];

    bodySlices.forEach((slice) => {
      const ring: Point3D[] = [];
      const frontDist = Math.abs(slice.xf - slice.cx);
      const backDist = Math.abs(slice.xb - slice.cx);

      for (let i = 0; i < perimeterSteps; i++) {
        const angle = (i / perimeterSteps) * Math.PI * 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // Asymmetric oval: front half has chest/snout depth, back half has mane depth
        const radiusX = cosA < 0 ? frontDist : backDist;
        const px = slice.cx + cosA * radiusX;
        const pz = sinA * slice.wz;

        ring.push({ x: px, y: slice.y, z: pz });
      }
      bodyRings.push(ring);
    });

    for (let r = 0; r < bodyRings.length - 1; r++) {
      const ringA = bodyRings[r];
      const ringB = bodyRings[r + 1];
      for (let s = 0; s < perimeterSteps; s++) {
        const nextS = (s + 1) % perimeterSteps;
        const p1 = ringA[s];
        const p2 = ringA[nextS];
        const p3 = ringB[nextS];
        const p4 = ringB[s];
        polygons.push({
          points: [p1, p2, p3, p4],
          normal: calcNormal(p1, p2, p3),
        });
      }
    }

    // -------------------------------------------------------------
    // 3. Muzzle & Snout Details (Forward Protrusion, Chin & Parted Mouth)
    // -------------------------------------------------------------
    const muzzleTip: Point3D = { x: -1.24, y: 0.42, z: 0 };
    const muzzleTop: Point3D = { x: -1.20, y: 0.54, z: 0 };
    const chinTip: Point3D = { x: -1.16, y: 0.34, z: 0 };
    const mouthSeamL: Point3D = { x: -0.92, y: 0.38, z: -0.14 };
    const mouthSeamR: Point3D = { x: -0.92, y: 0.38, z: +0.14 };

    // Snout upper facet
    polygons.push({
      points: [muzzleTop, { x: -1.14, y: 0.72, z: -0.16 }, { x: -1.14, y: 0.72, z: 0.16 }],
      normal: calcNormal(muzzleTop, { x: -1.14, y: 0.72, z: -0.16 }, { x: -1.14, y: 0.72, z: 0.16 }),
    });

    // Muzzle front face
    polygons.push({
      points: [
        muzzleTop,
        { x: -1.22, y: 0.48, z: -0.11 },
        muzzleTip,
        { x: -1.22, y: 0.48, z: 0.11 },
      ],
      normal: { x: -0.95, y: 0.1, z: 0 },
    });

    // Lower jaw & parted mouth seam line
    polygons.push({
      points: [muzzleTip, mouthSeamL, chinTip],
      normal: { x: -0.7, y: -0.7, z: -0.2 },
      isMouth: true,
    });
    polygons.push({
      points: [muzzleTip, chinTip, mouthSeamR],
      normal: { x: -0.7, y: -0.7, z: 0.2 },
      isMouth: true,
    });

    // Nostril Hollows (Left & Right carved cavities)
    const nostrilL: Point3D[] = [
      { x: -1.10, y: 0.48, z: -0.13 },
      { x: -1.14, y: 0.45, z: -0.11 },
      { x: -1.08, y: 0.42, z: -0.12 },
    ];
    const nostrilR: Point3D[] = [
      { x: -1.10, y: 0.48, z: 0.13 },
      { x: -1.08, y: 0.42, z: 0.12 },
      { x: -1.14, y: 0.45, z: 0.11 },
    ];
    polygons.push({
      points: nostrilL,
      normal: { x: -0.6, y: 0.1, z: -0.8 },
      isNostril: true,
    });
    polygons.push({
      points: nostrilR,
      normal: { x: -0.6, y: 0.1, z: 0.8 },
      isNostril: true,
    });

    // -------------------------------------------------------------
    // 4. Carved Almond Eyes & Eyebrow Arches
    // -------------------------------------------------------------
    // Left eye socket
    const eyeSocketL: Point3D[] = [
      { x: -0.76, y: 0.88, z: -0.29 },
      { x: -0.68, y: 0.93, z: -0.31 },
      { x: -0.60, y: 0.88, z: -0.28 },
      { x: -0.68, y: 0.83, z: -0.27 },
    ];
    // Right eye socket
    const eyeSocketR: Point3D[] = [
      { x: -0.76, y: 0.88, z: 0.29 },
      { x: -0.68, y: 0.83, z: 0.27 },
      { x: -0.60, y: 0.88, z: 0.28 },
      { x: -0.68, y: 0.93, z: 0.31 },
    ];
    polygons.push({
      points: eyeSocketL,
      normal: { x: -0.5, y: 0.2, z: -0.85 },
      isEye: true,
    });
    polygons.push({
      points: eyeSocketR,
      normal: { x: -0.5, y: 0.2, z: 0.85 },
      isEye: true,
    });

    // Eyebrow ridge overlays
    polygons.push({
      points: [
        { x: -0.78, y: 0.94, z: -0.28 },
        { x: -0.67, y: 0.99, z: -0.30 },
        { x: -0.58, y: 0.93, z: -0.26 },
      ],
      normal: { x: -0.4, y: 0.7, z: -0.5 },
    });
    polygons.push({
      points: [
        { x: -0.78, y: 0.94, z: 0.28 },
        { x: -0.58, y: 0.93, z: 0.26 },
        { x: -0.67, y: 0.99, z: 0.30 },
      ],
      normal: { x: -0.4, y: 0.7, z: 0.5 },
    });

    // -------------------------------------------------------------
    // 5. Pointed Staunton Equine Ears (Upright with Hollow Cavities)
    // -------------------------------------------------------------
    // Left Ear
    const earTipL: Point3D = { x: -0.34, y: 1.62, z: -0.20 };
    const earBaseFrontL: Point3D = { x: -0.44, y: 1.12, z: -0.16 };
    const earBaseBackL: Point3D = { x: -0.22, y: 1.10, z: -0.14 };
    const earInnerL: Point3D = { x: -0.34, y: 1.25, z: -0.22 };

    polygons.push({
      points: [earTipL, earBaseFrontL, earInnerL],
      normal: calcNormal(earTipL, earBaseFrontL, earInnerL),
    });
    polygons.push({
      points: [earTipL, earInnerL, earBaseBackL],
      normal: calcNormal(earTipL, earInnerL, earBaseBackL),
    });
    polygons.push({
      points: [earTipL, earBaseBackL, earBaseFrontL],
      normal: { x: 0.2, y: 0.3, z: -0.9 }, // outer convex shell
    });

    // Right Ear
    const earTipR: Point3D = { x: -0.34, y: 1.62, z: 0.20 };
    const earBaseFrontR: Point3D = { x: -0.44, y: 1.12, z: 0.16 };
    const earBaseBackR: Point3D = { x: -0.22, y: 1.10, z: 0.14 };
    const earInnerR: Point3D = { x: -0.34, y: 1.25, z: 0.22 };

    polygons.push({
      points: [earTipR, earInnerR, earBaseFrontR],
      normal: calcNormal(earTipR, earInnerR, earBaseFrontR),
    });
    polygons.push({
      points: [earTipR, earBaseBackR, earInnerR],
      normal: calcNormal(earTipR, earBaseBackR, earInnerR),
    });
    polygons.push({
      points: [earTipR, earBaseFrontR, earBaseBackR],
      normal: { x: 0.2, y: 0.3, z: 0.9 }, // outer convex shell
    });

    // Forelock tuft between ears
    polygons.push({
      points: [
        { x: -0.42, y: 1.15, z: 0 },
        earBaseFrontL,
        { x: -0.48, y: 1.28, z: 0 },
        earBaseFrontR,
      ],
      normal: { x: -0.6, y: 0.8, z: 0 },
    });

    // -------------------------------------------------------------
    // 6. Distinct Carved Mane Along Neck (8 Grooved Tuft Segments)
    // -------------------------------------------------------------
    const maneTufts = [
      { yTop: 1.10, yBot: 0.85, xOut: 0.08, zW: 0.16 }, // Top tuft behind ears
      { yTop: 0.85, yBot: 0.60, xOut: 0.28, zW: 0.18 },
      { yTop: 0.60, yBot: 0.35, xOut: 0.44, zW: 0.20 },
      { yTop: 0.35, yBot: 0.10, xOut: 0.58, zW: 0.22 },
      { yTop: 0.10, yBot: -0.15, xOut: 0.70, zW: 0.24 }, // Max arch tuft
      { yTop: -0.15, yBot: -0.40, xOut: 0.76, zW: 0.24 },
      { yTop: -0.40, yBot: -0.68, xOut: 0.74, zW: 0.22 },
      { yTop: -0.68, yBot: -1.05, xOut: 0.64, zW: 0.18 }, // Base tuft
    ];

    maneTufts.forEach((tuft) => {
      const pTopC: Point3D = { x: tuft.xOut, y: tuft.yTop, z: 0 };
      const pBotC: Point3D = { x: tuft.xOut + 0.04, y: tuft.yBot, z: 0 };
      const pTopL: Point3D = { x: tuft.xOut - 0.10, y: tuft.yTop, z: -tuft.zW };
      const pBotL: Point3D = { x: tuft.xOut - 0.06, y: tuft.yBot, z: -tuft.zW };
      const pTopR: Point3D = { x: tuft.xOut - 0.10, y: tuft.yTop, z: tuft.zW };
      const pBotR: Point3D = { x: tuft.xOut - 0.06, y: tuft.yBot, z: tuft.zW };

      // Left flank of tuft
      polygons.push({
        points: [pTopC, pTopL, pBotL, pBotC],
        normal: calcNormal(pTopC, pTopL, pBotL),
        isMane: true,
      });
      // Right flank of tuft
      polygons.push({
        points: [pTopC, pBotC, pBotR, pTopR],
        normal: calcNormal(pTopC, pBotC, pBotR),
        isMane: true,
      });
      // Crest ridge
      polygons.push({
        points: [
          pTopC,
          { x: tuft.xOut + 0.06, y: (tuft.yTop + tuft.yBot) / 2, z: 0 },
          pBotC,
        ],
        normal: { x: 0.95, y: -0.2, z: 0 },
        isMane: true,
      });
    });

    return polygons;
  }, []);

  // -------------------------------------------------------------
  // Render Loop with Camera Orbit, Perspective & Realistic Wood Shading
  // -------------------------------------------------------------
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Auto rotation drift when idle
      if (autoRotate && !isDragging) {
        rotRef.current.y += rotRef.current.vy;
        // Subtle floating breathing sine wave
        rotRef.current.x = 0.12 + Math.sin(Date.now() * 0.0016) * 0.035;
      }

      const rotX = rotRef.current.x;
      const rotY = rotRef.current.y;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 430;
      const centerX = width / 2;
      const centerY = height / 2 + 20;

      // Lighting directions
      // Studio Key Light (Top-Front-Left)
      const keyLight = { x: -0.65, y: 0.72, z: 0.65 };
      const keyLen = Math.hypot(keyLight.x, keyLight.y, keyLight.z);
      const klx = keyLight.x / keyLen;
      const kly = keyLight.y / keyLen;
      const klz = keyLight.z / keyLen;

      // Rim / Accent Light (Emerald green reflection from behind-right)
      const rimLight = { x: 0.55, y: 0.35, z: -0.85 };
      const rimLen = Math.hypot(rimLight.x, rimLight.y, rimLight.z);
      const rlx = rimLight.x / rimLen;
      const rly = rimLight.y / rimLen;
      const rlz = rimLight.z / rimLen;

      // ---------------------------------------------------------
      // THEME COLOR PALETTE:
      // Dark Theme -> WHITE PIECE (Warm Ivory / Boxwood / Bone)
      // Light Theme -> BLACK PIECE (Dark Walnut / Ebony / Dark Chocolate)
      // ---------------------------------------------------------
      const isWhitePiece = isDark; // per user instruction: dark theme uses white piece, light theme uses black piece

      // Base wood tones
      const baseR = isWhitePiece ? 245 : 34;
      const baseG = isWhitePiece ? 238 : 26;
      const baseB = isWhitePiece ? 224 : 22;

      // Dark shadow tone
      const shadowR = isWhitePiece ? 180 : 12;
      const shadowG = isWhitePiece ? 168 : 8;
      const shadowB = isWhitePiece ? 148 : 6;

      // Ground Ambient Shadow
      const shadowScaleY = 0.28;
      const shadowRadius = 145;
      const groundShadowGrad = ctx.createRadialGradient(
        centerX,
        centerY + 165,
        15,
        centerX,
        centerY + 165,
        shadowRadius
      );
      groundShadowGrad.addColorStop(
        0,
        isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.32)'
      );
      groundShadowGrad.addColorStop(0.6, isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.12)');
      groundShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.scale(1, shadowScaleY);
      ctx.fillStyle = groundShadowGrad;
      ctx.beginPath();
      ctx.arc(centerX, (centerY + 165) / shadowScaleY, shadowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Transform polygons
      // If mirrored is false, flip X coordinates so the piece faces right like the photo
      const mirrorMultiplier = isMirrored ? 1 : -1;

      interface TransformedPoly {
        points: { px: number; py: number; z: number }[];
        avgZ: number;
        normalZ: number;
        color: string;
        isMane?: boolean;
        isEye?: boolean;
      }

      const transformed: TransformedPoly[] = [];

      meshData.forEach((poly) => {
        const transPts = poly.points.map((p) => {
          const rawX = p.x * mirrorMultiplier;
          const rawY = p.y;
          const rawZ = p.z;

          // Rotate Y
          const x1 = rawX * cosY + rawZ * sinY;
          const z1 = -rawX * sinY + rawZ * cosY;

          // Rotate X
          const y2 = rawY * cosX - z1 * sinX;
          const z2 = rawY * sinX + z1 * cosX;

          // Perspective Projection
          const camDist = 5.6 - z2;
          const px = centerX + (x1 * fov) / camDist;
          const projY = centerY - (y2 * fov) / camDist;

          return { px, py: projY, z: z2 };
        });

        // Average Z for painter's depth sorting
        const avgZ = transPts.reduce((acc, pt) => acc + pt.z, 0) / transPts.length;

        // 2D Normal calculation for culling
        const vA = {
          x: transPts[1].px - transPts[0].px,
          y: transPts[1].py - transPts[0].py,
        };
        const vB = {
          x: transPts[2].px - transPts[0].px,
          y: transPts[2].py - transPts[0].py,
        };
        const normalZ = vA.x * vB.y - vA.y * vB.x;

        // 3D Normal lighting
        let norm = poly.normal || { x: 0, y: 1, z: 0 };
        const nx0 = norm.x * mirrorMultiplier;
        const ny0 = norm.y;
        const nz0 = norm.z;

        // Rotate normal Y
        const nx1 = nx0 * cosY + nz0 * sinY;
        const nz1 = -nx0 * sinY + nz0 * cosY;

        // Rotate normal X
        const ny2 = ny0 * cosX - nz1 * sinX;
        const nz2 = ny0 * sinX + nz1 * cosX;

        // Key light dot product
        const dotKey = Math.max(0, nx1 * klx + ny2 * kly + nz2 * klz);
        // Rim light dot product (emerald accent)
        const dotRim = Math.max(0, nx1 * rlx + ny2 * rly + nz2 * rlz);

        // Specular highlight: Blinn-Phong half-angle
        const hx = (klx + 0) / 2;
        const hy = (kly + 0) / 2;
        const hz = (klz + 1) / 2;
        const hLen = Math.hypot(hx, hy, hz) || 1;
        const specDot = Math.max(0, (nx1 * hx + ny2 * hy + nz2 * hz) / hLen);
        const spec = Math.pow(specDot, isWhitePiece ? 18 : 28);

        // Ambient lighting
        const ambient = isWhitePiece ? 0.38 : 0.22;
        const diffuse = dotKey * 0.65;
        const totalLight = Math.min(1.25, ambient + diffuse);

        // Calculate face color with wood fiber gradient
        let r = Math.round(shadowR + (baseR - shadowR) * totalLight + spec * (isWhitePiece ? 120 : 180));
        let g = Math.round(shadowG + (baseG - shadowG) * totalLight + spec * (isWhitePiece ? 115 : 150));
        let b = Math.round(shadowB + (baseB - shadowB) * totalLight + spec * (isWhitePiece ? 100 : 120));

        // Emerald Chess.com rim reflection
        if (dotRim > 0.35) {
          const rimFactor = (dotRim - 0.35) * 1.5;
          r = Math.round(r * (1 - rimFactor * 0.2) + rimFactor * 129 * 0.3);
          g = Math.round(g * (1 - rimFactor * 0.1) + rimFactor * 182 * 0.45);
          b = Math.round(b * (1 - rimFactor * 0.2) + rimFactor * 76 * 0.25);
        }

        // Feature-specific coloring
        if (poly.isEye) {
          if (isWhitePiece) {
            r = Math.max(20, r - 90);
            g = Math.max(18, g - 85);
            b = Math.max(15, b - 80);
          } else {
            r = 12;
            g = 9;
            b = 7;
          }
        } else if (poly.isNostril || poly.isMouth) {
          r = Math.round(r * 0.45);
          g = Math.round(g * 0.42);
          b = Math.round(b * 0.40);
        } else if (poly.isMane) {
          // Slight contrast tone for the braided mane
          r = isWhitePiece ? Math.round(r * 0.94) : Math.round(r * 1.15 + 10);
          g = isWhitePiece ? Math.round(g * 0.92) : Math.round(g * 1.12 + 8);
          b = isWhitePiece ? Math.round(b * 0.90) : Math.round(b * 1.08 + 6);
        }

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        transformed.push({
          points: transPts,
          avgZ,
          normalZ,
          color: `rgb(${r}, ${g}, ${b})`,
          isMane: poly.isMane,
          isEye: poly.isEye,
        });
      });

      // Painter's algorithm: sort back-to-front
      transformed.sort((a, b) => a.avgZ - b.avgZ);

      // Rasterize polygons
      transformed.forEach((poly) => {
        if (poly.points.length < 3) return;

        // Back-face culling for solid body
        if (poly.normalZ < 0 && !poly.isEye && !poly.isMane) return;

        ctx.beginPath();
        ctx.moveTo(poly.points[0].px, poly.points[0].py);
        for (let i = 1; i < poly.points.length; i++) {
          ctx.lineTo(poly.points[i].px, poly.points[i].py);
        }
        ctx.closePath();

        ctx.fillStyle = poly.color;
        ctx.fill();

        // Subtle satin edge smoothing / carved wood contour definition
        ctx.strokeStyle = isWhitePiece
          ? 'rgba(120, 100, 80, 0.12)'
          : 'rgba(255, 230, 200, 0.08)';
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Eye specular gleam
        if (poly.isEye) {
          const eyeCenterX = poly.points.reduce((s, p) => s + p.px, 0) / poly.points.length;
          const eyeCenterY = poly.points.reduce((s, p) => s + p.py, 0) / poly.points.length;
          ctx.beginPath();
          ctx.arc(eyeCenterX - 1.2, eyeCenterY - 1, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = isWhitePiece ? '#ffffff' : '#e6be8a';
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [meshData, isDark, isMirrored, autoRotate, isDragging]);

  // -------------------------------------------------------------
  // Pointer Drag Handlers (360° Mouse & Touch Orbit)
  // -------------------------------------------------------------
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

    rotRef.current.y = dragStartRef.current.rotY + dx * 0.014;
    rotRef.current.x = Math.max(-0.45, Math.min(0.45, dragStartRef.current.rotX + dy * 0.012));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Resume floating orbit after 3 seconds of inactivity
    idleTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 3000);
  };

  // Click spin surge
  const handleClick = () => {
    rotRef.current.vy = 0.038;
    setTimeout(() => {
      rotRef.current.vy = 0.007;
    }, 700);
  };

  // Reset to default mirrored hero pose
  const handleResetPose = (e: React.MouseEvent) => {
    e.stopPropagation();
    rotRef.current = { x: 0.12, y: 0.35, vx: 0, vy: 0.007 };
    setAutoRotate(true);
  };

  // Toggle mirror orientation
  const handleToggleMirror = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMirrored((prev) => !prev);
  };

  const pieceName = isDark ? 'White Knight' : 'Black Knight';
  const pieceMaterial = isDark ? 'Polished Ivory / Boxwood' : 'Staunton Carved Ebony Walnut';

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center group ${className}`}
      style={{ width: 380, height: 460 }}
    >
      {/* 3D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        width={380}
        height={460}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
      />

      {/* Floating Control Pill (Minimalist, No Labels) */}
      <div
        className="absolute bottom-2 flex items-center gap-1.5 p-1 rounded-full border shadow-md backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Quick Flip Button */}
        <button
          onClick={handleToggleMirror}
          className="p-1.5 rounded-full hover:bg-[#81b64c]/20 hover:text-[#81b64c] transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Mirror orientation"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetPose}
          className="p-1.5 rounded-full hover:bg-[#81b64c]/20 hover:text-[#81b64c] transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Reset orientation"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

