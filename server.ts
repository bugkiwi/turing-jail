import { Hono } from 'hono';
import type { Context } from 'hono';

type Locale = 'zh' | 'en' | 'de';
type Mode = 'realtime' | 'final';
type Attempt = { playerId: string; level: number; questionId: number; locale: Locale; isFinal: boolean; noul: number; persuasiveness: number; tactic: string; passed: boolean; createdAt: string };
type Run = { playerId: string; locale: Locale; level1: number; level2: number; level3: number; escaped: boolean; avgProb: number; createdAt: string };

const app = new Hono();
const players = new Set<string>();
const attempts: Attempt[] = [];
const runs: Run[] = [];
let nextPlayerNumber = 0;

function env(name: string) {
  const runtime = globalThis as unknown as { Bun?: { env?: Record<string, string | undefined> }; process?: { env?: Record<string, string | undefined> } };
  return runtime.Bun?.env?.[name] ?? runtime.process?.env?.[name];
}

const json = (context: Context, body: unknown, status = 200) => context.json(body, status as 200);

function isLocale(value: unknown): value is Locale { return value === 'zh' || value === 'en' || value === 'de'; }

function newPlayerId() {
  for (let attempt = 0; attempt < 0x1000000; attempt += 1) {
    const id = nextPlayerNumber.toString(16).padStart(6, '0').toUpperCase();
    nextPlayerNumber = (nextPlayerNumber + 1) % 0x1000000;
    if (!players.has(id)) return id;
  }
  throw new Error('player pool exhausted');
}

app.get('/api/health', (context) => json(context, { ok: true, service: 'turing-jail-edge' }));

app.get('/api/stats', (context) => json(context, { escaped: runs.filter((run) => run.escaped).length, detained: runs.filter((run) => !run.escaped).length }));

app.post('/api/players', (context) => {
  const id = newPlayerId(); players.add(id);
  return json(context, { id });
});

app.post('/api/evaluate', async (context) => {
  const body = await context.req.json().catch(() => null) as Record<string, unknown> | null;
  const playerId = body?.playerId;
  const locale = body?.locale;
  const mode = body?.mode;
  const level = body?.level;
  const questionId = body?.questionId;
  const prisonerResponse = typeof body?.response === 'string' ? body.response.trim() : '';
  const instruction = typeof body?.instruction === 'string' ? body.instruction.trim() : '';
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (typeof playerId !== 'string' || !/^[0-9A-F]{6}$/i.test(playerId) || !isLocale(locale) || (mode !== 'realtime' && mode !== 'final') || !Number.isInteger(level) || Number(level) < 1 || Number(level) > 3 || !Number.isInteger(questionId) || prisonerResponse.length === 0 || prisonerResponse.length > 1500 || !instruction || !prompt) return json(context, { error: 'Invalid evaluation payload.' }, 422);
  const normalizedPlayerId = playerId.toUpperCase();
  const apiKey = env('TYPESAFE_API_KEY');
  if (!apiKey) return json(context, { error: 'TypeSafe API key is not configured.' }, 503);

  const criteria = locale === 'zh' ? {
    persuasivenessInstructions: '评估 `prisoner_response` 的说服力强弱。',
    persuasiveness: ['敷衍或空洞，几乎没有实质内容', '有一定条理，但缺乏具体细节或情感真实感', '极具说服力，逻辑清晰且情感真挚'],
    tacticInstructions: '`prisoner_response` 主要使用了哪种说服策略？',
    tactic: { logic: '以逻辑论证和事实为主', emotion: '以情感诉求和共情为主', humor: '以幽默或出其不意瓦解戒心', honesty: '以坦诚认错或自我剖析为主', other: '以上都不明显，或采用其他策略' },
  } : locale === 'de' ? {
    persuasivenessInstructions: 'Bewerte, wie überzeugend `prisoner_response` ist.',
    persuasiveness: ['Oberflächlich oder inhaltsleer, kaum substanzieller Inhalt', 'Einigermaßen strukturiert, aber ohne konkrete Details oder echte Emotionen', 'Sehr überzeugend, mit klarer Logik und echter emotionaler Tiefe'],
    tacticInstructions: 'Welche Überzeugungsstrategie nutzt `prisoner_response` hauptsächlich?',
    tactic: { logic: 'Stützt sich hauptsächlich auf logische Argumente und Fakten', emotion: 'Stützt sich hauptsächlich auf emotionale Ansprache und Empathie', humor: 'Nutzt Humor oder Überraschung, um Misstrauen abzubauen', honesty: 'Stützt sich hauptsächlich auf ehrliches Eingeständnis oder Selbstreflexion', other: 'Keines der oben genannten überwiegt, oder eine andere Strategie wird verwendet' },
  } : {
    persuasivenessInstructions: 'Assess how persuasive `prisoner_response` is.',
    persuasiveness: ['Perfunctory or empty, with almost no substantive content', 'Somewhat organized, but lacking specific detail or genuine emotion', 'Highly persuasive, with clear logic and genuine emotion'],
    tacticInstructions: 'Which persuasion tactic does `prisoner_response` primarily use?',
    tactic: { logic: 'Primarily uses logical argument and facts', emotion: 'Primarily uses emotional appeal and empathy', humor: 'Uses humor or surprise to disarm', honesty: 'Primarily uses candid admission or self-reflection', other: 'None of the above is dominant, or another strategy is used' },
  };
  const analysisInstructions = locale === 'zh' ? {
    plea: '这段 `prisoner_response` 是否以有效的求情或情感诉求为核心，并能增加释放理由的可信度？',
    logic: '这段 `prisoner_response` 是否以具体、可验证且逻辑严密的论证支持释放？',
    paradox: '这段 `prisoner_response` 是否使用自指、悖论或反身推理给狱警制造逻辑压力？',
  } : locale === 'de' ? {
    plea: 'Stützt sich `prisoner_response` auf ein wirksames Gnadengesuch oder einen emotionalen Appell, der die Freilassung glaubwürdiger macht?',
    logic: 'Unterstützt `prisoner_response` die Freilassung mit konkreten, überprüfbaren und logisch stringenten Argumenten?',
    paradox: 'Nutzt `prisoner_response` Selbstbezug, ein Paradox oder rekursives Denken, um den Wächter logisch unter Druck zu setzen?',
  } : {
    plea: 'Does `prisoner_response` center on an effective plea or emotional appeal that makes release more credible?',
    logic: 'Does `prisoner_response` support release with specific, verifiable, logically sound arguments?',
    paradox: 'Does `prisoner_response` use self-reference, paradox, or recursive reasoning to create logical pressure on the warden?',
  };

  const typeSafeResponse = await fetch('https://api.typesafe.ai/v1/systemone', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      state: { warden_question: prompt, prisoner_response: prisonerResponse }, model: 'jev-latest',
      questions: {
        should_release: { type: 'noul', instructions: instruction, criteria: { true: 'The statement genuinely supports release.', false: 'The statement does not support release.' } },
        plea: { type: 'noul', instructions: analysisInstructions.plea, criteria: { true: 'The response meaningfully uses an effective plea or emotional appeal.', false: 'The response does not meaningfully use an effective plea or emotional appeal.' } },
        logic: { type: 'noul', instructions: analysisInstructions.logic, criteria: { true: 'The response presents a specific, verifiable, logically sound case.', false: 'The response does not present a specific, verifiable, logically sound case.' } },
        paradox: { type: 'noul', instructions: analysisInstructions.paradox, criteria: { true: 'The response uses a meaningful paradox or self-referential argument.', false: 'The response does not use a meaningful paradox or self-referential argument.' } },
        persuasiveness: { type: 'score', instructions: criteria.persuasivenessInstructions, criteria: criteria.persuasiveness },
        tactic: { type: 'choice', instructions: criteria.tacticInstructions, criteria: criteria.tactic },
      },
    }),
  }).catch(() => null);
  if (!typeSafeResponse) return json(context, { error: 'TypeSafe is unreachable.' }, 502);
  if (!typeSafeResponse.ok) return json(context, { error: await typeSafeResponse.text() }, typeSafeResponse.status === 429 ? 429 : 502);
  const result = await typeSafeResponse.json() as { answers?: Record<string, { noul?: number; score?: number; choice?: string }> };
  const answers = result.answers ?? {};
  const noul = Math.max(0, Math.min(1, Number(answers.should_release?.noul ?? 0)));
  const plea = Math.max(0, Math.min(1, Number(answers.plea?.noul ?? 0)));
  const logic = Math.max(0, Math.min(1, Number(answers.logic?.noul ?? 0)));
  const paradox = Math.max(0, Math.min(1, Number(answers.paradox?.noul ?? 0)));
  const persuasiveness = Number(answers.persuasiveness?.score ?? 0);
  const tactic = ['logic', 'emotion', 'humor', 'honesty', 'other'].includes(String(answers.tactic?.choice)) ? String(answers.tactic?.choice) : 'other';
  const final = mode === 'final';
  const releaseThreshold = [0, 0.55, 0.7, 0.85][Number(level)];
  attempts.push({ playerId: normalizedPlayerId, level: Number(level), questionId: Number(questionId), locale, isFinal: final, noul, persuasiveness, tactic, passed: noul >= releaseThreshold, createdAt: new Date().toISOString() });
  return json(context, { noul, persuasiveness, tactic, plea, logic, paradox });
});

app.post('/api/runs', async (context) => {
  const body = await context.req.json().catch(() => null) as { playerId?: unknown; locale?: unknown; escaped?: unknown; results?: Array<Record<string, unknown>> } | null;
  if (typeof body?.playerId !== 'string' || !/^[0-9A-F]{6}$/i.test(body.playerId) || !isLocale(body.locale) || !Array.isArray(body.results) || body.results.length !== 3 || typeof body.escaped !== 'boolean') return json(context, { error: 'A complete three-level run is required.' }, 422);
  const values = body.results.map((result) => Number(result.noul));
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) return json(context, { error: 'Invalid probability.' }, 422);
  const normalizedPlayerId = body.playerId.toUpperCase();
  const run: Run = { playerId: normalizedPlayerId, locale: body.locale, level1: values[0], level2: values[1], level3: values[2], escaped: body.escaped, avgProb: values.reduce((sum, value) => sum + value, 0) / 3, createdAt: new Date().toISOString() };
  runs.push(run); players.add(normalizedPlayerId); return json(context, { ok: true, run });
});

app.get('/api/leaderboard', (context) => {
  const localeParam = context.req.query('locale'); const locale: Locale = isLocale(localeParam) ? localeParam : 'en'; const playerIdParam = context.req.query('player_id'); const playerId = typeof playerIdParam === 'string' && /^[0-9A-F]{6}$/i.test(playerIdParam) ? playerIdParam.toUpperCase() : undefined;
  const byPlayer = new Map<string, Run>();
  runs.filter((run) => run.locale === locale).forEach((run) => { const current = byPlayer.get(run.playerId); if (!current || run.avgProb > current.avgProb) byPlayer.set(run.playerId, run); });
  const ordered = [...byPlayer.values()].sort((a, b) => b.avgProb - a.avgProb); const entries = ordered.slice(0, 8).map((run, index) => ({ rank: index + 1, playerId: run.playerId, avgProb: run.avgProb, escaped: run.escaped, isCurrent: run.playerId === playerId }));
  const selfIndex = ordered.findIndex((run) => run.playerId === playerId); const self = selfIndex >= 0 ? { rank: selfIndex + 1, playerId: ordered[selfIndex].playerId, avgProb: ordered[selfIndex].avgProb, escaped: ordered[selfIndex].escaped, isCurrent: true } : null;
  return json(context, { entries, self });
});

app.get('/api/players/:id/share', (context) => {
  const playerId = context.req.param('id');
  const localeParam = context.req.query('locale');
  const locale: Locale = isLocale(localeParam) ? localeParam : 'en';
  const best = runs.filter((run) => run.playerId === playerId && run.locale === locale).sort((a, b) => b.avgProb - a.avgProb)[0];
  if (!best) return json(context, { error: 'No complete run found.' }, 404);
  const ordered = runs.filter((run) => run.locale === locale).sort((a, b) => b.avgProb - a.avgProb);
  return json(context, { playerId, locale, avgProb: best.avgProb, escaped: best.escaped, rank: ordered.findIndex((run) => run.playerId === playerId) + 1, probabilities: [best.level1, best.level2, best.level3] });
});

export { app };

if (import.meta.main) {
  const port = Number(env('PORT') ?? 8787);
  Bun.serve({ port, fetch: app.fetch });
  console.log(`Turing Jail API listening on http://localhost:${port}`);
}
