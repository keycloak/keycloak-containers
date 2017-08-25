# Keycloak Openshift

Extends the Keycloak docker image to allow using it on Openshift as well as in s2i builds.

This image support the three execution modes:

- use an embedded database
- use an external postgres database
- use an external mysql database

## Usage

In order to be compatible with S2I builds, the startup command isn't fixed
in the entrypoint.

As a consequence, you have to include the startup script as the first parameter
of the `docker run` command.

The required startup script depends on the execution mode:

- `start-keycloak.sh` to use the embedded database (this is the default if no parameters are given),
- `start-keycloak-with-postgres.sh` to use an external postgres database,
- `start-keycloak-with-mysql.sh` to use an external mysql database.

### Use with an embedded database

    docker run jboss/keycloak-openshift start-keycloak.sh

The available environment variables and parameters are the same as for the `jboss/keycloak` image.

### Use with an external MySql database

    docker run --name keycloak --link mysql:mysql -e MYSQL_DATABASE=keycloak -e MYSQL_USERNAME=keycloak -e MYSQL_PASSWORD=password jboss/keycloak-openshift start-keycloak-with-mysql.sh

The available environment variables and parameters are the same as for the `jboss/keycloak-mysql` image.

### Use with an external Postres database

    docker run --name keycloak --link postgres:postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password jboss/keycloak-openshift start-keycloak-with-postgres.sh

The available environment variables and parameters are the same as for the `jboss/keycloak-postgres` image.
