COPY i18n."segmentStatus" ("segmentStatus_id", "comment") FROM STDIN WITH (delimiter ',', FORMAT csv, ENCODING 'utf-8', FREEZE ON);
Active,segment translated and reviewed
WaitingReview,segment translated but not reviewed
WaitingTranslation,segment not currently translated
Unactive,segment hidden by a manager or not found in the master file during last sync
\.
