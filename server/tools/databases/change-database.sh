#!/bin/bash -e

DB_VENDOR=$1

cd /opt/jboss/keycloak

if [[ "$DB_VENDOR" == "oracle" && -n ${DB_SERVICE_NAME:-} ]]; then
    bin/jboss-cli.sh --file=/opt/jboss/tools/cli/databases/oracle/standalone-configuration.service_name.cli
    bin/jboss-cli.sh --file=/opt/jboss/tools/cli/databases/oracle/standalone-ha-configuration.service_name.cli
else
    bin/jboss-cli.sh --file=/opt/jboss/tools/cli/databases/$DB_VENDOR/standalone-configuration.cli
    bin/jboss-cli.sh --file=/opt/jboss/tools/cli/databases/$DB_VENDOR/standalone-ha-configuration.cli
fi

rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history
rm -rf standalone/configuration/standalone_xml_history/current/*
