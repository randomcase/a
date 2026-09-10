import React, { useState, useEffect, useRef } from 'react';
import { GavelModel } from '../types';
import { playGavelStrike, playGavelDoubleStrike } from '../utils/audio';
import { Flame, Sparkles, Zap, Award } from 'lucide-react';

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
  isCrit: boolean;
}

interface GavelBenchProps {
  activeGavel: GavelModel;
  onGavelStrike: (amount: number, isCrit: boolean) => void;
  courtMultiplier: number;
  styleMultiplier: number;
}

export const GavelBench: React.FC<GavelBenchProps> = ({
  activeGavel,
  onGavelStrike,
  courtMultiplier,
  styleMultiplier,
}) => {
  const [isStriking, setIsStriking] = useState(false);
  const [comboMeter, setComboMeter] = useState(0); // 0 to 100
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const benchRef = useRef<HTMLDivElement>(null);
  const strikeCountRef = useRef(0);

  // Decay combo meter over time
  useEffect(() => {
    const timer = setInterval(() => {
      setComboMeter((prev) => Math.max(0, prev - 3));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: Spacebar strikes gavel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        triggerStrike();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGavel, courtMultiplier, styleMultiplier, comboMeter]);

  const triggerStrike = (e?: React.MouseEvent) => {
    setIsStriking(true);
    strikeCountRef.current += 1;

    // Determine Crit ("Summary Judgment")
    const isCrit = Math.random() < activeGavel.critChance;
    const comboBonus = 1 + (comboMeter / 100) * 0.8; // up to +80% during frenzy
    const baseGain = activeGavel.basePower * courtMultiplier * styleMultiplier * comboBonus;
    const totalGain = Math.round(isCrit ? baseGain * activeGavel.critMultiplier : baseGain);

    if (isCrit) {
      playGavelDoubleStrike();
    } else {
      playGavelStrike(Math.min(1.4, 0.9 + comboMeter / 120));
    }

    onGavelStrike(totalGain, isCrit);

    // Increase combo
    setComboMeter((prev) => Math.min(100, prev + 12));

    // Floating text coordinate
    const rect = benchRef.current?.getBoundingClientRect();
    const x = e ? e.clientX - (rect?.left || 0) : 170 + (Math.random() * 40 - 20);
    const y = e ? e.clientY - (rect?.top || 0) : 130 + (Math.random() * 20 - 10);

    const newId = Date.now() + Math.random();
    setFloatingNumbers((prev) => [...prev.slice(-12), { id: newId, x, y, value: totalGain, isCrit }]);

    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((item) => item.id !== newId));
    }, 900);

    setTimeout(() => {
      setIsStriking(false);
    }, 140);
  };

  const isFrenzy = comboMeter >= 80;

  return (
    <div
      ref={benchRef}
      className="relative flex flex-col items-center justify-between rounded-xl border border-amber-950/20 bg-gradient-to-b from-[#2b1810] to-[#1a0e0a] p-5 text-amber-50 shadow-xl overflow-hidden select-none"
    >
      {/* Background Courtroom Bench Paneling */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Floating text elements */}
      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          style={{ left: `${num.x}px`, top: `${num.y}px` }}
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono-code font-bold transition-all duration-700 ease-out animate-bounce z-30 ${
            num.isCrit
              ? 'text-amber-300 text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]'
              : 'text-amber-100 text-sm sm:text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
          }`}
        >
          +{num.value.toLocaleString()} {num.isCrit ? '⚖️ SUMMARY JUDGMENT!' : ''}
        </div>
      ))}

      {/* Top Banner & Active Gavel Details */}
      <div className="w-full flex items-center justify-between z-10 border-b border-amber-900/40 pb-3">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span className="font-cinzel text-xs tracking-wider text-amber-200 font-bold uppercase">
            {activeGavel.name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-code text-amber-300/90">
          <span>PWR: {activeGavel.basePower}</span>
          <span>•</span>
          <span>CRIT: {Math.round(activeGavel.critChance * 100)}%</span>
        </div>
      </div>

      {/* Frenzy / Order in the Court Meter */}
      <div className="w-full my-2 z-10">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="flex items-center gap-1 font-semibold tracking-wider text-amber-200/90 uppercase">
            <Flame className={`h-3.5 w-3.5 ${isFrenzy ? 'text-orange-400 animate-pulse' : 'text-amber-500'}`} />
            Order In The Court! {isFrenzy && <span className="text-orange-400 font-bold tracking-widest">(2X FRENZY)</span>}
          </span>
          <span className="font-mono-code text-amber-400 text-xs font-bold">{comboMeter}%</span>
        </div>
        <div className="w-full bg-stone-900/80 rounded-full h-2 overflow-hidden border border-amber-900/40 shadow-inner">
          <div
            className={`h-full transition-all duration-150 ${
              isFrenzy
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-amber-800 to-amber-500'
            }`}
            style={{ width: `${comboMeter}%` }}
          />
        </div>
      </div>

      {/* Interactive Gavel and Soundblock Canvas */}
      <button
        id="idle-gavel-strike-target"
        onClick={(e) => triggerStrike(e)}
        className="relative group w-full py-4 my-2 flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-[0.98] outline-none"
        title="Click or press Space to strike the gavel"
      >
        {/* Shockwave effect on strike */}
        {isStriking && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-amber-400/80 animate-shockwave pointer-events-none" />
        )}

        {/* 3D Visual Gavel Construction */}
        <div className="relative w-64 h-48 flex items-center justify-center">
          {/* Gavel Apparatus */}
          <div
            className={`transition-transform duration-100 ease-in-out origin-[200px_130px] ${
              isStriking ? 'rotate-[-32deg] translate-y-3' : 'rotate-[-6deg] group-hover:rotate-[-10deg]'
            }`}
          >
            {/* Gavel Head */}
            <div className="relative">
              {/* Cylinder head */}
              <div
                className="w-28 h-12 rounded-lg shadow-2xl border border-amber-950/70 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #290f03 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 8px 16px rgba(0,0,0,0.6)',
                }}
              >
                {/* Brass / Accent Center Band */}
                <div
                  className="absolute inset-y-0 left-9 w-10 border-x border-amber-300/40 shadow-sm"
                  style={{
                    background: `linear-gradient(90deg, #b45309, ${activeGavel.accentColor}, #d97706)`,
                  }}
                />
                {/* Wood grain highlights */}
                <div className="absolute top-1 left-2 right-2 h-[2px] bg-amber-200/30 rounded-full" />
                <div className="absolute bottom-1 left-2 right-2 h-[2px] bg-black/40 rounded-full" />
              </div>

              {/* Striking Faces (Left & Right beveled caps) */}
              <div className="absolute -left-2 top-0.5 w-3 h-11 rounded-l-md bg-amber-950 border-r border-amber-800/60 shadow-inner" />
              <div className="absolute -right-2 top-0.5 w-3 h-11 rounded-r-md bg-amber-950 border-l border-amber-800/60 shadow-inner" />
            </div>

            {/* Gavel Handle */}
            <div
              className="absolute left-[50px] top-[46px] w-5 h-28 rounded-b-xl border-x border-amber-950 shadow-xl overflow-hidden origin-top"
              style={{
                background: 'linear-gradient(90deg, #78350f 0%, #92400e 45%, #451a03 100%)',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2), 4px 6px 12px rgba(0,0,0,0.5)',
              }}
            >
              {/* Grip accents */}
              <div className="absolute bottom-3 inset-x-0 h-10 border-y border-amber-400/40 bg-amber-900/50" />
              <div className="absolute bottom-5 inset-x-0 h-1 bg-amber-400/40" />
            </div>
          </div>

          {/* Sound Block (Stationary impact base) */}
          <div className="absolute bottom-2 flex flex-col items-center">
            {/* Beveled Rim */}
            <div
              className={`w-36 h-9 rounded-xl border border-amber-950/80 shadow-2xl relative transition-transform ${
                isStriking ? 'scale-95 translate-y-0.5' : 'scale-100'
              }`}
              style={{
                background: 'linear-gradient(180deg, #78350f 0%, #451a03 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.25), 0 10px 20px rgba(0,0,0,0.7)',
              }}
            >
              {/* Center Strike Inlay / Brass Ring */}
              <div
                className="absolute inset-x-4 top-1 bottom-1 rounded-lg border border-amber-400/30 flex items-center justify-center shadow-inner"
                style={{
                  background: 'radial-gradient(circle, #92400e 0%, #451a03 90%)',
                }}
              >
                <div className="text-[9px] font-cinzel font-bold text-amber-300/40 tracking-widest">
                  LEX & IUSTITIA
                </div>
              </div>
            </div>

            {/* Base Plinth */}
            <div className="w-44 h-3.5 bg-[#1f0d06] rounded-b-xl border-t border-amber-900/30 shadow-lg" />
          </div>
        </div>

        {/* Prompt label */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
          <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>Click to Strike Gavel (or press Spacebar)</span>
        </div>
      </button>

      {/* Multipliers & Bench Status */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-amber-900/30 text-center text-xs">
        <div className="rounded bg-black/30 p-1.5 border border-amber-900/20">
          <div className="text-[10px] text-amber-400/70 font-medium uppercase">Court Multiplier</div>
          <div className="font-mono-code font-bold text-amber-300">{courtMultiplier.toFixed(1)}x</div>
        </div>
        <div className="rounded bg-black/30 p-1.5 border border-amber-900/20">
          <div className="text-[10px] text-amber-400/70 font-medium uppercase">Style Mastery</div>
          <div className="font-mono-code font-bold text-amber-300">{styleMultiplier.toFixed(2)}x</div>
        </div>
        <div className="rounded bg-black/30 p-1.5 border border-amber-900/20">
          <div className="text-[10px] text-amber-400/70 font-medium uppercase">Per Strike</div>
          <div className="font-mono-code font-bold text-amber-300">
            ~{Math.round(activeGavel.basePower * courtMultiplier * styleMultiplier).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
