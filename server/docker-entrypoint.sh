#!/bin/bash

# Add admin user
if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi


# Support deprecated '--link'

if [ "$MYSQL_PORT_3306_TCP_ADDR" != "" ]; then
    export MYSQL_ADDR="$MYSQL_PORT_3306_TCP_ADDR"
fi

if [ "$MYSQL_PORT_3306_TCP_PORT" != "" ]; then
    export MYSQL_PORT="$MYSQL_PORT_3306_TCP_PORT"
fi

if [ "$POSTGRES_PORT_5432_TCP_ADDR" != "" ]; then
    export POSTGRES_ADDR="$POSTGRES_PORT_5432_TCP_ADDR"
fi

if [ "$POSTGRES_PORT_5432_TCP_PORT" != "" ]; then
    export POSTGRES_PORT="$POSTGRES_PORT_5432_TCP_PORT"
fi

if [ "$MARIADB_PORT_3306_TCP_ADDR" != "" ]; then
    export MARIADB_ADDR="$MARIADB_PORT_3306_TCP_ADDR"
fi

if [ "$MARIADB_PORT_3306_TCP_PORT" != "" ]; then
    export MARIADB_PORT="$MARIADB_PORT_3306_TCP_PORT"
fi


# Detect DB vendor

if [ "$DB_VENDOR" == "POSTGRES" ]; then
    export DB_VENDOR="postgres"
elif [ "$DB_VENDOR" == "MYSQL" ]; then
      export DB_VENDOR="mysql"
elif [ "$DB_VENDOR" == "MARIADB" ]; then
      export DB_VENDOR="mariadb"
elif [ "$DB_VENDOR" == "H2" ]; then
      export DB_VENDOR="h2"
else
    if (printenv | grep '^POSTGRES_ADDR=' &>/dev/null); then
        export DB_VENDOR="postgres"
    elif (getent hosts postgres &>/dev/null); then
        export DB_VENDOR="postgres"
    elif (printenv | grep '^MYSQL_ADDR=' &>/dev/null); then
        export DB_VENDOR="mysql"    
    elif (getent hosts mysql &>/dev/null); then
        export DB_VENDOR="mysql"
    elif (printenv | grep '^MARIADB_ADDR=' &>/dev/null); then
        export DB_VENDOR="mariadb"            
    elif (getent hosts mariadb &>/dev/null); then
        export DB_VENDOR="mariadb"
    fi
fi

if [ "$DB_VENDOR" == "" ]; then
    export DB_VENDOR="h2"
fi

if [ "$DB_VENDOR" == "postgres" ]; then
    DB_NAME="PostgreSQL"
elif [ "$DB_VENDOR" == "mysql" ]; then
    DB_NAME="MySQL"
elif [ "$DB_VENDOR" == "mariadb" ]; then
    DB_NAME="MariaDB"    
else
    DB_NAME="embedded H2"
fi

# Append '?' in the beggining of the string if JDBC_PARAMS value isn't empty
export JDBC_PARAMS=$(echo ${JDBC_PARAMS} | sed '/^$/! s/^/?/')


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
