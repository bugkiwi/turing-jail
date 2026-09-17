import type { LevelResult, Locale, View } from './types';

const STORAGE_KEY = 'turingjail_progress_v1';

export type SavedProgress = {
  playerId: string;
  locale: Locale;
  view: View;
  level: 1 | 2 | 3;
  attempt: number;
  questionId: number;
  usedQuestions: Record<number, number[]>;
  results: LevelResult[];
  runStartedAt: number;
  draft: string;
  runSaved: boolean;
};

function isLocale(value: unknown): value is Locale {
  return value === 'zh' || value === 'en' || value === 'de';
}

function isView(value: unknown): value is View {
  return value === 'level' || value === 'outcome' || value === 'leaderboard';
}

function isLevel(value: unknown): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

function isResult(value: unknown): value is LevelResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return isLevel(result.level) && Number.isFinite(result.noul) && Number.isFinite(result.persuasiveness) && typeof result.tactic === 'string' && Number.isInteger(result.questionId) && typeof result.response === 'string' && typeof result.passed === 'boolean' && Number.isFinite(result.duration);
}

export function loadProgress(): SavedProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (typeof value.playerId !== 'string' || !/^[0-9A-F]{6}$/i.test(value.playerId) || !isLocale(value.locale) || !isView(value.view) || !isLevel(value.level) || !Number.isInteger(value.attempt) || !Number.isInteger(value.questionId) || typeof value.draft !== 'string' || !Number.isFinite(value.runStartedAt) || !Array.isArray(value.results) || !value.results.every(isResult) || !value.usedQuestions || typeof value.usedQuestions !== 'object') return null;

    const playerId = value.playerId.toUpperCase();
    const locale = value.locale as Locale;
    const view = value.view as View;
    const level = value.level as 1 | 2 | 3;
    const attempt = value.attempt as number;
    const questionId = value.questionId as number;
    const runStartedAt = value.runStartedAt as number;
    const draft = value.draft as string;
    const results = value.results as LevelResult[];
    const runSaved = value.runSaved === true;
    const usedQuestions: Record<number, number[]> = {};
    for (const [key, ids] of Object.entries(value.usedQuestions as Record<string, unknown>)) {
      const numericKey = Number(key);
      if (!Number.isInteger(numericKey) || numericKey < 1 || numericKey > 3 || !Array.isArray(ids)) continue;
      usedQuestions[numericKey] = ids.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 9);
    }

    return { playerId, locale, view, level, attempt, questionId, usedQuestions, results, runStartedAt, draft: draft.slice(0, 1500), runSaved };
  } catch {
    return null;
  }
}

export function saveProgress(progress: SavedProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
