#!/bin/bash

./opt/jboss/keycloak/add-admin.sh

./opt/jboss/keycloak/add-datasource.sh

# Start Keycloak

exec /opt/jboss/keycloak/bin/standalone.sh $@

exit $?
