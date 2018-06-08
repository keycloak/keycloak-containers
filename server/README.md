# Keycloak Docker image

Keycloak Server Docker image.



## Usage

To boot in standalone mode

    docker run jboss/keycloak



## Expose on localhost

To be able to open Keycloak on localhost map port 8080 locally

   docker run -p 8080:8080 jboss/keycloak



## Creating admin account

By default there is no admin user created so you won't be able to login to the admin console. To create an admin account
you need to use environment variables to pass in an initial username and password. This is done by running:

    docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> jboss/keycloak

You can also create an account on an already running container by running:

    docker exec <CONTAINER> keycloak/bin/add-user-keycloak.sh -u <USERNAME> -p <PASSWORD>

Then restarting the container:

    docker restart <CONTAINER>



## Database

This image supports using H2, MySQL, PostgreSQL or MariaDB as the database.

You can specify the DB vendor directly with the `DB_VENDOR` environment variable. Supported values are:

- `h2` for the embedded H2 database,
- `postgres` for the Postgres database,
- `mysql` for the MySql database.
- `mariadb` for the MariaDB database.

If `DB_VENDOR` value is not specified the image will try to detect the DB vendor based on the following logic:

- Is the default host name for the DB set using `getent hosts` (`postgres`, `mysql`, `mariadb`). This works if you are 
using a user defined network and the default names as specified below.
- Is there a DB specific `_ADDR` environment variable set (`POSTGRES_ADDR`, `MYSQL_ADDR`, `MARIADB_ADDR`). **Deprecated**

If the DB can't be detected it will default to the embedded H2 database.

### Environment variables

Generic variable names can be used to configure any Database type, defaults may vary depending on the Database.

- `DB_ADDR`: Specify hostname of the database (optional)
- `DB_PORT`: Specify port of the database (optional, default is DB vendor default port)
- `DB_DATABASE`: Specify name of the database to use (optional, default is `keycloak`).
- `DB_USER`: Specify user to use to authenticate to the database (optional, default is `keycloak`).
- `DB_PASSWORD`: Specify user's password to use to authenticate to the database (optional, default is `password`).

### MySQL Example

#### Create a user define network

    docker network create keycloak-network

#### Start a MySQL instance

First start a MySQL instance using the MySQL docker image:

    docker run --name mysql -d --net keycloak-network -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password -e MYSQL_ROOT_PASSWORD=root_password mysql

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MySQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the MySQL instance to `mysql` you need to specify the `DB_ADDR` environment variable.

### PostgreSQL Example

#### Create a user define network

    docker network create keycloak-network

#### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run -d --name postgres --net keycloak-network -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password postgres

#### Start a Keycloak instance

Start a Keycloak instance and connect to the PostgreSQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the PostgreSQL instance to `postgres` you need to specify the `DB_ADDR` environment variable.

### MariaDB Example

#### Create a user define network

    docker network create keycloak-network

#### Start a MariaDB instance

First start a MariaDB instance using the MariaDB docker image:

    docker run -d --name mariadb --net keycloak-network -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password mariadb

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MariaDB instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the MariaDB instance to `mariadb` you need to specify the `DB_ADDR` environment variable.

### Specify JDBC parameters

When connecting Keycloak instance to the database, you can specify the JDBC parameters. Details on JDBC parameters can be
found here:

* [PostgreSQL](https://jdbc.postgresql.org/documentation/head/connect.html)
* [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-configuration-properties.html)
* [MariaDB](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#optional-url-parameters)

#### Example

    docker run --name keycloak -e DB_VENDOR=postgres -e JDBC_PARAMS='connectTimeout=30' jboss/keycloak



## Adding custom theme

To add a custom theme extend the Keycloak image add the theme to the `/opt/jboss/keycloak/themes` directory.



## Adding custom provider

To add a custom provider extend the Keycloak image and add the provider to the `/opt/jboss/keycloak/standalone/deployments/`
directory.



## Misc

### Specify log level

When starting the Keycloak instance you can pass a number an environment variables to set log level for Keycloak, for example:

    docker run -e KEYCLOAK_LOGLEVEL=DEBUG jboss/keycloak

### Enabling proxy address forwarding

When running Keycloak behind a proxy, you will need to enable proxy address forwarding.

    docker run -e PROXY_ADDRESS_FORWARDING=true jboss/keycloak



## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK
distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md
for selected images for more info.
