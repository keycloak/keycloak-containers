#!/bin/bash
set -eou pipefail

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
    local var="$1"
    local CONFIG_MARKER_FILE="${var}_FILE"
    local def="${2:-}"
    if [[ ${!var:-} && ${!CONFIG_MARKER_FILE:-} ]]; then
        echo >&2 "error: both $var and $CONFIG_MARKER_FILE are set (but are exclusive)"
        exit 1
    fi
    local val="$def"
    if [[ ${!var:-} ]]; then
        val="${!var}"
    elif [[ ${!CONFIG_MARKER_FILE:-} ]]; then
        val="$(< "${!CONFIG_MARKER_FILE}")"
    fi

    if [[ -n $val ]]; then
        export "$var"="$val"
    fi

    unset "$CONFIG_MARKER_FILE"
}

##############################
# Set admin user credentials #
##############################

file_env 'KEYCLOAK_ADMIN'
file_env 'KEYCLOAK_ADMIN_PASSWORD'

##################
# Start Keycloak #
##################

exec /opt/keycloak/bin/kc.sh $@

exit $?
