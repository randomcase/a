import React, { useState } from 'react';
import { StyleManualRule } from '../types';
import { playStampSound, playPrecedentFanfare, playPageRustle } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  HelpCircle,
  FileCheck,
  Tag,
  GraduationCap,
} from 'lucide-react';

interface StyleManualFolderProps {
  rules: StyleManualRule[];
  onCompleteExercise: (ruleId: string, optionId: string) => void;
  styleMultiplier: number;
}

export const StyleManualFolder: React.FC<StyleManualFolderProps> = ({
  rules,
  onCompleteExercise,
  styleMultiplier,
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const activeRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const handleSelectRule = (ruleId: string) => {
    playPageRustle();
    setSelectedRuleId(ruleId);
    setSelectedOption(null);
    setFeedback(null);
  };

  const handleSelectOption = (optionId: string) => {
    if (activeRule.redlineExercise.completed) return;
    playPageRustle();
    setSelectedOption(optionId);
    setFeedback(null);
  };

  const handleSubmitExercise = () => {
    if (!selectedOption || activeRule.redlineExercise.completed) return;

    const chosen = activeRule.redlineExercise.options.find((o) => o.id === selectedOption);
    if (!chosen) return;

    if (chosen.isCorrect) {
      playStampSound();
      playPrecedentFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setFeedback({
        isCorrect: true,
        message: `Exemplary judicial craftsmanship! ${chosen.rationale} (+${activeRule.redlineExercise.rewardPrecedent.toLocaleString()} Precedent awarded)`,
      });
      onCompleteExercise(activeRule.id, selectedOption);
    } else {
      playStampSound();
      setFeedback({
        isCorrect: false,
        message: `Stylistic violation: ${chosen.rationale} Consult Chapter ${activeRule.chapterNumber} and try another edit.`,
      });
    }
  };

  const completedCount = rules.filter((r) => r.redlineExercise.completed).length;

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Leather-bound Style Manual Folder Binder Aesthetic */}
      <div className="rounded-xl border-2 border-[#8b6f4e] bg-[#f5ede0] p-3 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Binder Header */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#cbbaa1] pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-900 text-amber-100 shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-900">
                  Judicial Writing Style Manual & Codex
                </span>
                <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  Garner & Supreme Court Standard
                </span>
              </div>
              <h2 className="font-serif-legal text-lg sm:text-xl font-bold text-stone-900">
                Chambers Style Guide & Redline Exercises
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-amber-900/20 bg-amber-100/70 px-3 py-1.5 text-xs text-amber-950 font-medium shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-800" />
              <span>
                Style Multiplier: <strong className="font-mono-code font-bold">{styleMultiplier.toFixed(2)}x</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-200/70 px-2.5 py-1.5 rounded-lg border border-stone-300">
              <Award className="h-4 w-4 text-amber-700" />
              <span>
                {completedCount}/{rules.length} Chapters Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout: Chapter Index & Active Rule Page */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Chapter Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
              Table of Chapters
            </div>
            <div className="space-y-1.5">
              {rules.map((rule) => {
                const isSelected = rule.id === activeRule.id;
                const isCompleted = rule.redlineExercise.completed;

                return (
                  <button
                    key={rule.id}
                    onClick={() => handleSelectRule(rule.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-amber-900 bg-[#fbf8ee] text-stone-900 shadow-sm ring-1 ring-amber-800/30'
                        : 'border-[#d8c8b0] bg-[#eedfc5]/70 text-stone-700 hover:bg-[#ebd9bd]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 uppercase">
                        <span>Chapter {rule.chapterNumber}</span>
                        <span>•</span>
                        <span>{rule.category}</span>
                      </div>
                      <div className="font-serif-legal font-bold text-sm text-stone-900 line-clamp-1 mt-0.5">
                        {rule.title}
                      </div>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-1" />
                    ) : (
                      <span className="shrink-0 text-[10px] font-mono-code font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        +{rule.redlineExercise.rewardPrecedent}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Details & Interactive Redline Simulator */}
          <div className="lg:col-span-8 rounded-lg border border-[#cbbaa1] bg-[#fbf8ee] p-5 sm:p-6 text-stone-900 shadow-md">
            {/* Rule Header */}
            <div className="border-b border-stone-300 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-900">
                  Chapter {activeRule.chapterNumber}: {activeRule.category}
                </span>
                {activeRule.redlineExercise.completed && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mastered
                  </span>
                )}
              </div>
              <h3 className="font-serif-legal text-xl font-bold text-stone-900 mt-1">
                {activeRule.title}
              </h3>
            </div>

            {/* Rule Summary & Comparative Examples */}
            <div className="mt-4 space-y-4 font-serif-legal">
              <p className="text-base text-stone-800 leading-relaxed font-medium">
                {activeRule.ruleSummary}
              </p>

              {/* Comparative Bad vs Good Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-md border border-red-200 bg-red-50/70 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Inferior Drafting (Disapproved)
                  </div>
                  <p className="text-xs text-red-950 italic">
                    "{activeRule.badExample}"
                  </p>
                </div>

                <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Judicial Model (Approved)
                  </div>
                  <p className="text-xs text-emerald-950 font-medium">
                    "{activeRule.goodExample}"
                  </p>
                </div>
              </div>

              {/* Editorial Commentary */}
              <div className="text-xs text-stone-600 bg-stone-100/80 p-3 rounded border border-stone-200">
                <span className="font-bold text-stone-800">Judicial Commentary: </span>
                {activeRule.commentary}
              </div>
            </div>

            {/* Interactive Redline Exercise */}
            <div className="mt-6 pt-5 border-t border-stone-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-cinzel text-xs font-bold uppercase tracking-wider text-amber-900">
                  <GraduationCap className="h-4 w-4 text-amber-800" />
                  <span>Interactive Redline Exercise</span>
                </div>
                <div className="text-xs font-mono-code font-bold text-amber-900">
                  Reward: +{activeRule.redlineExercise.rewardPrecedent.toLocaleString()} Precedent
                </div>
              </div>

              <div className="rounded-lg border border-amber-900/20 bg-amber-50/60 p-3.5 mb-4">
                <div className="text-xs font-semibold text-stone-700 mb-1">
                  {activeRule.redlineExercise.prompt}
                </div>
                <div className="font-serif-legal text-sm text-stone-900 italic bg-white/80 p-2.5 rounded border border-stone-200">
                  {activeRule.redlineExercise.flawedText}
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2">
                {activeRule.redlineExercise.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;

                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-900 bg-amber-100/70 shadow-sm ring-1 ring-amber-800/40'
                          : 'border-stone-300 bg-stone-50/60 hover:bg-stone-100/80'
                      } ${activeRule.redlineExercise.completed ? 'cursor-default' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`exercise_${activeRule.id}`}
                        checked={isSelected}
                        disabled={activeRule.redlineExercise.completed}
                        onChange={() => handleSelectOption(opt.id)}
                        className="mt-1 accent-amber-900"
                      />
                      <span className="font-serif-legal text-sm text-stone-900 leading-relaxed">
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {feedback && (
                <div
                  className={`mt-4 p-3 rounded-lg border text-xs font-serif-legal leading-relaxed ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Submit Button */}
              {!activeRule.redlineExercise.completed && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmitExercise}
                    disabled={!selectedOption}
                    className="flex items-center gap-2 rounded-lg bg-amber-900 px-5 py-2 text-xs font-bold text-amber-50 hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Submit Judicial Redline</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
