import { useEffect, useMemo, useRef, useState } from 'react';
import type { LevelResult, Locale } from '../types';
import { copy, tacticLabels } from '../content';
import { saveRun } from '../api';

type Props = { locale: Locale; playerId: string; results: LevelResult[]; escaped: boolean; runSaved: boolean; onRunSaved: () => void; onRetry: () => void; onAppeal?: () => void; onBoard: () => void };

export function OutcomeView({ locale, playerId, results, escaped, runSaved, onRunSaved, onRetry, onAppeal, onBoard }: Props) {
  const t = copy[locale];
  const [copied, setCopied] = useState(false);
  const average = results.length ? results.reduce((sum, result) => sum + result.noul, 0) / results.length : 0;
  const tactics = useMemo(() => Object.entries(results.reduce<Record<string, number>>((map, result) => { map[result.tactic] = (map[result.tactic] ?? 0) + 1; return map; }, {})).sort((a, b) => b[1] - a[1]), [results]);
  const primaryTactic = (tactics[0]?.[0] ?? 'other') as keyof typeof tacticLabels[Locale];
  const failed = results.find((result) => !result.passed);
  const elapsed = results.reduce((sum, result) => sum + result.duration, 0);
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current || runSaved || results.length !== 3) return;
    saved.current = true;
    saveRun({ playerId, locale, results, escaped }).then(onRunSaved).catch(() => { saved.current = false; });
  }, [escaped, locale, onRunSaved, playerId, results, runSaved]);

  async function copyLink() {
    const url = `${window.location.origin}/?id=${playerId}&locale=${locale}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }

  return (
    <div className="outcome-view page-enter">
      <div className="outcome-heading"><p className={`eyebrow ${escaped ? 'green' : 'red'}`}><span />{t.finalVerdict} / {escaped ? 'PASS' : 'FAIL'}</p><h1>{escaped ? t.certificate : t.notice}</h1><p>{escaped ? t.passBody[2] : t.failBody}</p></div>
      <div className={`share-card ${escaped ? 'escaped' : 'detained'}`}>
        <div className="card-scanline" /><div className="card-top"><span>{t.system}</span><b>{escaped ? 'CLEARANCE // 03' : `BREACH // 0${failed?.level ?? 1}`}</b></div>
        <div className="card-main"><div><p className="card-kicker">{escaped ? t.certificate : t.notice}</p><h2>#{playerId}</h2><p>{escaped ? t.passBody[1] : (failed ? `LEVEL 0${failed.level} / ${failed.noul.toFixed(2)} NOUL` : t.failBody)}</p></div><div className="stamp">{escaped ? 'RELEASED' : 'HELD'}<small>{escaped ? '✓' : '×'}</small></div></div>
        <div className="card-stats">{results.map((result) => <div key={result.level}><span>0{result.level} / {t.level}</span><strong>{result.noul.toFixed(2)}</strong><small>{result.passed ? 'PASS' : 'FAIL'}</small></div>)}<div><span>{t.average}</span><strong>{average.toFixed(2)}</strong><small>{escaped ? 'CLEAR' : 'LOCKED'}</small></div></div>
        <div className="card-bottom"><span>{t.duration} · {elapsed}s</span><span>{t.portrait} · {tacticLabels[locale][primaryTactic]}</span></div>
      </div>
      <div className="outcome-actions">{!escaped && failed && onAppeal && <button className="button button-primary" onClick={onAppeal} type="button"><span>{t.appeal}</span><b>↗</b></button>}<button className={`button ${!escaped && failed && onAppeal ? 'button-ghost' : 'button-primary'}`} onClick={copyLink} type="button"><span>{copied ? t.copied : t.copyLink}</span><b>⌘</b></button><button className="button button-ghost" onClick={onBoard} type="button"><span>{t.leaderboard}</span><b>↗</b></button><button className="text-action" onClick={onRetry} type="button">↻ {t.tryAgain}</button></div>
    </div>
  );
}
