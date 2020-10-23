# Keycloak.X Docker Image

The `Dockerfile` for Keycloak.X Docker Image.

See the `Build` section for more details on how to build the image.

Once built, you can run the server in the same manner as when using the Keycloak.X distribution by passing any command-line argument:

    docker run --name keycloak -p 8080:8080 \
           -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=change_me \
           IMAGE[:TAG] \
           start-dev
           
## Extending the Image

To customize the base image, create a new `Dockerfile` similar to following:

```
FROM quay.io/keycloak/keycloak-x

WORKDIR /opt/jboss/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
```

In the example above, you are basically creating a new image `FROM` this image and adding a Java Keystore to configure HTTPS using a self-signed certificate (only for example purposes, never do that for production).

As another example, you can install any custom provider you may have (include themes within a JAR file) as follows:

```
FROM quay.io/keycloak/keycloak-x

COPY my-providers/ /opt/jboss/keycloak/providers/

WORKDIR /opt/jboss/keycloak

RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore

# Run the config command to install custom providers
RUN ./bin/kc.sh config
```

In the example above, any JAR files within the directory `my-providers` will be copied to the image's `/opt/jboss/keycloak/providers` directory. Then the `config` command is executed to install the custom providers.

For last, you can configure the server using any configuration option available as follows:

```
FROM quay.io/keycloak/keycloak-x

COPY my-providers/ /opt/jboss/keycloak/providers/

WORKDIR /opt/jboss/keycloak

RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore

RUN ./bin/kc.sh config --db=postgres --db-url=jdbc:postgresql://$DB_HOST/keycloak --db-username=keycloak --db-password=password
```

In the example above, the configuration is being set to use a PostgreSQL database.

NOTE: Note that we are using separated `RUN` steps for illustrative purposes, ideally you should reduce the number of layers and execute both steps in a single one.

## Auto-Configuration

Given the immutability of containers, you can use the `--auto-config` option in order to apply any configuration when running a new container. Once the container is created, subsequent restarts will never go through the configuration phase again but just start the server with the configuration previously defined.

    docker run --name keycloak -p 8080:8080 \
           -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=change_me \
           IMAGE[:TAG] \
           --auto-config --db=postgres -Dkc.db.url.host=<DB_HOST> --db-username=keycloak --db-password=change_me --http-enabled=true

The command above should be enough to run a server using a PostgreSQL database listening on a given `DB_HOST`.

The recommended approach should be to create your own image from this one and configure it accordingly to your needs. The `--auto-config` is intended for helping to get a running server with different options without having to create your own image, with the cost that every time you run a new container, the config step will run and your container will take longer to start.

However, the `--auto-config` option should help when trying out Keycloak and for development purposes.

## Build

It is possible to download the Keycloak distribution from a URL:

    docker build --build-arg KEYCLOAK_DIST=http://<HOST>:<PORT>/keycloak.x-<VERSION>.tar.gz -t <TAG> .

For Keycloak built locally you need to first build the distribution then serve it with a web browser. For example use Python HTTP Server:

    cd $KEYCLOAK_SOURCE/distribution/server-x/target
    python -m http.server 8180