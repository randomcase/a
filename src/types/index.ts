export type CourtTier = 'district' | 'circuit' | 'supreme';

export interface CourtTierInfo {
  id: CourtTier;
  name: string;
  subTitle: string;
  judgeTitle: string;
  badge: string;
  requiredPrecedent: number;
  multiplier: number;
  docketTypes: string;
  description: string;
}

export interface GavelModel {
  id: string;
  name: string;
  woodType: string;
  description: string;
  cost: number;
  basePower: number; // Precedent gained per strike
  critChance: number; // Probability of "Summary Judgment" (crit strike)
  critMultiplier: number;
  unlocked: boolean;
  accentColor: string;
  soundblockMaterial: string;
}

export interface ChamberStaff {
  id: string;
  name: string;
  title: string;
  description: string;
  court: CourtTier;
  cost: number;
  costMultiplier: number;
  precedentPerSec: number;
  count: number;
  iconName: string;
}

export interface StyleManualRule {
  id: string;
  chapterNumber: number;
  title: string;
  category: 'Plain English' | 'Citation Form' | 'Judicial Tone' | 'Constitutional Canon' | 'Syllogism';
  ruleSummary: string;
  badExample: string;
  goodExample: string;
  commentary: string;
  redlineExercise: {
    prompt: string;
    flawedText: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
      rationale: string;
    }[];
    completed: boolean;
    rewardPrecedent: number;
  };
}

export type RulingDecision = 'AFFIRMED' | 'REVERSED' | 'REMANDED' | 'CERTIORARI GRANTED' | 'CERTIORARI DENIED' | 'EN BANC VACATED';

export interface CaseFolder {
  id: string;
  docketNumber: string;
  court: CourtTier;
  caption: string; // e.g. "State of Veritas v. Algorithmic Ledger Corp."
  petitioner: string;
  respondent: string;
  termYear: string;
  issue: string;
  facts: string;
  precedentCasesCited: string[];
  benchMemoStyleChecklist: {
    ruleId: string;
    description: string;
    passed: boolean;
  }[];
  draftOpinion: {
    syllabus: string;
    majorityDraft: string;
    choicePoints: {
      id: string;
      prompt: string;
      choices: {
        id: string;
        text: string;
        styleRating: 'Flawed Legalese' | 'Passable' | 'Supreme Elegance';
        precedentBonusPercent: number;
        reasoning: string;
      }[];
      selectedChoiceId?: string;
    }[];
  };
  availableRulings: RulingDecision[];
  basePrecedentReward: number;
  status: 'pending' | 'drafted' | 'filed';
  selectedRuling?: RulingDecision;
  finalPrecedentAwarded?: number;
  stampedAt?: string;
  dissentAvailable?: boolean;
}

export interface GameStats {
  totalClicks: number;
  totalPrecedentEarned: number;
  casesDecided: number;
  styleRulesMastered: number;
  critStrikes: number;
  timePlayedSeconds: number;
}
