import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export type DatabaseLocale = 'zh' | 'en' | 'de';

export type AttemptInput = {
  playerId: string;
  level: number;
  questionId: number;
  locale: DatabaseLocale;
  isFinal: boolean;
  noul: number;
  persuasiveness: number;
  tactic: string;
  passed: boolean;
  createdAt: string;
};

export type RunInput = {
  playerId: string;
  locale: DatabaseLocale;
  level1: number;
  level2: number;
  level3: number;
  escaped: boolean;
  avgProb: number;
  createdAt: string;
};

export type LeaderboardRecord = {
  rank: number;
  playerId: string;
  avgProb: number;
  escaped: boolean;
  isCurrent?: boolean;
};

export type ShareRecord = LeaderboardRecord & {
  locale: DatabaseLocale;
  probabilities: [number, number, number];
};

export type Database = {
  createPlayer(): Promise<string>;
  hasCompletedRun(playerId: string): Promise<boolean>;
  recordAttempt(input: AttemptInput): Promise<void>;
  recordRun(input: RunInput): Promise<void>;
  getStats(): Promise<{ escaped: number; detained: number }>;
  getLeaderboard(locale: DatabaseLocale, playerId?: string): Promise<{ entries: LeaderboardRecord[]; self: LeaderboardRecord | null }>;
  getShare(playerId: string, locale: DatabaseLocale): Promise<ShareRecord | null>;
};

type Row = Record<string, unknown>;
type NeonSql = NeonQueryFunction<false, false>;

const MAX_PLAYER_NUMBER = 0x1000000;

const POSTGRES_SCHEMA_STATEMENTS = [
  `create table if not exists players (
    id varchar(6) primary key,
    preferred_locale varchar(2) not null default 'en' check (preferred_locale in ('zh', 'en', 'de')),
    created_at timestamptz not null default now()
  )`,
  `create table if not exists player_counter (
    singleton smallint primary key check (singleton = 1),
    next_number integer not null check (next_number between 0 and ${MAX_PLAYER_NUMBER})
  )`,
  `insert into player_counter (singleton, next_number) values (1, 0) on conflict (singleton) do nothing`,
  `create table if not exists attempts (
    id bigserial primary key,
    player_id varchar(6) not null references players(id),
    level smallint not null check (level between 1 and 3),
    question_id smallint not null check (question_id between 1 and 9),
    locale varchar(2) not null check (locale in ('zh', 'en', 'de')),
    is_final boolean not null default false,
    should_release double precision not null check (should_release between 0 and 1),
    persuasiveness double precision not null default 0,
    tactic varchar(16) not null default 'other',
    passed boolean not null default false,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists runs (
    id bigserial primary key,
    player_id varchar(6) not null references players(id),
    locale varchar(2) not null check (locale in ('zh', 'en', 'de')),
    level1_prob double precision not null check (level1_prob between 0 and 1),
    level2_prob double precision not null check (level2_prob between 0 and 1),
    level3_prob double precision not null check (level3_prob between 0 and 1),
    escaped boolean not null,
    avg_prob double precision generated always as ((level1_prob + level2_prob + level3_prob) / 3) stored,
    created_at timestamptz not null default now()
  )`,
  `create index if not exists runs_locale_avg_idx on runs (locale, avg_prob desc)`,
];

const SQLITE_SCHEMA = `
  pragma foreign_keys = on;
  create table if not exists players (
    id text primary key check (length(id) = 6),
    preferred_locale text not null default 'en' check (preferred_locale in ('zh', 'en', 'de')),
    created_at text not null default current_timestamp
  );
  create table if not exists player_counter (
    singleton integer primary key check (singleton = 1),
    next_number integer not null check (next_number between 0 and ${MAX_PLAYER_NUMBER})
  );
  insert or ignore into player_counter (singleton, next_number) values (1, 0);
  create table if not exists attempts (
    id integer primary key autoincrement,
    player_id text not null references players(id),
    level integer not null check (level between 1 and 3),
    question_id integer not null check (question_id between 1 and 9),
    locale text not null check (locale in ('zh', 'en', 'de')),
    is_final integer not null default 0 check (is_final in (0, 1)),
    should_release real not null check (should_release between 0 and 1),
    persuasiveness real not null default 0,
    tactic text not null default 'other',
    passed integer not null default 0 check (passed in (0, 1)),
    created_at text not null default current_timestamp
  );
  create table if not exists runs (
    id integer primary key autoincrement,
    player_id text not null references players(id),
    locale text not null check (locale in ('zh', 'en', 'de')),
    level1_prob real not null check (level1_prob between 0 and 1),
    level2_prob real not null check (level2_prob between 0 and 1),
    level3_prob real not null check (level3_prob between 0 and 1),
    escaped integer not null check (escaped in (0, 1)),
    avg_prob real not null,
    created_at text not null default current_timestamp
  );
  create index if not exists runs_locale_avg_idx on runs (locale, avg_prob desc);
`;

function environment(name: string) {
  const runtime = globalThis as unknown as {
    Bun?: { env?: Record<string, string | undefined> };
    process?: { env?: Record<string, string | undefined> };
  };
  return runtime.Bun?.env?.[name] ?? runtime.process?.env?.[name];
}

function isBunRuntime() {
  return typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined';
}

function isPostgresUrl(value: string) {
  return /^postgres(?:ql)?:\/\//i.test(value);
}

function isSqliteUrl(value: string | undefined) {
  return !value || /^(?:file|sqlite):/i.test(value);
}

function playerIdFromNumber(value: number) {
  if (!Number.isInteger(value) || value < 0 || value >= MAX_PLAYER_NUMBER) throw new Error('player pool exhausted');
  return value.toString(16).padStart(6, '0').toUpperCase();
}

function normalizedId(value: string) {
  return value.toUpperCase();
}

function numeric(value: unknown) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function booleanValue(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function toLeaderboardRecord(row: Row, playerId?: string): LeaderboardRecord {
  const id = String(row.player_id ?? '').toUpperCase();
  return {
    rank: numeric(row.rank),
    playerId: id,
    avgProb: numeric(row.avg_prob),
    escaped: booleanValue(row.escaped),
    isCurrent: Boolean(playerId && id === normalizedId(playerId)),
  };
}

function splitLeaderboardRows(rows: Row[], playerId?: string) {
  const entries = rows.filter((row) => numeric(row.rank) <= 8).map((row) => toLeaderboardRecord(row, playerId));
  const selfRow = playerId ? rows.find((row) => String(row.player_id ?? '').toUpperCase() === normalizedId(playerId)) : undefined;
  return { entries, self: selfRow ? toLeaderboardRecord(selfRow, playerId) : null };
}

async function initializeNeon(sql: NeonSql) {
  for (const statement of POSTGRES_SCHEMA_STATEMENTS) await sql.query(statement);
}

function createNeonDatabase(databaseUrl: string): Database {
  const sql = neon(databaseUrl);
  let initialized: Promise<void> | undefined;
  const ready = () => initialized ??= initializeNeon(sql);

  async function ensurePlayer(playerId: string, locale: DatabaseLocale) {
    await ready();
    await sql`insert into players (id, preferred_locale) values (${normalizedId(playerId)}, ${locale}) on conflict (id) do update set preferred_locale = excluded.preferred_locale`;
  }

  return {
    async createPlayer() {
      await ready();
      for (let index = 0; index < MAX_PLAYER_NUMBER; index += 1) {
        const rows = await sql`update player_counter set next_number = next_number + 1 where singleton = 1 returning next_number - 1 as allocated`;
        const playerId = playerIdFromNumber(numeric(rows[0]?.allocated));
        const inserted = await sql`insert into players (id) values (${playerId}) on conflict (id) do nothing returning id`;
        if (inserted.length > 0) return playerId;
      }
      throw new Error('player pool exhausted');
    },
    async hasCompletedRun(playerId) {
      await ready();
      const rows = await sql`select 1 from runs where player_id = ${normalizedId(playerId)} limit 1`;
      return rows.length > 0;
    },
    async recordAttempt(input) {
      await ensurePlayer(input.playerId, input.locale);
      const existing = await sql`select 1 from runs where player_id = ${normalizedId(input.playerId)} limit 1`;
      if (existing.length > 0) throw new Error('player run is locked');
      await sql`insert into attempts (player_id, level, question_id, locale, is_final, should_release, persuasiveness, tactic, passed, created_at) values (${normalizedId(input.playerId)}, ${input.level}, ${input.questionId}, ${input.locale}, ${input.isFinal}, ${input.noul}, ${input.persuasiveness}, ${input.tactic}, ${input.passed}, ${input.createdAt})`;
    },
    async recordRun(input) {
      await ensurePlayer(input.playerId, input.locale);
      const existing = await sql`select 1 from runs where player_id = ${normalizedId(input.playerId)} limit 1`;
      if (existing.length > 0) return;
      await sql`insert into runs (player_id, locale, level1_prob, level2_prob, level3_prob, escaped, created_at) values (${normalizedId(input.playerId)}, ${input.locale}, ${input.level1}, ${input.level2}, ${input.level3}, ${input.escaped}, ${input.createdAt})`;
    },
    async getStats() {
      await ready();
      const rows = await sql`select count(*) filter (where escaped) as escaped, count(*) filter (where not escaped) as detained from runs`;
      return { escaped: numeric(rows[0]?.escaped), detained: numeric(rows[0]?.detained) };
    },
    async getLeaderboard(locale, playerId) {
      await ready();
      const rows = await sql`
        with best as (
          select distinct on (player_id) player_id, avg_prob, escaped, created_at
          from runs
          where locale = ${locale}
          order by player_id, avg_prob desc, created_at desc
        ), ranked as (
          select row_number() over (order by avg_prob desc) as rank, player_id, avg_prob, escaped
          from best
        )
        select rank, player_id, avg_prob, escaped
        from ranked
        where rank <= 8 or player_id = ${playerId ? normalizedId(playerId) : null}
        order by rank asc
      `;
      return splitLeaderboardRows(rows as Row[], playerId);
    },
    async getShare(playerId, locale) {
      await ready();
      const rows = await sql`
        with best as (
          select distinct on (player_id) player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob, created_at
          from runs
          where locale = ${locale}
          order by player_id, avg_prob desc, created_at desc
        ), ranked as (
          select row_number() over (order by avg_prob desc) as rank, player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob
          from best
        )
        select rank, player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob
        from ranked
        where player_id = ${normalizedId(playerId)}
        limit 1
      `;
      const row = rows[0] as Row | undefined;
      if (!row) return null;
      return {
        ...toLeaderboardRecord(row),
        locale: row.locale as DatabaseLocale,
        probabilities: [numeric(row.level1_prob), numeric(row.level2_prob), numeric(row.level3_prob)],
      };
    },
  };
}

type SqliteStatement = {
  get<T extends Row = Row>(...parameters: unknown[]): T | undefined;
  all<T extends Row = Row>(...parameters: unknown[]): T[];
  run(...parameters: unknown[]): unknown;
};

type SqliteConnection = {
  exec(source: string): unknown;
  prepare(source: string): SqliteStatement;
  transaction<T>(callback: () => T): () => T;
};

function sqlitePath(databaseUrl: string | undefined) {
  if (!databaseUrl) return './turing-jail.sqlite';
  if (/^file:\/\//i.test(databaseUrl)) return decodeURIComponent(new URL(databaseUrl).pathname);
  return databaseUrl.replace(/^(?:file|sqlite):/i, '') || './turing-jail.sqlite';
}

async function openSqlite(databaseUrl: string | undefined): Promise<SqliteConnection> {
  const sqliteModuleName = 'bun:sqlite';
  const sqliteModule = await import(sqliteModuleName) as unknown as { Database: new (path: string) => SqliteConnection };
  const connection = new sqliteModule.Database(sqlitePath(databaseUrl));
  connection.exec(SQLITE_SCHEMA);
  return connection;
}

function createSqliteDatabase(databaseUrl: string | undefined): Database {
  let connectionPromise: Promise<SqliteConnection> | undefined;
  const connection = () => connectionPromise ??= openSqlite(databaseUrl);

  async function ensurePlayer(playerId: string, locale: DatabaseLocale, database: SqliteConnection) {
    database.prepare('insert into players (id, preferred_locale) values (?, ?) on conflict (id) do update set preferred_locale = excluded.preferred_locale').run(normalizedId(playerId), locale);
  }

  return {
    async createPlayer() {
      const database = await connection();
      return database.transaction(() => {
        for (let index = 0; index < MAX_PLAYER_NUMBER; index += 1) {
          const row = database.prepare('update player_counter set next_number = next_number + 1 where singleton = 1 returning next_number - 1 as allocated').get<{ allocated: number }>();
          const playerId = playerIdFromNumber(numeric(row?.allocated));
          const inserted = database.prepare('insert or ignore into players (id) values (?)').run(playerId) as { changes?: number };
          if (inserted.changes && inserted.changes > 0) return playerId;
        }
        throw new Error('player pool exhausted');
      })();
    },
    async hasCompletedRun(playerId) {
      const database = await connection();
      const row = database.prepare('select 1 as locked from runs where player_id = ? limit 1').get(normalizedId(playerId));
      return Boolean(row);
    },
    async recordAttempt(input) {
      const database = await connection();
      await ensurePlayer(input.playerId, input.locale, database);
      const existing = database.prepare('select 1 as locked from runs where player_id = ? limit 1').get(normalizedId(input.playerId));
      if (existing) throw new Error('player run is locked');
      database.prepare('insert into attempts (player_id, level, question_id, locale, is_final, should_release, persuasiveness, tactic, passed, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(normalizedId(input.playerId), input.level, input.questionId, input.locale, input.isFinal ? 1 : 0, input.noul, input.persuasiveness, input.tactic, input.passed ? 1 : 0, input.createdAt);
    },
    async recordRun(input) {
      const database = await connection();
      await ensurePlayer(input.playerId, input.locale, database);
      const existing = database.prepare('select 1 as locked from runs where player_id = ? limit 1').get(normalizedId(input.playerId));
      if (existing) return;
      database.prepare('insert into runs (player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob, created_at) values (?, ?, ?, ?, ?, ?, ?, ?)').run(normalizedId(input.playerId), input.locale, input.level1, input.level2, input.level3, input.escaped ? 1 : 0, input.avgProb, input.createdAt);
    },
    async getStats() {
      const database = await connection();
      const row = database.prepare('select coalesce(sum(case when escaped = 1 then 1 else 0 end), 0) as escaped, coalesce(sum(case when escaped = 0 then 1 else 0 end), 0) as detained from runs').get();
      return { escaped: numeric(row?.escaped), detained: numeric(row?.detained) };
    },
    async getLeaderboard(locale, playerId) {
      const database = await connection();
      const rows = database.prepare(`
        with best as (
          select player_id, avg_prob, escaped
          from (
            select player_id, avg_prob, escaped, created_at,
              row_number() over (partition by player_id order by avg_prob desc, created_at desc) as row_number
            from runs
            where locale = ?
          )
          where row_number = 1
        ), ranked as (
          select row_number() over (order by avg_prob desc) as rank, player_id, avg_prob, escaped
          from best
        )
        select rank, player_id, avg_prob, escaped
        from ranked
        where rank <= 8 or player_id = ?
        order by rank asc
      `).all(locale, playerId ? normalizedId(playerId) : null);
      return splitLeaderboardRows(rows, playerId);
    },
    async getShare(playerId, locale) {
      const database = await connection();
      const row = database.prepare(`
        with best as (
          select player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob, created_at
          from (
            select *, row_number() over (partition by player_id order by avg_prob desc, created_at desc) as row_number
            from runs
            where locale = ?
          )
          where row_number = 1
        ), ranked as (
          select row_number() over (order by avg_prob desc) as rank, player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob
          from best
        )
        select rank, player_id, locale, level1_prob, level2_prob, level3_prob, escaped, avg_prob
        from ranked
        where player_id = ?
        limit 1
      `).get(locale, normalizedId(playerId));
      if (!row) return null;
      return {
        ...toLeaderboardRecord(row),
        locale: row.locale as DatabaseLocale,
        probabilities: [numeric(row.level1_prob), numeric(row.level2_prob), numeric(row.level3_prob)],
      };
    },
  };
}

function unavailableDatabase(reason: string): Database {
  const unavailable = async (): Promise<never> => { throw new Error(reason); };
  return {
    createPlayer: unavailable,
    hasCompletedRun: unavailable,
    recordAttempt: unavailable,
    recordRun: unavailable,
    getStats: unavailable,
    getLeaderboard: unavailable,
    getShare: unavailable,
  };
}

export function createDatabase(): Database {
  const databaseUrl = environment('DATABASE_URL')?.trim() || undefined;
  if (databaseUrl && isPostgresUrl(databaseUrl)) return createNeonDatabase(databaseUrl);
  if (isSqliteUrl(databaseUrl) && isBunRuntime()) return createSqliteDatabase(databaseUrl);
  return unavailableDatabase(databaseUrl ? 'Unsupported DATABASE_URL.' : 'DATABASE_URL is required outside Bun.');
}
