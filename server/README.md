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

This image supports using H2, MySQL, PostgreSQL, MariaDB, or Mssql as the database.
The image will automatically detect what DB to use based on the value of the `DB_VENDOR` environment variable:
- `H2` for the embedded H2 database,
- `POSTGRES` for the Postgres database,
- `MYSQL` for the MySql database.
- `MARIADB` for the MariaDB database.
- `MSSQL` for the Mssql database.

If `DB_VENDOR` is not set the startup script will fail with the following error message:
```
Missing mandatory environment variable DB_VENDOR. Allowed values are [H2, POSTGRES, MYSQL, MARIADB]
```

## Generic environment variables

Generic variable names can be used to configure any Database type, defaults may vary depending on the Database.

- `DB_ADDR`: Specify hostname of the database (optional)
  - MySQL: `mysql`
  - PostgreSQL: `postgres`
  - MariaDB: `mariadb`
  - Mssql: `mssqldb`
- `DB_PORT`: Specify port of the database (optional)
  - MySQL: `3306`
  - PostgreSQL: `5432`
  - MariaDB: `3306`
  - Mssql: `1433`
- `DB_DATABASE`: Specify name of the database to use (optional, default is `keycloak`).
- `DB_USER`: Specify user to use to authenticate to the database (optional, default is `keycloak`).
- DB_PASSWORD: Specify user's password to use to authenticate to the database (optional, default is `password`).

### MySQL

#### Create a user define network

    docker network create keycloak-network

#### Start a MySQL instance

First start a MySQL instance using the MySQL docker image:

    docker run --name mysql -d --net keycloak-network -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password -e MYSQL_ROOT_PASSWORD=root_password mysql

If you choose a different container name to `mysql` you need to specify the `DB_ADDR` environment variable.

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MySQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### MYSQL_ADDR

Specify hostname of MySQL database (optional, default is `mysql`). **Deprecated**. Use `DB_ADDR`

##### MYSQL_PORT

Specify port of MySQL database (optional, default is `3306`). **Deprecated**. Use `DB_PORT`

##### MYSQL_DATABASE

Specify name of MySQL database (optional, default is `keycloak`). **Deprecated**. Use `DB_DATABASE`

##### MYSQL_USER

Specify user for MySQL database (optional, default is `keycloak`). **Deprecated**. Use `DB_USER`

##### MYSQL_PASSWORD

Specify password for MySQL database (optional, default is `password`). **Deprecated**. Use `DB_PASSWORD`


### PostgreSQL

#### Create a user define network

    docker network create keycloak-network

#### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run -d --name postgres --net keycloak-network -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password postgres

If you choose a different container name to `postgres` you need to specify the `DB_ADDR` environment variable.

#### Start a Keycloak instance

Start a Keycloak instance and connect to the PostgreSQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### POSTGRES_ADDR

Specify hostname of PostgreSQL database (optional, default is `postgres`). **Deprecated**. Use `DB_ADDR`

##### POSTGRES_PORT

Specify port of PostgreSQL database (optional, default is `5432`). **Deprecated**. Use `DB_PORT`

##### POSTGRES_DATABASE

Specify name of PostgreSQL database (optional, default is `keycloak`). **Deprecated**. Use `DB_DATABASE`

##### POSTGRES_USER

Specify user for PostgreSQL database (optional, default is `keycloak`). **Deprecated**. Use `DB_USER`

##### POSTGRES_PASSWORD

Specify password for PostgreSQL database (optional, default is `password`). **Deprecated**. Use `DB_PASSWORD`

### MariaDB

#### Create a user define network

    docker network create keycloak-network

#### Start a MariaDB instance

First start a MariaDB instance using the MariaDB docker image:

    docker run -d --name mariadb --net keycloak-network -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password mariadb

If you choose a different container name to `mariadb` you need to specify the `DB_ADDR` environment variable.

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MariaDB instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### MARIADB_ADDR

Specify hostname of MariaDB database (optional, default is `mariadb`). **Deprecated**. Use `DB_ADDR`

##### MARIADB_PORT

Specify port of MariaDB database (optional, default is `3306`). **Deprecated**. Use `DB_PORT`

##### MARIADB_DATABASE

Specify name of MariaDB database (optional, default is `keycloak`). **Deprecated**. Use `DB_DATABASE`

##### MARIADB_USER

Specify user for MariaDB database (optional, default is `keycloak`). **Deprecated**. Use `DB_USER`

##### MARIADB_PASSWORD

Specify password for MariaDB database (optional, default is `password`). **Deprecated**. Use `DB_PASSWORD`

### Legacy container links

Legacy container links (`--link`) are still supported, but these will be removed at some point in the future.
We recommend if you are using these to change to user defined networks as shown in the previous examples.

### Mssql

#### Create a user define network

    docker network create keycloak-network

#### Start a Mssql instance

First start a Mssql instance using the Mssql docker image:

    docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=P@ssword123' -d --net keycloak-network microsoft/mssql-server-linux:latest

If you choose a different container name to `mssql` you need to specify the `DB_ADDR` environment variable.

Mssql requires a strong password which must be more than 8 characters in length and satisfy at least three of the following four criteria:

- contain uppercase letters.
- lowercase letters.
- numbers.
- non-alphanumeric characters; for example, #, %, or ^

#### Start a Keycloak instance

Start a Keycloak instance and connect to the Mssql instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### MSSQL_ADDR

Specify hostname of Mssql database (optional, default is `mssql`). **Deprecated**. Use `DB_ADDR`

##### MSSQL_PORT

Specify port of Mssql database (optional, default is `1433`). **Deprecated**. Use `DB_PORT`

##### MSSQL_DATABASE

Specify name of Mssql database (optional, default is `keycloak`). **Deprecated**. Use `DB_DATABASE`

##### MSSQL_USER

Specify user for Mssql database (optional, default is `sa`). **Deprecated**. Use `DB_USER`

##### MSSQL_PASSWORD

Specify password for Mssql database (optional, default is `password`). **Deprecated**. Use `DB_PASSWORD`

### Legacy container links

Legacy container links (`--link`) are still supported, but these will be removed at some point in the future.
We recommend if you are using these to change to user defined networks as shown in the previous examples.

#### Example with PostgreSQL using container links

##### Start a PostgreSQL instance

docker run --name postgres -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -d postgres

##### Start a Keycloak instance

    docker run --name keycloak --link postgres:postgres jboss/keycloak



## Adding custom theme

To add a custom theme extend the Keycloak image and add the theme to the `/opt/jboss/keycloak/themes` directory.



## Adding custom provider

To add a custom provider extend the Keycloak image and add your provider to the `/opt/jboss/keycloak/standalone/deployments/`
directory.



## Misc

### Specify log level

When starting the Keycloak instance you can pass a number an environment variables to set log level for Keycloak, for example:

    docker run -e KEYCLOAK_LOGLEVEL=DEBUG jboss/keycloak

### Enabling proxy address forwarding

When running Keycloak behind a proxy, you will need to enable proxy address forwarding.

    docker run -e PROXY_ADDRESS_FORWARDING=true jboss/keycloak

### Specify JDBC parameters

When connecting Keycloak instance to the database, you can specify the JDBC parameters. Learn more:

* [PostgreSQL](https://jdbc.postgresql.org/documentation/head/connect.html)
* [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-configuration-properties.html)
* [MariaDB](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#optional-url-parameters)
* [Mssql](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-2017)

#### PostgreSQL example

    docker run --name keycloak -e JDBC_PARAMS='connectTimeout=30' jboss/keycloak

#### MySQL example

    docker run --name keycloak -e JDBC_PARAMS='connectTimeout=30000' jboss/keycloak

#### MariaDB example

    docker run --name keycloak -e JDBC_PARAMS='connectTimeout=30000' jboss/keycloak

## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK
distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md
for selected images for more info.
