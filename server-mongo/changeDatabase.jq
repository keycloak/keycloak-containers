.eventsStore.provider |= "mongo" | 
  .eventsStore.mongo["exclude-events"] |= ["REFRESH_TOKEN"] | 
  .realm.provider = "mongo" | 
  .user.provider = "mongo" | 
  .connectionsMongo.default.host = "${env.MONGODB_HOST:127.0.0.1}" |
  .connectionsMongo.default.port = "${env.MONGODB_PORT:27017}" |
  .connectionsMongo.default.db = "${env.MONGODB_DBNAME:keycloak}" |
  .connectionsMongo.default.connectionsPerHost = 100 |
  .connectionsMongo.default.databaseSchema = "update" |
  del (.eventsStore.jpa) | 
  del (.connectionsJpa)
