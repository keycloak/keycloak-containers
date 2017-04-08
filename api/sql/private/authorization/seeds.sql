-- -- fill table organization_user_user (1)
\echo # Filling table scenario (1)
COPY scenario (client_id,name,"isAvailableIfOnlyOperatorAreAvailable") FROM STDIN (ENCODING 'utf-8', FREEZE ON);
'HA-10'	'test-scenario-1'	true
'HA-10'	'test-scenario-2'	false
'HA-11'	'test-scenario-1'	false
'HA-12'	'test-scenario-2'	true
\.
