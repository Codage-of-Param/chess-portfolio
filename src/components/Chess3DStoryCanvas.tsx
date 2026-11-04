import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Chess3DStoryCanvasProps {
  currentChapter: number;
  isDark?: boolean;
}

export const Chess3DStoryCanvas: React.FC<Chess3DStoryCanvasProps> = ({
  currentChapter,
  isDark = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef(currentChapter);
  chapterRef.current = currentChapter;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 18, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(12, 28, 16);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 70;
    mainLight.shadow.camera.left = -16;
    mainLight.shadow.camera.right = 16;
    mainLight.shadow.camera.top = 16;
    mainLight.shadow.camera.bottom = -16;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const spotLight = new THREE.SpotLight(0x81b64c, 4, 40, Math.PI / 4, 0.4, 1);
    spotLight.position.set(0, 22, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rimLight = new THREE.PointLight(0x60a5fa, 1.8, 30);
    rimLight.position.set(-14, 8, -14);
    scene.add(rimLight);

    // --- 3. 3D Chessboard Construction ---
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    // Frame
    const frameGeo = new THREE.BoxGeometry(17.6, 0.8, 17.6);
    const frameMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0x334155,
      roughness: 0.25,
      metalness: 0.4,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = -0.4;
    frame.receiveShadow = true;
    boardGroup.add(frame);

    // Border bevel trim
    const trimGeo = new THREE.BoxGeometry(16.6, 0.86, 16.6);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x81b64c,
      roughness: 0.3,
      metalness: 0.6,
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.y = -0.38;
    boardGroup.add(trim);

    // 64 Tiles
    const tileSize = 1.95;
    const tileGeo = new THREE.BoxGeometry(tileSize * 0.96, 0.2, tileSize * 0.96);
    const whiteTileMat = new THREE.MeshStandardMaterial({
      color: 0xeceecc,
      roughness: 0.3,
      metalness: 0.05,
    });
    const greenTileMat = new THREE.MeshStandardMaterial({
      color: 0x739552,
      roughness: 0.35,
      metalness: 0.05,
    });

    const tiles: THREE.Mesh[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isWhite = (r + c) % 2 === 0;
        const tile = new THREE.Mesh(tileGeo, isWhite ? whiteTileMat : greenTileMat);
        tile.position.set((c - 3.5) * tileSize, 0.1, (r - 3.5) * tileSize);
        tile.receiveShadow = true;
        boardGroup.add(tile);
        tiles.push(tile);
      }
    }

    // --- 4. Procedural 3D Piece Generators ---
    const whitePieceMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.1,
    });
    const blackPieceMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.2,
    });
    const goldPieceMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.85,
    });

    // Helper: Create King
    const createKingMesh = (mat: THREE.Material): THREE.Group => {
      const king = new THREE.Group();
      // Base
      const basePts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.75, 0),
        new THREE.Vector2(0.72, 0.2),
        new THREE.Vector2(0.65, 0.4),
        new THREE.Vector2(0.45, 0.7),
        new THREE.Vector2(0.35, 1.4),
        new THREE.Vector2(0.42, 2.0),
        new THREE.Vector2(0.55, 2.3),
        new THREE.Vector2(0.35, 2.5),
        new THREE.Vector2(0.5, 2.8),
        new THREE.Vector2(0, 2.85),
      ];
      const bodyGeo = new THREE.LatheGeometry(basePts, 24);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      king.add(body);

      // Cross on top
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), mat);
      crossV.position.y = 3.05;
      crossV.castShadow = true;
      king.add(crossV);

      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.12), mat);
      crossH.position.y = 3.12;
      crossH.castShadow = true;
      king.add(crossH);

      return king;
    };

    // Helper: Create Knight (Procedural Staunton horse)
    const createKnightMesh = (mat: THREE.Material): THREE.Group => {
      const knight = new THREE.Group();

      // Base lathe
      const basePts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.7, 0),
        new THREE.Vector2(0.68, 0.25),
        new THREE.Vector2(0.55, 0.5),
        new THREE.Vector2(0.42, 0.85),
        new THREE.Vector2(0, 0.85),
      ];
      const baseGeo = new THREE.LatheGeometry(basePts, 20);
      const base = new THREE.Mesh(baseGeo, mat);
      base.castShadow = true;
      knight.add(base);

      // Head & Neck
      const neckGeo = new THREE.CylinderGeometry(0.32, 0.45, 1.3, 16);
      neckGeo.rotateZ(0.25);
      const neck = new THREE.Mesh(neckGeo, mat);
      neck.position.set(-0.15, 1.4, 0);
      neck.castShadow = true;
      knight.add(neck);

      // Snout / Head
      const headGeo = new THREE.CylinderGeometry(0.22, 0.36, 0.95, 16);
      headGeo.rotateZ(-0.9);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.set(-0.45, 1.85, 0);
      head.castShadow = true;
      knight.add(head);

      // Ears
      const earGeo = new THREE.ConeGeometry(0.1, 0.35, 8);
      const ear1 = new THREE.Mesh(earGeo, mat);
      ear1.position.set(-0.15, 2.25, 0.14);
      ear1.rotation.z = -0.3;
      ear1.castShadow = true;
      knight.add(ear1);

      const ear2 = ear1.clone();
      ear2.position.z = -0.14;
      knight.add(ear2);

      // Mane Ridge
      const maneGeo = new THREE.BoxGeometry(0.12, 1.2, 0.2);
      maneGeo.rotateZ(0.35);
      const mane = new THREE.Mesh(maneGeo, mat);
      mane.position.set(0.12, 1.6, 0);
      mane.castShadow = true;
      knight.add(mane);

      return knight;
    };

    // Helper: Create Pawn
    const createPawnMesh = (mat: THREE.Material): THREE.Group => {
      const pawn = new THREE.Group();
      const pts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.48, 0.2),
        new THREE.Vector2(0.35, 0.4),
        new THREE.Vector2(0.25, 0.9),
        new THREE.Vector2(0.3, 1.1),
        new THREE.Vector2(0, 1.1),
      ];
      const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), mat);
      body.castShadow = true;
      pawn.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), mat);
      head.position.y = 1.35;
      head.castShadow = true;
      pawn.add(head);

      return pawn;
    };

    // --- 5. Piece Instances and Scene Arrangement ---
    const piecesGroup = new THREE.Group();
    scene.add(piecesGroup);

    // Hero White Knight (Primary Story Actor)
    const heroKnight = createKnightMesh(whitePieceMat);
    heroKnight.position.set(tileSize, 0.2, tileSize * 2); // on f3
    heroKnight.rotation.y = -Math.PI / 2.5;
    piecesGroup.add(heroKnight);

    // Hero White King
    const heroKing = createKingMesh(whitePieceMat);
    heroKing.position.set(0, 0.2, tileSize * 3); // on e1
    piecesGroup.add(heroKing);

    // Hero Golden King for Act 4 & 5
    const goldKing = createKingMesh(goldPieceMat);
    goldKing.position.set(0, 0.2, 0);
    goldKing.visible = false;
    piecesGroup.add(goldKing);

    // Enemy Black King
    const enemyKing = createKingMesh(blackPieceMat);
    enemyKing.position.set(0, 0.2, -tileSize * 3); // on e8
    piecesGroup.add(enemyKing);

    // Enemy Black Queen
    const enemyQueen = createKingMesh(blackPieceMat);
    enemyQueen.position.set(-tileSize, 0.2, -tileSize * 3); // on d8
    piecesGroup.add(enemyQueen);

    // Key Pawns
    const pawnE4 = createPawnMesh(whitePieceMat);
    pawnE4.position.set(0, 0.2, -tileSize * 0.5); // e4
    piecesGroup.add(pawnE4);

    const pawnE5 = createPawnMesh(blackPieceMat);
    pawnE5.position.set(0, 0.2, -tileSize * 1.5); // e5
    piecesGroup.add(pawnE5);

    const pawnD4 = createPawnMesh(whitePieceMat);
    pawnD4.position.set(-tileSize, 0.2, -tileSize * 0.5); // d4
    piecesGroup.add(pawnD4);

    // --- 6. Tactical Laser Beams (Chapter 2) ---
    const laserGroup = new THREE.Group();
    scene.add(laserGroup);

    const createLaserBeam = (p1: THREE.Vector3, p2: THREE.Vector3, color: number) => {
      const distance = p1.distanceTo(p2);
      const cylGeo = new THREE.CylinderGeometry(0.04, 0.04, distance, 8);
      const cylMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
      const cyl = new THREE.Mesh(cylGeo, cylMat);

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      cyl.position.copy(mid);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      return cyl;
    };

    // --- 7. Atmospheric 3D Particles ---
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 35;
      particlePos[i + 1] = Math.random() * 20;
      particlePos[i + 2] = (Math.random() - 0.5) * 35;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x81b64c,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 8. Mouse Interactive Orbit & Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX;
      dragStartY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.004;
        dragStartX = clientX;
        dragStartY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- 9. Animation Loop with Camera Director ---
    let reqId: number;
    let clock = new THREE.Clock();

    const targetCamPos = new THREE.Vector3(0, 18, 24);
    const targetLookAt = new THREE.Vector3(0, 1, 0);
    const currentLookAt = new THREE.Vector3(0, 1, 0);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const ch = chapterRef.current;

      // Gentle particle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) positions[i] = 18;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Dynamic Board updates based on chapter
      if (ch === 0) {
        // ACT 1: Opening Moves (Italian Game setup)
        targetCamPos.set(0, 15, 20);
        targetLookAt.set(0, 0.5, 0);
        spotLight.color.setHex(0x81b64c);
        spotLight.position.set(0, 18, 5);

        heroKnight.position.set(tileSize, 0.2 + Math.sin(elapsed * 2) * 0.08, tileSize);
        heroKnight.rotation.y = -Math.PI / 3;
        heroKing.visible = true;
        goldKing.visible = false;
        laserGroup.clear();
      } else if (ch === 1) {
        // ACT 2: Tactical Awakening (1,611 Peak - Knight Fork & Laser Diagonals)
        targetCamPos.set(-9, 14, 15);
        targetLookAt.set(-1, 1, -1);
        spotLight.color.setHex(0xef4444);
        spotLight.position.set(-tileSize, 18, -tileSize);

        heroKnight.position.set(-tileSize * 0.5, 0.4 + Math.sin(elapsed * 3) * 0.15, -tileSize * 0.5);
        heroKnight.rotation.y += 0.015;

        // Draw dynamic laser beams
        if (laserGroup.children.length === 0) {
          laserGroup.add(
            createLaserBeam(heroKnight.position, enemyKing.position, 0xef4444),
            createLaserBeam(heroKnight.position, enemyQueen.position, 0xef4444)
          );
        }
      } else if (ch === 2) {
        // ACT 3: Speed Gauntlet (1,052 Bullet & 764 Blitz - Rapid Orbit)
        const orbitRadius = 19;
        const orbitSpeed = elapsed * 0.7;
        targetCamPos.set(
          Math.sin(orbitSpeed) * orbitRadius,
          11 + Math.sin(elapsed * 1.5) * 3,
          Math.cos(orbitSpeed) * orbitRadius
        );
        targetLookAt.set(0, 1, 0);
        spotLight.color.setHex(0xa855f7);

        heroKnight.position.x = Math.sin(elapsed * 4) * 3;
        heroKnight.position.z = Math.cos(elapsed * 4) * 3;
        heroKnight.rotation.y = elapsed * 4;
        laserGroup.clear();
      } else if (ch === 3) {
        // ACT 4: Strategic Ascent (1,152 Rapid & 1,223 Daily - Elevated Throne)
        targetCamPos.set(11, 13, 17);
        targetLookAt.set(0, 1.5, 0);
        spotLight.color.setHex(0xf59e0b);

        heroKing.visible = false;
        goldKing.visible = true;
        goldKing.position.set(0, 0.8 + Math.sin(elapsed * 1.5) * 0.1, 0);
        goldKing.rotation.y += 0.008;

        heroKnight.position.set(tileSize * 1.5, 0.5, tileSize * 0.5);
        heroKnight.rotation.y = -Math.PI / 2.2;
        laserGroup.clear();
      } else {
        // ACT 5: Legend League & Grandmaster DNA (Fireworks & Celebration)
        targetCamPos.set(0, 16, 21);
        targetLookAt.set(0, 1.5, 0);
        spotLight.color.setHex(0x10b981);

        goldKing.visible = true;
        heroKing.visible = false;
        goldKing.position.set(0, 1.2 + Math.sin(elapsed * 2) * 0.2, 0);
        goldKing.rotation.y = elapsed * 0.8;

        heroKnight.position.set(
          Math.sin(elapsed * 1.2) * 4,
          1.0 + Math.sin(elapsed * 2.5) * 0.15,
          Math.cos(elapsed * 1.2) * 4
        );
        heroKnight.rotation.y = elapsed * 1.2 + Math.PI;
        laserGroup.clear();
      }

      // Smooth camera interpolation (lerp)
      const lerpSpeed = 0.04;
      camera.position.lerp(targetCamPos, lerpSpeed);

      // Add mouse parallax
      camera.position.x += (mouseX * 2.5 - camera.position.x * 0.02);
      camera.position.y += (mouseY * 1.5 - camera.position.y * 0.02);

      // Add user drag rotation
      boardGroup.rotation.y = targetRotationY + (ch === 4 ? elapsed * 0.1 : 0);
      boardGroup.rotation.x = Math.max(-0.4, Math.min(0.4, targetRotationX));

      currentLookAt.lerp(targetLookAt, lerpSpeed);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. Responsive Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[460px] sm:min-h-[580px] lg:min-h-[660px] relative select-none cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
};

export default Chess3DStoryCanvas;

