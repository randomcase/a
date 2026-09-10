import React, { useState } from 'react';
import { CaseFolder, RulingDecision } from '../types';
import { playStampSound, playPageRustle, playPrecedentFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Gavel,
  Scroll,
  BookOpen,
  Stamp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Tag,
} from 'lucide-react';

interface CaseFolderViewProps {
  caseFolder: CaseFolder;
  onDecideCase: (caseId: string, ruling: RulingDecision, choices: Record<string, string>) => void;
  onNextCase?: () => void;
  hasNextCase?: boolean;
}

export const CaseFolderView: React.FC<CaseFolderViewProps> = ({
  caseFolder,
  onDecideCase,
  onNextCase,
  hasNextCase,
}) => {
  const [activeTab, setActiveTab] = useState<'docket' | 'draft' | 'stamp' | 'holding'>('docket');
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    caseFolder.draftOpinion.choicePoints.forEach((cp) => {
      if (cp.selectedChoiceId) {
        initial[cp.id] = cp.selectedChoiceId;
      }
    });
    return initial;
  });
  const [selectedRuling, setSelectedRuling] = useState<RulingDecision | null>(
    caseFolder.selectedRuling || null
  );
  const [isStampAnimating, setIsStampAnimating] = useState(false);

  const isCaseFiled = caseFolder.status === 'filed';

  // Calculate style bonus from selected choices
  let totalBonusPercent = 0;
  let allChoicesMade = true;
  caseFolder.draftOpinion.choicePoints.forEach((cp) => {
    const choiceId = selectedChoices[cp.id];
    if (!choiceId) {
      allChoicesMade = false;
    } else {
      const choice = cp.choices.find((c) => c.id === choiceId);
      if (choice) {
        totalBonusPercent += choice.precedentBonusPercent;
      }
    }
  });

  const estimatedReward = Math.round(
    caseFolder.basePrecedentReward * (1 + totalBonusPercent / 100)
  );

  const handleSelectChoice = (pointId: string, choiceId: string) => {
    if (isCaseFiled) return;
    playPageRustle();
    setSelectedChoices((prev) => ({ ...prev, [pointId]: choiceId }));
  };

  const handleApplyStamp = (ruling: RulingDecision) => {
    if (isCaseFiled) return;
    setSelectedRuling(ruling);
    setIsStampAnimating(true);
    playStampSound();

    setTimeout(() => {
      onDecideCase(caseFolder.id, ruling, selectedChoices);
      setIsStampAnimating(false);
      setActiveTab('holding');

      // Trigger confetti celebration if Supreme Court or high value
      if (caseFolder.court === 'supreme') {
        playPrecedentFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#b45309', '#1e293b', '#e2e8f0'],
        });
      }
    }, 450);
  };

  const handleTabChange = (tab: 'docket' | 'facts' | 'draft' | 'stamp' | 'holding') => {
    playPageRustle();
    setActiveTab(tab as 'docket' | 'draft' | 'stamp' | 'holding');
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Authentic Manila Folder Container */}
      <div className="rounded-xl border-2 border-[#bfa47d] bg-[#f4ebd0] p-3 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Top Folder Header with Manila Folder Tab Navigation */}
        <div className="flex flex-wrap items-end justify-between border-b-2 border-[#cbb391] pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d8c29d] border border-[#a88a64] text-stone-800 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs font-bold text-amber-900 bg-[#dfceb0] px-2 py-0.5 rounded border border-[#b89f77]">
                  {caseFolder.docketNumber}
                </span>
                <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                  {caseFolder.termYear}
                </span>
              </div>
              <h2 className="font-serif-legal text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                {caseFolder.caption}
              </h2>
            </div>
          </div>

          {/* Folder Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2">
            <button
              onClick={() => handleTabChange('docket')}
              className={`rounded-t-lg px-3 py-1.5 text-xs font-semibold tracking-wide border-t border-x transition-colors ${
                activeTab === 'docket'
                  ? 'bg-[#fbf8ee] text-stone-900 border-[#a88a64] shadow-sm'
                  : 'bg-[#e5d4b3] text-stone-700 border-transparent hover:bg-[#ebdcc0]'
              }`}
            >
              📋 Docket & Facts
            </button>
            <button
              onClick={() => handleTabChange('draft')}
              className={`rounded-t-lg px-3 py-1.5 text-xs font-semibold tracking-wide border-t border-x transition-colors relative ${
                activeTab === 'draft'
                  ? 'bg-[#fbf8ee] text-stone-900 border-[#a88a64] shadow-sm'
                  : 'bg-[#e5d4b3] text-stone-700 border-transparent hover:bg-[#ebdcc0]'
              }`}
            >
              ✍️ Opinion Draft
              {!allChoicesMade && !isCaseFiled && (
                <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('stamp')}
              className={`rounded-t-lg px-3 py-1.5 text-xs font-semibold tracking-wide border-t border-x transition-colors ${
                activeTab === 'stamp'
                  ? 'bg-[#fbf8ee] text-stone-900 border-[#a88a64] shadow-sm'
                  : 'bg-[#e5d4b3] text-stone-700 border-transparent hover:bg-[#ebdcc0]'
              }`}
            >
              ⚖️ Gavel Stamp
            </button>
            {isCaseFiled && (
              <button
                onClick={() => handleTabChange('holding')}
                className={`rounded-t-lg px-3 py-1.5 text-xs font-semibold tracking-wide border-t border-x transition-colors ${
                  activeTab === 'holding'
                    ? 'bg-[#fbf8ee] text-stone-900 border-[#a88a64] shadow-sm'
                    : 'bg-[#e5d4b3] text-stone-700 border-transparent hover:bg-[#ebdcc0]'
                }`}
              >
                📜 Filed Precedent
              </button>
            )}
          </div>
        </div>

        {/* Paper Sheet Insert with Vintage Parchment Texture */}
        <div className="relative mt-3 rounded-lg border border-[#d2be9f] bg-[#fbf8ee] p-5 sm:p-7 text-stone-900 shadow-md min-h-[460px]">
          {/* Authentic Brass Fastener visual accents */}
          <div className="absolute top-2 left-12 w-4 h-4 rounded-full border border-[#8b6f4e] bg-[#c5a059] shadow-inner" />
          <div className="absolute top-2 right-12 w-4 h-4 rounded-full border border-[#8b6f4e] bg-[#c5a059] shadow-inner" />

          {/* Stamped Seal Overlay if case is filed */}
          {isCaseFiled && caseFolder.selectedRuling && (
            <div className="absolute top-6 right-6 pointer-events-none z-20">
              <div
                className={`stamp-seal px-4 py-2 text-base sm:text-lg font-black tracking-widest ${
                  caseFolder.selectedRuling === 'AFFIRMED'
                    ? 'border-emerald-800 text-emerald-800 bg-emerald-100/40'
                    : caseFolder.selectedRuling === 'REVERSED' || caseFolder.selectedRuling === 'EN BANC VACATED'
                    ? 'border-red-800 text-red-800 bg-red-100/40'
                    : 'border-blue-900 text-blue-900 bg-blue-100/40'
                }`}
              >
                {caseFolder.selectedRuling}
                <div className="text-[9px] tracking-normal font-mono-code text-center mt-0.5">
                  SEALED: {caseFolder.stampedAt || 'TERM 2026'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: DOCKET & FACTS */}
          {activeTab === 'docket' && (
            <div className="space-y-5">
              <div className="border-b border-stone-300 pb-3">
                <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-900">
                  Case Brief & Procedural Summary
                </div>
                <h3 className="font-serif-legal text-xl font-bold text-stone-900 mt-1">
                  {caseFolder.caption}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-stone-600 mt-1 font-mono-code">
                  <span>Petitioner: <strong>{caseFolder.petitioner}</strong></span>
                  <span>Respondent: <strong>{caseFolder.respondent}</strong></span>
                </div>
              </div>

              {/* Central Legal Issue */}
              <div className="rounded-md border border-amber-900/20 bg-amber-50/60 p-3.5">
                <div className="flex items-center gap-2 font-cinzel text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  <Tag className="h-3.5 w-3.5" />
                  The Question Presented (Issue of Law)
                </div>
                <p className="font-serif-legal text-stone-800 text-base leading-relaxed italic">
                  "{caseFolder.issue}"
                </p>
              </div>

              {/* Summary of Facts */}
              <div>
                <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Material Facts of Record
                </div>
                <p className="font-serif-legal text-stone-800 text-base leading-relaxed">
                  {caseFolder.facts}
                </p>
              </div>

              {/* Precedents Cited */}
              <div>
                <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-800" />
                  Controlling Precedent & Authorities
                </div>
                <ul className="space-y-1 text-sm font-serif-legal text-stone-700">
                  {caseFolder.precedentCasesCited.map((cite, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
                      <span className="font-medium italic">{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Step Action */}
              <div className="pt-3 border-t border-stone-300 flex justify-end">
                <button
                  onClick={() => handleTabChange('draft')}
                  className="flex items-center gap-2 rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-amber-50 hover:bg-amber-800 transition-colors shadow-sm"
                >
                  <span>Proceed to Opinion Draft & Style Check</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OPINION DRAFT & STYLE MANUAL CHOICE SIMULATOR */}
          {activeTab === 'draft' && (
            <div className="space-y-5">
              <div className="border-b border-stone-300 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-900">
                    Chambers Opinion Drafting Bench
                  </div>
                  <h3 className="font-serif-legal text-lg font-bold text-stone-900">
                    Drafting the Majority Holding
                  </h3>
                </div>
                <div className="flex items-center gap-2 rounded bg-amber-100/70 border border-amber-300 px-3 py-1 text-xs text-amber-900">
                  <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                  <span>Style Bonus: <strong className="font-mono-code font-bold">+{totalBonusPercent}%</strong> Precedent</span>
                </div>
              </div>

              {/* Syllabus Context */}
              <div className="text-xs text-stone-600 italic bg-stone-100/80 p-2.5 rounded border border-stone-200">
                <strong>Syllabus Note:</strong> {caseFolder.draftOpinion.syllabus}
              </div>

              {/* Style Manual Choice Points */}
              <div className="space-y-4">
                {caseFolder.draftOpinion.choicePoints.map((cp, idx) => {
                  const currentSelected = selectedChoices[cp.id];

                  return (
                    <div key={cp.id} className="rounded-lg border border-stone-300 bg-white/70 p-4 shadow-sm">
                      <div className="flex items-center gap-2 font-serif-legal text-sm font-semibold text-stone-900 mb-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-amber-50 text-xs">
                          {idx + 1}
                        </span>
                        <span>{cp.prompt}</span>
                      </div>

                      <div className="space-y-2">
                        {cp.choices.map((choice) => {
                          const isSelected = currentSelected === choice.id;

                          return (
                            <label
                              key={choice.id}
                              onClick={() => handleSelectChoice(cp.id, choice.id)}
                              className={`flex flex-col p-3 rounded-md border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-amber-800 bg-amber-50/90 shadow-sm ring-1 ring-amber-800/40'
                                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80'
                              } ${isCaseFiled ? 'cursor-default' : ''}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5">
                                  <input
                                    type="radio"
                                    name={cp.id}
                                    checked={isSelected}
                                    disabled={isCaseFiled}
                                    onChange={() => handleSelectChoice(cp.id, choice.id)}
                                    className="mt-1 accent-amber-900"
                                  />
                                  <p className="font-serif-legal text-sm text-stone-900 leading-relaxed">
                                    {choice.text}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    choice.styleRating === 'Supreme Elegance'
                                      ? 'bg-amber-200/90 text-amber-950 border border-amber-400'
                                      : choice.styleRating === 'Passable'
                                      ? 'bg-stone-200 text-stone-800'
                                      : 'bg-red-100 text-red-900 border border-red-200'
                                  }`}
                                >
                                  {choice.styleRating} (+{choice.precedentBonusPercent}%)
                                </span>
                              </div>

                              {/* Stylistic Critique & Garner Guide Reason */}
                              {isSelected && (
                                <div className="mt-2 ml-6 text-xs text-stone-600 border-t border-amber-200/60 pt-1.5 flex items-start gap-1.5">
                                  <span className="font-bold text-amber-900">Style Analysis:</span>
                                  <span>{choice.reasoning}</span>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress to Stamp Station */}
              <div className="pt-3 border-t border-stone-300 flex justify-end">
                <button
                  onClick={() => handleTabChange('stamp')}
                  className="flex items-center gap-2 rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-amber-50 hover:bg-amber-800 transition-colors shadow-sm"
                >
                  <span>Proceed to Gavel Ruling & Stamp Station</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GAVEL RULING & RUBBER STAMP STATION */}
          {activeTab === 'stamp' && (
            <div className="space-y-6">
              <div className="border-b border-stone-300 pb-3">
                <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-900">
                  Judicial Disposition & Seal
                </div>
                <h3 className="font-serif-legal text-xl font-bold text-stone-900">
                  Render Final Decree & Stamp Docket
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Select the judicial holding to hand down. Striking your gavel will permanently seal the order into the archives.
                </p>
              </div>

              {/* Reward Estimation Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-900/20 bg-amber-50/80 p-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Jurisprudence Reward Upon Filing
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono-code text-2xl font-bold text-amber-900">
                      +{estimatedReward.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-600">
                      (Base {caseFolder.basePrecedentReward.toLocaleString()} + {totalBonusPercent}% Style Quality)
                    </span>
                  </div>
                </div>

                {!allChoicesMade && !isCaseFiled && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-200/60 px-2.5 py-1.5 rounded border border-amber-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>Unfinished opinion drafts will award base precedent.</span>
                  </div>
                )}
              </div>

              {/* Ruling Stamp Buttons */}
              <div className="space-y-3">
                <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Decree to Stamp:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseFolder.availableRulings.map((ruling) => {
                    const isAffirmed = ruling === 'AFFIRMED';
                    const isReversed = ruling === 'REVERSED' || ruling === 'EN BANC VACATED';
                    const isCert = ruling.includes('CERTIORARI');

                    return (
                      <button
                        key={ruling}
                        disabled={isCaseFiled}
                        onClick={() => handleApplyStamp(ruling)}
                        className={`group relative flex items-center justify-between p-4 rounded-lg border-2 transition-all active:scale-95 shadow-sm text-left ${
                          isCaseFiled && caseFolder.selectedRuling === ruling
                            ? 'border-amber-900 bg-amber-100/80 ring-2 ring-amber-800'
                            : isCaseFiled
                            ? 'opacity-40 border-stone-300 bg-stone-100 cursor-not-allowed'
                            : 'border-stone-400/80 bg-stone-50 hover:bg-stone-100/90 hover:border-amber-800 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-black ${
                              isAffirmed
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                                : isReversed
                                ? 'bg-red-100 border-red-400 text-red-900'
                                : 'bg-blue-100 border-blue-400 text-blue-900'
                            }`}
                          >
                            <Stamp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-cinzel font-bold text-sm text-stone-900 tracking-wide">
                              {ruling}
                            </div>
                            <div className="text-[11px] text-stone-600">
                              {isAffirmed
                                ? 'Lower court decision upheld as correct law'
                                : isReversed
                                ? 'Lower decision overturned for legal error'
                                : isCert
                                ? 'Supreme Court review granted for national resolution'
                                : 'Case remanded for further trial proceedings'}
                            </div>
                          </div>
                        </div>

                        {!isCaseFiled && (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
                            <Gavel className="h-4 w-4" />
                            <span>SLAM</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* If already filed, show next case button */}
              {isCaseFiled && hasNextCase && (
                <div className="pt-4 border-t border-stone-300 flex justify-end">
                  <button
                    onClick={onNextCase}
                    className="flex items-center gap-2 rounded-lg bg-amber-900 px-5 py-2.5 text-xs font-bold text-amber-50 hover:bg-amber-800 transition-all shadow-md active:scale-95"
                  >
                    <span>Proceed to Next Case Docket</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FILED PRECEDENT ARCHIVE */}
          {activeTab === 'holding' && isCaseFiled && (
            <div className="space-y-5">
              <div className="border-b border-stone-300 pb-3 flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Official Judicial Record Filed
                  </div>
                  <h3 className="font-serif-legal text-xl font-bold text-stone-900">
                    {caseFolder.caption}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sealed in United States Reports</span>
                </div>
              </div>

              <div className="rounded-lg border border-stone-300 bg-white/80 p-5 space-y-3 font-serif-legal text-stone-900">
                <div className="text-center border-b border-stone-200 pb-3">
                  <div className="font-cinzel text-sm font-bold tracking-widest uppercase text-stone-700">
                    Decree of the Court
                  </div>
                  <div className="text-xs text-stone-500 font-mono-code mt-0.5">
                    Filed under Docket {caseFolder.docketNumber}
                  </div>
                </div>

                <p className="text-base leading-relaxed">
                  <strong>Held:</strong> By order of the bench, the ruling of the court below is hereby{' '}
                  <span className="font-bold underline uppercase">{caseFolder.selectedRuling}</span>.
                </p>

                <p className="text-sm text-stone-700 leading-relaxed italic">
                  "{caseFolder.issue}"
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-stone-200 text-xs font-mono-code text-stone-600">
                  <div>Awarded: +{caseFolder.finalPrecedentAwarded?.toLocaleString()} Precedent</div>
                  <div>Attest: Clerk of the Court</div>
                </div>
              </div>

              {hasNextCase && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={onNextCase}
                    className="flex items-center gap-2 rounded-lg bg-amber-900 px-5 py-2.5 text-xs font-bold text-amber-50 hover:bg-amber-800 transition-all shadow-md"
                  >
                    <span>Open Next Case in Docket</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
