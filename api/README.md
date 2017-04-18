Killbug REST API (with PostgREST)
===================================

- Available through api.killbug.today ([app clever](https://console.clever-cloud.com/organisations/orga_6353e166-a7fe-4174-a2ed-381833ce68eb/applications/app_550100da-5d7a-4847-8b99-c419b3880ce4))


# Development

```
# start postgresql + postgrest
docker-compose up
```

```
# load schema into the database
npm run --silent psql:init

You are set.

### Edit docker-compose

```
npm run --silent docker:compose:watch
```


# tested postgraphql BUT:

- does not work with JWT from Auth0.


- CI => spawn du PGSQL pour diff avec la prod => génération de la migration => validation via slack => migration => merge git => merge sur master
-

# how we are going to test migration

- only test from the frontend side with JWT tokens (integration tests)


# how we are going to handle migration
(à mettre dans sql-conventions)

We do NOT want our SCM to have the original version AND some migration folder, we want to be single-source-of-truth, and not have our brain do crazy thing to understand what was modified and how.

Process I think right now for db migration:
 - 1/CI job that runs a diff tool
  - https://github.com/djrobstep/migra
  - http://www.liquibase.org/documentation/diff.html
 - 2/CI job send the diff through slack and ask for confirmation (or edit)
 - 3/CI job run the migration script
 - 4/CI job merge changes to master

Next steps:
  - Before 3 & 4, spawn another database with a dump of the production data and apply the migration, record how long it took, if more than Xseconds => crash (because we don't want to slow down the production)
