#!/bin/bash

/bin/sh /opt/jboss/keycloak/databases/mysql/changeDatabase.sh
exec /opt/jboss/docker-entrypoint.sh "$@"
exit $?
