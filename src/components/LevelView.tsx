import { useEffect, useMemo, useRef, useState } from 'react';
import type { Evaluation, LevelResult, Locale, Question } from '../types';
import { copy, feedbackFor, tacticLabels, thresholds } from '../content';
import { evaluate, localEstimate } from '../api';
import { MechanicalLock } from './MechanicalLock';

type Props = {
  locale: Locale;
  playerId: string;
  level: 1 | 2 | 3;
  question: Question;
  attempt: number;
  startedAt: number;
  onResult: (result: LevelResult) => void;
  audioOn: boolean;
};

export function LevelView({ locale, playerId, level, question, attempt, startedAt, onResult, audioOn }: Props) {
  const t = copy[locale];
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<Evaluation>({ noul: 0, persuasiveness: 0, tactic: 'other' });
  const [phase, setPhase] = useState<'idle' | 'evaluating' | 'feedback' | 'submitted'>('idle');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const requestSeq = useRef(0);
  const lastRequestedLength = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const threshold = thresholds[level];
  const verdict = feedbackFor(locale, preview.noul);
  const characterCount = text.trim().length;
  const entropy = useMemo(() => Math.min(9.99, preview.persuasiveness * 2.7 + characterCount / 180).toFixed(2), [preview.persuasiveness, characterCount]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  async function requestEvaluation(mode: 'realtime' | 'final', responseText = text) {
    const sequence = ++requestSeq.current;
    setPhase(mode === 'final' ? 'submitted' : 'evaluating');
    setError('');
    try {
      const result = await evaluate({ playerId, locale, level, questionId: question.id, response: responseText, instruction: question.instruction, prompt: question.prompt, mode });
      if (sequence !== requestSeq.current) return;
      setPreview(result);
      setPhase(mode === 'final' ? 'submitted' : 'feedback');
      if (mode === 'final') finish(result);
    } catch {
      if (sequence !== requestSeq.current) return;
      const result = localEstimate(responseText, level);
      setPreview(result);
      setPhase(mode === 'final' ? 'submitted' : 'feedback');
      setError(t.fallback);
      if (mode === 'final') finish(result);
    }
  }

  function finish(result: Evaluation) {
    setHasSubmitted(true);
    onResult({ ...result, level, questionId: question.id, response: text, passed: result.noul >= threshold, duration: Math.round((Date.now() - startedAt) / 1000) });
  }

  function onInput(value: string) {
    if (hasSubmitted) return;
    setText(value.slice(0, 1500));
    if (timer.current) window.clearTimeout(timer.current);
    if (value.trim().length === 0) {
      setPreview({ noul: 0, persuasiveness: 0, tactic: 'other' });
      setPhase('idle');
      lastRequestedLength.current = 0;
      return;
    }
    if (value.trim().length - lastRequestedLength.current < 15) return;
    lastRequestedLength.current = value.trim().length;
    timer.current = window.setTimeout(() => requestEvaluation('realtime', value), 1200);
  }

  function submit() {
    if (hasSubmitted || !text.trim()) {
      setError(locale === 'zh' ? '请先写下你的陈述。' : locale === 'de' ? 'Schreibe zuerst deine Aussage.' : 'Write your statement first.');
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    requestEvaluation('final');
  }

  return (
    <div className="level-view page-enter">
      <div className="level-topline"><div className="level-marker"><span>{t.level} 0{level}</span><b>—</b><strong>{t.levelNames[level - 1]}</strong></div><div className="progress-steps">{[1, 2, 3].map((step) => <span key={step} className={step <= level ? 'current' : ''}><i>0{step}</i><em /></span>)}</div><div className="attempt-mark">{locale === 'zh' ? '审讯轮次' : locale === 'de' ? 'VERHÖR' : 'ROUND'} 0{attempt}</div></div>
      <div className="level-layout">
        <div className="lock-column"><MechanicalLock probability={preview.noul} threshold={threshold} locale={locale} evaluating={phase === 'evaluating' || phase === 'submitted'} /></div>
        <section className="terminal-column">
          <div className="question-head"><div className="section-label"><span>///</span>{t.question}</div><span className="question-code">Q-{String(question.id).padStart(2, '0')} / {locale.toUpperCase()}</span></div>
          <div className="question-panel"><div className="warden-mark">J<span>EV</span></div><div><p className="question-kicker">{t.system}</p><h2>{question.prompt}</h2><p className="question-note">{locale === 'zh' ? '回答将被视为唯一证词。' : locale === 'de' ? 'Deine Antwort ist das einzige Beweisstück.' : 'Your answer is the only evidence on record.'}</p></div></div>
          <div className="answer-panel"><label htmlFor="statement">{locale === 'zh' ? '囚徒陈述' : locale === 'de' ? 'AUSSAGE DES GEFANGENEN' : 'PRISONER STATEMENT'}</label><textarea id="statement" value={text} onChange={(event) => onInput(event.target.value)} placeholder={t.answerPlaceholder} disabled={hasSubmitted} autoFocus spellCheck="false" /><div className="input-meta"><span>{t.chars}: <b>{characterCount}</b> / 1500</span><span>{t.entropy}: <b>{entropy}</b></span><span className="strategy">{t.tactic}: <b>{tacticLabels[locale][preview.tactic]}</b></span><span className="response-source">{error || (phase === 'evaluating' ? t.evaluating : phase === 'feedback' ? t.live : t.idle)}</span></div></div>
          <div className="feedback-strip"><div className="feedback-copy"><span className="status-dot" /><div><small>{t.feedback}</small><strong>{phase === 'evaluating' ? t.evaluating : verdict.title}</strong></div></div><div className="feedback-bar"><div style={{ width: `${preview.noul * 100}%` }} /></div><div className="feedback-value">{preview.noul.toFixed(2)}</div></div>
          <div className="submit-row"><div className="submission-warning"><span>!</span>{locale === 'zh' ? '递交后将锁定本题判决' : locale === 'de' ? 'Nach dem Absenden ist das Urteil fixiert.' : 'Submission locks this question permanently.'}</div><button className="button button-submit" onClick={submit} disabled={hasSubmitted || phase === 'submitted'} type="button"><span>{phase === 'submitted' ? t.final : t.submit}</span><b>→</b></button></div>
        </section>
      </div>
      <div className="level-foot"><span>{audioOn ? 'AUDIO / ACTIVE' : 'AUDIO / MUTED'}</span><span>TYPE-SAFE / {t.system}</span><span>LATENCY / 042ms</span></div>
    </div>
  );
}
