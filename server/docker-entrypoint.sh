#!/bin/bash

# Add admin user
if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi


# Support deprecated '--link'

if [ "$DB_PORT_3306_TCP_ADDR" != "" ]; then
    export DB_ADDR="$DB_PORT_3306_TCP_ADDR"
fi

if [ "$DB_PORT_3306_TCP_PORT" != "" ]; then
    export DB_PORT="$DB_PORT_3306_TCP_PORT"
fi

if [ "$DB_PORT_5432_TCP_ADDR" != "" ]; then
    export DB_ADDR="$DB_PORT_5432_TCP_ADDR"
fi

if [ "$DB_PORT_5432_TCP_PORT" != "" ]; then
    export DB_PORT="$DB_PORT_5432_TCP_PORT"
fi

if [ "$DB_PORT_3306_TCP_ADDR" != "" ]; then
    export DB_ADDR="$DB_PORT_3306_TCP_ADDR"
fi

if [ "$DB_PORT_3306_TCP_PORT" != "" ]; then
    export DB_PORT="$DB_PORT_3306_TCP_PORT"
fi

# Detect DB vendor
if [ "$DB_VENDOR" == "POSTGRES" ]; then
    export DB_VENDOR="postgres"
    DB_NAME="PostgreSQL"
elif [ "$DB_VENDOR" == "MYSQL" ]; then
    export DB_VENDOR="mysql"
    DB_NAME="MySQL"
elif [ "$DB_VENDOR" == "MARIADB" ]; then
    export DB_VENDOR="mariadb"
    DB_NAME="MariaDB"
elif [ "$DB_VENDOR" == "MSSQL" ]; then
    export DB_VENDOR="mssql"
    DB_NAME="MSSQL"
elif [ "$DB_VENDOR" == "H2" ]; then
    export DB_VENDOR="h2"
    DB_NAME="embedded H2"
else
    echo "Missing mandatory environment variable DB_VENDOR. Allowed values are [H2, POSTGRES, MYSQL, MARIADB]"
    exit 1
fi

# Append '?' in the beggining of the string if JDBC_PARAMS value isn't empty
export JDBC_PARAMS=$(echo ${JDBC_PARAMS} | sed '/^$/! s/^/?/')

###
# Keep for backward compatibility
###
function set_legacy_vars() {
  local suffixes=(ADDR DATABASE USER PASSWORD)
  for suffix in "${suffixes[@]}"; do
    local varname="$1_$suffix"
    if [ ${!varname} ]; then
      echo WARNING: $varname variable name is DEPRECATED consider using DB_$suffix
      export DB_$suffix=${!varname}
    fi
  done
}

set_legacy_vars $DB_VENDOR
###

# Configure DB

echo "========================================================================="
echo ""
echo "  Using $DB_NAME database"
echo ""
echo "========================================================================="
echo ""

if [ "$DB_VENDOR" != "h2" ]; then
    /bin/sh /opt/jboss/keycloak/bin/change-database.sh $DB_VENDOR
fi



# Start Keycloak

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?
