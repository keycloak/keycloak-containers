# Keycloak SAML + OIDC Wildfly Adapters

This image contains Wildfly with the required bits to deploy an application that would be protected by the Keycloak subsystem, including:

- Keycloak Wildfly Extension
- Keycloak SAML Wildfly Extension
- Keycloak Wildfly Subsystem
- Keycloak SAML Wildfly Subsystem
- Changes to the standalone.xml , to include both the extension and the subsystem, as well as the security-domain for Keycloak.

## Usage

To boot in standalone mode

    docker run jboss/keycloak-adapter-wildfly

## Other details

This image is intended to be extended by you, to include your application to it. Without it, this image is just a Wildfly image with an extra sauce.

Note that only the standalone mode is configured. If your application needs to work on domain mode as well, changes to the domain.xml similar to the ones applies to the standalone are required.
