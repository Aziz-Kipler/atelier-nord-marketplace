import React, { useEffect } from 'react';
import { GameStats, GameMode } from '../game/types.ts';
import { RotateCcw, Home, Award, ShieldAlert, Sparkles, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../game/audio.ts';

interface GameOverModalProps {
  isVictory: boolean;
  reason: string;
  stats: GameStats;
  gameMode: GameMode;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  reason,
  stats,
  gameMode,
  onPlayAgain,
  onReturnToMenu,
}) => {
  useEffect(() => {
    if (isVictory) {
      sound.playBell();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playShelfHit(0.9);
    }
  }, [isVictory]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.round(s % 60);
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div
          className={`p-6 text-center text-white relative ${
            isVictory
              ? 'bg-gradient-to-b from-emerald-600 to-teal-700'
              : 'bg-gradient-to-b from-rose-600 to-red-800'
          }`}
        >
          <div className="text-4xl mb-2">{isVictory ? '🏆' : '💥'}</div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            {isVictory ? 'Checkout Victor!' : 'Cleanup on Aisle 4!'}
          </h2>
          <p className="text-xs md:text-sm text-white/90 mt-1 max-w-md mx-auto">
            {reason}
          </p>
        </div>

        {/* Supermarket Damage Invoice & Stats */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-2">
              <span className="font-semibold uppercase tracking-wider">Supermarket Incident Invoice</span>
              <span>Ref: #CALF-99</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Total Damage Bill</span>
                <span className="font-mono font-bold text-lg text-rose-400">
                  ${stats.damageCost.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Shelves Collapsed</span>
                <span className="font-mono font-bold text-lg text-amber-400">
                  {stats.shelvesDestroyed}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Groceries Collected</span>
                <span className="font-mono font-bold text-lg text-sky-400">
                  {stats.itemsCollected} items
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Race Time</span>
                <span className="font-mono font-bold text-lg text-slate-200">
                  {formatTime(stats.timeElapsed)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-300">Final Store Score</span>
              <span className="font-mono font-black text-amber-300 text-lg">
                {stats.score.toLocaleString()} PTS
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onReturnToMenu}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Menu</span>
            </button>

            <button
              onClick={onPlayAgain}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Drive Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
