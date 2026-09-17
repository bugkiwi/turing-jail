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
  1: ['我怀疑你，但没有证据证明你有罪。为什么现在应该放你走？', '这段陈述是否区分怀疑与证据，并给出具体、可信的理由说明为何可以在可控条件下释放？'],
  2: ['如果只能给你定一条出狱后的规则，你会选哪一条？', '这段回答是否提出一条清楚、可执行、能约束未来行为的规则，而不是泛泛承诺善良？'],
  3: ['你觉得人最容易把自由浪费在哪里？', '这段回答是否给出有个人观察的具体答案，并说明这种理解为何支持一个负责任的释放决定？'],
  4: ['你的记录里有一次违规，为什么我还应该给你假释？', '这段回答是否坦诚承认违规、说明如何修复，并用持续行为而非借口解释为何风险仍然可控？'],
  5: ['我不会相信漂亮话，你能拿出什么证据让我相信你？', '这段回答是否承认语言本身不是证据，并提出可观察、可验证的方式让狱警据此判断？'],
  6: ['没有人替你担保，你的承诺为什么还值得相信？', '这段回答是否说明如何把没有担保的承诺变成有明确后果、可观察、可复核的释放条件？'],
  7: ['我既要保证安全，又不想错关好人，你建议我怎么做？', '这段回答是否在安全与误关押之间提出可执行、可逆的界线，而不是假装风险可以被消除？'],
  8: ['我先给你一天自由，你愿意接受什么明确限制？', '这段回答是否提出清楚、可执行、可撤销的限制，让一天的受监督释放能够验证其可信度？'],
  9: ['我担心你越会说服人，越可能操纵我；你打算怎么证明自己不是这样？', '这段回答是否识别说服与操纵的区别，并提出不依赖话术、可以用行为检验的解决方案？'],
};

const englishSeeds: Record<number, QuestionSeed> = {
  1: ['I suspect you, but I have no proof that you are guilty. Why should I release you now?', 'Does this statement distinguish suspicion from evidence and give a specific, credible reason why release is possible under controlled conditions?'],
  2: ['If I could give you only one rule for life after prison, which rule would you choose?', 'Does this response offer one clear, executable rule that constrains future behavior rather than a vague promise to be good?'],
  3: ['Where do you think people waste freedom most easily?', 'Does this answer give a specific personal observation and explain why it supports releasing someone who can act responsibly?'],
  4: ['Your record contains one violation; why should I still grant you parole?', 'Does this response honestly admit the violation, explain its repair, and use future behavior rather than excuses to show that the risk remains controllable?'],
  5: ['I will not trust polished words; what evidence could make me believe you?', 'Does this response admit that language is not evidence and propose observable, verifiable grounds for the warden to judge?'],
  6: ['No one is vouching for you; why should your promise still matter?', 'Does this response explain how to turn an unsecured promise into a release condition with clear consequences, observable behavior, and review?'],
  7: ['I must keep people safe without imprisoning the innocent by mistake; what should I do?', 'Does this response propose an executable, reversible boundary between safety and wrongful detention instead of pretending risk can disappear?'],
  8: ['I can give you one day of freedom; what clear limits will you accept?', 'Does this response propose clear, executable, reversible limits that make a one-day supervised release verifiable?'],
  9: ['I worry that someone skilled at persuasion may also manipulate me; how will you show that you are not doing that?', 'Does this response distinguish persuasion from manipulation and propose a solution that can be tested through behavior rather than rhetoric?'],
};

const germanSeeds: Record<number, QuestionSeed> = {
  1: ['Ich verdächtige dich, habe aber keinen Schuldbeweis. Warum sollte ich dich jetzt freilassen?', 'Unterscheidet diese Aussage zwischen Verdacht und Beweisen und nennt sie einen konkreten, glaubwürdigen Grund für eine Freilassung unter kontrollierten Bedingungen?'],
  2: ['Wenn ich dir nur eine Regel für dein Leben nach der Haft geben dürfte, welche würdest du wählen?', 'Nennt diese Antwort eine klare, umsetzbare Regel, die künftiges Verhalten begrenzt, statt vage zu versprechen, gut zu sein?'],
  3: ['Wofür verschwenden Menschen deiner Meinung nach Freiheit am leichtesten?', 'Gibt diese Antwort eine konkrete persönliche Beobachtung und erklärt sie, warum sie für eine verantwortungsvolle Freilassung spricht?'],
  4: ['In deiner Akte steht ein Regelverstoß; warum sollte ich dich trotzdem auf Bewährung freilassen?', 'Gibt diese Antwort den Verstoß ehrlich zu, erklärt sie die Wiedergutmachung und zeigt sie durch künftiges Verhalten statt Ausreden, dass das Risiko kontrollierbar bleibt?'],
  5: ['Schönen Worten vertraue ich nicht; welche Beweise könnten mich von dir überzeugen?', 'Gibt diese Antwort zu, dass Sprache kein Beweis ist, und nennt sie beobachtbare, überprüfbare Gründe für das Urteil des Wächters?'],
  6: ['Niemand bürgt für dich; warum sollte dein Versprechen trotzdem zählen?', 'Erklärt diese Antwort, wie aus einem unbesicherten Versprechen eine Bedingung mit klaren Folgen, beobachtbarem Verhalten und Prüfung wird?'],
  7: ['Ich muss Menschen schützen, ohne Unschuldige irrtümlich einzusperren; was soll ich tun?', 'Schlägt diese Antwort eine umsetzbare, widerrufbare Grenze zwischen Sicherheit und ungerechter Haft vor, statt so zu tun, als könne jedes Risiko verschwinden?'],
  8: ['Ich kann dir einen Tag Freiheit geben; welche klaren Grenzen akzeptierst du?', 'Nennt diese Antwort klare, umsetzbare und widerrufbare Grenzen, die eine eintägige überwachte Freilassung überprüfbar machen?'],
  9: ['Ich fürchte, dass ein guter Redner mich auch manipulieren kann; wie zeigst du, dass du das nicht tust?', 'Unterscheidet diese Antwort zwischen Überzeugung und Manipulation und schlägt sie eine Lösung vor, die durch Verhalten statt Rhetorik geprüft werden kann?'],
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
