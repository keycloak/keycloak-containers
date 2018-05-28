#!/bin/bash

./opt/jboss/add-admin.sh

./opt/jboss/add-datasource.sh

# Start Keycloak

HOST_IP=$(hostname -i)

exec /opt/jboss/keycloak/bin/standalone.sh -bprivate ${HOST_IP} $@

exit $?
 
