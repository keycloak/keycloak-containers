# Keycloak Auth Server Docker image

This image prepares a basic Keycloak Auth Server. The right place to start playing around with Keycloak.

## Usage

To boot in standalone mode

    docker run -it -p 8080:8080 -p 9090:9090 jboss/keycloak

Once it boots, you can login using admin/admin for the first login. 

## Other details

This image inherits from the [keycloak-adapter-wildfly](https://registry.hub.docker.com/u/jboss/keycloak-adapter-wildfly/) image, adding the required bits to deploy a Keycloak Authentication Server. 

Note that you might want to extend the image to make it use a production-ready database and to setup a Wildfly admin password, as well as to setup SSL and other production-related changes.
