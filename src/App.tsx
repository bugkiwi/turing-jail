import { useEffect, useState } from 'react';
import type { LevelResult, Locale, View } from './types';
import { copy, getQuestions, levelQuestionIds } from './content';
import { ensurePlayer, getStats, saveLocale } from './api';
import { HudHeader } from './components/HudHeader';
import { IntroView } from './components/IntroView';
import { LevelView } from './components/LevelView';
import { OutcomeView } from './components/OutcomeView';
import { LeaderboardView } from './components/LeaderboardView';

function pickQuestion(level: 1 | 2 | 3, used: Record<number, number[]>) {
  const remaining = levelQuestionIds(level).filter((id) => !(used[level] ?? []).includes(id));
  return remaining[Math.floor(Math.random() * remaining.length)] ?? levelQuestionIds(level)[0];
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = window.localStorage.getItem('turingjail_locale') as Locale | null;
    if (saved && ['zh', 'en', 'de'].includes(saved)) return saved;
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  });
  const [playerId, setPlayerId] = useState('------');
  const [view, setView] = useState<View>('intro');
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [attempt, setAttempt] = useState(1);
  const [questionId, setQuestionId] = useState(1);
  const [usedQuestions, setUsedQuestions] = useState<Record<number, number[]>>({});
  const [results, setResults] = useState<LevelResult[]>([]);
  const [stats, setStats] = useState({ escaped: 128, detained: 947 });
  const [runStartedAt, setRunStartedAt] = useState(Date.now());
  const [audioOn, setAudioOn] = useState(true);

  useEffect(() => {
    ensurePlayer().then(setPlayerId);
    getStats().then(setStats).catch(() => undefined);
  }, []);

  function changeLocale(next: Locale) {
    if (view === 'level') return;
    setLocale(next);
    saveLocale(next);
  }

  function startRun() {
    const first = pickQuestion(1, {});
    setResults([]); setUsedQuestions({ 1: [first] }); setQuestionId(first); setLevel(1); setAttempt(1); setRunStartedAt(Date.now()); setView('level');
  }

  function onLevelResult(result: LevelResult) {
    setResults((current) => [...current.filter((entry) => entry.level !== result.level), result].sort((a, b) => a.level - b.level));
    if (result.passed && level < 3) {
      const nextLevel = (level + 1) as 1 | 2 | 3;
      const nextQuestion = pickQuestion(nextLevel, { ...usedQuestions, [level]: [...(usedQuestions[level] ?? []), questionId] });
      setUsedQuestions((current) => ({ ...current, [nextLevel]: [nextQuestion] })); setQuestionId(nextQuestion); setLevel(nextLevel); setAttempt(1);
    } else {
      setView('outcome');
    }
  }

  function appeal() {
    const currentUsed = [...(usedQuestions[level] ?? []), questionId];
    const nextQuestion = pickQuestion(level, { ...usedQuestions, [level]: currentUsed });
    setUsedQuestions((current) => ({ ...current, [level]: currentUsed.concat(nextQuestion) })); setQuestionId(nextQuestion); setAttempt(2); setView('level');
  }

  return (
    <div className={`app-shell view-${view}`}>
      <div className="ambient-grid" /><div className="scanlines" /><div className="corner-mark mark-tl" /><div className="corner-mark mark-br" />
      <HudHeader locale={locale} playerId={playerId} audioOn={audioOn} onLocale={changeLocale} onAudio={() => setAudioOn((value) => !value)} onBoard={() => setView('leaderboard')} />
      <main className="app-main">
        {view === 'intro' && <IntroView locale={locale} stats={stats} onStart={startRun} onBoard={() => setView('leaderboard')} />}
        {view === 'level' && <LevelView key={`${level}-${questionId}-${attempt}`} locale={locale} playerId={playerId} level={level} question={getQuestions(locale)[questionId]} attempt={attempt} startedAt={runStartedAt} onResult={onLevelResult} audioOn={audioOn} />}
        {view === 'outcome' && <OutcomeView locale={locale} playerId={playerId} results={results} escaped={results.length === 3 && results.every((result) => result.passed)} onRetry={startRun} onAppeal={attempt === 1 ? appeal : undefined} onBoard={() => setView('leaderboard')} />}
        {view === 'leaderboard' && <LeaderboardView locale={locale} playerId={playerId} onLocale={changeLocale} onBack={() => setView('intro')} />}
      </main>
      <footer className="global-footer"><span>© TURING JAIL / 2026</span><span>NO TEXT GENERATION · STRUCTURED VERDICT ONLY</span><span>EDGE PROXY / NEON ARCHIVE</span></footer>
    </div>
  );
}
