export type Locale = 'zh' | 'en' | 'de';
export type View = 'level' | 'outcome' | 'leaderboard';
export type EvaluationPhase = 'idle' | 'evaluating' | 'feedback' | 'submitted';
export type Tactic = 'logic' | 'emotion' | 'humor' | 'honesty' | 'other';

export type Question = {
  id: number;
  level: 1 | 2 | 3;
  prompt: string;
  instruction: string;
};

export type Evaluation = {
  noul: number;
  persuasiveness: number;
  tactic: Tactic;
  plea: number;
  logic: number;
  paradox: number;
  source?: 'typesafe' | 'fallback';
};

export type LevelResult = Evaluation & {
  level: 1 | 2 | 3;
  questionId: number;
  response: string;
  passed: boolean;
  duration: number;
};

export type LeaderboardEntry = {
  rank: number;
  playerId: string;
  avgProb: number;
  escaped: boolean;
  isCurrent?: boolean;
};
