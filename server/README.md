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

This image supports using H2, MySQL, PostgreSQL or MariaDB as the database. The image will automatically detect what DB to use based
on the following rules:

- Use PostgreSQL if `postgres` hostname resolves or `POSTGRES_ADDR` environment variable is set
- Use MySQL if `mysql` hostname resolves or `MYSQL_ADDR` environment variable is set
- Use MariaDB if `mariadb` hostname resolves or `MARIADB_ADDR` environment variable is set
- Use embedded H2 if none of above and `DB_VENDOR` environment variable not set 

You can also use the `DB_VENDOR` environment variable to explicitly specify the database:

- `h2` for the embedded H2 database,
- `postgres` for the Postgres database,
- `mysql` for the MySql database.
- `mariadb` for the MariaDB database.



### MySQL

#### Create a user define network

    docker network create keycloak-network

#### Start a MySQL instance

First start a MySQL instance using the MySQL docker image:

    docker run --name mysql -d --net keycloak-network -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password -e MYSQL_ROOT_PASSWORD=root_password mysql
    
If you choose a different container name to `mysql` you need to specify the `MYSQL_ADDR` environment variable.

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MySQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### MYSQL_ADDR

Specify hostname of MySQL database (optional, default is `mysql`).

##### MYSQL_PORT

Specify port of MySQL database (optional, default is `3306`).

##### MYSQL_DATABASE

Specify name of MySQL database (optional, default is `keycloak`).

##### MYSQL_USER

Specify user for MySQL database (optional, default is `keycloak`).

##### MYSQL_PASSWORD

Specify password for MySQL database (optional, default is `password`).



### PostgreSQL

#### Create a user define network

    docker network create keycloak-network

#### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run -d --name postgres --net keycloak-network -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password postgres
    
If you choose a different container name to `postgres` you need to specify the `POSTGRES_ADDR` environment variable. 

#### Start a Keycloak instance

Start a Keycloak instance and connect to the PostgreSQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### POSTGRES_ADDR

Specify hostname of PostgreSQL database (optional, default is `postgres`).

##### POSTGRES_PORT

Specify port of PostgreSQL database (optional, default is `5432`).

##### POSTGRES_DATABASE

Specify name of PostgreSQL database (optional, default is `keycloak`).

##### POSTGRES_USER

Specify user for PostgreSQL database (optional, default is `keycloak`).

##### POSTGRES_PASSWORD

Specify password for PostgreSQL database (optional, default is `password`).

### MariaDB

#### Create a user define network

    docker network create keycloak-network

#### Start a MariaDB instance

First start a MariaDB instance using the MariaDB docker image:

    docker run -d --name mariadb --net keycloak-network -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password mariadb
    
If you choose a different container name to `mariadb` you need to specify the `MARIADB_ADDR` environment variable. 

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MariaDB instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

#### Environment variables

##### MARIADB_ADDR

Specify hostname of MariaDB database (optional, default is `mariadb`).

##### MARIADB_PORT

Specify port of MariaDB database (optional, default is `3306`).

##### MARIADB_DATABASE

Specify name of MariaDB database (optional, default is `keycloak`).

##### MARIADB_USER

Specify user for MariaDB database (optional, default is `keycloak`).

##### MARIADB_PASSWORD

Specify password for MariaDB database (optional, default is `password`).


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



## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK 
distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md 
for selected images for more info.
