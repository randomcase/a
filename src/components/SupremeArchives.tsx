import React, { useState } from 'react';
import { CaseFolder } from '../types';
import { Archive, CheckCircle2, FileText, ChevronDown, ChevronUp, Scale, Stamp } from 'lucide-react';

interface SupremeArchivesProps {
  cases: CaseFolder[];
  onOpenCase: (caseId: string) => void;
}

export const SupremeArchives: React.FC<SupremeArchivesProps> = ({ cases, onOpenCase }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const decidedCases = cases.filter((c) => c.status === 'filed');

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 text-stone-100 shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950 border border-amber-800/40 text-amber-400">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-400">
                Supreme Federal Docket & Precedent Archive
              </div>
              <h3 className="font-serif-legal text-lg font-bold text-stone-100">
                The United States Reports (Binding Precedents)
              </h3>
            </div>
          </div>
          <div className="text-xs text-stone-400">
            {decidedCases.length} Landmark Orders Entered Into Federal Jurisprudence
          </div>
        </div>

        {decidedCases.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <Scale className="h-10 w-10 mx-auto text-stone-600" />
            <div className="font-serif-legal text-base text-stone-400">
              No cases have been formally filed into the archives yet.
            </div>
            <p className="text-xs text-stone-500">
              Open the Case Dossier tab, draft your opinion using the Style Manual, and slam the gavel to file your first ruling.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {decidedCases.map((c) => {
              const isExpanded = expandedId === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-lg border border-stone-800 bg-stone-950/70 p-4 transition-colors hover:border-stone-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-xs font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-900/40">
                          {c.docketNumber}
                        </span>
                        <span className="text-xs text-stone-400 font-semibold uppercase">
                          {c.termYear}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            c.selectedRuling === 'AFFIRMED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : c.selectedRuling === 'REVERSED' || c.selectedRuling === 'EN BANC VACATED'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {c.selectedRuling}
                        </span>
                      </div>
                      <h4 className="font-serif-legal text-base font-bold text-stone-100">
                        {c.caption}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <div className="text-stone-500">Awarded</div>
                        <div className="font-mono-code font-bold text-amber-300">
                          +{c.finalPrecedentAwarded?.toLocaleString()} Precedent
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      <button
                        onClick={() => onOpenCase(c.id)}
                        className="rounded bg-amber-900/70 hover:bg-amber-800 px-3 py-1 text-xs font-semibold text-amber-100 transition-colors border border-amber-700/50"
                      >
                        View Folder
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-2 text-xs font-serif-legal text-stone-300">
                      <div>
                        <strong className="text-stone-400 uppercase tracking-wider font-cinzel text-[10px]">
                          Question Presented:
                        </strong>
                        <p className="italic text-stone-300 mt-0.5">"{c.issue}"</p>
                      </div>
                      <div>
                        <strong className="text-stone-400 uppercase tracking-wider font-cinzel text-[10px]">
                          Syllabus Summary:
                        </strong>
                        <p className="text-stone-300 mt-0.5">{c.facts}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
