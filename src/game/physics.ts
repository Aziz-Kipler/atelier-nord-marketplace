import * as THREE from 'three';
import { CalfController } from './calf.ts';
import { ShelfObject, PickupInstance, HazardInstance, GameStats, ShoppingTarget } from './types.ts';
import { sound } from './audio.ts';

export interface FallingDebris {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  life: number;
}

export class PhysicsManager {
  private debrisList: FallingDebris[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  // Check collision between a calf and shelves
  public updateCollisions(
    calf: CalfController,
    shelves: ShelfObject[],
    stats: GameStats,
    onShelfCrash?: (shelf: ShelfObject) => void,
    onGameOver?: (reason: string) => void
  ) {
    const calfRadius = 0.9;
    const calfSpeed = Math.abs(calf.speed);

    for (const shelf of shelves) {
      if (shelf.isCollapsed) continue;

      // Shelf bounds with a little padding
      const halfW = shelf.width / 2;
      const halfD = shelf.depth / 2;

      const minX = shelf.x - halfW - calfRadius;
      const maxX = shelf.x + halfW + calfRadius;
      const minZ = shelf.z - halfD - calfRadius;
      const maxZ = shelf.z + halfD + calfRadius;

      if (calf.x >= minX && calf.x <= maxX && calf.z >= minZ && calf.z <= maxZ) {
        // COLLISION DETECTED!
        // Find nearest penetration axis
        const overlapX = Math.min(maxX - calf.x, calf.x - minX);
        const overlapZ = Math.min(maxZ - calf.z, calf.z - minZ);

        if (overlapX < overlapZ) {
          // Push out on X
          if (calf.x < shelf.x) {
            calf.x = minX;
          } else {
            calf.x = maxX;
          }
        } else {
          // Push out on Z
          if (calf.z < shelf.z) {
            calf.z = minZ;
          } else {
            calf.z = maxZ;
          }
        }

        // Calculate impact intensity
        const impactSeverity = Math.min(1.0, calfSpeed / 25);
        const damage = Math.round(15 + impactSeverity * 45);

        // Sound effect
        sound.playShelfHit(impactSeverity);

        // Shelf wobble animation trigger
        shelf.wobbleIntensity = Math.min(1.5, shelf.wobbleIntensity + 0.35 + impactSeverity * 0.5);
        shelf.health = Math.max(0, shelf.health - damage);

        // Add damage cost ($)
        stats.damageCost += Math.round(50 + impactSeverity * 350);

        // Calf takes hit & bounces back
        calf.takeHit(12 + impactSeverity * 25);
        calf.speed = -calf.speed * 0.45; // reverse bounce

        // Pop flying debris items off the shelf!
        this.spawnShelfDebris(shelf.x, shelf.z, shelf.category, Math.round(3 + impactSeverity * 6));

        // Check for Catastrophic Collapse
        if (shelf.health <= 0 && !shelf.isCollapsed) {
          shelf.isCollapsed = true;
          stats.shelvesDestroyed++;
          stats.damageCost += 2800; // Big supermarket bill for shelf collapse!

          sound.playShelfCollapse();
          this.collapseShelf(shelf);

          if (onShelfCrash) {
            onShelfCrash(shelf);
          }

          // If too many shelves destroyed or calf health zero, game over!
          if (calf.health <= 0) {
            if (onGameOver) {
              onGameOver('Your calf wiped out from devastating shelf collisions!');
            }
          }
        }

        break;
      }
    }
  }

  // Check collision with hazards (carts, banana peels, wet floors)
  public updateHazards(
    calf: CalfController,
    hazards: HazardInstance[],
    onHazardHit?: (type: string) => void
  ) {
    for (const h of hazards) {
      const dx = calf.x - h.x;
      const dz = calf.z - h.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.6) {
        if (h.type === 'shopping_cart') {
          // Push cart away
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          h.x -= nx * 3;
          h.z -= nz * 3;
          if (h.mesh) {
            h.mesh.position.set(h.x, 0, h.z);
          }
          calf.speed *= 0.5;
          sound.playShelfHit(0.4);
          if (onHazardHit) onHazardHit('shopping_cart');
        } else if (h.type === 'wet_floor' || h.type === 'banana') {
          // Banana / Wet floor spin-out!
          calf.angularVelocity += 18; // 360 spin
          calf.speed *= 0.6;
          sound.playBell();
          if (onHazardHit) onHazardHit(h.type);
          // Move hazard out of way temporarily
          h.x += 999;
          if (h.mesh) h.mesh.visible = false;
        }
      }
    }
  }

  // Check pickups (groceries, boosts)
  public updatePickups(
    calf: CalfController,
    pickups: PickupInstance[],
    stats: GameStats,
    shoppingTargets?: ShoppingTarget[],
    onPickupCollected?: (item: PickupInstance) => void
  ) {
    for (const p of pickups) {
      if (p.collected) continue;

      const dx = calf.x - p.x;
      const dz = calf.z - p.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.0) {
        p.collected = true;
        if (p.mesh) {
          p.mesh.visible = false;
        }

        sound.playPickup();
        stats.score += p.groceryItem?.points || 150;
        stats.itemsCollected++;

        // Calf boost meter refill on pickup!
        calf.boostMeter = Math.min(100, calf.boostMeter + 25);

        // Shopping target progress
        if (shoppingTargets && p.groceryItem) {
          const target = shoppingTargets.find((t) => t.item.id === p.groceryItem?.id);
          if (target && target.collected < target.needed) {
            target.collected++;
            stats.score += 300; // bonus points for list items!
          }
        }

        if (onPickupCollected) {
          onPickupCollected(p);
        }
      }
    }
  }

  // Check boost pads
  public updateBoostPads(
    calf: CalfController,
    boostPads: { x: number; z: number; angle: number }[]
  ) {
    for (const bp of boostPads) {
      const dx = calf.x - bp.x;
      const dz = calf.z - bp.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.2) {
        if (!calf.isBoosting) {
          sound.playBoost();
          calf.giveBoost(2.4);
        }
      }
    }
  }

  // Shelf wobble & collapsing physics
  public updateShelves(shelves: ShelfObject[], delta: number) {
    for (const shelf of shelves) {
      if (!shelf.meshGroup) continue;

      if (shelf.wobbleIntensity > 0.01) {
        // Damped harmonic wobble
        shelf.wobbleIntensity = THREE.MathUtils.lerp(shelf.wobbleIntensity, 0, delta * 3.5);
        const wobbleAngle = Math.sin(Date.now() * 0.04) * shelf.wobbleIntensity * 0.12;
        shelf.meshGroup.rotation.z = wobbleAngle;
        shelf.meshGroup.rotation.x = Math.cos(Date.now() * 0.03) * shelf.wobbleIntensity * 0.06;
      } else {
        shelf.wobbleIntensity = 0;
        if (!shelf.isCollapsed) {
          shelf.meshGroup.rotation.z = 0;
          shelf.meshGroup.rotation.x = 0;
        }
      }
    }
  }

  // Topple shelf onto the floor
  private collapseShelf(shelf: ShelfObject) {
    if (!shelf.meshGroup) return;

    // Topple to side (fall over)
    const fallDir = Math.random() > 0.5 ? 1 : -1;
    shelf.meshGroup.rotation.z = (Math.PI / 2.2) * fallDir;
    shelf.meshGroup.position.y = -0.5;

    // Massive shower of groceries
    this.spawnShelfDebris(shelf.x, shelf.z, shelf.category, 20);
  }

  // Spawn flying cereal boxes, soup cans, etc.
  private spawnShelfDebris(centerX: number, centerZ: number, category: string, count: number) {
    const debrisMats = [
      new THREE.MeshStandardMaterial({ color: '#f97316' }), // orange cereal
      new THREE.MeshStandardMaterial({ color: '#ef4444' }), // red can
      new THREE.MeshStandardMaterial({ color: '#3b82f6' }), // blue milk
      new THREE.MeshStandardMaterial({ color: '#eab308' }), // yellow banana
      new THREE.MeshStandardMaterial({ color: '#10b981' }), // green produce
    ];

    for (let i = 0; i < count; i++) {
      const isCan = category === 'canned' || Math.random() > 0.5;
      const geo = isCan
        ? new THREE.CylinderGeometry(0.18, 0.18, 0.35, 8)
        : new THREE.BoxGeometry(0.35, 0.5, 0.25);

      const mat = debrisMats[Math.floor(Math.random() * debrisMats.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        centerX + (Math.random() - 0.5) * 2.5,
        1.5 + Math.random() * 2,
        centerZ + (Math.random() - 0.5) * 5
      );

      this.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;

      this.debrisList.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: 3 + Math.random() * 6,
        vz: Math.sin(angle) * speed,
        rotX: (Math.random() - 0.5) * 12,
        rotY: (Math.random() - 0.5) * 12,
        rotZ: (Math.random() - 0.5) * 12,
        life: 4.5,
      });
    }
  }

  // Update flying debris particles
  public updateDebris(delta: number) {
    const gravity = -18;

    for (let i = this.debrisList.length - 1; i >= 0; i--) {
      const d = this.debrisList[i];
      d.life -= delta;

      if (d.life <= 0) {
        this.scene.remove(d.mesh);
        this.debrisList.splice(i, 1);
        continue;
      }

      d.vy += gravity * delta;
      d.mesh.position.x += d.vx * delta;
      d.mesh.position.y += d.vy * delta;
      d.mesh.position.z += d.vz * delta;

      d.mesh.rotation.x += d.rotX * delta;
      d.mesh.rotation.y += d.rotY * delta;
      d.mesh.rotation.z += d.rotZ * delta;

      // Bounce on supermarket floor
      if (d.mesh.position.y < 0.2) {
        d.mesh.position.y = 0.2;
        d.vy = -d.vy * 0.45;
        d.vx *= 0.7;
        d.vz *= 0.7;
        d.rotX *= 0.6;
        d.rotY *= 0.6;
        d.rotZ *= 0.6;
      }
    }
  }

  // Enforce supermarket perimeter walls
  public enforceSupermarketBounds(
    calf: CalfController,
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
  ) {
    if (calf.x < bounds.minX) {
      calf.x = bounds.minX;
      calf.speed = -calf.speed * 0.3;
      sound.playShelfHit(0.3);
    } else if (calf.x > bounds.maxX) {
      calf.x = bounds.maxX;
      calf.speed = -calf.speed * 0.3;
      sound.playShelfHit(0.3);
    }

    if (calf.z < bounds.minZ) {
      calf.z = bounds.minZ;
      calf.speed = -calf.speed * 0.3;
      sound.playShelfHit(0.3);
    } else if (calf.z > bounds.maxZ) {
      calf.z = bounds.maxZ;
      calf.speed = -calf.speed * 0.3;
      sound.playShelfHit(0.3);
    }
  }

  // Clean up all debris
  public dispose() {
    for (const d of this.debrisList) {
      this.scene.remove(d.mesh);
    }
    this.debrisList = [];
  }
}
