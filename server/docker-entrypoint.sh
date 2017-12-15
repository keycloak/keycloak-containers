#!/bin/bash

if [ $KEYCLOAK_USER ] && [ $KEYCLOAK_PASSWORD ]; then
    keycloak/bin/add-user-keycloak.sh --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD
fi

if [ "$DB_VENDOR" == "POSTGRES" ]; then
  databaseToInstall="postgres"
elif [ "$DB_VENDOR" == "MYSQL" ]; then
  databaseToInstall="mysql"
elif [ "$DB_VENDOR" == "H2" ]; then
  databaseToInstall=""
else
    if (printenv | grep '^POSTGRES_' &>/dev/null); then
      databaseToInstall="postgres"
    elif (printenv | grep '^MYSQL_' &>/dev/null); then
      databaseToInstall="mysql"
    fi
fi

if [ "$databaseToInstall" != "" ]; then
    echo "[KEYCLOAK DOCKER IMAGE] Using the external $databaseToInstall database"
    /bin/sh /opt/jboss/keycloak/bin/change-database.sh $databaseToInstall
else
    echo "[KEYCLOAK DOCKER IMAGE] Using the embedded H2 database"
fi

if [ "$JGROUPS_SETUP" != "" ]; then
    echo "[KEYCLOAK DOCKER IMAGE] Using non-default JGroups setup $JGROUPS_SETUP"
    /bin/sh /opt/jboss/keycloak/bin/change-jgroups.sh $JGROUPS_SETUP $databaseToInstall
fi

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?
