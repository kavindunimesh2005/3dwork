import * as THREE from 'three';

export function createKingdomWorld() {
  const root = new THREE.Group();
  root.scale.set(0.001, 0.001, 0.001); // starts small for pop-up transition

  // 1. Base Island / Floating Foundation
  const islandGroup = new THREE.Group();
  
  // Base slab
  const baseGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.15, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1a2130,
    roughness: 0.6,
    metalness: 0.2
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = 0.075;
  islandGroup.add(baseMesh);

  // Magic circle ring on base
  const ringGeo = new THREE.RingGeometry(1.1, 1.45, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x61dafb,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.16;
  islandGroup.add(ringMesh);

  // Inner grass & stone platform
  const grassGeo = new THREE.CylinderGeometry(1.1, 1.2, 0.1, 24);
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x22442b,
    roughness: 0.9
  });
  const grassMesh = new THREE.Mesh(grassGeo, grassMat);
  grassMesh.position.y = 0.18;
  islandGroup.add(grassMesh);

  // Cobblestone pathway
  const pathGeo = new THREE.BoxGeometry(0.35, 0.02, 1.2);
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x6c727c, roughness: 0.8 });
  const pathMesh = new THREE.Mesh(pathGeo, pathMat);
  pathMesh.position.set(0, 0.24, 0.5);
  islandGroup.add(pathMesh);

  // 2. Castle Architecture
  const castleGroup = new THREE.Group();
  castleGroup.position.set(0, 0.24, -0.2);

  // Main Keep
  const keepGeo = new THREE.BoxGeometry(0.9, 0.8, 0.7);
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    roughness: 0.7,
    metalness: 0.1
  });
  const keepMesh = new THREE.Mesh(keepGeo, stoneMat);
  keepMesh.position.y = 0.4;
  castleGroup.add(keepMesh);

  // Upper Tower
  const upperGeo = new THREE.BoxGeometry(0.55, 0.6, 0.45);
  const upperMesh = new THREE.Mesh(upperGeo, stoneMat);
  upperMesh.position.y = 0.9;
  castleGroup.add(upperMesh);

  // Spires & Towers
  const towerPositions = [
    [-0.55, 0, -0.4, 0.18, 1.1, 0x8a99ad],
    [0.55, 0, -0.4, 0.18, 1.1, 0x8a99ad],
    [-0.55, 0, 0.35, 0.16, 0.85, 0x718096],
    [0.55, 0, 0.35, 0.16, 0.85, 0x718096],
  ];

  towerPositions.forEach(([x, y, z, r, h, color]) => {
    const tGroup = new THREE.Group();
    tGroup.position.set(x, y, z);

    const cylGeo = new THREE.CylinderGeometry(r, r, h, 16);
    const cylMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    cyl.position.y = h / 2;
    tGroup.add(cyl);

    // Cone roof
    const coneGeo = new THREE.ConeGeometry(r * 1.35, 0.45, 16);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x3182ce,
      roughness: 0.3,
      metalness: 0.3
    });
    const cone = new THREE.Mesh(coneGeo, roofMat);
    cone.position.y = h + 0.22;
    tGroup.add(cone);

    castleGroup.add(tGroup);
  });

  // Center High Spire & Crystal
  const centerSpireGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.7, 16);
  const centerSpire = new THREE.Mesh(centerSpireGeo, stoneMat);
  centerSpire.position.y = 1.4;
  castleGroup.add(centerSpire);

  // Floating Mystic Crystal
  const crystalGeo = new THREE.OctahedronGeometry(0.2, 0);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x9f7aea,
    emissive: 0x6b46c1,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.9
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.y = 2.0;
  castleGroup.add(crystal);

  // Crystal Light
  const crystalLight = new THREE.PointLight(0x9f7aea, 2.5, 4);
  crystalLight.position.y = 2.0;
  castleGroup.add(crystalLight);

  // Portal Arch
  const portalArchGeo = new THREE.TorusGeometry(0.22, 0.04, 12, 24, Math.PI);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd69e2e,
    metalness: 0.8,
    roughness: 0.2
  });
  const portalArch = new THREE.Mesh(portalArchGeo, goldMat);
  portalArch.position.set(0, 0.25, 0.36);
  castleGroup.add(portalArch);

  // Portal Glow Interior
  const portalGlowGeo = new THREE.PlaneGeometry(0.32, 0.45);
  const portalGlowMat = new THREE.MeshBasicMaterial({
    color: 0x4fd1c5,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });
  const portalGlow = new THREE.Mesh(portalGlowGeo, portalGlowMat);
  portalGlow.position.set(0, 0.22, 0.355);
  castleGroup.add(portalGlow);

  islandGroup.add(castleGroup);

  // 3. Mystic Trees & Foliage
  const treePositions = [
    [-0.9, 0.24, 0.2, 0.25],
    [-1.0, 0.24, -0.3, 0.3],
    [0.9, 0.24, 0.3, 0.22],
    [1.05, 0.24, -0.2, 0.28],
    [-0.5, 0.24, 0.8, 0.18],
    [0.6, 0.24, 0.7, 0.2],
  ];

  treePositions.forEach(([tx, ty, tz, scale]) => {
    const tree = new THREE.Group();
    tree.position.set(tx, ty, tz);

    const trunkGeo = new THREE.CylinderGeometry(0.04 * scale * 4, 0.06 * scale * 4, 0.3 * scale * 4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = (0.3 * scale * 4) / 2;
    tree.add(trunk);

    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x276749, roughness: 0.6 });
    for (let l = 0; l < 3; l++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry((0.28 - l * 0.05) * scale * 4, (0.3 - l * 0.03) * scale * 4, 8),
        leavesMat
      );
      cone.position.y = (0.2 + l * 0.15) * scale * 4;
      tree.add(cone);
    }
    islandGroup.add(tree);
  });

  // 4. Hero Character "Elira"
  const hero = new THREE.Group();
  hero.position.set(0, 0.24, 0.7);

  // Robe body
  const robeGeo = new THREE.ConeGeometry(0.1, 0.35, 12);
  const robeMat = new THREE.MeshStandardMaterial({ color: 0x319795, roughness: 0.5 });
  const robe = new THREE.Mesh(robeGeo, robeMat);
  robe.position.y = 0.175;
  hero.add(robe);

  // Head
  const headGeo = new THREE.SphereGeometry(0.065, 16, 16);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 0.38;
  hero.add(head);

  // Magic Staff
  const staffGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 8);
  const staffMat = new THREE.MeshStandardMaterial({ color: 0xd69e2e, metalness: 0.7 });
  const staff = new THREE.Mesh(staffGeo, staffMat);
  staff.position.set(0.12, 0.25, 0.04);
  hero.add(staff);

  // Staff Light Gem
  const gemGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const gemMat = new THREE.MeshBasicMaterial({ color: 0x63b3ed });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.set(0.12, 0.5, 0.04);
  hero.add(gem);

  const heroLight = new THREE.PointLight(0x63b3ed, 1.2, 1.5);
  heroLight.position.set(0.12, 0.5, 0.04);
  hero.add(heroLight);

  islandGroup.add(hero);

  // 5. Floating Magic Runes / Orbiting Wisps
  const wispsGroup = new THREE.Group();
  const wispGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const wispMat = new THREE.MeshBasicMaterial({ color: 0xf6e05e });
  const wisps = [];
  for (let i = 0; i < 5; i++) {
    const wisp = new THREE.Mesh(wispGeo, wispMat);
    const angle = (i / 5) * Math.PI * 2;
    const rad = 1.35;
    wisp.position.set(Math.cos(angle) * rad, 0.4 + Math.sin(i) * 0.2, Math.sin(angle) * rad);
    wispsGroup.add(wisp);
    wisps.push(wisp);
  }
  islandGroup.add(wispsGroup);

  // 6. Particle Fireflies
  const particleCount = 75;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let p = 0; p < particleCount * 3; p += 3) {
    particlePositions[p] = (Math.random() - 0.5) * 3;
    particlePositions[p + 1] = Math.random() * 2 + 0.2;
    particlePositions[p + 2] = (Math.random() - 0.5) * 3;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x81e6d9,
    size: 0.04,
    transparent: true,
    opacity: 0.85
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  islandGroup.add(particles);

  root.add(islandGroup);

  // Lights for the model
  const ambient = new THREE.AmbientLight(0xffffff, 1.3);
  root.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
  dirLight.position.set(2, 4, 3);
  root.add(dirLight);
  const rimLight = new THREE.DirectionalLight(0x4299e1, 1.2);
  rimLight.position.set(-3, 2, -3);
  root.add(rimLight);

  // Animation Update Function
  let clock = new THREE.Clock();
  let targetScale = 1;
  let isVisible = false;

  function update() {
    const elapsedTime = clock.getElapsedTime();

    // Smooth Pop-up / Pop-down spring scaling
    const currentScale = root.scale.x;
    const dest = isVisible ? targetScale : 0.001;
    const newScale = THREE.MathUtils.lerp(currentScale, dest, 0.12);
    root.scale.set(newScale, newScale, newScale);

    // Animate Floating Crystal
    crystal.position.y = 2.0 + Math.sin(elapsedTime * 2.5) * 0.12;
    crystal.rotation.y = elapsedTime * 1.5;
    crystal.rotation.x = Math.sin(elapsedTime) * 0.3;

    // Animate Magic Ring
    ringMesh.rotation.z = -elapsedTime * 0.4;

    // Animate Portal Glow
    portalGlowMat.opacity = 0.55 + Math.sin(elapsedTime * 4) * 0.25;

    // Animate Hero Gem
    gem.position.y = 0.5 + Math.sin(elapsedTime * 3) * 0.03;

    // Animate Orbiting Wisps
    wisps.forEach((wisp, idx) => {
      const angle = (idx / 5) * Math.PI * 2 + elapsedTime * 0.8;
      const rad = 1.3 + Math.sin(elapsedTime * 2 + idx) * 0.15;
      wisp.position.x = Math.cos(angle) * rad;
      wisp.position.z = Math.sin(angle) * rad;
      wisp.position.y = 0.4 + Math.sin(elapsedTime * 3 + idx) * 0.2;
    });

    // Animate Firefly Particles
    particles.rotation.y = elapsedTime * 0.08;
  }

  function setVisible(v) {
    isVisible = v;
  }

  function setChapterTheme(chapterNum) {
    if (chapterNum === 1) {
      crystalMat.color.setHex(0x9f7aea);
      crystalLight.color.setHex(0x9f7aea);
      ringMat.color.setHex(0x61dafb);
    } else if (chapterNum === 2) {
      crystalMat.color.setHex(0x48bb78);
      crystalLight.color.setHex(0x48bb78);
      ringMat.color.setHex(0x38a169);
    } else if (chapterNum === 3) {
      crystalMat.color.setHex(0xed8936);
      crystalLight.color.setHex(0xed8936);
      ringMat.color.setHex(0xdd6b20);
    } else {
      crystalMat.color.setHex(0x3182ce);
      crystalLight.color.setHex(0x3182ce);
      ringMat.color.setHex(0x805ad5);
    }
  }

  return {
    group: root,
    update,
    setVisible,
    setChapterTheme
  };
}
