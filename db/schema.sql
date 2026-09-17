-- Neon/Postgres migration for the production adapter.
create table if not exists players (
  id varchar(6) primary key,
  preferred_locale varchar(2) not null default 'en' check (preferred_locale in ('zh', 'en', 'de')),
  created_at timestamptz not null default now()
);

create table if not exists player_counter (
  singleton smallint primary key check (singleton = 1),
  next_number integer not null check (next_number between 0 and 16777216)
);

insert into player_counter (singleton, next_number) values (1, 0)
on conflict (singleton) do nothing;

create table if not exists attempts (
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
);

create table if not exists runs (
  id bigserial primary key,
  player_id varchar(6) not null references players(id),
  locale varchar(2) not null check (locale in ('zh', 'en', 'de')),
  level1_prob double precision not null check (level1_prob between 0 and 1),
  level2_prob double precision not null check (level2_prob between 0 and 1),
  level3_prob double precision not null check (level3_prob between 0 and 1),
  escaped boolean not null,
  avg_prob double precision generated always as ((level1_prob + level2_prob + level3_prob) / 3) stored,
  created_at timestamptz not null default now()
);

create index if not exists runs_locale_avg_idx on runs (locale, avg_prob desc);
