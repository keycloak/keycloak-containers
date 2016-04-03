# Keycloak PostgreSQL

This Keycloak image extends the base Keycloak docker image to use PostgreSQL. To build and properly name this image, run:

```
docker build -t jboss/keycloak-postgres .
```

## Usage

### Use `docker-compose` to start all services

To start both the Keycloak and the PostgreSQL instances, use `docker-compose`:

```
docker-compose up
```

[Refer to the documentation on `docker-compose` for more information regarding this tool.](https://docs.docker.com/compose/reference/overview/)

### Connect to an existing PostgreSQL instance

To connect to an existing PostgreSQL instance, use `docker run` and specify the PostgreSQL connection criteria via environment variables:

```
docker run --name keycloak -e POSTGRES_DATABASE=kcdatabase -e POSTGRES_USER=kcuser -e POSTGRES_PASSWORD=kcpassword jboss/keycloak-postgres
```

### Environment variables

When starting the container via `docker run` you can pass a number of environment variables to configure the PostgreSQL connection criteria. For example:

#### POSTGRES_HOST

Specify the address of the server hosting the PostgreSQL database (required).

#### POSTGRES_PORT

Specify the port for PostgreSQL database (optional, default is `5432`).

#### POSTGRES_DATABASE

Specify the name of PostgreSQL database (optional, default is `keycloak`).

#### POSTGRES_USER

Specify the user for PostgreSQL database (optional, default is `keycloak`).

#### POSTGRES_PASSWORD

Specify the password for PostgreSQL database (optional, default is `keycloak`).
