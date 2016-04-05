# Keycloak MySQL

This Keycloak image extends the base Keycloak docker image to use MySQL. To build and properly name this image, run:

```
docker build -t jboss/keycloak-mysql .
```

## Usage

### Use `docker-compose` to start all services

To start both the Keycloak and the MySQL instances, use `docker-compose`:

```
docker-compose up
```

[Refer to the documentation on `docker-compose` for more information regarding this tool.](https://docs.docker.com/compose/reference/overview/)

### Connect to an existing MySQL instance

To connect to an existing MySQL instance, use `docker run` and specify the MySQL connection criteria via environment variables:

```
docker run --name keycloak -e MYSQL_DATABASE=kcdatabase -e MYSQL_USER=kcuser -e MYSQL_PASSWORD=kcpassword jboss/keycloak-mysql
```

### Environment variables

When starting the container via `docker run` you can pass a number of environment variables to configure the MySQL connection criteria. For example:

#### MYSQL_HOST

Specify the address of the server hosting the MySQL database (required).

#### MYSQL_PORT

Specify the port for MySQL database (optional, default is `3306`).

#### MYSQL_DATABASE

Specify the name of MySQL database (optional, default is `keycloak`).

#### MYSQL_USER

Specify the user for MySQL database (optional, default is `keycloak`).

#### MYSQL_PASSWORD

Specify the password for MySQL database (optional, default is `keycloak`).
