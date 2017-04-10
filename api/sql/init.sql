-- some setting to make the output less verbose
\set QUIET on
\set ON_ERROR_STOP on

-- set client_min_messages to notice;
-- set client_min_messages to warning;
set client_min_messages to debug;

-- two best things EVER (force to make every declaration explicit):
-- https://twitter.com/FGRibreau/status/850270856299270146
set search_path = '';

\echo # Loading database definition ==============
begin;

\echo # Down

\echo # Down public/
\ir public/down.sql
\echo # Down private/
\ir private/down.sql
\echo # Down global/
\ir global/down.sql

\echo # Up

\echo # Up global/
\ir global/up.sql
\echo # Up private/
\ir private/up.sql
\echo # Up public/
\ir public/up.sql

-- load up fixtures
\ir private/i18n/fixtures.sql

\echo [-✅--✅--✅--]
select now();
commit;
\echo # ==========================================
