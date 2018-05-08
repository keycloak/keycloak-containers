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

This image supports using H2, MySQL, PostgreSQL, MariaDB or Microsoft SQL Server as the database.

You can specify the DB vendor directly with the `DB_VENDOR` environment variable. Supported values are:

- `h2` for the embedded H2 database,
- `postgres` for the Postgres database,
- `mysql` for the MySql database.
- `mariadb` for the MariaDB database.
- `mssql` for the Microsoft SQL Server database.

If `DB_VENDOR` value is not specified the image will try to detect the DB vendor based on the following logic:

- Is the default host name for the DB set using `getent hosts` (`postgres`, `mysql`, `mariadb`, `mssql`). This works if you are 
using a user defined network and the default names as specified below.
- Is there a DB specific `_ADDR` environment variable set (`POSTGRES_ADDR`, `MYSQL_ADDR`, `MARIADB_ADDR`, `MSSQL_ADDR`). **Deprecated**

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

### Microsoft SQL Server Example

#### Create a user define network

    docker network create keycloak-network

#### Start a Microsoft SQL Server instance

First start a Microsoft SQL Server instance using the Microsoft SQL Server docker image:

    docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=P@ssword123' -d --name mariadb --net keycloak-network microsoft/mssql-server-linux:latest mssql

#### Start a Keycloak instance

Start a Keycloak instance and connect to the Microsoft SQL Server instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the Microsoft SQL Server instance to `mssql` you need to specify the `DB_ADDR` environment variable.

### Specify JDBC parameters

When connecting Keycloak instance to the database, you can specify the JDBC parameters. Details on JDBC parameters can be
found here:

* [PostgreSQL](https://jdbc.postgresql.org/documentation/head/connect.html)
* [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-configuration-properties.html)
* [MariaDB](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#optional-url-parameters)
* [Microsoft SQL Server](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-2017)

#### Example

    docker run --name keycloak -e DB_VENDOR=postgres -e JDBC_PARAMS='connectTimeout=30' jboss/keycloak



## Adding custom theme

To add a custom theme extend the Keycloak image add the theme to the `/opt/jboss/keycloak/themes` directory.



## Adding custom provider

To add a custom provider extend the Keycloak image and add the provider to the `/opt/jboss/keycloak/standalone/deployments/`
directory.



## Misc

### Specify log level

There are two environment variables available to control the log level for Keycloak:

* `KEYCLOAK_LOGLEVEL`: Specify log level for Keycloak (optional, default is `INFO`)
* `ROOT_LOGLEVEL`: Specify log level for underlying container (optional, default is `INFO`)

Supported log levels are `ALL`, `DEBUG`, `ERROR`, `FATAL`, `INFO`, `OFF`, `TRACE` and `WARN`.

Log level can also be changed at runtime, for example (assuming docker exec access):

    ./keycloak/bin/jboss-cli.sh --connect --command='/subsystem=logging/root-logger=ROOT:change-root-log-level(level=DEBUG)'
    ./keycloak/bin/jboss-cli.sh --connect --command='/subsystem=logging/logger=org.keycloak:write-attribute(name=level,value=DEBUG)'

### Enabling proxy address forwarding

When running Keycloak behind a proxy, you will need to enable proxy address forwarding.

    docker run -e PROXY_ADDRESS_FORWARDING=true jboss/keycloak



## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK
distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md
for selected images for more info.



## Building image with Keycloak from different sources

### Building Keycloak from GitHub repository

It is possible to build Keycloak from a GitHub repository instead of downloading the official release. To do this set the `GITHUB_REPO` build argument to the GitHub repository name and optionally set the `GITHUB_BRANCH` build argument to the branch to build. For example:

    docker build --build-arg GIT_REPO=keycloak/keycloak --build-arg GIT_BRANCH=master .

This will clone the repository then build Keycloak from source. If you don't include GIT_BRANCH it will use the `master` branch.

#### Download Keycloak from an alternative location

It is possible to download the Keycloak distribution from an alternative location. This can for example be useful if you want to build a Docker image from Keycloak built locally. For example:

    docker build --build-arg KEYCLOAK_DIST=http://172.17.0.1:8000/keycloak-4.1.0.Final-SNAPSHOT.tar.gz .

For Keycloak built locally you need to first build the distribution then serve it with a web browser. For example use SimpleHTTPServer:

    cd $KEYCLOAK_CHECKOUT/distribution/server-dist/target
    python -m SimpleHTTPServer 8000
    
