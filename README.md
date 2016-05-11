# Keycloak Docker image

This is a set of Docker images related to Keycloak. 

- [keycloak](https://registry.hub.docker.com/u/jboss/keycloak/) example Keycloak server
- [keycloak-mysql](https://registry.hub.docker.com/u/jboss/keycloak-mysql/) example connecting Keycloak to MySQL
- [keycloak-postgres](https://registry.hub.docker.com/u/jboss/keycloak-postgres/) example connecting Keycloak to PostgreSQL
- [keycloak-adapter-wildfly](https://registry.hub.docker.com/u/jboss/keycloak-adapter-wildfly/) builds on top of the [jboss/wildfly](https://registry.hub.docker.com/u/jboss/wildfly/) image, adding the Keycloak adapter for Wildfly to it, as well as the required changes to the standalone.xml
- [keycloak-examples](https://registry.hub.docker.com/u/jboss/keycloak-examples/) builds on top of [keycloak](https://registry.hub.docker.com/u/jboss/keycloak/), adding the examples.
- [keycloak-reverse-proxy](https://registry.hub.docker.com/u/jboss/keycloak-reverse-proxy/) example running Keycloak behind a reverse proxy
