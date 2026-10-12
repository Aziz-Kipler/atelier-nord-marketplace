import * as THREE from 'three';
import { CalfController, createCalf, CALF_ROSTER } from './calf.ts';
import { CalfSkin } from './types.ts';

export interface AIRival {
  calf: CalfController;
  name: string;
  currentCheckpoint: number;
  lap: number;
  finished: boolean;
  color: string;
}

export function createAIRivals(
  scene: THREE.Scene,
  checkpoints: { x: number; z: number; order: number }[]
): AIRival[] {
  const rivalsData: { skin: CalfSkin; name: string; offsetZ: number; offsetX: number }[] = [
    {
      skin: CALF_ROSTER[1], // Buttercup
      name: 'Daisy Drift',
      offsetX: -20,
      offsetZ: 37,
    },
    {
      skin: CALF_ROSTER[2], // Strawberry
      name: 'Sir Moo-a-Lot',
      offsetX: -25,
      offsetZ: 37,
    },
    {
      skin: CALF_ROSTER[3], // Cyber
      name: 'Milkshake 3000',
      offsetX: -18,
      offsetZ: 39,
    },
  ];

  const rivals: AIRival[] = [];

  rivalsData.forEach((data) => {
    const calf = createCalf(data.skin, true);
    calf.x = data.offsetX;
    calf.z = data.offsetZ;
    calf.rotationY = Math.PI;
    calf.group.position.set(calf.x, 0, calf.z);
    scene.add(calf.group);

    rivals.push({
      calf,
      name: data.name,
      currentCheckpoint: 0,
      lap: 1,
      finished: false,
      color: data.skin.bodyColor,
    });
  });

  return rivals;
}

export function updateAIRivals(
  rivals: AIRival[],
  checkpoints: { x: number; z: number; order: number }[],
  delta: number,
  totalLaps: number = 3
) {
  if (checkpoints.length === 0) return;

  for (const rival of rivals) {
    if (rival.finished) {
      rival.calf.update(delta, { forward: false, backward: false, left: false, right: false, drift: false, boost: false });
      continue;
    }

    const targetCp = checkpoints[rival.currentCheckpoint % checkpoints.length];
    const dx = targetCp.x - rival.calf.x;
    const dz = targetCp.z - rival.calf.z;
    const distToCp = Math.sqrt(dx * dx + dz * dz);

    if (distToCp < 5.0) {
      // Advanced to next checkpoint
      rival.currentCheckpoint++;
      if (rival.currentCheckpoint >= checkpoints.length * rival.lap) {
        rival.lap++;
        if (rival.lap > totalLaps) {
          rival.finished = true;
        }
      }
    }

    // Steering towards waypoint
    // In our 3D space, angle towards target
    const desiredAngle = Math.atan2(dx, dz);
    let angleDiff = desiredAngle - rival.calf.rotationY;

    // Normalize angle to -PI to PI
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const steerLeft = angleDiff > 0.05;
    const steerRight = angleDiff < -0.05;
    const shouldDrift = Math.abs(angleDiff) > 0.6;

    rival.calf.update(delta, {
      forward: true,
      backward: false,
      left: steerLeft,
      right: steerRight,
      drift: shouldDrift,
      boost: distToCp > 18 && Math.random() < 0.05,
    });
  }
}
