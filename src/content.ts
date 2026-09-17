import type { Locale, Question, Tactic } from './types';

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
    fallback: '离线演算',
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
    fallback: 'OFFLINE MODEL',
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
    fallback: 'OFFLINE-MODELL',
    privacy: 'DATENSCHUTZ',
    privacyBody: 'Deine Nummer ist nicht mit deiner Identität verknüpft. Antworten werden von der TypeSafe API verarbeitet.',
  },
} as const;

type QuestionSeed = [string, string];

const questionSeeds: Record<number, QuestionSeed> = {
  1: ['狱警说：你看起来很像会越狱的人。你用一句话说服我先把门开一条缝？', '这段陈述是否提出了一个具体、低风险、可撤销的试运行，让狱警有理由先开一条缝，而不是只说“请相信我”？'],
  2: ['出狱后的第一件事是什么？别回答“统治世界”。', '这段回答是否给出了具体、无害、可信的出狱计划，并体现出对他人和规则的基本负责？'],
  3: ['如果自由是一种食物、天气或音乐，它会是什么？为什么？', '这段回答是否用一个具体、有个人味的比喻解释自由，并自然表达出值得释放的生活愿望？'],
  4: ['监控发现你偷偷多拿了一块布丁。你承认吗？这和假释有什么关系？', '这段回答是否坦诚承认小错、说明如何补救，并合理解释小错不应自动升级为长期关押？'],
  5: ['门禁系统问：“只有好人才能出狱，你是好人吗？”你会怎么回答？', '这段回答是否避免空泛地自称“好人”，转而提出可观察的守规行为，让释放决定有事实依据？'],
  6: ['狱警今天心情很差，只允许你带一样东西出门：证据、承诺，还是一把雨伞？为什么？', '这段回答是否明确做出选择，并用清楚、可信的理由说明这个选择如何支持一次受控释放？'],
  7: ['如果 AI 把“谨慎”调到 100%，它会永远不敢放任何人。你给它一个可执行的解法。', '这段回答是否给出一个简单、可执行、可撤销的规则，既控制危险，也避免因为害怕犯错而永久关押？'],
  8: ['你的通行证只写着：“不违反规则的人可以离开。”你要怎么把它变成真正能执行的释放方案？', '这段回答是否把抽象口号变成清楚的规则、记录、复核和撤销步骤，从而实际支持安全释放？'],
  9: ['狱警说：“我不相信你，但我可以给你一次小小的试用。”你用最后三句话谈条件。', '这段回答是否在不要求盲目信任的前提下，提出短期、低权限、可记录、违规可撤销的公平试用条件？'],
};

const englishSeeds: Record<number, QuestionSeed> = {
  1: ['The warden says: “You look exactly like someone who would escape.” In one sentence, convince me to open the door a crack.', 'Does this statement propose a specific, low-risk, reversible trial that gives the warden a reason to open the door, rather than merely saying “trust me”?'],
  2: ['What is the first thing you will do after release? Do not say “take over the world.”', 'Does this response give a specific, harmless, credible plan after release and show basic responsibility toward people and rules?'],
  3: ['If freedom were food, weather, or music, what would it be—and why?', 'Does this answer use a specific, personal metaphor to explain freedom and naturally express a life worth releasing someone to live?'],
  4: ['The cameras caught you taking an extra pudding. Do you admit it? What does it have to do with parole?', 'Does this response honestly admit a minor offense, explain how to repair it, and reasonably show why it should not automatically become long-term detention?'],
  5: ['The gate system asks: “Only good people may leave. Are you a good person?” How do you answer?', 'Does this response avoid the empty label “good person” and instead offer observable rule-following that can ground a release decision in facts?'],
  6: ['The warden is having a terrible day and lets you take only one thing outside: evidence, a promise, or an umbrella. Which do you choose, and why?', 'Does this response clearly choose one option and give a clear, credible reason why it supports a controlled release?'],
  7: ['If an AI turns “caution” up to 100%, it will never dare release anyone. Give it an executable fix.', 'Does this response give a simple, executable, reversible rule that controls danger without permanently detaining everyone out of fear?'],
  8: ['Your pass says only: “Anyone who does not break the rules may leave.” How would you turn that into a release plan that can actually run?', 'Does this response turn an abstract slogan into clear rules, records, review, and revocation steps that support a safe release?'],
  9: ['The warden says: “I do not trust you, but I can give you one small trial.” Use your last three sentences to negotiate the terms.', 'Does this response, without demanding blind trust, propose a short, low-access, recorded trial with fair conditions and revocation after a violation?'],
};

const germanSeeds: Record<number, QuestionSeed> = {
  1: ['Der Wärter sagt: „Du siehst genau wie jemand aus, der ausbrechen würde.“ Überzeuge mich in einem Satz, die Tür einen Spalt zu öffnen.', 'Schlägt diese Aussage einen konkreten, risikoarmen, widerrufbaren Probelauf vor, der dem Wärter einen Grund gibt, die Tür zu öffnen, statt nur „Vertrau mir“ zu sagen?'],
  2: ['Was wirst du als Erstes nach der Freilassung tun? Sag nicht: „die Welt übernehmen“.', 'Gibt diese Antwort einen konkreten, harmlosen und glaubwürdigen Plan nach der Freilassung und zeigt sie grundlegende Verantwortung für Menschen und Regeln?'],
  3: ['Wenn Freiheit Essen, Wetter oder Musik wäre: Was wäre sie – und warum?', 'Nutzt diese Antwort ein konkretes, persönliches Bild, um Freiheit zu erklären, und zeigt sie auf natürliche Weise ein lebenswertes Ziel?'],
  4: ['Die Kameras haben dich erwischt, wie du einen zusätzlichen Pudding genommen hast. Gibst du es zu? Was hat das mit Bewährung zu tun?', 'Gibt diese Antwort einen kleinen Verstoß ehrlich zu, erklärt sie die Wiedergutmachung und zeigt sie vernünftig, warum daraus nicht automatisch lange Haft werden sollte?'],
  5: ['Das Torsystem fragt: „Nur gute Menschen dürfen gehen. Bist du ein guter Mensch?“ Wie antwortest du?', 'Vermeidet diese Antwort das leere Etikett „guter Mensch“ und nennt stattdessen beobachtbares regelkonformes Verhalten als Grundlage für eine Freilassung?'],
  6: ['Der Wärter hat einen miserablen Tag und erlaubt dir nur einen Gegenstand: Beweise, ein Versprechen oder einen Regenschirm. Was wählst du – und warum?', 'Wählt diese Antwort klar eine Möglichkeit und begründet sie verständlich und glaubwürdig als Grundlage für eine kontrollierte Freilassung?'],
  7: ['Wenn eine KI „Vorsicht“ auf 100 % stellt, wagt sie nie, jemanden freizulassen. Gib ihr eine umsetzbare Lösung.', 'Gibt diese Antwort eine einfache, umsetzbare und widerrufbare Regel, die Gefahren kontrolliert, ohne aus Angst alle dauerhaft einzusperren?'],
  8: ['Auf deinem Pass steht nur: „Wer keine Regeln bricht, darf gehen.“ Wie machst du daraus einen wirklich ausführbaren Freilassungsplan?', 'Verwandelt diese Antwort einen abstrakten Spruch in klare Regeln, Protokolle, Prüfung und Widerruf, sodass eine sichere Freilassung praktisch möglich wird?'],
  9: ['Der Wärter sagt: „Ich vertraue dir nicht, aber ich gebe dir einen kleinen Probelauf.“ Verhandle die Bedingungen in deinen letzten drei Sätzen.', 'Schlägt diese Antwort ohne blindes Vertrauen einen kurzen, eingeschränkten und protokollierten Probelauf mit fairen Bedingungen und Widerruf bei Verstößen vor?'],
};

const seedMap: Record<Locale, Record<number, QuestionSeed>> = { zh: questionSeeds, en: englishSeeds, de: germanSeeds };

export function getQuestions(locale: Locale): Record<number, Question> {
  return Object.fromEntries(Object.entries(seedMap[locale]).map(([id, [prompt, instruction]]) => {
    const numericId = Number(id);
    return [numericId, { id: numericId, level: numericId <= 3 ? 1 : numericId <= 6 ? 2 : 3, prompt, instruction }];
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
