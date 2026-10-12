import React from 'react';
import { GameMode, CalfSkin } from '../game/types.ts';
import { CALF_ROSTER } from '../game/calf.ts';
import { sound } from '../game/audio.ts';
import { Volume2, VolumeX, Trophy, ShoppingBag, ShieldAlert, Zap, Compass, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStartGame: (mode: GameMode, selectedCalf: CalfSkin) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
}) => {
  const [selectedMode, setSelectedMode] = React.useState<GameMode>('grocery_dash');
  const [selectedCalfId, setSelectedCalfId] = React.useState<string>(CALF_ROSTER[0].id);

  const selectedCalf = CALF_ROSTER.find((c) => c.id === selectedCalfId) || CALF_ROSTER[0];

  const handleStart = () => {
    sound.playBell();
    sound.playMoo();
    sound.startMusic();
    onStartGame(selectedMode, selectedCalf);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-6 md:p-8 text-white overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-300 uppercase mb-1">
                <span>3D Arcade Grocery Racing</span>
                <span>·</span>
                <span>Bovine Chaos Edition</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Supermarket Calf Grand Prix
              </h1>
              <p className="text-sm md:text-base text-blue-100 mt-1 max-w-xl">
                Steer nimble calves through grocery aisles turned into high-speed race tracks!
                Dodge towering shelves, collect groceries, and don't wipe out into the cereal racks!
              </p>
            </div>

            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors border border-white/20 text-white"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-200" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* 1. Game Mode Selection */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
              1. Select Game Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode('grocery_dash')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedMode === 'grocery_dash'
                    ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <ShoppingBag className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Shopping Rush</span>
                </div>
                <div className="text-base font-semibold text-white">Grocery Dash</div>
                <p className="text-xs text-slate-400 mt-1">
                  Collect items from your grocery list across dairy & produce aisles against the clock!
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('grand_prix')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedMode === 'grand_prix'
                    ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">3 Laps Circuit</span>
                </div>
                <div className="text-base font-semibold text-white">Grand Prix Race</div>
                <p className="text-xs text-slate-400 mt-1">
                  Race 3 laps against Daisy Drift & AI calves through store aisles! Drift corners to boost.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('free_roam')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedMode === 'free_roam'
                    ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ShieldAlert className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Endless Chaos</span>
                </div>
                <div className="text-base font-semibold text-white">Shelf Survival</div>
                <p className="text-xs text-slate-400 mt-1">
                  Free-roam demolition fun! See how long you survive without triggering a store-wide shelf collapse!
                </p>
              </button>
            </div>
          </div>

          {/* 2. Calf Racer Selection */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
              2. Choose Your Racing Calf
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CALF_ROSTER.map((c) => {
                const isSelected = selectedCalfId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCalfId(c.id);
                      sound.playBell();
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg mb-2.5 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: c.bodyColor }}
                    >
                      {/* Stylized Calf Graphic */}
                      <div className="w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center font-bold text-lg"
                        style={{ backgroundColor: c.accentColor, color: '#ffffff' }}
                      >
                        🐮
                      </div>
                      <div
                        className="absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: c.spotColor }}
                      />
                    </div>

                    <div className="font-semibold text-white text-sm truncate">{c.name}</div>
                    
                    {/* Stat bars */}
                    <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between items-center">
                        <span>Speed</span>
                        <span className="font-mono text-slate-300">{'★'.repeat(c.speed)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Grip / Drift</span>
                        <span className="font-mono text-slate-300">{'★'.repeat(c.handling)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Armor</span>
                        <span className="font-mono text-slate-300">{'★'.repeat(c.durability)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Calf summary */}
            <div className="mt-3 p-3 bg-slate-800/30 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">{selectedCalf.name}</strong>: {selectedCalf.description}
              </span>
            </div>
          </div>

          {/* 3. Controls Reference */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Drive Controls</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">W / ↑</span>
                <span>Accelerate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">A / D / ← →</span>
                <span>Steer Hooves</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">SPACE</span>
                <span>Drift Corner</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">SHIFT / H</span>
                <span>Moo Boost / Horn</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
          >
            <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
            <span>START SUPERMARKET RACE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
