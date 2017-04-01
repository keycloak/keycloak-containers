WITH events_for_user_id AS (
    SELECT
      user_id,
      asl.log #>> '{data,level}' AS "data.level",
      count(asl.session_id)        AS count
    FROM application_session
      INNER JOIN application_session_log asl USING (session_id)
    WHERE user_id IS NOT NULL AND asl.log ->> 'type' = 'console'
    GROUP BY user_id, asl.log #>> '{data,level}'
)
SELECT DISTINCT
  application_user.user_id,

  (SELECT
     json_agg(evt)
   FROM events_for_user_id evt
   WHERE evt.user_id = application_user.user_id),

  application_user."createdAt"                     AS "firstSeen",
  first_value(application_session.session_id)
  OVER (PARTITION BY application_session.user_id
    ORDER BY application_session."createdAt" DESC) AS "lastSessionId",
  count(application_session.session_id)
  OVER (byUserId)                                  AS "sessionCount",
  MAX(application_session."createdAt")
  OVER (byUserId)                                  AS "lastSeen"
FROM application_user
  LEFT OUTER JOIN application_session USING (user_id)
WHERE application_user.application_id = '0eb9c047-2c03-4e87-b13c-716bf65a130a' :: UUID
-- and user_id = '54b7df368dba242612000200'
WINDOW byUserId AS (
  PARTITION BY application_session.user_id )
ORDER BY "lastSeen" DESC
LIMIT 200;



SELECT asl."createdAt", log
FROM application_user
LEFT OUTER JOIN application_session USING (user_id)
LEFT OUTER JOIN application_session_log asl USING (session_id)
WHERE application_user.application_id = 'd6ae7e6c-6438-4823-aa68-1b19ec4aa238' :: UUID
      and context #>> '{tag,clientId}' = '67'
      and context #>> '{tag,operatorId}' = '108213'
      and not (asl.log #>> '{data,url}' ~ 'api\.mixpanel\.com|mail_error')
      --and asl.log #>> '{data,status_code}' != '0'
ORDER BY asl."createdAt" DESC
LIMIT 400;

