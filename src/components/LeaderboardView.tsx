import { useEffect, useState } from 'react';
import type { LeaderboardEntry, Locale } from '../types';
import { copy, locales } from '../content';
import { getLeaderboard } from '../api';

type Props = { locale: Locale; playerId: string; onLocale: (locale: Locale) => void; onBack: () => void };

export function LeaderboardView({ locale, playerId, onLocale, onBack }: Props) {
  const t = copy[locale];
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [self, setSelf] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getLeaderboard(locale, playerId).then((data) => { if (active) { setEntries(data.entries); setSelf(data.self); } }).catch(() => { if (active) setEntries([]); }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [locale, playerId]);

  return (
    <div className="board-view page-enter">
      <div className="board-heading"><div><p className="eyebrow"><span />RANKING / {locale.toUpperCase()}</p><h1>{t.boardTitle}</h1><p>{t.boardSub}</p></div><button className="button button-ghost" onClick={onBack} type="button">← {t.backToChallenge}</button></div>
      <div className="board-tabs">{locales.map((item) => <button key={item} className={locale === item ? 'active' : ''} onClick={() => onLocale(item)} type="button">{item === 'zh' ? '中文榜' : item === 'en' ? 'EN BOARD' : 'DE RANGLISTE'}</button>)}</div>
      <div className="leaderboard-shell"><div className="board-table-head"><span>{t.rank}</span><span>{t.prisoner}</span><span>{t.average}</span><span>{t.finalVerdict}</span></div>{loading ? <div className="board-empty">SYNCING ARCHIVE…</div> : entries.length ? entries.map((entry) => <div className={`board-row ${entry.isCurrent ? 'current' : ''}`} key={`${entry.rank}-${entry.playerId}`}><span className={`rank-number rank-${entry.rank}`}>{String(entry.rank).padStart(2, '0')}</span><span className="rank-id">#{entry.playerId} {entry.isCurrent && <em>{t.you}</em>}</span><span className="rank-prob">{entry.avgProb.toFixed(2)} <i /></span><span className={entry.escaped ? 'badge-pass' : 'badge-hold'}>{entry.escaped ? t.escaped : t.detained}</span></div>) : <div className="board-empty">{t.noRank}</div>} {self && !entries.some((entry) => entry.playerId === self.playerId) && <div className="board-self"><span>{self.rank}</span><strong>#{self.playerId} · {t.you}</strong><b>{self.avgProb.toFixed(2)}</b><em>{self.escaped ? t.escaped : t.detained}</em></div>}</div>
      <div className="board-foot"><span>ARCHIVE STATUS / LIVE</span><span>TOP {entries.length || 0} / {locale.toUpperCase()}</span><span>PLAYER / #{playerId}</span></div>
    </div>
  );
}
