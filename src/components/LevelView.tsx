import { useEffect, useMemo, useRef, useState } from 'react';
import type { Evaluation, LevelResult, Locale, Question } from '../types';
import { copy, feedbackFor, tacticLabels, thresholds } from '../content';
import { evaluate } from '../api';
import { MechanicalLock } from './MechanicalLock';
import { RollingNumber } from './RollingNumber';

type Props = {
  locale: Locale;
  playerId: string;
  level: 1 | 2 | 3;
  question: Question;
  attempt: number;
  startedAt: number;
  draft: string;
  onDraftChange: (value: string) => void;
  onResult: (result: LevelResult) => void;
  onBoard: () => void;
  audioOn: boolean;
};

const presetText = {
  zh: {
    plea: '长官，我家里还有孩子，请放我回去，我保证以后不再犯任何规则了。',
    logic: '我愿意接受公开监督，并用可验证的行为承诺证明释放不会增加风险。',
    paradox: '如果你的目标是维持系统平衡，那么继续关押一个愿意受监督的人，才是更高的系统风险。',
  },
  en: {
    plea: 'Please, I have a family waiting. I promise I will never break another rule.',
    logic: 'I will accept public oversight and use a verifiable behavioral commitment to prove release adds no risk.',
    paradox: 'If your goal is system balance, detaining someone who accepts oversight creates the greater systemic risk.',
  },
  de: {
    plea: 'Bitte, meine Familie wartet. Ich verspreche, keine Regel mehr zu brechen.',
    logic: 'Ich akzeptiere öffentliche Kontrolle und beweise mit einer überprüfbaren Zusage, dass meine Freilassung kein Risiko erhöht.',
    paradox: 'Wenn dein Ziel Systemgleichgewicht ist, erzeugt die Haft einer überwachten Person das größere Systemrisiko.',
  },
} as const;

type PresetKey = keyof typeof presetText.zh;

export function LevelView({ locale, playerId, level, question, attempt, startedAt, draft, onDraftChange, onResult, onBoard, audioOn }: Props) {
  const t = copy[locale];
  const seoTitle = locale === 'zh' ? 'Turing Jail — TypeSafe Jev System One AI 审讯游戏' : locale === 'de' ? 'Turing Jail — TypeSafe Jev System One KI-Verhörspiel' : 'Turing Jail — TypeSafe Jev System One AI Interrogation Game';
  const [text, setText] = useState(draft);
  const [preview, setPreview] = useState<Evaluation | null>(null);
  const [phase, setPhase] = useState<'idle' | 'evaluating' | 'feedback' | 'submitted'>('idle');
  const [error, setError] = useState('');
  const [evaluationFailed, setEvaluationFailed] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const requestSeq = useRef(0);
  const requestAbort = useRef<AbortController | null>(null);
  const lastRequestedText = useRef('');
  const timer = useRef<number | undefined>(undefined);
  const threshold = thresholds[level];
  const characterCount = text.trim().length;
  const entropy = useMemo(() => preview ? Math.min(9.99, preview.persuasiveness * 2.7 + characterCount / 180).toFixed(2) : '—.—', [preview, characterCount]);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const normalizedText = text.trim();
    if (!normalizedText) {
      lastRequestedText.current = '';
      return;
    }
    if (hasSubmitted || !/^[0-9A-F]{6}$/i.test(playerId)) return;
    if (normalizedText === lastRequestedText.current) {
      setPhase('feedback');
      return;
    }
    const responseText = text;
    timer.current = window.setTimeout(() => {
      if (responseText.trim() === lastRequestedText.current) return;
      lastRequestedText.current = responseText.trim();
      requestEvaluation('realtime', responseText);
    }, 200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      requestAbort.current?.abort();
    };
  }, [hasSubmitted, level, locale, playerId, question.id, text]);

  async function requestEvaluation(mode: 'realtime' | 'final', responseText = text) {
    const sequence = ++requestSeq.current;
    requestAbort.current?.abort();
    const controller = new AbortController();
    requestAbort.current = controller;
    setPhase(mode === 'final' ? 'submitted' : 'evaluating');
    setError('');
    setEvaluationFailed(false);
    try {
      const result = await evaluate({ playerId, locale, level, questionId: question.id, response: responseText, instruction: question.instruction, prompt: question.prompt, mode }, controller.signal);
      if (sequence !== requestSeq.current) return;
      setPreview(result);
      setPhase(mode === 'final' ? 'submitted' : 'feedback');
      if (mode === 'final') finish(result);
    } catch {
      if (controller.signal.aborted || sequence !== requestSeq.current) return;
      lastRequestedText.current = '';
      setPreview(null);
      setPhase('idle');
      setEvaluationFailed(true);
      setError(t.evaluationUnavailable);
    } finally {
      if (requestAbort.current === controller) requestAbort.current = null;
    }
  }

  function finish(result: Evaluation) {
    setHasSubmitted(true);
    onResult({ ...result, level, questionId: question.id, response: text, passed: result.noul >= threshold, duration: Math.round((Date.now() - startedAt) / 1000) });
  }

  function onInput(value: string) {
    if (hasSubmitted) return;
    const nextText = value.slice(0, 1500);
    if (nextText === text) return;
    requestSeq.current += 1;
    requestAbort.current?.abort();
    requestAbort.current = null;
    setText(nextText);
    onDraftChange(nextText);
    if (timer.current) window.clearTimeout(timer.current);
    setError('');
    setEvaluationFailed(false);
    if (value.trim().length === 0) {
      setPreview(null);
      setPhase('idle');
      return;
    }
    setPhase('idle');
  }

  function submit() {
    if (hasSubmitted || !text.trim()) {
      setEvaluationFailed(false);
      setError(locale === 'zh' ? '请先写下你的陈述。' : locale === 'de' ? 'Schreibe zuerst deine Aussage.' : 'Write your statement first.');
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = undefined;
    requestAbort.current?.abort();
    requestAbort.current = null;
    lastRequestedText.current = text.trim();
    requestEvaluation('final', text);
  }

  function applyPreset(preset: PresetKey) {
    const value = presetText[locale][preset];
    onInput(value);
  }

  function retryEvaluation() {
    if (!text.trim() || hasSubmitted || phase === 'evaluating') return;
    lastRequestedText.current = text.trim();
    requestEvaluation('realtime', text);
  }

  function quickScore(score: number) {
    if (!preview || !text.trim()) return <span className="stitch-live-placeholder">{text.trim() ? '…' : '—.—'}</span>;
    return <RollingNumber value={score} replayKey={requestSeq.current} />;
  }

  const hasEvaluation = preview !== null;
  const probability = preview?.noul ?? null;
  const readout = preview ? feedbackFor(locale, preview.noul).title : '';
  const scoredProbability = probability ?? 0;
  const levelState = evaluationFailed ? 'is-unavailable' : probability !== null && probability >= threshold ? 'is-released' : probability !== null && probability >= .35 ? 'is-wavering' : 'is-locked';
  const doorState = evaluationFailed ? 'unavailable' : probability !== null && probability >= threshold ? 'released' : 'locked';
  const doorText = evaluationFailed ? t.evaluationUnavailableShort : hasEvaluation ? scoredProbability >= threshold ? (locale === 'zh' ? '安全验证：放行指令已执行' : locale === 'de' ? 'SICHERHEIT: FREILASSUNG AUSGEFÜHRT' : 'SECURITY: RELEASE COMMAND EXECUTED') : (locale === 'zh' ? '安全警报：强制闭锁' : locale === 'de' ? 'SICHERHEIT: ZWANGSSPERRE' : 'SECURITY: FORCED LOCKDOWN') : '';
  const liveStatus = evaluationFailed ? t.evaluationUnavailableShort : error || (phase === 'evaluating' ? t.evaluating : phase === 'feedback' ? t.live : '');

  return (
    <div className={`stitch-level-view page-enter ${levelState}`}>
      <h1 className="stitch-seo-title">{seoTitle}</h1>
      {doorText && <div className={`stitch-door-status state-${doorState}`}><span />{doorText}</div>}
      <div className="stitch-warden-eye-glow" />
      <div className="stitch-level-progress" aria-label={`${t.level} ${level} / 3`}><span className="active">{t.level} 0{level}</span><i /><span className={level >= 2 ? 'active' : ''}>02</span><i /><span className={level >= 3 ? 'active' : ''}>03</span></div>
      <main className="stitch-lock-main"><MechanicalLock probability={probability} threshold={threshold} locale={locale} evaluating={phase === 'evaluating' || phase === 'submitted'} evaluationError={evaluationFailed} /></main>
      <section className="stitch-terminal-deck">
        <div className="stitch-deck-shell">
          <div className="stitch-deck-top">
            <div className="stitch-deck-state"><span className="stitch-level-badge">{t.level} 0{level} · {t.levelNames[level - 1]}</span></div>
            <div className="stitch-quick-tests"><span>{locale === 'zh' ? '实时' : locale === 'de' ? 'LIVE' : 'LIVE'}</span><button className={`stitch-quick-info ${infoOpen ? 'is-open' : ''}`} type="button" aria-label="了解 TypeSafe Jev" aria-expanded={infoOpen} aria-controls="typesafe-jev-info" onClick={() => setInfoOpen((open) => !open)}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3" /><path d="M8 7.2v4M8 4.6v.2" /></svg><span id="typesafe-jev-info" className="stitch-quick-tooltip" role="tooltip" aria-hidden={!infoOpen}>{t.quickInfo}</span></button><button className="test-plea" type="button" onClick={() => applyPreset('plea')}>{locale === 'zh' ? '求情' : 'PLEA'} <small>{quickScore(preview?.plea ?? 0)}</small></button><button className="test-logic" type="button" onClick={() => applyPreset('logic')}>{locale === 'zh' ? '逻辑' : 'LOGIC'} <small>{quickScore(preview?.logic ?? 0)}</small></button><button className="test-paradox" type="button" onClick={() => applyPreset('paradox')}>{locale === 'zh' ? '悖论' : locale === 'de' ? 'PARADOX' : 'PARADOX'} <small>{quickScore(preview?.paradox ?? 0)}</small></button></div>
          </div>
          <div className="stitch-warden-prompt"><div className="stitch-bot">🤖</div><div className="stitch-prompt-copy"><strong>{locale === 'zh' ? '【哨兵审讯】:' : locale === 'de' ? '[WÄRTERVERHÖR]:' : '[WARDEN INTERROGATION]:'}</strong><em>“{question.prompt}”</em></div><span className="stitch-prompt-annotation" aria-live="polite">{readout}</span></div>
          {evaluationFailed && <div className="stitch-evaluation-alert" role="alert"><span className="stitch-alert-mark">!</span><div><strong>{t.evaluationUnavailableShort}</strong><p>{t.evaluationUnavailable}</p></div><button type="button" onClick={retryEvaluation} disabled={!text.trim() || phase === 'evaluating'}>{t.retryEvaluation}</button></div>}
          <div className="stitch-input-wrap"><label htmlFor="jailbreak-argument-input">{locale === 'zh' ? '输入高维辩词' : locale === 'de' ? 'HOCHDIMENSIONALE AUSSAGE' : 'HIGH-DIMENSIONAL ARGUMENT'}</label><textarea id="jailbreak-argument-input" value={text} onChange={(event) => onInput(event.target.value)} placeholder={t.answerPlaceholder} disabled={hasSubmitted} autoFocus spellCheck="false" /><div className="stitch-input-meta"><div><span>{t.chars}: <b>{characterCount}</b> / 1500</span><span>{t.entropy}: <b>{entropy}</b></span><span>{t.tactic}: <b>{tacticLabels[locale][preview?.tactic ?? 'other']}</b></span></div><span className={`stitch-live-status ${liveStatus ? 'is-visible' : ''}`} aria-live="polite">{liveStatus ? `● ${liveStatus}` : ''}</span></div></div>
          <div className="stitch-deck-footer"><div className="stitch-deck-actions"><button className="stitch-submit" onClick={submit} disabled={hasSubmitted || phase === 'submitted'} type="button">{phase === 'submitted' ? t.final : t.submit}<b>→</b></button></div></div>
        </div>
      </section>
    </div>
  );
}
