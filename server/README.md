# Keycloak Docker image

Example Dockerfile with Keycloak server.



## Usage

To boot in standalone mode

    docker run jboss/keycloak



## Creating admin account

By default there is no admin user created so you won't be able to login to the admin console. To create an admin account you need to use environment variables to pass in an initial username and password. This is done by running:

    docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> jboss/keycloak

You can also create an account on an already running container by running:

    docker exec <CONTAINER> keycloak/bin/add-user-keycloak.sh -u <USERNAME> -p <PASSWORD>

Then restarting the container:

    docker restart <CONTAINER>



## Database

This image supports using H2, MySQL or PostgreSQL as the database. The image will automatically detect what DB to use by
looking at the declared environment variables (`POSTGRES_***` for PostgreSQL, `MYSQL_***` for MySQL).

You can also use the `DB_VENDOR` environment variable to explicitly specify the database:

- `H2` for the embedded H2 database,
- `POSTGRES` for the Postgres database,
- `MYSQL` for the MySql database.



### MySQL

#### Start a MySQL instance

First start a MySQL instance using the MySQL docker image:

    docker run --name mysql -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password -e MYSQL_ROOT_PASSWORD=root_password -d mysql

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MySQL instance:

    docker run --name keycloak --link mysql:mysql jboss/keycloak

#### Environment variables

When starting the Keycloak instance you can pass a number of environment variables to configure how it connects to MySQL. For example:

    docker run --name keycloak --link mysql:mysql -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password jboss/keycloak

##### MYSQL_DATABASE

Specify name of MySQL database (optional, default is `keycloak`).

##### MYSQL_USER

Specify user for MySQL database (optional, default is `keycloak`).

##### MYSQL_PASSWORD

Specify password for MySQL database (optional, default is `password`).



### PostgreSQL

#### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run --name postgres -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -d postgres

#### Start a Keycloak instance

Start a Keycloak instance and connect to the PostgreSQL instance:

    docker run --name keycloak --link postgres:postgres jboss/keycloak

#### Environment variables

When starting the Keycloak instance you can pass a number of environment variables to configure how it connects to PostgreSQL. For example:

    docker run --name keycloak --link postgres:postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password jboss/keycloak

##### POSTGRES_DATABASE

Specify name of PostgreSQL database (optional, default is `keycloak`).

##### POSTGRES_USER

Specify user for PostgreSQL database (optional, default is `keycloak`).

##### POSTGRES_PASSWORD

Specify password for PostgreSQL database (optional, default is `password`).



## Misc

### Specify log level

When starting the Keycloak instance you can pass a number an environment variables to set log level for Keycloak, for example:

    docker run -e KEYCLOAK_LOGLEVEL=DEBUG jboss/keycloak

Note that there are still per-package loglevel defaults.

### Enabling proxy address forwarding

When running Keycloak behind a proxy, you will need to enable proxy address forwarding.

    docker run -e PROXY_ADDRESS_FORWARDING=true jboss/keycloak

## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md for selected images for more info.
