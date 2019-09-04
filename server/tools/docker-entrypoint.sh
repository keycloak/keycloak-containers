#!/bin/bash

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
    local var="$1"
    local fileVar="${var}_FILE"
    local def="${2:-}"
    if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
        echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
        exit 1
    fi
    local val="$def"
    if [ "${!var:-}" ]; then
        val="${!var}"
    elif [ "${!fileVar:-}" ]; then
        val="$(< "${!fileVar}")"
    fi

    if [ "$val" ]; then
        export "$var"="$val"
    fi

    unset "$fileVar"
}

##################
# Add admin user #
##################

file_env 'KEYCLOAK_USER'
file_env 'KEYCLOAK_PASSWORD'

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    /opt/jboss/keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

############
# Hostname #
############

if [ "$KEYCLOAK_HOSTNAME" != "" ]; then
    SYS_PROPS="-Dkeycloak.hostname.provider=fixed -Dkeycloak.hostname.fixed.hostname=$KEYCLOAK_HOSTNAME"

    if [ "$KEYCLOAK_HTTP_PORT" != "" ]; then
        SYS_PROPS+=" -Dkeycloak.hostname.fixed.httpPort=$KEYCLOAK_HTTP_PORT"
    fi

    if [ "$KEYCLOAK_HTTPS_PORT" != "" ]; then
        SYS_PROPS+=" -Dkeycloak.hostname.fixed.httpsPort=$KEYCLOAK_HTTPS_PORT"
    fi

    if [ "$KEYCLOAK_ALWAYS_HTTPS" != "" ]; then
            SYS_PROPS+=" -Dkeycloak.hostname.fixed.alwaysHttps=$KEYCLOAK_ALWAYS_HTTPS"
    fi
fi

################
# Realm import #
################

if [ "$KEYCLOAK_IMPORT" ]; then
    SYS_PROPS+=" -Dkeycloak.import=$KEYCLOAK_IMPORT"
fi

########################
# JGroups bind options #
########################

if [ -z "$BIND" ]; then
    BIND=$(hostname --all-ip-addresses)
fi
if [ -z "$BIND_OPTS" ]; then
    for BIND_IP in $BIND
    do
        BIND_OPTS+=" -Djboss.bind.address=$BIND_IP -Djboss.bind.address.private=$BIND_IP "
    done
fi
SYS_PROPS+=" $BIND_OPTS"

#########################################
# Expose management console for metrics #
#########################################

if [ -n "$KEYCLOAK_STATISTICS" ] ; then 
    SYS_PROPS+=" -Djboss.bind.address.management=0.0.0.0"
fi

#################
# Configuration #
#################

# If the server configuration parameter is not present, append the HA profile.
if echo "$@" | egrep -v -- '-c |-c=|--server-config |--server-config='; then
    SYS_PROPS+=" -c=standalone-ha.xml"
fi

############
# DB setup #
############

file_env 'DB_USER'
file_env 'DB_PASSWORD'

# Lower case DB_VENDOR
DB_VENDOR=`echo $DB_VENDOR | tr A-Z a-z`

# Detect DB vendor from default host names
if [ "$DB_VENDOR" == "" ]; then
    if (getent hosts postgres &>/dev/null); then
        export DB_VENDOR="postgres"
    elif (getent hosts mysql &>/dev/null); then
        export DB_VENDOR="mysql"
    elif (getent hosts mariadb &>/dev/null); then
        export DB_VENDOR="mariadb"
    elif (getent hosts oracle &>/dev/null); then
        export DB_VENDOR="oracle"
    elif (getent hosts mssql &>/dev/null); then
        export DB_VENDOR="mssql"
    fi
fi

# Detect DB vendor from legacy `*_ADDR` environment variables
if [ "$DB_VENDOR" == "" ]; then
    if (printenv | grep '^POSTGRES_ADDR=' &>/dev/null); then
        export DB_VENDOR="postgres"
    elif (printenv | grep '^MYSQL_ADDR=' &>/dev/null); then
        export DB_VENDOR="mysql"
    elif (printenv | grep '^MARIADB_ADDR=' &>/dev/null); then
        export DB_VENDOR="mariadb"
    elif (printenv | grep '^ORACLE_ADDR=' &>/dev/null); then
        export DB_VENDOR="oracle"
    elif (printenv | grep '^MSSQL_ADDR=' &>/dev/null); then
        export DB_VENDOR="mssql"
    fi
fi

# Default to H2 if DB type not detected
if [ "$DB_VENDOR" == "" ]; then
    export DB_VENDOR="h2"
fi

# if the DB_VENDOR is postgres then append port to the DB_ADDR
function append_port_db_addr() {
  local db_host_regex='^[a-zA-Z0-9]([a-zA-Z0-9]|-|.)*:[0-9]{4,5}$'
  IFS=',' read -ra addresses <<< "$DB_ADDR"
  DB_ADDR=""
  for i in "${addresses[@]}"; do
    if [[ $i =~ $db_host_regex ]]; then
        DB_ADDR+=$i;
     else
        DB_ADDR+="${i}:${DB_PORT}";
     fi
        DB_ADDR+=","
  done
  DB_ADDR=$(echo $DB_ADDR | sed 's/.$//') # remove the last comma
}

# Set DB name
case "$DB_VENDOR" in
    postgres)
        DB_NAME="PostgreSQL"
        if [ -z "$DB_PORT" ] ; then DB_PORT="5432" ; fi
        append_port_db_addr
        ;;
    mysql)
        DB_NAME="MySQL";;
    mariadb)
        DB_NAME="MariaDB";;
    oracle)
        DB_NAME="Oracle";;
    h2)
        DB_NAME="Embedded H2";;
    mssql)
        DB_NAME="Microsoft SQL Server";;
    *)
        echo "Unknown DB vendor $DB_VENDOR"
        exit 1
esac

# Append '?' in the beggining of the string if JDBC_PARAMS value isn't empty
export JDBC_PARAMS=$(echo ${JDBC_PARAMS} | sed '/^$/! s/^/?/')

# Convert deprecated DB specific variables
function set_legacy_vars() {
  local suffixes=(ADDR DATABASE USER PASSWORD PORT)
  for suffix in "${suffixes[@]}"; do
    local varname="$1_$suffix"
    if [ ${!varname} ]; then
      echo WARNING: $varname variable name is DEPRECATED replace with DB_$suffix
      export DB_$suffix=${!varname}
    fi
  done
}
set_legacy_vars `echo $DB_VENDOR | tr a-z A-Z`

# Configure DB

echo "========================================================================="
echo ""
echo "  Using $DB_NAME database"
echo ""
echo "========================================================================="
echo ""

if [ "$DB_VENDOR" != "h2" ]; then
    /bin/sh /opt/jboss/tools/databases/change-database.sh $DB_VENDOR
fi

/opt/jboss/tools/x509.sh
/opt/jboss/tools/jgroups.sh
/opt/jboss/tools/statistics.sh
/opt/jboss/tools/autorun.sh

##################
# Start Keycloak #
##################

exec /opt/jboss/keycloak/bin/standalone.sh $SYS_PROPS $@
exit $?
