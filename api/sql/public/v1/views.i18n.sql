-- expose locale and along with their segment
create or replace view v1.i18n_locales as
select
  l.locale_id as locale,
  s.segment as segments
  -- array_agg(s.segment) as segments
from i18n.locale l
inner join i18n.segment s using (locale_id)
where s.status = 'Active';

alter view v1.i18n_locales owner to authenticator; -- it is important to set the correct owner to the RLS policy kicks in

-- group by (l.locale_id);

-- create or replace view v1.i18n_ as select organization_id, name,"createdAt" from data.organization;
-- alter view api.organizations owner to api_users; -- it is important to set the correct owner to the RLS policy kicks in
-- grant select on api.organizations to authenticated_user;
