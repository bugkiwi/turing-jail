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
        <button className="id-chip" onClick={() => onBoard()} type="button"><span>{t.prisoner}</span><b>#{playerId}</b></button>
        <LanguageSwitch locale={locale} onChange={onLocale} />
        <button className={`audio-button ${audioOn ? 'is-on' : 'is-off'}`} onClick={onAudio} type="button" aria-label={audioOn ? t.soundOn : t.soundOff} aria-pressed={audioOn}>
          <span className="audio-icon" aria-hidden="true"><svg viewBox="0 0 40 32" role="presentation"><path className="audio-speaker" d="M4 12h7l8-7v22l-8-7H4z" /><path className="audio-wave audio-wave-one" d="M24 9c3 2 3 12 0 14" /><path className="audio-wave audio-wave-two" d="M29 5c6 4 6 18 0 22" /><path className="audio-wave audio-wave-three" d="M34 2c8 7 8 21 0 28" />{!audioOn && <path className="audio-slash" d="M22 4 37 29" />}</svg></span>
          <em>{audioOn ? t.soundOn : t.soundOff}</em>
        </button>
      </div>
    </header>
  );
}
