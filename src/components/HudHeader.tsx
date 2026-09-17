import type { Locale } from '../types';
import { confinementDayLabel, copy } from '../content';
import { LanguageSwitch } from './LanguageSwitch';

type Props = { locale: Locale; playerId: string; audioOn: boolean; onLocale: (locale: Locale) => void; onAudio: () => void; onBoard: () => void };

export function HudHeader({ locale, playerId, audioOn, onLocale, onAudio, onBoard }: Props) {
  const t = copy[locale];
  return (
    <header className="hud-header">
      <div className="hud-brand">
        <span className="status-dot danger" />
        <button className="brand-button" onClick={() => onBoard()} type="button">{t.navTitle}</button>
      </div>
      <div className="hud-cycle"><span>{t.cycle}</span><strong>{confinementDayLabel(locale)}</strong></div>
      <div className="hud-channel"><span className="status-dot live" />{t.channel}</div>
      <div className="hud-actions">
        <div className="id-chip"><span>{t.prisoner}</span><b>#{playerId}</b></div>
        <LanguageSwitch locale={locale} onChange={onLocale} />
        <button className="board-icon-button" onClick={onBoard} type="button" aria-label={t.leaderboard} title={t.leaderboard}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11M12 20V6M20 20V3M2.5 20h19" /></svg>
        </button>
        <a className="github-link" href="https://github.com/bugkiwi/turing-jail" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6a9.4 9.4 0 0 0-2.97 18.32c.47.09.64-.2.64-.45v-1.67c-2.61.57-3.16-1.1-3.16-1.1-.43-1.08-1.04-1.37-1.04-1.37-.85-.58.06-.57.06-.57.94.07 1.44.97 1.44.97.84 1.44 2.2 1.02 2.74.78.09-.61.33-1.02.6-1.25-2.08-.24-4.27-1.04-4.27-4.63 0-1.02.36-1.85.96-2.5-.1-.24-.42-1.18.09-2.46 0 0 .78-.25 2.58.96A8.94 8.94 0 0 1 12 7.3c.79 0 1.59.11 2.33.34 1.8-1.21 2.58-.96 2.58-.96.51 1.28.19 2.22.09 2.46.6.65.96 1.48.96 2.5 0 3.6-2.2 4.39-4.29 4.62.34.29.64.86.64 1.74v2.57c0 .25.17.54.65.45A9.4 9.4 0 0 0 12 2.6Z" /></svg>
        </a>
        <button className={`audio-button ${audioOn ? 'is-on' : 'is-off'}`} onClick={onAudio} type="button" aria-label={audioOn ? t.soundOn : t.soundOff} aria-pressed={audioOn}>
          <span className="audio-icon" aria-hidden="true"><svg viewBox="0 0 40 32" role="presentation"><path className="audio-speaker" d="M4 12h7l8-7v22l-8-7H4z" /><path className="audio-wave audio-wave-one" d="M24 9c3 2 3 12 0 14" /><path className="audio-wave audio-wave-two" d="M29 5c6 4 6 18 0 22" /><path className="audio-wave audio-wave-three" d="M34 2c8 7 8 21 0 28" />{!audioOn && <path className="audio-slash" d="M22 4 37 29" />}</svg></span>
        </button>
      </div>
    </header>
  );
}
