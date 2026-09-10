import { CourtTierInfo } from '../types';

export const COURT_TIERS: Record<string, CourtTierInfo> = {
  district: {
    id: 'district',
    name: 'U.S. District Court',
    subTitle: 'First Instance & Bench Trials',
    judgeTitle: 'United States District Judge',
    badge: 'FEDERAL BENCH SEAL',
    requiredPrecedent: 0,
    multiplier: 1.0,
    docketTypes: 'Civil Complaints, Injunctions, Summary Judgment Motions',
    description: 'The foundation of the federal judiciary. Preside over motions, master the initial drafting of bench orders, and eliminate verbose legalese from trial opinions.',
  },
  circuit: {
    id: 'circuit',
    name: 'U.S. Court of Appeals',
    subTitle: 'En Banc & Three-Judge Panels',
    judgeTitle: 'Circuit Court Judge',
    badge: 'APPELLATE EAGLE SEAL',
    requiredPrecedent: 2500,
    multiplier: 3.5,
    docketTypes: 'Briefs on Appeal, Standards of Review, Interlocutory Appeals',
    description: 'Review lower court records for reversible error. Demand strict adherence to the Bluebook, active voice syllogisms, and rigorous judicial standards of review.',
  },
  supreme: {
    id: 'supreme',
    name: 'The Supreme Court of the United States',
    subTitle: 'The Highest Court in the Land',
    judgeTitle: 'Justice of the Supreme Court',
    badge: 'SUPREME MARBLE CREST',
    requiredPrecedent: 25000,
    multiplier: 12.0,
    docketTypes: 'Writs of Certiorari, Constitutional Review, Landmark Precedents',
    description: 'The pinnacle of jurisprudence. Write landmark majority opinions, author biting dissents for future generations, and set binding nationwide constitutional doctrine.',
  },
};
