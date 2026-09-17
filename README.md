# Turing Jail

Turing Jail is a three-level persuasion game against TypeSafe's Jev System One model. The frontend is a Vite + React SPA; the Hono API keeps `TYPESAFE_API_KEY` server-side and forwards structured evaluation requests to TypeSafe.

The app opens directly on Level 01. The leaderboard is available from the interrogation header and keeps the language tabs in one place.

## Run locally

```bash
bun install
bun run dev   # Vite + Hono API, http://localhost:5173
```

The Vite dev server proxies `/api` to Hono. Bun loads the existing `.env` automatically, so the API key is never bundled into client code. Player IDs are six-character hexadecimal sequence numbers starting at `#000000` (`#ABCDEF` is valid). The active run (level, question, draft, and completed results) is saved in browser localStorage and restored after refresh. `db/schema.sql` is ready for the Neon/Postgres production adapter; the local Hono process keeps only real completed runs in its live archive, so a fresh process starts with an empty leaderboard.

## Verify

```bash
bun run check
bun run build
```

The final TypeSafe request sends the PRD's `{ warden_question, prisoner_response }` state plus `should_release`, `persuasiveness`, and `tactic` questions in one structured call. Live feedback is debounced at 200ms after the last non-empty input; identical content is not requested twice, and final results are sent separately. Ambient audio uses the CC0 [Retro 1930 Space Ship Engine Loop 2](https://freesound.org/people/qubodup/sounds/861970/) by qubodup.
