import React, { useEffect, useRef } from 'react';
import { GameMode, GameStats, ShoppingTarget, ShelfObject } from '../game/types.ts';
import { Volume2, VolumeX, Camera, RotateCcw, Bell, Zap, Flame, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface GameHUDProps {
  gameMode: GameMode;
  stats: GameStats;
  timeLimit?: number; // for grocery dash
  shoppingTargets?: ShoppingTarget[];
  speed: number;
  boostMeter: number;
  health: number;
  isDrifting: boolean;
  isBoosting: boolean;
  raceRank?: number;
  shelves: ShelfObject[];
  playerPos: { x: number; z: number; angle: number };
  rivalsPos?: { x: number; z: number; name: string }[];
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onRestart: () => void;
  onMooHorn: () => void;
  // Mobile controls dispatch
  onVirtualControl?: (control: 'forward' | 'backward' | 'left' | 'right' | 'drift' | 'boost', active: boolean) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameMode,
  stats,
  timeLimit = 120,
  shoppingTargets = [],
  speed,
  boostMeter,
  health,
  isDrifting,
  isBoosting,
  raceRank = 1,
  shelves,
  playerPos,
  rivalsPos = [],
  isMuted,
  onToggleMute,
  onToggleCamera,
  onRestart,
  onMooHorn,
  onVirtualControl,
}) => {
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [touchActive, setTouchActive] = React.useState(false);

  // Detect touch device
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setTouchActive(true);
    }
  }, []);

  // Render Minimap Radar
  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, h);

    // Map bounds: X: -45 to 45, Z: -55 to 55
    const toMapX = (x: number) => ((x + 45) / 90) * w;
    const toMapY = (z: number) => ((z + 55) / 110) * h;

    // Draw shelves as grey/colored blocks
    for (const shelf of shelves) {
      const sx = toMapX(shelf.x - shelf.width / 2);
      const sy = toMapY(shelf.z - shelf.depth / 2);
      const sw = (shelf.width / 90) * w;
      const sh = (shelf.depth / 110) * h;

      if (shelf.isCollapsed) {
        ctx.fillStyle = '#ef4444'; // Red crashed shelf
      } else {
        ctx.fillStyle = shelf.color || '#475569';
      }
      ctx.fillRect(sx, sy, Math.max(3, sw), Math.max(4, sh));
    }

    // Draw AI rivals
    for (const rival of rivalsPos) {
      const rx = toMapX(rival.x);
      const ry = toMapY(rival.z);
      ctx.fillStyle = '#f59e0b'; // Amber rival dot
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Player Calf (Bright Blue/Cyan triangle oriented with rotation)
    const px = toMapX(playerPos.x);
    const py = toMapY(playerPos.z);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-playerPos.angle);

    // Player arrow
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.lineTo(-5, -5);
    ctx.lineTo(5, -5);
    ctx.closePath();
    ctx.fill();

    // Pulse ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }, [shelves, playerPos, rivalsPos]);

  const displaySpeed = Math.round(Math.abs(speed) * 2.2); // mph
  const timeLeft = Math.max(0, Math.round(timeLimit - stats.timeElapsed));
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-6 select-none overflow-hidden font-sans">
      {/* TOP BAR: Header stats & quick actions */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Left: Mode specifics & Damage Bill */}
        <div className="flex flex-col gap-2">
          {/* Supermarket Damage Counter ($) */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white shadow-lg">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Damage Bill:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                ${stats.damageCost.toLocaleString()}
              </span>
              {stats.shelvesDestroyed > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px]">
                  {stats.shelvesDestroyed} {stats.shelvesDestroyed === 1 ? 'shelf' : 'shelves'} crashed
                </span>
              )}
            </div>
          </div>

          {/* Mode 1: Grocery Dash Checklist */}
          {gameMode === 'grocery_dash' && (
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white shadow-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Grocery Shopping List</span>
                <span className="font-mono text-amber-400">Time: {formatTime(timeLeft)}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {shoppingTargets.map((t) => {
                  const done = t.collected >= t.needed;
                  return (
                    <div
                      key={t.item.id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
                        done
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 line-through'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <span>{t.item.icon}</span>
                      <span>{t.item.name}</span>
                      <span className="font-mono font-bold ml-1">
                        ({t.collected}/{t.needed})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Grand Prix Laps & Position */}
          {gameMode === 'grand_prix' && (
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white shadow-lg">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Position:</span>
                <span className="font-bold text-amber-400 text-base">{getRankSuffix(raceRank)}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="text-xs">
                <span className="text-slate-400">Lap: </span>
                <span className="font-mono font-bold text-white text-sm">
                  {stats.currentLap} / {stats.totalLaps}
                </span>
              </div>
            </div>
          )}

          {/* Mode 3: Shelf Survival Points */}
          {gameMode === 'free_roam' && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white shadow-lg">
              <span className="text-xs text-slate-400">Grocery Points:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {stats.score.toLocaleString()} pts
              </span>
            </div>
          )}
        </div>

        {/* Right: Action Buttons & Minimap */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMooHorn}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-800 backdrop-blur-md shadow-lg transition-transform active:scale-95"
              title="Moo Horn & Bell (Key: H)"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleCamera}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg transition-transform active:scale-95"
              title="Change Camera View (Key: C)"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg transition-transform active:scale-95"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onRestart}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg transition-transform active:scale-95"
              title="Restart / Exit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Supermarket Minimap Radar */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950/80 backdrop-blur-md p-1">
            <canvas ref={minimapCanvasRef} width={130} height={150} className="block rounded-lg" />
            <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Store Map
            </div>
          </div>
        </div>
      </div>

      {/* CENTER POPUPS (Drift Alert / Boost Notification) */}
      <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
        {isDrifting && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/80 text-black font-extrabold text-xs shadow-lg uppercase tracking-wider animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>AISLE DRIFT!</span>
          </div>
        )}
        {isBoosting && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/80 text-white font-extrabold text-xs shadow-lg uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>MOO NITRO BOOST!</span>
          </div>
        )}
      </div>

      {/* BOTTOM BAR: Speedometer, Health, Nitro Boost, and Mobile Controls */}
      <div className="flex items-end justify-between gap-4 pointer-events-auto">
        {/* Left: Calf Crash Health & Boost Gauges */}
        <div className="p-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-2xl w-60 space-y-2.5">
          {/* Calf Health / Shelf Crash Integrity */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mb-1">
              <span>Calf Crash Integrity</span>
              <span className={`font-mono ${health < 30 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                {Math.round(health)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  health > 50
                    ? 'bg-emerald-500'
                    : health > 25
                    ? 'bg-amber-500'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, health))}%` }}
              />
            </div>
          </div>

          {/* Moo Nitro Boost Energy */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                <span>Moo Boost Meter</span>
              </span>
              <span className="font-mono text-sky-300">{Math.round(boostMeter)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, boostMeter))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Digital Speedometer Dial */}
        <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-2xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Speed</div>
            <div className="font-mono font-black text-3xl md:text-4xl text-sky-400 leading-none">
              {displaySpeed}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">MPH</div>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <button
            onClick={onMooHorn}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <span className="text-xl">🐮</span>
            <span className="text-[9px] uppercase tracking-tighter">MOO!</span>
          </button>
        </div>
      </div>

      {/* TOUCH / MOBILE ON-SCREEN CONTROLS */}
      {touchActive && onVirtualControl && (
        <div className="absolute inset-x-0 bottom-24 pointer-events-none flex justify-between px-6 z-40">
          {/* Steer Left / Right */}
          <div className="flex gap-3 pointer-events-auto">
            <button
              onTouchStart={() => onVirtualControl('left', true)}
              onTouchEnd={() => onVirtualControl('left', false)}
              className="w-16 h-16 rounded-2xl bg-slate-900/85 active:bg-slate-700 text-white font-bold text-2xl border border-slate-700 backdrop-blur-md flex items-center justify-center select-none"
            >
              ◀
            </button>
            <button
              onTouchStart={() => onVirtualControl('right', true)}
              onTouchEnd={() => onVirtualControl('right', false)}
              className="w-16 h-16 rounded-2xl bg-slate-900/85 active:bg-slate-700 text-white font-bold text-2xl border border-slate-700 backdrop-blur-md flex items-center justify-center select-none"
            >
              ▶
            </button>
          </div>

          {/* Gas, Brake & Drift */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onTouchStart={() => onVirtualControl('drift', true)}
              onTouchEnd={() => onVirtualControl('drift', false)}
              className="w-14 h-14 rounded-xl bg-amber-600/90 active:bg-amber-500 text-white font-bold text-xs border border-amber-400 backdrop-blur-md flex items-center justify-center select-none"
            >
              DRIFT
            </button>
            <button
              onTouchStart={() => onVirtualControl('backward', true)}
              onTouchEnd={() => onVirtualControl('backward', false)}
              className="w-14 h-14 rounded-xl bg-rose-700/85 active:bg-rose-600 text-white font-bold text-xs border border-rose-500 backdrop-blur-md flex items-center justify-center select-none"
            >
              BRAKE
            </button>
            <button
              onTouchStart={() => onVirtualControl('forward', true)}
              onTouchEnd={() => onVirtualControl('forward', false)}
              className="w-16 h-16 rounded-2xl bg-emerald-600/90 active:bg-emerald-500 text-white font-bold text-xl border border-emerald-400 backdrop-blur-md flex items-center justify-center select-none"
            >
              GAS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
