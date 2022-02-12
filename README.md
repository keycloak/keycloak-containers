# Keycloak

Keycloak is an Open Source Identity and Access Management solution for modern Applications and Services.

This repository contains Docker images related to the legacy WildFly distribution of Keycloak.

- [keycloak](https://hub.docker.com/r/jboss/keycloak) Keycloak server


## Help and Documentation

* [Keycloak server image documentation](server/README.md)
* [Documentation](https://www.keycloak.org/documentation.html)
* [User Mailing List](https://groups.google.com/d/forum/keycloak-user) - Mailing list for help and general questions about Keycloak


## Reporting Security Vulnerabilities

If you've found a security vulnerability, please look at the [instructions on how to properly report it](http://www.keycloak.org/security.html).


## Reporting an issue

If you believe you have discovered a defect in Keycloak please open [an issue](https://github.com/keycloak/keycloak-containers/issues).
Please remember to provide a good summary, description as well as steps to reproduce the issue.


## Getting started

To run Keycloak, run:

    docker run quay.io/keycloak/keycloak

Or, to run the legacy WildFly distribution, run:

    docker run quay.io/keycloak/keycloak:legacy

For more details refer to the [container guide](https://www.keycloak.org/server/containers).
    
Or, for the legacy WildFly distribution refer to the [Keycloak server image documentation](server/README.md).


## Contributing

Before contributing to Keycloak please read our [contributing guidelines](CONTRIBUTING.md).


## Other Keycloak Projects

* [Keycloak](https://github.com/keycloak/keycloak) - Keycloak Server and Java adapters
* [Keycloak Documentation](https://github.com/keycloak/keycloak-documentation) - Documentation for Keycloak
* [Keycloak QuickStarts](https://github.com/keycloak/keycloak-quickstarts) - QuickStarts for getting started with Keycloak
* [Keycloak Docker](https://github.com/jboss-dockerfiles/keycloak) - Docker images for Keycloak
* [Keycloak Node.js Connect](https://github.com/keycloak/keycloak-nodejs-connect) - Node.js adapter for Keycloak
* [Keycloak Node.js Admin Client](https://github.com/keycloak/keycloak-nodejs-admin-client) - Node.js library for Keycloak Admin REST API


## License

* [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
