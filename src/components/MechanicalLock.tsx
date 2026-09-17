import type { CSSProperties } from 'react';
import type { Locale } from '../types';
import { copy, feedbackFor } from '../content';

type Props = { probability: number; threshold: number; locale: Locale; evaluating?: boolean };

function LockGlyph({ open }: { open: boolean }) {
  return (
    <svg className="lock-glyph" viewBox="0 0 48 56" aria-hidden="true">
      <rect x="8" y="23" width="32" height="25" rx="2" className="lock-body" />
      <path d={open ? 'M15 23V14a9 9 0 0 1 17.4-3' : 'M15 23V14a9 9 0 0 1 18 0v9'} className="lock-shackle" />
      <circle cx="24" cy="34" r="3" className="lock-keyhole" />
      <path d="M24 37v5" className="lock-keyline" />
    </svg>
  );
}

export function MechanicalLock({ probability, threshold, locale, evaluating = false }: Props) {
  const t = copy[locale];
  const verdict = feedbackFor(locale, probability);
  const unlocked = probability >= threshold;
  const state = unlocked ? 'released' : probability >= 0.35 ? 'wavering' : 'locked';
  const percent = Math.round(probability * 100);
  const angle = `${Math.max(2, probability * 360)}deg`;

  return (
    <section className={`lock-stage state-${state} ${evaluating ? 'is-evaluating' : ''}`} aria-label={`${t.feedback}: ${percent}%`}>
      <div className="lock-radar radar-one" />
      <div className="lock-radar radar-two" />
      <div className="lock-tick tick-top" />
      <div className="lock-tick tick-bottom" />
      <div className="lock-tick tick-left" />
      <div className="lock-tick tick-right" />
      <div className="lock-ring ring-outer" />
      <div className="lock-ring ring-segments" />
      <div className="lock-progress" style={{ '--progress-angle': angle } as CSSProperties} />
      <div className="bolt bolt-left"><span>HYDRAULIC · L</span><b>{unlocked ? 'RETRACTED' : 'ENGAGED'}</b></div>
      <div className="bolt bolt-right"><span>HYDRAULIC · R</span><b>{unlocked ? 'RETRACTED' : 'ENGAGED'}</b></div>
      <div className="lock-core">
        <div className="core-kicker"><i /> L—0{state === 'released' ? 'X' : '1'} · {t.system}</div>
        <LockGlyph open={unlocked} />
        <div className="probability">{probability.toFixed(2)}<small>/ 1.00</small></div>
        <div className="lock-status">{unlocked ? t.released : state === 'wavering' ? t.wavering : t.locked}</div>
        <div className="threshold-line">{t.threshold}: <strong>{threshold.toFixed(2)}</strong></div>
        <div className="core-readout">{evaluating ? t.evaluating : verdict.title}</div>
      </div>
      <div className="lock-label label-left">{locale === 'zh' ? '液压死栓' : locale === 'de' ? 'HYDRAULIKBOLZEN' : 'HYDRAULIC BOLT'}<b>01</b></div>
      <div className="lock-label label-right">{locale === 'zh' ? '压力回路' : locale === 'de' ? 'DRUCKKREIS' : 'PRESSURE LOOP'}<b>02</b></div>
    </section>
  );
}
