import * as THREE from 'three';
import { CalfSkin } from './types.ts';

export const CALF_ROSTER: CalfSkin[] = [
  {
    id: 'barnaby',
    name: 'Barnaby Holstein',
    description: 'The balanced all-rounder. Iconic black and white spots with reliable cornering.',
    bodyColor: '#f8fafc',
    spotColor: '#0f172a',
    accentColor: '#ef4444',
    bellColor: '#facc15',
    speed: 4,
    handling: 4,
    durability: 4,
    boostPower: 4,
  },
  {
    id: 'buttercup',
    name: 'Buttercup Golden',
    description: 'Jersey brown farm champion. Extreme drift grip and quick acceleration in tight aisles.',
    bodyColor: '#d97706',
    spotColor: '#78350f',
    accentColor: '#3b82f6',
    bellColor: '#fbbf24',
    speed: 3,
    handling: 5,
    durability: 3,
    boostPower: 5,
  },
  {
    id: 'strawberry',
    name: 'Strawberry Moobert',
    description: 'Sweet pink heavyweight. Heavy impact armor absorbs shelf collisions without spinning.',
    bodyColor: '#f472b6',
    spotColor: '#be185d',
    accentColor: '#10b981',
    bellColor: '#eab308',
    speed: 4,
    handling: 3,
    durability: 5,
    boostPower: 3,
  },
  {
    id: 'cyber',
    name: 'Cyber-Calf 3000',
    description: 'Turbo-charged neon cyber calf. Insane nitro top-speed for straight supermarket runs.',
    bodyColor: '#0f172a',
    spotColor: '#06b6d4',
    accentColor: '#ec4899',
    bellColor: '#38bdf8',
    speed: 5,
    handling: 3,
    durability: 3,
    boostPower: 5,
  },
];

export interface CalfController {
  group: THREE.Group;
  skin: CalfSkin;
  
  // Physics states
  x: number;
  z: number;
  rotationY: number;
  speed: number;
  angularVelocity: number;
  
  // Drift & Boost
  isDrifting: boolean;
  driftDirection: number; // -1 left, 1 right
  driftTime: number;
  isBoosting: boolean;
  boostTimer: number;
  boostMeter: number; // 0 to 100
  
  // Crash & Damage
  isStunned: boolean;
  stunTimer: number;
  health: number; // 100 max
  
  // Visual limbs for animation
  limbs: {
    legFL: THREE.Group;
    legFR: THREE.Group;
    legBL: THREE.Group;
    legBR: THREE.Group;
    head: THREE.Group;
    tail: THREE.Group;
    bell: THREE.Mesh;
    body: THREE.Mesh;
  };
  
  // Update cycle
  update: (delta: number, controls: { forward: boolean; backward: boolean; left: boolean; right: boolean; drift: boolean; boost: boolean }) => void;
  takeHit: (damage: number) => void;
  giveBoost: (duration?: number) => void;
}

export function createCalf(skin: CalfSkin, isAI: boolean = false): CalfController {
  const group = new THREE.Group();

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: skin.bodyColor,
    roughness: 0.5,
  });

  const spotMat = new THREE.MeshStandardMaterial({
    color: skin.spotColor,
    roughness: 0.5,
  });

  const snoutMat = new THREE.MeshStandardMaterial({
    color: '#fbcfe8', // soft baby pink snout
    roughness: 0.4,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: '#09090b' });
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const hoofMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7 });
  const hornMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3 });
  const bellMat = new THREE.MeshStandardMaterial({ color: skin.bellColor, metalness: 0.85, roughness: 0.2 });
  const collarMat = new THREE.MeshStandardMaterial({ color: skin.accentColor, roughness: 0.5 });

  // 1. TORSO (Rounded cute baby cow body)
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.0, 1.9),
    bodyMat
  );
  body.position.y = 1.0;
  group.add(body);

  // Spotted markings on the body
  const spot1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.6), spotMat);
  spot1.position.set(0.4, 0.35, 0.2);
  body.add(spot1);

  const spot2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.5), spotMat);
  spot2.position.set(-0.4, 0.35, -0.3);
  body.add(spot2);

  const spot3 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.5), spotMat);
  spot3.position.set(0.1, 0.52, -0.2);
  body.add(spot3);

  // Checkered Racing Saddle Pad
  const saddle = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.1, 0.9),
    collarMat
  );
  saddle.position.set(0, 0.52, 0);
  body.add(saddle);

  // 2. HEAD & NECK
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.4, 0.95);

  const headMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.85, 0.85),
    bodyMat
  );
  headGroup.add(headMesh);

  // Head spot
  const headSpot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.3), spotMat);
  headSpot.position.set(0.25, 0.25, 0.2);
  headGroup.add(headSpot);

  // Baby Snout
  const snout = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.45, 0.45),
    snoutMat
  );
  snout.position.set(0, -0.15, 0.5);
  headGroup.add(snout);

  // Nostrils
  const nostrilL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.05), eyeMat);
  nostrilL.position.set(-0.16, -0.12, 0.74);
  headGroup.add(nostrilL);

  const nostrilR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.05), eyeMat);
  nostrilR.position.set(0.16, -0.12, 0.74);
  headGroup.add(nostrilR);

  // Big cartoon eyes
  [-0.35, 0.35].forEach((ex) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeWhiteMat);
    eyeWhite.position.set(ex, 0.18, 0.35);
    headGroup.add(eyeWhite);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), eyeMat);
    pupil.position.set(ex + (ex > 0 ? 0.04 : -0.04), 0.18, 0.48);
    headGroup.add(pupil);
  });

  // Floppy Bovine Ears
  [-0.52, 0.52].forEach((earX) => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.16, 0.15), snoutMat);
    ear.position.set(earX, 0.22, -0.1);
    ear.rotation.z = earX > 0 ? -0.4 : 0.4;
    headGroup.add(ear);
  });

  // Tiny calf horn buds
  [-0.3, 0.3].forEach((hx) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 6), hornMat);
    horn.position.set(hx, 0.52, 0.05);
    horn.rotation.z = hx > 0 ? -0.3 : 0.3;
    headGroup.add(horn);
  });

  // Racing Goggles
  const goggleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.2, 0.2),
    new THREE.MeshStandardMaterial({ color: '#dc2626' })
  );
  goggleFrame.position.set(0, 0.45, 0.35);
  headGroup.add(goggleFrame);

  const goggleLens = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.14, 0.05),
    new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.1 })
  );
  goggleLens.position.set(0, 0.45, 0.46);
  headGroup.add(goggleLens);

  // Neck collar & Golden Bell
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.6, 0.25, 12),
    collarMat
  );
  collar.position.set(0, 1.05, 0.7);
  group.add(collar);

  const bell = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.3, 8),
    bellMat
  );
  bell.position.set(0, 0.85, 0.95);
  bell.rotation.x = Math.PI;
  group.add(bell);

  group.add(headGroup);

  // 3. FOUR ARTICULATED LEGS WITH HOOVES
  const createLeg = (x: number, z: number): THREE.Group => {
    const legG = new THREE.Group();
    legG.position.set(x, 0.65, z);

    // Upper thigh
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.45, 0.3), bodyMat);
    thigh.position.y = -0.15;
    legG.add(thigh);

    // Lower calf leg
    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.24), bodyMat);
    lower.position.y = -0.4;
    legG.add(lower);

    // Hoof
    const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.28), hoofMat);
    hoof.position.y = -0.6;
    legG.add(hoof);

    group.add(legG);
    return legG;
  };

  const legFL = createLeg(-0.45, 0.65);
  const legFR = createLeg(0.45, 0.65);
  const legBL = createLeg(-0.45, -0.65);
  const legBR = createLeg(0.45, -0.65);

  // 4. WAGGING TAIL
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 1.25, -0.95);

  const tailMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.6, 6),
    bodyMat
  );
  tailMesh.position.set(0, -0.25, -0.15);
  tailMesh.rotation.x = -0.5;
  tailGroup.add(tailMesh);

  // Tail brush tip
  const tailBrush = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), spotMat);
  tailBrush.position.set(0, -0.52, -0.3);
  tailGroup.add(tailBrush);

  group.add(tailGroup);

  // Controller state
  let gallopPhase = 0;
  const baseMaxSpeed = 22 + skin.speed * 3.5;
  const baseHandling = 2.4 + skin.handling * 0.4;

  const controller: CalfController = {
    group,
    skin,
    x: 0,
    z: 0,
    rotationY: 0,
    speed: 0,
    angularVelocity: 0,
    isDrifting: false,
    driftDirection: 0,
    driftTime: 0,
    isBoosting: false,
    boostTimer: 0,
    boostMeter: 80,
    isStunned: false,
    stunTimer: 0,
    health: 100,

    limbs: {
      legFL,
      legFR,
      legBL,
      legBR,
      head: headGroup,
      tail: tailGroup,
      bell,
      body,
    },

    takeHit: (damage: number) => {
      const absorbed = Math.max(1, damage - (skin.durability - 3) * 2);
      controller.health = Math.max(0, controller.health - absorbed);
      controller.speed *= 0.4;
      controller.isStunned = true;
      controller.stunTimer = 0.45;

      // Flash body red
      body.material = new THREE.MeshStandardMaterial({ color: '#ef4444' });
      setTimeout(() => {
        body.material = bodyMat;
      }, 150);
    },

    giveBoost: (duration: number = 2.0) => {
      controller.isBoosting = true;
      controller.boostTimer = duration;
    },

    update: (delta: number, controls) => {
      // Stun countdown
      if (controller.isStunned) {
        controller.stunTimer -= delta;
        if (controller.stunTimer <= 0) {
          controller.isStunned = false;
        }
      }

      // Boost countdown
      if (controller.isBoosting) {
        controller.boostTimer -= delta;
        if (controller.boostTimer <= 0) {
          controller.isBoosting = false;
        }
      }

      // Boost consumption from manual boost button
      if (controls.boost && controller.boostMeter > 0 && !controller.isBoosting) {
        controller.isBoosting = true;
        controller.boostTimer = 0.5;
        controller.boostMeter = Math.max(0, controller.boostMeter - delta * 40);
      } else if (!controls.boost && controller.boostMeter < 100) {
        // Slow recharge
        controller.boostMeter = Math.min(100, controller.boostMeter + delta * 6);
      }

      // Physics acceleration calculations
      const boostMultiplier = controller.isBoosting ? (1.5 + skin.boostPower * 0.1) : 1.0;
      const effectiveMaxSpeed = baseMaxSpeed * boostMultiplier;
      const accelRate = (14 + skin.speed * 2) * (controller.isBoosting ? 1.8 : 1.0);
      const decelRate = 18;

      if (!controller.isStunned) {
        if (controls.forward) {
          controller.speed = Math.min(effectiveMaxSpeed, controller.speed + accelRate * delta);
        } else if (controls.backward) {
          controller.speed = Math.max(-12, controller.speed - decelRate * delta);
        } else {
          // Natural friction rolling
          if (controller.speed > 0) {
            controller.speed = Math.max(0, controller.speed - decelRate * 0.6 * delta);
          } else if (controller.speed < 0) {
            controller.speed = Math.min(0, controller.speed + decelRate * 0.6 * delta);
          }
        }
      } else {
        // Friction when stunned
        controller.speed *= Math.pow(0.05, delta);
      }

      // Drift state
      const wantsDrift = controls.drift && Math.abs(controller.speed) > 10;
      if (wantsDrift) {
        controller.isDrifting = true;
        controller.driftTime += delta;
        // Faster boost recharge on drift
        controller.boostMeter = Math.min(100, controller.boostMeter + delta * 25);
      } else {
        controller.isDrifting = false;
        controller.driftTime = 0;
      }

      // Steering
      const steerPower = baseHandling * (controller.isDrifting ? 1.4 : 1.0);
      let targetAngularVel = 0;
      if (controls.left) {
        targetAngularVel = steerPower;
        controller.driftDirection = -1;
      } else if (controls.right) {
        targetAngularVel = -steerPower;
        controller.driftDirection = 1;
      }

      // Steering responsiveness depends on moving speed
      const speedFactor = Math.min(1.0, Math.abs(controller.speed) / 8);
      const directionSign = controller.speed >= 0 ? 1 : -1;
      controller.angularVelocity = THREE.MathUtils.lerp(
        controller.angularVelocity,
        targetAngularVel * speedFactor * directionSign,
        delta * 12
      );

      controller.rotationY += controller.angularVelocity * delta;

      // Update position
      const moveDistance = controller.speed * delta;
      controller.x += Math.sin(controller.rotationY) * moveDistance;
      controller.z += Math.cos(controller.rotationY) * moveDistance;

      // Synchronize 3D group
      group.position.set(controller.x, 0, controller.z);
      group.rotation.y = controller.rotationY;

      // DRIFT & CORNERING TILT (Calf leans into turns!)
      const turnTilt = -controller.angularVelocity * 0.12;
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, turnTilt, delta * 10);

      // GALLOPING LIMB ANIMATION
      const speedRatio = Math.abs(controller.speed) / baseMaxSpeed;
      if (speedRatio > 0.05) {
        gallopPhase += delta * speedRatio * 24;

        // Front and back diagonal trot
        const swing = Math.sin(gallopPhase) * 0.55;
        legFL.rotation.x = swing;
        legBR.rotation.x = swing;
        legFR.rotation.x = -swing;
        legBL.rotation.x = -swing;

        // Body gallop bounce
        body.position.y = 1.0 + Math.abs(Math.sin(gallopPhase * 2)) * 0.12;
        headGroup.position.y = 1.4 + Math.sin(gallopPhase * 2) * 0.08;

        // Floppy ears bouncing
        headGroup.rotation.x = Math.sin(gallopPhase * 2) * 0.1;

        // Bell dinging motion
        bell.rotation.z = Math.sin(gallopPhase * 1.5) * 0.4;

        // Tail wagging
        tailGroup.rotation.y = Math.sin(gallopPhase * 2) * 0.6;
      } else {
        // Idle calming pose
        legFL.rotation.x = THREE.MathUtils.lerp(legFL.rotation.x, 0, delta * 6);
        legFR.rotation.x = THREE.MathUtils.lerp(legFR.rotation.x, 0, delta * 6);
        legBL.rotation.x = THREE.MathUtils.lerp(legBL.rotation.x, 0, delta * 6);
        legBR.rotation.x = THREE.MathUtils.lerp(legBR.rotation.x, 0, delta * 6);
        body.position.y = THREE.MathUtils.lerp(body.position.y, 1.0, delta * 6);
        tailGroup.rotation.y = Math.sin(Date.now() * 0.003) * 0.25;
      }
    },
  };

  return controller;
}
