# Keycloak Docker image

Example Dockerfile with Keycloak server.

## Usage

To boot in standalone mode

    docker run -p 8080:8080 jboss/keycloak

Once it boots, you can login to the admin console using admin/admin for the first login.

### Specify log level

When starting the Keycloak instance you can pass a number an environment variables to set log level for Keycloak, for example:

    docker run -e KEYCLOAK_LOGLEVEL=DEBUG jboss/keycloak

## Other details

This image extends the [`jboss/base-jdk:7`](https://github.com/JBoss-Dockerfiles/base-jdk/tree/jdk7) image which adds the OpenJDK distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md for selected images for more info.
