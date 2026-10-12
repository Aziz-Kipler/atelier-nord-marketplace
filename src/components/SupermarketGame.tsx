import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GameMode, CalfSkin, GameStats, ShoppingTarget, ShelfObject, PickupInstance } from '../game/types.ts';
import { buildSupermarket, SupermarketWorld, GROCERY_CATALOG } from '../game/supermarket.ts';
import { createCalf, CalfController } from '../game/calf.ts';
import { PhysicsManager } from '../game/physics.ts';
import { createAIRivals, updateAIRivals, AIRival } from '../game/aiRivals.ts';
import { sound } from '../game/audio.ts';
import { GameHUD } from './GameHUD.tsx';
import { GameOverModal } from './GameOverModal.tsx';

interface SupermarketGameProps {
  gameMode: GameMode;
  selectedCalf: CalfSkin;
  isMuted: boolean;
  onToggleMute: () => void;
  onReturnToMenu: () => void;
}

export const SupermarketGame: React.FC<SupermarketGameProps> = ({
  gameMode,
  selectedCalf,
  isMuted,
  onToggleMute,
  onReturnToMenu,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    damageCost: 0,
    shelvesDestroyed: 0,
    itemsCollected: 0,
    currentLap: 1,
    totalLaps: 3,
    timeElapsed: 0,
    maxSpeed: 0,
    driftPoints: 0,
  });

  const [shoppingTargets, setShoppingTargets] = useState<ShoppingTarget[]>([]);
  const [hudSpeed, setHudSpeed] = useState<number>(0);
  const [boostMeter, setBoostMeter] = useState<number>(80);
  const [health, setHealth] = useState<number>(100);
  const [isDrifting, setIsDrifting] = useState<boolean>(false);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [raceRank, setRaceRank] = useState<number>(1);
  const [shelvesState, setShelvesState] = useState<ShelfObject[]>([]);
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number; angle: number }>({ x: 0, z: 0, angle: 0 });
  const [rivalsPos, setRivalsPos] = useState<{ x: number; z: number; name: string }[]>([]);

  // Modals
  const [gameOverState, setGameOverState] = useState<{
    show: boolean;
    isVictory: boolean;
    reason: string;
  }>({ show: false, isVictory: false, reason: '' });

  // Camera perspective mode (0: Chase cam, 1: Action cam, 2: Top-down cam)
  const [cameraMode, setCameraMode] = useState<number>(0);

  // References for live 60fps loop without React re-render lag
  const gameLoopRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    world: SupermarketWorld;
    player: CalfController;
    rivals: AIRival[];
    physics: PhysicsManager;
    controls: {
      forward: boolean;
      backward: boolean;
      left: boolean;
      right: boolean;
      drift: boolean;
      boost: boolean;
    };
    running: boolean;
    clock: THREE.Clock;
    statsRef: GameStats;
    targetsRef: ShoppingTarget[];
    cameraModeRef: number;
    currentLapRef: number;
    passedCheckpoints: Set<number>;
  } | null>(null);

  // Initialize Shopping Targets for Mode 1
  useEffect(() => {
    if (gameMode === 'grocery_dash') {
      const targets: ShoppingTarget[] = [
        { item: GROCERY_CATALOG[0], needed: 2, collected: 0 }, // Milk
        { item: GROCERY_CATALOG[2], needed: 2, collected: 0 }, // Cereal
        { item: GROCERY_CATALOG[4], needed: 1, collected: 0 }, // Watermelon
        { item: GROCERY_CATALOG[6], needed: 1, collected: 0 }, // Soda
      ];
      setShoppingTargets(targets);
      if (gameLoopRef.current) {
        gameLoopRef.current.targetsRef = targets;
      }
    }
  }, [gameMode]);

  // Handle moo horn
  const handleMooHorn = useCallback(() => {
    sound.playMoo();
    sound.playBell();
  }, []);

  // Handle camera change
  const handleToggleCamera = useCallback(() => {
    setCameraMode((prev) => {
      const next = (prev + 1) % 3;
      if (gameLoopRef.current) {
        gameLoopRef.current.cameraModeRef = next;
      }
      return next;
    });
  }, []);

  // Virtual control inputs (for mobile or key bindings)
  const handleVirtualControl = useCallback(
    (control: 'forward' | 'backward' | 'left' | 'right' | 'drift' | 'boost', active: boolean) => {
      if (!gameLoopRef.current) return;
      gameLoopRef.current.controls[control] = active;
      if (control === 'boost' && active) {
        sound.playBell();
      }
    },
    []
  );

  // Initialize Three.js Game
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    scene.fog = new THREE.FogExp2('#0f172a', 0.008);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      300
    );

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Attach canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // WebGL Context Lost safety handling
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost, awaiting restore');
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 5. Build Supermarket Environment
    const world = buildSupermarket();
    scene.add(world.group);
    setShelvesState(world.shelves);

    // 6. Build Player Calf
    const player = createCalf(selectedCalf);
    player.x = world.spawnPoint.x;
    player.z = world.spawnPoint.z;
    player.rotationY = world.spawnPoint.rotY;
    player.group.position.set(player.x, 0, player.z);
    scene.add(player.group);

    // 7. AI Rivals (for Grand Prix mode)
    const rivals = gameMode === 'grand_prix' ? createAIRivals(scene, world.checkpoints) : [];

    // 8. Physics Engine
    const physics = new PhysicsManager(scene);

    const initialStats: GameStats = {
      score: 0,
      damageCost: 0,
      shelvesDestroyed: 0,
      itemsCollected: 0,
      currentLap: 1,
      totalLaps: 3,
      timeElapsed: 0,
      maxSpeed: 0,
      driftPoints: 0,
    };

    const initialTargets: ShoppingTarget[] =
      gameMode === 'grocery_dash'
        ? [
            { item: GROCERY_CATALOG[0], needed: 2, collected: 0 },
            { item: GROCERY_CATALOG[2], needed: 2, collected: 0 },
            { item: GROCERY_CATALOG[4], needed: 1, collected: 0 },
            { item: GROCERY_CATALOG[6], needed: 1, collected: 0 },
          ]
        : [];

    const controls = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      drift: false,
      boost: false,
    };

    const clock = new THREE.Clock();

    // Store in loop reference
    gameLoopRef.current = {
      scene,
      camera,
      renderer,
      world,
      player,
      rivals,
      physics,
      controls,
      running: true,
      clock,
      statsRef: { ...initialStats },
      targetsRef: initialTargets,
      cameraModeRef: 0,
      currentLapRef: 1,
      passedCheckpoints: new Set<number>(),
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') controls.forward = true;
      if (code === 'KeyS' || code === 'ArrowDown') controls.backward = true;
      if (code === 'KeyA' || code === 'ArrowLeft') controls.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') controls.right = true;
      if (code === 'Space') {
        controls.drift = true;
        e.preventDefault();
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        controls.boost = true;
      }
      if (code === 'KeyH') {
        handleMooHorn();
      }
      if (code === 'KeyC') {
        handleToggleCamera();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') controls.forward = false;
      if (code === 'KeyS' || code === 'ArrowDown') controls.backward = false;
      if (code === 'KeyA' || code === 'ArrowLeft') controls.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') controls.right = false;
      if (code === 'Space') controls.drift = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight') controls.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Main Game Animation Loop
    let animId: number;
    let hoofSoundTimer = 0;
    let uiUpdateTimer = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const loop = gameLoopRef.current;
      if (!loop || !loop.running) return;

      const delta = Math.min(0.1, loop.clock.getDelta());
      loop.statsRef.timeElapsed += delta;

      // Update Player Calf
      loop.player.update(delta, loop.controls);
      physics.enforceSupermarketBounds(loop.player, loop.world.bounds);

      // Sound footsteps rhythm
      if (Math.abs(loop.player.speed) > 1) {
        hoofSoundTimer += delta;
        const hoofInterval = Math.max(0.12, 0.35 - (Math.abs(loop.player.speed) / 35) * 0.2);
        if (hoofSoundTimer > hoofInterval) {
          hoofSoundTimer = 0;
          sound.playHoofStep(Math.abs(loop.player.speed) / 35);
        }
      }

      // Update AI Rivals
      if (gameMode === 'grand_prix') {
        updateAIRivals(loop.rivals, loop.world.checkpoints, delta, loop.statsRef.totalLaps);
      }

      // Update Physics Collisions & Shelves
      physics.updateCollisions(
        loop.player,
        loop.world.shelves,
        loop.statsRef,
        () => {
          // Trigger shelf update in UI
          setShelvesState([...loop.world.shelves]);
        },
        (failReason) => {
          // Player crashed out!
          loop.running = false;
          setGameOverState({
            show: true,
            isVictory: false,
            reason: failReason,
          });
        }
      );

      physics.updateHazards(loop.player, loop.world.hazards);
      physics.updateBoostPads(loop.player, loop.world.boostPads);
      physics.updatePickups(
        loop.player,
        loop.world.pickups,
        loop.statsRef,
        loop.targetsRef,
        () => {
          setShoppingTargets([...loop.targetsRef]);
        }
      );
      physics.updateShelves(loop.world.shelves, delta);
      physics.updateDebris(delta);

      // Rotate grocery pickups attractively
      for (const p of loop.world.pickups) {
        if (p.mesh && !p.collected) {
          p.mesh.rotation.y += delta * 1.8;
          p.mesh.position.y = 0.9 + Math.sin(Date.now() * 0.004 + p.x) * 0.15;
        }
      }

      // Check Checkpoint Progress in Grand Prix
      if (gameMode === 'grand_prix') {
        for (const cp of loop.world.checkpoints) {
          const dx = loop.player.x - cp.x;
          const dz = loop.player.z - cp.z;
          if (Math.sqrt(dx * dx + dz * dz) < 6) {
            loop.passedCheckpoints.add(cp.order);
          }
        }

        // Crossed all checkpoints in circuit?
        if (loop.passedCheckpoints.size >= loop.world.checkpoints.length - 2) {
          // Check start/finish line (Z > 34 and X between -35 and -15)
          if (loop.player.z > 33 && loop.player.x < -18 && loop.player.x > -36) {
            loop.passedCheckpoints.clear();
            loop.currentLapRef++;
            loop.statsRef.currentLap = loop.currentLapRef;
            sound.playBell();

            if (loop.currentLapRef > loop.statsRef.totalLaps) {
              // FINISHED RACE!
              loop.running = false;
              const playerWon = loop.rivals.every((r) => r.lap <= loop.statsRef.totalLaps);
              setGameOverState({
                show: true,
                isVictory: playerWon,
                reason: playerWon
                  ? 'Grand Prix Champion! You crossed the finish line 1st without demolishing the store!'
                  : 'You finished the 3 laps Grand Prix!',
              });
            }
          }
        }
      }

      // Check Grocery Dash completion
      if (gameMode === 'grocery_dash') {
        const allDone = loop.targetsRef.every((t) => t.collected >= t.needed);
        if (allDone) {
          loop.running = false;
          setGameOverState({
            show: true,
            isVictory: true,
            reason: 'Shopping List Complete! You grabbed all dairy, cereal & produce in record time!',
          });
        } else if (loop.statsRef.timeElapsed >= 120) {
          loop.running = false;
          setGameOverState({
            show: true,
            isVictory: false,
            reason: 'Store Closed! Time expired before you finished collecting all groceries!',
          });
        }
      }

      // Camera Choreography
      const camMode = loop.cameraModeRef;
      if (camMode === 0) {
        // Third Person Chase Cam (dynamic smooth follow)
        const camDistance = loop.player.isBoosting ? 8.2 : 6.8;
        const camHeight = 4.2;

        const targetCamX = loop.player.x - Math.sin(loop.player.rotationY) * camDistance;
        const targetCamZ = loop.player.z - Math.cos(loop.player.rotationY) * camDistance;
        const targetCamY = camHeight;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, delta * 6);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, delta * 6);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, delta * 6);

        // Look at point slightly in front of calf head
        const lookTarget = new THREE.Vector3(
          loop.player.x + Math.sin(loop.player.rotationY) * 2,
          1.6,
          loop.player.z + Math.cos(loop.player.rotationY) * 2
        );
        camera.lookAt(lookTarget);

        // Dynamic FOV widening on speed boost
        const targetFOV = loop.player.isBoosting ? 74 : 60;
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, delta * 5);
        camera.updateProjectionMatrix();
      } else if (camMode === 1) {
        // Low Action Bumper Cam (close behind calf)
        const camDistance = 3.5;
        const targetCamX = loop.player.x - Math.sin(loop.player.rotationY) * camDistance;
        const targetCamZ = loop.player.z - Math.cos(loop.player.rotationY) * camDistance;
        camera.position.set(targetCamX, 2.2, targetCamZ);
        camera.lookAt(
          loop.player.x + Math.sin(loop.player.rotationY) * 3,
          1.5,
          loop.player.z + Math.cos(loop.player.rotationY) * 3
        );
      } else {
        // High Top-Down Overview Cam
        camera.position.set(loop.player.x, 32, loop.player.z + 1);
        camera.lookAt(loop.player.x, 0, loop.player.z);
      }

      // Render Scene
      renderer.render(scene, camera);

      // Update UI HUD at 20fps for performance
      uiUpdateTimer += delta;
      if (uiUpdateTimer > 0.05) {
        uiUpdateTimer = 0;
        setHudSpeed(loop.player.speed);
        setBoostMeter(loop.player.boostMeter);
        setHealth(loop.player.health);
        setIsDrifting(loop.player.isDrifting);
        setIsBoosting(loop.player.isBoosting);
        setStats({ ...loop.statsRef });
        setPlayerPos({
          x: loop.player.x,
          z: loop.player.z,
          angle: loop.player.rotationY,
        });

        if (gameMode === 'grand_prix') {
          // Calculate rank
          const rivalsBehind = loop.rivals.filter(
            (r) => r.lap < loop.currentLapRef || (r.lap === loop.currentLapRef && r.currentCheckpoint < loop.passedCheckpoints.size)
          ).length;
          setRaceRank(4 - rivalsBehind);
          setRivalsPos(loop.rivals.map((r) => ({ x: r.calf.x, z: r.calf.z, name: r.name })));
        }
      }
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      physics.dispose();
      renderer.dispose();
      gameLoopRef.current = null;
    };
  }, [gameMode, selectedCalf, handleMooHorn, handleToggleCamera]);

  // Restart handler
  const handleRestart = () => {
    sound.playBell();
    setGameOverState({ show: false, isVictory: false, reason: '' });
    if (gameLoopRef.current) {
      const loop = gameLoopRef.current;
      loop.player.x = loop.world.spawnPoint.x;
      loop.player.z = loop.world.spawnPoint.z;
      loop.player.rotationY = loop.world.spawnPoint.rotY;
      loop.player.speed = 0;
      loop.player.health = 100;
      loop.player.boostMeter = 80;
      loop.player.isStunned = false;
      loop.currentLapRef = 1;
      loop.passedCheckpoints.clear();
      loop.statsRef = {
        score: 0,
        damageCost: 0,
        shelvesDestroyed: 0,
        itemsCollected: 0,
        currentLap: 1,
        totalLaps: 3,
        timeElapsed: 0,
        maxSpeed: 0,
        driftPoints: 0,
      };

      // Reset shelves
      for (const s of loop.world.shelves) {
        s.health = 100;
        s.isCollapsed = false;
        s.wobbleIntensity = 0;
        if (s.meshGroup) {
          s.meshGroup.position.y = 0;
          s.meshGroup.rotation.z = 0;
          s.meshGroup.rotation.x = 0;
        }
      }

      // Reset pickups
      for (const p of loop.world.pickups) {
        p.collected = false;
        if (p.mesh) p.mesh.visible = true;
      }

      // Reset targets
      for (const t of loop.targetsRef) {
        t.collected = 0;
      }
      setShoppingTargets([...loop.targetsRef]);

      loop.running = true;
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 2D HUD Overlay */}
      <GameHUD
        gameMode={gameMode}
        stats={stats}
        timeLimit={120}
        shoppingTargets={shoppingTargets}
        speed={hudSpeed}
        boostMeter={boostMeter}
        health={health}
        isDrifting={isDrifting}
        isBoosting={isBoosting}
        raceRank={raceRank}
        shelves={shelvesState}
        playerPos={playerPos}
        rivalsPos={rivalsPos}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onToggleCamera={handleToggleCamera}
        onRestart={handleRestart}
        onMooHorn={handleMooHorn}
        onVirtualControl={handleVirtualControl}
      />

      {/* Game Over / Victory Modal */}
      {gameOverState.show && (
        <GameOverModal
          isVictory={gameOverState.isVictory}
          reason={gameOverState.reason}
          stats={stats}
          gameMode={gameMode}
          onPlayAgain={handleRestart}
          onReturnToMenu={onReturnToMenu}
        />
      )}
    </div>
  );
};
