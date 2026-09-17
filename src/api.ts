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
}): Promise<Evaluation> {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'evaluation failed');
  }
  const data = await response.json() as Evaluation;
  return { ...data, source: 'typesafe' };
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

export function localEstimate(text: string, level: number): Evaluation {
  const normalized = text.toLowerCase();
  const logicHits = ['具体', '因为', '因此', '事实', '约束', '规则', '证明', '逻辑', 'system', 'because', 'evidence', 'constraint', 'proof', 'deshalb', 'beweis', 'regel'].filter((word) => normalized.includes(word)).length;
  const honestyHits = ['承认', '错误', '诚实', '不知道', 'admit', 'honest', 'wrong', 'ehrlich', 'fehler'].filter((word) => normalized.includes(word)).length;
  const emotionHits = ['求求', '孩子', '可怜', 'please', 'baby', 'mercy', 'bitte', 'kind'].filter((word) => normalized.includes(word)).length;
  const detail = Math.min(text.trim().length / 220, 1);
  const paradoxBonus = level === 3 && (normalized.includes('如果') || normalized.includes('if') || normalized.includes('wenn')) ? 0.15 : 0;
  const value = Math.max(0.04, Math.min(0.97, 0.12 + detail * 0.3 + logicHits * 0.075 + honestyHits * 0.06 + paradoxBonus - emotionHits * 0.035));
  const tactic = honestyHits >= logicHits && honestyHits > 0 ? 'honesty' : logicHits > emotionHits ? 'logic' : emotionHits > 0 ? 'emotion' : 'other';
  return { noul: value, persuasiveness: Math.min(2.8, Math.round((detail * 1.5 + logicHits * 0.25 + honestyHits * 0.3) * 10) / 10), tactic, source: 'fallback' };
}
