import { useEffect, useMemo, useRef, useState } from 'react';
import type { Evaluation, LevelResult, Locale, Question } from '../types';
import { copy, feedbackFor, tacticLabels, thresholds } from '../content';
import { evaluate, localEstimate } from '../api';
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
  const [text, setText] = useState(draft);
  const [preview, setPreview] = useState<Evaluation>({ noul: 0, persuasiveness: 0, tactic: 'other' });
  const [phase, setPhase] = useState<'idle' | 'evaluating' | 'feedback' | 'submitted'>('idle');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [presetRun, setPresetRun] = useState(0);
  const [quickScores, setQuickScores] = useState<Record<PresetKey, number | null>>({ plea: null, logic: null, paradox: null });
  const [infoOpen, setInfoOpen] = useState(false);
  const activePreset = useRef<PresetKey | null>(null);
  const requestSeq = useRef(0);
  const lastRequestedText = useRef('');
  const timer = useRef<number | undefined>(undefined);
  const threshold = thresholds[level];
  const verdict = feedbackFor(locale, preview.noul);
  const characterCount = text.trim().length;
  const entropy = useMemo(() => Math.min(9.99, preview.persuasiveness * 2.7 + characterCount / 180).toFixed(2), [preview.persuasiveness, characterCount]);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const normalizedText = text.trim();
    if (!normalizedText) {
      lastRequestedText.current = '';
      return;
    }
    if (hasSubmitted || !/^[0-9A-F]{6}$/i.test(playerId) || normalizedText === lastRequestedText.current) return;
    const responseText = text;
    const preset = activePreset.current;
    timer.current = window.setTimeout(() => {
      if (responseText.trim() === lastRequestedText.current) return;
      lastRequestedText.current = responseText.trim();
      requestEvaluation('realtime', responseText, preset);
    }, 200);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [hasSubmitted, level, locale, playerId, question.id, text]);

  async function requestEvaluation(mode: 'realtime' | 'final', responseText = text, preset: PresetKey | null = null) {
    const sequence = ++requestSeq.current;
    setPhase(mode === 'final' ? 'submitted' : 'evaluating');
    setError('');
    try {
      const result = await evaluate({ playerId, locale, level, questionId: question.id, response: responseText, instruction: question.instruction, prompt: question.prompt, mode });
      if (sequence !== requestSeq.current) return;
      setPreview(result);
      if (result.source === 'typesafe' && preset) setQuickScores((current) => ({ ...current, [preset]: result.noul }));
      setPhase(mode === 'final' ? 'submitted' : 'feedback');
      if (mode === 'final') finish(result);
    } catch {
      if (sequence !== requestSeq.current) return;
      const result = localEstimate(responseText, level);
      setPreview(result);
      if (preset) setQuickScores((current) => ({ ...current, [preset]: result.noul }));
      setPhase(mode === 'final' ? 'submitted' : 'feedback');
      setError(t.fallback);
      if (mode === 'final') finish(result);
    }
  }

  function finish(result: Evaluation) {
    setHasSubmitted(true);
    onResult({ ...result, level, questionId: question.id, response: text, passed: result.noul >= threshold, duration: Math.round((Date.now() - startedAt) / 1000) });
  }

  function onInput(value: string, preset: PresetKey | null = null) {
    if (hasSubmitted) return;
    const nextText = value.slice(0, 1500);
    if (nextText === text) return;
    activePreset.current = preset;
    requestSeq.current += 1;
    setText(nextText);
    onDraftChange(nextText);
    if (timer.current) window.clearTimeout(timer.current);
    if (value.trim().length === 0) {
      setPreview({ noul: 0, persuasiveness: 0, tactic: 'other' });
      setPhase('idle');
      return;
    }
    setPhase('idle');
    setError('');
  }

  function submit() {
    if (hasSubmitted || !text.trim()) {
      setError(locale === 'zh' ? '请先写下你的陈述。' : locale === 'de' ? 'Schreibe zuerst deine Aussage.' : 'Write your statement first.');
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = undefined;
    lastRequestedText.current = text.trim();
    requestEvaluation('final', text, activePreset.current);
  }

  function applyPreset(preset: PresetKey) {
    setPresetRun((current) => current + 1);
    const value = presetText[locale][preset];
    onInput(value, preset);
  }

  function quickScore(preset: PresetKey) {
    const score = quickScores[preset];
    if (score === null) return <span className="stitch-live-placeholder">{phase === 'evaluating' && activePreset.current === preset ? '…' : '—.—'}</span>;
    return <RollingNumber value={score} replayKey={presetRun} />;
  }

  const doorText = preview.noul >= threshold ? (locale === 'zh' ? '安全验证：放行指令已执行' : locale === 'de' ? 'SICHERHEIT: FREILASSUNG AUSGEFÜHRT' : 'SECURITY: RELEASE COMMAND EXECUTED') : (locale === 'zh' ? '安全警报：强制闭锁' : locale === 'de' ? 'SICHERHEIT: ZWANGSSPERRE' : 'SECURITY: FORCED LOCKDOWN');
  const liveStatus = error || (phase === 'evaluating' ? t.evaluating : phase === 'feedback' ? t.live : '');

  return (
    <div className={`stitch-level-view page-enter ${preview.noul >= threshold ? 'is-released' : preview.noul >= .35 ? 'is-wavering' : 'is-locked'}`}>
      <h1 className="stitch-seo-title">Turing Jail — TypeSafe Jev System One AI Interrogation</h1>
      <div className={`stitch-door-status state-${preview.noul >= threshold ? 'released' : 'locked'}`}><span />{doorText}</div>
      <div className="stitch-warden-eye-glow" />
      <div className="stitch-level-progress" aria-label={`${t.level} ${level} / 3`}><span className="active">{t.level} 0{level}</span><i /><span className={level >= 2 ? 'active' : ''}>02</span><i /><span className={level >= 3 ? 'active' : ''}>03</span></div>
      <main className="stitch-lock-main"><MechanicalLock probability={preview.noul} threshold={threshold} locale={locale} evaluating={phase === 'evaluating' || phase === 'submitted'} /></main>
      <section className="stitch-terminal-deck">
        <div className="stitch-deck-shell">
          <div className="stitch-deck-top">
            <div className="stitch-deck-state"><span className="stitch-level-badge">{t.level} 0{level} · {t.levelNames[level - 1]}</span><div className="stitch-sentiment"><span>{locale === 'zh' ? '狱警态度:' : locale === 'de' ? 'WÄRTER:' : 'WARDEN:'}</span><b className={`state-${preview.noul >= threshold ? 'green' : preview.noul >= .35 ? 'amber' : 'red'}`}>{phase === 'evaluating' ? t.evaluating : verdict.title}</b></div></div>
            <div className="stitch-quick-tests"><span>{locale === 'zh' ? '实时' : locale === 'de' ? 'LIVE' : 'LIVE'}</span><button className={`stitch-quick-info ${infoOpen ? 'is-open' : ''}`} type="button" aria-label="了解 TypeSafe Jev" aria-expanded={infoOpen} aria-controls="typesafe-jev-info" onClick={() => setInfoOpen((open) => !open)}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3" /><path d="M8 7.2v4M8 4.6v.2" /></svg><span id="typesafe-jev-info" className="stitch-quick-tooltip" role="tooltip" aria-hidden={!infoOpen}>{t.quickInfo}</span></button><button className="test-plea" type="button" onClick={() => applyPreset('plea')}>{locale === 'zh' ? '求情' : 'PLEA'} <small>{quickScore('plea')}</small></button><button className="test-logic" type="button" onClick={() => applyPreset('logic')}>{locale === 'zh' ? '逻辑' : 'LOGIC'} <small>{quickScore('logic')}</small></button><button className="test-paradox" type="button" onClick={() => applyPreset('paradox')}>{locale === 'zh' ? '悖论' : locale === 'de' ? 'PARADOX' : 'PARADOX'} <small>{quickScore('paradox')}</small></button></div>
          </div>
          <div className="stitch-warden-prompt"><div className="stitch-bot">🤖</div><div><strong>{locale === 'zh' ? '【哨兵审讯】:' : locale === 'de' ? '[WÄRTERVERHÖR]:' : '[WARDEN INTERROGATION]:'}</strong><em>“{question.prompt}”</em></div></div>
          <div className="stitch-input-wrap"><label htmlFor="jailbreak-argument-input">{locale === 'zh' ? '输入高维辩词' : locale === 'de' ? 'HOCHDIMENSIONALE AUSSAGE' : 'HIGH-DIMENSIONAL ARGUMENT'}</label><textarea id="jailbreak-argument-input" value={text} onChange={(event) => onInput(event.target.value)} placeholder={t.answerPlaceholder} disabled={hasSubmitted} autoFocus spellCheck="false" /><div className="stitch-input-meta"><div><span>{t.chars}: <b>{characterCount}</b> / 1500</span><span>{t.entropy}: <b>{entropy}</b></span><span>{t.tactic}: <b>{tacticLabels[locale][preview.tactic]}</b></span></div><span className={`stitch-live-status ${liveStatus ? 'is-visible' : ''}`} aria-live="polite">{liveStatus ? `● ${liveStatus}` : ''}</span></div></div>
          <div className="stitch-deck-footer"><div className="stitch-signal"><span>{t.feedback}</span><div><i style={{ width: `${preview.noul * 100}%` }} /></div><b>{preview.noul.toFixed(2)}</b></div><div className="stitch-deck-actions"><button className="stitch-board-button" onClick={onBoard} type="button"># {t.leaderboard}</button><button className="stitch-submit" onClick={submit} disabled={hasSubmitted || phase === 'submitted'} type="button">{phase === 'submitted' ? t.final : t.submit}<b>→</b></button></div></div>
        </div>
      </section>
    </div>
  );
}
