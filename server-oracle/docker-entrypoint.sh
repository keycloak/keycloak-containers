#!/bin/bash

######################################
# Verify Oracle JDBC driver presence #
######################################

ORACLE_DRIVER_LOCATION="/opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main/ojdbc8.jar"
if [ ! -f ${ORACLE_DRIVER_LOCATION} ]; then
    printf "ERROR: Please provide Oracle JDBC driver! you can use the jdbc-driver-downloader.sh script to download the driver. Next, provide a Docker volue for the driver file on location: %s \n" "${ORACLE_DRIVER_LOCATION}" >&2;
    exit 1
fi

##################
# Add admin user #
##################

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

############
# DB setup #
############

# Lower case DB_VENDOR
DB_VENDOR=`echo $DB_VENDOR | tr A-Z a-z`

# Detect DB vendor from default host names
if [ "$DB_VENDOR" == "" ]; then
    if (getent hosts oracle &>/dev/null); then
        export DB_VENDOR="oracle"
    fi
fi

# Set DB name
if [ "$DB_VENDOR" == "oracle" ]; then
    DB_NAME="Oracle"
else
    printf "ERROR: Unknown DB vendor %s\n" ${DB_VENDOR} >&2;
    exit 1
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

##################
# Start Keycloak #
##################

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?
