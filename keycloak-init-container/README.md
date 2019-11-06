# Keycloak / RHSSO Extensions Init Container

This image is used by the [Keycloak Operator](https://github.com/keycloak/keycloak-operator) to automatically download and install [extensions](https://www.keycloak.org/extensions.html).

## Building

To build and push the image run:

```sh
$ make image/build
$ make image/push
```
