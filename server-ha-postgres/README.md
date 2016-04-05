# Keycloak HA PostgreSQL

This docker compose configuration is an example of a clustered Keycloak environment, using PostgreSQL as the database and HAProxy as the load balancer.

The HAProxy instance listens on port 8080, and round-robins requests to two Keycloak instances.

## Usage

### Use `docker-compose` to start all services

To start two Keycloak containers, the PostgreSQL container, and the HAProxy container, use `docker-compose`:

```
docker-compose up
```

[Refer to the documentation on `docker-compose` for more information regarding this tool.](https://docs.docker.com/compose/reference/overview/)

### Adding more Keycloak instances to the cluster

To add more Keycloak instances (for example, `server_c`) to this cluster, do the following:

#### Add the new instance to `docker-compose.yml`

Add a `server_c` service to the `docker-compose.yml` file...

```
server_c:
extends:
  file: server/server.yml
  service: server
command: ["-b", "0.0.0.0", "-bprivate", "server_c", "--server-config", "standalone-ha.xml"]
depends_on:
  - database
```

... then add the `server_c` service as a dependency of the `proxy` service...

```
proxy:
  ...
depends_on:
  - server_a
  - server_b
  - server_c
```

... and, finally, add the `server_c` instance to the HAProxy config:

```
backend server
    balance roundrobin
    server a server_a:8080 maxconn 32
    server b server_b:8080 maxconn 32
    server c server_c:8080 maxconn 32
```

## Other details

This composition relies upon the [`jboss/keycloak-postgres`](https://registry.hub.docker.com/u/jboss/keycloak-postgres/) image. Please refer to the [README.md](../server-postgres/README.md) of that image for more details.
