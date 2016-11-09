# Keycloak HA PostgreSQL

Example Docker file for clustered Keycloak using a PostgreSQL

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

What you should see at the second start is log lines with a `(2)` for cluster view, like
```
INFO  [org.infinispan.remoting.transport.jgroups.JGroupsTransport] (MSC service thread 1-4) ISPN000094: Received new cluster view for channel web: [285553cc5063|1] (2) [285553cc5063, 676929b52b0a]
```

At the same time the first container's logs should show a number of `cluster-wide rebalance`.

## Other details

This image extends the [`jboss/keycloak-postgres`](https://github.com/jboss-dockerfiles/keycloak) image. Please refer to the README.md for selected images for more info.
