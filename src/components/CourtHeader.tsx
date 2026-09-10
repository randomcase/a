import React from 'react';
import { Scale, Volume2, VolumeX, Landmark, Award, BookOpen, Sparkles } from 'lucide-react';
import { CourtTierInfo, CourtTier } from '../types';
import { COURT_TIERS } from '../data/courtTiers';

interface CourtHeaderProps {
  currentTier: CourtTier;
  precedent: number;
  precedentPerSec: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  casesDecidedCount: number;
  styleMasteredCount: number;
  onSelectCourtTier: (tier: CourtTier) => void;
}

export const CourtHeader: React.FC<CourtHeaderProps> = ({
  currentTier,
  precedent,
  precedentPerSec,
  soundEnabled,
  onToggleSound,
  casesDecidedCount,
  styleMasteredCount,
  onSelectCourtTier,
}) => {
  const currentCourt = COURT_TIERS[currentTier];
  const nextTierKey: CourtTier | null =
    currentTier === 'district' ? 'circuit' : currentTier === 'circuit' ? 'supreme' : null;
  const nextCourt: CourtTierInfo | null = nextTierKey ? COURT_TIERS[nextTierKey] : null;

  const progressPercent = nextCourt
    ? Math.min(100, Math.floor((precedent / nextCourt.requiredPrecedent) * 100))
    : 100;

  return (
    <header className="border-b border-amber-900/20 bg-stone-900 text-stone-100 shadow-md">
      {/* Top Bar with Federal Seal aesthetic */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/60 text-amber-400 shadow-inner">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold tracking-widest text-amber-400/90">
                {currentCourt.badge}
              </span>
              <span className="rounded bg-amber-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200 uppercase tracking-wide">
                {currentCourt.name}
              </span>
            </div>
            <h1 className="font-serif-legal text-lg font-semibold tracking-tight text-stone-100 sm:text-xl">
              {currentCourt.judgeTitle}
            </h1>
          </div>
        </div>

        {/* Currency & Idle Rate */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-950/70 px-4 py-1.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
                Jurisprudence Precedent
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono-code text-xl font-bold text-amber-300">
                  {Math.floor(precedent).toLocaleString()}
                </span>
                <span className="text-xs text-amber-400/80 font-medium">
                  +{precedentPerSec >= 10 ? Math.floor(precedentPerSec).toLocaleString() : precedentPerSec.toFixed(1)}/s
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span>
                <strong className="text-stone-200">{casesDecidedCount}</strong> Cases Decided
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>
                <strong className="text-stone-200">{styleMasteredCount}/6</strong> Style Rules
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Courtroom Audio' : 'Unmute Courtroom Audio'}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-stone-100 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Court Tier Elevation Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950/90 px-4 py-2 text-xs sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Jurisdiction:</span>
            <div className="flex items-center gap-1">
              {(['district', 'circuit', 'supreme'] as CourtTier[]).map((tierKey) => {
                const tierInfo = COURT_TIERS[tierKey];
                const isActive = currentTier === tierKey;
                const isAvailable = precedent >= tierInfo.requiredPrecedent;

                return (
                  <button
                    key={tierKey}
                    onClick={() => {
                      if (isAvailable) onSelectCourtTier(tierKey);
                    }}
                    disabled={!isAvailable}
                    className={`rounded px-2 py-0.5 font-medium transition-all ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-sm ring-1 ring-amber-400/50'
                        : isAvailable
                        ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        : 'bg-stone-900/50 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    {tierInfo.name.replace('U.S. ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {nextCourt && (
            <div className="flex items-center gap-3">
              <span className="text-stone-400 text-[11px] hidden sm:inline">
                Elevation to <strong className="text-amber-300">{nextCourt.name}</strong> ({nextCourt.requiredPrecedent.toLocaleString()} Precedent)
              </span>
              <div className="w-28 sm:w-36 bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono-code text-[11px] text-amber-400 font-semibold">{progressPercent}%</span>
            </div>
          )}

          {!nextCourt && (
            <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Highest Judicial Authority Attained</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
