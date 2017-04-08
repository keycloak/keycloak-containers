\set authenticator `echo $POSTGRES_AUTHENTICATOR_USER`
\set authenticator_pass `echo $POSTGRES_AUTHENTICATOR_PASSWORD`

-- should only contain role creation (for now)

-- the role used by postgrest to connect to the database
-- notice how this role does not have any privileges attached specifically to it
-- it can only switch to other roles
drop role if exists :authenticator;
create role :authenticator with noinherit login password :'authenticator_pass';


-- this role will be the owner of all the api exposed views
-- we'll use it to define our RLS policies
drop role if exists api_users;
create role api_users;

-- this is an applciation level role
-- requests that are not authenticated will be executed with this role's privileges
drop role if exists anonymous;
create role anonymous;
grant anonymous to :authenticator;
grant anonymous to postgres;

-- this is the main role used by authenticated users of our application
-- our JWT should contains { role: "authenticated_user", top_role: "authenticated_user" }
drop role if exists authenticated_user;
create role authenticated_user;
grant authenticated_user to :authenticator;
