## Conventions


## Why this folder

This folder is where all your database code lives, which will be 95% of your backend code (don't worry, most of it will be table/view definitions and statements related to access control for users). Upon the first boot, all the \*.sql and \*.sh files at the root of this folder will be executed. It is advisable to have a single entrypoint .sql file, this will make it possible to have a better development workflow (see devutils/ dir). You can have any directory structure you like and use the metacomand \\ir to include other files, however it's a good idea to stick to the conventions of this project, which are:

- There is a single init.sql file at the top that assumes the database is empty and creates all the schemas/tables/views/functions/triggers/policies/roles needed for you application to function. It even creates the authenticator role used by openresty/postgrest to make the initial connection to the database. Notice how the name/password of that role is not hardcoded but read from a env variable

- init.sh script is the place where you would put custom code to alter the global configuration of your postgresql database. In this repository it enables detailed logging when development mode is enabled.

- Each database schema should have a top level directory (api/data/util/pgjwt) **in private/**. The inclusion of the files is driven by \\ir commands and not by some predefined naming convention.

- Inside schema directory, have a file called schema.sql which creates the schema in question then includes all the (files of) other entities that live within that schema. Within these directories, try to have a single file for each main entity that lives within this schema (table/view/function), this makes it easy when looking at the schema directory to easily see what are it's core entities.

While in this repository everything related to an entity (constraints/grants/triggers/policies) live in the same file, as your project grows you might want to have separate files for them like items/grants.sql, items/policies.sql. This makes it possible to have an iterative workflow process when defining things like constraints for tables or access privileges for views/functions exposed for api that does not require resetting the entire database but only replaying that particular sql file. Unlike the top level init.sql file, each file should assume the entity/property it describes is already present so it should use things like REPLACE/IF EXISTS/DROP/REVOKE to make sure the file can be executed in isolation whenever possible to avoid the need to reset the database (which sounds bad but it's quite ok, it takes only 1-2 seconds).

For complete documentation of what you can do in the database context always check https://www.postgresql.org/docs/manuals/
