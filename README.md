# Turing Jail

Turing Jail is a three-level persuasion game against TypeSafe's Jev System One model. The frontend is a Vite + React SPA; the Hono API keeps `TYPESAFE_API_KEY` server-side and forwards structured evaluation requests to TypeSafe.

The app opens directly on Level 01. The leaderboard is available from the interrogation header and keeps the language tabs in one place.

## Run locally

```bash
bun install
bun run api   # terminal 1, http://localhost:8787
bun run dev   # terminal 2, http://localhost:5173
```

The Vite dev server proxies `/api` to Hono. Bun loads the existing `.env` automatically, so the API key is never bundled into client code. Player IDs are six-character hexadecimal sequence numbers starting at `#000000` (`#ABCDEF` is valid). `db/schema.sql` is ready for the Neon/Postgres production adapter; the local Hono process currently uses an in-memory archive seeded with demo rows so the UI works immediately.

## Verify

```bash
bun run check
bun run build
```

The final TypeSafe request sends the PRD's `{ warden_question, prisoner_response }` state plus `should_release`, `persuasiveness`, and `tactic` questions in one structured call. Live feedback is debounced at 1.2 seconds and final results are sent separately.
