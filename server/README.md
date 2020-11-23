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

    docker exec <CONTAINER> /opt/jboss/keycloak/bin/add-user-keycloak.sh -u <USERNAME> -p <PASSWORD>

Then restarting the container:

    docker restart <CONTAINER>

### Providing the username and password via files

By appending `_FILE` to the two environment variables used above (`KEYCLOAK_USER_FILE` and `KEYCLOAK_PASSWORD_FILE`),
the information can be provided via files instead of plain environment variable values.
The configuration and secret support in Docker Swarm is a perfect match for this use case. 

## Importing a realm

To create an admin account and import a previously exported realm run:

    docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> \
        -e KEYCLOAK_IMPORT=/tmp/example-realm.json -v /tmp/example-realm.json:/tmp/example-realm.json jboss/keycloak

## Exporting a realm

If you want to export a realm that you have created/updated, on an instance of Keycloak running within a docker container. You'll need to ensure the container running Keycloak has a volume mapped. 
For example you can start Keycloak via docker with: 

	docker run -d -p 8180:8080 -e KEYCLOAK_USER=admin -e \
	KEYCLOAK_PASSWORD=admin -v $(pwd):/tmp --name kc \
	jboss/keycloak

You can then get the export from this instance by running (notice we use `-Djboss.socket.binding.port-offset=100` so that the export runs on a different port than Keycloak itself):

	docker exec -it kc /opt/jboss/keycloak/bin/standalone.sh \
	-Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export \
	-Dkeycloak.migration.provider=singleFile \
	-Dkeycloak.migration.realmName=my_realm \
	-Dkeycloak.migration.usersExportStrategy=REALM_FILE \
	-Dkeycloak.migration.file=/tmp/my_realm.json

There is more detail on the options you can user for export functionality on Keycloak's main documentation site at: [Export and Import](https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import)


## Database

This image supports using H2, MySQL, PostgreSQL, MariaDB, Oracle or Microsoft SQL Server as the database.

You can specify the DB vendor directly with the `DB_VENDOR` environment variable. Supported values are:

- `h2` for the embedded H2 database,
- `postgres` for the Postgres database,
- `mysql` for the MySql database.
- `mariadb` for the MariaDB database.
- `oracle` for the Oracle database.
- `mssql` for the Microsoft SQL Server database.

If `DB_VENDOR` value is not specified the image will try to detect the DB vendor based on the following logic:

- Is the default host name for the DB set using `getent hosts` (`postgres`, `mysql`, `mariadb`, `oracle`, `mssql`). This works if you are
using a user defined network and the default names as specified below.
- Is there a DB specific `_ADDR` environment variable set (`POSTGRES_ADDR`, `MYSQL_ADDR`, `MARIADB_ADDR`, `ORACLE_ADDR`). **Deprecated**

If the DB can't be detected it will default to the embedded H2 database.

### Environment variables

Generic variable names can be used to configure any Database type, defaults may vary depending on the Database.

- `DB_ADDR`: Specify hostname of the database (optional). For postgres only, you can provide a list of hostnames separated by
comma to failover alternative host. The hostname can be the host only or pair of host and port, as example host1,host2 or 
host1:5421,host2:5436 or host1,host2:5000. And keycloak will append DB_PORT (if specify) to the hosts without port, 
otherwise it will append the default port 5432, again to the address without port only.
- `DB_PORT`: Specify port of the database (optional, default is DB vendor default port)
- `DB_DATABASE`: Specify name of the database to use (optional, default is `keycloak`).
- `DB_SCHEMA`: Specify name of the schema to use for DB that support schemas (optional, default is public on Postgres).
- `DB_USER`: Specify user to use to authenticate to the database (optional, default is ``).
- `DB_USER_FILE`: Specify user to authenticate to the database via file input (alternative to `DB_USER`).
- `DB_PASSWORD`: Specify user's password to use to authenticate to the database (optional, default is ``).
- `DB_PASSWORD_FILE`: Specify user's password to use to authenticate to the database via file input (alternative to `DB_PASSWORD`).

### MySQL Example

#### Create a user defined network

    docker network create keycloak-network

#### Start a MySQL instance

First start a MySQL instance using the MySQL docker image:

    docker run --name mysql -d --net keycloak-network -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password -e MYSQL_ROOT_PASSWORD=root_password mysql

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MySQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the MySQL instance to `mysql` you need to specify the `DB_ADDR` environment variable.

### PostgreSQL Example

#### Create a user defined network

    docker network create keycloak-network

#### Start a PostgreSQL instance

First start a PostgreSQL instance using the PostgreSQL docker image:

    docker run -d --name postgres --net keycloak-network -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password postgres

#### Start a Keycloak instance

Start a Keycloak instance and connect to the PostgreSQL instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak -e DB_USER=keycloak -e DB_PASSWORD=password

If you used a different name for the PostgreSQL instance to `postgres` you need to specify the `DB_ADDR` environment variable.

### MariaDB Example

#### Create a user defined network

    docker network create keycloak-network

#### Start a MariaDB instance

First start a MariaDB instance using the MariaDB docker image:

    docker run -d --name mariadb --net keycloak-network -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=keycloak -e MYSQL_USER=keycloak -e MYSQL_PASSWORD=password mariadb

#### Start a Keycloak instance

Start a Keycloak instance and connect to the MariaDB instance:

    docker run --name keycloak --net keycloak-network jboss/keycloak

If you used a different name for the MariaDB instance to `mariadb` you need to specify the `DB_ADDR` environment variable.

### Oracle Example

Using Keycloak with an Oracle database requires a JDBC driver to be provided to the Docker image.

#### Download Oracle JDBC driver

1. Download the required [JDBC driver](https://www.oracle.com/technetwork/database/application-development/jdbc/downloads) for your version of Oracle.

2. **Important:** rename the file to `ojdbc.jar`

#### Create a user defined network

    docker network create keycloak-network

#### Start an Oracle instance

If you already have an Oracle database running this step can be skipped, otherwise here we will start a new Docker container using the [carloscastillo/rgt-oracle-xe-11g](https://hub.docker.com/r/carloscastillo/rgt-oracle-xe-11g) image on Docker Hub:

    docker run -d --name oracle --net keycloak-network -p 1521:1521 carloscastillo/rgt-oracle-xe-11g

#### Start a Keycloak instance

Start a Keycloak instance and connect to the Oracle instance:

    docker run -d --name keycloak --net keycloak-network -p 8080:8080 -v /path/to/jdbc/driver:/opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main/driver jboss/keycloak

One of the key pieces here is that we are mounting a volume from the location of the JDBC driver, so ensure that the path is correct. The mounted volume should contain the file named `ojdbc.jar`.

Alternately, the JDBC file can be copied into the container using the `docker cp` command:

    docker cp ojdbc.jar jboss/keycloak:/opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main/driver/ojdbc.jar

If you used a name for the Oracle instance other than `oracle` you need to specify the `DB_ADDR` environment variable.

**Default environment settings:**

- `DB_ADDR`: `oracle`
- `DB_PORT`: `1521`
- `DB_DATABASE`: `XE`
- `DB_USER`: `SYSTEM`
- `DB_PASSWORD`: `oracle`

### Microsoft SQL Server Example

#### Create a user defined network

    docker network create keycloak-network

#### Start a Microsoft SQL Server instance

First start a Microsoft SQL Server instance using the Microsoft SQL Server docker image:

    docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password!23' -d --name mssql --net keycloak-network mcr.microsoft.com/mssql/server

Unlike some of the other supported databases, like PostgreSQL, MySQL or MariaDB, SQL Server
does not support creating the initial database through an environment variable.
Consequently, the database must be created for Keycloak some other way. In
principle, this can be done by creating an image that runs until it can create
the database.

    docker run -d --name mssql-scripts --net keycloak-network mcr.microsoft.com/mssql-tools /bin/bash -c 'until /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "Password!23" -Q "create database Keycloak"; do sleep 5; done'

This image will repeatedly attempt to create the database and terminate once the
database is in place.

#### Start a Keycloak instance

Start a Keycloak instance and connect to the Microsoft SQL Server instance:

    docker run --name keycloak --net keycloak-network -p 8080:8080 -e DB_VENDOR=mssql -e DB_USER=sa -e DB_PASSWORD=Password!23 -e DB_ADDR=mssql -e DB_DATABASE=Keycloak -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak

If you used a different name for the Microsoft SQL Server instance to `mssql` you need to specify the `DB_ADDR` environment variable.

Please see `docker-compose-examples/keycloak-mssql.yml` for a full example.

### Specify JDBC parameters

When connecting Keycloak instance to the database, you can specify the JDBC parameters. Details on JDBC parameters can be
found here:

* [PostgreSQL](https://jdbc.postgresql.org/documentation/head/connect.html)
* [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-configuration-properties.html)
* [MariaDB](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#optional-url-parameters)
* [Oracle](https://docs.oracle.com/en/database/oracle/oracle-database/18/jjdbc/data-sources-and-URLs.html)
* [Microsoft SQL Server](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-2017)

#### Example

    docker run --name keycloak -e DB_VENDOR=postgres -e JDBC_PARAMS='connectTimeout=30' jboss/keycloak



## Adding a custom theme

To add a custom theme extend the Keycloak image add the theme to the `/opt/jboss/keycloak/themes` directory.

To set the welcome theme, use the following environment value :

* `KEYCLOAK_WELCOME_THEME`: Specify the theme to use for welcome page (must be non empty and must match an existing theme name)

To set your custom theme as the default global theme, use the following environment value :
* `KEYCLOAK_DEFAULT_THEME`: Specify the theme to use as the default global theme (must match an existing theme name, if empty will use keycloak)


## Adding a custom provider

To add a custom provider extend the Keycloak image and add the provider to the `/opt/jboss/keycloak/standalone/deployments/`
directory.

## Running custom scripts on startup

**Warning**: Custom scripts have no guarantees. The directory layout within the image may change at any time.

To run custom scripts on container startup place a file in the `/opt/jboss/startup-scripts` directory.

Two types of scripts are supported:

* WildFly `.cli` [scripts](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface). In most of the cases, the scripts should operate in [offline mode](https://wildfly.org/news/tags/CLI/) (using `embed-server` instruction). It's also worth to mention, that by default, keycloak uses `standalone-ha.xml` configuration (unless other server configuration is specified).

* Any executable (`chmod +x`) script

Scripts are ran in alphabetical order.

### Adding custom script using Dockerfile

A custom script can be added by creating your own `Dockerfile`:

```
FROM keycloak
COPY custom-scripts/ /opt/jboss/startup-scripts/
```

### Adding custom script using volumes

A single custom script can be added as a volume: `docker run -v /some/dir/my-script.cli:/opt/jboss/startup-scripts/my-script.cli`
Or you can volume the entire directory to supply a directory of scripts.

Note that when combining the approach of extending the image and `volume`ing the entire directory, the volume will override
all scripts shipped in the image.

## Start a Keycloak instance with custom command-line options

Additional server startup options (extension of JAVA_OPTS) can be configured using the `JAVA_OPTS_APPEND` environment variable. An use-case for this is to enable extra [profile features](https://www.keycloak.org/docs/latest/server_installation/#profiles).

### Example

Enable _upload_script_ profile:

    docker run -e JAVA_OPTS_APPEND="-Dkeycloak.profile.feature.upload_script=enabled" jboss/keycloak


## Clustering

Replacing the default discovery protocols (`PING` for the UDP stack and `MPING` for the TCP one) can be achieved by defining
some additional environment variables:

- `JGROUPS_DISCOVERY_PROTOCOL` - name of the discovery protocol, e.g. dns.DNS_PING
- `JGROUPS_DISCOVERY_PROPERTIES` - an optional parameter with the discovery protocol properties in the following format:
`PROP1=FOO,PROP2=BAR`
- `JGROUPS_DISCOVERY_PROPERTIES_DIRECT` - an optional parameter with the discovery protocol properties in jboss CLI format:
`{PROP1=>FOO,PROP2=>BAR}`
- `JGROUPS_TRANSPORT_STACK` - an optional name of the transport stack to use `udp` or `tcp` are possible values. Default: `tcp` 

**Warning**: It's an error to set both JGROUPS_DISCOVERY_PROPERTIES and JGROUPS_DISCOVERY_PROPERTIES_DIRECT. No more than one of them may be set.

The bootstrap script will detect the variables and adjust the `standalone-ha.xml` configuration based on them.

### PING example

The `PING` discovery protocol is used by default in `udp` stack (which is used by default in `standalone-ha.xml`).
Since the Keycloak image runs in clustered mode by default, all you need to do is to run it:

    docker run jboss/keycloak

If you two instances of it locally, you will notice that they form a cluster.

### OpenShift example with dns.DNS_PING

Clustering for OpenShift can be achieved by using either `dns.DNS_PING` and a governing service or `kubernetes.KUBE_PING`.
The latter requires `view` permissions which are not granted by default, so we suggest using `dns.DNS_PING`.

#### Using the template

The full example has been put into the `openshift-examples` directory. Just run one of the two templates. Here's an example:

    oc new-app -p NAMESPACE=`oc project -q` -f keycloak-https.json

#### What happen under the hood?

Both OpenShift templates use `dns.DNS_PING` under the hood. Here's an equivalent docker-based command that OpenShift
is invoking:

    docker run \
    -e JGROUPS_DISCOVERY_PROTOCOL=dns.DNS_PING -e \
    JGROUPS_DISCOVERY_PROPERTIES=dns_query=keycloak.myproject.svc.cluster.local \
    jboss/keycloak

In this example the `dns.DNS_PING` that queries `A` records from the DNS Server with the following query
`keycloak.myproject.svc.cluster.local`.

### Adding custom discovery protocols

The default mechanism for adding discovery protocols should cover most of the cases. However, sometimes
you need to add more protocols at the same time, or adjust other protocols. In such cases you will need
your own cli file placed in `/opt/jboss/tools/cli/jgroups/discovery`. The `JGROUPS_DISCOVERY_PROTOCOL` need to
match your cli file, for example:

    JGROUPS_DISCOVERY_PROTOCOL=custom_protocol
    /opt/jboss/tools/cli/jgroups/discovery/custom_protocol.cli

This can be easily achieved by extending the Keycloak image and adding just one file.

Of course, we highly encourage you to contribute your custom scripts back to the community image!

### Replication and Fail-Over

By default Keycloak does NOT replicate caches like sessions, authenticationSessions, offlineSessions, loginFailures and a few others (See Eviction and Expiration for more details), which are configured as distributed caches when using a clustered setup. Entries are not replicated to every single node, but instead one or more nodes is chosen as an owner of that data. If a node is not the owner of a specific cache entry it queries the cluster to obtain it. What this means for failover is that if all the nodes that own a piece of data go down, that data is lost forever. By default, Keycloak only specifies one owner for data. So if that one node goes down that data is lost. This usually means that users will be logged out and will have to login again. For more on this subject see [Keycloak Documentation](https://www.keycloak.org/docs/latest/server_installation/#_replication)

#### Specify destributed-cache owners

* `CACHE_OWNERS_COUNT`: Specify the number of distributed-cache owners (default is 1)

AuthenticationSessions will not be replicated by setting CACHE_OWNERS_COUNT>1 as this is usually not required/intended (https://www.keycloak.org/docs/latest/server_installation/#cache)
To enable replication of AuthenticationSessions as well use:

 * `CACHE_OWNERS_AUTH_SESSIONS_COUNT`: Specify the number of replicas for AuthenticationSessions


## Vault

### Setup Kubernetes / OpenShift files plaintext vault

Keycloak supports vault implementation for [Kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/). To use files plaintext vault in Docker container mount secret files to `$JBOSS_HOME/secrets` directory. This can be used to consume secrets from Kubernetes / OpenShift cluster. 


## Misc

### Specify frontend base URL

To set a fixed base URL for frontend requests use the following environment value (this is highly recommended in production):

* `KEYCLOAK_FRONTEND_URL`: Specify base URL for Keycloak (optional, default is retrieved from request)

### Specify log level

There are two environment variables available to control the log level for Keycloak:

* `KEYCLOAK_LOGLEVEL`: Specify log level for Keycloak (optional, default is `INFO`)
* `ROOT_LOGLEVEL`: Specify log level for underlying container (optional, default is `INFO`)

Supported log levels are `ALL`, `DEBUG`, `ERROR`, `FATAL`, `INFO`, `OFF`, `TRACE` and `WARN`.

Log level can also be changed at runtime, for example (assuming docker exec access):

    ./keycloak/bin/jboss-cli.sh --connect --command='/subsystem=logging/console-handler=CONSOLE:change-log-level(level=DEBUG)'
    ./keycloak/bin/jboss-cli.sh --connect --command='/subsystem=logging/root-logger=ROOT:change-root-log-level(level=DEBUG)'
    ./keycloak/bin/jboss-cli.sh --connect --command='/subsystem=logging/logger=org.keycloak:write-attribute(name=level,value=DEBUG)'

### Enabling proxy address forwarding

When running Keycloak behind a proxy, you will need to enable proxy address forwarding.

    docker run -e PROXY_ADDRESS_FORWARDING=true jboss/keycloak



### Setting up TLS(SSL)

Keycloak image allows you to specify both a private key and a certificate for serving HTTPS over port 8443. In that case you need to provide two files:

* tls.crt - a certificate
* tls.key - a private key

Those files need to be mounted in `/etc/x509/https` directory. The image will automatically convert them into a Java keystore and reconfigure Wildfly to use it.
NOTE: When using volume mounts in containers the files will be mounted in the container as owned by root, as the default permission on the keyfile will most likely be 700 it will result in an empty keystore.
You will either have to make the key world readable or extend the image to add the keys with the appropriate owner.

It is also possible to provide an additional CA bundle and setup Mutual TLS this way. In that case, you need to mount an additional volume (or multiple volumes) to the image. These volumes should contain all necessary `crt` files. The final step is to configure the `X509_CA_BUNDLE` environment variable to contain a list of the locations of the various CA certificate bundle files specified before, separated by space (` `). In case of an OpenShift environment, that could be `/var/run/secrets/kubernetes.io/serviceaccount/service-ca.crt /var/run/secrets/kubernetes.io/serviceaccount/ca.crt`.

NOTE: See `openshift-examples` directory for an out of the box setup for OpenShift.

### Enable some metrics

Keycloak image can collect some statistics for various subsystem which will then be available in the management console and the `/metrics` endpoint.
You can enable it with the KEYCLOAK_STATISTICS environment variables which take a list of statistics to enable:
* `db` for the `datasources` subsystem
* `http` for the `undertow` subsystem
* `jgroups` for the `jgroups` subsystem

for instance, `KEYCLOAK_STATISTICS=db,http` will enable statistics for the datasources and undertow subsystem.

The special value `all` enables all statistics.

Once enabled, you should see the metrics values changing on the `/metrics` endpoint for the management endpoint.

## Debugging

To attach a Java debugger, set these environment variables:

* `DEBUG=true`: Now the `DEBUG_PORT` will listen
* `DEBUG_PORT='*:8787'`: The port that Keycloak listens to for connections from a debugger.
   By default, [JDK 9+](https://bugs.openjdk.java.net/browse/JDK-8175050) only listens on localhost, so you'll want the `*:8787` syntax to make it listen for connections
   from all hosts. Remember to shell-quote the `*` character though, especially under `zsh`.

In addition to setting `DEBUG=true` and `DEBUG_PORT='*:8787'`, you'll
want to publish the debug port as well, as in:

    docker run -e DEBUG=true -e DEBUG_PORT='*:8787' -p 8080:8080 -p '8787:8787' jboss/keycloak

## Other details

This image extends the [`registry.access.redhat.com/ubi8-minimal`](https://access.redhat.com/containers/?tab=overview#/registry.access.redhat.com/ubi8-minimal) base image and adds Keycloak and its dependencies on top of it.


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

## Docker start and stop

This image supports `docker start` and `docker stop` commands, but will not detect any changes in configuration.
If you would like to reconfigure Keycloak, you must create a new container.
