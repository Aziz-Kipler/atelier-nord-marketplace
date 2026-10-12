import * as THREE from 'three';
import { ShelfObject, PickupInstance, HazardInstance, GroceryItem } from './types.ts';

export const GROCERY_CATALOG: GroceryItem[] = [
  { id: 'milk', name: 'Fresh Whole Milk', category: 'dairy', icon: '🥛', color: '#60A5FA', points: 150 },
  { id: 'cheese', name: 'Artisan Cheddar Wheel', category: 'dairy', icon: '🧀', color: '#FBBF24', points: 200 },
  { id: 'cereal', name: 'Moo-Moo Crunch Cereal', category: 'cereal', icon: '🥣', color: '#F97316', points: 120 },
  { id: 'donut', name: 'Sprinkled Glazed Donut', category: 'bakery', icon: '🍩', color: '#EC4899', points: 180 },
  { id: 'watermelon', name: 'Ripe Sweet Watermelon', category: 'produce', icon: '🍉', color: '#10B981', points: 250 },
  { id: 'banana', name: 'Golden Banana Bunch', category: 'produce', icon: '🍌', color: '#EAB308', points: 100 },
  { id: 'soda', name: 'Fizzy Bubbly Cola 6-Pack', category: 'canned', icon: '🥤', color: '#EF4444', points: 140 },
  { id: 'icecream', name: 'Double Choc Sundae Tub', category: 'frozen', icon: '🍨', color: '#8B5CF6', points: 220 },
  { id: 'bread', name: 'Crispy French Baguette', category: 'bakery', icon: '🥖', color: '#D97706', points: 110 }
];

export interface SupermarketWorld {
  group: THREE.Group;
  shelves: ShelfObject[];
  pickups: PickupInstance[];
  hazards: HazardInstance[];
  boostPads: { x: number; z: number; angle: number; mesh: THREE.Mesh }[];
  checkpoints: { x: number; z: number; order: number }[];
  spawnPoint: { x: number; z: number; rotY: number };
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

/**
 * Creates high-detail procedural canvas textures for shelves, signs, and floor
 */
function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Checkerboard grocery tile pattern (polished supermarket vinyl tile)
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, 512, 512);

  const tileSize = 64;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#ffffff' : '#e5e7eb';
      ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

      // Subtle reflection highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x + 2, y + 2, tileSize - 4, 4);

      // Tile grout seam
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

function createShelfSignTexture(text: string, subtext: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Supermarket Aisle Header
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(6, 6, 500, 116);

  ctx.fillStyle = color;
  ctx.fillRect(10, 10, 492, 108);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 46);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(subtext, 256, 88);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createCerealBoxTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(64, 50, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MOO CRUNCH', 64, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('100% WHOLE GRAIN', 64, 105);

  return new THREE.CanvasTexture(canvas);
}

function createCanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 14, 64, 36);

  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SOUP', 32, 36);

  return new THREE.CanvasTexture(canvas);
}

function createMilkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 20, 64, 28);

  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FRESH MILK', 32, 38);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Builds the entire Supermarket track and layout
 */
export function buildSupermarket(): SupermarketWorld {
  const group = new THREE.Group();
  const shelves: ShelfObject[] = [];
  const pickups: PickupInstance[] = [];
  const hazards: HazardInstance[] = [];
  const boostPads: { x: number; z: number; angle: number; mesh: THREE.Mesh }[] = [];

  // Supermarket Dimensions
  const mapWidth = 90; // X axis from -45 to +45
  const mapLength = 110; // Z axis from -55 to +55

  // 1. FLOOR
  const floorGeo = new THREE.PlaneGeometry(mapWidth, mapLength);
  const floorTex = createFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.25,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // 2. CEILING & WALLS
  const wallMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.8 });
  const trimMat = new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.4 });

  // North wall (Z = -55)
  const nWall = new THREE.Mesh(new THREE.BoxGeometry(mapWidth, 9, 1), wallMat);
  nWall.position.set(0, 4.5, -mapLength / 2);
  group.add(nWall);

  // South wall (Z = +55)
  const sWall = new THREE.Mesh(new THREE.BoxGeometry(mapWidth, 9, 1), wallMat);
  sWall.position.set(0, 4.5, mapLength / 2);
  group.add(sWall);

  // West wall (X = -45)
  const wWall = new THREE.Mesh(new THREE.BoxGeometry(1, 9, mapLength), wallMat);
  wWall.position.set(-mapWidth / 2, 4.5, 0);
  group.add(wWall);

  // East wall (X = +45)
  const eWall = new THREE.Mesh(new THREE.BoxGeometry(1, 9, mapLength), wallMat);
  eWall.position.set(mapWidth / 2, 4.5, 0);
  group.add(eWall);

  // Wall Decorative Color Stripes
  const stripeGeo = new THREE.BoxGeometry(mapWidth, 0.5, 1.05);
  const nStripe = new THREE.Mesh(stripeGeo, trimMat);
  nStripe.position.set(0, 7, -mapLength / 2);
  group.add(nStripe);

  const sStripe = new THREE.Mesh(stripeGeo, trimMat);
  sStripe.position.set(0, 7, mapLength / 2);
  group.add(sStripe);

  // CEILING BEAMS & FLUORESCENT LIGHTS
  for (let z = -45; z <= 45; z += 18) {
    // Cross beam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(mapWidth, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: '#94a3b8' })
    );
    beam.position.set(0, 8.8, z);
    group.add(beam);

    // Hanging Fluorescent tubes
    for (let x = -35; x <= 35; x += 14) {
      const tubeLightMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 6, 8),
        new THREE.MeshBasicMaterial({ color: '#ffffff' })
      );
      tubeLightMesh.rotation.z = Math.PI / 2;
      tubeLightMesh.position.set(x, 8.4, z);
      group.add(tubeLightMesh);

      const pLight = new THREE.PointLight(0xfff5e6, 0.45, 16);
      pLight.position.set(x, 8.0, z);
      group.add(pLight);
    }
  }

  // Common shared textures and materials for shelf items
  const cerealTex = createCerealBoxTexture();
  const canTex = createCanTexture();
  const milkTex = createMilkTexture();

  const cerealMat = new THREE.MeshStandardMaterial({ map: cerealTex, roughness: 0.3 });
  const canMat = new THREE.MeshStandardMaterial({ map: canTex, metalness: 0.6, roughness: 0.2 });
  const milkMat = new THREE.MeshStandardMaterial({ map: milkTex, roughness: 0.2 });
  const metalFrameMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.8, roughness: 0.3 });
  const woodMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 });

  // Shelf Section Definitions
  // We'll create 5 main supermarket aisles with driving corridors between them:
  // Aisle width = 6.5 units (perfect for driving and drifting!)
  // Cross aisles at front (Z = -40), middle (Z = 0), and back (Z = +40)
  interface AisleConfig {
    x: number;
    zStart: number;
    zEnd: number;
    color: string;
    section: string;
    category: string;
    signTitle: string;
    signSubtitle: string;
  }

  const aisleConfigs: AisleConfig[] = [
    { x: -30, zStart: -32, zEnd: -8, color: '#f97316', section: 'Aisle 1', category: 'cereal', signTitle: 'AISLE 1', signSubtitle: 'BREAKFAST & CEREAL' },
    { x: -30, zStart: 8, zEnd: 32, color: '#f97316', section: 'Aisle 1B', category: 'cereal', signTitle: 'AISLE 1B', signSubtitle: 'SNACKS & CRACKERS' },

    { x: -15, zStart: -32, zEnd: -8, color: '#3b82f6', section: 'Aisle 2', category: 'dairy', signTitle: 'AISLE 2', signSubtitle: 'DAIRY & MILK MADNESS' },
    { x: -15, zStart: 8, zEnd: 32, color: '#3b82f6', section: 'Aisle 2B', category: 'dairy', signTitle: 'AISLE 2B', signSubtitle: 'CHEESES & BUTTER' },

    { x: 0, zStart: -32, zEnd: -8, color: '#ef4444', section: 'Aisle 3', category: 'canned', signTitle: 'AISLE 3', signSubtitle: 'SOUPS & CANNED GOODS' },
    { x: 0, zStart: 8, zEnd: 32, color: '#ef4444', section: 'Aisle 3B', category: 'canned', signTitle: 'AISLE 3B', signSubtitle: 'SAUCES & PASTAS' },

    { x: 15, zStart: -32, zEnd: -8, color: '#10b981', section: 'Aisle 4', category: 'produce', signTitle: 'AISLE 4', signSubtitle: 'FRESH PRODUCE & FRUITS' },
    { x: 15, zStart: 8, zEnd: 32, color: '#10b981', section: 'Aisle 4B', category: 'produce', signTitle: 'AISLE 4B', signSubtitle: 'VEGGIES & WATERMELON' },

    { x: 30, zStart: -32, zEnd: -8, color: '#8b5cf6', section: 'Aisle 5', category: 'frozen', signTitle: 'AISLE 5', signSubtitle: 'ICE CREAM & GELATO' },
    { x: 30, zStart: 8, zEnd: 32, color: '#8b5cf6', section: 'Aisle 5B', category: 'bakery', signTitle: 'AISLE 5B', signSubtitle: 'BAKERY & FRESH DONUTS' },
  ];

  // Helper to construct a single shelf unit
  let shelfIdCounter = 1;
  aisleConfigs.forEach((cfg) => {
    const shelfLength = Math.abs(cfg.zEnd - cfg.zStart);
    const shelfWidth = 2.4;
    const shelfHeight = 4.2;
    const shelfZ = (cfg.zStart + cfg.zEnd) / 2;

    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(cfg.x, 0, shelfZ);

    // Shelf metal upright frames
    const uprightMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.4 });
    const uprightGeo = new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.2);
    
    // Front and back end-caps
    const cap1 = new THREE.Mesh(uprightGeo, uprightMat);
    cap1.position.set(0, shelfHeight / 2, -shelfLength / 2);
    shelfGroup.add(cap1);

    const cap2 = new THREE.Mesh(uprightGeo, uprightMat);
    cap2.position.set(0, shelfHeight / 2, shelfLength / 2);
    shelfGroup.add(cap2);

    // Center divider backboard
    const backboard = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, shelfHeight, shelfLength),
      metalFrameMat
    );
    backboard.position.set(0, shelfHeight / 2, 0);
    shelfGroup.add(backboard);

    // Multi-tiered horizontal shelf decks
    const tierCount = 4;
    const shelfDeckGeo = new THREE.BoxGeometry(shelfWidth, 0.1, shelfLength);
    for (let t = 1; t <= tierCount; t++) {
      const tierY = (shelfHeight / (tierCount + 0.5)) * t;
      const deck = new THREE.Mesh(shelfDeckGeo, metalFrameMat);
      deck.position.set(0, tierY, 0);
      shelfGroup.add(deck);

      // Populate shelf deck with products!
      const itemCount = 12;
      const stepZ = shelfLength / itemCount;
      for (let i = 0; i < itemCount; i++) {
        const itemZ = -shelfLength / 2 + (i + 0.5) * stepZ;
        
        // Items on West side (X = -0.65) and East side (X = +0.65)
        [-0.65, 0.65].forEach((offsetX) => {
          let itemMesh: THREE.Mesh;
          if (cfg.category === 'cereal') {
            itemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.35), cerealMat);
          } else if (cfg.category === 'canned') {
            itemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.35, 10), canMat);
          } else if (cfg.category === 'dairy') {
            itemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.3), milkMat);
          } else if (cfg.category === 'produce') {
            itemMesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.2, 8, 8),
              new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? '#10b981' : '#eab308' })
            );
          } else {
            // Bakery / Frozen
            itemMesh = new THREE.Mesh(
              new THREE.CylinderGeometry(0.22, 0.22, 0.2, 8),
              new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? '#ec4899' : '#8b5cf6' })
            );
          }
          itemMesh.position.set(offsetX, tierY + 0.25, itemZ);
          shelfGroup.add(itemMesh);
        });
      }
    }

    // Overhead Hanging Aisle Sign
    const signTex = createShelfSignTexture(cfg.signTitle, cfg.signSubtitle, cfg.color);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.2), signMat);
    signMesh.position.set(0, shelfHeight + 1.2, 0);
    // Rotate to face down the corridor
    signMesh.rotation.y = Math.PI / 2;
    shelfGroup.add(signMesh);

    // Little chain wires holding sign
    const chain1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4), metalFrameMat);
    chain1.position.set(0, shelfHeight + 0.6, -1.2);
    shelfGroup.add(chain1);

    const chain2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4), metalFrameMat);
    chain2.position.set(0, shelfHeight + 0.6, 1.2);
    shelfGroup.add(chain2);

    group.add(shelfGroup);

    shelves.push({
      id: `shelf_${shelfIdCounter++}`,
      x: cfg.x,
      z: shelfZ,
      width: shelfWidth,
      depth: shelfLength,
      height: shelfHeight,
      rotation: 0,
      sectionName: cfg.signTitle,
      category: cfg.category,
      color: cfg.color,
      health: 100,
      isCollapsed: false,
      wobbleIntensity: 0,
      meshGroup: shelfGroup,
    });
  });

  // CHECKOUT COUNTERS at the entrance (Z = 42 to 48)
  for (let x = -28; x <= 28; x += 14) {
    const checkoutGroup = new THREE.Group();
    checkoutGroup.position.set(x, 0, 46);

    // Counter desk
    const counterDesk = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 1.1, 1.6),
      new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.3 })
    );
    counterDesk.position.y = 0.55;
    checkoutGroup.add(counterDesk);

    // Conveyor belt black rubber
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.05, 0.9),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.9 })
    );
    belt.position.set(-0.4, 1.12, 0);
    checkoutGroup.add(belt);

    // Register screen & light pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2),
      metalFrameMat
    );
    pole.position.set(1.6, 1.1, 0.5);
    checkoutGroup.add(pole);

    const laneLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#22c55e' })
    );
    laneLight.position.set(1.6, 2.2, 0.5);
    checkoutGroup.add(laneLight);

    group.add(checkoutGroup);

    // Add checkout barrier as shelf object collision
    shelves.push({
      id: `checkout_${x}`,
      x: x,
      z: 46,
      width: 4.5,
      depth: 1.6,
      height: 1.2,
      rotation: 0,
      sectionName: 'CHECKOUT',
      category: 'register',
      color: '#0284c7',
      health: 100,
      isCollapsed: false,
      wobbleIntensity: 0,
      meshGroup: checkoutGroup,
    });
  }

  // SHOPPING CARTS (Parked obstacles & corrals)
  const cartGeo = new THREE.BoxGeometry(1.2, 0.9, 1.6);
  const cartMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', wireframe: true });
  const cartBaseMat = new THREE.MeshStandardMaterial({ color: '#dc2626' });

  const cartPositions = [
    { x: -38, z: -20 },
    { x: -22.5, z: 2 },
    { x: -7.5, z: -2 },
    { x: 7.5, z: 2 },
    { x: 22.5, z: -2 },
    { x: 38, z: 15 },
  ];

  cartPositions.forEach((pos, idx) => {
    const cGroup = new THREE.Group();
    cGroup.position.set(pos.x, 0, pos.z);

    const basket = new THREE.Mesh(cartGeo, cartMat);
    basket.position.y = 0.8;
    cGroup.add(basket);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), cartBaseMat);
    handle.position.set(0, 1.15, -0.75);
    cGroup.add(handle);

    // 4 tiny wheels
    for (let wx = -0.5; wx <= 0.5; wx += 1.0) {
      for (let wz = -0.6; wz <= 0.6; wz += 1.2) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8),
          new THREE.MeshStandardMaterial({ color: '#334155' })
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.12, wz);
        cGroup.add(wheel);
      }
    }

    group.add(cGroup);

    hazards.push({
      id: `cart_${idx}`,
      x: pos.x,
      z: pos.z,
      type: 'shopping_cart',
      mesh: cGroup,
    });
  });

  // WET FLOOR WARNING CONES & SLIPPERY HAZARDS
  const coneGeo = new THREE.ConeGeometry(0.4, 0.9, 4);
  const coneMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4 });
  const hazardSpots = [
    { x: -22.5, z: -15, type: 'wet_floor' as const },
    { x: 7.5, z: 18, type: 'wet_floor' as const },
    { x: -7.5, z: 22, type: 'banana' as const },
    { x: 22.5, z: -20, type: 'banana' as const },
  ];

  hazardSpots.forEach((spot, idx) => {
    const hGroup = new THREE.Group();
    hGroup.position.set(spot.x, 0, spot.z);

    if (spot.type === 'wet_floor') {
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 0.45;
      hGroup.add(cone);

      // Water puddle on floor
      const puddle = new THREE.Mesh(
        new THREE.CircleGeometry(1.1, 16),
        new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.1, transparent: true, opacity: 0.6 })
      );
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.y = 0.02;
      hGroup.add(puddle);
    } else {
      // Banana peel
      const banana = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.1, 8, 12, Math.PI),
        new THREE.MeshStandardMaterial({ color: '#facc15' })
      );
      banana.rotation.x = -Math.PI / 2;
      banana.position.y = 0.1;
      hGroup.add(banana);
    }

    group.add(hGroup);
    hazards.push({
      id: `hazard_${idx}`,
      x: spot.x,
      z: spot.z,
      type: spot.type,
      mesh: hGroup,
    });
  });

  // BOOST PADS (Luminous chevron arrows on floor)
  const boostPositions = [
    { x: -22.5, z: -28, angle: 0 },
    { x: -7.5, z: 12, angle: 0 },
    { x: 7.5, z: -12, angle: Math.PI },
    { x: 22.5, z: 28, angle: 0 },
    { x: -35, z: -42, angle: Math.PI / 2 },
    { x: 35, z: 42, angle: -Math.PI / 2 },
  ];

  boostPositions.forEach((bp) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, 128, 128);

    // Glowing Neon arrows
    ctx.fillStyle = '#34d399';
    for (let y = 30; y <= 90; y += 30) {
      ctx.beginPath();
      ctx.moveTo(64, y - 25);
      ctx.lineTo(24, y + 10);
      ctx.lineTo(44, y + 10);
      ctx.lineTo(64, y - 5);
      ctx.lineTo(84, y + 10);
      ctx.lineTo(104, y + 10);
      ctx.closePath();
      ctx.fill();
    }

    const boostTex = new THREE.CanvasTexture(canvas);
    const boostMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 3.5),
      new THREE.MeshBasicMaterial({ map: boostTex })
    );
    boostMesh.rotation.x = -Math.PI / 2;
    boostMesh.rotation.z = bp.angle;
    boostMesh.position.set(bp.x, 0.025, bp.z);
    group.add(boostMesh);

    boostPads.push({
      x: bp.x,
      z: bp.z,
      angle: bp.angle,
      mesh: boostMesh,
    });
  });

  // GROCERY PICKUPS SPATTERED THROUGHOUT AISLES
  // Spread items evenly across aisles and crossways
  const pickupLocations = [
    { x: -22.5, z: -24, item: GROCERY_CATALOG[0] }, // milk
    { x: -22.5, z: -10, item: GROCERY_CATALOG[2] }, // cereal
    { x: -22.5, z: 20, item: GROCERY_CATALOG[1] },  // cheese
    { x: -7.5, z: -20, item: GROCERY_CATALOG[6] },  // soda
    { x: -7.5, z: 0, item: GROCERY_CATALOG[0] },    // milk
    { x: -7.5, z: 26, item: GROCERY_CATALOG[3] },   // donut
    { x: 7.5, z: -25, item: GROCERY_CATALOG[4] },   // watermelon
    { x: 7.5, z: -5, item: GROCERY_CATALOG[5] },    // banana
    { x: 7.5, z: 22, item: GROCERY_CATALOG[7] },    // ice cream
    { x: 22.5, z: -22, item: GROCERY_CATALOG[8] },  // bread
    { x: 22.5, z: 5, item: GROCERY_CATALOG[4] },    // watermelon
    { x: 22.5, z: 25, item: GROCERY_CATALOG[2] },   // cereal
    { x: -36, z: 0, item: GROCERY_CATALOG[0] },     // milk
    { x: 36, z: 0, item: GROCERY_CATALOG[3] },      // donut
    { x: 0, z: -42, item: GROCERY_CATALOG[6] },     // soda
    { x: 0, z: 40, item: GROCERY_CATALOG[1] },      // cheese
  ];

  pickupLocations.forEach((loc, idx) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(loc.x, 0.9, loc.z);

    // Glowing halo ring underneath
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.75, 16),
      new THREE.MeshBasicMaterial({ color: loc.item.color, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.85;
    itemGroup.add(ring);

    // 3D item mesh representation
    let itemCore: THREE.Mesh;
    if (loc.item.category === 'dairy') {
      itemCore = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7), milkMat);
    } else if (loc.item.category === 'produce') {
      itemCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 12),
        new THREE.MeshStandardMaterial({ color: loc.item.color, roughness: 0.3 })
      );
    } else if (loc.item.category === 'cereal') {
      itemCore = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.4), cerealMat);
    } else {
      itemCore = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.22, 12, 16),
        new THREE.MeshStandardMaterial({ color: loc.item.color, roughness: 0.4 })
      );
    }
    itemGroup.add(itemCore);

    group.add(itemGroup);

    pickups.push({
      id: `pickup_${idx}`,
      x: loc.x,
      y: 0.9,
      z: loc.z,
      type: 'grocery',
      groceryItem: loc.item,
      mesh: itemGroup,
      collected: false,
    });
  });

  // GRAND PRIX RACING CHECKPOINTS (Circulating the supermarket aisles!)
  const checkpoints = [
    { x: -35, z: 35, order: 0 },
    { x: -22.5, z: 10, order: 1 },
    { x: -22.5, z: -35, order: 2 },
    { x: -7.5, z: -35, order: 3 },
    { x: -7.5, z: 30, order: 4 },
    { x: 7.5, z: 30, order: 5 },
    { x: 7.5, z: -35, order: 6 },
    { x: 22.5, z: -35, order: 7 },
    { x: 22.5, z: 35, order: 8 },
    { x: 35, z: 35, order: 9 },
    { x: 35, z: -35, order: 10 },
    { x: 0, z: -42, order: 11 },
    { x: -35, z: -42, order: 12 },
  ];

  return {
    group,
    shelves,
    pickups,
    hazards,
    boostPads,
    checkpoints,
    spawnPoint: { x: -22.5, z: 35, rotY: Math.PI },
    bounds: {
      minX: -mapWidth / 2 + 2,
      maxX: mapWidth / 2 - 2,
      minZ: -mapLength / 2 + 2,
      maxZ: mapLength / 2 - 2,
    },
  };
}
