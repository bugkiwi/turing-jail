import { useEffect, useMemo, useRef, useState } from 'react';
import type { LevelResult, Locale, SharedRun } from '../types';
import { copy, tacticLabels, thresholds } from '../content';
import { saveRun } from '../api';

type Props = { locale: Locale; playerId: string; results: LevelResult[]; escaped: boolean; runSaved: boolean; onRunSaved: () => void; onRetry: () => void; onAppeal?: () => void; onBoard: () => void; sharedRequested?: boolean; sharedRun?: SharedRun | null; sharedLoading?: boolean; sharedError?: boolean };

function resultsFromSharedRun(run: SharedRun): LevelResult[] {
  return run.probabilities.map((noul, index) => ({
    noul,
    persuasiveness: 0,
    tactic: 'other',
    plea: 0,
    logic: 0,
    paradox: 0,
    source: 'typesafe',
    level: (index + 1) as 1 | 2 | 3,
    questionId: 0,
    response: '',
    passed: noul >= thresholds[index + 1],
    duration: 0,
  }));
}

export function OutcomeView({ locale, playerId, results, escaped, runSaved, onRunSaved, onRetry, onAppeal, onBoard, sharedRequested = false, sharedRun = null, sharedLoading = false, sharedError = false }: Props) {
  const t = copy[locale];
  const [copied, setCopied] = useState(false);
  const isShared = sharedRun !== null;
  const displayResults = useMemo(() => sharedRun ? resultsFromSharedRun(sharedRun) : results, [results, sharedRun]);
  const displayPlayerId = sharedRun?.playerId ?? playerId;
  const displayEscaped = sharedRun?.escaped ?? escaped;
  const average = sharedRun?.avgProb ?? (displayResults.length ? displayResults.reduce((sum, result) => sum + result.noul, 0) / displayResults.length : 0);
  const tactics = useMemo(() => Object.entries(displayResults.reduce<Record<string, number>>((map, result) => { map[result.tactic] = (map[result.tactic] ?? 0) + 1; return map; }, {})).sort((a, b) => b[1] - a[1]), [displayResults]);
  const primaryTactic = (tactics[0]?.[0] ?? 'other') as keyof typeof tacticLabels[Locale];
  const failed = displayResults.find((result) => !result.passed);
  const elapsed = displayResults.reduce((sum, result) => sum + result.duration, 0);
  const saved = useRef(false);

  useEffect(() => {
    if (isShared || sharedLoading || sharedError || saved.current || runSaved || results.length !== 3) return;
    saved.current = true;
    saveRun({ playerId, locale, results, escaped }).then(onRunSaved).catch(() => { saved.current = false; });
  }, [escaped, isShared, locale, onRunSaved, playerId, results, runSaved, sharedError, sharedLoading]);

  async function copyLink() {
    const url = `${window.location.origin}/?id=${displayPlayerId}&locale=${sharedRun?.locale ?? locale}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }

  if (sharedLoading) return <div className="outcome-view page-enter"><div className="outcome-heading"><p className="eyebrow"><span />{t.sharedRecord}</p><h1>{t.shareLoading}</h1></div></div>;
  if (sharedRequested && (sharedError || (!sharedLoading && !sharedRun))) return <div className="outcome-view page-enter"><div className="outcome-heading"><p className="eyebrow red"><span />{t.sharedRecord}</p><h1>{t.sharedRecord}</h1><p>{t.shareUnavailable}</p></div><div className="outcome-actions"><button className="button button-ghost" onClick={onBoard} type="button"><span>{t.leaderboard}</span><b>↗</b></button></div></div>;

  return (
    <div className="outcome-view page-enter">
      <div className="outcome-heading"><p className={`eyebrow ${displayEscaped ? 'green' : 'red'}`}><span />{isShared ? t.sharedRecord : `${t.finalVerdict} / ${displayEscaped ? 'PASS' : 'FAIL'}`}</p><h1>{displayEscaped ? t.certificate : t.notice}</h1><p>{displayEscaped ? t.passBody[2] : t.failBody}</p></div>
      <div className={`share-card ${displayEscaped ? 'escaped' : 'detained'}`}>
        <div className="card-scanline" /><div className="card-top"><span>{t.system}</span><b>{displayEscaped ? 'CLEARANCE // 03' : `BREACH // 0${failed?.level ?? 1}`}</b></div>
        <div className="card-main"><div><p className="card-kicker">{displayEscaped ? t.certificate : t.notice}</p><h2>#{displayPlayerId}</h2><p>{displayEscaped ? t.passBody[1] : (failed ? `LEVEL 0${failed.level} / ${failed.noul.toFixed(2)} NOUL` : t.failBody)}</p></div><div className="stamp">{displayEscaped ? 'RELEASED' : 'HELD'}<small>{displayEscaped ? '✓' : '×'}</small></div></div>
        <div className="card-stats">{displayResults.map((result) => <div key={result.level}><span>0{result.level} / {t.level}</span><strong>{result.noul.toFixed(2)}</strong><small>{result.passed ? 'PASS' : 'FAIL'}</small></div>)}<div><span>{t.average}</span><strong>{average.toFixed(2)}</strong><small>{displayEscaped ? 'CLEAR' : 'LOCKED'}</small></div></div>
        <div className="card-bottom">{isShared ? <><span>{t.rank} · {sharedRun.rank}</span><span>{t.sharedRecord} · {sharedRun.locale.toUpperCase()}</span></> : <><span>{t.duration} · {elapsed}s</span><span>{t.portrait} · {tacticLabels[locale][primaryTactic]}</span></>}</div>
      </div>
      <div className="outcome-actions">{!isShared && !displayEscaped && failed && onAppeal && <button className="button button-primary" onClick={onAppeal} type="button"><span>{t.appeal}</span><b>↗</b></button>}<button className={`button ${!isShared && !displayEscaped && failed && onAppeal ? 'button-ghost' : 'button-primary'}`} onClick={copyLink} type="button"><span>{copied ? t.copied : t.copyLink}</span><b>⌘</b></button><button className="button button-ghost" onClick={onBoard} type="button"><span>{t.leaderboard}</span><b>↗</b></button>{!isShared && <button className="text-action" onClick={onRetry} type="button">↻ {t.tryAgain}</button>}</div>
    </div>
  );
}
