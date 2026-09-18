import { useEffect, useState } from 'react';
import type { LevelResult, Locale, SharedRun, View } from './types';
import { getQuestions, levelQuestionIds } from './content';
import { allocatePlayer, ensurePlayer, getSharedRun, saveLocale, storedLocale } from './api';
import { loadProgress, saveProgress, type SavedProgress } from './progress';
import { HudHeader } from './components/HudHeader';
import { AmbientSound } from './components/AmbientSound';
import { LevelView } from './components/LevelView';
import { OutcomeView } from './components/OutcomeView';
import { LeaderboardView } from './components/LeaderboardView';

const seoByLocale: Record<Locale, { title: string; description: string; keywords: string; htmlLang: string; ogLocale: string }> = {
  zh: {
    title: 'Turing Jail — TypeSafe Jev AI 审讯与释放概率挑战',
    description: 'Turing Jail 是一款由 TypeSafe Jev System One 驱动的 AI 审讯游戏和说服力挑战。通过三关逻辑、求情与悖论测试，获得 AI 的释放概率。',
    keywords: 'Turing Jail, TypeSafe, TypeSafe AI, TypeSafe API, TypeSafe Jev, Jev, jev-latest, System One, AI, AI审讯游戏, AI裁决游戏, AI说服力测试, 人类越狱, 结构化AI评估',
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
  },
  en: {
    title: 'Turing Jail — TypeSafe Jev AI Interrogation Game',
    description: 'Turing Jail is a TypeSafe Jev System One AI interrogation game and persuasion challenge. Clear three levels of logic, plea, and paradox to earn your release probability.',
    keywords: 'Turing Jail, TypeSafe, TypeSafe AI, TypeSafe API, TypeSafe Jev, Jev, jev-latest, System One, AI, AI interrogation game, AI verdict game, AI persuasion game, AI jailbreak game, structured AI evaluation',
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
  de: {
    title: 'Turing Jail — TypeSafe Jev KI-Verhörspiel',
    description: 'Turing Jail ist ein KI-Verhörspiel und Überzeugungstest mit TypeSafe Jev System One. Bestehe drei Stufen aus Logik, Gnadengesuch und Paradox.',
    keywords: 'Turing Jail, TypeSafe, TypeSafe AI, TypeSafe API, TypeSafe Jev, Jev, jev-latest, System One, KI, KI-Verhörspiel, KI-Urteil, KI-Überzeugungstest, strukturierte KI-Bewertung',
    htmlLang: 'de',
    ogLocale: 'de_DE',
  },
};

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function updateStructuredData(metadata: typeof seoByLocale[Locale]) {
  const schemaScript = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  if (!schemaScript?.textContent) return;
  try {
    const schema = JSON.parse(schemaScript.textContent) as { '@graph'?: Array<Record<string, unknown>> };
    for (const entity of schema['@graph'] ?? []) {
      if (entity['@type'] === 'WebSite' || entity['@type'] === 'WebApplication') {
        entity.description = metadata.description;
        entity.inLanguage = metadata.htmlLang;
      }
      if (entity['@type'] === 'WebApplication') entity.keywords = metadata.keywords.split(', ');
    }
    schemaScript.textContent = JSON.stringify(schema);
  } catch {
    // Keep the static JSON-LD intact if a browser or extension has altered it.
  }
}

function pickQuestion(level: 1 | 2 | 3, used: Record<number, number[]>) {
  const remaining = levelQuestionIds(level).filter((id) => !(used[level] ?? []).includes(id));
  return remaining[Math.floor(Math.random() * remaining.length)] ?? levelQuestionIds(level)[0];
}

function readSharedQuery() {
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get('id')?.toUpperCase();
  const locale = params.get('locale')?.toLowerCase();
  if (!playerId || !/^[0-9A-F]{6}$/.test(playerId) || !['zh', 'en', 'de'].includes(locale ?? '')) return null;
  return { playerId, locale: locale as Locale };
}

export default function App() {
  const [sharedQuery] = useState(readSharedQuery);
  const [savedProgress] = useState<SavedProgress | null>(() => loadProgress());
  const [sharedRun, setSharedRun] = useState<SharedRun | null>(null);
  const [sharedLoading, setSharedLoading] = useState(Boolean(sharedQuery));
  const [sharedError, setSharedError] = useState(false);
  const [locale, setLocale] = useState<Locale>(() => sharedQuery?.locale ?? savedProgress?.locale ?? storedLocale());
  const [playerId, setPlayerId] = useState(sharedQuery?.playerId ?? savedProgress?.playerId ?? '------');
  const [view, setView] = useState<View>(sharedQuery ? 'outcome' : savedProgress?.view ?? 'level');
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
    if (sharedQuery) {
      let active = true;
      getSharedRun(sharedQuery.playerId, sharedQuery.locale).then((run) => {
        if (active) setSharedRun(run);
      }).catch(() => {
        if (active) setSharedError(true);
      }).finally(() => {
        if (active) setSharedLoading(false);
      });
      return () => { active = false; };
    }
    if (savedProgress?.playerId) window.localStorage.setItem('turingjail_id', savedProgress.playerId);
    ensurePlayer().then(setPlayerId);
  }, [savedProgress, sharedQuery]);

  useEffect(() => {
    if (sharedQuery || !/^[0-9A-F]{6}$/i.test(playerId)) return;
    if (runSaved) {
      window.localStorage.removeItem('turingjail_progress_v1');
      window.localStorage.removeItem('turingjail_id');
      return;
    }
    saveProgress({ playerId, locale, view, level, attempt, questionId, usedQuestions, results, runStartedAt, draft, runSaved });
  }, [attempt, draft, level, locale, playerId, questionId, results, runSaved, runStartedAt, usedQuestions, view, sharedQuery]);

  useEffect(() => {
    const metadata = seoByLocale[locale];
    document.documentElement.lang = metadata.htmlLang;
    document.title = metadata.title;
    setMeta('meta[name="description"]', metadata.description);
    setMeta('meta[name="keywords"]', metadata.keywords);
    setMeta('meta[property="og:title"]', metadata.title);
    setMeta('meta[property="og:description"]', metadata.description);
    setMeta('meta[property="og:locale"]', metadata.ogLocale);
    setMeta('meta[name="twitter:title"]', metadata.title);
    setMeta('meta[name="twitter:description"]', metadata.description);
    updateStructuredData(metadata);
  }, [locale]);

  function changeLocale(next: Locale) {
    if (sharedQuery) return;
    if (view === 'level' && results.length > 0) return;
    setLocale(next);
    saveLocale(next);
  }

  function openBoard() {
    setBoardReturn(view === 'leaderboard' ? 'level' : view);
    setView('leaderboard');
  }

  function handleBrandClick() {
    if (sharedQuery) {
      window.location.assign(window.location.pathname);
      return;
    }
    openBoard();
  }

  async function startRun() {
    const nextPlayerId = await allocatePlayer();
    const first = pickQuestion(1, {});
    setPlayerId(nextPlayerId); setResults([]); setDraft(''); setRunSaved(false); setUsedQuestions({ 1: [first] }); setQuestionId(first); setLevel(1); setAttempt(1); setRunStartedAt(Date.now()); setView('level');
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
      <HudHeader locale={locale} playerId={playerId} audioOn={audioOn} onLocale={changeLocale} onAudio={() => setAudioOn((value) => !value)} onBrand={handleBrandClick} onBoard={openBoard} />
      <main className="app-main">
        {view === 'level' && <LevelView key={`${locale}-${level}-${questionId}-${attempt}`} locale={locale} playerId={playerId} level={level} question={getQuestions(locale)[questionId]} attempt={attempt} startedAt={runStartedAt} draft={draft} onDraftChange={setDraft} onResult={onLevelResult} onBoard={openBoard} audioOn={audioOn} />}
        {view === 'outcome' && <OutcomeView locale={locale} playerId={playerId} results={results} escaped={results.length === 3 && results.every((result) => result.passed)} runSaved={runSaved} onRunSaved={() => setRunSaved(true)} onRetry={startRun} onAppeal={attempt === 1 ? appeal : undefined} onBoard={openBoard} sharedRequested={Boolean(sharedQuery)} sharedRun={sharedRun} sharedLoading={sharedLoading} sharedError={sharedError} />}
        {view === 'leaderboard' && <LeaderboardView locale={locale} playerId={playerId} onLocale={changeLocale} onBack={() => setView(boardReturn)} />}
      </main>
      <footer className="global-footer"><span>© TURING JAIL / 2026</span><span>NO TEXT GENERATION · STRUCTURED VERDICT ONLY</span><span>EDGE PROXY / NEON ARCHIVE</span></footer>
    </div>
  );
}
