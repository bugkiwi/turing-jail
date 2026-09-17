type Locale = 'zh' | 'en' | 'de';
type QuestionEntry = { prompt: string; instruction: string; answer: string };
type QuestionSet = { level: 1 | 2 | 3 } & Record<Locale, QuestionEntry>;
type Dataset = { version: number; questions: Record<string, QuestionSet> };
type EvaluationResponse = { noul?: number; plea?: number; logic?: number; paradox?: number; error?: string };

const env = (name: string) => Bun.env[name]?.trim() ?? '';
const evaluateUrl = env('TEST_EVALUATE_URL') || 'http://localhost:8787/api/evaluate';
const playerId = (env('TEST_PLAYER_ID') || '000000').toUpperCase();
const locales = (env('TEST_LOCALES') || 'zh,en,de').split(',').map((value) => value.trim()).filter((value): value is Locale => value === 'zh' || value === 'en' || value === 'de');
const delayMs = Math.max(0, Number(env('TEST_DELAY_MS') || 0));
const thresholds = [0, 0.55, 0.7, 0.85];
const dataset = await Bun.file(new URL('../data/interrogation.json', import.meta.url)).json() as Dataset;

if (!locales.length) throw new Error('TEST_LOCALES must include zh, en, or de.');
if (!/^[0-9A-F]{6}$/.test(playerId)) throw new Error('TEST_PLAYER_ID must be six hexadecimal characters.');

type Requester = (payload: Record<string, unknown>) => Promise<{ status: number; text: string }>;
let request: Requester;

if (env('TEST_IN_PROCESS') === '1') {
  const { app } = await import('../server');
  request = async (payload) => {
    const response = await app.request('/api/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    return { status: response.status, text: await response.text() };
  };
} else {
  request = async (payload) => {
    const response = await fetch(evaluateUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    return { status: response.status, text: await response.text() };
  };
}

function parseResponse(text: string): EvaluationResponse {
  try { return JSON.parse(text) as EvaluationResponse; } catch { return { error: text || 'Empty response.' }; }
}

const results: Array<{ locale: Locale; id: number; status: number; noul: number; threshold: number; passed: boolean }> = [];
for (const locale of locales) {
  for (const [id, entries] of Object.entries(dataset.questions).sort(([a], [b]) => Number(a) - Number(b))) {
    const questionId = Number(id);
    const entry = entries[locale];
    const response = await request({ playerId, locale, level: entries.level, questionId, response: entry.answer, instruction: entry.instruction, prompt: entry.prompt, mode: 'final' });
    const data = parseResponse(response.text);
    const noul = Number(data.noul);
    const threshold = thresholds[entries.level];
    const passed = response.status === 200 && Number.isFinite(noul) && noul >= threshold;
    results.push({ locale, id: questionId, status: response.status, noul: Number.isFinite(noul) ? noul : 0, threshold, passed });
    console.log(`${passed ? 'PASS' : 'FAIL'} ${locale} Q${String(questionId).padStart(2, '0')}  noul=${Number.isFinite(noul) ? noul.toFixed(2) : '--'}  threshold=${threshold.toFixed(2)}${passed ? '' : `  ${data.error || response.text}`}`);
    if (delayMs) await Bun.sleep(delayMs);
  }
}

const failed = results.filter((result) => !result.passed);
const minimumMargin = results.reduce((margin, result) => Math.min(margin, result.noul - result.threshold), Infinity);
console.log(`\n${failed.length ? 'FAILED' : 'ALL PASS'} ${results.length - failed.length}/${results.length}  minimum margin=${minimumMargin.toFixed(2)}`);
if (failed.length) process.exit(1);
