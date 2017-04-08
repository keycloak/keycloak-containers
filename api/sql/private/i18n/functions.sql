CREATE OR REPLACE FUNCTION i18n.t(_locale_id TEXT, _key_id TEXT, VARIADIC _params TEXT[]) RETURNS TEXT AS $$
DECLARE
	_segment text;
BEGIN
	-- @todo we currently do NOT handle pluralization AND interpolation
	select segment from i18n.segment where locale_id = _locale_id and key_id = _key_id limit 1 into _segment;
	return _segment;
END;
$$
LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION i18n.t(_locale_id TEXT, _key_id TEXT, _count INTEGER) RETURNS TEXT AS $$
-- DECLARE
-- 	_segment ARRAY[];
-- BEGIN
-- 	-- because in pg array starts from 1 instead of 0 -__-
-- 	select segment from i18n.segment where locale_id = _locale_id and key_id = _key_id limit 1 into _segment;
-- 	return _segment[GREATEST(array_length(_segment), 1)];
-- END;
-- $$
-- LANGUAGE plpgsql;
