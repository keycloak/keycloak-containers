create table i18n.country(
  country_id CHAR(3) NOT NULL PRIMARY KEY
);

COMMENT ON TABLE i18n.country IS 'List of every possible country (following ISO 3166-1)';
COMMENT ON COLUMN i18n.country.country_id IS 'ISO 3166-1 format, e.g. "FRA", see https://gist.github.com/FGRibreau/47a17449f9f5331f2fabab1d49b715ff';

create table i18n.language(
  language_id CHAR(2) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

COMMENT ON TABLE i18n.language IS 'List of every possible language (following ISO 369-1)';
COMMENT ON COLUMN i18n.language.language_id IS 'ISO 639-1 format, e.g. "fr", see https://gist.github.com/FGRibreau/47a17449f9f5331f2fabab1d49b715ff';
COMMENT ON COLUMN i18n.language.name IS 'language name in local language, e.g. "Français"';

create table i18n.timezone(
  timezone_id VARCHAR(40) NOT NULL PRIMARY KEY,
  abbreviation CHAR(6) NOT NULL
);

COMMENT ON TABLE i18n.timezone IS 'List of every possible language (following ISO 369-1), see https://gist.github.com/FGRibreau/47a17449f9f5331f2fabab1d49b715ff';
COMMENT ON COLUMN i18n.timezone.timezone_id IS 'In TZ* format e.g. "Europe/Paris"';
COMMENT ON COLUMN i18n.timezone.abbreviation IS 'timezone abbreviation, e.g. "CEST"';

-- @todo
-- https://github.com/umpirsky/currency-list/blob/master/data/fr_FR/currency.json
create table i18n.currency();

create table i18n.locale(
  locale_id CHAR(2) NOT NULL REFERENCES i18n.language(language_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "i18nLocaleLocaleIdUnique" UNIQUE(locale_id)
);

COMMENT ON TABLE i18n.locale IS 'List of currently available locale for this product/SaaS';
COMMENT ON COLUMN i18n.locale.locale_id IS 'Name of the locale available, e.f. "fr"';

create table i18n.key(
  key_id util.citext NOT NULL PRIMARY KEY
  -- @todo support for textDomain (a "category" name for translations. If this is omitted, it defaults to "default". Use text domains to segregate translations by context.)
  --       or tags maybe?
);

COMMENT ON TABLE i18n.key IS 'List of translation key (automatically extracted from the app most of the time)';
COMMENT ON COLUMN i18n.key.key_id IS 'e.g. "killbug.monitoring.header.menu.monitoring"';

create table i18n."segmentStatus"(
  "segmentStatus_id" VARCHAR(25) NOT NULL PRIMARY KEY,
  "comment" TEXT NOT NULL
);

COMMENT ON TYPE i18n."segmentStatus" IS 'segment translation status';
COMMENT ON COLUMN i18n."segmentStatus"."segmentStatus_id" IS 'e.g. "ProofRead"';
COMMENT ON COLUMN i18n."segmentStatus"."comment" IS 'comment in plain english that explains what this status is for.';

create table i18n.segment(
  key_id util.citext NOT NULL REFERENCES i18n.key(key_id) ON DELETE CASCADE ON UPDATE CASCADE,
  locale_id CHAR(2) NOT NULL REFERENCES i18n.locale(locale_id) ON DELETE CASCADE ON UPDATE CASCADE,
  status VarCHAR(25) NOT NULL REFERENCES i18n."segmentStatus"("segmentStatus_id") ON DELETE CASCADE ON UPDATE CASCADE,
  segment TEXT[] NOT NULL,
  CONSTRAINT "i18nSegmentKeyIdLocaleIdUnique" UNIQUE(key_id, locale_id)
);

COMMENT ON TABLE i18n.segment IS 'List of every translation segment';
COMMENT ON COLUMN i18n.segment.key_id IS 'see i18n.key.key_id';
COMMENT ON COLUMN i18n.segment.locale_id IS 'see i18n.locale.locale_id';
COMMENT ON COLUMN i18n.segment.status IS 'see i18n.segmentStatus.segmentStatus_id';
COMMENT ON COLUMN i18n.segment.segment IS 'An array {"zero element", "one element", "n elements"} for pluralization purpose. If only one element is present it will always be used';
