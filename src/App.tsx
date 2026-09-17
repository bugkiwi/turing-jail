import { useEffect, useState } from 'react';
import type { LevelResult, Locale, View } from './types';
import { getQuestions, levelQuestionIds } from './content';
import { ensurePlayer, saveLocale, storedLocale } from './api';
import { loadProgress, saveProgress, type SavedProgress } from './progress';
import { HudHeader } from './components/HudHeader';
import { AmbientSound } from './components/AmbientSound';
import { LevelView } from './components/LevelView';
import { OutcomeView } from './components/OutcomeView';
import { LeaderboardView } from './components/LeaderboardView';

function pickQuestion(level: 1 | 2 | 3, used: Record<number, number[]>) {
  const remaining = levelQuestionIds(level).filter((id) => !(used[level] ?? []).includes(id));
  return remaining[Math.floor(Math.random() * remaining.length)] ?? levelQuestionIds(level)[0];
}

export default function App() {
  const [savedProgress] = useState<SavedProgress | null>(() => loadProgress());
  const [locale, setLocale] = useState<Locale>(() => savedProgress?.locale ?? storedLocale());
  const [playerId, setPlayerId] = useState(savedProgress?.playerId ?? '------');
  const [view, setView] = useState<View>(savedProgress?.view ?? 'level');
  const [boardReturn, setBoardReturn] = useState<View>('level');
  const [level, setLevel] = useState<1 | 2 | 3>(savedProgress?.level ?? 1);
  const [attempt, setAttempt] = useState(savedProgress?.attempt ?? 1);
  const [questionId, setQuestionId] = useState(savedProgress?.questionId ?? pickQuestion(1, {}));
  const [usedQuestions, setUsedQuestions] = useState<Record<number, number[]>>(savedProgress?.usedQuestions ?? {});
  const [results, setResults] = useState<LevelResult[]>(savedProgress?.results ?? []);
  const [draft, setDraft] = useState(savedProgress?.draft ?? '');
  const [runStartedAt, setRunStartedAt] = useState(savedProgress?.runStartedAt ?? Date.now());
  const [runSaved, setRunSaved] = useState(savedProgress?.runSaved ?? false);
  const [audioOn, setAudioOn] = useState(false);

  useEffect(() => {
    if (savedProgress?.playerId) window.localStorage.setItem('turingjail_id', savedProgress.playerId);
    ensurePlayer().then(setPlayerId);
  }, [savedProgress]);

  useEffect(() => {
    if (!/^[0-9A-F]{6}$/i.test(playerId)) return;
    saveProgress({ playerId, locale, view, level, attempt, questionId, usedQuestions, results, runStartedAt, draft, runSaved });
  }, [attempt, draft, level, locale, playerId, questionId, results, runSaved, runStartedAt, usedQuestions, view]);

  useEffect(() => {
    const language = locale === 'zh' ? 'zh-CN' : locale;
    document.documentElement.lang = language;
    document.title = locale === 'zh' ? 'Turing Jail // TypeSafe Jev AI 裁决终端' : locale === 'de' ? 'Turing Jail // TypeSafe Jev KI-Urteil' : 'Turing Jail // TypeSafe Jev AI Verdict';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', locale === 'zh' ? 'Turing Jail 是一场由 TypeSafe Jev System One 裁决的 AI 审讯游戏。写下你的陈述，突破三道机械闸门，争取释放。' : locale === 'de' ? 'Turing Jail ist ein KI-Verhörspiel, bewertet von TypeSafe Jev System One. Schreibe deine Aussage und kämpfe um deine Freilassung.' : 'Turing Jail is a three-level AI interrogation game judged by TypeSafe Jev System One. Write your statement and fight for release.');
  }, [locale]);

  function changeLocale(next: Locale) {
    if (view === 'level' && results.length > 0) return;
    setLocale(next);
    saveLocale(next);
  }

  function openBoard() {
    setBoardReturn(view === 'leaderboard' ? 'level' : view);
    setView('leaderboard');
  }

  function startRun() {
    const first = pickQuestion(1, {});
    setResults([]); setDraft(''); setRunSaved(false); setUsedQuestions({ 1: [first] }); setQuestionId(first); setLevel(1); setAttempt(1); setRunStartedAt(Date.now()); setView('level');
  }

  function onLevelResult(result: LevelResult) {
    setResults((current) => [...current.filter((entry) => entry.level !== result.level), result].sort((a, b) => a.level - b.level));
    if (result.passed && level < 3) {
      const nextLevel = (level + 1) as 1 | 2 | 3;
      const nextQuestion = pickQuestion(nextLevel, { ...usedQuestions, [level]: [...(usedQuestions[level] ?? []), questionId] });
      setDraft(''); setUsedQuestions((current) => ({ ...current, [nextLevel]: [nextQuestion] })); setQuestionId(nextQuestion); setLevel(nextLevel); setAttempt(1);
    } else {
      setRunSaved(false);
      setView('outcome');
    }
  }

  function appeal() {
    const currentUsed = [...(usedQuestions[level] ?? []), questionId];
    const nextQuestion = pickQuestion(level, { ...usedQuestions, [level]: currentUsed });
    setDraft(''); setRunSaved(false); setUsedQuestions((current) => ({ ...current, [level]: currentUsed.concat(nextQuestion) })); setQuestionId(nextQuestion); setAttempt(2); setView('level');
  }

  return (
    <div className={`app-shell view-${view}`}>
      <div className="cinematic-background" aria-hidden="true" /><div className="ambient-grid" /><div className="scanlines" /><div className="corner-mark mark-tl" /><div className="corner-mark mark-br" />
      <AmbientSound enabled={audioOn} />
      <HudHeader locale={locale} playerId={playerId} audioOn={audioOn} onLocale={changeLocale} onAudio={() => setAudioOn((value) => !value)} onBoard={openBoard} />
      <main className="app-main">
        {view === 'level' && <LevelView key={`${locale}-${level}-${questionId}-${attempt}`} locale={locale} playerId={playerId} level={level} question={getQuestions(locale)[questionId]} attempt={attempt} startedAt={runStartedAt} draft={draft} onDraftChange={setDraft} onResult={onLevelResult} onBoard={openBoard} audioOn={audioOn} />}
        {view === 'outcome' && <OutcomeView locale={locale} playerId={playerId} results={results} escaped={results.length === 3 && results.every((result) => result.passed)} runSaved={runSaved} onRunSaved={() => setRunSaved(true)} onRetry={startRun} onAppeal={attempt === 1 ? appeal : undefined} onBoard={openBoard} />}
        {view === 'leaderboard' && <LeaderboardView locale={locale} playerId={playerId} onLocale={changeLocale} onBack={() => setView(boardReturn)} />}
      </main>
      <footer className="global-footer"><span>© TURING JAIL / 2026</span><span>NO TEXT GENERATION · STRUCTURED VERDICT ONLY</span><span>EDGE PROXY / NEON ARCHIVE</span></footer>
    </div>
  );
}
