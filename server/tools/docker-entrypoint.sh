#!/bin/bash

##################
# Add admin user #
##################

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    /opt/jboss/keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

############
# Hostname #
############

if [ "$KEYCLOAK_HOSTNAME" != "" ]; then
    SYS_PROPS="-Dkeycloak.hostname.provider=fixed -Dkeycloak.hostname.fixed.hostname=$KEYCLOAK_HOSTNAME"
fi

############
# DB setup #
############

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
    elif (printenv | grep '^MSSQL_ADDR=' &>/dev/null); then
        export DB_VENDOR="mssql"
    fi
fi

# Default to H2 if DB type not detected
if [ "$DB_VENDOR" == "" ]; then
    export DB_VENDOR="h2"
fi

# Set DB name
case "$DB_VENDOR" in
    postgres)
        DB_NAME="PostgreSQL";;
    mysql)
        DB_NAME="MySQL";;
    mariadb)
        DB_NAME="MariaDB";;
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

##################
# Start Keycloak #
##################

exec /opt/jboss/keycloak/bin/standalone.sh $SYS_PROPS $@
exit $?
