-- grant all on schema v1 to anonymous;
-- grant all on ALL TABLES IN SCHEMA v1  to anonymous;
-- grant all on schema i18n to anonymous;
-- grant all on ALL TABLES IN SCHEMA i18n  to anonymous;
-- grant all on schema util to anonymous;
-- grant all on ALL TABLES IN SCHEMA util  to anonymous;
-- grant all on schema i18n to anonymous;

grant usage on schema v1 to anonymous;
grant usage on schema v1 to authenticated_user;

-- anonymous routes
grant select on v1.i18n_locales to anonymous;

-- authenticated_user routes
