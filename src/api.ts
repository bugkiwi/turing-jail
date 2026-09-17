import type { Evaluation, LeaderboardEntry, LevelResult, Locale } from './types';

const PLAYER_KEY = 'turingjail_id';
const LOCALE_KEY = 'turingjail_locale';

export function storedLocale(): Locale {
  const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (saved && ['zh', 'en', 'de'].includes(saved)) return saved;
  const language = navigator.language.toLowerCase();
  return language.startsWith('zh') ? 'zh' : language.startsWith('de') ? 'de' : 'en';
}

export function saveLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_KEY, locale);
}

function randomId() {
  return '000000';
}

export async function ensurePlayer(): Promise<string> {
  const saved = window.localStorage.getItem(PLAYER_KEY);
  if (saved && /^[0-9A-F]{6}$/i.test(saved)) return saved.toUpperCase();
  try {
    const response = await fetch('/api/players', { method: 'POST' });
    if (!response.ok) throw new Error('player allocation failed');
    const data = await response.json() as { id: string };
    const normalized = data.id.toUpperCase();
    window.localStorage.setItem(PLAYER_KEY, normalized);
    return normalized;
  } catch {
    const fallback = randomId();
    window.localStorage.setItem(PLAYER_KEY, fallback);
    return fallback;
  }
}

export async function evaluate(input: {
  playerId: string;
  locale: Locale;
  level: number;
  questionId: number;
  response: string;
  instruction: string;
  prompt: string;
  mode: 'realtime' | 'final';
}, signal?: AbortSignal): Promise<Evaluation> {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });
  if (!response.ok) {
    const body = await response.text();
    let detail = '';
    try {
      detail = (JSON.parse(body) as { error?: string }).error ?? '';
    } catch {
      detail = body;
    }
    throw new Error(detail || `evaluation failed (${response.status})`);
  }
  const data = await response.json() as Partial<Evaluation>;
  const { noul, persuasiveness, plea, logic, paradox } = data;
  const tactic = data.tactic;
  const hasValidTactic = tactic === 'logic' || tactic === 'emotion' || tactic === 'humor' || tactic === 'honesty' || tactic === 'other';
  if (typeof noul !== 'number' || !Number.isFinite(noul) || typeof persuasiveness !== 'number' || !Number.isFinite(persuasiveness) || typeof plea !== 'number' || !Number.isFinite(plea) || typeof logic !== 'number' || !Number.isFinite(logic) || typeof paradox !== 'number' || !Number.isFinite(paradox) || !hasValidTactic) throw new Error('invalid evaluation response');
  return { noul, persuasiveness, tactic, plea, logic, paradox, source: 'typesafe' };
}

export async function saveRun(input: {
  playerId: string;
  locale: Locale;
  results: LevelResult[];
  escaped: boolean;
}) {
  const response = await fetch('/api/runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('run save failed');
  return response.json();
}

export async function getLeaderboard(locale: Locale, playerId: string): Promise<{ entries: LeaderboardEntry[]; self: LeaderboardEntry | null }> {
  const response = await fetch(`/api/leaderboard?locale=${locale}&player_id=${playerId}`);
  if (!response.ok) throw new Error('leaderboard unavailable');
  return response.json();
}

export async function getStats(): Promise<{ escaped: number; detained: number }> {
  const response = await fetch('/api/stats');
  if (!response.ok) throw new Error('stats unavailable');
  return response.json();
}
