import React from 'react';
import { ChamberStaff, CourtTier } from '../types';
import { COURT_TIERS } from '../data/courtTiers';
import { playStampSound, playPrecedentFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Keyboard,
  GraduationCap,
  Shield,
  BookOpen,
  Scroll,
  Crown,
  Scale,
  Users,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface CourtChambersProps {
  staffList: ChamberStaff[];
  precedent: number;
  currentTier: CourtTier;
  onHireStaff: (staffId: string) => void;
  onElevateCourt: (newTier: CourtTier) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Keyboard,
  GraduationCap,
  Shield,
  BookOpen,
  Scroll,
  Crown,
  Scale,
};

export const CourtChambers: React.FC<CourtChambersProps> = ({
  staffList,
  precedent,
  currentTier,
  onHireStaff,
  onElevateCourt,
}) => {
  const currentCourt = COURT_TIERS[currentTier];

  const nextTierKey: CourtTier | null =
    currentTier === 'district' ? 'circuit' : currentTier === 'circuit' ? 'supreme' : null;
  const nextCourt = nextTierKey ? COURT_TIERS[nextTierKey] : null;
  const canElevate = nextCourt ? precedent >= nextCourt.requiredPrecedent : false;

  const handleElevate = () => {
    if (!nextTierKey || !canElevate) return;
    playPrecedentFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#78350f', '#0284c7', '#ffffff'],
    });
    onElevateCourt(nextTierKey);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* Court Elevation Banner */}
      {nextCourt && (
        <div
          className={`rounded-xl border-2 p-5 shadow-lg transition-all ${
            canElevate
              ? 'border-amber-500 bg-gradient-to-r from-amber-900/40 via-stone-900 to-amber-950 text-white ring-2 ring-amber-400/40'
              : 'border-stone-800 bg-stone-900/80 text-stone-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-400">
                  Judicial Nomination & Elevation
                </span>
                {canElevate && (
                  <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-stone-950 uppercase tracking-wide animate-pulse">
                    Ready for Senate Confirmation
                  </span>
                )}
              </div>
              <h3 className="font-serif-legal text-xl font-bold text-stone-100">
                Ascend to {nextCourt.name}
              </h3>
              <p className="text-xs text-stone-400 max-w-xl">
                {nextCourt.description} (Permanent {nextCourt.multiplier}x Jurisprudence Multiplier)
              </p>
            </div>

            <button
              onClick={handleElevate}
              disabled={!canElevate}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                canElevate
                  ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 active:scale-95 cursor-pointer shadow-amber-500/20'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>
                {canElevate
                  ? `Accept Appointment to ${nextCourt.name}`
                  : `Requires ${nextCourt.requiredPrecedent.toLocaleString()} Precedent`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Chamber Staff Roster */}
      <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 text-stone-100 shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950 border border-amber-800/40 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-400">
                Judicial Chambers Automation
              </div>
              <h3 className="font-serif-legal text-lg font-bold text-stone-100">
                Law Clerks, Stenographers & Bench Officers
              </h3>
            </div>
          </div>
          <div className="text-xs text-stone-400">
            Chamber staff draft filings and citation cross-checks automatically.
          </div>
        </div>

        {/* Staff Cards Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {staffList.map((staff) => {
            const Icon = ICON_MAP[staff.iconName] || Users;
            const currentCost = Math.round(staff.cost * Math.pow(staff.costMultiplier, staff.count));
            const canAfford = precedent >= currentCost;
            const isCourtTierUnlocked =
              staff.court === 'district'
                ? true
                : staff.court === 'circuit'
                ? currentTier === 'circuit' || currentTier === 'supreme'
                : currentTier === 'supreme';

            return (
              <div
                key={staff.id}
                className={`flex flex-col justify-between p-4 rounded-lg border transition-all ${
                  !isCourtTierUnlocked
                    ? 'opacity-40 border-stone-800 bg-stone-950/40'
                    : 'border-stone-800 bg-stone-950/80 hover:border-amber-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-900/30 bg-amber-950/50 text-amber-400 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif-legal font-bold text-stone-200 text-base">
                          {staff.name}
                        </span>
                        <span className="font-mono-code text-xs font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded">
                          x{staff.count}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-stone-400">
                        {staff.title}
                      </div>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        {staff.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-stone-400">Output: </span>
                    <span className="font-mono-code font-bold text-amber-300">
                      +{(staff.precedentPerSec * currentCourt.multiplier).toFixed(1)}/s each
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (canAfford && isCourtTierUnlocked) {
                        playStampSound();
                        onHireStaff(staff.id);
                      }
                    }}
                    disabled={!canAfford || !isCourtTierUnlocked}
                    className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                      !isCourtTierUnlocked
                        ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-600 text-stone-950 hover:bg-amber-500 active:scale-95 shadow-sm'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                    }`}
                  >
                    <span>Hire ({currentCost.toLocaleString()})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
