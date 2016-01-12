# Keycloak Docker image

Example Dockerfile with Keycloak server.

## Usage

To boot in standalone mode

    docker run jboss/keycloak

Once it boots, you can login to the admin console using admin/admin for the first login.

## Creating admin account

By default there is no admin user created so you won't be able to login to the admin console. To create an admin account you need to either use port forward so you can access the Keycloak server from localhost or use environment variables to pass in an initial username and password.

To access the server from localhost start the server with:

    docker run -p 8080:8080 jboss/keycloak

Then open [http://localhost:8080/auth](http://localhost:8080/auth) and fill in the form.

Alternatively pass in the username and password as environment variables by starting the server with:

    docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> jboss/keycloak

### Specify log level

When starting the Keycloak instance you can pass a number an environment variables to set log level for Keycloak, for example:

    docker run -e KEYCLOAK_LOGLEVEL=DEBUG jboss/keycloak

## Other details

This image extends the [`jboss/base-jdk`](https://github.com/JBoss-Dockerfiles/base-jdk) image which adds the OpenJDK distribution on top of the [`jboss/base`](https://github.com/JBoss-Dockerfiles/base) image. Please refer to the README.md for selected images for more info.
