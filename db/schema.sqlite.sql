pragma foreign_keys = on;

create table if not exists players (
  id text primary key check (length(id) = 6),
  preferred_locale text not null default 'en' check (preferred_locale in ('zh', 'en', 'de')),
  created_at text not null default current_timestamp
);

create table if not exists player_counter (
  singleton integer primary key check (singleton = 1),
  next_number integer not null check (next_number between 0 and 16777216)
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
