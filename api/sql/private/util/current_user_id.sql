
create or replace function util.current_client_id() returns TEXT as $$
    select util.jwt_claim('us')::TEXT
$$ stable language sql;
