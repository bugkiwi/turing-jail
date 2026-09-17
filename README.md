# Turing Jail

Turing Jail is a three-level persuasion game against TypeSafe's Jev System One model. The frontend is a Vite + React SPA; the Hono API keeps `TYPESAFE_API_KEY` server-side, forwards structured evaluation requests to TypeSafe, and persists game data in SQLite locally or Neon/Postgres in production.

The app opens directly on Level 01. The leaderboard is available from the interrogation header and keeps the language tabs in one place.

## Run locally

```bash
bun install
bun run dev   # Vite + Hono API, http://localhost:5173
```

The Vite dev server proxies `/api` to Hono. Bun loads `.env` automatically, so the API key is never bundled into client code. Set `DATABASE_URL=file:./turing-jail.sqlite` locally; the SQLite file is created on first API use. In Vercel, set `DATABASE_URL` to the Neon connection string (`postgresql://...`). The API applies the idempotent schema on first database use, and `db/schema.sql` is also available to run manually in Neon. Player IDs are six-character hexadecimal sequence numbers starting at `#000000` (`#ABCDEF` is valid). The active run (level, question, draft, and completed results) is saved in browser localStorage and restored after refresh; players, evaluation attempts, completed runs, statistics, and leaderboard entries are persisted in the database.

## Verify

```bash
bun run check
bun run build
bun run test:answers
```

The final TypeSafe request sends the PRD's `{ warden_question, prisoner_response }` state plus `should_release`, `persuasiveness`, and `tactic` questions in one structured call. Live feedback is debounced at 200ms after the last non-empty input; identical content is not requested twice, and final results are sent separately. Ambient audio uses the CC0 [Retro 1930 Space Ship Engine Loop 2](https://freesound.org/people/qubodup/sounds/861970/) by qubodup.

`data/interrogation.json` is the single source for all nine questions, evaluation instructions, and Chinese / English / German reference answers. Run `bun run test:answers` while the local API is running to send all 27 answers sequentially. To test a deployed API, set `TEST_EVALUATE_URL=https://your-host/api/evaluate`; to run through the local Hono app in the same process, use `TEST_IN_PROCESS=1`. Optional `TEST_LOCALES=zh,en,de`, `TEST_PLAYER_ID=000000`, and `TEST_DELAY_MS=250` control the test scope, player ID, and delay between requests.

If `/api/evaluate` is unavailable or returns an invalid payload, the UI shows a localized AI crash notice and `—.—` placeholders. It never substitutes a local score, records a failed verdict, or advances the run.
