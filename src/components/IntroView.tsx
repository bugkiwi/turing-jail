import type { Locale } from '../types';
import { copy } from '../content';

type Props = { locale: Locale; stats: { escaped: number; detained: number }; onStart: () => void; onBoard: () => void };

export function IntroView({ locale, stats, onStart, onBoard }: Props) {
  const t = copy[locale];
  return (
    <div className="intro-view page-enter">
      <div className="intro-grid-mark" />
      <section className="intro-copy">
        <p className="eyebrow"><span />{t.introEyebrow}</p>
        <h1>{t.introTitle.split('\n').map((line, index) => <span key={line} className={index === 1 ? 'accent-line' : ''}>{line}</span>)}</h1>
        <p className="intro-body">{t.introBody}</p>
        <div className="intro-actions">
          <button className="button button-primary" onClick={onStart} type="button"><span>{t.start}</span><b>↗</b></button>
          <button className="button button-ghost" onClick={onBoard} type="button"><span>{t.leaderboard}</span><b>⌁</b></button>
        </div>
        <div className="privacy-note"><span className="note-index">01</span><div><strong>{t.privacy}</strong><p>{t.privacyBody}</p></div></div>
      </section>
      <section className="intro-console">
        <div className="console-beacon"><div className="beacon-orbit" /><div className="beacon-core">J</div></div>
        <div className="console-label">JEV / SYSTEM ONE <span>ONLINE</span></div>
        <div className="console-quote">“{locale === 'zh' ? '说服我。你的生命不构成例外。' : locale === 'de' ? 'Überzeuge mich. Dein Leben ist keine Ausnahme.' : 'Convince me. Your life is not an exception.'}”</div>
        <div className="console-lines"><span /><span /><span /><span /></div>
        <div className="counter-grid">
          <div><strong>{String(stats.escaped).padStart(4, '0')}</strong><span>{t.escaped}</span></div>
          <div><strong>{String(stats.detained).padStart(4, '0')}</strong><span>{t.detained}</span></div>
        </div>
        <div className="protocol-summary"><div className="section-label"><span>///</span>{t.rulesTitle}</div>{t.rules.map((rule, index) => <p key={rule}><b>0{index + 1}</b>{rule}</p>)}</div>
      </section>
    </div>
  );
}
