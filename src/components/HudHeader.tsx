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
        <button className="audio-button" onClick={onAudio} type="button" aria-label={audioOn ? t.soundOn : t.soundOff}><span>{audioOn ? '◖)))' : '◖×)'}</span><em>{audioOn ? t.soundOn : t.soundOff}</em></button>
      </div>
    </header>
  );
}
