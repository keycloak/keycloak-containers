#!/usr/bin/env bash

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    /opt/jboss/keycloak-demo/keycloak/bin/add-user-keycloak.sh -u $KEYCLOAK_USER -p $KEYCLOAK_PASSWORD >/dev/null
fi

/opt/jboss/keycloak-demo/keycloak/bin/standalone.sh $@