# Keycloak HA PostgreSQL

Example Docker file for clustered Keycloak using a PostgreSQL

This image extends the [`jboss/base-jdk:7`](https://github.com/JBoss-Dockerfiles/base-jdk/tree/jdk7) image which adds the OpenJDK distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md for selected images for more info.

The build of this image performs several steps:

- it installs Keycloak into /opt/jboss/keycloak,
- it adds a PostgreSQL JDBC driver as a module,
- it configures a KeycloakDS datasource in standalone/configuration/standalone-ha.xml to use PostgreSQL driver
- it adds a keycloak space to Infinispan subsystem in standalone/configuration/standalone-ha.xml
- it overwrites keycloak-server.json in standalone/configuration/keycloak-server.json
- it adds a bin/start.sh script which should be used to start Keycloak with proper JGroups configuration and proper ENV variable handling so it works in Kubernetes environment as well


## Usage

### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run --name postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -e POSTGRES_ROOT_PASSWORD=password -d postgres

### Start a Keycloak HA instance

Start two or more Keycloak instances that form a cluster and connect to the PostgreSQL instance running in previously started 'postgres' container:

    docker run --name keycloak --link postgres:postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password jboss/keycloak-ha-postgres
    docker logs -f keycloak

    docker run --name keycloak2 --link postgres:postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password jboss/keycloak-ha-postgres
    docker logs -f keycloak2

### Kubernetes support

Example Kubernetes configuration file [keycloak-kube.json](https://github.com/JBoss-Dockerfiles/keycloak/blob/master/server-ha-postgres/keycloak-kube.json) is included, that can be used to set up a postgres pod, service, and replication controller for one instance of PostgreSQL, and a keycloak pod, service, and replication controller for two instances of Keycloak.

### Environment variables

#### POSTGRES_DATABASE

Specify name of PostgreSQL database (optional, default is `keycloak`).

#### POSTGRES_USER

Specify user for PostgreSQL database (optional, default is `keycloak`).

#### POSTGRES_PASSWORD

Specify password for PostgreSQL database (optional, default is `password`).

#### POSTGRES_SERVICE_SERVICE_HOST

In Kubernetes environment a service with id 'postgres-service' can be defined, and its IP address will be passed as the value of this env variable (optional, default is to use the value of POSTGRES_PORT_5432_TCP_ADDR environment variable which points to postgres instance).

#### POSTGRES_SERVICE_SERVICE_PORT

In Kubernetes environment a service with id 'postgres-service' can be defined, and its port will be passed as the value of this env variable (optional, default is `5432`)

