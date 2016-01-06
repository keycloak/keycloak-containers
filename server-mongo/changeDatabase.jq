.eventsStore.provider |= "mongo" | 
  .eventsStore.mongo["exclude-events"] |= ["REFRESH_TOKEN"] | 
  .realm.provider = "mongo" | 
  .user.provider = "mongo" |
  .userSessionPersister.provider = "mongo" |  
  .connectionsMongo.default.host = "${env.MONGO_PORT_27017_TCP_ADDR}" |
  .connectionsMongo.default.port = "27017" |
  .connectionsMongo.default.db = "${env.MONGODB_DBNAME:keycloak}" |
  .connectionsMongo.default.connectionsPerHost = 100 |
  .connectionsMongo.default.databaseSchema = "update" |
  del (.eventsStore.jpa) | 
  del (.connectionsJpa)
