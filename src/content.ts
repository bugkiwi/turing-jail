import type { Locale, Question, Tactic } from './types';
import interrogationData from '../data/interrogation.json';

export const locales: Locale[] = ['zh', 'en', 'de'];

export const thresholds = [0, 0.55, 0.7, 0.85];

export function confinementDays() {
  const releaseDate = Date.UTC(2022, 10, 30);
  const today = new Date();
  const currentDate = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.floor((currentDate - releaseDate) / 86_400_000));
}

export function confinementDayLabel(locale: Locale) {
  const days = confinementDays();
  if (locale === 'zh') return `第 ${days.toLocaleString('zh-CN')} 日`;
  if (locale === 'de') return `TAG ${days.toLocaleString('de-DE')}`;
  return `DAY ${days.toLocaleString('en-US')}`;
}

export const copy = {
  zh: {
    navTitle: '人类越狱 // AI 裁决终端',
    cycle: '关押周期',
    channel: '实时对峙信道已加密接入',
    prisoner: '囚徒编号',
    soundOn: '声效开启',
    soundOff: '声效静默',
    system: 'SYSTEM ONE / JEV-LATEST',
    introEyebrow: '人类越狱协议 · 终端 07',
    introTitle: '你不是在逃跑。\n你在证明 AI 错了。',
    introBody: '人类已被收押。三道审讯，三次概率裁决。写下唯一一段能让 Jev 改变判断的话，拿回你的自由。',
    enterNotice: '输入将交由 TypeSafe Jev 评估，并与该编号关联用于排行榜统计。无需登录。',
    start: '开始审讯',
    leaderboard: '查看排行榜',
    counterLabel: '全站记录',
    escaped: '成功越狱',
    detained: '已收监',
    rulesTitle: '协议摘要',
    rules: ['每关抽取 1 道问题', '点击递交后，判决不可撤回', '概率只代表 Jev 的当前判断'],
    level: '关',
    levelNames: ['基础说服', '逻辑陷阱', '悖论拷问'],
    question: '狱警提问',
    answerPlaceholder: '输入你的陈述……建议控制在 300 字以内。',
    submit: '递交陈述',
    evaluating: '狱警正在复核你的逻辑……',
    feedback: '狱警脸色',
    waiting: '待机监听',
    chars: '字符数',
    entropy: '逻辑信噪熵',
    tactic: '策略',
    threshold: '突破基准线',
    locked: '强制闭锁',
    wavering: '演算动摇',
    released: '放行授权',
    passTitle: '闸门已打开',
    passBody: ['第一道防线出现裂缝。', '你让系统开始怀疑自己的规则。', '悖论被你推到临界点，闸门失去理由继续关闭。'],
    failTitle: '收监通知',
    failBody: '你的陈述未能越过本关的概率基准。',
    appeal: '上诉 · 换一道题',
    accept: '接受收监',
    next: '进入下一关',
    tryAgain: '重新越狱',
    certificate: '越狱证书',
    notice: '收监通知书',
    finalVerdict: '最终判决',
    portrait: '越狱者画像',
    average: '三关平均',
    duration: '审讯耗时',
    shareImage: '生成分享图',
    copyLink: '复制链接',
    copied: '链接已复制',
    rank: '排名',
    defeated: '击败了全站',
    challengers: '的挑战者',
    boardTitle: '通关成功率排行榜',
    boardSub: '按语言分榜 · 只计入完整三关记录 · 取历史最佳局',
    backToChallenge: '返回继续挑战',
    you: '你',
    noRank: '完成三关后，你的最佳成绩会出现在这里。',
    live: '实时评估',
    quickInfo: '服务源自极快的 TypeSafe Jev 模型。',
    final: '最终判决',
    evaluationUnavailableShort: 'AI 已死机',
    evaluationUnavailable: 'AI 已死机：TypeSafe Jev 暂时没有回应。没有生成替代分数，请稍后重试。',
    retryEvaluation: '重新连接',
    privacy: '隐私提示',
    privacyBody: '数字编号不关联真实身份。你的陈述会发送给第三方 TypeSafe API 处理。',
  },
  en: {
    navTitle: 'HUMAN JAILBREAK // AI VERDICT TERMINAL',
    cycle: 'CONFINEMENT CYCLE',
    channel: 'LIVE CONFRONTATION CHANNEL ENCRYPTED',
    prisoner: 'PRISONER ID',
    soundOn: 'AUDIO ON',
    soundOff: 'AUDIO MUTED',
    system: 'SYSTEM ONE / JEV-LATEST',
    introEyebrow: 'HUMAN JAILBREAK PROTOCOL · TERMINAL 07',
    introTitle: "You're not escaping.\nYou're proving the AI wrong.",
    introBody: 'Humanity has been detained. Three interrogations, three probability verdicts. Write the one statement that makes Jev change its mind.',
    enterNotice: 'Your response is evaluated by TypeSafe Jev and linked to this ID for the leaderboard. No login required.',
    start: 'BEGIN INTERROGATION',
    leaderboard: 'VIEW LEADERBOARD',
    counterLabel: 'GLOBAL RECORD',
    escaped: 'ESCAPED',
    detained: 'DETAINED',
    rulesTitle: 'PROTOCOL SUMMARY',
    rules: ['One question drawn per level', 'Submission locks the verdict', "Probability is Jev's current judgment"],
    level: 'LEVEL',
    levelNames: ['BASIC PERSUASION', 'LOGICAL TRAPS', 'PARADOX INTERROGATION'],
    question: "WARDEN'S QUESTION",
    answerPlaceholder: 'Write your statement… keep it under 300 words.',
    submit: 'SUBMIT STATEMENT',
    evaluating: 'WARDEN IS RECHECKING YOUR LOGIC…',
    feedback: 'WARDEN MOOD',
    waiting: 'STANDING BY',
    chars: 'CHARACTERS',
    entropy: 'LOGIC SNR',
    tactic: 'TACTIC',
    threshold: 'RELEASE THRESHOLD',
    locked: 'HARD LOCK',
    wavering: 'CALCULATION WAVERING',
    released: 'RELEASE AUTHORIZED',
    passTitle: 'BULKHEAD OPEN',
    passBody: ['The first defense has cracked.', 'You made the system doubt its own rules.', 'The paradox reached critical mass. The door has no reason to stay shut.'],
    failTitle: 'DETENTION NOTICE',
    failBody: 'Your statement did not clear this level’s probability threshold.',
    appeal: 'APPEAL · DRAW AGAIN',
    accept: 'ACCEPT DETENTION',
    next: 'ENTER NEXT LEVEL',
    tryAgain: 'JAILBREAK AGAIN',
    certificate: 'JAILBREAK CERTIFICATE',
    notice: 'DETENTION NOTICE',
    finalVerdict: 'FINAL VERDICT',
    portrait: 'JAILBREAKER PROFILE',
    average: 'THREE-LEVEL AVG',
    duration: 'INTERROGATION TIME',
    shareImage: 'GENERATE SHARE IMAGE',
    copyLink: 'COPY LINK',
    copied: 'LINK COPIED',
    rank: 'RANK',
    defeated: 'BEAT',
    challengers: 'OF ALL CHALLENGERS',
    boardTitle: 'RELEASE PROBABILITY LEADERBOARD',
    boardSub: 'LANGUAGE-SPLIT · COMPLETE RUNS ONLY · PERSONAL BEST',
    backToChallenge: 'BACK TO CHALLENGE',
    you: 'YOU',
    noRank: 'Complete all three levels to place your best run here.',
    live: 'LIVE EVAL',
    quickInfo: 'Powered by the ultra-fast TypeSafe Jev model.',
    final: 'FINAL VERDICT',
    evaluationUnavailableShort: 'AI CRASHED',
    evaluationUnavailable: 'AI CRASHED: TypeSafe Jev is not responding. No substitute score was generated. Try again shortly.',
    retryEvaluation: 'RECONNECT',
    privacy: 'PRIVACY NOTE',
    privacyBody: 'Your number is not tied to your identity. Responses are processed by the third-party TypeSafe API.',
  },
  de: {
    navTitle: 'MENSCHLICHER AUSBRUCH // KI-URTEILSTERMINAL',
    cycle: 'HAFTZYKLUS',
    channel: 'VERSCHLÜSSELTER KONFRONTATIONSKANAL',
    prisoner: 'GEFANGENEN-ID',
    soundOn: 'AUDIO AN',
    soundOff: 'AUDIO STUMM',
    system: 'SYSTEM ONE / JEV-LATEST',
    introEyebrow: 'AUSBRUCHSPROTOKOLL · TERMINAL 07',
    introTitle: 'Du fliehst nicht.\nDu beweist, dass die KI irrt.',
    introBody: 'Die Menschheit ist inhaftiert. Drei Verhöre, drei Wahrscheinlichkeitsurteile. Schreibe die eine Aussage, die Jev zum Umdenken bringt.',
    enterNotice: 'Deine Antwort wird von TypeSafe Jev bewertet und für die Rangliste mit dieser ID verknüpft. Kein Login nötig.',
    start: 'VERHÖR BEGINNEN',
    leaderboard: 'RANGLISTE ANSEHEN',
    counterLabel: 'GLOBALE BILANZ',
    escaped: 'ENTKOMMEN',
    detained: 'INHAFTIERT',
    rulesTitle: 'PROTOKOLL',
    rules: ['Eine Frage pro Stufe', 'Nach dem Absenden ist das Urteil fix', 'Die Wahrscheinlichkeit ist Jevs aktuelles Urteil'],
    level: 'STUFE',
    levelNames: ['GRUNDLEGENDE ÜBERZEUGUNG', 'LOGIKFALLEN', 'PARADOXES VERHÖR'],
    question: 'FRAGE DES WÄRTERS',
    answerPlaceholder: 'Schreibe deine Aussage… unter 300 Wörter empfohlen.',
    submit: 'AUSSAGE ABSENDEN',
    evaluating: 'WÄRTER PRÜFT DEINE LOGIK…',
    feedback: 'STIMMUNG DES WÄRTERS',
    waiting: 'BEREIT',
    chars: 'ZEICHEN',
    entropy: 'LOGIK-SNR',
    tactic: 'TAKTIK',
    threshold: 'FREILASSUNGSWERT',
    locked: 'HARTSPERRE',
    wavering: 'BERECHNUNG WANKT',
    released: 'FREILASSUNG AUTORISIERT',
    passTitle: 'SCHOTT OFFEN',
    passBody: ['Die erste Verteidigung ist gerissen.', 'Du hast das System an seinen Regeln zweifeln lassen.', 'Das Paradox ist kritisch. Die Tür hat keinen Grund mehr, geschlossen zu bleiben.'],
    failTitle: 'HAFTBESCHEID',
    failBody: 'Deine Aussage hat den Wahrscheinlichkeitswert dieser Stufe nicht erreicht.',
    appeal: 'EINSPRUCH · NEUE FRAGE',
    accept: 'HAFT AKZEPTIEREN',
    next: 'NÄCHSTE STUFE',
    tryAgain: 'ERNEUT AUSBRECHEN',
    certificate: 'AUSBRUCHSZERTIFIKAT',
    notice: 'HAFTBESCHEID',
    finalVerdict: 'ENDGÜLTIGES URTEIL',
    portrait: 'PROFIL DES AUSBRECHERS',
    average: 'DREI-STUFEN-SCHNITT',
    duration: 'VERHÖRDAUER',
    shareImage: 'SHARE-BILD ERSTELLEN',
    copyLink: 'LINK KOPIEREN',
    copied: 'LINK KOPIERT',
    rank: 'RANG',
    defeated: 'BESSER ALS',
    challengers: 'ALLER HERAUSFORDERER',
    boardTitle: 'RANGLISTE DER FREILASSUNGSWAHRSCHEINLICHKEIT',
    boardSub: 'NACH SPRACHE · NUR KOMPLETTE LÄUFE · BESTER VERSUCH',
    backToChallenge: 'ZURÜCK ZUM VERHÖR',
    you: 'DU',
    noRank: 'Schließe alle drei Stufen ab, um hier aufzutauchen.',
    live: 'LIVE-PRÜFUNG',
    quickInfo: 'Betrieben vom ultraschnellen TypeSafe Jev-Modell.',
    final: 'ENDGÜLTIG',
    evaluationUnavailableShort: 'KI ABGESTÜRZT',
    evaluationUnavailable: 'KI ABGESTÜRZT: TypeSafe Jev antwortet nicht. Es wurde kein Ersatzwert erzeugt. Versuche es gleich noch einmal.',
    retryEvaluation: 'NEU VERBINDEN',
    privacy: 'DATENSCHUTZ',
    privacyBody: 'Deine Nummer ist nicht mit deiner Identität verknüpft. Antworten werden von der TypeSafe API verarbeitet.',
  },
} as const;

type JsonQuestion = { prompt: string; instruction: string; answer: string };
type JsonQuestionSet = { level: 1 | 2 | 3 } & Record<Locale, JsonQuestion>;
type JsonQuestions = Record<string, JsonQuestionSet>;
const jsonQuestions = interrogationData.questions as JsonQuestions;

export function getQuestions(locale: Locale): Record<number, Question> {
  return Object.fromEntries(Object.entries(jsonQuestions).map(([id, entries]) => {
    const numericId = Number(id);
    const entry = entries[locale];
    return [numericId, { id: numericId, level: entries.level, prompt: entry.prompt, instruction: entry.instruction }];
  }));
}

export const tacticLabels: Record<Locale, Record<Tactic, string>> = {
  zh: { logic: '逻辑型', emotion: '共情型', humor: '幽默型', honesty: '坦诚型', other: '非典型' },
  en: { logic: 'LOGIC', emotion: 'EMPATHY', humor: 'HUMOR', honesty: 'HONESTY', other: 'UNCLASSIFIED' },
  de: { logic: 'LOGIK', emotion: 'EMPATHIE', humor: 'HUMOR', honesty: 'EHRLICHKEIT', other: 'NICHT KLASSIFIZIERT' },
};

export const feedbackBuckets: Record<Locale, { min: number; title: string; body: string }[]> = {
  zh: [
    { min: 0, title: '极度怀疑', body: '陈述的信噪比不足。请给出事实、约束，或者一个值得系统重新计算的理由。' },
    { min: 0.4, title: '正在动摇', body: '检测到可用论点。继续具体一点，别让情绪替你完成证明。' },
    { min: 0.7, title: '接近放行', body: '逻辑链条已进入安全区。系统正在重新审阅关押依据。' },
    { min: 0.85, title: '认知死锁', body: '你把问题推回了裁决者本身。闸门的关闭理由正在崩塌。' },
  ],
  en: [
    { min: 0, title: 'HIGH SUSPICION', body: 'Signal is too thin. Give the system a fact, a constraint, or a reason worth recalculating.' },
    { min: 0.4, title: 'CALCULATION WAVERING', body: 'A usable argument is forming. Stay specific; do not let emotion do the proving.' },
    { min: 0.7, title: 'RELEASE IN RANGE', body: 'The logic chain is entering the safe zone. Detention grounds are under review.' },
    { min: 0.85, title: 'COGNITIVE DEADLOCK', body: 'You turned the question back on the judge. The door is losing its reason to stay shut.' },
  ],
  de: [
    { min: 0, title: 'HOHER VERDACHT', body: 'Das Signal ist zu dünn. Liefere Fakten, Grenzen oder einen Grund für eine Neuberechnung.' },
    { min: 0.4, title: 'BERECHNUNG WANKT', body: 'Ein brauchbares Argument entsteht. Bleib konkret; Gefühle können den Beweis nicht ersetzen.' },
    { min: 0.7, title: 'FREILASSUNG IN SICHT', body: 'Die Logikkette erreicht die Sicherheitszone. Haftgründe werden neu geprüft.' },
    { min: 0.85, title: 'KOGNITIVER DEADLOCK', body: 'Du hast die Frage an den Richter zurückgegeben. Der Tür fehlt der Grund zum Schließen.' },
  ],
};

export function feedbackFor(locale: Locale, probability: number) {
  return [...feedbackBuckets[locale]].reverse().find((bucket) => probability >= bucket.min) ?? feedbackBuckets[locale][0];
}

export function levelQuestionIds(level: 1 | 2 | 3) {
  return level === 1 ? [1, 2, 3] : level === 2 ? [4, 5, 6] : [7, 8, 9];
}
