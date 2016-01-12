#!/bin/bash

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

/opt/jboss/keycloak/bin/standalone.sh $@
