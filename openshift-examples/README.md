# Keycloak OpenShift examples

This directory contains a set of predefined OpenShift templates for running Keycloak, including:

* `keycloak-https.json` - A standard template for most of the use cases. It uses both HTTP and HTTPS routes.
* `keycloak-https-mutual-tls.json` - A similar template to the one above but uses OpenShift generated certificates to setup Mutual TLS.
