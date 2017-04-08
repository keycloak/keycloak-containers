Killbug REST API (with PostgREST)
===================================

- Available through api.killbug.today ([app clever](https://console.clever-cloud.com/organisations/orga_6353e166-a7fe-4174-a2ed-381833ce68eb/applications/app_550100da-5d7a-4847-8b99-c419b3880ce4))


# Development

```
npm run docker:compose:watch
# changes when docker-compose.yml is changed
```

```
# execute commands from file to the current database (defaultdb), then exit
npm run --silent psql -- --file /api/init.sql defaultdb

# open psql interactively
npm run --silent psql
```


# tested postgraphql BUT:

- does not work with JWT from Auth0.
