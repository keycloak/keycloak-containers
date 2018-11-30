
# For ALBI user
Add REAL_DB_ADDR to your persistence section of values.yaml
```
keycloak:
  keycloak:
    hostname: auth.albi.test
    username: root
    # Note: this password is only used for first-start of Keycloak
    # future updates are not reflected here.
    password: root
    persistence:
      # We want to use our existing Postgres setup
      deployPostgres: false
      real_db_addr: "postgres:5432"
      dbVendor: postgres # DB_VENDOR
      dbName: identity # DB_DATABASE
      dbHost: guagua # DB_ADDR
      dbPort: 9999 # DB_PORT
      dbUser: postgres # DB_USER
      dbPassword: postgres
```

# Keycloak Docker image

This is a set of Docker images related to Keycloak. 

- [keycloak](https://registry.hub.docker.com/u/jboss/keycloak/) example Keycloak server
- [keycloak-mysql](https://registry.hub.docker.com/u/jboss/keycloak-mysql/) example connecting Keycloak to MySQL
- [keycloak-postgres](https://registry.hub.docker.com/u/jboss/keycloak-postgres/) example connecting Keycloak to PostgreSQL
- [keycloak-adapter-wildfly](https://registry.hub.docker.com/u/jboss/keycloak-adapter-wildfly/) builds on top of the [jboss/wildfly](https://registry.hub.docker.com/u/jboss/wildfly/) image, adding the Keycloak adapter for Wildfly to it, as well as the required changes to the standalone.xml
- [keycloak-examples](https://registry.hub.docker.com/u/jboss/keycloak-examples/) builds on top of [keycloak](https://registry.hub.docker.com/u/jboss/keycloak/), adding the examples.

