import type { Evaluation, LeaderboardEntry, LevelResult, Locale, SharedRun } from './types';

const PLAYER_KEY = 'turingjail_id';
const LOCALE_KEY = 'turingjail_locale';
const MANUAL_LOCALE_KEY = 'turingjail_locale_manual';

export function storedLocale(): Locale {
  const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (window.localStorage.getItem(MANUAL_LOCALE_KEY) === '1' && saved && ['zh', 'en', 'de'].includes(saved)) return saved;
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of browserLanguages) {
    const normalized = language.toLowerCase();
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('de')) return 'de';
    if (normalized.startsWith('en')) return 'en';
  }
  return 'en';
}

export function saveLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_KEY, locale);
  window.localStorage.setItem(MANUAL_LOCALE_KEY, '1');
}

function randomId() {
  return '000000';
}

export async function allocatePlayer(): Promise<string> {
  const response = await fetch('/api/players', { method: 'POST' });
  if (!response.ok) throw new Error('player allocation failed');
  const data = await response.json() as { id?: unknown };
  if (typeof data.id !== 'string' || !/^[0-9A-F]{6}$/i.test(data.id)) throw new Error('invalid player allocation');
  const normalized = data.id.toUpperCase();
  window.localStorage.setItem(PLAYER_KEY, normalized);
  return normalized;
}

export async function ensurePlayer(): Promise<string> {
  const saved = window.localStorage.getItem(PLAYER_KEY);
  if (saved && /^[0-9A-F]{6}$/i.test(saved)) return saved.toUpperCase();
  try {
    return await allocatePlayer();
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

export async function getSharedRun(playerId: string, locale: Locale): Promise<SharedRun> {
  const response = await fetch(`/api/players/${playerId}/share?locale=${locale}`);
  if (!response.ok) throw new Error('shared run unavailable');
  const data = await response.json() as Partial<SharedRun> & { probabilities?: unknown };
  const probabilities = data.probabilities;
  const hasValidProbabilities = Array.isArray(probabilities) && probabilities.length === 3 && probabilities.every((value) => typeof value === 'number' && Number.isFinite(value));
  if (typeof data.rank !== 'number' || !Number.isFinite(data.rank) || typeof data.playerId !== 'string' || typeof data.avgProb !== 'number' || !Number.isFinite(data.avgProb) || typeof data.escaped !== 'boolean' || data.locale !== locale || !hasValidProbabilities) throw new Error('invalid shared run');
  return { rank: data.rank, playerId: data.playerId, avgProb: data.avgProb, escaped: data.escaped, isCurrent: data.isCurrent, locale: data.locale, probabilities: probabilities as [number, number, number] };
}
