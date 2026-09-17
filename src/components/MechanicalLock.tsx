import type { Locale } from '../types';
import { copy } from '../content';

type Props = { probability: number | null; threshold: number; locale: Locale; evaluating?: boolean; evaluationError?: boolean };

function LockGlyph({ open }: { open: boolean }) {
  return (
    <svg className="stitch-lock-glyph" viewBox="0 0 48 56" aria-hidden="true">
      <rect x="8" y="23" width="32" height="25" rx="2" className="stitch-lock-body" />
      <path d={open ? 'M15 23V14a9 9 0 0 1 17.4-3' : 'M15 23V14a9 9 0 0 1 18 0v9'} className="stitch-lock-shackle" />
      <circle cx="24" cy="34" r="3" className="stitch-lock-keyhole" />
      <path d="M24 37v5" className="stitch-lock-keyline" />
    </svg>
  );
}

export function MechanicalLock({ probability, threshold, locale, evaluating = false, evaluationError = false }: Props) {
  const t = copy[locale];
  const hasProbability = probability !== null;
  const value = probability ?? 0;
  const unlocked = hasProbability && value >= threshold;
  const state = !hasProbability ? (evaluationError ? 'unavailable' : 'locked') : unlocked ? 'released' : value >= 0.35 ? 'wavering' : 'locked';
  const progress = 816.81 * (1 - value);

  return (
    <div className={`stitch-lock-assembly state-${state} ${evaluating ? 'is-evaluating' : ''}`} aria-label={`${t.feedback}: ${hasProbability ? `${(value * 100).toFixed(0)}%` : evaluationError ? t.evaluationUnavailableShort : '0%'}`}>
      <div className="stitch-steam steam-left" />
      <div className="stitch-steam steam-right" />
      <div className="stitch-bolt stitch-bolt-left"><div className="stitch-bolt-lights"><i /><i /><i /></div><div><span>{locale === 'zh' ? '液压死栓·左' : locale === 'de' ? 'HYDRAULIKBOLZEN · L' : 'HYDRAULIC BOLT · L'}</span><b>{unlocked ? (locale === 'zh' ? '[完全解脱]' : '[RETRACTED]') : (locale === 'zh' ? '[深度咬合]' : '[ENGAGED]')}</b></div></div>
      <div className="stitch-bolt stitch-bolt-right"><div><span>{locale === 'zh' ? '液压死栓·右' : locale === 'de' ? 'HYDRAULIKBOLZEN · R' : 'HYDRAULIC BOLT · R'}</span><b>{unlocked ? (locale === 'zh' ? '[完全解脱]' : '[RETRACTED]') : (locale === 'zh' ? '[深度咬合]' : '[ENGAGED]')}</b></div><div className="stitch-bolt-lights"><i /><i /><i /></div></div>
      <div className="stitch-outer-gear"><i className="gear-mark top" /><i className="gear-mark bottom" /><i className="gear-mark left" /><i className="gear-mark right" /><i className="stitch-rivet top-left" /><i className="stitch-rivet top-right" /><i className="stitch-rivet bottom-left" /><i className="stitch-rivet bottom-right" /></div>
      <div className="stitch-calibrator" />
      <div className="stitch-sweep" />
      <svg className="stitch-dials" viewBox="0 0 320 320" aria-hidden="true">
        <circle className="dial-base" cx="160" cy="160" r="130" />
        <circle className="dial-segments" cx="160" cy="160" r="130" />
        <circle className="dial-threshold" cx="160" cy="160" r="130" />
        <circle className="dial-progress" cx="160" cy="160" r="130" strokeDasharray="816.81" strokeDashoffset={progress} />
        <circle className="dial-inner" cx="160" cy="160" r="108" />
      </svg>
      <div className="stitch-lock-core">
        <div className="stitch-core-label"><span /> <strong>{locale === 'zh' ? 'L-01 液压隔断闸栓' : locale === 'de' ? 'L-01 HYDRAULISCHE SPERRE' : 'L-01 HYDRAULIC BULKHEAD'}</strong></div>
        <LockGlyph open={unlocked} />
        <div className="stitch-probability">{hasProbability ? value.toFixed(2) : evaluationError ? '—.—' : '0.00'}<span>/ 1.00</span></div>
        <div className="stitch-status-badge">{evaluationError ? t.evaluationUnavailableShort : unlocked ? (value >= 0.85 ? (locale === 'zh' ? '【安全解锁】机械锁销已弹出' : '[SECURE UNLOCK] BOLTS RETRACTED') : t.released) : state === 'wavering' ? t.wavering : t.locked}</div>
        <div className="stitch-threshold">{t.threshold}: <b>≥ {threshold.toFixed(2)}</b></div>
      </div>
    </div>
  );
}
