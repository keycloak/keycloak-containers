# Keycloak Auth Server Docker image with Examples

This image prepares a basic Keycloak Auth Server and deploys the examples.

## Usage

To boot in standalone mode

    docker run jboss/keycloak-examples

Domain mode is not supported on this version, as this image ships with a custom standalone.xml file. 

Once it boots, you can login using admin/admin for the first login on the [Auth server](http://localhost:8080/auth/admin/) or as bburke@redhat.com/password on the [Customer Portal sample application](http://localhost:8080/customer-portal/customers/view.jsp) 

You can also log on to the [Widlfly console](http://localhost:9990/console/) using admin/admin as login/password. 

## Other details

This image inherits from the main [Keycloak Auth Server image](https://registry.hub.docker.com/u/jboss/keycloak/) and deploys the examples, including the test realm used by them. 

You should not inherit from this image, as it includes a realm that is intended only for testing. If you want to reuse the bits from this image, use the [keycloak image](https://registry.hub.docker.com/u/jboss/keycloak/). 
