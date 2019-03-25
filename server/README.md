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

### Providing the username and password via files

By appending `_FILE` to the two environment variables used above (`KEYCLOAK_USER_FILE` and `KEYCLOAK_PASSWORD_FILE`),
the information can be provided via files instead of plain environment variable values.
The configuration and secret support in Docker Swarm is a perfect match for this use case. 

## Importing a realm

To create an admin account and import a previously exported realm run:

    docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> \
        -e KEYCLOAK_IMPORT=/tmp/example-realm.json -v /tmp/example-realm.json:/tmp/example-realm.json jboss/keycloak



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
- `DB_SCHEMA`: Specify name of the schema to use for DB that support schemas (optional, default is public on Postgres).
- `DB_USER`: Specify user to use to authenticate to the database (optional, default is `keycloak`).
- `DB_USER_FILE`: Specify user to authenticate to the database via file input (alternative to `DB_USER`).
- `DB_PASSWORD`: Specify user's password to use to authenticate to the database (optional, default is `password`).
- `DB_PASSWORD_FILE`: Specify user's password to use to authenticate to the database via file input (alternative to `DB_PASSWORD`).

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

* WildFly `.cli` [scripts](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface)

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

## Clustering

Replacing the default discovery protocols (`PING` for the UDP stack and `MPING` for the TCP one) can be achieved by defining
two additional environment variables:

- `JGROUPS_DISCOVERY_PROTOCOL` - name of the discovery protocol, e.g. DNS_PING
- `JGROUPS_DISCOVERY_PROPERTIES` - an optional parameter with the discovery protocol properties in the following format:
`PROP1=FOO,PROP2=BAR`

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


## Misc

### Specify hostname

To set a fixed hostname for Keycloak use the following environment value. This is highly recommended in production.

* `KEYCLOAK_HOSTNAME`: Specify hostname for Keycloak (optional, default is retrieved from request, recommended in production)

### Specify ports

To set fixed ports for http and https for Keycloak use the following environment values.

* `KEYCLOAK_HTTP_PORT`: Specify the http port for Keycloak (optional, default is retrieved from request)
* `KEYCLOAK_HTTPS_PORT`: Specify the https port for Keycloak (optional, default is retrieved from request)

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



### Setting up TLS(SSL)

Keycloak image allows you to specify both a private key and a certificate for serving HTTPS. In that case you need to provide two files:

* tls.crt - a certificate
* tls.key - a private key

Those files need to be mounted in `/etc/x509/https` directory. The image will automatically convert them into a Java keystore and reconfigure Wildfly to use it.

It is also possible to provide an additional CA bundle and setup Mutual TLS this way. In that case, you need to mount an additional volume to the image
containing a `crt` file and point `X509_CA_BUNDLE` environmental variable to that file.

NOTE: See `openshift-examples` directory for an out of the box setup for OpenShift.



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
