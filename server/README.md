# Keycloak Docker image

Example Dockerfile with Keycloak server.

## Usage

To boot in standalone mode

    docker run -it -p 8080:8080 -p 9090:9090 jboss/keycloak

Once it boots, you can login to the admin console using admin/admin for the first login. 

## Other details

This image extends the [`jboss/base-jdk:7`](https://github.com/JBoss-Dockerfiles/base-jdk/tree/jdk7) image which adds the OpenJDK distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md for selected images for more info.
