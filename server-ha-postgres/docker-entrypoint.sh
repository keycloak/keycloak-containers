#!/bin/bash

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

export HOSTNAME_IP=$(hostname -i)
export HOSTNAME_IP_ALL=$(hostname --all-ip-addresses)
echo "hostname -i returned: $HOSTNAME_IP, -I returned: $HOSTNAME_IP_ALL"

exec /opt/jboss/keycloak/bin/standalone.sh -Djboss.bind.address.private=$HOSTNAME_IP $@
exit $?
