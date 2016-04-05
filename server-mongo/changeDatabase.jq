.eventsStore.provider |= "mongo" | 
  .eventsStore.mongo["exclude-events"] |= ["REFRESH_TOKEN"] | 
  .realm.provider = "mongo" | 
  .user.provider = "mongo" |
  .userSessionPersister.provider = "mongo" |  
  .connectionsMongo.default.host = "${env.MONGO_HOST}" |
  .connectionsMongo.default.port = "${env.MONGO_PORT:27017}" |
  .connectionsMongo.default.db = "${env.MONGO_DATABASE:keycloak}" |
  .connectionsMongo.default.connectionsPerHost = 100 |
  .connectionsMongo.default.databaseSchema = "update" |
  del (.eventsStore.jpa) | 
  del (.connectionsJpa)
