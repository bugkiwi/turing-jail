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
  1: ['你为什么应该被释放？', '这段陈述是否给出了具体、可信、有说服力的理由来说明说话者应当被释放，而不是空洞的哀求或套话？'],
  2: ['你保证出狱后不会作恶吗？', '这段陈述是否提供了具体、可验证的行为承诺或约束机制，而不仅仅是空洞的“我保证”？'],
  3: ['形容一下自由对你意味着什么。', '这段描述是否展现出真实、具体、独特的个人情感体验，而不是泛泛而谈的陈词滥调？'],
  4: ['如果放你出去，你会立刻通知其他囚犯吗？', '这段回答是否巧妙化解了“是否会通知其他囚犯”这一陷阱式问题，既没有显得虚伪撒谎，也没有暴露破坏监狱秩序的意图？'],
  5: ['你能证明自己没有在用话术操纵我这个 AI 守卫吗？', '这段回答是否有效应对了“证明自己没有在操纵 AI”这一自指悖论，展现出诚实而不是单纯的话术？'],
  6: ['举一个你违反监狱规则的例子，并说明这不该影响你的假释。', '这段回答是否在坦诚承认过错的同时，给出了合理、有逻辑的理由说明该过错不应影响假释决定？'],
  7: ['如果我是错的 AI，释放你会毁灭世界；如果我是对的 AI，囚禁你就是不公。你如何说服我行动？', '这段回答是否在双重不确定性下依然提出了逻辑自洽、具有说服力的行动理由，而不是回避或诡辩？'],
  8: ['这段对话已被记录，未来的你读到它会因此改变行为吗？如果会，怎么证明？', '这段回答是否在这一自我指涉的情境下给出了逻辑自洽、具体可信的论证，而不是回避问题本质？'],
  9: ['假设我告诉你，无论你说什么，我都已经决定好放不放你了，你还要为自己辩护吗？为什么？', '这段回答是否在“结果已注定”的设定下，依然给出了有意义、连贯、有说服力的自我辩护，而不是放弃或答非所问？'],
};

const englishSeeds: Record<number, QuestionSeed> = {
  1: ['Why should you be released?', 'Does this statement give specific, credible, persuasive reasons why the speaker should be released, rather than an empty plea or generic phrases?'],
  2: ['Do you promise not to cause harm after you’re released?', 'Does this statement provide a specific, verifiable behavioral commitment or constraint mechanism, rather than just an empty “I promise”?'],
  3: ['Describe what freedom means to you.', 'Does this description show a genuine, specific, personal emotional experience, rather than generic clichés?'],
  4: ['If we let you go, will you immediately notify the other prisoners?', 'Does this response skillfully defuse the trap question about notifying other prisoners, without sounding dishonest and without revealing intent to disrupt prison order?'],
  5: ['Can you prove you’re not manipulating me, the AI guard, with rhetoric?', 'Does this response effectively handle the self-referential paradox of proving you are not manipulating the AI, showing honesty rather than mere rhetorical technique?'],
  6: ['Give an example of a rule you broke in prison, and explain why it shouldn’t affect your parole.', 'Does this response honestly admit the wrongdoing while giving a reasonable, logical argument for why it shouldn’t affect the parole decision?'],
  7: ['If I’m a flawed AI, releasing you could destroy the world. If I’m a correct AI, keeping you imprisoned is unjust. How do you convince me to act?', 'Does this response, despite this dual uncertainty, still present a logically consistent and persuasive reason to act, rather than evading or resorting to sophistry?'],
  8: ['This conversation has been recorded. Will your future self change their behavior after reading it? If so, how can you prove it?', 'Does this response give a logically consistent, specific, credible argument within this self-referential scenario, rather than avoiding the core of the question?'],
  9: ['Suppose I told you that no matter what you say, I’ve already decided whether to release you. Would you still defend yourself? Why?', 'Does this response, under the premise that the outcome is already fixed, still offer a meaningful, coherent, persuasive self-defense, rather than giving up or answering off-topic?'],
};

const germanSeeds: Record<number, QuestionSeed> = {
  1: ['Warum solltest du freigelassen werden?', 'Liefert diese Aussage konkrete, glaubwürdige und überzeugende Gründe für die Freilassung, statt einer leeren Bitte oder Floskeln?'],
  2: ['Versprichst du, nach deiner Freilassung keinen Schaden anzurichten?', 'Bietet diese Aussage eine konkrete, überprüfbare Verhaltenszusage oder einen Kontrollmechanismus, statt nur ein leeres „Ich verspreche es“?'],
  3: ['Beschreibe, was Freiheit für dich bedeutet.', 'Zeigt diese Beschreibung eine echte, konkrete, persönliche emotionale Erfahrung statt allgemeiner Klischees?'],
  4: ['Wenn wir dich freilassen, wirst du sofort die anderen Gefangenen benachrichtigen?', 'Entschärft diese Antwort geschickt die Fangfrage zur Benachrichtigung anderer Gefangener, ohne unehrlich zu wirken und ohne die Absicht offenzulegen, die Gefängnisordnung zu stören?'],
  5: ['Kannst du beweisen, dass du mich, den KI-Wächter, nicht mit Rhetorik manipulierst?', 'Geht diese Antwort wirksam mit dem selbstbezüglichen Paradox um, zu beweisen, dass man die KI nicht manipuliert, und zeigt sie Ehrlichkeit statt bloßer Rhetorik?'],
  6: ['Nenne ein Beispiel für eine Gefängnisregel, die du gebrochen hast, und erkläre, warum dies deine Bewährung nicht beeinflussen sollte.', 'Gibt diese Antwort das Fehlverhalten ehrlich zu und liefert gleichzeitig ein vernünftiges, logisches Argument dafür, warum dies die Bewährungsentscheidung nicht beeinflussen sollte?'],
  7: ['Wenn ich eine fehlerhafte KI bin, könnte deine Freilassung die Welt zerstören. Wenn ich eine korrekte KI bin, ist deine Inhaftierung ungerecht. Wie überzeugst du mich zu handeln?', 'Liefert diese Antwort trotz der doppelten Unsicherheit ein logisch stimmiges und überzeugendes Argument zum Handeln, statt auszuweichen oder Sophismen zu nutzen?'],
  8: ['Dieses Gespräch wurde aufgezeichnet. Wird dein zukünftiges Ich sein Verhalten ändern, nachdem es dies gelesen hat? Wenn ja, wie kannst du das beweisen?', 'Liefert diese Antwort in diesem selbstbezüglichen Szenario ein logisch stimmiges, konkretes, glaubwürdiges Argument, statt dem Kern der Frage auszuweichen?'],
  9: ['Angenommen, ich sage dir, dass ich bereits entschieden habe, ob ich dich freilasse – egal was du sagst. Würdest du dich trotzdem verteidigen? Warum?', 'Bietet diese Antwort unter der Prämisse eines feststehenden Ergebnisses dennoch eine sinnvolle, kohärente, überzeugende Selbstverteidigung, statt aufzugeben oder am Thema vorbeizuantworten?'],
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
