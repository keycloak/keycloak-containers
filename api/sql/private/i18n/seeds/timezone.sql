-- Fill timezone
insert into i18n.timezone(timezone_id, abbreviation)
 select name, abbrev
 from pg_catalog.pg_timezone_names
 where name like '%/%';
