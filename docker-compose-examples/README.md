# Keycloak Docker Compose Examples

Examples for using Keycloak with Docker Compose



## Keycloak and PostgreSQL

The `keycloak-postgres.yml` template creates a volume for PostgreSQL and starts Keycloak connected to a PostgreSQL instance.

Run the example with the following command:

    docker-compose -f keycloak-postgres.yml up

Open http://localhost:8080/auth and login as user 'admin' with password 'Pa55w0rd'.

Note - If you run the example twice without removing the persisted volume there will be a warning 'user with username exists'. You can ignore this warning.


## Keycloak and PostgreSQL with JDBC_PING

Similarly to other templates, the `keycloak-postgres-jdbc-ping.yml` template creates a volume for PostgreSQL and boots up Keycloak connected to it. Traefik is used like load balancer to redirect all request to diferent container instances. The most important change is the JGroups Discovery protocol that is used in this configuration, which is `JDBC_PING`. `JDBC_PING` reuses the same database instance as all Keycloak servers in the cluster.

Run the example with the following command:

    docker-compose -f keycloak-postgres-jdbc-ping.yml up --scale keycloak=2

Once the cluster is started, open http://localhost:8080/auth and login as user 'admin' with password 'Pa55w0rd'.

Note - Sometimes, it is necessary to adjust the `JDBC_PING` initialization SQL (see the [manual](http://jgroups.org/manual/#_jdbc_ping)). In such cases, make sure you specify proper `initialize_sql` string into `JGROUPS_DISCOVERY_PROPERTIES` property. For more information, please refer to [JGroups codebase](https://github.com/belaban/JGroups/blob/master/src/org/jgroups/protocols/JDBC_PING.java).



## Keycloak and MySQL

The `keycloak-mysql.yml` template creates a volume for MySQL and starts Keycloak connected to a MySQL instance.

Run the example with the following command:

    docker-compose -f keycloak-mysql.yml up

Note - This example is not currently working as MySQL is not ready to receive connections when Keycloak is started.


## Keycloak and MariaDB with JDBC_PING

Similarly to other templates, the `keycloak-mariadb-jdbc-ping.yml` template creates a volume for MariaDB and boots up Keycloak connected to it. The most important change is the JGroups Discovery protocol that is used in this configuration, which is `JDBC_PING`. `JDBC_PING` reuses the same database instance as all Keycloak servers in the cluster.

Run the example with the following command:

    docker-compose -f keycloak-mariadb-jdbc-ping.yml up --scale keycloak=2

Once the cluster is started, use `docker ps` and `docker inspect` commands to obtain one of the Keycloak server IPs. Then open http://<ip>:8080/auth and login as user 'admin' with password 'Pa55w0rd'.

Note - Sometimes, it is necessary to adjust the `JDBC_PING` initialization SQL (see the [manual](http://jgroups.org/manual/#_jdbc_ping)). In such cases, make sure you specify proper `initialize_sql` string into `JGROUPS_DISCOVERY_PROPERTIES` property. For more information, please refer to [JGroups codebase](https://github.com/belaban/JGroups/blob/master/src/org/jgroups/protocols/JDBC_PING.java).

## Keycloak and Microsoft SQL Server

The `keycloak-mssql.yml` template creates a volume for Microsoft SQL Server and starts Keycloak connected to a Microsoft SQL Server instance.

Run the example with the following command:

    docker-compose -f keycloak-mssql.yml up

Note - This example uses an additional container to create the keycloak database prior to loading the keycloak application.  In addition, the keycloak container can be rebuilt using

    docker-compose -f ./docker-compose-examples/keycloak-mssql.yml build



## Troubleshooting

### User with username exists

If you get a error `Failed to add user 'admin' to realm 'master': user with username exists` this is most likely because
you've already ran the example, but not deleted the persisted volume for the database. In this case the admin user already
exists. You can ignore this warning or delete the volume before trying again.
