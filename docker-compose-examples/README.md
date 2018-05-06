# Keycloak Docker Compose Examples

Examples for using Keycloak with Docker Compose



## Keycloak and PostgreSQL

The `keycloak-postgres.yml` template creates a volume for PostgreSQL and starts Keycloak connected to a PostgreSQL instance.

Run the example with the following command:

    docker-compose -f keycloak-postgres.yml up

Open http://localhost:8080/auth and login as user 'admin' with password 'Pa55w0rd'.

Note - If you run the example twice without removing the persisted volume there will be a warning 'user with username exists'. You can ignore this warning.



## Keycloak and MySQL

The `keycloak-mysql.yml` template creates a volume for MySQL and starts Keycloak connected to a MySQL instance.

Run the example with the following command:

    docker-compose -f keycloak-mysql.yml up

Note - This example is not currently working as MySQL is not ready to receive connections when Keycloak is started.



## Troubleshooting

### User with username exists

If you get a error `Failed to add user 'admin' to realm 'master': user with username exists` this is most likely because
you've already ran the example, but not deleted the persisted volume for the database. In this case the admin user already
exists. You can ignore this warning or delete the volume before trying again.