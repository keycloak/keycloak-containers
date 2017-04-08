CREATE OR REPLACE FUNCTION i18n.before() RETURNS void AS $$
BEGIN
  insert into i18n.key VALUES('a.b.d') ON CONFLICT DO NOTHING;
  insert into i18n.locale VALUES('fr') ON CONFLICT DO NOTHING;
  insert into i18n.segment(key_id, locale_id, status, segment) VALUES('a.b.d', 'fr', 'Active', ARRAY['zero', 'one', 'two']) ON CONFLICT DO NOTHING;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION i18n.test_i18n_t_pluralization_should_work() RETURNS void AS $$
BEGIN
  PERFORM pgtest.assert_equals('zero', i18n.t('fr', 'a.b.d', 0));
  PERFORM pgtest.assert_equals('one', i18n.t('fr', 'a.b.d', 1));
  PERFORM pgtest.assert_equals('two', i18n.t('fr', 'a.b.d', 2));
  PERFORM pgtest.assert_equals('two', i18n.t('fr', 'a.b.d', 3));
  PERFORM pgtest.assert_equals('two', i18n.t('fr', 'a.b.d', 4));
END
$$ LANGUAGE plpgsql;



-- select array_agg(nspname)::VARCHAR[] from pg_catalog.pg_namespace where nspname not like 'pg_%' and nspname not in ('information_schema','test', 'pgtest', 'util');
-- SELECT *  FROM pgtest.coverage(ARRAY['public_v1','i18n','v1']::VARCHAR[], ARRAY['test']::VARCHAR[]);
SELECT pgtest.run_tests('i18n');
