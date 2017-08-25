#!/bin/bash

/bin/sh /opt/jboss/keycloak/databases/postgres/changeDatabase.sh
exec /opt/jboss/docker-entrypoint.sh "$@"
exit $?
