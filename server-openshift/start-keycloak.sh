#!/bin/bash

exec /opt/jboss/docker-entrypoint.sh "$@"
exit $?
