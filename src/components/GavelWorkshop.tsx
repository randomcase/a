import React from 'react';
import { GavelModel } from '../types';
import { playStampSound, playGavelDoubleStrike } from '../utils/audio';
import { Gavel, Check, Lock, Sparkles, Award } from 'lucide-react';

interface GavelWorkshopProps {
  gavels: GavelModel[];
  activeGavelId: string;
  precedent: number;
  onSelectGavel: (gavelId: string) => void;
  onBuyGavel: (gavelId: string) => void;
}

export const GavelWorkshop: React.FC<GavelWorkshopProps> = ({
  gavels,
  activeGavelId,
  precedent,
  onSelectGavel,
  onBuyGavel,
}) => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 text-stone-100 shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950 border border-amber-800/40 text-amber-400">
              <Gavel className="h-5 w-5" />
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-400">
                Chambers Woodcraft Armory
              </div>
              <h3 className="font-serif-legal text-lg font-bold text-stone-100">
                Judicial Gavels & Anvil Sound Blocks
              </h3>
            </div>
          </div>
          <div className="text-xs text-stone-400">
            Higher tier gavels deliver explosive striking force and increased Summary Judgment crit rates.
          </div>
        </div>

        {/* Gavels Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {gavels.map((gavel) => {
            const isEquipped = gavel.id === activeGavelId;
            const canAfford = precedent >= gavel.cost;

            return (
              <div
                key={gavel.id}
                className={`flex flex-col justify-between p-4 rounded-lg border transition-all ${
                  isEquipped
                    ? 'border-amber-500 bg-stone-950 ring-1 ring-amber-500/40 shadow-lg'
                    : gavel.unlocked
                    ? 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    : 'border-stone-850 bg-stone-950/40 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif-legal text-base font-bold text-stone-100">
                          {gavel.name}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-amber-400/80">
                        {gavel.woodType}
                      </div>
                    </div>
                    {isEquipped && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-stone-950 bg-amber-400 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                        <Check className="h-3 w-3" /> Equipped
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {gavel.description}
                  </p>

                  <div className="mt-3 rounded bg-stone-900/90 p-2 text-xs space-y-1 border border-stone-800">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Strike Power:</span>
                      <span className="font-mono-code font-bold text-amber-300">+{gavel.basePower}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Crit Chance:</span>
                      <span className="font-mono-code font-bold text-amber-300">
                        {Math.round(gavel.critChance * 100)}% (x{gavel.critMultiplier})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Sound Block:</span>
                      <span className="font-mono-code text-[11px] text-stone-300">{gavel.soundblockMaterial}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
                  {isEquipped ? (
                    <div className="text-xs text-amber-400 font-semibold italic">
                      Currently on the Bench
                    </div>
                  ) : gavel.unlocked ? (
                    <button
                      onClick={() => {
                        playStampSound();
                        onSelectGavel(gavel.id);
                      }}
                      className="rounded bg-stone-800 px-4 py-1.5 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-colors"
                    >
                      Equip to Bench
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          playGavelDoubleStrike();
                          onBuyGavel(gavel.id);
                        }
                      }}
                      disabled={!canAfford}
                      className={`flex items-center gap-1.5 rounded px-4 py-1.5 text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-amber-600 text-stone-950 hover:bg-amber-500 active:scale-95 cursor-pointer'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Unlock ({gavel.cost.toLocaleString()})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
