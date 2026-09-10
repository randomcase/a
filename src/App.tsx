import React, { useState, useEffect, useRef } from 'react';
import {
  CourtTier,
  CaseFolder,
  StyleManualRule,
  GavelModel,
  ChamberStaff,
  RulingDecision,
  GameStats,
} from './types';
import { COURT_TIERS } from './data/courtTiers';
import { DEFAULT_GAVELS } from './data/defaultGavels';
import { DEFAULT_STAFF } from './data/defaultStaff';
import { STYLE_MANUAL_RULES } from './data/styleManualData';
import { INITIAL_CASES } from './data/casesData';
import { CourtHeader } from './components/CourtHeader';
import { GavelBench } from './components/GavelBench';
import { CaseFolderView } from './components/CaseFolderView';
import { StyleManualFolder } from './components/StyleManualFolder';
import { CourtChambers } from './components/CourtChambers';
import { GavelWorkshop } from './components/GavelWorkshop';
import { SupremeArchives } from './components/SupremeArchives';
import { isSoundEnabled, setSoundEnabled, playPrecedentFanfare, playGavelStrike } from './utils/audio';
import {
  FolderOpen,
  BookOpen,
  Users,
  Gavel,
  Archive,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

const STORAGE_KEY = 'supreme_judge_gavel_v1';

export default function App() {
  // Game state
  const [precedent, setPrecedent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.precedent === 'number' ? parsed.precedent : 50;
      }
    } catch {}
    return 50; // Starting legal precedent for incoming trial judge
  });

  const [currentCourtTier, setCurrentCourtTier] = useState<CourtTier>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentCourtTier) return parsed.currentCourtTier;
      }
    } catch {}
    return 'district';
  });

  const [activeGavelId, setActiveGavelId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeGavelId) return parsed.activeGavelId;
      }
    } catch {}
    return 'gavel_oak';
  });

  const [gavels, setGavels] = useState<GavelModel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.gavels)) return parsed.gavels;
      }
    } catch {}
    return DEFAULT_GAVELS;
  });

  const [staff, setStaff] = useState<ChamberStaff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.staff)) return parsed.staff;
      }
    } catch {}
    return DEFAULT_STAFF;
  });

  const [styleRules, setStyleRules] = useState<StyleManualRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.styleRules)) return parsed.styleRules;
      }
    } catch {}
    return STYLE_MANUAL_RULES;
  });

  const [cases, setCases] = useState<CaseFolder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.cases)) return parsed.cases;
      }
    } catch {}
    return INITIAL_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeCaseId) return parsed.activeCaseId;
      }
    } catch {}
    return INITIAL_CASES[0]?.id || '';
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) return parsed.stats;
      }
    } catch {}
    return {
      totalClicks: 0,
      totalPrecedentEarned: 50,
      casesDecided: 0,
      styleRulesMastered: 0,
      critStrikes: 0,
      timePlayedSeconds: 0,
    };
  });

  const [activeMainTab, setActiveMainTab] = useState<
    'cases' | 'style' | 'gavel' | 'chambers' | 'workshop' | 'archives'
  >('cases');

  const [soundActive, setSoundActive] = useState(isSoundEnabled());

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          precedent,
          currentCourtTier,
          activeGavelId,
          gavels,
          staff,
          styleRules,
          cases,
          activeCaseId,
          stats,
        })
      );
    } catch {}
  }, [precedent, currentCourtTier, activeGavelId, gavels, staff, styleRules, cases, activeCaseId, stats]);

  // Calculate passive income per second
  const currentCourt = COURT_TIERS[currentCourtTier];
  const masteredRuleCount = styleRules.filter((r) => r.redlineExercise.completed).length;
  // Each mastered style chapter adds 15% permanent multiplier to jurisprudence
  const styleMultiplier = 1.0 + masteredRuleCount * 0.15;

  const rawStaffPerSec = staff.reduce((acc, s) => acc + s.precedentPerSec * s.count, 0);
  const totalPrecedentPerSec = rawStaffPerSec * currentCourt.multiplier * styleMultiplier;

  // Idle generation tick
  useEffect(() => {
    const tickInterval = 100; // 100ms
    const timer = setInterval(() => {
      const gain = (totalPrecedentPerSec * tickInterval) / 1000;
      if (gain > 0) {
        setPrecedent((prev) => prev + gain);
        setStats((prev) => ({
          ...prev,
          totalPrecedentEarned: prev.totalPrecedentEarned + gain,
          timePlayedSeconds: prev.timePlayedSeconds + 0.1,
        }));
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, [totalPrecedentPerSec]);

  // Active gavel object
  const activeGavel = gavels.find((g) => g.id === activeGavelId) || gavels[0];

  // Active case folder
  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const availableCasesInTier = cases.filter((c) => c.court === currentCourtTier);
  const currentIndexInTier = availableCasesInTier.findIndex((c) => c.id === activeCaseId);
  const hasNextCaseInTier =
    currentIndexInTier >= 0 && currentIndexInTier < availableCasesInTier.length - 1;

  // Handle gavel strike
  const handleGavelStrike = (amount: number, isCrit: boolean) => {
    setPrecedent((prev) => prev + amount);
    setStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      totalPrecedentEarned: prev.totalPrecedentEarned + amount,
      critStrikes: isCrit ? prev.critStrikes + 1 : prev.critStrikes,
    }));
  };

  // Handle case decision & rubber stamp
  const handleDecideCase = (
    caseId: string,
    ruling: RulingDecision,
    choices: Record<string, string>
  ) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    // Calculate style quality bonus
    let bonusPct = 0;
    targetCase.draftOpinion.choicePoints.forEach((cp) => {
      const choiceId = choices[cp.id];
      if (choiceId) {
        const choice = cp.choices.find((c) => c.id === choiceId);
        if (choice) {
          bonusPct += choice.precedentBonusPercent;
        }
      }
    });

    const reward = Math.round(
      targetCase.basePrecedentReward * currentCourt.multiplier * styleMultiplier * (1 + bonusPct / 100)
    );

    setPrecedent((prev) => prev + reward);
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'filed',
              selectedRuling: ruling,
              finalPrecedentAwarded: reward,
              stampedAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            }
          : c
      )
    );

    setStats((prev) => ({
      ...prev,
      casesDecided: prev.casesDecided + 1,
      totalPrecedentEarned: prev.totalPrecedentEarned + reward,
    }));
  };

  // Handle next case
  const handleNextCase = () => {
    if (hasNextCaseInTier) {
      const next = availableCasesInTier[currentIndexInTier + 1];
      setActiveCaseId(next.id);
    } else {
      // Find any unfiled case across all tiers
      const nextUnfiled = cases.find((c) => c.status === 'pending');
      if (nextUnfiled) {
        setActiveCaseId(nextUnfiled.id);
        setCurrentCourtTier(nextUnfiled.court);
      }
    }
  };

  // Handle redline exercise completion
  const handleCompleteRedline = (ruleId: string) => {
    const targetRule = styleRules.find((r) => r.id === ruleId);
    if (!targetRule || targetRule.redlineExercise.completed) return;

    const reward = targetRule.redlineExercise.rewardPrecedent * currentCourt.multiplier;
    setPrecedent((prev) => prev + reward);
    setStyleRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              redlineExercise: {
                ...r.redlineExercise,
                completed: true,
              },
            }
          : r
      )
    );

    setStats((prev) => ({
      ...prev,
      styleRulesMastered: prev.styleRulesMastered + 1,
      totalPrecedentEarned: prev.totalPrecedentEarned + reward,
    }));
  };

  // Hire staff
  const handleHireStaff = (staffId: string) => {
    const target = staff.find((s) => s.id === staffId);
    if (!target) return;

    const cost = Math.round(target.cost * Math.pow(target.costMultiplier, target.count));
    if (precedent < cost) return;

    setPrecedent((prev) => prev - cost);
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, count: s.count + 1 } : s))
    );
  };

  // Buy gavel
  const handleBuyGavel = (gavelId: string) => {
    const target = gavels.find((g) => g.id === gavelId);
    if (!target || target.unlocked) return;
    if (precedent < target.cost) return;

    setPrecedent((prev) => prev - target.cost);
    setGavels((prev) =>
      prev.map((g) => (g.id === gavelId ? { ...g, unlocked: true } : g))
    );
    setActiveGavelId(gavelId);
  };

  // Select gavel
  const handleSelectGavel = (gavelId: string) => {
    setActiveGavelId(gavelId);
  };

  // Elevate court tier
  const handleElevateCourt = (newTier: CourtTier) => {
    setCurrentCourtTier(newTier);
    // Switch to first case in the new tier
    const firstCase = cases.find((c) => c.court === newTier);
    if (firstCase) {
      setActiveCaseId(firstCase.id);
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  // Reset career
  const handleReset = () => {
    if (
      window.confirm(
        'Reset judicial career? All precedent, staff, and case records will be reset to Day 1 of the District Bench.'
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setPrecedent(50);
      setCurrentCourtTier('district');
      setActiveGavelId('gavel_oak');
      setGavels(DEFAULT_GAVELS);
      setStaff(DEFAULT_STAFF);
      setStyleRules(STYLE_MANUAL_RULES);
      setCases(INITIAL_CASES);
      setActiveCaseId(INITIAL_CASES[0]?.id || '');
      setStats({
        totalClicks: 0,
        totalPrecedentEarned: 50,
        casesDecided: 0,
        styleRulesMastered: 0,
        critStrikes: 0,
        timePlayedSeconds: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1c130e] text-stone-100 flex flex-col font-sans selection:bg-amber-800/40 selection:text-amber-100">
      {/* Court Header */}
      <CourtHeader
        currentTier={currentCourtTier}
        precedent={precedent}
        precedentPerSec={totalPrecedentPerSec}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        casesDecidedCount={stats.casesDecided}
        styleMasteredCount={masteredRuleCount}
        onSelectCourtTier={setCurrentCourtTier}
      />

      {/* Main App Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 py-4 sm:px-6 sm:py-6 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveMainTab('cases')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeMainTab === 'cases'
                  ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              <span>Case Dossier Folder</span>
            </button>

            <button
              onClick={() => setActiveMainTab('style')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all relative ${
                activeMainTab === 'style'
                  ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Writing Style Manual</span>
              {masteredRuleCount < styleRules.length && (
                <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={() => setActiveMainTab('chambers')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeMainTab === 'chambers'
                  ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Court Chambers & Staff</span>
            </button>

            <button
              onClick={() => setActiveMainTab('workshop')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeMainTab === 'workshop'
                  ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Gavel className="h-4 w-4" />
              <span>Gavel Armory</span>
            </button>

            <button
              onClick={() => setActiveMainTab('archives')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeMainTab === 'archives'
                  ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>Supreme Archives ({stats.casesDecided})</span>
            </button>
          </div>

          {/* Quick Docket Selector when on cases tab */}
          {activeMainTab === 'cases' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 hidden sm:inline">Dockets:</span>
              <select
                value={activeCaseId}
                onChange={(e) => setActiveCaseId(e.target.value)}
                className="rounded-lg border border-stone-700 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.court.toUpperCase()}] {c.docketNumber} - {c.caption.slice(0, 32)}...
                    {c.status === 'filed' ? ' (FILED)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Dynamic Main Content & Idle Gavel Bench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Interactive Workstation (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-4">
            {activeMainTab === 'cases' && currentCase && (
              <CaseFolderView
                caseFolder={currentCase}
                onDecideCase={handleDecideCase}
                onNextCase={handleNextCase}
                hasNextCase={hasNextCaseInTier}
              />
            )}

            {activeMainTab === 'style' && (
              <StyleManualFolder
                rules={styleRules}
                onCompleteExercise={handleCompleteRedline}
                styleMultiplier={styleMultiplier}
              />
            )}

            {activeMainTab === 'chambers' && (
              <CourtChambers
                staffList={staff}
                precedent={precedent}
                currentTier={currentCourtTier}
                onHireStaff={handleHireStaff}
                onElevateCourt={handleElevateCourt}
              />
            )}

            {activeMainTab === 'workshop' && (
              <GavelWorkshop
                gavels={gavels}
                activeGavelId={activeGavelId}
                precedent={precedent}
                onSelectGavel={handleSelectGavel}
                onBuyGavel={handleBuyGavel}
              />
            )}

            {activeMainTab === 'archives' && (
              <SupremeArchives
                cases={cases}
                onOpenCase={(id) => {
                  setActiveCaseId(id);
                  setActiveMainTab('cases');
                }}
              />
            )}
          </div>

          {/* Persistent Idle Gavel Bench Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            {/* The Bench Gavel */}
            <GavelBench
              activeGavel={activeGavel}
              onGavelStrike={handleGavelStrike}
              courtMultiplier={currentCourt.multiplier}
              styleMultiplier={styleMultiplier}
            />

            {/* Chambers Docket Quick Summary Box */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 text-xs space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-cinzel font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Court Chambers Log
                </span>
                <span className="font-mono-code text-stone-400">
                  {stats.casesDecided} Decided / {cases.length} Total
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>Current Jurisdiction:</span>
                  <span className="font-semibold text-stone-200">{currentCourt.name}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Court Multiplier:</span>
                  <span className="font-mono-code font-bold text-amber-300">{currentCourt.multiplier}x</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Style Multiplier:</span>
                  <span className="font-mono-code font-bold text-amber-300">{styleMultiplier.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Total Gavel Strikes:</span>
                  <span className="font-mono-code font-bold text-stone-200">
                    {stats.totalClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Summary Judgments (Crits):</span>
                  <span className="font-mono-code font-bold text-amber-300">
                    {stats.critStrikes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Reset Career Button */}
              <div className="pt-2 border-t border-stone-800/80 flex justify-between items-center text-[11px]">
                <span className="text-stone-500">Auto-saved to chambers</span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-stone-500 hover:text-red-400 transition-colors"
                  title="Reset Game"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Career</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
